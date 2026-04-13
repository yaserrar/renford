import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import { CreateEvaluationSchema, EvaluationParamsSchema } from './evaluations.schema';

/**
 * POST /etablissement/missions-renford/:missionRenfordId/evaluation
 * L'établissement note un renford après la fin d'une mission.
 */
export const createEvaluation = async (
  req: Request<EvaluationParamsSchema, unknown, CreateEvaluationSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { missionRenfordId } = req.params;
    const { note, commentaire } = req.body;

    // Vérifier que le missionRenford existe et appartient bien à cet établissement
    const missionRenford = await prisma.missionRenford.findUnique({
      where: { id: missionRenfordId },
      include: {
        mission: {
          include: {
            etablissement: {
              include: {
                profilEtablissement: { select: { utilisateurId: true } },
              },
            },
          },
        },
        evaluation: { select: { id: true } },
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission renford non trouvée' });
    }

    // Vérifier que l'utilisateur est bien l'établissement propriétaire
    if (missionRenford.mission.etablissement.profilEtablissement?.utilisateurId !== userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Vérifier que la mission ET le missionRenford sont terminés
    if (missionRenford.statut !== 'mission_terminee') {
      return res.status(400).json({
        message: 'Vous ne pouvez noter un renford que lorsque sa mission est terminée',
      });
    }

    if (
      missionRenford.mission.statut !== 'mission_terminee' &&
      missionRenford.mission.statut !== 'archivee'
    ) {
      return res.status(400).json({
        message: 'Vous ne pouvez noter un renford que lorsque la mission est terminée',
      });
    }

    // Vérifier qu'il n'y a pas déjà une évaluation
    if (missionRenford.evaluation) {
      return res.status(409).json({ message: 'Ce renford a déjà été évalué pour cette mission' });
    }

    const evaluation = await prisma.evaluationRenford.create({
      data: {
        missionRenfordId,
        note,
        commentaire: commentaire?.trim() || null,
      },
    });

    // Mettre à jour la note moyenne du profil renford
    await updateRenfordAverageRating(missionRenford.profilRenfordId);

    return res.status(201).json(evaluation);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /etablissement/missions-renford/:missionRenfordId/evaluation
 */
export const getEvaluation = async (
  req: Request<EvaluationParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { missionRenfordId } = req.params;

    const evaluation = await prisma.evaluationRenford.findUnique({
      where: { missionRenfordId },
    });

    if (!evaluation) {
      return res.status(404).json({ message: 'Aucune évaluation trouvée' });
    }

    return res.json(evaluation);
  } catch (err) {
    return next(err);
  }
};

/**
 * Recalcule la note moyenne d'un profil renford
 */
async function updateRenfordAverageRating(profilRenfordId: string) {
  const result = await prisma.evaluationRenford.aggregate({
    where: {
      missionRenford: {
        profilRenfordId,
      },
    },
    _avg: { note: true },
  });

  await prisma.profilRenford.update({
    where: { id: profilRenfordId },
    data: {
      noteMoyenne: result._avg.note ?? null,
    },
  });
}
