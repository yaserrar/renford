/*
  Warnings:

  - The values [volant,mission_longue,les_deux] on the enum `TypeMission` will be removed. If these variants are still used in the database, this will fail.
  - Changed the column `typeMission` on the `profils_renford` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeMission_new" AS ENUM ('coaching_individuel', 'sessions_en_groupe', 'ateliers_workshops', 'evenements_speciaux', 'remplacement_temporaire', 'consultation_accompagnement', 'programmes_specifiques', 'encadrement_enfants_adolescents', 'formation_certification', 'maintenance_gestion_equipements', 'suivi_evaluation_clients', 'encadrement_competitions', 'animation_activites_loisirs', 'seances_initiation', 'consulting_amelioration_performances');
ALTER TABLE "profils_renford"
ADD COLUMN "typeMission_tmp" "TypeMission_new"[] NOT NULL DEFAULT ARRAY[]::"TypeMission_new"[];

UPDATE "profils_renford"
SET "typeMission_tmp" = CASE
  WHEN "typeMission" = 'volant' THEN ARRAY['remplacement_temporaire'::"TypeMission_new"]
  WHEN "typeMission" = 'mission_longue' THEN ARRAY['consultation_accompagnement'::"TypeMission_new"]
  WHEN "typeMission" = 'les_deux' THEN ARRAY['remplacement_temporaire'::"TypeMission_new", 'consultation_accompagnement'::"TypeMission_new"]
  ELSE ARRAY[]::"TypeMission_new"[]
END;

ALTER TABLE "profils_renford" DROP COLUMN "typeMission";
ALTER TABLE "profils_renford" RENAME COLUMN "typeMission_tmp" TO "typeMission";
ALTER TYPE "TypeMission" RENAME TO "TypeMission_old";
ALTER TYPE "TypeMission_new" RENAME TO "TypeMission";
DROP TYPE "public"."TypeMission_old";
COMMIT;

-- AlterTable
ALTER TABLE "profils_renford" ALTER COLUMN "typeMission" SET DEFAULT ARRAY[]::"TypeMission"[],
ALTER COLUMN "typeMission" SET DATA TYPE "TypeMission"[];
