import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { minioClient, MINIO_BUCKET } from '../../config/minio';

export const presignedUrlQuerySchema = z.object({
  chemin: z.string().min(1, 'Le chemin du fichier est requis'),
});

// Folders whose files are considered "public" (profile images, cover images, portfolio, diplomes)
const PUBLIC_FOLDERS = ['uploads/profils', 'uploads/diplomes'];

// Folders with sensitive documents requiring ownership verification
const SENSITIVE_FOLDERS = ['uploads/documents', 'uploads/signatures'];

/**
 * Determines if the requesting user has access to the file at the given path.
 *
 * Access rules:
 * 1. Admin → always allowed
 * 2. Files in "profils" folder (avatars, cover images, portfolio) → allowed for any authenticated user
 * 3. Sensitive files (documents, signatures) → must belong to the requesting user or
 *    be related to a mission they are part of
 */
export const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = presignedUrlQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0]?.message });
    }

    const { chemin } = parsed.data;
    const utilisateur = req.utilisateur!;

    // 1. Admin → always allowed
    if (utilisateur.typeUtilisateur === 'administrateur') {
      return sendPresignedUrl(res, chemin);
    }

    // 2. Public folders (profils: avatars, couvertures, portfolio)
    if (PUBLIC_FOLDERS.some((folder) => chemin.startsWith(folder))) {
      return sendPresignedUrl(res, chemin);
    }

    // 3. Sensitive folders → check ownership
    if (SENSITIVE_FOLDERS.some((folder) => chemin.startsWith(folder))) {
      const hasAccess = await checkFileOwnership(utilisateur.id, chemin);
      if (hasAccess) {
        return sendPresignedUrl(res, chemin);
      }
      return res.status(403).json({ message: 'Accès refusé à ce fichier.' });
    }

    // Unknown folder → default deny
    return res.status(403).json({ message: 'Accès refusé à ce fichier.' });
  } catch (error) {
    return next(error);
  }
};

async function sendPresignedUrl(res: Response, objectKey: string) {
  // Presigned URL valid for 15 minutes
  const url = await minioClient.presignedGetObject(MINIO_BUCKET, objectKey, 15 * 60);
  return res.json({ url });
}

/**
 * Checks if the user owns this file or has a legitimate relationship to it.
 * Searches across all models that store file paths.
 */
async function checkFileOwnership(userId: string, chemin: string): Promise<boolean> {
  // Check ProfilRenford: own profile documents
  const ownRenfordProfile = await prisma.profilRenford.findFirst({
    where: {
      utilisateurId: userId,
      OR: [
        { avatarChemin: chemin },
        { imageCouvertureChemin: chemin },
        { attestationVigilanceChemin: chemin },
        { justificatifCarteProfessionnelleChemin: chemin },
      ],
    },
  });
  if (ownRenfordProfile) return true;

  // Check ProfilEtablissement: own profile documents
  const ownEtabProfile = await prisma.profilEtablissement.findFirst({
    where: {
      utilisateurId: userId,
      OR: [{ avatarChemin: chemin }, { imageCouvertureChemin: chemin }],
    },
  });
  if (ownEtabProfile) return true;

  // Check RenfordDiplome: diploma justificatif belongs to the user
  const ownDiplome = await prisma.renfordDiplome.findFirst({
    where: {
      justificatifDiplomeChemin: chemin,
      profilRenford: { utilisateurId: userId },
    },
  });
  if (ownDiplome) return true;

  // Check SignatureContrat: user is a signatory (through the mission contrat relation)
  const ownSignature = await prisma.signatureContrat.findFirst({
    where: {
      cheminImage: chemin,
      OR: [
        {
          missionRenfordContratRenford: {
            profilRenford: { utilisateurId: userId },
          },
        },
        {
          missionRenfordContratEtablissement: {
            mission: {
              etablissement: {
                profilEtablissement: { utilisateurId: userId },
              },
            },
          },
        },
      ],
    },
  });

  if (ownSignature) return true;

  // Check if user is an etablissement and the file belongs to one of their mission's renfords
  // (so they can see renford documents for their missions)
  const etabProfile = await prisma.profilEtablissement.findUnique({
    where: { utilisateurId: userId },
    select: { id: true },
  });

  if (etabProfile) {
    // Etablissement can see any renford's diplome documents (needed when browsing profiles)
    const anyDiplome = await prisma.renfordDiplome.findFirst({
      where: { justificatifDiplomeChemin: chemin },
    });
    if (anyDiplome) return true;
  }

  // Check if the file belongs to portfolio items of any renford profile
  // whose portfolio the user is viewing (portfolios stored as String[] in profilRenford)
  const portfolioProfile = await prisma.profilRenford.findFirst({
    where: {
      portfolio: { has: chemin },
      utilisateurId: userId,
    },
  });
  if (portfolioProfile) return true;

  // Fallback: check MinIO object metadata for files uploaded but not yet persisted to the DB
  // (e.g. form still open, not submitted). We tag every upload with the uploader's userId.
  try {
    const stat = await minioClient.statObject(MINIO_BUCKET, chemin);
    const uploadedBy = stat.metaData?.['x-amz-meta-uploaded-by'] ?? stat.metaData?.['uploaded-by'];
    if (uploadedBy && uploadedBy === userId) return true;
  } catch {
    // Object doesn't exist or metadata unreadable — continue to deny
  }

  return false;
}
