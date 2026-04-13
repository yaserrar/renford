-- AlterTable: Replace local signature paths with Odoo Sign fields
ALTER TABLE "missions_renfords" DROP COLUMN IF EXISTS "signatureContratPrestationRenfordChemin";
ALTER TABLE "missions_renfords" DROP COLUMN IF EXISTS "signatureContratPrestationEtablissementChemin";
ALTER TABLE "missions_renfords" DROP COLUMN IF EXISTS "signatureAttestationMissionRenfordChemin";
ALTER TABLE "missions_renfords" DROP COLUMN IF EXISTS "signatureAttestationMissionEtablissementChemin";

-- Odoo Sign – Contrat de prestation
ALTER TABLE "missions_renfords" ADD COLUMN "odooContratSignRequestId" INTEGER;
ALTER TABLE "missions_renfords" ADD COLUMN "odooContratTemplateId" INTEGER;
ALTER TABLE "missions_renfords" ADD COLUMN "odooContratSignedPdfPath" TEXT;

-- Odoo Sign – Attestation de mission
ALTER TABLE "missions_renfords" ADD COLUMN "odooAttestationSignRequestId" INTEGER;
ALTER TABLE "missions_renfords" ADD COLUMN "odooAttestationTemplateId" INTEGER;
ALTER TABLE "missions_renfords" ADD COLUMN "odooAttestationSignedPdfPath" TEXT;
