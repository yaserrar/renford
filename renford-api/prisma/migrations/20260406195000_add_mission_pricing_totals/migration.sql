-- AlterTable
ALTER TABLE "missions"
ADD COLUMN "montantHT" DECIMAL(10,2),
ADD COLUMN "montantFraisService" DECIMAL(10,2),
ADD COLUMN "montantTTC" DECIMAL(10,2);
