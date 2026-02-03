import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import notificationsRouter from '../modules/notifications/notification.route';
import uploadsRouter from '../modules/uploads/upload.route';
import userRouter from '../modules/utilisateur/utilisateur.route';
import regionsRouter from '../modules/regions/region.route';
import provincesRouter from '../modules/provinces/province.route';
import etablissementsRouter from '../modules/etablissements/etablissement.route';
import coordinateursRouter from '../modules/coordinateurs/coordinateur.route';
import elevesRouter from '../modules/eleves/eleve.route';
import accueilRouter from '../modules/accueil/accueil.route';

const router = Router();

//----------------------------------------------------------
router.use('/', authRouter);
router.use('/utilisateur', userRouter);
router.use('/upload', uploadsRouter);
router.use('/notifications', notificationsRouter);
router.use('/regions', regionsRouter);
router.use('/provinces', provincesRouter);
router.use('/etablissements', etablissementsRouter);
router.use('/coordinateurs', coordinateursRouter);
router.use('/eleves', elevesRouter);
router.use('/accueil', accueilRouter);
//----------------------------------------------------------

export default router;
