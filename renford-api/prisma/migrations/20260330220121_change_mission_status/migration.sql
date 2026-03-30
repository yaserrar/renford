/*
  Warnings:

  - The values [envoyee,en_cours_de_matching,proposee,acceptee,contrat_signe,payee,en_cours,a_valider,validee,terminee,en_attente_paiement] on the enum `StatutMission` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatutMissionRenford" AS ENUM ('propose', 'accepte', 'refuse', 'shortliste', 'selectionne', 'contrat_envoye', 'contrat_signe', 'en_cours', 'termine', 'annule');

-- AlterEnum
BEGIN;
CREATE TYPE "StatutMission_new" AS ENUM ('brouillon', 'ajouter_mode_paiement', 'en_recherche', 'candidatures_disponibles', 'attente_de_signature', 'mission_en_cours', 'remplacement_en_cours', 'en_litige', 'mission_terminee', 'archivee', 'annulee');
ALTER TABLE "public"."missions" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "missions" ALTER COLUMN "statut" TYPE "StatutMission_new" USING ("statut"::text::"StatutMission_new");
ALTER TYPE "StatutMission" RENAME TO "StatutMission_old";
ALTER TYPE "StatutMission_new" RENAME TO "StatutMission";
DROP TYPE "public"."StatutMission_old";
ALTER TABLE "missions" ALTER COLUMN "statut" SET DEFAULT 'en_recherche';
COMMIT;

-- AlterTable
ALTER TABLE "missions" ALTER COLUMN "statut" SET DEFAULT 'en_recherche';

-- CreateTable
CREATE TABLE "missions_renfords" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "statut" "StatutMissionRenford" NOT NULL DEFAULT 'propose',
    "estShortliste" BOOLEAN NOT NULL DEFAULT false,
    "ordreShortlist" INTEGER,
    "dateProposition" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateReponse" TIMESTAMP(3),
    "dateContratSigne" TIMESTAMP(3),
    "lienVisio" TEXT,
    "dateVisio" TIMESTAMP(3),
    "visioEffectuee" BOOLEAN NOT NULL DEFAULT false,
    "tarifNegocie" DECIMAL(8,2),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_renfords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "missions_renfords_missionId_idx" ON "missions_renfords"("missionId");

-- CreateIndex
CREATE INDEX "missions_renfords_profilRenfordId_idx" ON "missions_renfords"("profilRenfordId");

-- CreateIndex
CREATE INDEX "missions_renfords_statut_idx" ON "missions_renfords"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "missions_renfords_missionId_profilRenfordId_key" ON "missions_renfords"("missionId", "profilRenfordId");

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
