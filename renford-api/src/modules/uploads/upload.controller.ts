import { NextFunction, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

interface FileRequest extends Request {
  file: Express.Multer.File;
}

export const uploadController = async (req: FileRequest, res: Response, next: NextFunction) => {
  try {
    const uploadPath = req.body.path as string;
    const uploadName = req.body.name as string | undefined;
    const file = req.file;

    // Check if file is present
    if (!file) {
      return res.status(400).json({
        status: false,
        message: 'No file uploaded',
      });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', uploadPath);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename using UUID
    const ext = path.extname(file.originalname);
    const filename =
      uploadName && uploadName != ''
        ? `${uploadName.toLowerCase().replaceAll(' ', '-')}-${uuid().split('-')[0]}${ext}`
        : `${uuid()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to filesystem
    await fs.writeFile(filepath, file.buffer);

    // Return response
    return res.status(201).json({
      path: `uploads/${uploadPath}/${filename}`,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error uploading file',
    });
  }
};
