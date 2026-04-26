export type EmailVarMeta = {
  name: string;
  description: string;
};

export type EmailTemplateDefaults = {
  sujet: string;
  titre: string;
  intro: string;
  closing: string | null;
  ctaLabel: string | null;
};

export type EmailTemplateCustomValues = {
  sujet: string | null;
  titre: string | null;
  intro: string | null;
  corps: string | null;
  closing: string | null;
  ctaLabel: string | null;
};

export type AdminEmailTemplateRecord = {
  id: string;
  type: string;
  sujet: string | null;
  titre: string | null;
  intro: string | null;
  corps: string | null;
  closing: string | null;
  ctaLabel: string | null;
  actif: boolean;
  dateCreation: string;
  dateMiseAJour: string;
};

export type AdminEmailTemplateListItem = {
  type: string;
  label: string;
  description: string;
  variables: EmailVarMeta[];
  customise: boolean;
  actif: boolean;
  defaultValues: EmailTemplateDefaults;
  customValues: EmailTemplateCustomValues | null;
  effectiveValues: EmailTemplateDefaults;
  template: AdminEmailTemplateRecord | null;
};

export type UpsertEmailTemplatePayload = {
  sujet?: string | null;
  titre?: string | null;
  intro?: string | null;
  corps?: string | null;
  closing?: string | null;
  ctaLabel?: string | null;
  actif?: boolean;
};
