BEGIN;

DO $$
BEGIN
    CREATE TYPE "TypeNotificationPreference" AS ENUM (
        'marketing',
        'annonces_mises_ajours',
        'support',
        'missions'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "utilisateurs"
ADD COLUMN "notificationsEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "typeNotificationsEmail" "TypeNotificationPreference"[] NOT NULL DEFAULT ARRAY[]::"TypeNotificationPreference"[],
ADD COLUMN "notificationsMobile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "typeNotificationsMobile" "TypeNotificationPreference"[] NOT NULL DEFAULT ARRAY[]::"TypeNotificationPreference"[],
ADD COLUMN "avatarChemin" TEXT;

ALTER TABLE "etablissements"
ADD COLUMN "pays" TEXT NOT NULL DEFAULT 'France';

ALTER TABLE "profils_etablissement"
ADD COLUMN "aPropos" TEXT;

ALTER TABLE "profils_renford"
ADD COLUMN "aPropos" TEXT,
ADD COLUMN "telephone" TEXT,
ADD COLUMN "portfolio" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "tjm" DECIMAL(8,2);

ALTER TABLE "renford_diplomes"
ADD COLUMN IF NOT EXISTS "justificatifDiplomeChemin" TEXT;

INSERT INTO "renford_diplomes" (
    "id",
    "profilRenfordId",
    "typeDiplome",
    "justificatifDiplomeChemin",
    "nomDiplome",
    "mention",
    "anneeObtention",
    "etablissementFormation",
    "dateCreation",
    "dateMiseAJour"
)
SELECT
    CONCAT(pr."id", '-diplome-', diplome_entry.ord::text),
    pr."id",
    diplome_entry.value,
    justificatif_entry.value,
    '',
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
FROM "profils_renford" pr
JOIN LATERAL UNNEST(COALESCE(pr."diplomes", ARRAY[]::"Diplome"[])) WITH ORDINALITY AS diplome_entry(value, ord)
    ON TRUE
LEFT JOIN LATERAL UNNEST(COALESCE(pr."justificatifDiplomeChemins", ARRAY[]::TEXT[])) WITH ORDINALITY AS justificatif_entry(value, ord)
    ON justificatif_entry.ord = diplome_entry.ord;

ALTER TABLE "profils_renford"
DROP COLUMN "diplomes",
DROP COLUMN "justificatifDiplomeChemins";

CREATE TABLE "experiences_professionnelles_renford" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "missions" TEXT NOT NULL,
    "dateDebut" DATE NOT NULL,
    "anneeFin" INTEGER,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_professionnelles_renford_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "experiences_professionnelles_renford_profilRenfordId_idx" ON "experiences_professionnelles_renford"("profilRenfordId");

ALTER TABLE "experiences_professionnelles_renford"
ADD CONSTRAINT "experiences_professionnelles_renford_profilRenfordId_fkey"
FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
