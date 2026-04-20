import cron from 'node-cron';
import { logger } from '../config/logger';
import { syncMissionMatchesForOpenMissions } from './missions-matching';
import { sendIncompleteRenfordProfileReminders } from './profile-reminders';
import { sendMissionJ1Reminders, sendMission72hReminders } from './mission-reminders';

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

  // Daily J-1 mission reminder (missions starting tomorrow)
  cron.schedule('0 9 * * *', async () => {
    logger.info('Starting daily mission J-1 reminder job');

    const result = await sendMissionJ1Reminders();

    logger.info(
      { processed: result.processed, sent: result.sent, failed: result.failed },
      'Daily mission J-1 reminder job completed',
    );
  });

  // Daily 72h mission reminder (missions starting in 3 days)
  cron.schedule('0 9 * * *', async () => {
    logger.info('Starting daily mission 72h reminder job');

    const result = await sendMission72hReminders();

    logger.info(
      { processed: result.processed, sent: result.sent, failed: result.failed },
      'Daily mission 72h reminder job completed',
    );
  });

  logger.info('Scheduler initialized with the following jobs:');
  logger.info('- mission-matching: every 5 minutes');
  logger.info('- incomplete-renford-profile-reminder: every day at 09:00');
  logger.info('- mission-j1-reminder: every day at 09:00');
  logger.info('- mission-72h-reminder: every day at 09:00');
}
