import { STATUT_DOCUMENT, TYPE_DOCUMENT } from "@/validations/document";

// Type de document
export type TypeDocument = (typeof TYPE_DOCUMENT)[number];

// Statut de document
export type StatutDocument = (typeof STATUT_DOCUMENT)[number];

// Document Renford
export type DocumentRenford = {
  id: string;
  profilRenfordId: string;
  typeDocument: TypeDocument;
  nomFichier: string;
  cheminFichier: string;
  tailleFichier: number | null;
  mimeType: string | null;
  statut: StatutDocument;
  dateExpiration: Date | null;
  verifie: boolean;
  dateVerification: Date | null;
  commentaireVerification: string | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};

// Document Mission
export type DocumentMission = {
  id: string;
  missionId: string;
  typeDocument: TypeDocument;
  nomFichier: string;
  cheminFichier: string;
  tailleFichier: number | null;
  mimeType: string | null;
  statut: StatutDocument;
  signatureExterneId: string | null;
  fournisseurSignature: string | null;
  dateSigne: Date | null;
  signeParId: string | null;
  dateCreation: Date;
  dateMiseAJour: Date;
};
