import 'dotenv/config';

import {
  diagnoseOdooSmsConnection,
  getOdooSmsPublicConfig,
  isOdooSmsEnabled,
  sendSmsViaOdoo,
} from '../src/config/odoo-sms';
import { normalizePhoneNumber } from '../src/lib/sms-equivalent';

const getArgValue = (flag: string) => {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
};

const hasFlag = (flag: string) => process.argv.includes(flag);

const printUsageAndExit = (exitCode = 1) => {
  console.error(
    'Usage: npx tsx scripts/test-odoo-sms.ts --phone +3344894884 [--message "Your text"] [--debug] [--diagnose-only]',
  );
  process.exit(exitCode);
};

const printDiagnostics = async () => {
  const diagnostics = await diagnoseOdooSmsConnection();

  console.error('\nOdoo SMS diagnostics:');
  console.error(JSON.stringify(diagnostics, null, 2));
  console.error('\nCurrent public SMS config:');
  console.error(JSON.stringify(getOdooSmsPublicConfig(), null, 2));
};

const main = async () => {
  const debugMode = hasFlag('--debug');
  const diagnoseOnly = hasFlag('--diagnose-only');

  if (diagnoseOnly) {
    await printDiagnostics();
    return;
  }

  const rawPhone = getArgValue('--phone');
  if (!rawPhone) {
    printUsageAndExit();
  }

  const normalizedPhone = normalizePhoneNumber(rawPhone);
  if (!normalizedPhone) {
    console.error('Invalid phone number passed to --phone');
    process.exit(1);
  }

  if (!isOdooSmsEnabled()) {
    console.error('ODOO_SMS_ENABLED is false. Set ODOO_SMS_ENABLED=true in renford-api/.env');
    process.exit(1);
  }

  const message =
    getArgValue('--message') ||
    `Renford SMS test sent at ${new Date().toISOString()} to ${normalizedPhone}`;

  await sendSmsViaOdoo({
    to: normalizedPhone,
    message,
    metadata: {
      source: 'manual-test-script',
    },
  });

  console.warn(`SMS sent successfully to ${normalizedPhone}`);

  if (debugMode) {
    await printDiagnostics();
  }
};

main().catch(async (error) => {
  console.error('Failed to send Odoo SMS test:', error);

  try {
    await printDiagnostics();
  } catch (diagnosticError) {
    console.error('Failed to run diagnostics:', diagnosticError);
  }

  process.exit(1);
});
