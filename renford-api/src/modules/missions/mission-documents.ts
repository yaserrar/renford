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
import zlib from 'zlib';
import { getTypeMissionLabel } from './missions.schema';

export const MISSION_DOCUMENT_TYPES = [
  'devis',
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
  isPng?: boolean;
};

type PdfPage = {
  ops: string[];
  images: PdfImage[];
};

type PdfContext = {
  width: number;
  height: number;
  cursorY: number;
  ops: string[];
  images: PdfImage[];
  pages: PdfPage[];
  marginBottom: number;
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
  pages: [],
  marginBottom: 60,
});

const newPage = (ctx: PdfContext) => {
  ctx.pages.push({ ops: [...ctx.ops], images: [...ctx.images] });
  ctx.ops = [];
  ctx.images = [];
  ctx.cursorY = 800;
};

const ensureSpace = (ctx: PdfContext, needed: number) => {
  if (ctx.cursorY - needed < ctx.marginBottom) {
    newPage(ctx);
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
  // Finalize current page
  ctx.pages.push({ ops: [...ctx.ops], images: [...ctx.images] });

  const allImages = ctx.pages.flatMap((p) => p.images);
  const imageResourcePart = allImages.map((img) => `/${img.name} ${img.objectId} 0 R`).join(' ');
  const xObject = imageResourcePart ? `/XObject << ${imageResourcePart} >>` : '';
  const resourcesDict = `/Resources << /Font << /F1 4 0 R /F2 5 0 R >> ${xObject} >>`;

  const pageCount = ctx.pages.length;
  const contentStartId = 6;

  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];
  for (let i = 0; i < pageCount; i++) {
    pageObjectIds.push(contentStartId + i * 2);
    contentObjectIds.push(contentStartId + i * 2 + 1);
  }

  const objects: Array<{ id: number; data: Buffer }> = [
    {
      id: 1,
      data: Buffer.from('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n', 'ascii'),
    },
    {
      id: 2,
      data: Buffer.from(
        `2 0 obj\n<< /Type /Pages /Count ${pageCount} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>\nendobj\n`,
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
  ];

  for (let i = 0; i < pageCount; i++) {
    const pageOps = ctx.pages[i]!.ops;
    const stream = Buffer.from(`${pageOps.join('\n')}\n`, 'ascii');
    const pageObjId = pageObjectIds[i]!;
    const contentObjId = contentObjectIds[i]!;

    objects.push({
      id: pageObjId,
      data: Buffer.from(
        `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ctx.width} ${ctx.height}] ${resourcesDict} /Contents ${contentObjId} 0 R >>\nendobj\n`,
        'ascii',
      ),
    });
    objects.push({
      id: contentObjId,
      data: Buffer.concat([
        Buffer.from(`${contentObjId} 0 obj\n<< /Length ${stream.length} >>\nstream\n`, 'ascii'),
        stream,
        Buffer.from('endstream\nendobj\n', 'ascii'),
      ]),
    });
  }

  for (const img of allImages) {
    if (objects.some((o) => o.id === img.objectId)) continue;

    let imgData: Buffer;
    let filter: string;
    let colorSpace = '/DeviceRGB';
    let extra = '';

    if (img.isPng) {
      // Decode PNG to raw RGB and compress with FlateDecode
      const decoded = decodePngToRawRgb(img.data);
      if (decoded) {
        imgData = zlib.deflateSync(decoded.rgb);
        filter = '/FlateDecode';
        colorSpace = decoded.hasAlpha ? '/DeviceRGB' : '/DeviceRGB';
        extra = '';
      } else {
        continue; // skip undecodable images
      }
    } else {
      imgData = img.data;
      filter = '/DCTDecode';
    }

    const header = Buffer.from(
      `${img.objectId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace ${colorSpace} /BitsPerComponent 8 /Filter ${filter} /Length ${imgData.length} ${extra}>>\nstream\n`,
      'ascii',
    );
    const footer = Buffer.from('\nendstream\nendobj\n', 'ascii');
    objects.push({ id: img.objectId, data: Buffer.concat([header, imgData, footer]) });
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
    mission.dateFin
      ? `Periode: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`
      : `Date: ${formatDate(mission.dateDebut)}`,
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

const renderDevis = (
  ctx: PdfContext,
  mission: MissionDocumentContext['mission'],
  renfordName: string,
  totalHours: number,
  totalHt: number,
  commissionHt: number,
) => {
  const etab = mission.etablissement;
  const etabProfil = etab.profilEtablissement;
  const typeMission = getTypeMissionLabel(mission.specialitePrincipale);
  const commissionTtc = Number((commissionHt * 1.2).toFixed(2));
  const totalTtc = totalHt + commissionTtc;
  const adresseComplete = `${etab.adresse}, ${etab.codePostal} ${etab.ville}`;
  const plage = mission.dateFin
    ? `Du ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`
    : `Le ${formatDate(mission.dateDebut)}`;

  // Header
  drawRect(ctx, 32, 770, 531, 46, 0.94);
  drawText(ctx, 'RENFORD', 42, 798, 16, true);
  drawText(ctx, 'DEVIS POUR SERVICES ET COMMISSION', 42, 780, 10, true);
  drawText(ctx, `N${sanitizeText('°')} ${mission.id.slice(0, 8).toUpperCase()}`, 430, 797, 10, true);
  ctx.cursorY = 748;

  // Destinataire block
  drawText(ctx, etabProfil.raisonSociale, 42, ctx.cursorY, 10, true);
  ctx.cursorY -= 14;
  drawText(ctx, adresseComplete, 42, ctx.cursorY, 9);
  ctx.cursorY -= 14;
  drawText(ctx, 'FRANCE', 42, ctx.cursorY, 9);
  ctx.cursorY -= 14;
  drawText(ctx, `SIRET: ${etabProfil.siret}`, 42, ctx.cursorY, 9);
  ctx.cursorY -= 20;

  // Dates
  drawText(ctx, `Date du devis : ${formatDate(mission.dateCreation)}`, 42, ctx.cursorY, 9);
  ctx.cursorY -= 14;
  drawText(ctx, 'Validite du devis : 72 heures', 42, ctx.cursorY, 9);
  ctx.cursorY -= 20;

  // Mission title
  drawText(ctx, `${renfordName} - ${typeMission}`, 42, ctx.cursorY, 11, true);
  ctx.cursorY -= 22;

  // Table header
  const tableX = 36;
  const tableW = 523;
  const headerH = 20;
  drawRect(ctx, tableX, ctx.cursorY - headerH, tableW, headerH, 0.93);
  drawText(ctx, 'Description', tableX + 4, ctx.cursorY - 14, 8, true);
  drawText(ctx, 'Heures', tableX + 260, ctx.cursorY - 14, 8, true);
  drawText(ctx, 'Taux', tableX + 320, ctx.cursorY - 14, 8, true);
  drawText(ctx, 'TVA', tableX + 380, ctx.cursorY - 14, 8, true);
  drawText(ctx, 'HT', tableX + 425, ctx.cursorY - 14, 8, true);
  drawText(ctx, 'TTC', tableX + 475, ctx.cursorY - 14, 8, true);
  ctx.cursorY -= headerH;

  // Row 1: Prestation
  const row1H = 42;
  drawRect(ctx, tableX, ctx.cursorY - row1H, tableW, row1H);
  const row1Y = ctx.cursorY - 14;
  drawText(ctx, `Prestation temporaire d'encadrement`, tableX + 4, row1Y, 8);
  drawText(ctx, `du sport - ${typeMission}`, tableX + 4, row1Y - 12, 8);
  drawText(ctx, `Lieu: ${adresseComplete}`, tableX + 4, row1Y - 24, 7);
  drawText(ctx, formatHours(totalHours), tableX + 260, row1Y, 8);
  drawText(ctx, formatAmount(Number(mission.tarif ?? 0)), tableX + 320, row1Y, 8);
  drawText(ctx, '0%', tableX + 380, row1Y, 8);
  drawText(ctx, formatAmount(totalHt), tableX + 425, row1Y, 8);
  drawText(ctx, formatAmount(totalHt), tableX + 475, row1Y, 8);
  ctx.cursorY -= row1H;

  // Row 2: Commission
  const row2H = 28;
  drawRect(ctx, tableX, ctx.cursorY - row2H, tableW, row2H);
  const row2Y = ctx.cursorY - 14;
  drawText(ctx, 'Commission sur vente (plateforme Renford)', tableX + 4, row2Y, 8);
  drawText(ctx, '20%', tableX + 380, row2Y, 8);
  drawText(ctx, formatAmount(commissionHt), tableX + 425, row2Y, 8);
  drawText(ctx, formatAmount(commissionTtc), tableX + 475, row2Y, 8);
  ctx.cursorY -= row2H + 16;

  // Recap box
  ensureSpace(ctx, 110);
  const boxX = 336;
  const boxY = ctx.cursorY;
  drawRect(ctx, boxX, boxY - 100, 223, 94);
  drawText(ctx, 'Recapitulatif', boxX + 10, boxY - 16, 10, true);
  drawText(ctx, `Sous-total prestation TTC: ${formatAmount(totalHt)}`, boxX + 10, boxY - 34, 9);
  drawText(ctx, `Commission sur vente TTC: ${formatAmount(commissionTtc)}`, boxX + 10, boxY - 50, 9);
  drawText(ctx, `Montant total TTC: ${formatAmount(totalTtc)}`, boxX + 10, boxY - 68, 10, true);
  drawText(ctx, `NET A PAYER: ${formatAmount(totalTtc)}`, boxX + 10, boxY - 86, 10, true);
  ctx.cursorY = boxY - 116;

  // Conditions de paiement
  ensureSpace(ctx, 60);
  drawText(ctx, 'Conditions de Paiement', 42, ctx.cursorY, 10, true);
  ctx.cursorY -= 16;
  addParagraph(
    ctx,
    'Paiement integral demande a la reception de ce devis pour debuter le projet. Mode de paiement : Lien de paiement en ligne via Stripe.',
    44,
    510,
    9,
    13,
  );
  ctx.cursorY -= 10;

  // Validite
  addParagraph(
    ctx,
    'Ce devis est valide jusqu\'a 72 heures apres la date d\'emission. Les services decrits debuteront une fois le paiement integral confirme.',
    44,
    510,
    9,
    13,
  );
  ctx.cursorY -= 10;

  // CGV Summary - Page 2
  ensureSpace(ctx, 200);
  drawText(ctx, '1. Validation et Paiement du Devis', 42, ctx.cursorY, 10, true);
  ctx.cursorY -= 16;
  addParagraph(
    ctx,
    "L'Entreprise Cliente dispose de 72 heures pour valider le devis. Cette validation peut se faire soit par retour de mail, soit en effectuant le paiement integral via le lien de paiement fourni. Passe le delai de 72 heures, l'acceptation du devis sera consideree comme tacite. Sans paiement prealable, la mission ne pourra pas demarrer.",
    44,
    510,
    8,
    12,
  );
  ctx.cursorY -= 8;
  addParagraph(
    ctx,
    "Le paiement est effectue via un lien Stripe securise. Une fois recu, le paiement est stocke par Renford jusqu'a la fin de la prestation, en attente de validation par l'Entreprise Cliente.",
    44,
    510,
    8,
    12,
  );
  ctx.cursorY -= 12;

  ensureSpace(ctx, 100);
  drawText(ctx, "2. Paiement de l'Auto-Entrepreneur", 42, ctx.cursorY, 10, true);
  ctx.cursorY -= 16;
  addParagraph(
    ctx,
    "Apres validation de la prestation par l'Entreprise Cliente, Renford dispose de 30 jours pour verser le montant du au Prestataire, apres deduction des frais de service.",
    44,
    510,
    8,
    12,
  );
  ctx.cursorY -= 12;

  ensureSpace(ctx, 160);
  drawText(ctx, "3. Conditions d'Annulation ou de Modification", 42, ctx.cursorY, 10, true);
  ctx.cursorY -= 16;
  addParagraph(
    ctx,
    "Annulation entre 48h et 24h avant la prestation : 25% du montant du premier jour. Annulation la veille : 25% du montant total du premier jour. Annulation le jour meme : 50% du montant du premier jour, 25% du deuxieme jour. En cas de force majeure, aucune penalite ne sera appliquee.",
    44,
    510,
    8,
    12,
  );
  ctx.cursorY -= 8;
  addParagraph(
    ctx,
    "En cas de desistement tardif ou absence du Prestataire : suspension temporaire de 7 jours. Deux desistements en 30 jours : suspension definitive. Renford s'engage a trouver un remplacement rapide.",
    44,
    510,
    8,
    12,
  );

  drawFooter(ctx);
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
  sigRenfordImage: PdfImage | null,
  sigEtabImage: PdfImage | null,
) => {
  const { totalHt, commissionHt, prestationTtc, commissionTtc } =
    computeFinancialsFromMission(mission);
  const totalTtc = prestationTtc + commissionTtc;

  const renfordUser = missionRenford.profilRenford.utilisateur;
  const renfordProfil = missionRenford.profilRenford;
  const renfordName = `${renfordUser.prenom} ${renfordUser.nom}`;
  const etab = mission.etablissement;
  const etabProfil = etab.profilEtablissement;

  const addTitle = (text: string, size = 12) => {
    ensureSpace(ctx, 30);
    ctx.cursorY -= 6;
    drawText(ctx, text, 42, ctx.cursorY, size, true);
    ctx.cursorY -= size + 6;
  };

  const addBody = (text: string) => {
    const approxChars = Math.max(25, Math.floor(510 / (8.5 * 0.55)));
    const lines = wrapText(text, approxChars);
    for (const line of lines) {
      ensureSpace(ctx, 14);
      drawText(ctx, line, 42, ctx.cursorY, 8.5, false);
      ctx.cursorY -= 12;
    }
  };

  const addGap = (gap = 8) => {
    ctx.cursorY -= gap;
  };

  // ---- Page 1: Header ----
  drawRect(ctx, 32, 800, 531, 30, 0.94);
  drawText(ctx, 'CONTRAT DE PRESTATION DE SERVICE - OFFRE FLEX', 42, 810, 11, true);
  ctx.cursorY = 780;

  addTitle('ENTRE LES SOUSSIGNES :', 10);
  addBody('1. La Plateforme : Renford.');
  addBody(
    "Renford, Societe par Actions Simplifiee (SAS) immatriculee au Registre du Commerce et des Societes (RCS) de Nanterre sous le numero 930 657 044, dont le siege social est situe au 76 rue Voltaire, 92150 Suresnes, et identifiee par le numero SIRET 930 657 044 00010, est representee par Monsieur Nicolas Vere, dument habilite aux fins des presentes. Le domaine d'activite de la societe est celui de service de mise en relation numerique.",
  );
  addBody('Ci-apres designee "Renford" ou "La Plateforme".');
  addGap();

  addBody("2. L'Entreprise Cliente :");
  addBody(
    `${sanitizeText(etabProfil.raisonSociale || etab.nom)}, immatriculee sous le numero SIRET ${sanitizeText(etab.siret || '-')}, dont le siege social est situe ${sanitizeText(etab.adresse)}, ${sanitizeText(etab.codePostal)} ${sanitizeText(etab.ville)}.`,
  );
  addBody('Elle est ci-apres denommee "l\'Entreprise Cliente".');
  addGap();

  addBody('3. Le Prestataire (Auto-Entrepreneur) :');
  addBody(
    `${sanitizeText(renfordUser.prenom)} ${sanitizeText(renfordUser.nom)}, ne(e) le ${formatDate(renfordProfil.dateNaissance)}, inscrit sous le numero SIRET ${sanitizeText(renfordProfil.siret || '-')}, domicilie au ${sanitizeText(renfordProfil.adresse || '-')}, ${sanitizeText(renfordProfil.ville || '-')} et exercant le type de mission suivante: ${sanitizeText(mission.discipline)}.`,
  );
  addBody('Ci-apres denomme "le Prestataire".');
  addGap(12);

  addTitle('ETANT PREALABLEMENT RAPPELE CE QUI SUIT :', 10);
  addBody(
    "Le Prestataire exerce une activite dans le domaine sportif et educatif. L'Entreprise Cliente a souhaite avoir recours aux services d'un Prestataire dans le cadre d'un besoin ponctuel ou temporaire dans le secteur sportif.",
  );
  addBody(
    "A cet effet, Renford a adresse a l'Entreprise Cliente, apres concertation et validation avec le Prestataire, ainsi qu'apres validation de l'organisation de travail proposee et de la fiche de poste, le profil du Prestataire repondant aux exigences transmises, accompagne du devis correspondant, dument accepte et valide par l'Entreprise Cliente.",
  );
  addBody(
    "Le Prestataire reconnait avoir ete consulte en amont par Renford, avoir confirme son interet pour la mission proposee, et atteste que cette derniere est compatible avec son emploi du temps ainsi qu'avec ses engagements professionnels en cours.",
  );
  addBody(
    "Dans ces circonstances, Renford met en relation le Prestataire et l'Entreprise Cliente pour conclure le present contrat de prestations de services afin de definir et de convenir des modalites des services du Prestataire, au benefice du client.",
  );
  addGap(12);

  addTitle('IL A ETE CONVENU CE QUI SUIT :', 10);

  addTitle('Article 1 - Objet du Contrat', 10);
  addBody(
    "Le present contrat a pour objectif la realisation d'une prestation de services telle que definie ci-dessous :",
  );
  addBody(
    "L'Entreprise Cliente fait appel a un besoin ponctuel d'encadrement sportif dans son etablissement et fait appel aux services du Prestataire pour beneficier des services fournis par la plateforme de mise en relation (ci-apres Renford), dans le but de repondre a ses besoins en personnel qualifie pour des missions temporaires dans le secteur du sport. L'Entreprise Cliente a notamment selectionne l'offre \"Renford Flex\" dont les details sont mentionnes a l'annexe 1, jointe a ce present contrat.",
  );
  addBody(
    "Les services specifiques que le Prestataire s'engage a fournir dans le cadre de chaque mission incluent l'execution des taches specifiees par l'Entreprise Cliente, conformement a sa specialisation et a ses expertises en tant que professionnel independant dans le sport.",
  );
  addBody(
    "Les details de l'organisation et des creneaux proposes par l'Entreprise Cliente sont joints en Annexe 2 du present contrat et ont ete valides par chacune des parties.",
  );
  addBody(
    "Renford s'engage a faciliter la mise en relation entre l'Entreprise Cliente et le Prestataire, agissant en tant que plateforme de mise en relation pour coordonner la prestation de services.",
  );
  addGap();

  addTitle('Article 2 - Modalites de realisation de la mission', 10);
  addBody("2.1 L'Entreprise Cliente :");
  addBody(
    "A. L'Entreprise Cliente s'engage a fournir au Prestataire toutes les informations necessaires et detaillees concernant les services requis.",
  );
  addBody(
    "B. L'Entreprise Cliente s'engage a effectuer les paiements dus et relatifs a la mission conformement aux modalites financieres convenues entre les parties.",
  );
  addBody(
    "C. L'Entreprise Cliente collaborera activement avec le Prestataire pour faciliter la prestation de services.",
  );
  addGap();
  addBody('2.2 Le Prestataire :');
  addBody(
    "A. Le Prestataire s'engage a fournir les services de maniere professionnelle, en conformite avec les normes de qualite definies par l'Entreprise Cliente.",
  );
  addBody(
    'B. Le Prestataire respectera les delais convenus pour chaque phase de la prestation de services.',
  );
  addBody(
    "C. En cas de probleme, le Prestataire s'engage a informer promptement l'Entreprise Cliente.",
  );
  addBody('D. Presenter, si necessaire, une attestation de RC PRO valide.');
  addGap();
  addBody('2.3 Renford :');
  addBody(
    "A. Renford s'engage a faciliter la mise en relation entre l'Entreprise Cliente et le Prestataire.",
  );
  addBody('B. Renford coordonne la communication entre les parties.');
  addBody("C. Renford s'engage a fournir un soutien logistique.");
  addBody('D. Assurer un suivi en cas de litige ou de reclamation.');
  addGap();

  addTitle('Article 3 - Information precontractuelle', 10);
  addBody(
    "L'Entreprise Cliente a fourni l'ensemble des informations necessaires a la conclusion du present contrat dans sa demande de mission realisee sur la plateforme Renford. Le Prestataire a recu une annexe avec les modalites de la mission et les a valides apres avoir verifie que la mission etait bien conforme a son organisation de travail.",
  );
  addBody(
    "Renford a transmis les informations precontractuelles au Prestataire qui les a acceptes en validant la demande de mission via la plateforme. La validation du devis par l'Entreprise, suivie du paiement, formalise la mission.",
  );
  addGap();

  addTitle('Article 4 - Duree de la mission', 10);
  addBody(
    'Les precisions sur la duree de la mission dans le cadre de l\'offre "Renford Flex" sont precisees dans l\'annexe 1 jointe au present contrat.',
  );
  addBody(
    "Le contrat prend effet a compter de la validation du devis par l'Entreprise Cliente et reste applicable jusqu'a la fin de la mission. Il ne sera pas renouvelable par tacite reconduction.",
  );
  addGap();

  addTitle('Article 5 - Resiliation anticipee du Contrat et annulation', 10);
  addBody('5.1. Resiliation pour Manquement');
  addBody(
    "En cas de manquement de l'Entreprise Cliente ou du Prestataire a l'une de ses obligations essentielles, Renford notifiera le manquement a la partie defaillante et transmettra sa volonte de resilier le Contrat de maniere anticipee.",
  );
  addBody('Delais de preavis selon la duree de la mission :');
  addBody('- Missions de moins de 3 mois : 72 heures.');
  addBody('- Missions comprises entre 3 et 6 mois : Une semaine (7 jours calendaires).');
  addBody('- Missions de plus de 6 mois : Un mois (30 jours calendaires).');
  addGap();
  addBody("5.2 Annulation de la Mission par l'Entreprise Cliente");
  addBody('- Annulation entre 48h et 24h avant la prestation : 25% du montant du premier jour.');
  addBody('- Annulation la veille de la prestation : 50% du montant total du premier jour.');
  addBody('- Annulation le jour de la prestation : 75% du premier jour, 50% du deuxieme jour.');
  addBody('En cas de force majeure, aucune penalite ne sera appliquee.');
  addGap();

  addTitle('Article 6 - Non-realisation et Insatisfaction de la Mission', 10);
  addBody(
    '6.1. En cas de desistement tardif, Renford se reserve la possibilite de prendre toute mesure appropriee (suspension temporaire du compte).',
  );
  addBody(
    "6.2. Si le Prestataire ne se presente pas le jour J sans justification valable, Renford s'engage a rembourser integralement l'Entreprise Cliente dans un delai de 30 jours ouvres.",
  );
  addBody(
    "6.3. En cas d'insatisfaction, l'Entreprise Cliente dispose d'un droit de reclamation via la plateforme dans un delai de 10 jours suivant la fin de la mission.",
  );
  addGap();

  addTitle('Article 7 - Remuneration du Prestataire et Paiement', 10);
  addBody(
    `En contrepartie de la realisation des prestations, le Prestataire percevra une remuneration de ${formatAmount(totalHt)} HT.`,
  );
  addBody(
    `Pour son role de mise en relation, Renford percevra une commission de ${formatAmount(commissionTtc)} TTC.`,
  );
  addBody(`Le montant global de la mission s'eleve a ${formatAmount(totalTtc)} TTC.`);
  addBody(
    "Le paiement est effectue par l'Entreprise Cliente via un lien securise fourni par Renford. Les fonds sont conserves par Renford jusqu'a la validation de la mission ou l'expiration d'un delai de 10 jours.",
  );
  addGap();

  addTitle('Article 8 - Intuitu Personae - Sous-traitance', 10);
  addBody(
    "Le Contrat ne peut pas faire l'objet d'une cession totale ou partielle par une Partie sans l'accord prealable et ecrit de l'autre Partie. Le Prestataire n'aura pas la possibilite de sous-traiter tout ou partie de sa Mission sans l'accord prealable et ecrit de l'Entreprise Cliente.",
  );
  addGap();

  addTitle("Article 9 - Declaration d'independance reciproque", 10);
  addBody(
    "La relation etablie entre l'Entreprise Cliente et le Prestataire est celle d'entreprises independantes et autonomes. Il n'existe entre les Parties aucun lien de subordination mais uniquement un lien contractuel de nature commerciale.",
  );
  addGap();

  addTitle('Article 10 - Declarations des Parties', 10);
  addBody(
    "Chacune des Parties declare avoir la pleine capacite juridique. Le Prestataire declare exercer cette mission en tant qu'independant.",
  );
  addGap();

  addTitle('Article 11 - Controle de conformite et travail dissimule', 10);
  addBody(
    'Renford peut demander au Prestataire de fournir a tout moment des documents justifiant de sa conformite legale (SIRET, RC PRO, attestation de vigilance).',
  );
  addGap();

  addTitle('Article 13 - Confidentialite', 10);
  addBody(
    "Les Parties s'engagent a maintenir la confidentialite des informations echangees pendant la duree de ce contrat.",
  );
  addGap();

  addTitle('Article 14 - Limitations de responsabilite', 10);
  addBody(
    "Renford ne pourra etre tenu responsable des dommages indirects resultant de l'execution du present contrat.",
  );
  addGap();

  addTitle('Article 15 - Dispositions generales', 10);
  addBody(
    "15.1. Les Parties s'engagent a toujours se comporter comme des partenaires loyaux et de bonne foi.",
  );
  addBody(
    "15.2. Aucune modification du Contrat ne produira d'effet sans prendre la forme d'un avenant signe.",
  );
  addBody(
    '15.5. Le present contrat est soumis au droit francais. En cas de litige, la juridiction competente sera le Tribunal de Commerce de Nanterre.',
  );
  addGap(12);

  // ---- Signature page ----
  addBody(
    `En foi de quoi, les Parties ont signe le present contrat a la date du ${formatDate(missionRenford.dateContratSigne ?? new Date())} a Suresnes, en trois exemplaires originaux.`,
  );
  addGap();
  addBody('Signatures precedees de la mention "Lu et approuve, bon pour accord".');
  addGap(16);

  // Signature blocks
  ensureSpace(ctx, 160);
  drawSignatureBlock(ctx, 'Signature Renford', sigRenfordImage, 42, ctx.cursorY - 110);
  drawSignatureBlock(ctx, 'Signature Etablissement', sigEtabImage, 312, ctx.cursorY - 110);
  ctx.cursorY -= 140;

  // Annexe 1
  ensureSpace(ctx, 200);
  addGap(12);
  addTitle('ANNEXE 1 - Details de la mission', 11);
  addBody(`Mission: ${sanitizeText(mission.discipline)}`);
  addBody(`Specialite: ${sanitizeText(mission.specialitePrincipale)}`);
  addBody(
    mission.dateFin
      ? `Periode: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`
      : `Date: ${formatDate(mission.dateDebut)}`,
  );
  addBody(`Volume horaire: ${formatHours(totalHours)}`);
  addBody(`Tarif: ${formatAmount(Number(mission.tarif ?? 0))} HT`);
  addBody(`Commission Renford: ${formatAmount(commissionHt)} HT`);
  addBody(`Total TTC: ${formatAmount(totalTtc)}`);
  addGap();

  // Annexe 2 - Schedule
  addTitle('ANNEXE 2 - Planning des creneaux', 11);
  const sortedSlots = [...mission.PlageHoraireMission].sort((a, b) => {
    const d = new Date(a.date).getTime() - new Date(b.date).getTime();
    return d !== 0 ? d : a.heureDebut.localeCompare(b.heureDebut);
  });
  for (const slot of sortedSlots) {
    ensureSpace(ctx, 14);
    const dateStr = formatDate(new Date(slot.date));
    addBody(`${dateStr} : ${slot.heureDebut} - ${slot.heureFin}`);
  }

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
    mission.dateFin
      ? `Nous attestons que ${renfordName} a realise la mission ${mission.discipline} pour ${mission.etablissement.nom} du ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)} pour un volume estime de ${formatHours(totalHours)}.`
      : `Nous attestons que ${renfordName} a realise la mission ${mission.discipline} pour ${mission.etablissement.nom} le ${formatDate(mission.dateDebut)} pour un volume estime de ${formatHours(totalHours)}.`,
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
    mission.dateFin
      ? `Periode: ${formatDate(mission.dateDebut)} au ${formatDate(mission.dateFin)}`
      : `Date: ${formatDate(mission.dateDebut)}`,
    44,
    ctx.cursorY - 56,
    9,
    false,
  );
  drawText(ctx, `Date emission: ${formatDate(new Date())}`, 44, ctx.cursorY - 72, 9, false);

  // Signature placeholders (actual signatures applied by Odoo Sign)
  drawSignatureBlock(ctx, 'Signature Renford', null, 42, 100);
  drawSignatureBlock(ctx, 'Signature Etablissement', null, 312, 100);

  drawFooter(ctx);
};

// Decode a PNG buffer into raw RGB pixel data (strips alpha channel)
const decodePngToRawRgb = (pngData: Buffer): { rgb: Buffer; hasAlpha: boolean } | null => {
  try {
    // Parse PNG chunks to extract IDAT data
    if (pngData.length < 8) return null;
    let offset = 8; // skip PNG signature
    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    const idatChunks: Buffer[] = [];

    while (offset < pngData.length - 4) {
      const chunkLen = pngData.readUInt32BE(offset);
      const chunkType = pngData.subarray(offset + 4, offset + 8).toString('ascii');

      if (chunkType === 'IHDR') {
        width = pngData.readUInt32BE(offset + 8);
        height = pngData.readUInt32BE(offset + 12);
        bitDepth = pngData[offset + 16]!;
        colorType = pngData[offset + 17]!;
      } else if (chunkType === 'IDAT') {
        idatChunks.push(pngData.subarray(offset + 8, offset + 8 + chunkLen));
      } else if (chunkType === 'IEND') {
        break;
      }

      offset += 12 + chunkLen; // length(4) + type(4) + data + crc(4)
    }

    if (width === 0 || height === 0 || idatChunks.length === 0) return null;
    if (bitDepth !== 8) return null; // only support 8-bit

    const hasAlpha = colorType === 6; // RGBA
    const isRgb = colorType === 2; // RGB
    if (!hasAlpha && !isRgb) return null; // only RGB/RGBA

    const compressed = Buffer.concat(idatChunks);
    const raw = zlib.inflateSync(compressed);

    const channels = hasAlpha ? 4 : 3;
    const bytesPerRow = width * channels;
    const rgb = Buffer.alloc(width * height * 3);
    let rgbIdx = 0;
    let prevRow = Buffer.alloc(bytesPerRow);

    for (let y = 0; y < height; y++) {
      const filterByte = raw[y * (bytesPerRow + 1)]!;
      const rowStart = y * (bytesPerRow + 1) + 1;
      const row = Buffer.alloc(bytesPerRow);

      // Copy raw row data
      raw.copy(row, 0, rowStart, rowStart + bytesPerRow);

      // Apply PNG filter
      if (filterByte === 1) {
        // Sub
        for (let i = channels; i < bytesPerRow; i++) {
          row[i] = (row[i]! + row[i - channels]!) & 0xff;
        }
      } else if (filterByte === 2) {
        // Up
        for (let i = 0; i < bytesPerRow; i++) {
          row[i] = (row[i]! + prevRow[i]!) & 0xff;
        }
      } else if (filterByte === 3) {
        // Average
        for (let i = 0; i < bytesPerRow; i++) {
          const a = i >= channels ? row[i - channels]! : 0;
          const b = prevRow[i]!;
          row[i] = (row[i]! + Math.floor((a + b) / 2)) & 0xff;
        }
      } else if (filterByte === 4) {
        // Paeth
        for (let i = 0; i < bytesPerRow; i++) {
          const a = i >= channels ? row[i - channels]! : 0;
          const b = prevRow[i]!;
          const c = i >= channels ? prevRow[i - channels]! : 0;
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          row[i] = (row[i]! + pr) & 0xff;
        }
      }
      // filterByte === 0 means None, no transformation needed

      // Extract RGB (skip Alpha if RGBA)
      for (let x = 0; x < width; x++) {
        rgb[rgbIdx++] = row[x * channels]!;
        rgb[rgbIdx++] = row[x * channels + 1]!;
        rgb[rgbIdx++] = row[x * channels + 2]!;
      }

      prevRow = row;
    }

    return { rgb, hasAlpha };
  } catch {
    return null;
  }
};

const loadSignatureImage = (
  cheminImage: string | undefined | null,
  name: string,
  objectId: number,
): PdfImage | null => {
  if (!cheminImage) return null;
  const absPath = path.join(process.cwd(), cheminImage);
  if (!fs.existsSync(absPath)) return null;
  const data = fs.readFileSync(absPath);
  if (data.length < 24) return null;

  const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;

  if (isPng) {
    const width = data.readUInt32BE(16);
    const height = data.readUInt32BE(20);
    return { name, objectId, width: width || 200, height: height || 80, data, isPng: true };
  }

  // JPEG: read dimensions from SOF0/SOF2 markers
  let width = 200;
  let height = 80;
  for (let i = 0; i < data.length - 8; i++) {
    if (data[i] === 0xff && (data[i + 1] === 0xc0 || data[i + 1] === 0xc2)) {
      height = data.readUInt16BE(i + 5);
      width = data.readUInt16BE(i + 7);
      break;
    }
  }
  return { name, objectId, width, height, data };
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

  if (type === 'devis') {
    renderDevis(ctx, mission, renfordName, totalHours, totalHt, commissionHt);
  }

  if (type === 'facture_prestation') {
    renderFacturePrestation(ctx, mission, renfordName, totalHours, totalHt);
  }

  if (type === 'facture_commission') {
    renderFactureCommission(ctx, mission, renfordName, totalHours, totalHt, commissionHt);
  }

  if (type === 'contrat_prestation') {
    const sigRenford = (missionRenford as any).signatureContratPrestationRenford;
    const sigEtab = (missionRenford as any).signatureContratPrestationEtablissement;
    const maxImgId = 100;
    const sigRenfordImage = loadSignatureImage(sigRenford?.cheminImage, 'SigR', maxImgId);
    const sigEtabImage = loadSignatureImage(sigEtab?.cheminImage, 'SigE', maxImgId + 1);
    if (sigRenfordImage) ctx.images.push(sigRenfordImage);
    if (sigEtabImage) ctx.images.push(sigEtabImage);
    renderContrat(ctx, mission, missionRenford, totalHours, sigRenfordImage, sigEtabImage);
  }

  if (type === 'attestation_mission') {
    renderAttestation(ctx, mission, missionRenford, totalHours);
  }

  return buildPdfBuffer(ctx);
};
