-- CreateEnum
CREATE TYPE "RepetitionIndisponibilite" AS ENUM ('aucune', 'tous_les_jours', 'toutes_les_semaines');

-- CreateTable
CREATE TABLE "indisponibilites_renford" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "dateDebut" DATE NOT NULL,
    "dateFin" DATE NOT NULL,
    "heureDebut" TEXT,
    "heureFin" TEXT,
    "journeeEntiere" BOOLEAN NOT NULL DEFAULT true,
    "repetition" "RepetitionIndisponibilite" NOT NULL DEFAULT 'aucune',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indisponibilites_renford_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "indisponibilites_renford_profilRenfordId_idx" ON "indisponibilites_renford"("profilRenfordId");

-- CreateIndex
CREATE INDEX "indisponibilites_renford_dateDebut_dateFin_idx" ON "indisponibilites_renford"("dateDebut", "dateFin");

-- AddForeignKey
ALTER TABLE "indisponibilites_renford" ADD CONSTRAINT "indisponibilites_renford_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;
