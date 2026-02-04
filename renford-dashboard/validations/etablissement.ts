// Types d'établissement
export const TYPE_ETABLISSEMENT = [
  "salle_sport_gymnase",
  "centre_fitness",
  "studio_yoga",
  "studio_pilates",
  "centre_bien_etre",
  "club_escalade",
  "centre_sports_aquatiques",
  "ecole_danse",
  "centre_formation_sportive",
  "club_sport_combat",
  "centre_arts_martiaux",
  "complexe_multisports",
  "club_golf",
  "club_tennis",
  "centre_athletisme",
  "etablissement_sports_extremes",
  "centre_equestre",
  "club_cyclisme",
  "club_course_pied",
  "club_tir_arc",
  "club_voile_nautique",
  "centre_musculation",
  "centre_reeducation",
  "stade_arene",
  "association_sportive",
  "complexe_loisirs",
  "academie_sportive",
  "ecole_surf",
] as const;

// Labels pour l'affichage
export const TYPE_ETABLISSEMENT_LABELS: Record<
  (typeof TYPE_ETABLISSEMENT)[number],
  string
> = {
  salle_sport_gymnase: "Salle de sport / Gymnase",
  centre_fitness: "Centre de fitness",
  studio_yoga: "Studio de yoga",
  studio_pilates: "Studio de pilates",
  centre_bien_etre: "Centre de bien-être",
  club_escalade: "Club d'escalade",
  centre_sports_aquatiques: "Centre de sports aquatiques",
  ecole_danse: "École de danse",
  centre_formation_sportive: "Centre de formation sportive",
  club_sport_combat: "Club de sport de combat",
  centre_arts_martiaux: "Centre d'arts martiaux",
  complexe_multisports: "Complexe multisports",
  club_golf: "Club de golf",
  club_tennis: "Club de tennis",
  centre_athletisme: "Centre d'athlétisme",
  etablissement_sports_extremes: "Établissement de sports extrêmes",
  centre_equestre: "Centre équestre",
  club_cyclisme: "Club de cyclisme",
  club_course_pied: "Club de course à pied",
  club_tir_arc: "Club de tir à l'arc",
  club_voile_nautique: "Club de voile / nautique",
  centre_musculation: "Centre de musculation",
  centre_reeducation: "Centre de rééducation",
  stade_arene: "Stade / Arène",
  association_sportive: "Association sportive",
  complexe_loisirs: "Complexe de loisirs",
  academie_sportive: "Académie sportive",
  ecole_surf: "École de surf",
};

// Rôle d'établissement
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
