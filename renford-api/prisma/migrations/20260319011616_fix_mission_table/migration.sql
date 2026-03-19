/*
  Warnings:

  - You are about to drop the column `pays` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `photoProfil` on the `profils_renford` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `profils_renford` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ModeMission" AS ENUM ('flex', 'coach');

-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('pilates', 'yoga', 'fitness_musculation', 'programmes_les_mills', 'zumba', 'animation_sportive_multisport', 'escalade', 'boxe_arts_martiaux', 'danse', 'bien_etre_sport_sante');

-- CreateEnum
CREATE TYPE "StatutMission" AS ENUM ('envoyee', 'en_cours_de_matching', 'proposee', 'acceptee', 'contrat_signe', 'payee', 'en_cours', 'a_valider', 'validee', 'terminee', 'archivee', 'annulee');

-- CreateEnum
CREATE TYPE "MethodeTarification" AS ENUM ('horaire', 'journee', 'demi_journee');

-- CreateEnum
CREATE TYPE "TypePaiement" AS ENUM ('carte_bancaire', 'prelevement_sepa');

-- AlterEnum
ALTER TYPE "NiveauExperience" ADD VALUE 'peut_importe';

-- AlterTable
ALTER TABLE "etablissements" DROP COLUMN "pays";

-- AlterTable
ALTER TABLE "profils_renford" DROP COLUMN "photoProfil",
DROP COLUMN "telephone";

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "statut" "StatutMission" NOT NULL DEFAULT 'envoyee',
    "modeMission" "ModeMission" NOT NULL DEFAULT 'flex',
    "discipline" "Discipline" NOT NULL DEFAULT 'pilates',
    "specialitePrincipale" "TypeMission" NOT NULL DEFAULT 'matwork',
    "specialitesSecondaires" "TypeMission"[] DEFAULT ARRAY[]::"TypeMission"[],
    "niveauExperienceRequis" "NiveauExperience" DEFAULT 'debutant',
    "assuranceObligatoire" BOOLEAN NOT NULL DEFAULT false,
    "materielsRequis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "etablissementId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "methodeTarification" "MethodeTarification" NOT NULL DEFAULT 'horaire',
    "tarif" DECIMAL(10,2),
    "pourcentageVariationTarif" DECIMAL(5,2),
    "typePaiement" "TypePaiement" NOT NULL DEFAULT 'carte_bancaire',
    "titulaireCarteBancaire" TEXT,
    "numeroCarteBancaire" TEXT,
    "dateExpirationCarte" TEXT,
    "cvvCarte" TEXT,
    "autorisationDebit" BOOLEAN NOT NULL DEFAULT false,
    "dateAutorisationDebit" TIMESTAMP(3),
    "titulaireCompteBancaire" TEXT,
    "IBANCompteBancaire" TEXT,
    "BICCompteBancaire" TEXT,
    "autorisationPrelevement" BOOLEAN NOT NULL DEFAULT false,
    "dateAutorisationPrelevement" TIMESTAMP(3),

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plages_horaires_mission" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plages_horaires_mission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "missions_etablissementId_idx" ON "missions"("etablissementId");

-- CreateIndex
CREATE INDEX "missions_statut_idx" ON "missions"("statut");

-- CreateIndex
CREATE INDEX "missions_modeMission_idx" ON "missions"("modeMission");

-- CreateIndex
CREATE INDEX "missions_dateDebut_idx" ON "missions"("dateDebut");

-- CreateIndex
CREATE INDEX "missions_dateFin_idx" ON "missions"("dateFin");

-- CreateIndex
CREATE INDEX "plages_horaires_mission_missionId_idx" ON "plages_horaires_mission"("missionId");

-- CreateIndex
CREATE INDEX "plages_horaires_mission_date_idx" ON "plages_horaires_mission"("date");

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plages_horaires_mission" ADD CONSTRAINT "plages_horaires_mission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
