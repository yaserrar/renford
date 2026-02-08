import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';

/**
 * POST /dev/reset-onboarding
 * Supprime le profil (établissement ou renford) et remet l'utilisateur à l'étape 0
 */
export const devResetOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { typeUtilisateur: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await prisma.profilEtablissement.deleteMany({
      where: { utilisateurId: userId },
    });
    await prisma.profilRenford.deleteMany({
      where: { utilisateurId: userId },
    });

    // Remettre à l'étape 0 et le statut onboarding
    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 0,
        statut: 'onboarding',
        typeUtilisateur: 'etablissement', // reset par défaut
      },
    });

    return res.json({
      message: 'Onboarding réinitialisé (profil supprimé, étape 0)',
      etapeOnboarding: updatedUser.etapeOnboarding,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /dev/reset-to-step-three
 * Remet l'utilisateur à l'étape 3 (début du profil sélectionné) sans supprimer le profil
 */
export const devResetToStepThree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: {
        etapeOnboarding: 2,
        statut: 'onboarding',
      },
    });

    return res.json({
      message: "Onboarding remis à l'étape 3 (étape profil)",
      etapeOnboarding: updatedUser.etapeOnboarding,
    });
  } catch (err) {
    return next(err);
  }
};
