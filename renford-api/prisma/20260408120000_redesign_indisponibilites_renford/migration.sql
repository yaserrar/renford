-- DropIndex
DROP INDEX IF EXISTS "indisponibilites_renford_dateDebut_dateFin_idx";

-- AlterTable: remove old columns, add new columns
ALTER TABLE "indisponibilites_renford" DROP COLUMN "dateFin",
DROP COLUMN "repetition",
DROP COLUMN "dateMiseAJour";

-- Rename dateDebut to date
ALTER TABLE "indisponibilites_renford" RENAME COLUMN "dateDebut" TO "date";

-- Change heureDebut and heureFin from TEXT to INTEGER
ALTER TABLE "indisponibilites_renford" ALTER COLUMN "heureDebut" TYPE INTEGER USING (
    CASE
        WHEN "heureDebut" IS NOT NULL THEN
            CAST(SPLIT_PART("heureDebut", ':', 1) AS INTEGER) * 60 +
            CAST(SPLIT_PART("heureDebut", ':', 2) AS INTEGER)
        ELSE NULL
    END
);

ALTER TABLE "indisponibilites_renford" ALTER COLUMN "heureFin" TYPE INTEGER USING (
    CASE
        WHEN "heureFin" IS NOT NULL THEN
            CAST(SPLIT_PART("heureFin", ':', 1) AS INTEGER) * 60 +
            CAST(SPLIT_PART("heureFin", ':', 2) AS INTEGER)
        ELSE NULL
    END
);

-- CreateIndex
CREATE INDEX "indisponibilites_renford_profilRenfordId_date_idx" ON "indisponibilites_renford"("profilRenfordId", "date");

-- DropEnum (only if no other table references it)
DROP TYPE IF EXISTS "RepetitionIndisponibilite";
