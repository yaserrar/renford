/*
  Warnings:

  - You are about to drop the column `justificatifDiplomeChemin` on the `profils_renford` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profils_renford" DROP COLUMN "justificatifDiplomeChemin",
ADD COLUMN     "justificatifDiplomeChemins" TEXT[] DEFAULT ARRAY[]::TEXT[];
