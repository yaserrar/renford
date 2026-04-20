import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { ensureBucket } from './config/minio';
// import { initSocket } from './socket';
import { initScheduler } from './jobs/scheduler';

const port = env.PORT;

const server = createServer(app);
// Initialize socket.io on the same HTTP server
// initSocket(server);

// Initialize scheduled jobs
initScheduler();

// Ensure MinIO bucket exists
ensureBucket()
  .then(() => logger.info('MinIO bucket ready'))
  .catch((err) => logger.error(err, 'Failed to initialize MinIO bucket'));

server.listen(port, () => {
  logger.info(`Renford API listening on http://localhost:${port}`);
});

export default server;
