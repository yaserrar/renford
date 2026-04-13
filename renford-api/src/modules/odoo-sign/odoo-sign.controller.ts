import type { NextFunction, Request, Response } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '../../config/prisma';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { checkOdooSigningStatus, downloadOdooSignedPdf } from '../../services/odoo-sign';

// ─── Webhook signature verification ────────────────────────

const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  const expected = createHmac('sha256', env.ODOO_WEBHOOK_SECRET).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
};

// ─── Main webhook handler ──────────────────────────────────

export const odooSignWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-odoo-signature'] as string | undefined;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // Verify signature if present
    if (signature && !verifyWebhookSignature(rawBody, signature)) {
      logger.warn('Odoo webhook: invalid signature');
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }

    const { sign_request_id, state } = req.body as {
      sign_request_id?: number;
      state?: string;
    };

    if (!sign_request_id) {
      return res.status(400).json({ message: 'Missing sign_request_id' });
    }

    logger.info({ sign_request_id, state }, 'Odoo Sign webhook received');

    // Check which mission renford this relates to (contrat or attestation)
    const missionRenfordByContrat = await prisma.missionRenford.findFirst({
      where: { odooContratSignRequestId: sign_request_id },
      include: { mission: { select: { id: true, statut: true } } },
    });

    const missionRenfordByAttestation = await prisma.missionRenford.findFirst({
      where: { odooAttestationSignRequestId: sign_request_id },
      include: { mission: { select: { id: true, statut: true } } },
    });

    if (!missionRenfordByContrat && !missionRenfordByAttestation) {
      logger.warn({ sign_request_id }, 'Odoo webhook: no matching mission renford found');
      return res.status(200).json({ message: 'No matching record' });
    }

    // Check actual status from Odoo
    const odooStatus = await checkOdooSigningStatus(sign_request_id);
    if (!odooStatus) {
      return res.status(200).json({ message: 'Could not check Odoo status' });
    }

    // ── Handle contract signing completion ──────────────────
    if (missionRenfordByContrat) {
      await handleContractSigningUpdate(missionRenfordByContrat, sign_request_id, odooStatus);
    }

    // ── Handle attestation signing completion ───────────────
    if (missionRenfordByAttestation) {
      await handleAttestationSigningUpdate(
        missionRenfordByAttestation,
        sign_request_id,
        odooStatus,
      );
    }

    return res.status(200).json({ message: 'OK' });
  } catch (err) {
    logger.error({ err }, 'Odoo Sign webhook error');
    return next(err);
  }
};

// ─── Contract signing logic ─────────────────────────────────

type MissionRenfordWithMission = {
  id: string;
  missionId: string;
  statut: string;
  odooContratSignRequestId: number | null;
  odooContratSignedPdfPath: string | null;
  mission: { id: string; statut: string };
};

const handleContractSigningUpdate = async (
  missionRenford: MissionRenfordWithMission,
  signRequestId: number,
  odooStatus: NonNullable<Awaited<ReturnType<typeof checkOdooSigningStatus>>>,
) => {
  if (!odooStatus.isFullySigned) {
    // Partially signed – Renford signed but établissement hasn't yet
    // Transition to contrat_signe if not already
    if (missionRenford.statut === 'attente_de_signature') {
      const renfordSigner = odooStatus.signers.find((s) => s.status === 'completed');
      if (renfordSigner) {
        await prisma.missionRenford.update({
          where: { id: missionRenford.id },
          data: {
            statut: 'contrat_signe',
            dateContratSigne: new Date(),
          },
        });
        logger.info(
          { missionRenfordId: missionRenford.id },
          'Contract: Renford signed, status → contrat_signe',
        );
      }
    }
    return;
  }

  // Fully signed → transition to mission_en_cours
  if (
    missionRenford.statut === 'contrat_signe' ||
    missionRenford.statut === 'attente_de_signature'
  ) {
    // Download signed PDF from Odoo
    const signedPdfPath = await saveSignedPdf(signRequestId, 'contrats', missionRenford.id);

    await prisma.$transaction([
      prisma.missionRenford.update({
        where: { id: missionRenford.id },
        data: {
          statut: 'mission_en_cours',
          dateContratSigne:
            missionRenford.statut === 'attente_de_signature' ? new Date() : undefined,
          odooContratSignedPdfPath: signedPdfPath,
        },
      }),
      prisma.mission.update({
        where: { id: missionRenford.missionId },
        data: { statut: 'mission_en_cours' },
      }),
      // Reject other candidates
      prisma.missionRenford.updateMany({
        where: {
          missionId: missionRenford.missionId,
          id: { not: missionRenford.id },
          statut: { in: ['selection_en_cours', 'attente_de_signature'] },
        },
        data: {
          statut: 'refuse_par_etablissement',
          ordreShortlist: null,
        },
      }),
    ]);

    logger.info(
      { missionRenfordId: missionRenford.id, missionId: missionRenford.missionId },
      'Contract fully signed → mission_en_cours',
    );
  }
};

// ─── Attestation signing logic ──────────────────────────────

type MissionRenfordWithMissionAttestation = {
  id: string;
  missionId: string;
  statut: string;
  odooAttestationSignRequestId: number | null;
  odooAttestationSignedPdfPath: string | null;
  mission: { id: string; statut: string };
};

const handleAttestationSigningUpdate = async (
  missionRenford: MissionRenfordWithMissionAttestation,
  signRequestId: number,
  odooStatus: NonNullable<Awaited<ReturnType<typeof checkOdooSigningStatus>>>,
) => {
  if (!odooStatus.isFullySigned) return;

  if (!missionRenford.odooAttestationSignedPdfPath) {
    // Download and store the signed attestation
    const signedPdfPath = await saveSignedPdf(signRequestId, 'attestations', missionRenford.id);

    await prisma.missionRenford.update({
      where: { id: missionRenford.id },
      data: { odooAttestationSignedPdfPath: signedPdfPath },
    });

    logger.info({ missionRenfordId: missionRenford.id }, 'Attestation fully signed, PDF saved');
  }
};

// ─── Polling endpoint (alternative to webhook) ─────────────

export const checkSigningStatus = async (
  req: Request<{ missionRenfordId: string; documentType: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { missionRenfordId, documentType } = req.params;

    const missionRenford = await prisma.missionRenford.findUnique({
      where: { id: missionRenfordId },
      select: {
        id: true,
        statut: true,
        odooContratSignRequestId: true,
        odooContratSignedPdfPath: true,
        odooAttestationSignRequestId: true,
        odooAttestationSignedPdfPath: true,
      },
    });

    if (!missionRenford) {
      return res.status(404).json({ message: 'Mission renford non trouvée' });
    }

    const signRequestId =
      documentType === 'contrat_prestation'
        ? missionRenford.odooContratSignRequestId
        : missionRenford.odooAttestationSignRequestId;

    if (!signRequestId) {
      return res.json({
        status: 'not_initiated',
        isFullySigned: false,
        signers: [],
      });
    }

    const odooStatus = await checkOdooSigningStatus(signRequestId);
    if (!odooStatus) {
      return res.json({
        status: 'unknown',
        isFullySigned: false,
        signers: [],
      });
    }

    return res.json(odooStatus);
  } catch (err) {
    return next(err);
  }
};

// ─── Helper: save signed PDF locally ────────────────────────

const saveSignedPdf = async (
  signRequestId: number,
  folder: string,
  missionRenfordId: string,
): Promise<string | null> => {
  try {
    const pdfBuffer = await downloadOdooSignedPdf(signRequestId);
    if (!pdfBuffer) return null;

    const uploadDir = path.join(process.cwd(), 'uploads', 'signed-documents', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${folder.slice(0, -1)}-${missionRenfordId}.pdf`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, pdfBuffer);

    return `uploads/signed-documents/${folder}/${filename}`;
  } catch (err) {
    logger.error({ err, signRequestId, folder }, 'Failed to save signed PDF');
    return null;
  }
};
