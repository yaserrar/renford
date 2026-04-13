-- CreateTable
CREATE TABLE "evaluations_renfords" (
    "id" TEXT NOT NULL,
    "missionRenfordId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_renfords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_renfords_missionRenfordId_key" ON "evaluations_renfords"("missionRenfordId");

-- CreateIndex
CREATE INDEX "evaluations_renfords_missionRenfordId_idx" ON "evaluations_renfords"("missionRenfordId");

-- AddForeignKey
ALTER TABLE "evaluations_renfords" ADD CONSTRAINT "evaluations_renfords_missionRenfordId_fkey" FOREIGN KEY ("missionRenfordId") REFERENCES "missions_renfords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
