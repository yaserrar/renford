import { logger } from '../config/logger';

/**
 * Initialize all scheduled jobs/cron tasks
 */
export function initScheduler(): void {
  logger.info('Initializing scheduler...');
  logger.info('Scheduler initialized with the following jobs:');
}
