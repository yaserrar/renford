import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { firebaseAuth } from '../../config/firebase';
import { env } from '../../config/env';
import { JWT_EXPIRES_IN } from '../../config/consts';
import { z } from 'zod';

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Le token Google est requis'),
});

type GoogleAuthBody = z.infer<typeof googleAuthSchema>;

/**
 * POST /auth/google
 *
 * Accepts a Firebase ID token from the frontend (obtained after Google Sign-In).
 * - If the email already exists → logs the user in and links the Firebase UID
 * - If the email is new → creates a new account (email-verified, onboarding status)
 *
 * Also syncs existing email/password users into Firebase Auth when they first use Google sign-in
 * with the same email.
 */
export const googleAuth = async (
  req: Request<unknown, unknown, GoogleAuthBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { idToken } = req.body;

    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email, name, picture, email_verified } = decodedToken;

    if (!email) {
      return res
        .status(400)
        .json({ message: "L'email est requis pour l'authentification Google." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if this Firebase UID is already linked to a user
    const existingFirebaseLink = await prisma.firebaseAuthInfo.findUnique({
      where: { uid },
      include: {
        utilisateur: {
          include: {
            profilEtablissement: true,
            profilRenford: true,
          },
        },
      },
    });

    if (existingFirebaseLink) {
      // User already linked — just log them in
      const utilisateur = existingFirebaseLink.utilisateur;

      if (utilisateur.statut === 'suspendu') {
        return res.status(403).json({
          message: 'Votre compte est suspendu. Veuillez contacter le support.',
        });
      }

      // Update last connection + firebase info
      await prisma.$transaction([
        prisma.utilisateur.update({
          where: { id: utilisateur.id },
          data: { derniereConnexion: new Date() },
        }),
        prisma.firebaseAuthInfo.update({
          where: { uid },
          data: {
            signInTime: new Date(),
            picture: picture || undefined,
          },
        }),
      ]);

      const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.json(buildResponse(token, utilisateur));
    }

    // Check if a user with this email already exists (email/password user)
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: normalizedEmail },
      include: {
        profilEtablissement: true,
        profilRenford: true,
      },
    });

    if (existingUser) {
      // Link the existing user to Firebase
      await prisma.$transaction([
        prisma.firebaseAuthInfo.create({
          data: {
            utilisateurId: existingUser.id,
            uid,
            emailVerified: email_verified ?? true,
            picture: picture || null,
            provider: 'google',
            signInTime: new Date(),
          },
        }),
        prisma.utilisateur.update({
          where: { id: existingUser.id },
          data: {
            derniereConnexion: new Date(),
            // If user hasn't verified email yet, mark as verified (Google already verified it)
            ...(existingUser.emailVerifie
              ? {}
              : {
                  emailVerifie: true,
                  emailVerifieA: new Date(),
                  // If they were waiting for verification, move them to onboarding
                  ...(existingUser.statut === 'en_attente_verification'
                    ? { statut: 'onboarding' as const }
                    : {}),
                }),
          },
        }),
      ]);

      // Try to create the user in Firebase Auth as well (for password sync)
      await syncUserToFirebase(normalizedEmail);

      if (existingUser.statut === 'suspendu') {
        return res.status(403).json({
          message: 'Votre compte est suspendu. Veuillez contacter le support.',
        });
      }

      const token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        env.JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        },
      );

      // Refresh user data to reflect updates
      const updatedUser = await prisma.utilisateur.findUnique({
        where: { id: existingUser.id },
        include: { profilEtablissement: true, profilRenford: true },
      });

      return res.json(buildResponse(token, updatedUser!));
    }

    // New user — create account
    const [firstName, ...lastParts] = (name || '').split(' ');
    const lastName = lastParts.join(' ');

    const utilisateur = await prisma.utilisateur.create({
      data: {
        email: normalizedEmail,
        motDePasse: null, // Google-only user, no password
        typeUtilisateur: 'renford', // Default, will be changed during onboarding
        nom: lastName || '',
        prenom: firstName || '',
        statut: 'onboarding', // Skip email verification (Google already verified)
        emailVerifie: true,
        emailVerifieA: new Date(),
        firebaseAuth: {
          create: {
            uid,
            emailVerified: email_verified ?? true,
            picture: picture || null,
            provider: 'google',
            signInTime: new Date(),
          },
        },
      },
      include: {
        profilEtablissement: true,
        profilRenford: true,
      },
    });

    const token = jwt.sign({ userId: utilisateur.id, email: utilisateur.email }, env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json(buildResponse(token, utilisateur));
  } catch (error: unknown) {
    // Handle Firebase token verification errors
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Le token Google a expiré. Veuillez réessayer.' });
    }
    if (
      firebaseError.code === 'auth/argument-error' ||
      firebaseError.code === 'auth/id-token-revoked'
    ) {
      return res.status(401).json({ message: 'Token Google invalide.' });
    }
    return next(error);
  }
};

function buildResponse(token: string, utilisateur: Record<string, unknown>) {
  const response: Record<string, unknown> = {
    token,
    utilisateur: {
      id: utilisateur.id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      typeUtilisateur: utilisateur.typeUtilisateur,
      statut: utilisateur.statut,
      emailVerifie: utilisateur.emailVerifie,
    },
  };

  if (utilisateur.typeUtilisateur === 'etablissement' && utilisateur.profilEtablissement) {
    response.profilEtablissement = utilisateur.profilEtablissement;
  }

  if (utilisateur.typeUtilisateur === 'renford' && utilisateur.profilRenford) {
    response.profilRenford = utilisateur.profilRenford;
  }

  return response;
}

/**
 * Syncs an existing email/password user to Firebase Auth.
 * This allows Firebase to manage both Google and email/password users.
 * If the user already exists in Firebase (e.g. same email via Google), we just link them.
 */
async function syncUserToFirebase(email: string): Promise<void> {
  try {
    // Check if this email already exists in Firebase Auth
    try {
      await firebaseAuth.getUserByEmail(email);
      // User already exists in Firebase — nothing to do
      return;
    } catch (err: unknown) {
      if ((err as { code?: string }).code !== 'auth/user-not-found') throw err;
    }

    // Create the user in Firebase Auth (without password — we can't reverse the hash)
    await firebaseAuth.createUser({
      email,
      emailVerified: true,
    });
  } catch {
    // Non-critical: if Firebase sync fails, the user can still log in with email/password
  }
}
