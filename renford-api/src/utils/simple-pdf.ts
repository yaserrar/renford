const escapePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

export const buildSimplePdf = (lines: string[]): Buffer => {
  const normalized = lines.map((line) => escapePdfText(line || ' '));

  // Basic one-page PDF content stream using Helvetica.
  let y = 790;
  const lineHeight = 16;
  const textOps = normalized
    .map((line) => {
      const op = `BT /F1 11 Tf 50 ${y} Td (${line}) Tj ET`;
      y -= lineHeight;
      return op;
    })
    .join('\n');

  const stream = `${textOps}\n`;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let offset = 0;
  const header = '%PDF-1.4\n';
  offset += Buffer.byteLength(header, 'utf8');

  const xrefOffsets = [0];
  for (const object of objects) {
    xrefOffsets.push(offset);
    offset += Buffer.byteLength(object, 'utf8');
  }

  const xrefStart = offset;
  const xref = [
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...xrefOffsets.slice(1).map((o) => `${o.toString().padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    'startxref',
    `${xrefStart}`,
    '%%EOF',
  ].join('\n');

  const pdf = header + objects.join('') + xref;
  return Buffer.from(pdf, 'utf8');
};
