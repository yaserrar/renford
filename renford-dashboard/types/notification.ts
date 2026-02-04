import {
  CANAL_NOTIFICATION,
  TYPE_NOTIFICATION,
} from "@/validations/notification";

// Type de notification
export type TypeNotification = (typeof TYPE_NOTIFICATION)[number];

// Canal de notification
export type CanalNotification = (typeof CANAL_NOTIFICATION)[number];

// Notification
export type Notification = {
  id: string;
  destinataireId: string;
  expediteurId: string | null;
  type: TypeNotification;
  canal: CanalNotification;
  titre: string;
  contenu: string;
  lienAction: string | null;
  entiteType: string | null;
  entiteId: string | null;
  lu: boolean;
  luLe: Date | null;
  envoye: boolean;
  envoyeLe: Date | null;
  dateCreation: Date;
};
