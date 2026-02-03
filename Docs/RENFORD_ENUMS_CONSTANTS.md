# RENFORD - Enums, Constants & Possible Values

This document contains all enumeration values, constants, and predefined lists used throughout the Renford platform.

---

## 1. User & Account Types

### 1.1 User Types (UserType)

```typescript
enum UserType {
  ETABLISSEMENT = "etablissement", // Sports establishment
  RENFORD = "renford", // Freelancer
  ADMINISTRATOR = "administrator", // Platform admin
}
```

### 1.2 Account Status

```typescript
enum AccountStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BANNED = "banned",
  PENDING_VERIFICATION = "pending_verification",
  DEACTIVATED = "deactivated",
}
```

### 1.3 Profile Certification Status

```typescript
enum CertificationStatus {
  PENDING = "pending",
  CERTIFIED = "certified",
  REJECTED = "rejected",
}
```

---

## 2. Establishment Types (Annexe 1)

### 2.1 EstablishmentType

```typescript
enum EstablishmentType {
  SALLE_SPORT_GYMNASE = "Salle de sport / Gymnase",
  CENTRE_FITNESS = "Centre de fitness",
  STUDIO_YOGA = "Studio de yoga",
  STUDIO_PILATES = "Studio de pilates",
  CENTRE_BIEN_ETRE = "Centre de bien-être",
  CLUB_ESCALADE = "Club d'escalade",
  CENTRE_SPORTS_AQUATIQUES = "Centre de sports aquatiques",
  ECOLE_DANSE = "École de danse",
  CENTRE_FORMATION_SPORTIVE = "Centre de formation sportive",
  CLUB_SPORT_COMBAT = "Club de sport de combat",
  CENTRE_ARTS_MARTIAUX = "Centre d'arts martiaux",
  COMPLEXE_MULTISPORTS = "Complexe multisports",
  CLUB_GOLF = "Club de golf",
  CLUB_TENNIS = "Club de tennis",
  CENTRE_ATHLETISME = "Centre d'athlétisme",
  ETABLISSEMENT_SPORTS_EXTREMES = "Établissement de sports extrêmes",
  CENTRE_EQUESTRE = "Centre équestre",
  CLUB_CYCLISME = "Club de cyclisme",
  CLUB_COURSE_PIED = "Club de course à pied",
  CLUB_TIR_ARC = "Club de tir à l'arc",
  CLUB_VOILE_NAUTIQUE = "Club de voile / sports nautiques",
  CENTRE_MUSCULATION = "Centre de musculation / bodybuilding",
  CENTRE_REEDUCATION = "Centre de rééducation sportive / kinésithérapie",
  STADE_ARENE = "Stade ou arène sportive",
  ASSOCIATION_SPORTIVE = "Association sportive",
  COMPLEXE_LOISIRS = "Complexe de loisirs sportifs",
  ACADEMIE_SPORTIVE = "Académie sportive",
  ECOLE_SURF = "École de surf / kitesurf",
}
```

### 2.2 Establishment Role

```typescript
enum EstablishmentRole {
  MAIN = "main", // Principal establishment
  SECONDARY = "secondary", // Secondary/branch establishment
}
```

---

## 3. Position Types & Specializations (Annexe 2)

### 3.1 Position Types (MissionType / PositionType)

```typescript
enum PositionType {
  // Main categories
  PILATES = "Pilates",
  YOGA = "Yoga",
  FITNESS_MUSCULATION = "Fitness & Musculation",
  ESCALADE = "Escalade",
  BOXE = "Boxe",
  DANSE = "Danse",
  GYMNASTIQUE = "Gymnastique",
  TENNIS = "Tennis",
  APA = "Activité Physique Adaptée (APA)",
}
```

### 3.2 Pilates Specializations

```typescript
const PilatesSpecializations = [
  "Matwork (au sol)",
  "Reformer",
  "Cadillac",
  "Chair (Wunda Chair)",
  "Pilates sur petits matériels (ballon, élastique, foam roller...)",
  "Pilates prénatal / postnatal",
  "Pilates seniors / adapté",
  "Pilates dynamique (power pilates)",
  "Pilates thérapeutique / rééducation",
  "Lagree Fitness",
];
```

### 3.3 Yoga Specializations

```typescript
const YogaSpecializations = [
  "Hatha Yoga",
  "Vinyasa Yoga",
  "Ashtanga Yoga",
  "Yin Yoga",
  "Kundalini Yoga",
  "Yoga prénatal / postnatal",
  "Yoga Nidra (relaxation guidée)",
  "Power Yoga",
  "Yoga seniors / adapté",
  "Yoga enfants",
  "Yoga thérapeutique",
];
```

### 3.4 Fitness & Musculation Specializations

```typescript
const FitnessSpecializations = [
  "CAF (Cuisses Abdos Fessiers)",
  "Body Sculpt / Renfo global",
  "LIA (Low Impact Aerobic)",
  "Step / Step chorégraphié",
  "HIIT / Tabata",
  "Circuit training",
  "Cross Training / CrossFit",
  "TRX / Suspension training",
  "RPM / Vélo Indoor",
  "Body Pump",
  "Stretching / Mobilité",
  "Cardio boxing",
  "Bootcamp",
  "Gym posturale / dos",
];
```

### 3.5 Escalade Specializations

```typescript
const EscaladeSpecializations = [
  "Encadrement en salle (bloc / voie)",
  "Encadrement en milieu naturel",
  "Ouvreur de voies/blocs",
  "Coaching escalade (performance)",
  "Cours enfants / ados",
  "Escalade thérapeutique / APA",
  "Initiation / loisirs adultes",
];
```

### 3.6 Boxe Specializations

```typescript
const BoxeSpecializations = [
  "Boxe anglaise",
  "Boxe française / savate",
  "Kickboxing",
  "Muay Thai",
  "Boxe éducative enfants / ados",
  "Cardio Boxe / Boxe fitness",
  "Coaching boxe (loisir ou compétiteur)",
];
```

### 3.7 Danse Specializations

```typescript
const DanseSpecializations = [
  "Danse classique",
  "Danse contemporaine",
  "Jazz / Modern jazz",
  "Hip Hop / Street dance",
  "Ragga dancehall",
  "Danses latines (salsa, bachata...)",
  "Zumba",
  "Danse africaine",
  "Danse enfants",
  "Barre au sol",
];
```

### 3.8 Gymnastique Specializations

```typescript
const GymnastiqueSpecializations = [
  "Baby-gym",
  "Gymnastique artistique",
  "Gym au sol",
  "Gym tonique",
  "Gym douce",
  "Gym senior",
  "Gym adaptée (APA)",
  "Acrogym / Portés acrobatiques",
];
```

### 3.9 Tennis Specializations

```typescript
const TennisSpecializations = [
  "Tennis loisir enfants",
  "Tennis compétition jeunes",
  "Tennis adulte loisir",
  "Tennis senior / sport santé",
  "Préparation physique pour tennis",
  "Tennis en fauteuil (adapté)",
];
```

### 3.10 APA Specializations

```typescript
const APASpecializations = [
  "APA pathologies métaboliques (diabète, obésité...)",
  "APA pathologies chroniques (cancer, Parkinson...)",
  "APA seniors / prévention chute",
  "APA santé mentale",
  "APA handicap moteur",
  "APA handicap psychique / cognitif",
  "APA rééducation post-blessure",
  "APA en EHPAD / structures médico-sociales",
];
```

---

## 4. Experience Levels (Annexe 12)

### 4.1 ExperienceLevel

```typescript
enum ExperienceLevel {
  DEBUTANT = "Débutant (moins de 2 ans d'expérience)",
  CONFIRME = "Confirmé (entre 5 et 10 ans d'expérience)",
  EXPERT = "Expert (plus de 10 ans d'expérience)",
}
```

---

## 5. Diplomas & Certifications (Annexe 11)

### 5.1 University Diplomas

```typescript
const UniversityDiplomas = {
  LICENCE_STAPS: {
    name: "Licence STAPS",
    mentions: [
      "Mention Entraînement Sportif",
      "Mention Activité Physique Adaptée",
      "Mention Éducation et Motricité",
      "Mention Management du Sport",
    ],
  },
  MASTER_STAPS: {
    name: "Master STAPS",
    mentions: [
      "Entraînement et Optimisation de la Performance Sportive",
      "Activités Physiques Adaptées et Santé",
      "Ingénierie et Ergonomie de l'Activité Physique",
      "Management du Sport",
    ],
  },
  DOCTORAT_SCIENCES_SPORT: {
    name: "Doctorat en Sciences du Sport",
    mentions: ["Recherche spécialisée"],
  },
};
```

### 5.2 State Diplomas

```typescript
const StateDiplomas = {
  BPJEPS: {
    name: "BPJEPS (Brevet Professionnel de la Jeunesse, de l'Éducation Populaire et du Sport)",
    specialties: [
      "Activités Gymniques, de la Forme et de la Force (AGFF)",
      "Activités Aquatiques et de la Natation",
      "Activités Physiques pour Tous",
      "Activités de la Randonnée",
    ],
  },
  DEJEPS: {
    name: "DEJEPS (Diplôme d'État de la Jeunesse, de l'Éducation Populaire et du Sport)",
    specialties: [
      "Perfectionnement Sportif",
      "Développement de Projets",
      "Territoires et Réseaux",
    ],
  },
  DESJEPS: {
    name: "DESJEPS (Diplôme d'État Supérieur de la Jeunesse, de l'Éducation Populaire et du Sport)",
    specialties: [
      "Direction de Projets et de Structures Territoriales",
      "Entraînement Sportif",
      "Animation Socio-éducative",
    ],
  },
};
```

### 5.3 Professional Certificates

```typescript
const ProfessionalCertificates = {
  CQP: {
    name: "CQP (Certificat de Qualification Professionnelle)",
    examples: [
      "Moniteur d'escalade",
      "Instructeur de fitness",
      "Coach en musculation",
    ],
  },
  BREVETS_FEDERAUX: {
    name: "Brevets Fédéraux",
    description: "Issus des fédérations sportives",
  },
};
```

### 5.4 Specific Diplomas

```typescript
const SpecificDiplomas = [
  "BEES (Brevet d'État d'Éducateur Sportif)",
  "Certificat d'Aptitude à l'Enseignement de la Danse (CAED)",
  "Diplôme d'État de Masseur-Kinésithérapeute",
  "Diplôme de Préparateur Physique",
];
```

---

## 6. Equipment Lists (Annexe 4)

### 6.1 Coach Sportif Equipment

```typescript
const CoachSportifEquipment = {
  FITNESS_MUSCULATION: [
    "Tapis de yoga ou fitness",
    "Élastiques de résistance",
    "Haltères ou kettlebells",
    "Corde à sauter",
    "Gants de musculation",
    "Serviette",
    "Montre ou tracker de fitness",
  ],
  NUTRITION: [
    "Outils pour analyses corporelles (pèse-personne connecté, caliper)",
    "Tablettes pour les suivis nutritionnels",
  ],
};
```

### 6.2 Encadrant Sportif Equipment

```typescript
const EncadrantEquipment = {
  ESCALADE: [
    "Chaussons d'escalade",
    "Harnais",
    "Corde d'escalade",
    "Système d'assurage",
    "Casque",
  ],
  NATATION: [
    "Maillot de bain",
    "Bonnet de bain",
    "Lunettes de natation",
    "Palmes",
    "Planche de natation",
  ],
  SPORTS_COLLECTIFS: [
    "Ballons (football, basketball, handball)",
    "Protège-tibias",
    "Cônes d'entraînement",
    "Chasubles",
  ],
  SPORTS_COMBAT: [
    "Gants de boxe",
    "Protège-tibias",
    "Casques de protection",
    "Kimono",
    "Ceintures",
  ],
  SPORTS_RAQUETTE: [
    "Raquettes",
    "Balles ou volants",
    "Cordages de rechange",
    "Grip de raquette",
  ],
  SPORTS_HIVER: [
    "Casque de ski",
    "Gants",
    "Lunettes de ski",
    "Vêtements techniques (pantalon et veste de ski)",
  ],
};
```

### 6.3 Instructeur Spécialisé Equipment

```typescript
const InstructeurEquipment = {
  PILATES_YOGA: [
    "Tapis de yoga ou fitness",
    "Briques de yoga",
    "Sangle de yoga",
    "Chaussures spécifiques pour la danse ou le CrossFit",
  ],
  AQUAGYM: [
    "Maillot de bain",
    "Équipements de flottaison",
    "Aquadumbbells",
    "Frites de piscine",
  ],
  SPINNING: [
    "Vélo de spinning/cycling",
    "Chaussures spécifiques pour pédales automatiques",
    "Bidon d'eau",
  ],
};
```

### 6.4 Kinésithérapeute Equipment

```typescript
const KinesitherapeuteEquipment = [
  "Tables de massage",
  "Huiles ou crèmes de massage",
  "Bandages élastiques",
  "Outils pour thérapie par pression",
];
```

### 6.5 Professeur Yoga/Pilates Equipment

```typescript
const ProfesseurYogaPilatesEquipment = [
  "Tapis de yoga",
  "Reformer Pilates",
  "Briques de yoga",
  "Sangles",
];
```

---

## 7. Mission Types & Statuses

### 7.1 Mission Mode

```typescript
enum MissionMode {
  FLEX = "flex", // Express/short-term missions
  COACH = "coach", // Long-term/contractualized missions
}
```

### 7.2 Mission Status

```typescript
enum MissionStatus {
  ENVOYEE = "envoyée",
  EN_MATCHING = "en_cours_de_matching",
  PROPOSEE = "proposée",
  ACCEPTEE = "acceptée",
  CONTRAT_SIGNE = "contrat_signé",
  PAYEE = "payée",
  EN_COURS = "en_cours",
  A_VALIDER = "à_valider",
  VALIDEE = "validée",
  TERMINEE = "terminée",
  ARCHIVEE = "archivée",
  ANNULEE = "annulée",
}
```

### 7.3 Payment Status

```typescript
enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  HELD = "held", // Funds held pending validation
  RELEASED = "released", // Funds released to Renford
  REFUNDED = "refunded",
  FAILED = "failed",
  DISPUTED = "disputed",
}
```

---

## 8. Pricing

### 8.1 Pricing Method

```typescript
enum PricingMethod {
  HOURLY = "hourly", // Per hour
  FIXED = "fixed", // Fixed amount
  DEGRESSIVE = "degressive", // Based on participant count
}
```

### 8.2 Hourly Rate Brackets

```typescript
enum HourlyRateBracket {
  LESS_THAN_45 = "Moins de 45 euros de l'heure",
  BETWEEN_45_59 = "Entre 45 et 59 euros de l'heure",
  MORE_THAN_60 = "Plus de 60 euros de l'heure",
}
```

### 8.3 Flexibility Percentages

```typescript
const FlexibilityOptions = [
  { value: 0, label: "Aucune flexibilité (je reste sur mon tarif affiché)" },
  {
    value: 5,
    label: "Je peux baisser un peu (ex : 47,50 € si je demande 50 €)",
  },
  { value: 10, label: "Je suis ouvert·e à étudier selon la mission" },
  { value: 15, label: "Oui, si la mission vaut le coup" },
];
```

### 8.4 Tarif Validation Range

```typescript
const TarifValidation = {
  hourlyMin: 20, // €20/hour minimum
  hourlyMax: 200, // €200/hour maximum
};
```

---

## 9. Schedule & Availability

### 9.1 Days of Week

```typescript
enum DayOfWeek {
  MONDAY = "Lundi",
  TUESDAY = "Mardi",
  WEDNESDAY = "Mercredi",
  THURSDAY = "Jeudi",
  FRIDAY = "Vendredi",
  SATURDAY = "Samedi",
  SUNDAY = "Dimanche",
}
```

### 9.2 Availability Type

```typescript
enum AvailabilityType {
  UNLIMITED = "unlimited", // Available indefinitely
  DATE_RANGE = "date_range", // Available for specific dates
}
```

---

## 10. Location (Île-de-France Departments)

### 10.1 IDF Departments

```typescript
const IDFDepartments = [
  { code: "75", name: "Paris" },
  { code: "77", name: "Seine-et-Marne" },
  { code: "78", name: "Yvelines" },
  { code: "91", name: "Essonne" },
  { code: "92", name: "Hauts-de-Seine" },
  { code: "93", name: "Seine-Saint-Denis" },
  { code: "94", name: "Val-de-Marne" },
  { code: "95", name: "Val-d'Oise" },
];
```

### 10.2 Adjacent Departments Map (for matching)

```typescript
const AdjacentDepartments = {
  Paris: ["Hauts-de-Seine", "Seine-Saint-Denis", "Val-de-Marne"],
  "Seine-et-Marne": ["Val-de-Marne", "Essonne"],
  Yvelines: ["Hauts-de-Seine", "Val-d'Oise", "Essonne"],
  Essonne: ["Hauts-de-Seine", "Val-de-Marne", "Seine-et-Marne", "Yvelines"],
  "Hauts-de-Seine": ["Paris", "Yvelines", "Essonne", "Val-de-Marne"],
  "Seine-Saint-Denis": ["Paris", "Val-d'Oise", "Val-de-Marne"],
  "Val-de-Marne": [
    "Paris",
    "Seine-Saint-Denis",
    "Hauts-de-Seine",
    "Essonne",
    "Seine-et-Marne",
  ],
  "Val-d'Oise": ["Yvelines", "Seine-Saint-Denis"],
};
```

---

## 11. Notifications

### 11.1 Notification Channel

```typescript
enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  DASHBOARD = "dashboard",
  CALENDAR = "calendar",
}
```

### 11.2 Notification Type

```typescript
enum NotificationType {
  NEW_MISSION = "new_mission",
  MISSION_ACCEPTED = "mission_accepted",
  MISSION_REFUSED = "mission_refused",
  CONTRACT_READY = "contract_ready",
  CONTRACT_SIGNED = "contract_signed",
  PAYMENT_PROCESSED = "payment_processed",
  PAYMENT_RECEIVED = "payment_received",
  MISSION_REMINDER_1_WEEK = "mission_reminder_1_week",
  MISSION_REMINDER_2_DAYS = "mission_reminder_2_days",
  MISSION_STARTED = "mission_started",
  MISSION_COMPLETED = "mission_completed",
  EVALUATION_REQUEST = "evaluation_request",
  EVALUATION_REMINDER = "evaluation_reminder",
  QUOTE_REMINDER = "quote_reminder",
  DOCUMENT_EXPIRING = "document_expiring",
  PROFILE_UPDATE_REQUIRED = "profile_update_required",
  WELCOME = "welcome",
}
```

---

## 12. Evaluations & Ratings

### 12.1 Service Quality Rating

```typescript
enum ServiceQualityRating {
  EXCELLENT = "Excellent",
  TRES_BIEN = "Très bien",
  BIEN = "Bien",
  MOYEN = "Moyen",
  MEDIOCRE = "Médiocre",
}
```

### 12.2 Star Rating

```typescript
const StarRating = {
  min: 1,
  max: 5,
};
```

### 12.3 Satisfying Aspects (Multi-select for Renfords evaluating establishments)

```typescript
const SatisfyingAspects = [
  "Qualité du travail réalisé",
  "Professionnalisme de l'équipe",
  "Respect des délais",
  "Communication efficace",
  "Adaptabilité aux besoins spécifiques",
  "Compétences techniques/expertises",
  "Collaboration harmonieuse avec l'équipe existante",
  "Clarté des instructions fournies",
  "Résolution rapide des problèmes",
  "Valeur ajoutée apportée à la mission",
];
```

---

## 13. Mission Modification & Cancellation

### 13.1 Change Request Type

```typescript
enum ChangeRequestType {
  HORAIRES = "Horaires",
  DATE_DEBUT = "Date de début",
  DATE_FIN = "Date de fin",
  LIEU = "Lieu",
  AUTRE = "Autres",
}
```

### 13.2 Cancellation Reason

```typescript
enum CancellationReason {
  MALADIE = "Maladie",
  PROBLEME_PERSONNEL = "Problème personnel",
  CONFLIT_HORAIRE = "Conflit d'horaire",
  AUTRE = "Autres",
}
```

### 13.3 Absence Reason

```typescript
enum AbsenceReason {
  AUTRE_MISSION = "Autre mission imprévue",
  PROBLEME_COMMUNICATION = "Problème de communication",
  PROBLEME_DISPONIBILITE = "Problème de disponibilité",
  ABSENCE_NON_PREVUE = "Absence non prévue",
  AUTRE = "Autre",
}
```

### 13.4 Duration Adjustment Reason

```typescript
enum DurationAdjustmentReason {
  RETARD_DEMARRAGE = "Retard du démarrage de la mission",
  PROBLEME_IMPREVU = "Problème imprévu nécessitant une extension",
  PROLONGATION = "Prolongation de la durée initialement prévue",
  CHANGEMENT_BESOINS = "Changement dans les besoins de la mission",
  AUTRE = "Autre",
}
```

---

## 14. Documents

### 14.1 Document Type

```typescript
enum DocumentType {
  DEVIS = "devis", // Quote
  CONTRAT_PRESTATION = "contrat_prestation", // Service contract
  FACTURE = "facture", // Invoice
  ATTESTATION_MISSION = "attestation_mission",
  ATTESTATION_VIGILANCE = "attestation_vigilance",
  BORDEREAU_PAIEMENT = "bordereau_paiement",
  DIPLOME = "diplome",
  CARTE_PRO = "carte_pro",
  JUSTIFICATIF_ASSURANCE = "justificatif_assurance",
  NOTE_FRAIS = "note_frais",
}
```

### 14.2 Document Status

```typescript
enum DocumentStatus {
  DRAFT = "draft",
  PENDING_SIGNATURE = "pending_signature",
  SIGNED = "signed",
  ARCHIVED = "archived",
  EXPIRED = "expired",
}
```

---

## 15. Mission Preferences (Annexe 16)

### 15.1 Mission Preference Types (for Renfords)

```typescript
const MissionPreferences = [
  {
    category: "Coaching Individuel",
    options: [
      "Séances de coaching personnalisé pour un client unique",
      "Accompagnement spécifique sur des objectifs particuliers",
    ],
  },
  {
    category: "Sessions en Groupe",
    options: [
      "Cours collectifs (yoga, Pilates, Zumba, etc.)",
      "Entraînements en petit groupe (3-5 personnes)",
    ],
  },
  {
    category: "Ateliers et Workshops",
    options: [
      "Sessions thématiques (nutrition, bien-être, techniques de respiration)",
      "Journées découvertes ou initiation à une nouvelle discipline",
    ],
  },
  {
    category: "Événements Spéciaux",
    options: [
      "Animation d'événements sportifs (marathons, tournois, compétitions)",
      "Organisation et animation de team-building sportif",
    ],
  },
  {
    category: "Remplacement Temporaire",
    options: [
      "Remplacement d'un coach ou instructeur pour une durée déterminée",
      "Gestion temporaire des activités sportives",
    ],
  },
  {
    category: "Consultation et Accompagnement",
    options: [
      "Consultations en nutrition, diététique, ou bien-être mental",
      "Conseils et élaboration de programmes personnalisés",
    ],
  },
  {
    category: "Programmes Spécifiques",
    options: [
      "Entraînement pour des événements spécifiques (marathon, triathlon)",
      "Programmes de remise en forme postnatal ou rééducation",
    ],
  },
  {
    category: "Encadrement d'Enfants et d'Adolescents",
    options: [
      "Animation de cours ou activités pour enfants ou adolescents",
      "Organisation de camps sportifs ou d'initiation",
    ],
  },
  {
    category: "Formation et Certification",
    options: [
      "Sessions de formation (premiers secours, nouvelles techniques)",
      "Encadrement de sessions menant à une certification sportive",
    ],
  },
  {
    category: "Maintenance et Gestion des Équipements",
    options: [
      "Supervision de l'entretien des équipements sportifs",
      "Audit et conseils sur l'optimisation de l'espace",
    ],
  },
  {
    category: "Suivi et Évaluation des Clients",
    options: [
      "Bilan de santé et fitness des clients",
      "Suivi continu de la progression des clients",
    ],
  },
  {
    category: "Encadrement de Compétitions",
    options: [
      "Organisation et arbitrage de compétitions",
      "Gestion logistique et animation de compétitions locales",
    ],
  },
  {
    category: "Animation d'activités de loisirs",
    options: [
      "Activités récréatives non-compétitives (randonnées, jeux d'équipe)",
      "Séances de relaxation ou méditation en groupe",
    ],
  },
  {
    category: "Séances d'initiation",
    options: [
      "Cours pour débutants dans une discipline spécifique",
      "Sessions de découverte pour attirer de nouveaux membres",
    ],
  },
  {
    category: "Consulting en Amélioration des Performances",
    options: [
      "Analyse et optimisation des programmes d'entraînement",
      "Recommandations sur l'adoption de nouvelles technologies",
    ],
  },
];
```

---

## 16. Admin Parameters

### 16.1 Suspension Duration

```typescript
const SuspensionDurations = {
  FIRST_OFFENSE: 7, // 7 days for first late cancellation
  PERMANENT: -1, // Permanent for 2 offenses in 30 days
};
```

### 16.2 Reminder Schedule

```typescript
const ReminderSchedule = {
  EVALUATION: {
    FIRST: 1, // J+1 after mission end
    SECOND: 2, // J+2
    THIRD: 5, // J+5
  },
  MISSION: {
    WEEK_BEFORE: 7, // 7 days before
    DAYS_BEFORE: 2, // 2 days before
  },
};
```

### 16.3 Cancellation Policy

```typescript
const CancellationPolicy = {
  MIN_NOTICE_HOURS: 24, // Minimum notice required (hours)
  COACH_MIN_NOTICE_DAYS: 15, // For COACH mode (days)
  OFFENSE_WINDOW_DAYS: 30, // Window for counting offenses
};
```

### 16.4 URSSAF Vigilance Threshold

```typescript
const URSSAFVigilanceThreshold = 5000; // €5,000
```

---

## 17. API Response Codes

### 17.1 Success Codes

```typescript
const SuccessCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};
```

### 17.2 Error Codes

```typescript
const ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
```

---

## 18. File Upload Constraints

### 18.1 Allowed File Types

```typescript
const AllowedFileTypes = {
  DOCUMENTS: [".pdf", ".doc", ".docx"],
  IMAGES: [".jpg", ".jpeg", ".png", ".gif"],
  ALL: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif"],
};
```

### 18.2 Max File Sizes

```typescript
const MaxFileSizes = {
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  LOGO: 2 * 1024 * 1024, // 2MB
};
```

---

## 19. Social Login Providers

```typescript
enum SocialLoginProvider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
}
```

---

## 20. Contact Information (Platform)

```typescript
const PlatformContact = {
  email: "contact@renford.fr",
  phone: "06 25 92 27 70",
  domain: "renford.fr",
  additionalDomains: ["renford.co", "renfordblog.fr", "renfordblog.com"],
};
```
