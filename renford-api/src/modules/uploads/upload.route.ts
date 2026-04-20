import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './upload.controller';
import { getPresignedUrl } from './presigned-url.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken());

const upload = multer({ storage: multer.memoryStorage() });

// @ts-ignore
router.post('/', upload.single('file'), uploadController);

// GET /api/upload/presigned-url?chemin=uploads/profils/photo.jpg
router.get('/presigned-url', getPresignedUrl);

export default router;
