import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import routes from './routes/index';

// const __dirname = path.resolve();

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100000,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(
  pinoHttp({
    logger,
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
    },

    autoLogging: true,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    customSuccessMessage: function (req, res) {
      return `${req.method} ${req.originalUrl} -> ${res.statusCode}`;
    },
    customErrorMessage: function (req, res) {
      return `${req.method} ${req.originalUrl} -> ${res.statusCode}`;
    },
    serializers: {
      req: () => ({}),
      res: () => ({}),
    },
  }),
);

if (env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
