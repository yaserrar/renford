-- CreateEnum
CREATE TYPE "SourceNotification" AS ENUM (
  'missions',
  'mission_renfords',
  'etablissements',
  'renfords',
  'paiements',
  'systeme'
);

-- CreateTable
CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "utilisateurId" TEXT NOT NULL,
  "titre" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "source" "SourceNotification" NOT NULL,
  "lu" BOOLEAN NOT NULL DEFAULT false,
  "sourceId" TEXT,
  "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dateMiseAJour" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_utilisateurId_idx" ON "notifications"("utilisateurId");

-- CreateIndex
CREATE INDEX "notifications_source_idx" ON "notifications"("source");

-- CreateIndex
CREATE INDEX "notifications_lu_idx" ON "notifications"("lu");

-- CreateIndex
CREATE INDEX "notifications_source_sourceId_idx" ON "notifications"("source", "sourceId");

-- AddForeignKey
ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_utilisateurId_fkey"
FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
