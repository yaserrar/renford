import { firebaseAuth } from '../../config/firebase';
import prisma from '../../config/prisma';
import { logger } from '../../config/logger';

/**
 * Syncs an email/password user to Firebase Auth.
 * Creates the user in Firebase if they don't already exist there,
 * and stores the Firebase UID in our DB (FirebaseAuthInfo table).
 *
 * This is non-blocking — failures are logged but don't affect the main auth flow.
 */
export async function syncEmailPasswordUserToFirebase(
  utilisateurId: string,
  email: string,
  plainPassword: string,
): Promise<void> {
  try {
    // Check if we already have a Firebase link for this user
    const existingLink = await prisma.firebaseAuthInfo.findUnique({
      where: { utilisateurId },
    });
    if (existingLink) return; // Already synced

    let firebaseUid: string;

    // Check if this email already exists in Firebase Auth
    try {
      const existingFirebaseUser = await firebaseAuth.getUserByEmail(email);
      firebaseUid = existingFirebaseUser.uid;
    } catch (err: unknown) {
      if ((err as { code?: string }).code !== 'auth/user-not-found') {
        throw err;
      }

      // Create the user in Firebase Auth with email + password
      const newFirebaseUser = await firebaseAuth.createUser({
        email,
        password: plainPassword,
        emailVerified: false,
      });
      firebaseUid = newFirebaseUser.uid;
    }

    // Store the Firebase UID in our DB
    await prisma.firebaseAuthInfo.create({
      data: {
        utilisateurId,
        uid: firebaseUid,
        provider: 'password',
        emailVerified: false,
      },
    });
  } catch (err) {
    logger.error(err, `Failed to sync user ${utilisateurId} to Firebase`);
  }
}

/**
 * Updates the password of an existing Firebase user.
 * Called when a user resets their password so Firebase stays in sync.
 */
export async function updateFirebasePassword(
  utilisateurId: string,
  newPlainPassword: string,
): Promise<void> {
  try {
    const firebaseLink = await prisma.firebaseAuthInfo.findUnique({
      where: { utilisateurId },
    });
    if (!firebaseLink) return;

    await firebaseAuth.updateUser(firebaseLink.uid, {
      password: newPlainPassword,
    });
  } catch (err) {
    logger.error(err, `Failed to update Firebase password for user ${utilisateurId}`);
  }
}
