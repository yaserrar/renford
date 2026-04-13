import cron from 'node-cron';
import { logger } from '../config/logger';
import { syncMissionMatchesForOpenMissions } from './missions-matching';
import { sendIncompleteRenfordProfileReminders } from './profile-reminders';

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

  // Daily reminder for Renfords with incomplete onboarding profile.
  cron.schedule('0 9 * * *', async () => {
    logger.info('Starting daily incomplete Renford profile reminder job');

    const result = await sendIncompleteRenfordProfileReminders();

    logger.info(
      {
        candidates: result.candidates,
        sent: result.sent,
        failed: result.failed,
      },
      'Daily incomplete Renford profile reminder job completed',
    );
  });

  logger.info('Scheduler initialized with the following jobs:');
  logger.info('- mission-matching: every 5 minutes');
  logger.info('- incomplete-renford-profile-reminder: every day at 09:00');
}
