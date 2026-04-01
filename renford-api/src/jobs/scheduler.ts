import cron from 'node-cron';
import { logger } from '../config/logger';
import { syncMissionMatchesForOpenMissions } from './missions-matching';

/**
 * Initialize all scheduled jobs/cron tasks
 */
export function initScheduler(): void {
  logger.info('Initializing scheduler...');
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting each 5 minutes mission matching job');

    const result = await syncMissionMatchesForOpenMissions();

    logger.info(
      {
        processedMissions: result.processedMissions,
        matchedMissions: result.matchedMissions,
        failedMissionIds: result.failedMissionIds,
      },
      '5 minutes mission matching job completed',
    );
  });

  logger.info('Scheduler initialized with the following jobs:');
  logger.info('- mission-matching: every 5 minutes');
}
