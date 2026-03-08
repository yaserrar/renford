-- CreateEnum
CREATE TYPE "TypeUtilisateur" AS ENUM ('etablissement', 'renford', 'administrateur');

-- CreateEnum
CREATE TYPE "StatutCompte" AS ENUM ('actif', 'suspendu', 'en_attente_verification', 'onboarding');

-- CreateEnum
CREATE TYPE "TypeNotificationPreference" AS ENUM ('marketing', 'annonces_mises_ajours', 'support', 'missions');

-- CreateEnum
CREATE TYPE "TypeEtablissement" AS ENUM ('salle_sport_gymnase', 'centre_fitness', 'studio_yoga', 'studio_pilates', 'centre_bien_etre', 'club_escalade', 'centre_sports_aquatiques', 'ecole_danse', 'centre_formation_sportive', 'club_sport_combat', 'centre_arts_martiaux', 'complexe_multisports', 'club_golf', 'club_tennis', 'centre_athletisme', 'etablissement_sports_extremes', 'centre_equestre', 'club_cyclisme', 'club_course_pied', 'club_tir_arc', 'club_voile_nautique', 'centre_musculation', 'centre_reeducation', 'stade_arene', 'association_sportive', 'complexe_loisirs', 'academie_sportive', 'ecole_surf');

-- CreateEnum
CREATE TYPE "RoleEtablissement" AS ENUM ('principal', 'secondaire');

-- CreateEnum
CREATE TYPE "StatutCertification" AS ENUM ('en_attente', 'certifie', 'rejete');

-- CreateEnum
CREATE TYPE "NiveauExperience" AS ENUM ('debutant', 'confirme', 'expert');

-- CreateEnum
CREATE TYPE "TypeMission" AS ENUM ('matwork', 'reformer', 'hot_pilates', 'cadillac', 'chair_wunda_chair', 'petits_materiels', 'pilates_prenatal_postnatal', 'lagree_fitness', 'hatha_yoga', 'vinyasa_yoga', 'ashtanga_yoga', 'yin_yoga', 'hot_yoga', 'kundalini_yoga', 'yoga_prenatal_postnatal', 'yoga_nidra', 'yoga_flow', 'qi_gong_tai_chi', 'caf_cuisses_abdos_fessiers', 'lia_low_impact_aerobic', 'step', 'hiit', 'circuit_training', 'cross_training_crossfit', 'trx', 'biking_spinning', 'body_barre', 'stretching_mobilite', 'cardio_boxing', 'bootcamp', 'gym_posturale_dos', 'ems_electrostimulation', 'preparation_physique_generale', 'body_pump', 'body_attack', 'body_combat', 'body_step', 'body_balance', 'body_jam', 'rpm', 'zumba_classique', 'zumba_kids', 'strong_toning', 'zumba_step', 'zumba_gold', 'zumba_sentoa', 'zumba_in_the_circuit', 'zumba_strong', 'aqua_zumba', 'educateur_sportif_multisport', 'animateur_sportif_enfants_ados', 'intervenant_scolaire_eps', 'animateur_sport_sante_seniors_apa', 'animateur_aquatique', 'hote_hotesse_d_accueil_sportif', 'encadrement_en_salle_bloc_voie', 'encadrement_en_milieu_naturel', 'ouvreur_de_voies_blocs', 'encadrement_escalade_performance', 'cours_enfants_ados', 'initiation_loisirs_adultes', 'boxe_anglaise', 'boxe_francaise_savate', 'kickboxing', 'karate', 'judo', 'mma', 'muay_thai', 'boxe_educative_enfants_ados', 'cardio_boxe_boxe_fitness', 'coaching_boxe_loisir_ou_competiteur', 'danse_classique', 'danse_contemporaine', 'jazz_modern_jazz', 'hip_hop_street_dance', 'ragga_dancehall', 'danses_latines_salsa_bachata', 'danse_africaine', 'danse_enfants', 'barre_au_sol', 'massages_bien_etre_sportifs', 'kinesitherapie_sportive_hors_acte_medical', 'massage_deep_tissue_recuperation', 'reflexologie', 'relaxation_coherence_cardiaque', 'sonotherapie_bains_sonores', 'sophrologie', 'meditation_pleine_conscience', 'stretch_and_mobilite_douce', 'cryotherapie_pressotherapie', 'nutrition_dietetique', 'preparation_mentale');

-- CreateEnum
CREATE TYPE "CreneauDisponibilite" AS ENUM ('matin', 'midi', 'apres_midi', 'soir');

-- CreateEnum
CREATE TYPE "Diplome" AS ENUM ('bpjeps_af_mention_cours_collectifs', 'bpjeps_af_mention_halterophilie_musculation', 'bpjeps_mapst', 'bpjeps_apt', 'bpjeps_ltp', 'bpjeps_agff_ancienne_appellation', 'dejeps_option_force_athletique_musculation', 'dejeps_perfectionnement_sportif', 'dejeps_specialite_sportive', 'desjeps_performance_sportives', 'licence_staps_management_du_sport', 'licence_staps_education_et_motricite', 'licence_staps_entrainement_sportif', 'licence_staps_apa', 'master_staps_apa', 'master_staps_entrainement_sportif', 'master_staps_preparation_physique', 'master_staps_management_du_sport', 'cqp_if_option_cours_collectifs', 'cqp_if_option_musculation_and_personal_training', 'cqp_als_option_agee', 'bees_metiers_de_la_forme', 'du_preparation_physique', 'certification_yoga', 'certification_pilates', 'certification_zumba', 'bpjeps_escalade', 'dejeps_escalade', 'cqp_escalade', 'bees_escalade', 'desjeps_escalade');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT,
    "typeUtilisateur" "TypeUtilisateur" NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "avatarChemin" TEXT,
    "statut" "StatutCompte" NOT NULL DEFAULT 'en_attente_verification',
    "etapeOnboarding" INTEGER NOT NULL DEFAULT 0,
    "emailVerifie" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifieA" TIMESTAMP(3),
    "notificationsEmail" BOOLEAN NOT NULL DEFAULT false,
    "typeNotificationsEmail" "TypeNotificationPreference"[] DEFAULT ARRAY[]::"TypeNotificationPreference"[],
    "notificationsMobile" BOOLEAN NOT NULL DEFAULT false,
    "typeNotificationsMobile" "TypeNotificationPreference"[] DEFAULT ARRAY[]::"TypeNotificationPreference"[],
    "codeVerificationEmail" TEXT,
    "dateCreationCodeVerif" TIMESTAMP(3),
    "codeReinitialisationMdp" TEXT,
    "dateCreationCodeReinit" TIMESTAMP(3),
    "derniereConnexion" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firebase_auth_info" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "emailVerified" BOOLEAN,
    "picture" TEXT,
    "provider" TEXT DEFAULT 'google',
    "signInTime" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firebase_auth_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profils_etablissement" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "avatarChemin" TEXT,
    "imageCouvertureChemin" TEXT,
    "raisonSociale" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "aPropos" TEXT,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "typeEtablissement" "TypeEtablissement",
    "adresseSiegeDifferente" BOOLEAN NOT NULL DEFAULT false,
    "adresseSiege" TEXT,
    "codePostalSiege" TEXT,
    "villeSiege" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profils_etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissements" (
    "id" TEXT NOT NULL,
    "profilEtablissementId" TEXT NOT NULL,
    "avatarChemin" TEXT,
    "nom" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "typeEtablissement" "TypeEtablissement" NOT NULL,
    "roleEtablissement" "RoleEtablissement" NOT NULL DEFAULT 'principal',
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "pays" TEXT NOT NULL DEFAULT 'France',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "emailPrincipal" TEXT,
    "telephonePrincipal" TEXT,
    "nomContactPrincipal" TEXT,
    "prenomContactPrincipal" TEXT,
    "adresseFacturationDifferente" BOOLEAN NOT NULL DEFAULT false,
    "adresseFacturation" TEXT NOT NULL,
    "codePostalFacturation" TEXT NOT NULL,
    "villeFacturation" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etablissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profils_renford" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "avatarChemin" TEXT,
    "imageCouvertureChemin" TEXT,
    "titreProfil" TEXT,
    "aPropos" TEXT,
    "descriptionProfil" TEXT,
    "photoProfil" TEXT,
    "typeMission" "TypeMission"[] DEFAULT ARRAY[]::"TypeMission"[],
    "assuranceRCPro" BOOLEAN NOT NULL DEFAULT false,
    "portfolio" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "siret" TEXT,
    "siretEnCoursObtention" BOOLEAN NOT NULL DEFAULT false,
    "attestationAutoEntrepreneur" BOOLEAN NOT NULL DEFAULT false,
    "attestationVigilanceChemin" TEXT,
    "dateNaissance" DATE,
    "telephone" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "pays" TEXT DEFAULT 'France',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "zoneDeplacement" INTEGER,
    "statutCertification" "StatutCertification" NOT NULL DEFAULT 'en_attente',
    "dateCertification" TIMESTAMP(3),
    "justificatifCarteProfessionnelleChemin" TEXT,
    "carteIdentiteChemin" TEXT,
    "niveauExperience" "NiveauExperience",
    "tarifHoraire" DECIMAL(8,2),
    "proposeJournee" BOOLEAN NOT NULL DEFAULT false,
    "tarifJournee" DECIMAL(8,2),
    "proposeDemiJournee" BOOLEAN NOT NULL DEFAULT false,
    "tarifDemiJournee" DECIMAL(8,2),
    "iban" TEXT,
    "disponibilitesLundi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesMardi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesMercredi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesJeudi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesVendredi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesSamedi" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "disponibilitesDimanche" "CreneauDisponibilite"[] DEFAULT ARRAY[]::"CreneauDisponibilite"[],
    "dureeIllimitee" BOOLEAN NOT NULL DEFAULT true,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "nombreMissionsCompletees" INTEGER NOT NULL DEFAULT 0,
    "noteMoyenne" DOUBLE PRECISION,
    "chiffreAffairesTotal" DECIMAL(12,2),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profils_renford_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renford_diplomes" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "typeDiplome" "Diplome" NOT NULL,
    "justificatifDiplomeChemin" TEXT,
    "mention" TEXT,
    "anneeObtention" INTEGER,
    "etablissementFormation" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renford_diplomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences_professionnelles_renford" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "missions" TEXT NOT NULL,
    "dateDebut" DATE NOT NULL,
    "anneeFin" INTEGER,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_professionnelles_renford_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "utilisateurs_email_idx" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "utilisateurs_typeUtilisateur_idx" ON "utilisateurs"("typeUtilisateur");

-- CreateIndex
CREATE INDEX "utilisateurs_statut_idx" ON "utilisateurs"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "firebase_auth_info_utilisateurId_key" ON "firebase_auth_info"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "firebase_auth_info_uid_key" ON "firebase_auth_info"("uid");

-- CreateIndex
CREATE INDEX "firebase_auth_info_uid_idx" ON "firebase_auth_info"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "profils_etablissement_utilisateurId_key" ON "profils_etablissement"("utilisateurId");

-- CreateIndex
CREATE INDEX "etablissements_profilEtablissementId_idx" ON "etablissements"("profilEtablissementId");

-- CreateIndex
CREATE INDEX "etablissements_typeEtablissement_idx" ON "etablissements"("typeEtablissement");

-- CreateIndex
CREATE INDEX "etablissements_roleEtablissement_idx" ON "etablissements"("roleEtablissement");

-- CreateIndex
CREATE UNIQUE INDEX "profils_renford_utilisateurId_key" ON "profils_renford"("utilisateurId");

-- CreateIndex
CREATE INDEX "profils_renford_statutCertification_idx" ON "profils_renford"("statutCertification");

-- CreateIndex
CREATE INDEX "profils_renford_niveauExperience_idx" ON "profils_renford"("niveauExperience");

-- CreateIndex
CREATE INDEX "renford_diplomes_profilRenfordId_idx" ON "renford_diplomes"("profilRenfordId");

-- CreateIndex
CREATE INDEX "renford_diplomes_typeDiplome_idx" ON "renford_diplomes"("typeDiplome");

-- CreateIndex
CREATE INDEX "experiences_professionnelles_renford_profilRenfordId_idx" ON "experiences_professionnelles_renford"("profilRenfordId");

-- AddForeignKey
ALTER TABLE "firebase_auth_info" ADD CONSTRAINT "firebase_auth_info_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profils_etablissement" ADD CONSTRAINT "profils_etablissement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etablissements" ADD CONSTRAINT "etablissements_profilEtablissementId_fkey" FOREIGN KEY ("profilEtablissementId") REFERENCES "profils_etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profils_renford" ADD CONSTRAINT "profils_renford_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renford_diplomes" ADD CONSTRAINT "renford_diplomes_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences_professionnelles_renford" ADD CONSTRAINT "experiences_professionnelles_renford_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;
