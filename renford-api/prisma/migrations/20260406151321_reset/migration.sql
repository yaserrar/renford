/*
  Warnings:

  - You are about to drop the column `BICCompteBancaire` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `IBANCompteBancaire` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `autorisationDebit` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `autorisationPrelevement` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `cvvCarte` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `dateAutorisationDebit` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `dateAutorisationPrelevement` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `dateExpirationCarte` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `numeroCarteBancaire` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `titulaireCarteBancaire` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `titulaireCompteBancaire` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `typePaiement` on the `missions` table. All the data in the column will be lost.
  - You are about to drop the column `iban` on the `profils_renford` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `profils_etablissement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeConnectAccountId]` on the table `profils_renford` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('en_attente', 'en_cours', 'bloque', 'libere', 'rembourse', 'echoue', 'conteste');

-- AlterTable
ALTER TABLE "missions" DROP COLUMN "BICCompteBancaire",
DROP COLUMN "IBANCompteBancaire",
DROP COLUMN "autorisationDebit",
DROP COLUMN "autorisationPrelevement",
DROP COLUMN "cvvCarte",
DROP COLUMN "dateAutorisationDebit",
DROP COLUMN "dateAutorisationPrelevement",
DROP COLUMN "dateExpirationCarte",
DROP COLUMN "numeroCarteBancaire",
DROP COLUMN "titulaireCarteBancaire",
DROP COLUMN "titulaireCompteBancaire",
DROP COLUMN "typePaiement";

-- AlterTable
ALTER TABLE "profils_etablissement" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "profils_renford" DROP COLUMN "iban",
ADD COLUMN     "stripeConnectAccountId" TEXT,
ADD COLUMN     "stripeConnectOnboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "public"."TypePaiement";

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "montantHT" DECIMAL(10,2) NOT NULL,
    "montantTVA" DECIMAL(10,2) NOT NULL,
    "montantTTC" DECIMAL(10,2) NOT NULL,
    "montantCommission" DECIMAL(10,2) NOT NULL,
    "montantNetRenford" DECIMAL(10,2) NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'en_attente',
    "stripePaymentIntentId" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "stripeChargeId" TEXT,
    "stripeTransferId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCapture" TIMESTAMP(3),
    "dateLiberation" TIMESTAMP(3),
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paiements_reference_key" ON "paiements"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "paiements_stripePaymentIntentId_key" ON "paiements"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "paiements_stripeCheckoutSessionId_key" ON "paiements"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "paiements_missionId_idx" ON "paiements"("missionId");

-- CreateIndex
CREATE INDEX "paiements_statut_idx" ON "paiements"("statut");

-- CreateIndex
CREATE INDEX "paiements_stripePaymentIntentId_idx" ON "paiements"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "paiements_stripeCheckoutSessionId_idx" ON "paiements"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "profils_etablissement_stripeCustomerId_key" ON "profils_etablissement"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "profils_renford_stripeConnectAccountId_key" ON "profils_renford"("stripeConnectAccountId");

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
