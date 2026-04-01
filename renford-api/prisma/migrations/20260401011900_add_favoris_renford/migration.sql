-- CreateTable
CREATE TABLE "favoris_renford" (
    "id" TEXT NOT NULL,
    "profilEtablissementId" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoris_renford_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favoris_renford_profilEtablissementId_idx" ON "favoris_renford"("profilEtablissementId");

-- CreateIndex
CREATE INDEX "favoris_renford_profilRenfordId_idx" ON "favoris_renford"("profilRenfordId");

-- CreateIndex
CREATE UNIQUE INDEX "favoris_renford_profilEtablissementId_profilRenfordId_key" ON "favoris_renford"("profilEtablissementId", "profilRenfordId");

-- AddForeignKey
ALTER TABLE "favoris_renford" ADD CONSTRAINT "favoris_renford_profilEtablissementId_fkey" FOREIGN KEY ("profilEtablissementId") REFERENCES "profils_etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris_renford" ADD CONSTRAINT "favoris_renford_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;
