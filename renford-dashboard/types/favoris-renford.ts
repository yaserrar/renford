import { NiveauExperience } from "@/types/profil-renford";

export type FavorisRenfordItem = {
  id: string;
  profilEtablissementId: string;
  profilRenfordId: string;
  dateCreation: Date | string;
  profilRenford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
    niveauExperience: NiveauExperience | null;
    noteMoyenne: number | null;
    ville: string | null;
    utilisateur: {
      id: string;
      nom: string;
      prenom: string;
    };
  };
};
