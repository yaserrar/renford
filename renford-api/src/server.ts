import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
// import { initSocket } from './socket';
import { initScheduler } from './jobs/scheduler';

const port = env.PORT;

const server = createServer(app);
// Initialize socket.io on the same HTTP server
// initSocket(server);

// Initialize scheduled jobs
initScheduler();

server.listen(port, () => {
  logger.info(`CAP'Lecture Maroc API listening on http://localhost:${port}`);
});

export default server;
