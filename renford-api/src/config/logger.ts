import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty', // pretty print logs
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      singleLine: true,
      ignore: 'pid,hostname',
    },
  },
  level: 'info', // set minimum log level
});
