-- AlterTable
ALTER TABLE "missions" ADD COLUMN "dateTerminee" TIMESTAMP(3);
ALTER TABLE "missions" ADD COLUMN "dateCloturee" TIMESTAMP(3);
ALTER TABLE "missions" ADD COLUMN "dateAnnulee" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "missions_renfords" ADD COLUMN "dateAnnulation" TIMESTAMP(3);
