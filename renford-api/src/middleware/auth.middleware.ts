import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { TypeUtilisateur, StatutCompte } from '@prisma/client';
import { env } from '../config/env';

const JWT_SECRET = env.JWT_SECRET;

declare module 'express-serve-static-core' {
  namespace Express {
    interface Request {
      userId: string;
      utilisateur?: {
        id: string;
        email: string;
        typeUtilisateur: TypeUtilisateur;
        nom: string;
        prenom: string;
        statutCompte: StatutCompte;
        emailVerifie: boolean;
      };
    }
  }
}

// Middleware d'authentification avec contrôle de type d'utilisateur optionnel
// Si allowedTypes est spécifié, l'utilisateur doit avoir l'un de ces types
export const authenticateToken = (allowedTypes?: TypeUtilisateur[]) => {
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
          typeUtilisateur: true,
          nom: true,
          prenom: true,
          statutCompte: true,
          emailVerifie: true,
        },
      });

      if (!utilisateur) {
        return res.status(401).json({
          message: 'Utilisateur non trouvé',
        });
      }

      // Vérifier le statut du compte
      if (utilisateur.statutCompte === 'suspendu') {
        return res.status(403).json({
          message: 'Votre compte est suspendu. Veuillez contacter le support.',
        });
      }

      if (utilisateur.statutCompte === 'banni') {
        return res.status(403).json({
          message: 'Votre compte a été banni.',
        });
      }

      if (utilisateur.statutCompte === 'desactive') {
        return res.status(403).json({
          message: 'Votre compte est désactivé. Veuillez contacter le support pour le réactiver.',
        });
      }

      // Vérifier le type d'utilisateur si spécifié
      if (allowedTypes && allowedTypes.length > 0) {
        if (!allowedTypes.includes(utilisateur.typeUtilisateur)) {
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
        typeUtilisateur: utilisateur.typeUtilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        statutCompte: utilisateur.statutCompte,
        emailVerifie: utilisateur.emailVerifie,
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

// Middleware pour vérifier que l'email est vérifié
export const requireVerifiedEmail = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié',
      });
    }

    if (!req.utilisateur.emailVerifie) {
      return res.status(403).json({
        message: 'Veuillez vérifier votre email avant de continuer.',
      });
    }

    next();
  };
};

// Middleware pour vérifier que le compte est actif
export const requireActiveAccount = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié',
      });
    }

    if (req.utilisateur.statutCompte !== 'actif') {
      return res.status(403).json({
        message: 'Votre compte doit être actif pour effectuer cette action.',
      });
    }

    next();
  };
};
