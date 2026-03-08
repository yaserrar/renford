ALTER TABLE "experiences_professionnelles_renford"
ADD COLUMN "dateFin" DATE;

UPDATE "experiences_professionnelles_renford"
SET "dateFin" = make_date("anneeFin", 12, 31)
WHERE "anneeFin" IS NOT NULL;

ALTER TABLE "experiences_professionnelles_renford"
DROP COLUMN "anneeFin";