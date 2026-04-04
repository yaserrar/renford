import type {
  Mission,
  MissionRenford,
  ProfilEtablissement,
  ProfilRenford,
  Utilisateur,
  Etablissement,
  PlageHoraireMission,
} from '@prisma/client';
import fs from 'fs';
import path from 'path';

export const MISSION_DOCUMENT_TYPES = [
  'facture_prestation',
  'facture_commission',
  'contrat_prestation',
  'attestation_mission',
] as const;

export type MissionDocumentType = (typeof MISSION_DOCUMENT_TYPES)[number];

type PdfImage = {
  name: string;
  objectId: number;
  width: number;
  height: number;
  data: Buffer;
};

type PdfContext = {
  width: number;
  height: number;
  cursorY: number;
  ops: string[];
  images: PdfImage[];
};

type MissionDocumentContext = {
  mission: Mission & {
    etablissement: Etablissement & { profilEtablissement: ProfilEtablissement };
    PlageHoraireMission: PlageHoraireMission[];
  };
  missionRenford: MissionRenford & { profilRenford: ProfilRenford & { utilisateur: Utilisateur } };
};

const computeFinancialsFromMission = (mission: MissionDocumentContext['mission']) => {
  const totalHours = mission.PlageHoraireMission.reduce(
    (acc: number, slot: PlageHoraireMission) => {
      const [sh, sm] = slot.heureDebut.split(':').map(Number);
      const [eh, em] = slot.heureFin.split(':').map(Number);
      if (
        sh === undefined ||
        sm === undefined ||
        eh === undefined ||
        em === undefined ||
        [sh, sm, eh, em].some((v) => Number.isNaN(v))
      ) {
        return acc;
      }
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (end <= start) return acc;
      return acc + (end - start) / 60;
    },
    0,
  );

  const tarif = Number(mission.tarif ?? 0);
  const totalHt = Math.max(0, tarif * totalHours);
  const commissionHt = Number((totalHt * 0.2).toFixed(2));
  const prestationTtc = totalHt;
  const commissionTtc = commissionHt;
  return { totalHours, totalHt, commissionHt, prestationTtc, commissionTtc };
};

const formatDate = (value: Date | null | undefined) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('fr-FR').format(value);
};

const formatAmount = (value: number) => `${value.toFixed(2)} EUR`;

const formatHours = (value: number) => {
  return `${value.toFixed(2)} h`;
};

const sanitizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const drawText = (ctx: PdfContext, text: string, x: number, y: number, size = 10, bold = false) => {
  const font = bold ? 'F2' : 'F1';
  ctx.ops.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${sanitizeText(text)}) Tj ET`);
};

const drawRect = (
  ctx: PdfContext,
  x: number,
  y: number,
  width: number,
  height: number,
  fillGray?: number,
) => {
  if (fillGray !== undefined) {
    ctx.ops.push(`q ${fillGray} g ${x} ${y} ${width} ${height} re f Q`);
  }
  ctx.ops.push(`${x} ${y} ${width} ${height} re S`);
};

const drawLine = (ctx: PdfContext, x1: number, y1: number, x2: number, y2: number) => {
  ctx.ops.push(`${x1} ${y1} m ${x2} ${y2} l S`);
};

const wrapText = (text: string, maxChars = 85) => {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const addParagraph = (
  ctx: PdfContext,
  text: string,
  x: number,
  width = 500,
  size = 10,
  lineGap = 14,
) => {
  const approxChars = Math.max(25, Math.floor(width / (size * 0.55)));
  const lines = wrapText(text, approxChars);
  for (const line of lines) {
    drawText(ctx, line, x, ctx.cursorY, size, false);
    ctx.cursorY -= lineGap;
  }
};

const createPdfContext = (): PdfContext => ({
  width: 595,
  height: 842,
  cursorY: 770,
  ops: [],
  images: [],
});

const parseJpegSize = (buffer: Buffer) => {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const hasLength = marker !== 0xd8 && marker !== 0xd9 && marker !== 0x01;
    if (!hasLength) {
      offset += 2;
      continue;
    }

    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buffer.length) return null;

    const isSof =
      marker === 0xc0 ||
      marker === 0xc1 ||
      marker === 0xc2 ||
      marker === 0xc3 ||
      marker === 0xc5 ||
      marker === 0xc6 ||
      marker === 0xc7 ||
      marker === 0xc9 ||
      marker === 0xca ||
      marker === 0xcb ||
      marker === 0xcd ||
      marker === 0xce ||
      marker === 0xcf;

    if (isSof) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      if (width > 0 && height > 0) {
        return { width, height };
      }
      return null;
    }

    offset += 2 + length;
  }

  return null;
};

const resolveSignaturePath = (relativePath: string | null | undefined) => {
  if (!relativePath) return null;
  const normalizedRelative = relativePath.replace(/^\/+/, '');
  const absolute = path.resolve(process.cwd(), normalizedRelative);
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  if (!absolute.startsWith(uploadsRoot)) return null;
  if (!fs.existsSync(absolute)) return null;
  return absolute;
};

const registerJpegImage = (ctx: PdfContext, imagePath: string | null, baseName: string) => {
  if (!imagePath) return null;
  if (!imagePath.toLowerCase().endsWith('.jpg') && !imagePath.toLowerCase().endsWith('.jpeg')) {
    return null;
  }

  try {
    const data = fs.readFileSync(imagePath);
    const size = parseJpegSize(data);
    if (!size) return null;
    const img: PdfImage = {
      name: baseName,
      objectId: 7 + ctx.images.length,
      width: size.width,
      height: size.height,
      data,
    };
    ctx.images.push(img);
    return img;
  } catch {
    return null;
  }
};

const drawSignatureBlock = (
  ctx: PdfContext,
  title: string,
  image: PdfImage | null,
  x: number,
  y: number,
  width = 240,
  height = 88,
) => {
  drawText(ctx, title, x, y + height + 12, 10, true);
  drawRect(ctx, x, y, width, height);

  if (!image) {
    drawText(ctx, 'Signature en attente', x + 65, y + height / 2, 9, false);
    return;
  }

  const pad = 8;
  const targetW = width - pad * 2;
  const targetH = height - pad * 2;
  const ratio = Math.min(targetW / image.width, targetH / image.height);
  const drawW = image.width * ratio;
  const drawH = image.height * ratio;
  const drawX = x + (width - drawW) / 2;
  const drawY = y + (height - drawH) / 2;
  ctx.ops.push(`q ${drawW} 0 0 ${drawH} ${drawX} ${drawY} cm /${image.name} Do Q`);
};

const buildPdfBuffer = (ctx: PdfContext): Buffer => {
  const contentStream = Buffer.from(`${ctx.ops.join('\n')}\n`, 'ascii');
  const contentObjectId = 6;

  const imageResourcePart = ctx.images.map((img) => `/${img.name} ${img.objectId} 0 R`).join(' ');
  const xObject = imageResourcePart ? `/XObject << ${imageResourcePart} >>` : '';

  const objects: Array<{ id: number; data: Buffer }> = [
    {
      id: 1,
      data: Buffer.from('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n', 'ascii'),
    },
    {
      id: 2,
      data: Buffer.from('2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n', 'ascii'),
    },
    {
      id: 3,
      data: Buffer.from(
        `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ctx.width} ${ctx.height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> ${xObject} >> /Contents ${contentObjectId} 0 R >>\nendobj\n`,
        'ascii',
      ),
    },
    {
      id: 4,
      data: Buffer.from(
        '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
        'ascii',
      ),
    },
    {
      id: 5,
      data: Buffer.from(
        '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
        'ascii',
      ),
    },
    {
      id: contentObjectId,
      data: Buffer.concat([
        Buffer.from(`6 0 obj\n<< /Length ${contentStream.length} >>\nstream\n`, 'ascii'),
        contentStream,
        Buffer.from('endstream\nendobj\n', 'ascii'),
      ]),
    },
  ];

  for (const img of ctx.images) {
    const header = Buffer.from(
      `${img.objectId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.data.length} >>\nstream\n`,
      'ascii',
    );
    const footer = Buffer.from('\nendstream\nendobj\n', 'ascii');
    objects.push({ id: img.objectId, data: Buffer.concat([header, img.data, footer]) });
  }

  objects.sort((a, b) => a.id - b.id);

  const header = Buffer.from('%PDF-1.4\n', 'ascii');
  const bodyParts: Buffer[] = [header];
  const offsets = new Map<number, number>();
  let offset = header.length;
  for (const obj of objects) {
    offsets.set(obj.id, offset);
    bodyParts.push(obj.data);
    offset += obj.data.length;
  }

  const maxId = objects[objects.length - 1]?.id ?? 0;
  const xrefStart = offset;
  const xrefLines = ['xref', `0 ${maxId + 1}`, '0000000000 65535 f '];
  for (let i = 1; i <= maxId; i += 1) {
    const objOffset = offsets.get(i) ?? 0;
    xrefLines.push(`${objOffset.toString().padStart(10, '0')} 00000 n `);
  }

  const trailer = Buffer.from(
    `${xrefLines.join('\n')}\ntrailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`,
    'ascii',
  );
  bodyParts.push(trailer);

  return Buffer.concat(bodyParts);
};

const drawHeader = (ctx: PdfContext, title: string, subtitle: string, docNumber: string) => {
  drawRect(ctx, 32, 770, 531, 46, 0.94);
  drawText(ctx, 'RENFORD', 42, 798, 16, true);
  drawText(ctx, title.toUpperCase(), 42, 780, 11, true);
  drawText(ctx, `N${sanitizeText('°')} ${docNumber}`, 430, 797, 10, true);
  drawText(ctx, subtitle, 430, 782, 9, false);
  ctx.cursorY = 748;
};

const drawParties = (
  ctx: PdfContext,
  etablissementName: string,
  etablissementAddress: string,
  renfordName: string,
) => {
  drawText(ctx, 'Emetteur', 42, ctx.cursorY, 10, true);
  drawText(ctx, 'Destinataire', 310, ctx.cursorY, 10, true);
  drawRect(ctx, 36, ctx.cursorY - 78, 250, 72);
  drawRect(ctx, 304, ctx.cursorY - 78, 255, 72);

  drawText(ctx, 'Renford SAS', 44, ctx.cursorY - 22, 10, true);
  drawText(ctx, '5 avenue de la Mission, 75001 Paris', 44, ctx.cursorY - 38, 9, false);
  drawText(ctx, 'support@renford.fr', 44, ctx.cursorY - 52, 9, false);

  drawText(ctx, etablissementName, 312, ctx.cursorY - 22, 10, true);
  addParagraph(ctx, etablissementAddress, 312, 240, 9, 12);
  ctx.cursorY = ctx.cursorY - 20;
  drawText(ctx, `Intervenant: ${renfordName}`, 312, ctx.cursorY - 34, 9, false);

  ctx.cursorY -= 96;
};

const drawMissionRecap = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  totalHours: number,
) => {
  drawText(ctx, 'Recapitulatif mission', 42, ctx.cursorY, 10, true);
  drawRect(ctx, 36, ctx.cursorY - 88, 523, 82);
  drawText(ctx, `Mission: ${mission.discipline}`, 44, ctx.cursorY - 22, 9, false);
  drawText(
    ctx,
    `Periode: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`,
    44,
    ctx.cursorY - 36,
    9,
    false,
  );
  drawText(ctx, `Statut: ${mission.statut}`, 44, ctx.cursorY - 50, 9, false);
  drawText(ctx, `Volume horaire: ${formatHours(totalHours)}`, 44, ctx.cursorY - 64, 9, false);
  ctx.cursorY -= 104;
};

const drawInvoiceTable = (
  ctx: PdfContext,
  label: string,
  quantity: string,
  unitPrice: string,
  total: string,
) => {
  const tableX = 36;
  const tableY = ctx.cursorY;
  const tableW = 523;
  const headerH = 24;
  const rowH = 30;

  drawRect(ctx, tableX, tableY - headerH, tableW, headerH, 0.93);
  drawRect(ctx, tableX, tableY - headerH - rowH, tableW, rowH);
  drawLine(ctx, tableX + 290, tableY - headerH - rowH, tableX + 290, tableY);
  drawLine(ctx, tableX + 360, tableY - headerH - rowH, tableX + 360, tableY);
  drawLine(ctx, tableX + 440, tableY - headerH - rowH, tableX + 440, tableY);

  drawText(ctx, 'Description', tableX + 8, tableY - 16, 9, true);
  drawText(ctx, 'Qté', tableX + 306, tableY - 16, 9, true);
  drawText(ctx, 'PU HT', tableX + 372, tableY - 16, 9, true);
  drawText(ctx, 'Total HT', tableX + 452, tableY - 16, 9, true);

  drawText(ctx, label, tableX + 8, tableY - 43, 9, false);
  drawText(ctx, quantity, tableX + 306, tableY - 43, 9, false);
  drawText(ctx, unitPrice, tableX + 372, tableY - 43, 9, false);
  drawText(ctx, total, tableX + 452, tableY - 43, 9, true);

  ctx.cursorY = tableY - headerH - rowH - 20;
};

const drawTotals = (ctx: PdfContext, baseHt: number, tva: number, totalTtc: number) => {
  const boxX = 336;
  const boxY = ctx.cursorY;
  drawRect(ctx, boxX, boxY - 84, 223, 78);
  drawText(ctx, `Sous-total HT: ${formatAmount(baseHt)}`, boxX + 10, boxY - 20, 9, false);
  drawText(ctx, `TVA: ${formatAmount(tva)}`, boxX + 10, boxY - 38, 9, false);
  drawText(ctx, `Total TTC: ${formatAmount(totalTtc)}`, boxX + 10, boxY - 60, 11, true);
  ctx.cursorY = boxY - 98;
};

const drawFooter = (ctx: PdfContext) => {
  drawLine(ctx, 36, 56, 559, 56);
  drawText(ctx, 'Document genere automatiquement par Renford', 36, 40, 8, false);
  drawText(ctx, `Date generation: ${formatDate(new Date())}`, 390, 40, 8, false);
};

const renderFacturePrestation = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  renfordName: string,
  totalHours: number,
  totalHt: number,
) => {
  drawHeader(
    ctx,
    'Facture de prestation',
    'Prestation mission',
    mission.id.slice(0, 8).toUpperCase(),
  );
  drawParties(
    ctx,
    mission.etablissement.nom,
    `${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`,
    renfordName,
  );
  drawMissionRecap(ctx, mission, totalHours);
  drawInvoiceTable(
    ctx,
    `Intervention ${mission.discipline}`,
    formatHours(totalHours),
    formatAmount(Number(mission.tarif ?? 0)),
    formatAmount(totalHt),
  );
  drawTotals(ctx, totalHt, 0, totalHt);
  drawFooter(ctx);
};

const renderFactureCommission = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  renfordName: string,
  totalHours: number,
  totalHt: number,
  commissionHt: number,
) => {
  drawHeader(
    ctx,
    'Facture commission',
    'Frais de service plateforme',
    mission.id.slice(0, 8).toUpperCase(),
  );
  drawParties(
    ctx,
    mission.etablissement.nom,
    `${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`,
    renfordName,
  );
  drawMissionRecap(ctx, mission, totalHours);
  drawInvoiceTable(
    ctx,
    'Commission Renford (20%)',
    '1',
    formatAmount(commissionHt),
    formatAmount(commissionHt),
  );
  drawTotals(ctx, commissionHt, 0, commissionHt);
  drawFooter(ctx);
};

const renderContrat = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  missionRenford: MissionDocumentContext['missionRenford'],
  totalHours: number,
) => {
  drawHeader(
    ctx,
    'Contrat de prestation',
    'Engagement contractuel',
    mission.id.slice(0, 8).toUpperCase(),
  );

  const renfordName = `${missionRenford.profilRenford.utilisateur.prenom} ${missionRenford.profilRenford.utilisateur.nom}`;
  drawText(ctx, 'Parties contractantes', 42, ctx.cursorY, 11, true);
  drawRect(ctx, 36, ctx.cursorY - 88, 523, 82);
  drawText(ctx, `Etablissement: ${mission.etablissement.nom}`, 44, ctx.cursorY - 22, 9, false);
  drawText(
    ctx,
    `Adresse: ${mission.etablissement.adresse}, ${mission.etablissement.codePostal} ${mission.etablissement.ville}`,
    44,
    ctx.cursorY - 36,
    9,
    false,
  );
  drawText(ctx, `Renford: ${renfordName}`, 44, ctx.cursorY - 50, 9, false);
  drawText(
    ctx,
    `Periode de mission: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)} - ${formatHours(totalHours)}`,
    44,
    ctx.cursorY - 64,
    9,
    false,
  );
  ctx.cursorY -= 114;

  drawText(ctx, 'Clauses principales', 42, ctx.cursorY, 11, true);
  addParagraph(ctx, '.', 44, 510, 9, 13);
  addParagraph(
    ctx,
    "Le prestataire s'engage a realiser la mission selon les standards professionnels attendus. L'etablissement garantit les conditions d'accueil et de securite necessaires.",
    44,
    510,
    9,
    13,
  );
  addParagraph(
    ctx,
    'La remuneration est fixee selon le mode de tarification convenu. Toute annulation ou modification doit etre notifiee via la plateforme Renford.',
    44,
    510,
    9,
    13,
  );
  addParagraph(
    ctx,
    'Les parties reconnaissent avoir pris connaissance des obligations de confidentialite et de conformite applicables pendant toute la duree de la mission.',
    44,
    510,
    9,
    13,
  );

  const renfordSignature = registerJpegImage(
    ctx,
    resolveSignaturePath(missionRenford.signatureContratPrestationRenfordChemin),
    'ImRenford',
  );
  const etabSignature = registerJpegImage(
    ctx,
    resolveSignaturePath(missionRenford.signatureContratPrestationEtablissementChemin),
    'ImEtab',
  );

  drawSignatureBlock(ctx, 'Signature Renford', renfordSignature, 42, 100);
  drawSignatureBlock(ctx, 'Signature Etablissement', etabSignature, 312, 100);

  drawText(
    ctx,
    `Date de signature: ${formatDate(missionRenford.dateContratSigne)}`,
    42,
    78,
    9,
    false,
  );
  drawFooter(ctx);
};

const renderAttestation = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  missionRenford: MissionDocumentContext['missionRenford'],
  totalHours: number,
) => {
  drawHeader(
    ctx,
    'Attestation de mission',
    'Validation de realisation',
    mission.id.slice(0, 8).toUpperCase(),
  );

  const renfordName = `${missionRenford.profilRenford.utilisateur.prenom} ${missionRenford.profilRenford.utilisateur.nom}`;
  drawText(ctx, 'Attestation', 42, ctx.cursorY, 12, true);
  addParagraph(
    ctx,
    `Nous attestons que ${renfordName} a realise la mission ${mission.discipline} pour ${mission.etablissement.nom} du ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)} pour un volume estime de ${formatHours(totalHours)}.`,
    44,
    510,
    10,
    15,
  );
  addParagraph(
    ctx,
    `Statut de mission: ${mission.statut}. Cette attestation est etablie pour servir et valoir ce que de droit.`,
    44,
    510,
    10,
    15,
  );

  drawRect(ctx, 36, ctx.cursorY - 96, 523, 90);
  drawText(ctx, `Etablissement: ${mission.etablissement.nom}`, 44, ctx.cursorY - 24, 9, false);
  drawText(ctx, `Renford: ${renfordName}`, 44, ctx.cursorY - 40, 9, false);
  drawText(
    ctx,
    `Periode: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`,
    44,
    ctx.cursorY - 56,
    9,
    false,
  );
  drawText(ctx, `Date emission: ${formatDate(new Date())}`, 44, ctx.cursorY - 72, 9, false);

  const renfordSignature = registerJpegImage(
    ctx,
    resolveSignaturePath(missionRenford.signatureAttestationMissionRenfordChemin),
    'ImAttRenford',
  );
  const etabSignature = registerJpegImage(
    ctx,
    resolveSignaturePath(missionRenford.signatureAttestationMissionEtablissementChemin),
    'ImAttEtab',
  );

  drawSignatureBlock(ctx, 'Signature Renford', renfordSignature, 42, 100);
  drawSignatureBlock(ctx, 'Signature Etablissement', etabSignature, 312, 100);

  drawFooter(ctx);
};

export const getMissionDocumentFilename = (type: MissionDocumentType, missionId: string) => {
  return `${type}-${missionId}.pdf`;
};

export const buildMissionDocumentPdf = (
  type: MissionDocumentType,
  context: MissionDocumentContext,
): Buffer => {
  const { mission, missionRenford } = context;
  const { totalHours, totalHt, commissionHt } = computeFinancialsFromMission(mission);

  const renfordName = `${missionRenford.profilRenford.utilisateur.prenom} ${missionRenford.profilRenford.utilisateur.nom}`;
  const ctx = createPdfContext();

  if (type === 'facture_prestation') {
    renderFacturePrestation(ctx, mission, renfordName, totalHours, totalHt);
  }

  if (type === 'facture_commission') {
    renderFactureCommission(ctx, mission, renfordName, totalHours, totalHt, commissionHt);
  }

  if (type === 'contrat_prestation') {
    renderContrat(ctx, mission, missionRenford, totalHours);
  }

  if (type === 'attestation_mission') {
    renderAttestation(ctx, mission, missionRenford, totalHours);
  }

  return buildPdfBuffer(ctx);
};
