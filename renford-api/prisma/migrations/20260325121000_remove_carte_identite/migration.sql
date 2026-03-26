-- Remove identity card document field from Renford profile
ALTER TABLE "profils_renford"
DROP COLUMN IF EXISTS "carteIdentiteChemin";
