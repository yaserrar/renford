import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { RoleUtilisateur } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rôles autorisés pour l'authentification dashboard (pas les élèves)
const ALLOWED_DASHBOARD_ROLES: RoleUtilisateur[] = [
  'admin',
  'coordinateur_national',
  'coordinateur_regional',
  'coordinateur_provincial',
  'superviseur',
];

declare module 'express-serve-static-core' {
  namespace Express {
    interface Request {
      userId: string;
      utilisateur?: {
        id: string;
        email: string;
        role: RoleUtilisateur;
        nom: string;
        prenom: string;
        regionId: string | null;
        provinceId: string | null;
        etablissementId: string | null;
      };
    }
  }
}

// Middleware d'authentification avec contrôle de rôle optionnel
// Si allowedRoles est spécifié, l'utilisateur doit avoir l'un de ces rôles
export const authenticateToken = (allowedRoles?: RoleUtilisateur[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          message: "Token d'authentification manquant",
        });
      }
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          message: "Token d'authentification manquant",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

      // Verify user still exists
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          nom: true,
          prenom: true,
          statut: true,
          regionId: true,
          provinceId: true,
          etablissementId: true,
        },
      });

      if (!utilisateur) {
        return res.status(401).json({
          message: 'Utilisateur non trouvé',
        });
      }

      // Vérifier que le rôle est autorisé pour le dashboard (pas les élèves)
      if (!ALLOWED_DASHBOARD_ROLES.includes(utilisateur.role)) {
        return res.status(403).json({
          message:
            'Accès refusé. Cette plateforme est réservée aux administrateurs et coordinateurs.',
        });
      }

      // Vérifier que l'utilisateur a les relations nécessaires selon son rôle
      const hasValidProfile = (() => {
        switch (utilisateur.role) {
          case 'admin':
          case 'coordinateur_national':
            return true; // Pas besoin de relation géographique
          case 'coordinateur_regional':
            return !!utilisateur.regionId;
          case 'coordinateur_provincial':
            return !!utilisateur.provinceId;
          case 'superviseur':
            return !!utilisateur.etablissementId;
          default:
            return false;
        }
      })();

      if (!hasValidProfile) {
        return res.status(403).json({
          message: 'Compte incomplet. Profil non configuré. Veuillez contacter un administrateur.',
        });
      }

      // Vérifier le statut du compte
      if (utilisateur.statut !== 'actif') {
        return res.status(403).json({
          message: 'Compte inactif ou suspendu. Veuillez contacter un administrateur.',
        });
      }

      // Vérifier le rôle spécifique si spécifié
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(utilisateur.role)) {
          return res.status(403).json({
            message: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
          });
        }
      }

      // Add user to request object
      req.userId = utilisateur.id;
      req.utilisateur = {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        regionId: utilisateur.regionId,
        provinceId: utilisateur.provinceId,
        etablissementId: utilisateur.etablissementId,
      };
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          message: "Token d'accès invalide",
        });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: "Token d'accès expiré",
        });
      }
      return next(error);
    }
  };
};
