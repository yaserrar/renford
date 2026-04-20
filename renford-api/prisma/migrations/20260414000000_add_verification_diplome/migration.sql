-- AlterTable
ALTER TABLE "renford_diplomes" ADD COLUMN "verifie" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "renford_diplomes" ADD COLUMN "dateVerification" TIMESTAMP(3);
