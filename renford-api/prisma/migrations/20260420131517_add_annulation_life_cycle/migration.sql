-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "dateAnnulee" TIMESTAMP(3),
ADD COLUMN     "dateCloturee" TIMESTAMP(3),
ADD COLUMN     "dateTerminee" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "missions_renfords" ADD COLUMN     "commentaireAnnulation" TEXT,
ADD COLUMN     "dateAnnulation" TIMESTAMP(3),
ADD COLUMN     "raisonAnnulation" TEXT;
