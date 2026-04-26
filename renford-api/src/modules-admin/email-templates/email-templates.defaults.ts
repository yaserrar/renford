import { TypeEmailTemplate } from '@prisma/client';

export type EmailTemplateDefaults = {
  sujet: string;
  titre: string;
  intro: string;
  closing: string | null;
  ctaLabel: string | null;
};

export const EMAIL_TEMPLATE_DEFAULTS: Record<TypeEmailTemplate, EmailTemplateDefaults> = {
  favori_invitation: {
    sujet: 'Invitation à rejoindre Renford',
    titre: 'Invitation à rejoindre Renford',
    intro: 'Un établissement partenaire vous invite à créer votre profil Renford.',
    ctaLabel: 'Rejoindre Renford',
    closing: "À très vite, l'équipe Renford.",
  },

  welcome_etablissement: {
    sujet: 'Bienvenue sur Renford - Commencez votre parcours dès maintenant !',
    titre: 'Bienvenue sur Renford - Commencez votre parcours dès maintenant !',
    intro:
      'Bonjour {{prenomNom}},\nNous sommes ravis de vous accueillir au sein de Renford, la plateforme dédiée aux établissements sportifs.',
    ctaLabel: null,
    closing: null,
  },

  welcome_renford: {
    sujet: 'Bienvenue dans la communauté Renford !',
    titre: 'Bienvenue dans la communauté Renford !',
    intro:
      'Bonjour {{prenom}},\nFélicitations et bienvenue chez Renford ! Nous sommes ravis de compter parmi nos intervenants.',
    ctaLabel: null,
    closing: null,
  },

  signup_verification_code: {
    sujet: 'RENFORD: Vérification de votre compte',
    titre: 'Vérification de votre compte',
    intro: 'Bienvenue sur Renford. Utilisez ce code pour vérifier votre adresse email :',
    ctaLabel: null,
    closing: null,
  },

  reset_password_code: {
    sujet: 'RENFORD: Réinitialisation de mot de passe',
    titre: 'Réinitialisation de mot de passe',
    intro: 'Utilisez ce code pour définir un nouveau mot de passe :',
    ctaLabel: null,
    closing: null,
  },

  new_verification_code: {
    sujet: 'RENFORD: Nouveau code de vérification',
    titre: 'Nouveau code de vérification',
    intro: 'Voici votre nouveau code de vérification :',
    ctaLabel: null,
    closing: null,
  },

  mission_demande_confirmee_flex: {
    sujet: 'Confirmation de votre demande de mission FLEX',
    titre: 'Confirmation de votre demande de mission FLEX',
    intro:
      'Bonjour {{prenomEtablissement}},\nNous vous remercions pour votre demande de mission FLEX sur Renford.',
    ctaLabel: null,
    closing: null,
  },

  mission_demande_confirmee_coach: {
    sujet: 'Confirmation de votre demande de mission COACH',
    titre: 'Confirmation de votre demande de mission COACH',
    intro:
      'Bonjour {{prenomEtablissement}},\nNous vous remercions pour votre demande de mission COACH sur Renford.',
    ctaLabel: null,
    closing: null,
  },

  incomplete_renford_profile_reminder: {
    sujet: 'Finalise ton profil pour recevoir des missions',
    titre: 'Finalise ton profil pour recevoir des missions !',
    intro: "Bonjour {{prenom}},\nMerci de t'être inscrit(e) sur Renford ! 🎉",
    ctaLabel: null,
    closing: null,
  },

  renford_trouve_flex: {
    sujet: '✅ Profil trouvé - Votre mission Renford FLEX',
    titre: '✅ Profil trouvé - Votre mission Renford FLEX',
    intro:
      'Bonjour {{prenomEtablissement}},\nBonne nouvelle : nous avons trouvé le bon profil pour votre mission Renford FLEX !',
    ctaLabel: null,
    closing: null,
  },

  renford_trouve_coach: {
    sujet: 'Renford - Votre sélection personnalisée pour votre besoin',
    titre: 'Renford - Votre sélection personnalisée pour votre besoin',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  new_mission_renford: {
    sujet: 'Nouvelle mission disponible – {{typeMission}}',
    titre: 'Nouvelle mission disponible – {{typeMission}}',
    intro:
      'Bonjour {{prenomRenford}},\nBonne nouvelle 🎉 Une mission qui correspond parfaitement à ton profil est disponible.',
    ctaLabel: null,
    closing: null,
  },

  confirmation_mission_renford: {
    sujet: 'Confirmation de ta prochaine mission avec Renford ✅',
    titre: 'Confirmation de ta prochaine mission avec Renford ✅',
    intro:
      "Hello {{prenomRenford}},\nMerci encore pour nos échanges ! Bonne nouvelle, l'établissement a sélectionné ton profil.",
    ctaLabel: null,
    closing: null,
  },

  visio_invitation_renford: {
    sujet: 'Renford – Invitation à une visioconférence',
    titre: 'Invitation à une visioconférence',
    intro:
      "Bonjour {{prenomRenford}},\nL'établissement souhaite vous rencontrer en visioconférence avant le début de votre mission.",
    ctaLabel: 'Rejoindre la visio',
    closing:
      'Vous pouvez également retrouver ce lien sur la page de la mission dans votre espace Renford.',
  },

  signature_confirmation: {
    sujet: 'Confirmation de signature – Mission Renford',
    titre: 'Signature confirmée',
    intro: 'Bonjour {{prenom}},',
    ctaLabel: null,
    closing: null,
  },

  account_deleted: {
    sujet: 'À bientôt, peut-être ? 💫',
    titre: 'À bientôt, peut-être ? 💫',
    intro: 'Bonjour,',
    ctaLabel: null,
    closing: null,
  },

  fin_mission_renford_coach: {
    sujet: 'Merci !',
    titre: 'Merci !',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  fin_mission_renford_flex: {
    sujet: 'Merci !',
    titre: 'Merci !',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  fin_mission_etablissement_flex: {
    sujet: 'Mission terminée ✅',
    titre: 'Mission terminée ✅',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: 'Envoyer ma prochaine demande',
    closing:
      "On reste bien entendu disponibles si besoin, et on espère vous retrouver très vite sur Renford !\nBien à vous,\nL'équipe Renford",
  },

  fin_mission_etablissement_coach: {
    sujet: 'Mission terminée ✅',
    titre: 'Mission terminée ✅',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  rappel_mission_j1_etablissement: {
    sujet: "C'est demain ! - Renford ✨",
    titre: "C'est demain ! - Renford ✨",
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  rappel_mission_j1_renford: {
    sujet: 'Ta mission Renford commence demain ✨',
    titre: 'Ta mission Renford commence demain ✨',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  rappel_mission_72h_renford: {
    sujet: '🕦 Rappel – Mission dans moins de 72h',
    titre: '🕦 Rappel – Mission dans moins de 72h',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  rappel_mission_72h_etablissement: {
    sujet: 'Rappel – Votre Renford arrive dans moins de 72h',
    titre: 'Rappel – Votre Renford arrive dans moins de 72h',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  mission_annulee_renford: {
    sujet: 'Mise à jour concernant votre mission Renford',
    titre: 'Mise à jour de ta mission',
    intro: 'Hello {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  profil_non_retenu_renford: {
    sujet: 'Retour sur votre candidature – {{typeMission}}',
    titre: 'Retour sur votre candidature – Renford',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  profil_suspect: {
    sujet: 'Vérification de votre profil Renford',
    titre: 'Vérification de votre profil Renford',
    intro: 'Bonjour,',
    ctaLabel: 'Compléter mon profil',
    closing:
      "Merci pour votre compréhension et au plaisir de vous retrouver bientôt actif·ve sur Renford !\nL'équipe Renford",
  },

  profil_suspect_2: {
    sujet: '⛔ Suppression de votre compte dans 48h',
    titre: '⛔ Suppression de votre compte dans 48h',
    intro: 'Bonjour,',
    ctaLabel: 'Compléter mon profil',
    closing: "Merci pour votre compréhension,\nL'équipe Renford",
  },

  contrat_a_signer_etablissement: {
    sujet: '📝 Contrat à signer – Mission',
    titre: '📝 Contrat à signer',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  contrat_a_signer_renford: {
    sujet: '📝 Contrat à signer – Mission',
    titre: '📝 Contrat à signer',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  contrat_signe_etablissement_coach: {
    sujet: '✅ Contrat signé – Mission COACH prête à démarrer',
    titre: "✅ Contrat signé – C'est parti !",
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  contrat_signe_etablissement_flex: {
    sujet: '✅ Contrat signé & paiement confirmé – Mission FLEX',
    titre: '✅ Contrat signé & paiement OK',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  profil_accepte_etablissement_coach: {
    sujet: '👍 Profil accepté – Mission Renford COACH',
    titre: '👍 Profil accepté !',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  programmer_echange_etablissement: {
    sujet: '📅 Programmez votre échange',
    titre: '📅 Programmez votre échange',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  profils_tous_refuses_etablissement: {
    sujet: "🔍 Recherche d'un nouveau profil en cours",
    titre: '🔍 Nous cherchons un nouveau profil',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  apres_visio_etablissement: {
    sujet: '💬 Échange – Votre retour',
    titre: '💬 Alors, cet échange ?',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  apres_visio_renford: {
    sujet: '💬 Échange – Ton retour',
    titre: '💬 Alors, cet échange ?',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  apres_confirmation_renford_coach: {
    sujet: '🚀 Ta mission est confirmée !',
    titre: '🚀 Ta mission est confirmée !',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  refus_renford_coach: {
    sujet: 'On comprend, à bientôt !',
    titre: 'On comprend, à bientôt !',
    intro: 'Bonjour {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  profil_annule_etablissement: {
    sujet: 'Mise à jour de votre mission – Profil indisponible',
    titre: 'Mise à jour de votre mission',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  mission_annulee_par_renford_etablissement: {
    sujet: 'Annulation de votre mission par votre Renford',
    titre: 'Annulation de mission par votre Renford',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  changement_signale_etablissement: {
    sujet: 'Changement signalé sur votre mission',
    titre: 'Changement signalé sur votre mission',
    intro: 'Bonjour {{prenomEtablissement}},',
    ctaLabel: null,
    closing: null,
  },

  changement_signale_renford: {
    sujet: 'Changement signalé sur ta mission',
    titre: 'Changement signalé sur ta mission',
    intro: 'Hello {{prenomRenford}},',
    ctaLabel: null,
    closing: null,
  },

  abonnement_activation: {
    sujet: '🎉 Votre abonnement est activé !',
    titre: '🎉 Votre abonnement est activé !',
    intro:
      'Bonjour {{prenom}},\n\nVotre abonnement Renford est maintenant actif. Vous pouvez dès à présent publier vos missions.',
    ctaLabel: 'Accéder à mon espace abonnement',
    closing: 'Pour toute question, contactez notre support. À très bientôt sur Renford !',
  },

  abonnement_renewal: {
    sujet: '✅ Renouvellement de votre abonnement',
    titre: '✅ Renouvellement de votre abonnement',
    intro: 'Bonjour {{prenom}},\n\nVotre abonnement Renford a été renouvelé avec succès.',
    ctaLabel: 'Consulter mon abonnement',
    closing: "Merci pour votre confiance. L'équipe Renford.",
  },

  abonnement_cancellation: {
    sujet: 'Votre abonnement a été annulé',
    titre: 'Votre abonnement a été annulé',
    intro:
      "Bonjour {{prenom}},\n\nVotre abonnement Renford a été annulé. Vous conservez l'accès à vos missions en cours.",
    ctaLabel: 'Voir les offres disponibles',
    closing: "Si cette annulation est une erreur, contactez-nous. L'équipe Renford.",
  },

  abonnement_payment_failed: {
    sujet: '⚠️ Échec du paiement de votre abonnement Renford',
    titre: '⚠️ Échec du paiement de votre abonnement',
    intro:
      'Bonjour {{prenom}},\n\nLe prélèvement pour votre abonnement Renford a échoué. Votre compte est temporairement suspendu.',
    ctaLabel: 'Mettre à jour mon moyen de paiement',
    closing: "Si le problème persiste, contactez notre support. L'équipe Renford.",
  },
};
