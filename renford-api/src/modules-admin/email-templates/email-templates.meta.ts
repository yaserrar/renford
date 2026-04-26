import { TypeEmailTemplate } from '@prisma/client';

export type EmailVarMeta = { name: string; description: string };

export type EmailTemplateMeta = {
  label: string;
  description: string;
  variables: EmailVarMeta[];
};

export const EMAIL_TEMPLATE_META: Record<TypeEmailTemplate, EmailTemplateMeta> = {
  favori_invitation: {
    label: 'Invitation favori',
    description: 'Envoyé quand un établissement invite un Renford dans ses favoris',
    variables: [
      { name: 'nomFavori', description: 'Nom du favori invité' },
      { name: 'invitationUrl', description: "Lien d'invitation (généré automatiquement)" },
    ],
  },
  welcome_etablissement: {
    label: 'Bienvenue établissement',
    description: 'Message de bienvenue envoyé à un nouvel établissement après inscription',
    variables: [
      { name: 'prenomNom', description: 'Prénom + nom du contact' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'dashboardUrl', description: 'Lien vers le tableau de bord (généré)' },
    ],
  },
  welcome_renford: {
    label: 'Bienvenue Renford',
    description: 'Message de bienvenue envoyé à un nouveau Renford après inscription',
    variables: [
      { name: 'prenom', description: 'Prénom du Renford' },
      { name: 'dashboardUrl', description: 'Lien vers le tableau de bord (généré)' },
    ],
  },
  signup_verification_code: {
    label: 'Code vérification inscription',
    description: 'Code OTP envoyé lors de la création de compte',
    variables: [{ name: 'code', description: 'Code de vérification à 6 chiffres' }],
  },
  reset_password_code: {
    label: 'Code réinitialisation mot de passe',
    description: "Code OTP envoyé lors d'une demande de reset de mot de passe",
    variables: [{ name: 'code', description: 'Code de réinitialisation à 6 chiffres' }],
  },
  new_verification_code: {
    label: 'Nouveau code de vérification',
    description: "Code OTP renvoyé à la demande de l'utilisateur",
    variables: [{ name: 'code', description: 'Nouveau code de vérification à 6 chiffres' }],
  },
  mission_demande_confirmee_flex: {
    label: 'Demande de mission confirmée (Flex)',
    description: "Confirmaton de demande de mission Flex envoyée à l'établissement",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'posteDemande', description: 'Poste demandé' },
      { name: 'plageMission', description: 'Plage de dates de la mission' },
    ],
  },
  mission_demande_confirmee_coach: {
    label: 'Demande de mission confirmée (Coach)',
    description: "Confirmation de demande de mission Coach envoyée à l'établissement",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'posteDemande', description: 'Poste demandé' },
      { name: 'plageMission', description: 'Plage de dates de la mission' },
      { name: 'tarifSouhaite', description: 'Tarif souhaité' },
    ],
  },
  incomplete_renford_profile_reminder: {
    label: 'Rappel profil Renford incomplet',
    description: "Email de relance envoyé aux Renfords n'ayant pas complété leur profil",
    variables: [
      { name: 'prenom', description: 'Prénom du Renford' },
      { name: 'dashboardUrl', description: 'Lien vers le tableau de bord' },
    ],
  },
  renford_trouve_flex: {
    label: 'Renford trouvé (Flex)',
    description: "Email envoyé à l'établissement quand un Renford Flex est proposé",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford proposé' },
      { name: 'profilRenfordResume', description: 'Résumé du profil du Renford' },
      { name: 'espaceCompteUrl', description: "Lien vers l'espace compte" },
      { name: 'paiementUrl', description: 'Lien de paiement' },
    ],
  },
  renford_trouve_coach: {
    label: 'Renford trouvé (Coach)',
    description: "Email envoyé à l'établissement quand des profils Coach sont proposés",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'nombreProfilsProposes', description: 'Nombre de profils proposés' },
      { name: 'profilsSummary', description: 'Résumé des profils (liste)' },
      { name: 'espaceRenfordUrl', description: "Lien vers l'espace Renford" },
      { name: 'lienPaiementUrl', description: 'Lien de paiement' },
    ],
  },
  new_mission_renford: {
    label: 'Nouvelle mission disponible (Renford)',
    description: 'Email envoyé au Renford quand une nouvelle mission lui correspond',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'lieu', description: 'Lieu de la mission' },
      { name: 'publicMission', description: 'Public cible de la mission' },
      { name: 'dateMission', description: 'Date de la mission' },
      { name: 'heureMission', description: 'Heure de la mission' },
      { name: 'remuneration', description: 'Rémunération proposée' },
      { name: 'missionUrl', description: 'Lien vers la mission' },
    ],
  },
  confirmation_mission_renford: {
    label: 'Confirmation de mission (Renford)',
    description: 'Email demandant au Renford de confirmer sa participation',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'confirmationUrl', description: 'Lien de confirmation' },
    ],
  },
  visio_invitation_renford: {
    label: 'Invitation visio (Renford)',
    description: "Email envoyé au Renford pour l'inviter à un entretien visio Coach",
    variables: [
      { name: 'prenom', description: 'Prénom du Renford' },
      { name: 'missionDescription', description: 'Description de la mission' },
      { name: 'etablissementNom', description: "Nom de l'établissement" },
      { name: 'lienVisio', description: 'Lien de la visio' },
      { name: 'missionUrl', description: 'Lien vers la mission' },
    ],
  },
  signature_confirmation: {
    label: 'Confirmation de signature',
    description: "Email de confirmation envoyé après signature d'un contrat",
    variables: [
      { name: 'prenom', description: 'Prénom du signataire' },
      { name: 'nomSignataire', description: 'Nom complet du signataire' },
      { name: 'roleSignataire', description: 'Rôle (Renford / Établissement)' },
      { name: 'missionDescription', description: 'Description de la mission' },
      { name: 'dateSignature', description: 'Date de signature' },
      { name: 'lienCgu', description: 'Lien vers les CGU' },
    ],
  },
  account_deleted: {
    label: 'Compte supprimé',
    description: 'Email envoyé au Renford quand son compte est supprimé',
    variables: [],
  },
  fin_mission_renford_coach: {
    label: 'Fin de mission Renford (Coach)',
    description: "Email envoyé au Renford Coach à la fin d'une mission",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  fin_mission_renford_flex: {
    label: 'Fin de mission Renford (Flex)',
    description: "Email envoyé au Renford Flex à la fin d'une mission",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  fin_mission_etablissement_flex: {
    label: 'Fin de mission Établissement (Flex)',
    description: "Email envoyé à l'établissement à la fin d'une mission Flex",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  fin_mission_etablissement_coach: {
    label: 'Fin de mission Établissement (Coach)',
    description: "Email envoyé à l'établissement à la fin d'une mission Coach",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  rappel_mission_j1_etablissement: {
    label: 'Rappel mission J-1 (Établissement)',
    description: "Rappel envoyé à l'établissement la veille d'une mission",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'modeMission', description: 'Mode (Flex / Coach)' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  rappel_mission_j1_renford: {
    label: 'Rappel mission J-1 (Renford)',
    description: "Rappel envoyé au Renford la veille d'une mission",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'modeMission', description: 'Mode (Flex / Coach)' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  rappel_mission_72h_renford: {
    label: 'Rappel mission -72h (Renford)',
    description: 'Rappel détaillé envoyé au Renford 72h avant la mission',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'adresse', description: "Adresse de l'établissement" },
      { name: 'plageMission', description: 'Plage de dates' },
      { name: 'creneaux', description: 'Créneaux horaires' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  rappel_mission_72h_etablissement: {
    label: 'Rappel mission -72h (Établissement)',
    description: "Rappel envoyé à l'établissement 72h avant la mission",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'modeMission', description: 'Mode (Flex / Coach)' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'plageMission', description: 'Plage de dates' },
      { name: 'creneaux', description: 'Créneaux horaires' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  mission_annulee_renford: {
    label: 'Mission annulée (Renford)',
    description: 'Email envoyé au Renford quand une mission est annulée',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
    ],
  },
  profil_non_retenu_renford: {
    label: 'Profil non retenu (Renford Coach)',
    description: "Email envoyé au Renford Coach quand son profil n'est pas retenu",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'villeRaisonSociale', description: 'Ville et raison sociale' },
    ],
  },
  profil_suspect: {
    label: 'Profil suspect (1er avertissement)',
    description: 'Premier email envoyé aux profils signalés comme suspects',
    variables: [{ name: 'espaceUrl', description: "Lien vers l'espace compte" }],
  },
  profil_suspect_2: {
    label: 'Profil suspect (2ème avertissement)',
    description: 'Deuxième email de suppression imminente pour les profils suspects',
    variables: [{ name: 'espaceUrl', description: "Lien vers l'espace compte" }],
  },
  contrat_a_signer_etablissement: {
    label: 'Contrat à signer (Établissement)',
    description: "Email invitant l'établissement à signer le contrat de prestation",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'modeMission', description: 'Mode (Flex / Coach)' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  contrat_a_signer_renford: {
    label: 'Contrat à signer (Renford)',
    description: 'Email invitant le Renford à signer le contrat de prestation',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'modeMission', description: 'Mode (Flex / Coach)' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  contrat_signe_etablissement_coach: {
    label: 'Contrat signé par les deux parties – Établissement (Coach)',
    description: "Email envoyé à l'établissement quand les deux parties ont signé (Coach)",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  contrat_signe_etablissement_flex: {
    label: 'Contrat signé par les deux parties – Établissement (Flex)',
    description: "Email envoyé à l'établissement quand les deux parties ont signé (Flex)",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  profil_accepte_etablissement_coach: {
    label: 'Profil accepté – Établissement (Coach)',
    description: "Email envoyé à l'établissement quand il accepte un profil Coach",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  programmer_echange_etablissement: {
    label: 'Programmer un échange (Établissement)',
    description: "Email invitant l'établissement à programmer un échange visio Coach",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  profils_tous_refuses_etablissement: {
    label: 'Profils tous refusés (Établissement)',
    description: "Email envoyé à l'établissement quand tous les profils proposés sont refusés",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  apres_visio_etablissement: {
    label: 'Après visio (Établissement)',
    description: "Email envoyé à l'établissement après un entretien visio Coach",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  apres_visio_renford: {
    label: 'Après visio (Renford)',
    description: 'Email envoyé au Renford après un entretien visio Coach',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  apres_confirmation_renford_coach: {
    label: 'Après confirmation – Renford Coach (coordonnées)',
    description: "Email envoyé au Renford Coach avec les coordonnées de l'établissement",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'contactEtablissement', description: "Contact de l'établissement" },
      { name: 'telephoneEtablissement', description: "Téléphone de l'établissement" },
      { name: 'adresseEtablissement', description: "Adresse de l'établissement" },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  refus_renford_coach: {
    label: 'Refus Renford Coach',
    description: 'Email envoyé quand le Renford Coach décline une mission',
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
    ],
  },
  profil_annule_etablissement: {
    label: 'Profil annulé (Établissement)',
    description: "Email envoyé à l'établissement quand un remplacement est annulé",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  mission_annulee_par_renford_etablissement: {
    label: 'Mission annulée par le Renford (Établissement)',
    description: "Email notifiant l'établissement qu'un Renford a annulé la mission",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'raison', description: "Raison de l'annulation" },
      { name: 'commentaires', description: 'Commentaires optionnels' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  changement_signale_etablissement: {
    label: 'Changement signalé – Établissement notifié',
    description: "Email envoyé à l'établissement quand le Renford signale un changement",
    variables: [
      { name: 'prenomEtablissement', description: "Prénom du contact de l'établissement" },
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'typeChangement', description: 'Type de changement signalé' },
      { name: 'motif', description: 'Motif du changement' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  changement_signale_renford: {
    label: 'Changement signalé – Renford notifié',
    description: "Email envoyé au Renford quand l'établissement signale un changement",
    variables: [
      { name: 'prenomRenford', description: 'Prénom du Renford' },
      { name: 'raisonSociale', description: "Raison sociale de l'établissement" },
      { name: 'typeMission', description: 'Type de mission' },
      { name: 'typeChangement', description: 'Type de changement signalé' },
      { name: 'motif', description: 'Motif du changement' },
      { name: 'espaceUrl', description: "Lien vers l'espace compte" },
    ],
  },
  abonnement_activation: {
    label: 'Activation abonnement',
    description: "Email envoyé à l'établissement lors de l'activation de son abonnement",
    variables: [
      { name: 'prenom', description: 'Prénom du contact' },
      { name: 'plan', description: 'Nom du plan (ex: Performance)' },
      { name: 'quotaMissions', description: 'Nombre de missions incluses' },
      { name: 'prixMensuelHT', description: 'Prix mensuel HT en euros' },
      { name: 'periodStart', description: 'Date de début de période' },
      { name: 'periodEnd', description: 'Date de fin de période' },
    ],
  },
  abonnement_renewal: {
    label: 'Renouvellement abonnement',
    description: "Email de confirmation de renouvellement mensuel d'un abonnement",
    variables: [
      { name: 'prenom', description: 'Prénom du contact' },
      { name: 'plan', description: 'Nom du plan' },
      { name: 'montantCentimes', description: 'Montant prélevé en centimes' },
      { name: 'periodEnd', description: 'Date de fin de la nouvelle période' },
    ],
  },
  abonnement_cancellation: {
    label: 'Annulation abonnement',
    description: 'Email envoyé quand un abonnement est annulé',
    variables: [
      { name: 'prenom', description: 'Prénom du contact' },
      { name: 'plan', description: 'Nom du plan' },
      { name: 'dateFin', description: "Date de fin d'accès" },
    ],
  },
  abonnement_payment_failed: {
    label: 'Échec de paiement abonnement',
    description: "Email envoyé quand le paiement mensuel d'un abonnement échoue",
    variables: [
      { name: 'prenom', description: 'Prénom du contact' },
      { name: 'montantCentimes', description: 'Montant qui a échoué en centimes' },
    ],
  },
};
