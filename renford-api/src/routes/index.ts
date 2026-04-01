import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import accountVerificationRouter from '../modules/account-verification/account-verification.route';
import uploadsRouter from '../modules/uploads/upload.route';
import userRouter from '../modules/utilisateur/utilisateur.route';
import onboardingRouter from '../modules/onboarding/onboarding.route';
import devRouter from '../modules/dev/dev.route';
import profilRenfordRouter from '../modules/profil-renford/profil-renford.route';
import profilEtablissementRouter from '../modules/profil-etablissement/profil-etablissement.route';
import missionsRouter from '../modules/missions/missions.route';
import missionsRenfordRouter from '../modules/missions-renford/missions-renford.route';
import favorisRenfordRouter from '../modules/favoris-renford/favoris-renford.route';
import accueilRouter from '../modules/accueil/accueil.route';
import parrainageRouter from '../modules/parrainage/parrainage.route';
import planningRouter from '../modules/planning/planning.route';

const router = Router();

//----------------------------------------------------------
router.use('', authRouter);
router.use('/account-verification', accountVerificationRouter);
router.use('/utilisateur', userRouter);
router.use('/onboarding', onboardingRouter);
router.use('/profil-renford', profilRenfordRouter);
router.use('/profil-etablissement', profilEtablissementRouter);
router.use('/', missionsRouter);
router.use('/', missionsRenfordRouter);
router.use('/', favorisRenfordRouter);
router.use('/', accueilRouter);
router.use('/', parrainageRouter);
router.use('/', planningRouter);

router.use('/upload', uploadsRouter);

router.use('/dev', devRouter);
//----------------------------------------------------------

export default router;
