# Structure Backend Renford — Analyse & Recommandations

## Architecture actuelle

### Vue d'ensemble

```
src/
├── app.ts                            # Config Express + montage routes sous /api
├── server.ts                         # Démarrage HTTP + scheduler
├── config/                           # Configuration globale
│   ├── consts.ts                     # Constantes (JWT_EXPIRES_IN, etc.)
│   ├── email-templates.ts            # Templates HTML emails
│   ├── enums.ts                      # Labels d'enums pour affichage UI
│   ├── env.ts                        # Variables d'environnement (validation Zod)
│   ├── logger.ts                     # Pino logger
│   ├── mail.ts                       # Wrapper Resend
│   ├── prisma.ts                     # Singleton PrismaClient
│   └── utils.ts                      # generatePassword()
├── middleware/
│   ├── auth.middleware.ts             # JWT auth + injection req.userId/req.utilisateur
│   ├── error.middleware.ts            # notFoundHandler + errorHandler
│   └── validate.resource.ts          # Validation Zod (body/query/params)
├── jobs/
│   ├── scheduler.ts                  # node-cron: matching toutes les 5 min
│   └── missions.matching.ts          # Algorithme matching renford/mission (~750 lignes)
├── modules/
│   ├── account-verification/         # Vérification email (code)
│   ├── auth/                         # Signup, login, password reset
│   ├── dev/                          # Reset onboarding (dev only)
│   ├── missions/                     # CRUD missions + réponse proposition
│   ├── onboarding/                   # Étapes onboarding renford & établissement
│   ├── profil-etablissement/         # Gestion profil établissement
│   ├── profil-renford/               # Gestion profil renford + profil public
│   ├── uploads/                      # Upload fichiers (multer)
│   └── utilisateur/                  # Profil utilisateur connecté
└── routes/
    └── index.ts                      # Agrégateur de toutes les routes
```

**Pattern par module** : `module.controller.ts` + `module.route.ts` + `module.schema.ts`

### Montage des routes

| Préfixe                         | Module               | Exemples                                                         |
| ------------------------------- | -------------------- | ---------------------------------------------------------------- |
| `/api/auth/*`                   | auth                 | `/api/auth/signup`, `/api/auth/login`                            |
| `/api/account-verification/*`   | account-verification | `/api/account-verification/verify-email`                         |
| `/api/utilisateur/*`            | utilisateur          | `/api/utilisateur/me`, `/api/utilisateur/profile`                |
| `/api/onboarding/*`             | onboarding           | `/api/onboarding/status`, `/api/onboarding/renford/profil`       |
| `/api/profil-renford/*`         | profil-renford       | `/api/profil-renford/public/:id`, `/api/profil-renford/`         |
| `/api/profil-etablissement/*`   | profil-etablissement | `/api/profil-etablissement/infos`                                |
| `/api/etablissement/missions/*` | missions             | `/api/etablissement/missions`, `/api/etablissement/missions/:id` |
| `/api/renford/missions/*`       | missions             | `/api/renford/missions/:id/reponse`                              |
| `/api/upload`                   | uploads              | `/api/upload`                                                    |
| `/api/dev/*`                    | dev                  | `/api/dev/reset-onboarding`                                      |

---

## Problèmes identifiés

### 1. Pas de service layer

Toute la logique métier est directement dans les controllers : requêtes Prisma, envoi d'emails, matching. Les controllers font souvent 50-100+ lignes avec des responsabilités mélangées (validation, accès données, logique métier, réponse HTTP).

### 2. `res.locals.validated` jamais exploité

Le middleware `validateResource` parse les données avec Zod et les stocke dans `res.locals.validated`, mais **aucun controller ne lit `res.locals.validated`**. Ils lisent directement `req.body`/`req.params`/`req.query`. Conséquence : les données passent par Zod pour validation, mais les champs supplémentaires non strippés atteignent quand même le controller.

### 3. Contrôle de rôle dupliqué

`authenticateToken(allowedTypes?)` supporte le filtrage par type d'utilisateur, mais aucune route ne l'utilise. Chaque controller vérifie manuellement `req.utilisateur?.typeUtilisateur`, ce qui entraîne de la duplication dans chaque endpoint.

### 4. Matching isolé du module missions

`missions.matching.ts` est dans `jobs/` mais c'est de la logique métier missions. Il est appelé par le scheduler ET par le controller missions, mais il n'est pas co-localisé avec le module.

### 5. Module missions trop large

Un seul module gère à la fois :

- CRUD missions (perspective établissement)
- Réponse aux propositions (perspective renford)
- Listing par onglet (perspective établissement)
- Finalisation paiement

### 6. Constantes legacy

`consts.ts` et `enums.ts` contiennent des références à un ancien projet (Barista, annonces, niveaux scolaires) qui n'ont rien à voir avec le domaine Renford.

### 7. Routes dev non protégées par environnement

Les endpoints `/api/dev/*` ne vérifient pas `NODE_ENV`. N'importe quel utilisateur authentifié peut reset son onboarding en production.

### 8. Données sensibles de carte bancaire stockées en clair

Le controller missions stocke `numeroCarteBancaire`, `cvvCarte`, `dateExpirationCarte` directement en base. C'est une violation PCI-DSS. Ces données ne doivent jamais être stockées côté serveur — utiliser Stripe ou un processeur de paiement.

---

## Structure recommandée

### Objectif

Séparer les responsabilités entre etablissement et renford pour les missions, introduire un service layer minimal, et co-localiser la logique métier.

### Proposition

```
src/
├── app.ts
├── server.ts
├── config/                           # ← Nettoyer consts.ts et enums.ts legacy
│   ├── consts.ts
│   ├── email-templates.ts
│   ├── env.ts
│   ├── logger.ts
│   ├── mail.ts
│   ├── prisma.ts
│   └── utils.ts
├── middleware/
│   ├── auth.middleware.ts             # ← Utiliser allowedTypes dans les routes
│   ├── error.middleware.ts
│   └── validate.resource.ts          # ← Faire lire res.locals.validated aux controllers
├── jobs/
│   └── scheduler.ts                  # Scheduler uniquement, pas de logique métier
├── modules/
│   ├── account-verification/
│   │   ├── account-verification.controller.ts
│   │   ├── account-verification.route.ts
│   │   └── account-verification.schema.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   └── auth.schema.ts
│   ├── dev/
│   │   ├── dev.controller.ts          # ← Ajouter guard NODE_ENV
│   │   ├── dev.route.ts
│   │   └── dev.schema.ts
│   ├── missions/
│   │   ├── missions.controller.ts     # Endpoints établissement : CRUD, listing, paiement
│   │   ├── missions.route.ts
│   │   ├── missions.schema.ts
│   │   ├── missions.service.ts        # ← NOUVEAU : logique métier missions
│   │   └── missions.matching.ts       # ← DÉPLACÉ depuis jobs/ : algorithme de matching
│   ├── missions-renford/              # ← NOUVEAU MODULE
│   │   ├── missions-renford.controller.ts  # Endpoints renford : réponse, listing, détails
│   │   ├── missions-renford.route.ts
│   │   ├── missions-renford.schema.ts
│   │   └── missions-renford.service.ts
│   ├── onboarding/
│   │   ├── onboarding.controller.ts
│   │   ├── onboarding.route.ts
│   │   └── onboarding.schema.ts
│   ├── profil-etablissement/
│   │   ├── profil-etablissement.controller.ts
│   │   ├── profil-etablissement.route.ts
│   │   └── profil-etablissement.schema.ts
│   ├── profil-renford/
│   │   ├── profil-renford.controller.ts
│   │   ├── profil-renford.route.ts
│   │   └── profil-renford.schema.ts
│   ├── uploads/
│   │   ├── uploads.controller.ts      # ← Renommer au pluriel
│   │   ├── uploads.route.ts
│   │   └── uploads.schema.ts
│   └── utilisateur/
│       ├── utilisateur.controller.ts
│       ├── utilisateur.route.ts
│       └── utilisateur.schema.ts
└── routes/
    └── index.ts
```

### Changements clés

#### 1. Nouveau module `missions-renford/`

Séparer les endpoints côté renford du module missions :

```
// missions-renford.route.ts
router.post('/:missionId/reponse', ...)     // Répondre à une proposition
router.get('/',  ...)                        // Lister mes missions proposées
router.get('/:missionId', ...)              // Détails d'une mission proposée
```

Monté sous `/api/renford/missions/` dans `routes/index.ts`.

Le module `missions/` garde uniquement les endpoints côté établissement, montés sous `/api/etablissement/missions/`.

#### 2. Déplacer `missions.matching.ts` dans le module missions

C'est de la logique métier missions, pas un job. Le scheduler dans `jobs/scheduler.ts` importera depuis le module :

```ts
// jobs/scheduler.ts
import { syncMissionMatchesForOpenMissions } from "../modules/missions/missions.matching";
```

#### 3. Introduire un service layer minimal

Ajouter un fichier `*.service.ts` par module quand le controller dépasse ~40 lignes de logique métier. Le service encapsule les opérations Prisma et la logique métier. Le controller ne fait que valider, appeler le service, et formater la réponse HTTP.

```ts
// missions.controller.ts
export const createMission = async (req, res, next) => {
  const data = res.locals.validated.body;
  const result = await missionsService.create(data, req.userId);
  return res.status(201).json(result);
};
```

#### 4. Exploiter `res.locals.validated`

Modifier les controllers pour lire `res.locals.validated.body` au lieu de `req.body`. Cela garantit que seules les données validées et strippées par Zod sont utilisées.

#### 5. Utiliser `allowedTypes` dans les routes

```ts
// missions.route.ts — avant
router.use(authenticateToken());
// puis dans le controller : if (req.utilisateur?.typeUtilisateur !== 'etablissement') ...

// missions.route.ts — après
router.use(authenticateToken(["etablissement"]));
// plus besoin de vérifier dans chaque controller
```

#### 6. Protéger les routes dev

```ts
// dev.route.ts
if (process.env.NODE_ENV === "production") {
  router.all("*", (_req, res) =>
    res.status(404).json({ message: "Not found" }),
  );
} else {
  router.post("/reset-onboarding", authenticateToken(), resetOnboarding);
  // ...
}
```

### Montage des routes après restructuration

```ts
// routes/index.ts
router.use("/auth", authRouter);
router.use("/account-verification", accountVerificationRouter);
router.use("/utilisateur", utilisateurRouter);
router.use("/onboarding", onboardingRouter);
router.use("/profil-renford", profilRenfordRouter);
router.use("/profil-etablissement", profilEtablissementRouter);
router.use("/etablissement/missions", missionsRouter); // ← Missions côté établissement
router.use("/renford/missions", missionsRenfordRouter); // ← Missions côté renford
router.use("/upload", uploadsRouter);
router.use("/dev", devRouter);
```

---

## Priorités de migration

| Priorité | Action                                                      | Impact                         |
| -------- | ----------------------------------------------------------- | ------------------------------ |
| **P0**   | Supprimer le stockage de données de carte bancaire en clair | Sécurité critique              |
| **P0**   | Protéger les routes dev par `NODE_ENV`                      | Sécurité                       |
| **P1**   | Déplacer `missions.matching.ts` dans `modules/missions/`    | Organisation code              |
| **P1**   | Créer le module `missions-renford/`                         | Séparation des responsabilités |
| **P2**   | Utiliser `res.locals.validated` dans les controllers        | Sécurité validation            |
| **P2**   | Utiliser `allowedTypes` dans `authenticateToken()`          | Réduction duplication          |
| **P3**   | Introduire les fichiers `*.service.ts` progressivement      | Maintenabilité                 |
| **P3**   | Nettoyer constantes et enums legacy                         | Hygiène code                   |
