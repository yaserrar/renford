/*
  Warnings:

  - You are about to drop the column `departement` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `etablissementPrincipalId` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `nomGroupePrincipal` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `etablissements` table. All the data in the column will be lost.
  - You are about to drop the column `emailPrincipal` on the `profils_etablissement` table. All the data in the column will be lost.
  - You are about to drop the column `nomContactPrincipal` on the `profils_etablissement` table. All the data in the column will be lost.
  - You are about to drop the column `telephonePrincipal` on the `profils_etablissement` table. All the data in the column will be lost.
  - You are about to drop the `departements_adjacents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adresseFacturation` to the `etablissements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostalFacturation` to the `etablissements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siret` to the `etablissements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villeFacturation` to the `etablissements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."etablissements" DROP CONSTRAINT "etablissements_etablissementPrincipalId_fkey";

-- DropIndex
DROP INDEX "public"."etablissements_departement_idx";

-- AlterTable
ALTER TABLE "etablissements" DROP COLUMN "departement",
DROP COLUMN "email",
DROP COLUMN "etablissementPrincipalId",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "nomGroupePrincipal",
DROP COLUMN "telephone",
ADD COLUMN     "adresseFacturation" TEXT NOT NULL,
ADD COLUMN     "adresseFacturationDifferente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adresseFacturationLigne2" TEXT,
ADD COLUMN     "codePostalFacturation" TEXT NOT NULL,
ADD COLUMN     "emailPrincipal" TEXT,
ADD COLUMN     "nomContactPrincipal" TEXT,
ADD COLUMN     "prenomContactPrincipal" TEXT,
ADD COLUMN     "siret" TEXT NOT NULL,
ADD COLUMN     "telephonePrincipal" TEXT,
ADD COLUMN     "villeFacturation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profils_etablissement" DROP COLUMN "emailPrincipal",
DROP COLUMN "nomContactPrincipal",
DROP COLUMN "telephonePrincipal";

-- DropTable
DROP TABLE "public"."departements_adjacents";

-- DropEnum
DROP TYPE "public"."DepartementIDF";
