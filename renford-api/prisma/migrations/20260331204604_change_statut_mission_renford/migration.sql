/*
  Warnings:

  - The values [propose,accepte,refuse,selectionne,contrat_envoye,en_cours,termine] on the enum `StatutMissionRenford` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatutMissionRenford_new" AS ENUM ('shortliste', 'nouveau', 'vu', 'refuse_par_renford', 'selection_en_cours', 'attente_de_signature', 'refuse_par_etablissement', 'contrat_signe', 'mission_en_cours', 'mission_terminee', 'annule');
ALTER TABLE "public"."missions_renfords" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "missions_renfords" ALTER COLUMN "statut" TYPE "StatutMissionRenford_new" USING ("statut"::text::"StatutMissionRenford_new");
ALTER TYPE "StatutMissionRenford" RENAME TO "StatutMissionRenford_old";
ALTER TYPE "StatutMissionRenford_new" RENAME TO "StatutMissionRenford";
DROP TYPE "public"."StatutMissionRenford_old";
ALTER TABLE "missions_renfords" ALTER COLUMN "statut" SET DEFAULT 'shortliste';
COMMIT;

-- AlterTable
ALTER TABLE "missions_renfords" ALTER COLUMN "statut" SET DEFAULT 'shortliste';
