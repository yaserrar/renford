import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, 'Unhandled error');
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ message });
}
