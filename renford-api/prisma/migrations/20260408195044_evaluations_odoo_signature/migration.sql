/*
  Warnings:

  - You are about to drop the column `dateDebut` on the `indisponibilites_renford` table. All the data in the column will be lost.
  - You are about to drop the column `dateFin` on the `indisponibilites_renford` table. All the data in the column will be lost.
  - You are about to drop the column `dateMiseAJour` on the `indisponibilites_renford` table. All the data in the column will be lost.
  - You are about to drop the column `repetition` on the `indisponibilites_renford` table. All the data in the column will be lost.
  - The `heureDebut` column on the `indisponibilites_renford` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `heureFin` column on the `indisponibilites_renford` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `signatureAttestationMissionEtablissementChemin` on the `missions_renfords` table. All the data in the column will be lost.
  - You are about to drop the column `signatureAttestationMissionRenfordChemin` on the `missions_renfords` table. All the data in the column will be lost.
  - You are about to drop the column `signatureContratPrestationEtablissementChemin` on the `missions_renfords` table. All the data in the column will be lost.
  - You are about to drop the column `signatureContratPrestationRenfordChemin` on the `missions_renfords` table. All the data in the column will be lost.
  - Added the required column `date` to the `indisponibilites_renford` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."indisponibilites_renford_dateDebut_dateFin_idx";

-- AlterTable
ALTER TABLE "indisponibilites_renford" DROP COLUMN "dateDebut",
DROP COLUMN "dateFin",
DROP COLUMN "dateMiseAJour",
DROP COLUMN "repetition",
ADD COLUMN     "date" DATE NOT NULL,
DROP COLUMN "heureDebut",
ADD COLUMN     "heureDebut" INTEGER,
DROP COLUMN "heureFin",
ADD COLUMN     "heureFin" INTEGER;

-- AlterTable
ALTER TABLE "missions_renfords" DROP COLUMN "signatureAttestationMissionEtablissementChemin",
DROP COLUMN "signatureAttestationMissionRenfordChemin",
DROP COLUMN "signatureContratPrestationEtablissementChemin",
DROP COLUMN "signatureContratPrestationRenfordChemin",
ADD COLUMN     "odooAttestationSignRequestId" INTEGER,
ADD COLUMN     "odooAttestationSignedPdfPath" TEXT,
ADD COLUMN     "odooAttestationTemplateId" INTEGER,
ADD COLUMN     "odooContratSignRequestId" INTEGER,
ADD COLUMN     "odooContratSignedPdfPath" TEXT,
ADD COLUMN     "odooContratTemplateId" INTEGER;

-- DropEnum
DROP TYPE "public"."RepetitionIndisponibilite";

-- CreateTable
CREATE TABLE "evaluations_renfords" (
    "id" TEXT NOT NULL,
    "missionRenfordId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_renfords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_renfords_missionRenfordId_key" ON "evaluations_renfords"("missionRenfordId");

-- CreateIndex
CREATE INDEX "evaluations_renfords_missionRenfordId_idx" ON "evaluations_renfords"("missionRenfordId");

-- CreateIndex
CREATE INDEX "indisponibilites_renford_profilRenfordId_date_idx" ON "indisponibilites_renford"("profilRenfordId", "date");

-- AddForeignKey
ALTER TABLE "evaluations_renfords" ADD CONSTRAINT "evaluations_renfords_missionRenfordId_fkey" FOREIGN KEY ("missionRenfordId") REFERENCES "missions_renfords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
