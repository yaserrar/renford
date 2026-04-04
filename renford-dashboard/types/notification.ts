export type SourceNotification =
  | "missions"
  | "mission_renfords"
  | "etablissements"
  | "renfords"
  | "paiements"
  | "systeme";

export type NotificationItem = {
  id: string;
  utilisateurId: string;
  titre: string;
  description: string;
  source: SourceNotification;
  sourceId: string | null;
  lu: boolean;
  dateCreation: string;
  dateMiseAJour: string;
  targetPath: string | null;
};

export type NotificationsPaginatedResponse = {
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UnreadNotificationsCountResponse = {
  count: number;
};
