import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './upload.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken());

const upload = multer({ storage: multer.memoryStorage() });

// @ts-ignore
router.post('/', upload.single('file'), uploadController);

export default router;
