import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import accountVerificationRouter from '../modules/account-verification/account-verification.route';
import uploadsRouter from '../modules/uploads/upload.route';
import userRouter from '../modules/utilisateur/utilisateur.route';
import onboardingRouter from '../modules/onboarding/onboarding.route';
import devRouter from '../modules/dev/dev.route';
import profilRenfordRouter from '../modules/profil-renford/profil-renford.route';
import profilEtablissementRouter from '../modules/profil-etablissement/profil-etablissement.route';

const router = Router();

//----------------------------------------------------------
router.use('/', authRouter);
router.use('/account-verification', accountVerificationRouter);
router.use('/utilisateur', userRouter);
router.use('/upload', uploadsRouter);
router.use('/onboarding', onboardingRouter);
router.use('/dev', devRouter);
router.use('/profil-renford', profilRenfordRouter);
router.use('/profil-etablissement', profilEtablissementRouter);
//----------------------------------------------------------

export default router;
