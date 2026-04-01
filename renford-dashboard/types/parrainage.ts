export type Filleul = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  typeUtilisateur: string;
  dateCreation: string;
  profilRenford: {
    id: string;
    avatarChemin: string | null;
    titreProfil: string | null;
    noteMoyenne: number | null;
  } | null;
};
