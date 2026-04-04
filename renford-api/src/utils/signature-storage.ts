import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const DATA_URL_REGEX = /^data:image\/(png|jpeg|jpg);base64,(.+)$/;

export const saveSignatureDataUrl = async (
  dataUrl: string,
  folder: string,
  prefix: string,
): Promise<string> => {
  const match = dataUrl.match(DATA_URL_REGEX);
  if (!match) {
    throw new Error('INVALID_SIGNATURE_DATA_URL');
  }

  const ext = match[1] === 'png' ? 'png' : 'jpg';
  const base64Payload = match[2];
  if (!base64Payload) {
    throw new Error('INVALID_SIGNATURE_DATA_URL');
  }
  const fileBuffer = Buffer.from(base64Payload, 'base64');

  if (!fileBuffer.length) {
    throw new Error('INVALID_SIGNATURE_DATA_URL');
  }

  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${prefix}-${uuid().split('-')[0]}.${ext}`;
  const absoluteFilePath = path.join(uploadDir, filename);
  await fs.writeFile(absoluteFilePath, fileBuffer);

  return `uploads/${folder}/${filename}`;
};
