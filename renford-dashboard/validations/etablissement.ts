// Rôle d'établissement (enum RoleEtablissement du Prisma schema)
export const ROLE_ETABLISSEMENT = ["principal", "secondaire"] as const;

// Départements Île-de-France
export const DEPARTEMENT_IDF = [
  "paris_75",
  "seine_et_marne_77",
  "yvelines_78",
  "essonne_91",
  "hauts_de_seine_92",
  "seine_saint_denis_93",
  "val_de_marne_94",
  "val_doise_95",
] as const;

// Labels pour les départements
export const DEPARTEMENT_IDF_LABELS: Record<
  (typeof DEPARTEMENT_IDF)[number],
  string
> = {
  paris_75: "Paris (75)",
  seine_et_marne_77: "Seine-et-Marne (77)",
  yvelines_78: "Yvelines (78)",
  essonne_91: "Essonne (91)",
  hauts_de_seine_92: "Hauts-de-Seine (92)",
  seine_saint_denis_93: "Seine-Saint-Denis (93)",
  val_de_marne_94: "Val-de-Marne (94)",
  val_doise_95: "Val-d'Oise (95)",
};
