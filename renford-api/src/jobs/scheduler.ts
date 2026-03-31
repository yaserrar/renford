import cron from 'node-cron';
import { logger } from '../config/logger';
import { syncMissionMatchesForOpenMissions } from './missions.matching';

/**
 * Initialize all scheduled jobs/cron tasks
 */
export function initScheduler(): void {
  logger.info('Initializing scheduler...');
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting hourly mission matching job');

    const result = await syncMissionMatchesForOpenMissions();

    logger.info(
      {
        processedMissions: result.processedMissions,
        matchedMissions: result.matchedMissions,
        failedMissionIds: result.failedMissionIds,
      },
      'Hourly mission matching job completed',
    );
  });

  logger.info('Scheduler initialized with the following jobs:');
  logger.info('- mission-matching: every hour');
}
