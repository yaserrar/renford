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

type OdooRpcError = {
  code?: number;
  message?: string;
  data?: {
    name?: string;
    message?: string;
    exception_type?: string;
    debug?: string;
  };
};

type OdooRpcResponse<T = unknown> = {
  result?: T;
  error?: OdooRpcError;
};

type OdooSmsDiagnostics = {
  config: {
    enabled: boolean;
    mode: 'endpoint' | 'jsonrpc';
    baseUrl?: string;
    db?: string;
    username?: string;
    model: string;
    method: string;
    sender?: string;
    endpointConfigured: boolean;
  };
  version?: unknown;
  dbList?: string[];
  dbListError?: string;
  auth: {
    ok: boolean;
    uid?: number;
    error?: string;
  };
  model: {
    exists?: boolean;
    error?: string;
  };
  smsModelCandidates?: Array<{
    model?: string;
    name?: string;
  }>;
  smsModelCandidatesError?: string;
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

const formatOdooRpcError = (error?: OdooRpcError) => {
  if (!error) {
    return 'Unknown Odoo RPC error';
  }

  const parts: string[] = [];

  if (error.message) {
    parts.push(error.message);
  }

  if (error.data?.name) {
    parts.push(`name=${error.data.name}`);
  }

  if (error.data?.exception_type) {
    parts.push(`type=${error.data.exception_type}`);
  }

  if (error.data?.message) {
    parts.push(`detail=${error.data.message}`);
  }

  if (error.code !== undefined) {
    parts.push(`code=${error.code}`);
  }

  return parts.join(' | ') || 'Unknown Odoo RPC error';
};

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

  return response.json() as Promise<OdooRpcResponse>;
};

const authenticateOdoo = async (config: OdooSmsConfig) => {
  const authResponse = await callOdooJsonRpc(config.baseUrl as string, {
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
    throw new Error(`Odoo authentication failed: ${formatOdooRpcError(authResponse.error)}`);
  }

  const uid = Number(authResponse.result);

  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error('Odoo authentication returned an invalid user id');
  }

  return uid;
};

const checkModelExists = async (config: OdooSmsConfig, uid: number) => {
  const response = await callOdooJsonRpc(config.baseUrl as string, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        config.db,
        uid,
        config.password,
        'ir.model',
        'search_count',
        [[['model', '=', config.model]]],
      ],
    },
    id: Date.now() + 7,
  });

  if (response.error) {
    throw new Error(formatOdooRpcError(response.error));
  }

  return Number(response.result) > 0;
};

const listSmsModels = async (config: OdooSmsConfig, uid: number) => {
  const response = await callOdooJsonRpc(config.baseUrl as string, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        config.db,
        uid,
        config.password,
        'ir.model',
        'search_read',
        [[['model', 'ilike', 'sms']]],
        {
          fields: ['model', 'name'],
          limit: 30,
        },
      ],
    },
    id: Date.now() + 8,
  });

  if (response.error) {
    throw new Error(formatOdooRpcError(response.error));
  }

  if (!Array.isArray(response.result)) {
    return [];
  }

  return response.result.filter(
    (item): item is { model?: string; name?: string } => typeof item === 'object' && item !== null,
  );
};

export const getOdooSmsPublicConfig = () => {
  const config = getOdooSmsConfig();

  return {
    enabled: config.enabled,
    mode: config.endpoint ? ('endpoint' as const) : ('jsonrpc' as const),
    baseUrl: config.baseUrl,
    db: config.db,
    username: config.username,
    model: config.model,
    method: config.method,
    sender: config.sender,
    endpointConfigured: Boolean(config.endpoint),
  };
};

export const diagnoseOdooSmsConnection = async (): Promise<OdooSmsDiagnostics> => {
  const config = getOdooSmsConfig();

  const diagnostics: OdooSmsDiagnostics = {
    config: getOdooSmsPublicConfig(),
    auth: {
      ok: false,
    },
    model: {},
  };

  if (config.endpoint) {
    diagnostics.auth.error = 'Endpoint mode configured; JSON-RPC diagnostics skipped.';
    return diagnostics;
  }

  if (!config.baseUrl || !config.db || !config.username || !config.password) {
    diagnostics.auth.error =
      'Missing ODOO_BASE_URL / ODOO_DB / ODOO_USERNAME / ODOO_PASSWORD for JSON-RPC mode';
    return diagnostics;
  }

  const versionResponse = await callOdooJsonRpc(config.baseUrl, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'version',
      args: [],
    },
    id: Date.now() + 5,
  });

  if (!versionResponse.error) {
    diagnostics.version = versionResponse.result;
  }

  const dbListResponse = await callOdooJsonRpc(config.baseUrl, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'db',
      method: 'list',
      args: [],
    },
    id: Date.now() + 6,
  });

  if (dbListResponse.error) {
    diagnostics.dbListError = formatOdooRpcError(dbListResponse.error);
  } else if (Array.isArray(dbListResponse.result)) {
    diagnostics.dbList = dbListResponse.result.filter(
      (item): item is string => typeof item === 'string',
    );
  }

  try {
    const uid = await authenticateOdoo(config);
    diagnostics.auth = { ok: true, uid };
  } catch (error) {
    diagnostics.auth = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown authentication error',
    };
    return diagnostics;
  }

  try {
    diagnostics.model.exists = await checkModelExists(config, diagnostics.auth.uid as number);
  } catch (error) {
    diagnostics.model.error = error instanceof Error ? error.message : 'Unknown model check error';
  }

  try {
    diagnostics.smsModelCandidates = await listSmsModels(config, diagnostics.auth.uid as number);
  } catch (error) {
    diagnostics.smsModelCandidatesError =
      error instanceof Error ? error.message : 'Unknown SMS model list error';
  }

  return diagnostics;
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

const executeKw = async (
  config: OdooSmsConfig,
  uid: number,
  model: string,
  method: string,
  args: unknown[],
  kwargs?: Record<string, unknown>,
) => {
  const executeArgs: unknown[] = [config.db, uid, config.password, model, method, args];

  if (kwargs) {
    executeArgs.push(kwargs);
  }

  return callOdooJsonRpc(config.baseUrl as string, {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: executeArgs,
    },
    id: Date.now() + 1,
  });
};

const sendViaSmsSmsModel = async (config: OdooSmsConfig, uid: number, payload: SendSmsInput) => {
  const createResponse = await executeKw(config, uid, 'sms.sms', 'create', [
    {
      number: payload.to,
      body: payload.message,
    },
  ]);

  if (createResponse.error) {
    throw new Error(`Odoo sms.sms.create failed: ${formatOdooRpcError(createResponse.error)}`);
  }

  const smsId = Number(createResponse.result);

  if (!Number.isFinite(smsId) || smsId <= 0) {
    throw new Error('Odoo sms.sms.create returned an invalid id');
  }

  const runAutoSend = ['send_sms', 'auto', 'create_and_send'].includes(config.method);

  if (config.method === 'create') {
    return;
  }

  const sendMethods = runAutoSend ? ['send', '_send', 'action_send'] : [config.method];
  const sendErrors: string[] = [];

  for (const method of sendMethods) {
    const sendResponse = await executeKw(config, uid, 'sms.sms', method, [[smsId]]);

    if (!sendResponse.error) {
      return;
    }

    sendErrors.push(`${method}: ${formatOdooRpcError(sendResponse.error)}`);
  }

  throw new Error(`Odoo sms.sms send failed: ${sendErrors.join(' || ')}`);
};

const sendViaOdooJsonRpc = async (config: OdooSmsConfig, payload: SendSmsInput) => {
  if (!config.baseUrl || !config.db || !config.username || !config.password) {
    throw new Error('Missing ODOO_BASE_URL / ODOO_DB / ODOO_USERNAME / ODOO_PASSWORD');
  }

  const uid = await authenticateOdoo(config);

  if (config.model === 'sms.sms') {
    await sendViaSmsSmsModel(config, uid, payload);
    return;
  }

  const executeResponse = await executeKw(
    config,
    uid,
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
  );

  if (executeResponse.error) {
    throw new Error(
      `Odoo SMS execute_kw failed for ${config.model}.${config.method}: ${formatOdooRpcError(executeResponse.error)}`,
    );
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
