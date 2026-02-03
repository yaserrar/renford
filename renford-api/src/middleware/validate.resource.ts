import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodTypeAny, type ZodIssue } from 'zod';
import { logger } from '../config/logger.js';

type RequestSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

// validateResource can take either:
// - a single Zod schema (assumed to validate req.body), or
// - an object with optional body/query/params schemas to validate each accordingly.
export const validateResource =
  (schemas: RequestSchemas | ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const toValidate: RequestSchemas =
      typeof (schemas as any)?.parse === 'function'
        ? { body: schemas as ZodTypeAny }
        : (schemas as RequestSchemas);

    const messages: string[] = [];
    const validated: { body?: unknown; query?: unknown; params?: unknown } = {};

    if (toValidate.body) {
      try {
        const data = toValidate.body.parse(req.body);
        validated.body = data;
      } catch (err) {
        if (err instanceof ZodError) {
          // Remove the console.log to prevent stack trace spam
          logger.error({ body: req.body }, 'Validation failed');
          messages.push(
            ...err.issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`),
          );
        } else {
          messages.push('Invalid request body');
        }
      }
    }

    if (toValidate.query) {
      try {
        const data = toValidate.query.parse(req.query);
        validated.query = data as any;
      } catch (err) {
        if (err instanceof ZodError) {
          messages.push(
            ...err.issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`),
          );
        } else {
          messages.push('Invalid request query');
        }
      }
    }

    if (toValidate.params) {
      try {
        const data = toValidate.params.parse(req.params);
        validated.params = data as any;
      } catch (err) {
        if (err instanceof ZodError) {
          messages.push(
            ...err.issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`),
          );
        } else {
          messages.push('Invalid route params');
        }
      }
    }

    if (messages.length > 0) {
      const message = Array.from(new Set(messages)).join(', ');
      logger.error({ methd: req.method, path: req.path, errors: messages }, 'Validation failed');
      return res.status(400).json({
        message: 'Une erreur est survenue lors de la validation des données',
        errors: message,
      });
    }

    // Attach validated data for downstream handlers
    (res.locals as any).validated = validated;

    next();
  };
