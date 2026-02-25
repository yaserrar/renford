/*
  Warnings:

  - The `diplomes` column on the `profils_renford` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "profils_renford" DROP COLUMN "diplomes",
ADD COLUMN     "diplomes" TEXT[] DEFAULT ARRAY[]::TEXT[];
