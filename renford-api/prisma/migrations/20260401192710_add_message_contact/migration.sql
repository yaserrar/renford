-- CreateTable
CREATE TABLE "messages_contact" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "traite" BOOLEAN NOT NULL DEFAULT false,
    "traiteA" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_contact_utilisateurId_idx" ON "messages_contact"("utilisateurId");

-- CreateIndex
CREATE INDEX "messages_contact_traite_idx" ON "messages_contact"("traite");

-- AddForeignKey
ALTER TABLE "messages_contact" ADD CONSTRAINT "messages_contact_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
