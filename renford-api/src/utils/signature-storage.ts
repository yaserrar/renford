import { v4 as uuid } from 'uuid';
import { minioClient, MINIO_BUCKET } from '../config/minio';

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

  const filename = `${prefix}-${uuid().split('-')[0]}.${ext}`;
  const objectKey = `uploads/${folder}/${filename}`;

  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
  await minioClient.putObject(MINIO_BUCKET, objectKey, fileBuffer, fileBuffer.length, {
    'Content-Type': contentType,
  });

  return objectKey;
};
