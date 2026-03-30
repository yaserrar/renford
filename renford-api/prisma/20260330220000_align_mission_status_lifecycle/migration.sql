ALTER TYPE "StatutMission" RENAME TO "StatutMission_old";

CREATE TYPE "StatutMission" AS ENUM (
    'brouillon',
    'ajouter_mode_paiement',
    'en_recherche',
    'candidatures_disponibles',
    'attente_de_signature',
    'mission_en_cours',
    'remplacement_en_cours',
    'en_litige',
    'mission_terminee',
    'archivee',
    'annulee'
);

ALTER TABLE "missions"
    ALTER COLUMN "statut" DROP DEFAULT,
    ALTER COLUMN "statut" TYPE "StatutMission"
    USING (
        CASE "statut"::text
            WHEN 'brouillon' THEN 'brouillon'
            WHEN 'en_attente_paiement' THEN 'ajouter_mode_paiement'
            WHEN 'envoyee' THEN 'en_recherche'
            WHEN 'en_cours_de_matching' THEN 'en_recherche'
            WHEN 'proposee' THEN 'candidatures_disponibles'
            WHEN 'acceptee' THEN 'attente_de_signature'
            WHEN 'contrat_signe' THEN 'mission_en_cours'
            WHEN 'payee' THEN 'mission_en_cours'
            WHEN 'en_cours' THEN 'mission_en_cours'
            WHEN 'a_valider' THEN 'mission_terminee'
            WHEN 'validee' THEN 'mission_terminee'
            WHEN 'terminee' THEN 'mission_terminee'
            WHEN 'archivee' THEN 'archivee'
            WHEN 'annulee' THEN 'annulee'
            ELSE 'en_recherche'
        END::"StatutMission"
    ),
    ALTER COLUMN "statut" SET DEFAULT 'en_recherche';

DROP TYPE "StatutMission_old";