// Centralized labels for all enums, grouped by model for clarity.
// Each inner object maps enum values to their user-facing labels.
export const ENums = {
  Utilisateur: {
    RoleUtilisateur: {
      admin: 'Administrateur',
      coordinateur_national: 'Coordinateur National',
      coordinateur_regional: 'Coordinateur Régional',
      coordinateur_provincial: 'Coordinateur Provincial',
      superviseur: 'Superviseur',
      eleve: 'Élève',
    },
    StatutCompte: {
      actif: 'Actif',
      inactif: 'Inactif',
      suspendu: 'Suspendu',
    },
  },

  Etablissement: {
    TypeEtablissement: {
      primaire: 'Primaire',
      college: 'Collège',
      lycee: 'Lycée',
    },
    StatutApprobation: {
      en_attente: 'En attente',
      approuve: 'Approuvé',
      refuse: 'Refusé',
    },
  },

  Eleve: {
    Genre: {
      garcon: 'Garçon',
      fille: 'Fille',
    },
    NiveauScolaire: {
      cp: 'CP',
      ce1: 'CE1',
      ce2: 'CE2',
      cm1: 'CM1',
      cm2: 'CM2',
      sixieme_primaire: '6ème Primaire',
      premiere_college: '1ère Collège',
      deuxieme_college: '2ème Collège',
      troisieme_college: '3ème Collège',
      tronc_commun: 'Tronc Commun',
      premiere_bac: '1ère Bac',
      deuxieme_bac: '2ème Bac',
    },
    TypePasseport: {
      rouge: 'Rouge (1-10 livres)',
      vert: 'Vert (11-20 livres)',
      bleu: 'Bleu (21-30 livres)',
      gris: 'Gris (31-40 livres)',
      or: 'Or (41-50 livres)',
    },
  },

  Livre: {
    CategorieLivre: {
      premiere_etape: '1ère Étape (5-20 pages)',
      deuxieme_etape: '2ème Étape (21-30 pages)',
      troisieme_etape: '3ème Étape (31-50 pages)',
      quatrieme_etape: '4ème Étape (51-100 pages)',
      autres_textes: 'Autres Textes',
    },
  },

  Lecture: {
    StatutLecture: {
      en_cours: 'En cours',
      termine: 'Terminé',
      abandonne: 'Abandonné',
    },
  },

  Resume: {
    TypeResume: {
      ecrit: 'Écrit',
      audio: 'Audio',
      fichier: 'Fichier',
    },
    StatutResume: {
      en_attente: 'En attente',
      valide: 'Validé',
      refuse: 'Refusé',
      revision: 'À réviser',
    },
  },

  Competition: {
    NiveauCompetition: {
      etablissement: 'Établissement',
      provincial: 'Provincial',
      regional: 'Régional',
      national: 'National',
    },
    StatutCompetition: {
      planifiee: 'Planifiée',
      en_cours: 'En cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    },
  },

  Message: {
    TypeConversation: {
      directe: 'Directe',
      groupe: 'Groupe',
    },
    TypeMessage: {
      texte: 'Texte',
      image: 'Image',
      fichier: 'Fichier',
      systeme: 'Système',
    },
  },

  Notification: {
    TypeNotification: {
      nouveau_resume: 'Nouveau résumé',
      resume_corrige: 'Résumé corrigé',
      passeport_obtenu: 'Passeport obtenu',
      competition: 'Compétition',
      message: 'Message',
      approbation_etablissement: 'Approbation établissement',
      inscription_eleve: 'Inscription élève',
      systeme: 'Système',
    },
  },
} as const;

// Create a flat lookup map from grouped enums
const FLAT_ENUMS: Record<string, string> = Object.values(ENums).reduce(
  (acc: Record<string, string>, group) => {
    Object.values(group as Record<string, Record<string, string>>).forEach((enumMap) => {
      Object.entries(enumMap).forEach(([k, v]) => {
        acc[k] = v;
      });
    });
    return acc;
  },
  {},
);

export const getEnumLabel = (enumValue: string) => {
  return enumValue ? (FLAT_ENUMS[String(enumValue)] ?? String(enumValue)) : '-';
};
