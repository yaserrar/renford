export type IndisponibiliteRenford = {
  id: string;
  profilRenfordId: string;
  date: string;
  heureDebut: number | null; // minutes since midnight
  heureFin: number | null; // minutes since midnight
  journeeEntiere: boolean;
  dateCreation: string;
};
