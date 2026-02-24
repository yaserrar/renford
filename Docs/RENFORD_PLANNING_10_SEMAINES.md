# RENFORD - Planning de Développement (10 Semaines)

> **Contexte** : Développement Backend + Frontend en parallèle, module par module
> **Stack** : Next.js + NestJS + TypeScript + PostgreSQL + Prisma + Stripe
> **Période** : Février - Avril 2026

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SEMAINE 1 ✅ TERMINÉE                                                      │
│  └── Cadrage projet, Configuration, Architecture BDD                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 2 🔄 EN COURS                                                      │
│  └── Authentification & Onboarding                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 3-4                                                                │
│  └── Profils Utilisateurs (Renford + Établissement)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 5-6                                                                │
│  └── Système de Missions (FLEX + COACH)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 7                                                                  │
│  └── Paiements & Stripe Connect                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 8                                                                  │
│  └── Documents & Signature Électronique                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 9                                                                  │
│  └── Notifications, Emails, SMS & Calendrier                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 10                                                                 │
│  └── Admin Panel, Dashboard, Tests & Déploiement                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SEMAINE 1 ✅ TERMINÉE

### Cadrage du Projet & Fondations

| Tâche                                        | Status |
| -------------------------------------------- | ------ |
| Cadrage du projet et définition du périmètre | ✅     |
| Configuration monorepo (Next.js + NestJS)    | ✅     |
| Setup Docker (PostgreSQL + Redis)            | ✅     |
| Architecture de la base de données (Prisma)  | ✅     |
| Configuration ESLint, Prettier, Husky        | ✅     |
| Structure des variables d'environnement      | ✅     |
| Package types partagés FE/BE                 | ✅     |

**Livrables** :

- [x] Monorepo fonctionnel
- [x] Environnement Docker local
- [x] Schéma Prisma complet (Users, Établissements, Renfords, Missions, Documents, Paiements)
- [x] Migrations initiales

---

## SEMAINE 2 🔄 EN COURS

### Module : Authentification & Onboarding

#### Backend (NestJS)

| Tâche                                        | Priorité   | Temps Est. |
| -------------------------------------------- | ---------- | ---------- |
| Configuration Passport.js avec stratégie JWT | 🔴 Haute   | 2h         |
| Guards d'authentification (JWT, Roles)       | 🔴 Haute   | 2h         |
| Endpoint inscription Établissement           | 🔴 Haute   | 2h         |
| Endpoint inscription Renford                 | 🔴 Haute   | 2h         |
| Endpoint connexion                           | 🔴 Haute   | 1h         |
| Flow réinitialisation mot de passe           | 🔴 Haute   | 2h         |
| Vérification email                           | 🔴 Haute   | 2h         |
| Mécanisme refresh token                      | 🔴 Haute   | 2h         |
| OAuth Google                                 | 🟡 Moyenne | 2h         |
| OAuth Facebook                               | 🟢 Basse   | 2h         |

#### Frontend (Next.js)

| Tâche                                          | Priorité   | Temps Est. |
| ---------------------------------------------- | ---------- | ---------- |
| Store d'auth (Zustand)                         | 🔴 Haute   | 2h         |
| Page de connexion                              | 🔴 Haute   | 1h         |
| Page d'inscription commune                     | 🔴 Haute   | 2h         |
| Page inscription spécifique Établissement      | 🔴 Haute   | 1h         |
| Page inscription spécifique Renford            | 🔴 Haute   | 1h         |
| Page mot de passe oublié                       | 🔴 Haute   | 1h         |
| Page réinitialiser mot de passe                | 🔴 Haute   | 1h         |
| HOC routes protégées                           | 🔴 Haute   | 1h         |
| Boutons connexion sociale                      | 🟡 Moyenne | 1h         |
| Validation formulaires (Zod + React Hook Form) | 🔴 Haute   | 2h         |

**Livrables Semaine 2** :

- [ ] Flow complet d'auth (inscription, connexion, déconnexion, reset)
- [ ] Gestion des tokens JWT
- [ ] Routes protégées par rôle
- [ ] Connexion sociale (Google)

---

## SEMAINE 3-4

### Module : Profils Utilisateurs

#### Semaine 3 : Profil Renford (Freelancer)

##### Backend

| Tâche                                        | Priorité   | Temps Est. |
| -------------------------------------------- | ---------- | ---------- |
| CRUD profil Renford                          | 🔴 Haute   | 2h         |
| Calcul pourcentage complétion profil         | 🟡 Moyenne | 1h         |
| Endpoints gestion disponibilités             | 🔴 Haute   | 2h         |
| Endpoints gestion tarification               | 🔴 Haute   | 1h         |
| Endpoints upload diplômes/certifications     | 🔴 Haute   | 2h         |
| Endpoints upload documents (carte pro, IBAN) | 🔴 Haute   | 2h         |
| Gestion des spécialisations                  | 🔴 Haute   | 1h         |

##### Frontend

| Tâche                                        | Priorité | Temps Est. |
| -------------------------------------------- | -------- | ---------- |
| Wizard profil multi-étapes                   | 🔴 Haute | 4h         |
| Étape 1 : Infos générales                    | 🔴 Haute | 2h         |
| Étape 2 : Qualifications & Diplômes          | 🔴 Haute | 2h         |
| Étape 3 : Tarification (+ jauge flexibilité) | 🔴 Haute | 2h         |
| Étape 4 : Upload documents                   | 🔴 Haute | 2h         |
| Étape 5 : Calendrier disponibilités          | 🔴 Haute | 3h         |
| Page visualisation profil                    | 🔴 Haute | 2h         |
| Page édition profil                          | 🔴 Haute | 2h         |
| Sélecteur compétences/spécialisations        | 🔴 Haute | 2h         |

#### Semaine 4 : Profil Établissement + Upload Fichiers

##### Backend (Établissement)

| Tâche                                | Priorité   | Temps Est. |
| ------------------------------------ | ---------- | ---------- |
| CRUD profil Établissement            | 🔴 Haute   | 2h         |
| Logique Principal/Secondaire         | 🔴 Haute   | 3h         |
| Gestion multi-établissements         | 🔴 Haute   | 2h         |
| Gestion Renfords favoris             | 🔴 Haute   | 2h         |
| Gestion informations bancaires       | 🔴 Haute   | 2h         |
| Recherche établissement pour liaison | 🟡 Moyenne | 2h         |

##### Frontend (Établissement)

| Tâche                                       | Priorité | Temps Est. |
| ------------------------------------------- | -------- | ---------- |
| Wizard profil Établissement                 | 🔴 Haute | 3h         |
| UI sélection Principal/Secondaire           | 🔴 Haute | 2h         |
| Formulaire ajout établissements secondaires | 🔴 Haute | 2h         |
| Page gestion favoris                        | 🔴 Haute | 2h         |
| Liste établissements (pour groupes)         | 🔴 Haute | 2h         |
| Formulaire informations bancaires           | 🔴 Haute | 2h         |

##### Système Upload Fichiers

| Tâche                                       | Priorité   | Temps Est. |
| ------------------------------------------- | ---------- | ---------- |
| Intégration S3/Minio                        | 🔴 Haute   | 2h         |
| Service upload fichiers                     | 🔴 Haute   | 2h         |
| Validation fichiers (type, taille)          | 🔴 Haute   | 1h         |
| Génération URLs présignées                  | 🔴 Haute   | 2h         |
| Composant upload réutilisable (drag & drop) | 🔴 Haute   | 3h         |
| Composant prévisualisation fichier          | 🟡 Moyenne | 2h         |

**Livrables Semaines 3-4** :

- [ ] Gestion complète profil Renford
- [ ] Gestion complète profil Établissement
- [ ] Hiérarchie multi-établissements
- [ ] Système de favoris
- [ ] Calendrier disponibilités
- [ ] Upload fichiers cloud

---

## SEMAINE 5-6

### Module : Système de Missions

#### Semaine 5 : CRUD Missions + Création

##### Backend

| Tâche                       | Priorité | Temps Est. |
| --------------------------- | -------- | ---------- |
| Création mission FLEX       | 🔴 Haute | 3h         |
| Création mission COACH      | 🔴 Haute | 3h         |
| Liste missions avec filtres | 🔴 Haute | 2h         |
| Détail mission              | 🔴 Haute | 1h         |
| Mise à jour mission         | 🔴 Haute | 2h         |
| Annulation mission          | 🔴 Haute | 2h         |
| Workflow statuts mission    | 🔴 Haute | 3h         |
| Gestion créneaux horaires   | 🔴 Haute | 2h         |
| Service calcul coût         | 🔴 Haute | 2h         |

##### Frontend

| Tâche                                      | Priorité | Temps Est. |
| ------------------------------------------ | -------- | ---------- |
| Wizard création mission FLEX               | 🔴 Haute | 4h         |
| Wizard création mission COACH              | 🔴 Haute | 4h         |
| Composant sélecteur horaires               | 🔴 Haute | 3h         |
| Formulaire options tarification            | 🔴 Haute | 2h         |
| Sélecteur équipement (dynamique par poste) | 🔴 Haute | 2h         |
| Page récapitulatif/validation mission      | 🔴 Haute | 2h         |
| Page liste missions (Établissement)        | 🔴 Haute | 2h         |
| Page liste missions (Renford)              | 🔴 Haute | 2h         |
| Page détail mission                        | 🔴 Haute | 3h         |

#### Semaine 6 : Algorithme Matching + Workflow

##### Backend (Matching)

| Tâche                                     | Priorité   | Temps Est. |
| ----------------------------------------- | ---------- | ---------- |
| Service de matching                       | 🔴 Haute   | 4h         |
| Priorité favoris                          | 🔴 Haute   | 1h         |
| Matching localisation (départements)      | 🔴 Haute   | 2h         |
| Vérification chevauchement disponibilités | 🔴 Haute   | 2h         |
| Logique matching tarifs                   | 🔴 Haute   | 2h         |
| Matching compétences/poste                | 🔴 Haute   | 1h         |
| Matching niveau expérience                | 🟡 Moyenne | 1h         |
| Système scoring & classement              | 🔴 Haute   | 2h         |
| Génération shortlist (COACH)              | 🔴 Haute   | 2h         |

##### Backend (Workflow)

| Tâche                                    | Priorité | Temps Est. |
| ---------------------------------------- | -------- | ---------- |
| Endpoint accepter mission (Renford)      | 🔴 Haute | 2h         |
| Endpoint refuser mission (Renford)       | 🔴 Haute | 1h         |
| Endpoint valider mission (Établissement) | 🔴 Haute | 2h         |
| Endpoint demande modification            | 🔴 Haute | 2h         |
| Endpoint annulation avec règles          | 🔴 Haute | 3h         |
| Endpoint signalement absence             | 🔴 Haute | 2h         |
| Flow complétion mission                  | 🔴 Haute | 2h         |

##### Frontend (Workflow)

| Tâche                                    | Priorité   | Temps Est. |
| ---------------------------------------- | ---------- | ---------- |
| Popup notification mission               | 🔴 Haute   | 2h         |
| UI Accepter/Refuser mission              | 🔴 Haute   | 2h         |
| Formulaire demande modification          | 🔴 Haute   | 2h         |
| Formulaire annulation avec avertissement | 🔴 Haute   | 2h         |
| Formulaire signalement absence           | 🔴 Haute   | 2h         |
| Formulaire validation mission            | 🔴 Haute   | 2h         |
| Vue shortlist (COACH)                    | 🔴 Haute   | 3h         |
| Badges/Timeline statuts mission          | 🟡 Moyenne | 2h         |

**Livrables Semaines 5-6** :

- [ ] Création mission complète (FLEX + COACH)
- [ ] Algorithme de matching fonctionnel
- [ ] Gestion shortlist pour COACH
- [ ] Cycle de vie complet de la mission
- [ ] Tous les flux de modification/annulation

---

## SEMAINE 7

### Module : Paiements & Stripe Connect

#### Backend

| Tâche                                 | Priorité   | Temps Est. |
| ------------------------------------- | ---------- | ---------- |
| Configuration Stripe Connect          | 🔴 Haute   | 3h         |
| Création compte Connect pour Renfords | 🔴 Haute   | 3h         |
| Création PaymentIntent                | 🔴 Haute   | 2h         |
| Retenue paiement (COACH)              | 🔴 Haute   | 2h         |
| Capture paiement                      | 🔴 Haute   | 2h         |
| Libération paiement vers Renford      | 🔴 Haute   | 2h         |
| Calcul & déduction commission         | 🔴 Haute   | 2h         |
| Gestion remboursements                | 🔴 Haute   | 2h         |
| Webhooks Stripe                       | 🔴 Haute   | 3h         |
| Endpoints historique paiements        | 🟡 Moyenne | 2h         |

#### Frontend

| Tâche                         | Priorité   | Temps Est. |
| ----------------------------- | ---------- | ---------- |
| Intégration Stripe Elements   | 🔴 Haute   | 3h         |
| Composant formulaire paiement | 🔴 Haute   | 2h         |
| Flow onboarding Connect       | 🔴 Haute   | 3h         |
| Affichage statut paiement     | 🔴 Haute   | 2h         |
| Page historique paiements     | 🟡 Moyenne | 2h         |
| Dashboard revenus (Renford)   | 🔴 Haute   | 3h         |

**Livrables Semaine 7** :

- [ ] Intégration Stripe Connect complète
- [ ] Flow paiement pour les deux modes
- [ ] Gestion des commissions
- [ ] Suivi des paiements

---

## SEMAINE 8

### Module : Documents & Signature Électronique

#### Génération Documents (Backend)

| Tâche                                         | Priorité   | Temps Est. |
| --------------------------------------------- | ---------- | ---------- |
| Setup librairie PDF (PDFKit/Puppeteer)        | 🔴 Haute   | 2h         |
| Template & générateur Devis                   | 🔴 Haute   | 3h         |
| Template Contrat de prestation                | 🔴 Haute   | 3h         |
| Template Facture (Facture-X, conformité 2026) | 🔴 Haute   | 4h         |
| Template Attestation de mission               | 🔴 Haute   | 2h         |
| Template Bordereau de paiement                | 🟡 Moyenne | 2h         |
| Stockage & liaison documents aux missions     | 🔴 Haute   | 2h         |
| Endpoints récupération documents              | 🔴 Haute   | 1h         |

#### Signature Électronique (Backend)

| Tâche                                      | Priorité | Temps Est. |
| ------------------------------------------ | -------- | ---------- |
| Configuration API Yousign/PandaDoc         | 🔴 Haute | 2h         |
| Service création demande signature         | 🔴 Haute | 3h         |
| Gestion webhooks signature                 | 🔴 Haute | 2h         |
| Mise à jour statut mission après signature | 🔴 Haute | 2h         |
| Stockage documents signés                  | 🔴 Haute | 1h         |

#### Frontend

| Tâche                                  | Priorité | Temps Est. |
| -------------------------------------- | -------- | ---------- |
| Composant visualiseur document         | 🔴 Haute | 2h         |
| Boutons téléchargement documents       | 🔴 Haute | 1h         |
| Section documents dans détail mission  | 🔴 Haute | 2h         |
| UI demande signature                   | 🔴 Haute | 2h         |
| Suivi statut signature                 | 🔴 Haute | 2h         |
| Redirection vers fournisseur signature | 🔴 Haute | 1h         |

**Livrables Semaine 8** :

- [ ] Tous les templates documents
- [ ] Génération automatique sur déclencheurs
- [ ] Flow signature électronique intégré
- [ ] Visualisation/téléchargement documents

---

## SEMAINE 9

### Module : Notifications, Emails, SMS & Calendrier

#### Système Notifications (Backend)

| Tâche                                  | Priorité   | Temps Est. |
| -------------------------------------- | ---------- | ---------- |
| Service notifications                  | 🔴 Haute   | 2h         |
| Configuration SendGrid/Resend (emails) | 🔴 Haute   | 2h         |
| Configuration Twilio (SMS)             | 🔴 Haute   | 2h         |
| Queue notifications (Bull/Redis)       | 🔴 Haute   | 2h         |
| Gestion préférences notifications      | 🟡 Moyenne | 2h         |
| Notifications in-app (WebSocket)       | 🟡 Moyenne | 3h         |

#### Templates Emails/SMS

| Tâche                            | Priorité | Temps Est. |
| -------------------------------- | -------- | ---------- |
| Template email nouvelle mission  | 🔴 Haute | 1h         |
| Template email mission acceptée  | 🔴 Haute | 1h         |
| Template email contrat à signer  | 🔴 Haute | 1h         |
| Template email paiement reçu     | 🔴 Haute | 1h         |
| Template email rappel mission    | 🔴 Haute | 1h         |
| Templates SMS (alertes urgentes) | 🔴 Haute | 2h         |

#### Intégration Calendrier

| Tâche                             | Priorité   | Temps Est. |
| --------------------------------- | ---------- | ---------- |
| Configuration API Google Calendar | 🔴 Haute   | 2h         |
| Création événement mission        | 🔴 Haute   | 2h         |
| Mise à jour/suppression événement | 🔴 Haute   | 1h         |
| Synchronisation bidirectionnelle  | 🟡 Moyenne | 3h         |

#### Frontend

| Tâche                             | Priorité   | Temps Est. |
| --------------------------------- | ---------- | ---------- |
| Centre notifications in-app       | 🔴 Haute   | 2h         |
| Indicateur notifications non lues | 🔴 Haute   | 1h         |
| Page paramètres notifications     | 🟡 Moyenne | 2h         |
| Bouton connexion Google Calendar  | 🔴 Haute   | 1h         |
| Vue calendrier missions           | 🔴 Haute   | 3h         |

**Livrables Semaine 9** :

- [ ] Système notifications multi-canal
- [ ] Templates emails transactionnels
- [ ] Alertes SMS
- [ ] Intégration Google Calendar

---

## SEMAINE 10

### Module : Admin Panel, Dashboard & Finalisation

#### Admin Panel (Backend)

| Tâche                             | Priorité   | Temps Est. |
| --------------------------------- | ---------- | ---------- |
| CRUD utilisateurs (vue admin)     | 🔴 Haute   | 2h         |
| Endpoint vérification diplômes    | 🔴 Haute   | 1h         |
| Endpoint suspension/bannissement  | 🔴 Haute   | 1h         |
| CRUD missions (vue admin)         | 🔴 Haute   | 2h         |
| Assignation manuelle Renford      | 🔴 Haute   | 2h         |
| Endpoints statistiques plateforme | 🔴 Haute   | 3h         |
| Gestion tickets support           | 🟡 Moyenne | 2h         |

#### Admin Panel (Frontend)

| Tâche                           | Priorité | Temps Est. |
| ------------------------------- | -------- | ---------- |
| Dashboard admin avec KPIs       | 🔴 Haute | 3h         |
| Page liste utilisateurs         | 🔴 Haute | 2h         |
| Interface vérification profils  | 🔴 Haute | 2h         |
| Page liste toutes missions      | 🔴 Haute | 2h         |
| Formulaire assignation manuelle | 🔴 Haute | 2h         |
| Page statistiques               | 🔴 Haute | 3h         |

#### Dashboards Utilisateurs

| Tâche                                              | Priorité | Temps Est. |
| -------------------------------------------------- | -------- | ---------- |
| Dashboard Établissement (stats, missions, alertes) | 🔴 Haute | 3h         |
| Dashboard Renford (revenus, missions, calendrier)  | 🔴 Haute | 3h         |
| Graphiques statistiques (charts)                   | 🔴 Haute | 2h         |

#### Évaluations

| Tâche                             | Priorité | Temps Est. |
| --------------------------------- | -------- | ---------- |
| Endpoint évaluation Renford       | 🔴 Haute | 2h         |
| Endpoint évaluation Établissement | 🔴 Haute | 2h         |
| Composant notation étoiles        | 🔴 Haute | 1h         |
| Affichage évaluations sur profils | 🔴 Haute | 2h         |

#### Tests & Déploiement

| Tâche                           | Priorité   | Temps Est. |
| ------------------------------- | ---------- | ---------- |
| Tests unitaires critiques       | 🔴 Haute   | 4h         |
| Tests E2E parcours principaux   | 🔴 Haute   | 4h         |
| Configuration production Docker | 🔴 Haute   | 2h         |
| Configuration CI/CD             | 🔴 Haute   | 2h         |
| Script seed données de test     | 🟡 Moyenne | 2h         |
| Documentation API               | 🟡 Moyenne | 2h         |
| Fix bugs & polish               | 🔴 Haute   | 4h         |

**Livrables Semaine 10** :

- [ ] Panel admin complet
- [ ] Dashboards utilisateurs
- [ ] Système d'évaluations
- [ ] Tests automatisés
- [ ] Environnement de production prêt

---

## Récapitulatif des Modules par Semaine

| Semaine | Module Principal               | Statut      |
| ------- | ------------------------------ | ----------- |
| 1       | Cadrage & Configuration        | ✅ Terminé  |
| 2       | Authentification & Onboarding  | 🔄 En cours |
| 3       | Profil Renford                 | ⏳ À faire  |
| 4       | Profil Établissement + Upload  | ⏳ À faire  |
| 5       | Missions CRUD & Création       | ⏳ À faire  |
| 6       | Matching & Workflow Missions   | ⏳ À faire  |
| 7       | Paiements Stripe               | ⏳ À faire  |
| 8       | Documents & Signature          | ⏳ À faire  |
| 9       | Notifications & Calendrier     | ⏳ À faire  |
| 10      | Admin, Dashboard & Déploiement | ⏳ À faire  |

---

## Stack Technique Rappel

| Couche     | Technologie             |
| ---------- | ----------------------- |
| Frontend   | Next.js + TypeScript    |
| Backend    | NestJS + TypeScript     |
| BDD        | PostgreSQL + Prisma ORM |
| Cache      | Redis                   |
| Auth       | JWT + Passport.js       |
| Paiements  | Stripe Connect          |
| Signature  | Yousign / PandaDoc      |
| Stockage   | Minio / S3              |
| Emails     | SendGrid / Resend       |
| SMS        | Twilio                  |
| Calendrier | Google Calendar API     |
| Infra      | Docker                  |

---

## Notes Importantes

1. **Développement parallèle** : Backend et Frontend sont développés simultanément pour chaque module
2. **Priorités** : 🔴 Haute = Bloquant, 🟡 Moyenne = Important, 🟢 Basse = Nice-to-have
3. **Estimation conservative** : Les temps incluent tests unitaires basiques
4. **Flexibilité** : Le planning peut s'ajuster selon les imprévus
5. **Livrables intermédiaires** : Chaque fin de semaine doit produire un module fonctionnel testable
