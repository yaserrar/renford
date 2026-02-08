-- CreateEnum
CREATE TYPE "TypeUtilisateur" AS ENUM ('etablissement', 'renford', 'administrateur');

-- CreateEnum
CREATE TYPE "StatutCompte" AS ENUM ('actif', 'suspendu', 'en_attente_verification', 'onboarding');

-- CreateEnum
CREATE TYPE "TypeEtablissement" AS ENUM ('salle_sport_gymnase', 'centre_fitness', 'studio_yoga', 'studio_pilates', 'centre_bien_etre', 'club_escalade', 'centre_sports_aquatiques', 'ecole_danse', 'centre_formation_sportive', 'club_sport_combat', 'centre_arts_martiaux', 'complexe_multisports', 'club_golf', 'club_tennis', 'centre_athletisme', 'etablissement_sports_extremes', 'centre_equestre', 'club_cyclisme', 'club_course_pied', 'club_tir_arc', 'club_voile_nautique', 'centre_musculation', 'centre_reeducation', 'stade_arene', 'association_sportive', 'complexe_loisirs', 'academie_sportive', 'ecole_surf');

-- CreateEnum
CREATE TYPE "RoleEtablissement" AS ENUM ('principal', 'secondaire');

-- CreateEnum
CREATE TYPE "DepartementIDF" AS ENUM ('paris_75', 'seine_et_marne_77', 'yvelines_78', 'essonne_91', 'hauts_de_seine_92', 'seine_saint_denis_93', 'val_de_marne_94', 'val_doise_95');

-- CreateEnum
CREATE TYPE "StatutCertification" AS ENUM ('en_attente', 'certifie', 'rejete');

-- CreateEnum
CREATE TYPE "NiveauExperience" AS ENUM ('debutant', 'confirme', 'expert');

-- CreateEnum
CREATE TYPE "TypeMission" AS ENUM ('volant', 'mission_longue', 'les_deux');

-- CreateEnum
CREATE TYPE "JourSemaine" AS ENUM ('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');

-- CreateEnum
CREATE TYPE "TypePoste" AS ENUM ('pilates', 'yoga', 'fitness_musculation', 'escalade', 'boxe', 'danse', 'gymnastique', 'tennis', 'apa');

-- CreateEnum
CREATE TYPE "TypeDocument" AS ENUM ('devis', 'contrat_prestation', 'facture', 'attestation_mission', 'attestation_vigilance', 'bordereau_paiement', 'diplome', 'carte_pro', 'justificatif_assurance', 'note_frais');

-- CreateEnum
CREATE TYPE "StatutDocument" AS ENUM ('brouillon', 'en_attente_signature', 'signe', 'archive', 'expire');

-- CreateEnum
CREATE TYPE "ModeMission" AS ENUM ('flex', 'coach');

-- CreateEnum
CREATE TYPE "StatutMission" AS ENUM ('envoyee', 'en_cours_de_matching', 'proposee', 'acceptee', 'contrat_signe', 'payee', 'en_cours', 'a_valider', 'validee', 'terminee', 'archivee', 'annulee');

-- CreateEnum
CREATE TYPE "MethodeTarification" AS ENUM ('horaire', 'forfait', 'degressif');

-- CreateEnum
CREATE TYPE "TrancheTarifHoraire" AS ENUM ('moins_de_45', 'entre_45_et_59', 'plus_de_60');

-- CreateEnum
CREATE TYPE "StatutMissionRenford" AS ENUM ('propose', 'accepte', 'refuse', 'shortliste', 'selectionne', 'contrat_envoye', 'contrat_signe', 'en_cours', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('en_attente', 'en_cours', 'bloque', 'libere', 'rembourse', 'echoue', 'conteste');

-- CreateEnum
CREATE TYPE "TypeEvaluation" AS ENUM ('etablissement_vers_renford', 'renford_vers_etablissement');

-- CreateEnum
CREATE TYPE "QualiteService" AS ENUM ('excellent', 'tres_bien', 'bien', 'moyen', 'mediocre');

-- CreateEnum
CREATE TYPE "TypeDemandeModification" AS ENUM ('horaires', 'date_debut', 'date_fin', 'lieu', 'autre');

-- CreateEnum
CREATE TYPE "StatutDemandeModification" AS ENUM ('en_attente', 'acceptee', 'refusee');

-- CreateEnum
CREATE TYPE "MotifAnnulation" AS ENUM ('maladie', 'probleme_personnel', 'conflit_horaire', 'autre');

-- CreateEnum
CREATE TYPE "MotifAbsence" AS ENUM ('autre_mission_imprevue', 'probleme_communication', 'probleme_disponibilite', 'absence_non_prevue', 'autre');

-- CreateEnum
CREATE TYPE "MotifAjustementDuree" AS ENUM ('retard_demarrage', 'probleme_imprevu', 'prolongation', 'changement_besoins', 'autre');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('nouvelle_mission', 'mission_acceptee', 'mission_refusee', 'contrat_pret', 'contrat_signe', 'paiement_traite', 'paiement_recu', 'rappel_mission_1_semaine', 'rappel_mission_2_jours', 'mission_demarree', 'mission_terminee', 'demande_evaluation', 'rappel_evaluation', 'rappel_devis', 'document_expire', 'mise_a_jour_profil_requise', 'bienvenue');

-- CreateEnum
CREATE TYPE "CanalNotification" AS ENUM ('email', 'sms', 'tableau_de_bord', 'calendrier');

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
    "raisonSociale" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "typeEtablissement" "TypeEtablissement",
    "adresseSiege" TEXT,
    "codePostalSiege" TEXT,
    "villeSiege" TEXT,
    "emailPrincipal" TEXT,
    "telephonePrincipal" TEXT,
    "nomContactPrincipal" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profils_etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissements" (
    "id" TEXT NOT NULL,
    "profilEtablissementId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "typeEtablissement" "TypeEtablissement" NOT NULL,
    "roleEtablissement" "RoleEtablissement" NOT NULL DEFAULT 'principal',
    "adresse" TEXT NOT NULL,
    "adresseLigne2" TEXT,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "departement" "DepartementIDF" NOT NULL,
    "pays" TEXT NOT NULL DEFAULT 'France',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "telephone" TEXT,
    "email" TEXT,
    "etablissementPrincipalId" TEXT,
    "nomGroupePrincipal" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etablissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profils_renford" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "titreProfil" TEXT,
    "descriptionProfil" TEXT,
    "photoProfil" TEXT,
    "typeMission" "TypeMission",
    "assuranceRCPro" BOOLEAN NOT NULL DEFAULT false,
    "siret" TEXT,
    "attestationAutoEntrepreneur" BOOLEAN NOT NULL DEFAULT false,
    "attestationVigilanceChemin" TEXT,
    "dateNaissance" DATE,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "pays" TEXT DEFAULT 'France',
    "zoneDeplacement" INTEGER,
    "statutCertification" "StatutCertification" NOT NULL DEFAULT 'en_attente',
    "dateCertification" TIMESTAMP(3),
    "carteIdentiteChemin" TEXT,
    "justificatifDiplomeChemin" TEXT,
    "justificatifCarteProfessionnelleChemin" TEXT,
    "diplomes" TEXT,
    "niveauExperience" "NiveauExperience",
    "tarifHoraire" DECIMAL(8,2),
    "proposeJournee" BOOLEAN NOT NULL DEFAULT false,
    "tarifJournee" DECIMAL(8,2),
    "proposeDemiJournee" BOOLEAN NOT NULL DEFAULT false,
    "tarifDemiJournee" DECIMAL(8,2),
    "iban" TEXT,
    "joursDisponibles" JSONB,
    "creneaux" JSONB,
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
CREATE TABLE "renford_types_postes" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "typePoste" "TypePoste" NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renford_types_postes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renford_specialisations" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "typePoste" "TypePoste" NOT NULL,
    "nomSpecialisation" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "renford_specialisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renford_diplomes" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "typeDiplome" TEXT NOT NULL,
    "nomDiplome" TEXT NOT NULL,
    "mention" TEXT,
    "specialite" TEXT,
    "anneeObtention" INTEGER,
    "etablissementFormation" TEXT,
    "documentId" TEXT,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "dateVerification" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renford_diplomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_renford" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "typeDocument" "TypeDocument" NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "cheminFichier" TEXT NOT NULL,
    "tailleFichier" INTEGER,
    "mimeType" TEXT,
    "statut" "StatutDocument" NOT NULL DEFAULT 'en_attente_signature',
    "dateExpiration" TIMESTAMP(3),
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "dateVerification" TIMESTAMP(3),
    "commentaireVerification" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_renford_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informations_bancaires" (
    "id" TEXT NOT NULL,
    "profilEtablissementId" TEXT NOT NULL,
    "nomTitulaireCompte" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT,
    "nomFacturation" TEXT,
    "adresseFacturation" TEXT,
    "adresseFacturation2" TEXT,
    "codePostalFacturation" TEXT,
    "villeFacturation" TEXT,
    "paysFacturation" TEXT DEFAULT 'France',
    "siretFacturation" TEXT,
    "stripeCustomerId" TEXT,
    "stripePaymentMethodId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "informations_bancaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "modeMission" "ModeMission" NOT NULL DEFAULT 'flex',
    "statut" "StatutMission" NOT NULL DEFAULT 'envoyee',
    "titre" TEXT,
    "description" TEXT,
    "typePosteRecherche" "TypePoste" NOT NULL,
    "specialisationRecherchee" TEXT,
    "niveauExperienceRequis" "NiveauExperience",
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "nombreHeuresTotal" DECIMAL(6,2),
    "methodeTarification" "MethodeTarification" NOT NULL DEFAULT 'horaire',
    "trancheTarifHoraire" "TrancheTarifHoraire",
    "tarifHorairePrecis" DECIMAL(8,2),
    "montantForfaitaire" DECIMAL(10,2),
    "nombreParticipants" INTEGER,
    "montantEstimeHT" DECIMAL(10,2),
    "montantCommission" DECIMAL(10,2),
    "montantTotalTTC" DECIMAL(10,2),
    "materielRequis" TEXT[],
    "notesFraisPrisesEnCharge" BOOLEAN NOT NULL DEFAULT false,
    "diplomeRequis" TEXT,
    "niveauCours" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plages_horaires_mission" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plages_horaires_mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions_renfords" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "statut" "StatutMissionRenford" NOT NULL DEFAULT 'propose',
    "estShortliste" BOOLEAN NOT NULL DEFAULT false,
    "ordreShortlist" INTEGER,
    "dateProposition" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateReponse" TIMESTAMP(3),
    "dateContratSigne" TIMESTAMP(3),
    "lienVisio" TEXT,
    "dateVisio" TIMESTAMP(3),
    "visioEffectuee" BOOLEAN NOT NULL DEFAULT false,
    "tarifNegocie" DECIMAL(8,2),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_renfords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_mission" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "typeDocument" "TypeDocument" NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "cheminFichier" TEXT NOT NULL,
    "tailleFichier" INTEGER,
    "mimeType" TEXT,
    "statut" "StatutDocument" NOT NULL DEFAULT 'brouillon',
    "signatureExterneId" TEXT,
    "fournisseurSignature" TEXT,
    "dateSigne" TIMESTAMP(3),
    "signeParId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "montantHT" DECIMAL(10,2) NOT NULL,
    "montantTVA" DECIMAL(10,2) NOT NULL,
    "montantTTC" DECIMAL(10,2) NOT NULL,
    "montantCommission" DECIMAL(10,2) NOT NULL,
    "montantNetRenford" DECIMAL(10,2) NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'en_attente',
    "stripePaymentIntentId" TEXT,
    "stripeChargeId" TEXT,
    "stripeTransferId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCapture" TIMESTAMP(3),
    "dateLiberation" TIMESTAMP(3),
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "cibleId" TEXT NOT NULL,
    "typeEvaluation" "TypeEvaluation" NOT NULL,
    "noteGlobale" INTEGER NOT NULL,
    "qualiteService" "QualiteService",
    "notePlateforme" INTEGER,
    "prestationRepondAttentes" BOOLEAN,
    "motifInsatisfaction" TEXT,
    "ajouterAuxFavoris" BOOLEAN,
    "recommande" BOOLEAN,
    "aspectsSatisfaisants" TEXT[],
    "commentaire" TEXT,
    "absenceSignalee" BOOLEAN NOT NULL DEFAULT false,
    "detailsAbsence" JSONB,
    "ajustementDureeSignale" BOOLEAN NOT NULL DEFAULT false,
    "detailsAjustement" JSONB,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demandes_modification" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "demandeurId" TEXT NOT NULL,
    "typeModification" "TypeDemandeModification" NOT NULL,
    "motif" TEXT,
    "documentsJustificatifs" TEXT[],
    "nouvelleValeur" JSONB,
    "statut" "StatutDemandeModification" NOT NULL DEFAULT 'en_attente',
    "dateReponse" TIMESTAMP(3),
    "commentaireReponse" TEXT,
    "reponduParId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demandes_modification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annulations_mission" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "demandeurId" TEXT NOT NULL,
    "motif" "MotifAnnulation" NOT NULL,
    "commentaire" TEXT,
    "estTardive" BOOLEAN NOT NULL DEFAULT false,
    "penaliteAppliquee" BOOLEAN NOT NULL DEFAULT false,
    "typePenalite" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annulations_mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoris_renford" (
    "id" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "profilRenfordId" TEXT,
    "nomComplet" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoris_renford_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "expediteurId" TEXT,
    "type" "TypeNotification" NOT NULL,
    "canal" "CanalNotification" NOT NULL DEFAULT 'tableau_de_bord',
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "lienAction" TEXT,
    "entiteType" TEXT,
    "entiteId" TEXT,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "luLe" TIMESTAMP(3),
    "envoye" BOOLEAN NOT NULL DEFAULT false,
    "envoyeLe" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "participantIds" TEXT[],
    "missionId" TEXT,
    "estSupportRenford" BOOLEAN NOT NULL DEFAULT false,
    "sujetSupport" TEXT,
    "dernierMessage" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "expediteurId" TEXT NOT NULL,
    "destinataireId" TEXT,
    "contenu" TEXT NOT NULL,
    "pieceJointeUrl" TEXT,
    "pieceJointeNom" TEXT,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "luLe" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences_mission" (
    "id" TEXT NOT NULL,
    "profilRenfordId" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "preference" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preferences_mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_activites" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT,
    "action" TEXT NOT NULL,
    "entiteType" TEXT,
    "entiteId" TEXT,
    "details" JSONB,
    "adresseIp" TEXT,
    "userAgent" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_activites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions_refresh" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "adresseIp" TEXT,
    "dateExpiration" TIMESTAMP(3) NOT NULL,
    "estRevoque" BOOLEAN NOT NULL DEFAULT false,
    "dateRevocation" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_refresh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspensions_compte" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "details" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "estPermanente" BOOLEAN NOT NULL DEFAULT false,
    "nombreInfractions" INTEGER NOT NULL DEFAULT 1,
    "missionId" TEXT,
    "levee" BOOLEAN NOT NULL DEFAULT false,
    "dateLeveee" TIMESTAMP(3),
    "motifLevee" TEXT,
    "leveeParId" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suspensions_compte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres_plateforme" (
    "id" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'string',
    "categorie" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametres_plateforme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rappels_programmes" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entiteType" TEXT NOT NULL,
    "entiteId" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "dateEnvoi" TIMESTAMP(3) NOT NULL,
    "envoye" BOOLEAN NOT NULL DEFAULT false,
    "dateEnvoiEffectif" TIMESTAMP(3),
    "tentatives" INTEGER NOT NULL DEFAULT 0,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rappels_programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistiques_quotidiennes" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "nouveauxEtablissements" INTEGER NOT NULL DEFAULT 0,
    "nouveauxRenfords" INTEGER NOT NULL DEFAULT 0,
    "utilisateursActifs" INTEGER NOT NULL DEFAULT 0,
    "missionsCrees" INTEGER NOT NULL DEFAULT 0,
    "missionsCompletees" INTEGER NOT NULL DEFAULT 0,
    "missionsAnnulees" INTEGER NOT NULL DEFAULT 0,
    "missionsFlex" INTEGER NOT NULL DEFAULT 0,
    "missionsCoach" INTEGER NOT NULL DEFAULT 0,
    "volumePaiementsHT" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commissionsGenerees" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tauxMatchingReussi" DOUBLE PRECISION,
    "tempsMatchingMoyen" DOUBLE PRECISION,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statistiques_quotidiennes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departements_adjacents" (
    "id" TEXT NOT NULL,
    "departement" "DepartementIDF" NOT NULL,
    "departementAdjacent" "DepartementIDF" NOT NULL,

    CONSTRAINT "departements_adjacents_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "etablissements_departement_idx" ON "etablissements"("departement");

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
CREATE UNIQUE INDEX "renford_types_postes_profilRenfordId_typePoste_key" ON "renford_types_postes"("profilRenfordId", "typePoste");

-- CreateIndex
CREATE INDEX "renford_specialisations_typePoste_idx" ON "renford_specialisations"("typePoste");

-- CreateIndex
CREATE UNIQUE INDEX "renford_specialisations_profilRenfordId_typePoste_nomSpecia_key" ON "renford_specialisations"("profilRenfordId", "typePoste", "nomSpecialisation");

-- CreateIndex
CREATE INDEX "renford_diplomes_profilRenfordId_idx" ON "renford_diplomes"("profilRenfordId");

-- CreateIndex
CREATE INDEX "renford_diplomes_typeDiplome_idx" ON "renford_diplomes"("typeDiplome");

-- CreateIndex
CREATE INDEX "documents_renford_profilRenfordId_idx" ON "documents_renford"("profilRenfordId");

-- CreateIndex
CREATE INDEX "documents_renford_typeDocument_idx" ON "documents_renford"("typeDocument");

-- CreateIndex
CREATE UNIQUE INDEX "informations_bancaires_profilEtablissementId_key" ON "informations_bancaires"("profilEtablissementId");

-- CreateIndex
CREATE UNIQUE INDEX "missions_reference_key" ON "missions"("reference");

-- CreateIndex
CREATE INDEX "missions_etablissementId_idx" ON "missions"("etablissementId");

-- CreateIndex
CREATE INDEX "missions_statut_idx" ON "missions"("statut");

-- CreateIndex
CREATE INDEX "missions_modeMission_idx" ON "missions"("modeMission");

-- CreateIndex
CREATE INDEX "missions_typePosteRecherche_idx" ON "missions"("typePosteRecherche");

-- CreateIndex
CREATE INDEX "missions_dateDebut_idx" ON "missions"("dateDebut");

-- CreateIndex
CREATE INDEX "missions_dateFin_idx" ON "missions"("dateFin");

-- CreateIndex
CREATE INDEX "plages_horaires_mission_missionId_idx" ON "plages_horaires_mission"("missionId");

-- CreateIndex
CREATE INDEX "plages_horaires_mission_date_idx" ON "plages_horaires_mission"("date");

-- CreateIndex
CREATE INDEX "missions_renfords_missionId_idx" ON "missions_renfords"("missionId");

-- CreateIndex
CREATE INDEX "missions_renfords_profilRenfordId_idx" ON "missions_renfords"("profilRenfordId");

-- CreateIndex
CREATE INDEX "missions_renfords_statut_idx" ON "missions_renfords"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "missions_renfords_missionId_profilRenfordId_key" ON "missions_renfords"("missionId", "profilRenfordId");

-- CreateIndex
CREATE INDEX "documents_mission_missionId_idx" ON "documents_mission"("missionId");

-- CreateIndex
CREATE INDEX "documents_mission_typeDocument_idx" ON "documents_mission"("typeDocument");

-- CreateIndex
CREATE INDEX "documents_mission_statut_idx" ON "documents_mission"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "paiements_reference_key" ON "paiements"("reference");

-- CreateIndex
CREATE INDEX "paiements_missionId_idx" ON "paiements"("missionId");

-- CreateIndex
CREATE INDEX "paiements_statut_idx" ON "paiements"("statut");

-- CreateIndex
CREATE INDEX "paiements_stripePaymentIntentId_idx" ON "paiements"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "evaluations_missionId_idx" ON "evaluations"("missionId");

-- CreateIndex
CREATE INDEX "evaluations_cibleId_idx" ON "evaluations"("cibleId");

-- CreateIndex
CREATE INDEX "evaluations_typeEvaluation_idx" ON "evaluations"("typeEvaluation");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_missionId_auteurId_key" ON "evaluations"("missionId", "auteurId");

-- CreateIndex
CREATE INDEX "demandes_modification_missionId_idx" ON "demandes_modification"("missionId");

-- CreateIndex
CREATE INDEX "demandes_modification_statut_idx" ON "demandes_modification"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "annulations_mission_missionId_key" ON "annulations_mission"("missionId");

-- CreateIndex
CREATE INDEX "favoris_renford_etablissementId_idx" ON "favoris_renford"("etablissementId");

-- CreateIndex
CREATE INDEX "favoris_renford_email_idx" ON "favoris_renford"("email");

-- CreateIndex
CREATE UNIQUE INDEX "favoris_renford_etablissementId_profilRenfordId_key" ON "favoris_renford"("etablissementId", "profilRenfordId");

-- CreateIndex
CREATE INDEX "notifications_destinataireId_idx" ON "notifications"("destinataireId");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_lu_idx" ON "notifications"("lu");

-- CreateIndex
CREATE INDEX "notifications_dateCreation_idx" ON "notifications"("dateCreation");

-- CreateIndex
CREATE INDEX "conversations_participantIds_idx" ON "conversations"("participantIds");

-- CreateIndex
CREATE INDEX "conversations_missionId_idx" ON "conversations"("missionId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_expediteurId_idx" ON "messages"("expediteurId");

-- CreateIndex
CREATE INDEX "messages_dateCreation_idx" ON "messages"("dateCreation");

-- CreateIndex
CREATE INDEX "preferences_mission_profilRenfordId_idx" ON "preferences_mission"("profilRenfordId");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_mission_profilRenfordId_categorie_preference_key" ON "preferences_mission"("profilRenfordId", "categorie", "preference");

-- CreateIndex
CREATE INDEX "journal_activites_utilisateurId_idx" ON "journal_activites"("utilisateurId");

-- CreateIndex
CREATE INDEX "journal_activites_action_idx" ON "journal_activites"("action");

-- CreateIndex
CREATE INDEX "journal_activites_dateCreation_idx" ON "journal_activites"("dateCreation");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_refreshToken_key" ON "sessions_refresh"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_refresh_utilisateurId_idx" ON "sessions_refresh"("utilisateurId");

-- CreateIndex
CREATE INDEX "sessions_refresh_refreshToken_idx" ON "sessions_refresh"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_refresh_dateExpiration_idx" ON "sessions_refresh"("dateExpiration");

-- CreateIndex
CREATE INDEX "suspensions_compte_utilisateurId_idx" ON "suspensions_compte"("utilisateurId");

-- CreateIndex
CREATE INDEX "suspensions_compte_estPermanente_idx" ON "suspensions_compte"("estPermanente");

-- CreateIndex
CREATE UNIQUE INDEX "parametres_plateforme_cle_key" ON "parametres_plateforme"("cle");

-- CreateIndex
CREATE INDEX "parametres_plateforme_categorie_idx" ON "parametres_plateforme"("categorie");

-- CreateIndex
CREATE INDEX "rappels_programmes_dateEnvoi_idx" ON "rappels_programmes"("dateEnvoi");

-- CreateIndex
CREATE INDEX "rappels_programmes_envoye_idx" ON "rappels_programmes"("envoye");

-- CreateIndex
CREATE INDEX "rappels_programmes_type_idx" ON "rappels_programmes"("type");

-- CreateIndex
CREATE UNIQUE INDEX "statistiques_quotidiennes_date_key" ON "statistiques_quotidiennes"("date");

-- CreateIndex
CREATE UNIQUE INDEX "departements_adjacents_departement_departementAdjacent_key" ON "departements_adjacents"("departement", "departementAdjacent");

-- AddForeignKey
ALTER TABLE "firebase_auth_info" ADD CONSTRAINT "firebase_auth_info_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profils_etablissement" ADD CONSTRAINT "profils_etablissement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etablissements" ADD CONSTRAINT "etablissements_profilEtablissementId_fkey" FOREIGN KEY ("profilEtablissementId") REFERENCES "profils_etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etablissements" ADD CONSTRAINT "etablissements_etablissementPrincipalId_fkey" FOREIGN KEY ("etablissementPrincipalId") REFERENCES "etablissements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profils_renford" ADD CONSTRAINT "profils_renford_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renford_types_postes" ADD CONSTRAINT "renford_types_postes_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renford_specialisations" ADD CONSTRAINT "renford_specialisations_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renford_diplomes" ADD CONSTRAINT "renford_diplomes_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renford_diplomes" ADD CONSTRAINT "renford_diplomes_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents_renford"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_renford" ADD CONSTRAINT "documents_renford_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informations_bancaires" ADD CONSTRAINT "informations_bancaires_profilEtablissementId_fkey" FOREIGN KEY ("profilEtablissementId") REFERENCES "profils_etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plages_horaires_mission" ADD CONSTRAINT "plages_horaires_mission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_renfords" ADD CONSTRAINT "missions_renfords_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents_mission" ADD CONSTRAINT "documents_mission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_cibleId_fkey" FOREIGN KEY ("cibleId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_modification" ADD CONSTRAINT "demandes_modification_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annulations_mission" ADD CONSTRAINT "annulations_mission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris_renford" ADD CONSTRAINT "favoris_renford_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris_renford" ADD CONSTRAINT "favoris_renford_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences_mission" ADD CONSTRAINT "preferences_mission_profilRenfordId_fkey" FOREIGN KEY ("profilRenfordId") REFERENCES "profils_renford"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_activites" ADD CONSTRAINT "journal_activites_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_refresh" ADD CONSTRAINT "sessions_refresh_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
