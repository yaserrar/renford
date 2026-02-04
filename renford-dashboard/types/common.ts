// Favori Renford
export type FavoriRenford = {
  id: string;
  etablissementId: string;
  profilRenfordId: string | null;
  nomComplet: string | null;
  email: string | null;
  telephone: string | null;
  dateCreation: Date;
};

// Conversation
export type Conversation = {
  id: string;
  participantIds: string[];
  missionId: string | null;
  estSupportRenford: boolean;
  sujetSupport: string | null;
  dernierMessage: Date | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Message
export type Message = {
  id: string;
  conversationId: string;
  expediteurId: string;
  destinataireId: string | null;
  contenu: string;
  pieceJointeUrl: string | null;
  pieceJointeNom: string | null;
  lu: boolean;
  luLe: Date | null;
  dateCreation: Date;
};

// Journal d'activité
export type JournalActivite = {
  id: string;
  utilisateurId: string | null;
  action: string;
  entiteType: string | null;
  entiteId: string | null;
  details: Record<string, unknown> | null;
  adresseIp: string | null;
  userAgent: string | null;
  dateCreation: Date;
};

// Session Refresh
export type SessionRefresh = {
  id: string;
  utilisateurId: string;
  refreshToken: string;
  userAgent: string | null;
  adresseIp: string | null;
  dateExpiration: Date;
  estRevoque: boolean;
  dateRevocation: Date | null;
  dateCreation: Date;
};
