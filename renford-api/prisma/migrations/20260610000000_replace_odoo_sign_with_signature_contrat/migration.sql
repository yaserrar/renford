-- CreateEnum
CREATE TYPE "RoleSignataire" AS ENUM ('renford', 'etablissement');

-- CreateEnum
CREATE TYPE "SourceSignature" AS ENUM ('web', 'mobile');

-- AlterTable
ALTER TABLE "missions_renfords" DROP COLUMN "odooAttestationSignRequestId",
DROP COLUMN "odooAttestationSignedPdfPath",
DROP COLUMN "odooAttestationTemplateId",
DROP COLUMN "odooContratSignRequestId",
DROP COLUMN "odooContratSignedPdfPath",
DROP COLUMN "odooContratTemplateId",
ADD COLUMN     "signatureContratPrestationEtablissementId" TEXT,
ADD COLUMN     "signatureContratPrestationRenfordId" TEXT;

-- CreateTable
CREATE TABLE "signatures_contrats" (
    "id" TEXT NOT NULL,
    "cheminImage" TEXT NOT NULL,
    "nomSignataire" TEXT NOT NULL,
    "emailSignataire" TEXT NOT NULL,
    "roleSignataire" "RoleSignataire" NOT NULL,
    "lienCgu" TEXT NOT NULL,
    "source" "SourceSignature" NOT NULL DEFAULT 'web',
    "adresseIp" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_contrats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "signatures_contrats_emailSignataire_idx" ON "signatures_contrats"("emailSignataire");

-- CreateIndex
CREATE INDEX "signatures_contrats_dateCreation_idx" ON "signatures_contrats"("dateCreation");

-- CreateIndex
CREATE UNIQUE INDEX "missions_renfords_signatureContratPrestationRenfordId_key" ON "missions_renfords"("signatureContratPrestationRenfordId");

-- CreateIndex
CREATE UNIQUE INDEX "missions_renfords_signatureContratPrestationEtablissementId_key" ON "missions_renfords"("signatureContratPrestationEtablissementId");

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_signatureContratPrestationRenfordId_fkey" FOREIGN KEY ("signatureContratPrestationRenfordId") REFERENCES "signatures_contrats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_signatureContratPrestationEtablissementI_fkey" FOREIGN KEY ("signatureContratPrestationEtablissementId") REFERENCES "signatures_contrats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
