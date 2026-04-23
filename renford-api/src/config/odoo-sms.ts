import { logger } from './logger';

type SendSmsInput = {
  to: string;
  message: string;
  metadata?: Record<string, unknown>;
};

type OdooSmsConfig = {
  enabled: boolean;
  sender?: string;
  endpoint?: string;
  apiKey?: string;
  baseUrl?: string;
  db?: string;
  username?: string;
  password?: string;
  model: string;
  method: string;
};

const parseBoolean = (value: string | undefined, defaultValue = false) => {
  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

const getOdooSmsConfig = (): OdooSmsConfig => ({
  enabled: parseBoolean(process.env.ODOO_SMS_ENABLED, false),
  sender: process.env.ODOO_SMS_SENDER,
  endpoint: process.env.ODOO_SMS_ENDPOINT,
  apiKey: process.env.ODOO_SMS_API_KEY,
  baseUrl: process.env.ODOO_BASE_URL,
  db: process.env.ODOO_DB,
  username: process.env.ODOO_USERNAME,
  password: process.env.ODOO_PASSWORD,
  model: process.env.ODOO_SMS_MODEL || 'sms.api',
  method: process.env.ODOO_SMS_METHOD || 'send_sms',
});

const callOdooJsonRpc = async (baseUrl: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${baseUrl}/jsonrpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Odoo JSON-RPC call failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<{ result?: unknown; error?: { message?: string } }>;
};

const sendViaConfiguredEndpoint = async (config: OdooSmsConfig, payload: SendSmsInput) => {
  const response = await fetch(config.endpoint as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      to: payload.to,
      message: payload.message,
      sender: config.sender,
      metadata: payload.metadata,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Odoo SMS endpoint failed (${response.status}): ${body}`);
  }
};

const sendViaOdooJsonRpc = async (config: OdooSmsConfig, payload: SendSmsInput) => {
  if (!config.baseUrl || !config.db || !config.username || !config.password) {
    throw new Error('Missing ODOO_BASE_URL / ODOO_DB / ODOO_USERNAME / ODOO_PASSWORD');
  }

  const authResponse = await callOdooJsonRpc(config.baseUrl, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'authenticate',
      args: [config.db, config.username, config.password, {}],
    },
    id: Date.now(),
  });

  if (authResponse.error) {
    throw new Error(authResponse.error.message || 'Odoo authentication failed');
  }

  const uid = Number(authResponse.result);

  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error('Odoo authentication returned an invalid user id');
  }

  const executeResponse = await callOdooJsonRpc(config.baseUrl, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        config.db,
        uid,
        config.password,
        config.model,
        config.method,
        [payload.to, payload.message],
        {
          to: payload.to,
          phone: payload.to,
          mobile: payload.to,
          number: payload.to,
          body: payload.message,
          message: payload.message,
          sender: config.sender,
          metadata: payload.metadata,
        },
      ],
    },
    id: Date.now() + 1,
  });

  if (executeResponse.error) {
    throw new Error(executeResponse.error.message || 'Odoo SMS execute_kw failed');
  }
};

export const isOdooSmsEnabled = () => getOdooSmsConfig().enabled;

export const sendSmsViaOdoo = async ({ to, message, metadata }: SendSmsInput) => {
  const config = getOdooSmsConfig();

  if (!config.enabled) {
    return;
  }

  if (!to || !message) {
    return;
  }

  if (config.endpoint) {
    await sendViaConfiguredEndpoint(config, { to, message, metadata });
    return;
  }

  await sendViaOdooJsonRpc(config, { to, message, metadata });
};

export const sendSmsViaOdooSafe = async ({ to, message, metadata }: SendSmsInput) => {
  try {
    await sendSmsViaOdoo({ to, message, metadata });
  } catch (error) {
    logger.warn(
      {
        err: error,
        to,
      },
      'Failed to send SMS via Odoo',
    );
  }
};
