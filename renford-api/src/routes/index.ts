import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import accountVerificationRouter from '../modules/account-verification/account-verification.route';
import uploadsRouter from '../modules/uploads/upload.route';
import userRouter from '../modules/utilisateur/utilisateur.route';
import onboardingRouter from '../modules/onboarding/onboarding.route';

const router = Router();

//----------------------------------------------------------
router.use('/', authRouter);
router.use('/account-verification', accountVerificationRouter);
router.use('/utilisateur', userRouter);
router.use('/upload', uploadsRouter);
router.use('/onboarding', onboardingRouter);
//----------------------------------------------------------

export default router;
