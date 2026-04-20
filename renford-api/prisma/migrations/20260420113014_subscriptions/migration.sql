-- CreateEnum
CREATE TYPE "PlanAbonnement" AS ENUM ('echauffement', 'performance', 'competition');

-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('actif', 'annule', 'expire', 'en_pause', 'en_attente');

-- CreateEnum
CREATE TYPE "TypeEvenementAbonnement" AS ENUM ('creation', 'activation', 'renouvellement', 'annulation', 'expiration', 'mise_en_pause', 'reprise', 'changement_plan', 'paiement_reussi', 'paiement_echoue', 'remboursement');

-- CreateTable
CREATE TABLE "abonnements" (
    "id" TEXT NOT NULL,
    "profilEtablissementId" TEXT NOT NULL,
    "plan" "PlanAbonnement" NOT NULL,
    "statut" "StatutAbonnement" NOT NULL DEFAULT 'en_attente',
    "quotaMissions" INTEGER NOT NULL,
    "missionsUtilisees" INTEGER NOT NULL DEFAULT 0,
    "prixMensuelHT" DECIMAL(10,2) NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "dateProchainRenouvellement" TIMESTAMP(3),
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodStart" TIMESTAMP(3),
    "stripeCurrentPeriodEnd" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abonnements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonnements_evenements" (
    "id" TEXT NOT NULL,
    "abonnementId" TEXT NOT NULL,
    "type" "TypeEvenementAbonnement" NOT NULL,
    "ancienStatut" "StatutAbonnement",
    "nouveauStatut" "StatutAbonnement",
    "montantCentimes" INTEGER,
    "stripeEventId" TEXT,
    "stripeEventType" TEXT,
    "stripeSubscriptionId" TEXT,
    "details" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abonnements_evenements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abonnements_stripeSubscriptionId_key" ON "abonnements"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "abonnements_profilEtablissementId_idx" ON "abonnements"("profilEtablissementId");

-- CreateIndex
CREATE INDEX "abonnements_statut_idx" ON "abonnements"("statut");

-- CreateIndex
CREATE INDEX "abonnements_plan_idx" ON "abonnements"("plan");

-- CreateIndex
CREATE INDEX "abonnements_evenements_abonnementId_idx" ON "abonnements_evenements"("abonnementId");

-- CreateIndex
CREATE INDEX "abonnements_evenements_stripeSubscriptionId_idx" ON "abonnements_evenements"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "abonnements_evenements_type_idx" ON "abonnements_evenements"("type");

-- CreateIndex
CREATE INDEX "abonnements_evenements_occurredAt_idx" ON "abonnements_evenements"("occurredAt");

-- AddForeignKey
ALTER TABLE "abonnements" ADD CONSTRAINT "abonnements_profilEtablissementId_fkey" FOREIGN KEY ("profilEtablissementId") REFERENCES "profils_etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonnements_evenements" ADD CONSTRAINT "abonnements_evenements_abonnementId_fkey" FOREIGN KEY ("abonnementId") REFERENCES "abonnements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
