# Renford Backend Modules Structure

This document outlines the modular structure of the Renford API. Each module follows the architecture: `controller`, `route`, `schema`, `service` (implicit), and `types` (shared).

## 1. Auth Module (`/src/modules/auth`)

Handles authentication, registration, and session management.

**Files:**

- `auth.controller.ts`
- `auth.route.ts`
- `auth.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/api/auth/register/etablissement` | Register a new Etablissement account | ❌ |
| POST | `/api/auth/register/renford` | Register a new Renford account | ❌ |
| POST | `/api/auth/login` | Authenticate user and get tokens | ❌ |
| POST | `/api/auth/logout` | Invalidate current session | ✅ |
| POST | `/api/auth/refresh-token` | specific endpoint to refresh access token | ❌ |
| POST | `/api/auth/forgot-password` | Initiate password reset flow (send email) | ❌ |
| POST | `/api/auth/reset-password` | Complete password reset with token | ❌ |
| GET | `/api/auth/me` | Get current authenticated user context | ✅ |

---

## 2. Onboarding Module (`/src/modules/onboarding`)

Manages the multi-step registration process state.

**Files:**

- `onboarding.controller.ts`
- `onboarding.route.ts`
- `onboarding.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/onboarding/status` | Get current onboarding step for user | ✅ |
| POST | `/api/onboarding/step/:stepInfo` | Submit data for a specific onboarding step | ✅ |
| POST | `/api/onboarding/complete` | Finalize onboarding process | ✅ |

---

## 3. Uploads Module (`/src/modules/uploads`)

Handles file uploads to cloud storage (e.g., AWS S3).

**Files:**

- `upload.controller.ts`
- `upload.route.ts`
- `upload.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/api/uploads` | Upload a single file (returns URL/Key) | ✅ |
| POST | `/api/uploads/presigned-url` | Get presigned URL for direct client upload | ✅ |
| DELETE | `/api/uploads/:fileKey` | Delete a specific file | ✅ |

---

## 4. Utilisateur Module (`/src/modules/utilisateur`)

General user management (cross-role).

**Files:**

- `utilisateur.controller.ts`
- `utilisateur.route.ts`
- `utilisateur.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/utilisateurs/:id` | Get public user profile | ✅ |
| PATCH | `/api/utilisateurs/me` | Update general user info (email, phone) | ✅ |
| DELETE | `/api/utilisateurs/me` | Request account deletion | ✅ |
| POST | `/api/utilisateurs/password-change` | Change password (authenticated) | ✅ |

---

## 5. Etablissement Module (`/src/modules/etablissement`)

Specific logic for Sports Facilities (profile, hierarchy, favorites).

**Files:**

- `etablissement.controller.ts`
- `etablissement.route.ts`
- `etablissement.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/etablissements/me` | Get full establishment profile | ✅ (Estab) |
| PATCH | `/api/etablissements/me` | Update establishment profile | ✅ (Estab) |
| POST | `/api/etablissements/secondary` | Add a secondary establishment | ✅ (Main Estab) |
| GET | `/api/etablissements/secondary` | List all secondary establishments | ✅ (Main Estab) |
| POST | `/api/etablissements/favorites` | Add a Renford to favorites | ✅ (Estab) |
| GET | `/api/etablissements/favorites` | List favorite Renfords | ✅ (Estab) |
| DELETE | `/api/etablissements/favorites/:id` | Remove from favorites | ✅ (Estab) |

---

## 6. Renford Module (`/src/modules/renford`)

Specific logic for Freelancers (profile, skills, availability).

**Files:**

- `renford.controller.ts`
- `renford.route.ts`
- `renford.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/renfords/me` | Get full Renford profile | ✅ (Renford) |
| PATCH | `/api/renfords/me` | Update profile (skills, bio, price) | ✅ (Renford) |
| PUT | `/api/renfords/availability` | Update availability calendar | ✅ (Renford) |
| GET | `/api/renfords/availability` | Get availability slots | ✅ |
| POST | `/api/renfords/diplomas` | Add a diploma | ✅ (Renford) |
| DELETE | `/api/renfords/diplomas/:id` | Remove a diploma | ✅ (Renford) |

---

## 7. Mission Module (`/src/modules/mission`)

Core logic for Jobs/Missions (FLEX and COACH).

**Files:**

- `mission.controller.ts`
- `mission.route.ts`
- `mission.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/api/missions` | Create a new mission request | ✅ (Estab) |
| GET | `/api/missions` | List missions (with filters) | ✅ |
| GET | `/api/missions/:id` | Get mission details | ✅ |
| PATCH | `/api/missions/:id` | Update mission details | ✅ (Owner/Admin) |
| POST | `/api/missions/:id/apply` | Apply to a mission | ✅ (Renford) |
| POST | `/api/missions/:id/offer/:renfordId` | Offer mission to specific Renford | ✅ (Estab) |
| PATCH | `/api/missions/:id/status` | Update status (Validate, Cancel, Complete) | ✅ |
| GET | `/api/missions/matching` | Get matched profiles for criteria | ✅ (Estab) |

---

## 8. Document Module (`/src/modules/document`)

Management of generated and uploaded legal documents.

**Files:**

- `document.controller.ts`
- `document.route.ts`
- `document.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/documents/mission/:missionId` | List documents for a mission | ✅ |
| POST | `/api/documents/generate/contract` | Generate contract PDF | ✅ (System/Admin) |
| POST | `/api/documents/sign/:id` | Register signature (webhook or direct) | ✅ |
| GET | `/api/documents/:id/download` | Download specific document | ✅ |

---

## 9. Paiement Module (`/src/modules/paiement`)

Stripe integration and payment tracking.

**Files:**

- `paiement.controller.ts`
- `paiement.route.ts`
- `paiement.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/api/paiements/create-intent` | Create payment intent | ✅ (Estab) |
| POST | `/api/paiements/webhook` | Stripe webhook handler | ❌ |
| GET | `/api/paiements/history` | Get transaction history | ✅ |
| POST | `/api/paiements/connect-account` | Create Stripe Connect account link | ✅ (Renford) |
| GET | `/api/paiements/status/:missionId` | Check payment status for mission | ✅ |

---

## 10. Evaluation Module (`/src/modules/evaluation`)

Rating and review system.

**Files:**

- `evaluation.controller.ts`
- `evaluation.route.ts`
- `evaluation.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| POST | `/api/evaluations` | Submit a review | ✅ |
| GET | `/api/evaluations/user/:userId` | Get public reviews for a user | ✅ |
| GET | `/api/evaluations/stats/:userId` | Get aggregate score for a user | ✅ |

---

## 11. Notification Module (`/src/modules/notification`)

User alerts and messages.

**Files:**

- `notification.controller.ts`
- `notification.route.ts`
- `notification.schema.ts`

**Endpoints:**
| Method | Path | Description | Protected |
|--------|------|-------------|-----------|
| GET | `/api/notifications` | Get user notifications | ✅ |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | ✅ |
| PATCH | `/api/notifications/read-all` | Mark all as read | ✅ |
| POST | `/api/notifications/preferences` | Update notification settings | ✅ |
