-- AlterTable
ALTER TABLE "missions"
ADD COLUMN "dateDerniereRechercheRenford" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "missions_dateDerniereRechercheRenford_idx" ON "missions"("dateDerniereRechercheRenford");
