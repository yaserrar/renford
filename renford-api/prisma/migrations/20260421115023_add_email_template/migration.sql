-- CreateEnum
CREATE TYPE "TypeEmailTemplate" AS ENUM ('favori_invitation', 'welcome_etablissement', 'welcome_renford', 'signup_verification_code', 'reset_password_code', 'new_verification_code', 'mission_demande_confirmee_flex', 'mission_demande_confirmee_coach', 'incomplete_renford_profile_reminder', 'renford_trouve_flex', 'renford_trouve_coach', 'new_mission_renford', 'confirmation_mission_renford', 'visio_invitation_renford', 'signature_confirmation', 'account_deleted', 'fin_mission_renford_coach', 'fin_mission_renford_flex', 'fin_mission_etablissement_flex', 'fin_mission_etablissement_coach', 'rappel_mission_j1_etablissement', 'rappel_mission_j1_renford', 'rappel_mission_72h_renford', 'rappel_mission_72h_etablissement', 'mission_annulee_renford', 'profil_non_retenu_renford', 'profil_suspect', 'profil_suspect_2', 'contrat_a_signer_etablissement', 'contrat_a_signer_renford', 'contrat_signe_etablissement_coach', 'contrat_signe_etablissement_flex', 'profil_accepte_etablissement_coach', 'programmer_echange_etablissement', 'profils_tous_refuses_etablissement', 'apres_visio_etablissement', 'apres_visio_renford', 'apres_confirmation_renford_coach', 'refus_renford_coach', 'profil_annule_etablissement', 'mission_annulee_par_renford_etablissement', 'changement_signale_etablissement', 'changement_signale_renford', 'abonnement_activation', 'abonnement_renewal', 'abonnement_cancellation', 'abonnement_payment_failed');

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "type" "TypeEmailTemplate" NOT NULL,
    "sujet" TEXT,
    "titre" TEXT,
    "intro" TEXT,
    "corps" TEXT,
    "closing" TEXT,
    "ctaLabel" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_type_key" ON "email_templates"("type");
