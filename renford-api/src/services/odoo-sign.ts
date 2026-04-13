import { env } from '../config/env';
import { logger } from '../config/logger';

// ─── Types ──────────────────────────────────────────────────

type OdooRpcResponse<T = unknown> = {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: { message: string; code: number; data: { message: string } };
};

export type OdooSignRequestStatus = 'shared' | 'sent' | 'signed' | 'canceled' | 'expired';

export type OdooSignRequest = {
  id: number;
  state: OdooSignRequestStatus;
  request_item_ids: number[];
  template_id: [number, string] | false;
  reference: string;
};

export type OdooSignRequestItem = {
  id: number;
  sign_request_id: [number, string];
  signer_email: string;
  state: 'sent' | 'completed' | 'refused' | 'canceled';
  signing_url?: string;
  access_token?: string;
};

// ─── Odoo JSON-RPC client ───────────────────────────────────

let uidCache: number | null = null;

const jsonRpc = async <T = unknown>(
  url: string,
  service: string,
  method: string,
  args: unknown[],
): Promise<T> => {
  const body = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'call',
    params: { service, method, args },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Odoo HTTP error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as OdooRpcResponse<T>;

  if (data.error) {
    const msg = data.error.data?.message || data.error.message;
    throw new Error(`Odoo RPC error: ${msg}`);
  }

  return data.result as T;
};

const authenticate = async (): Promise<number> => {
  if (uidCache) return uidCache;

  const uid = await jsonRpc<number>(`${env.ODOO_URL}/jsonrpc`, 'common', 'authenticate', [
    env.ODOO_DB,
    '__api_key__',
    env.ODOO_API_KEY,
    {},
  ]);

  if (!uid) throw new Error('Odoo authentication failed');
  uidCache = uid;
  return uid;
};

const callModel = async <T = unknown>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> => {
  const uid = await authenticate();
  return jsonRpc<T>(`${env.ODOO_URL}/jsonrpc`, 'object', 'execute_kw', [
    env.ODOO_DB,
    uid,
    env.ODOO_API_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
};

// ─── Odoo Sign API helpers ──────────────────────────────────

/**
 * Upload a PDF as a sign.template in Odoo Sign and return its ID.
 */
const createSignTemplate = async (pdfBuffer: Buffer, templateName: string): Promise<number> => {
  const pdfBase64 = pdfBuffer.toString('base64');

  const attachmentId = await callModel<number>('ir.attachment', 'create', [
    {
      name: `${templateName}.pdf`,
      datas: pdfBase64,
      type: 'binary',
      mimetype: 'application/pdf',
    },
  ]);

  const templateId = await callModel<number>('sign.template', 'create', [
    {
      attachment_id: attachmentId,
      name: templateName,
    },
  ]);

  return templateId;
};

/**
 * Create a signature request from a template, specifying signers.
 * Returns the sign.request ID.
 */
const createSignRequest = async (params: {
  templateId: number;
  reference: string;
  signers: Array<{ email: string; role: string }>;
}): Promise<number> => {
  // Get or create signer roles
  const signerItems: Array<{ role_id: number; partner_id: number }> = [];

  for (const signer of params.signers) {
    // Find or create the role
    const roleIds = await callModel<number[]>('sign.item.role', 'search', [
      [['name', '=', signer.role]],
    ]);

    let roleId: number;
    if (roleIds.length === 0) {
      roleId = await callModel<number>('sign.item.role', 'create', [{ name: signer.role }]);
    } else {
      roleId = roleIds[0]!;
    }

    // Find or create the partner by email
    const partnerIds = await callModel<number[]>(
      'res.partner',
      'search',
      [[['email', '=', signer.email]]],
      { limit: 1 },
    );

    let partnerId: number;
    if (partnerIds.length === 0) {
      partnerId = await callModel<number>('res.partner', 'create', [
        { name: signer.email, email: signer.email },
      ]);
    } else {
      partnerId = partnerIds[0]!;
    }

    signerItems.push({ role_id: roleId, partner_id: partnerId });
  }

  // Create the signature request using the send method on sign.template
  const result = await callModel<{ id: number }>(
    'sign.template',
    'send_request',
    [params.templateId],
    {
      signers: signerItems.map((s, i) => ({ role_id: s.role_id, partner_id: s.partner_id })),
      reference: params.reference,
      subject: `Signature requise : ${params.reference}`,
      message: 'Merci de signer ce document.',
    },
  );

  // Fallback: if send_request returns an ID directly
  if (typeof result === 'number') return result;
  if (result && typeof result === 'object' && 'id' in result) return result.id;

  // Alternative: create sign.request directly
  const requestId = await callModel<number>('sign.request', 'create', [
    {
      template_id: params.templateId,
      reference: params.reference,
      request_item_ids: signerItems.map((s) => [
        0,
        0,
        { role_id: s.role_id, partner_id: s.partner_id },
      ]),
    },
  ]);

  return requestId;
};

/**
 * Get sign request items (one per signer) with their signing URLs.
 */
const getSignRequestItems = async (signRequestId: number): Promise<OdooSignRequestItem[]> => {
  const items = await callModel<OdooSignRequestItem[]>(
    'sign.request.item',
    'search_read',
    [[['sign_request_id', '=', signRequestId]]],
    { fields: ['id', 'sign_request_id', 'signer_email', 'state', 'access_token'] },
  );

  // Build the signing URL from access_token
  return items.map((item) => ({
    ...item,
    signing_url: item.access_token
      ? `${env.ODOO_URL}/sign/document/${signRequestId}/${item.access_token}`
      : undefined,
  }));
};

/**
 * Get the status of a sign request.
 */
const getSignRequestStatus = async (signRequestId: number): Promise<OdooSignRequest | null> => {
  const results = await callModel<OdooSignRequest[]>(
    'sign.request',
    'search_read',
    [[['id', '=', signRequestId]]],
    { fields: ['id', 'state', 'request_item_ids', 'template_id', 'reference'] },
  );

  return results[0] ?? null;
};

/**
 * Download the signed PDF from a completed sign request.
 */
const downloadSignedPdf = async (signRequestId: number): Promise<Buffer | null> => {
  try {
    const result = await callModel<string | false>('sign.request', 'get_completed_document', [
      signRequestId,
    ]);

    if (!result || typeof result !== 'string') return null;
    return Buffer.from(result, 'base64');
  } catch (err) {
    logger.error({ err, signRequestId }, 'Failed to download signed PDF from Odoo');
    return null;
  }
};

/**
 * Cancel an ongoing sign request.
 */
const cancelSignRequest = async (signRequestId: number): Promise<void> => {
  await callModel('sign.request', 'cancel', [[signRequestId]]);
};

// ─── High-level orchestration ───────────────────────────────

export type InitiateSigningResult = {
  odooSignRequestId: number;
  odooTemplateId: number;
  signingUrls: Record<string, string>; // email -> signing URL
};

/**
 * Creates a sign template from PDF buffer, creates sign request with signers,
 * and returns signing URLs for each signer.
 */
export const initiateOdooSigning = async (params: {
  pdfBuffer: Buffer;
  documentName: string;
  reference: string;
  signers: Array<{ email: string; role: string }>;
}): Promise<InitiateSigningResult> => {
  logger.info(
    { reference: params.reference, signers: params.signers.map((s) => s.email) },
    'Initiating Odoo Sign request',
  );

  // 1. Create template from PDF
  const templateId = await createSignTemplate(params.pdfBuffer, params.documentName);

  // 2. Create sign request with signers
  const signRequestId = await createSignRequest({
    templateId,
    reference: params.reference,
    signers: params.signers,
  });

  // 3. Get signing URLs
  const items = await getSignRequestItems(signRequestId);
  const signingUrls: Record<string, string> = {};
  for (const item of items) {
    if (item.signing_url && item.signer_email) {
      signingUrls[item.signer_email] = item.signing_url;
    }
  }

  logger.info(
    { signRequestId, templateId, signerCount: Object.keys(signingUrls).length },
    'Odoo Sign request created successfully',
  );

  return { odooSignRequestId: signRequestId, odooTemplateId: templateId, signingUrls };
};

/**
 * Check sign request status and return current state with per-signer status.
 */
export const checkOdooSigningStatus = async (signRequestId: number) => {
  const request = await getSignRequestStatus(signRequestId);
  if (!request) return null;

  const items = await getSignRequestItems(signRequestId);

  return {
    status: request.state,
    isFullySigned: request.state === 'signed',
    signers: items.map((item) => ({
      email: item.signer_email,
      status: item.state,
      signingUrl: item.signing_url,
    })),
  };
};

export const downloadOdooSignedPdf = downloadSignedPdf;
export const cancelOdooSignRequest = cancelSignRequest;
