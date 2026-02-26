/*
  Warnings:

  - You are about to drop the column `creneaux` on the `profils_renford` table. All the data in the column will be lost.
  - You are about to drop the column `joursDisponibles` on the `profils_renford` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CreneauDisponibilite" AS ENUM ('matin', 'midi', 'apres_midi', 'soir');

-- AlterTable
ALTER TABLE "profils_renford" DROP COLUMN "creneaux",
DROP COLUMN "joursDisponibles",
ADD COLUMN     "disponibilitesDimanche" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesJeudi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesLundi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesMardi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesMercredi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesSamedi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
ADD COLUMN     "disponibilitesVendredi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[];
