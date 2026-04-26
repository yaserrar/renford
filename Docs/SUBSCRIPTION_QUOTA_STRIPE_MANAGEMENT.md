# Renford — Subscription, Plan, Quota & Stripe Management

## Overview

This document describes the complete subscription system for établissements: how plans are defined, how admin can manage them, quota enforcement with Stripe integration, and handling of overages or additional missions.

---

## 1. Subscription Plans & Admin Management

### 1.1 Available Plans

Plans are defined in the database (`PlanAbonnement` enum) with both static and dynamic pricing:

| Plan             | DB Key         | Quota             | Price               | Mode                         | Admin Control    |
| ---------------- | -------------- | ----------------- | ------------------- | ---------------------------- | ---------------- |
| **Échauffement** | `echauffement` | 10 missions/month | 99€/month           | Self-serve (Stripe Checkout) | Read-only        |
| **Performance**  | `performance`  | 25 missions/month | 199€/month          | Self-serve (Stripe Checkout) | Read-only        |
| **Compétition**  | `competition`  | Unlimited (0)     | Custom (per-client) | Manual (admin + negotiation) | **Full control** |

### 1.2 Static vs. Dynamic Plans

**Static Plans (Échauffement / Performance):**

- Price is fixed and stored in Stripe Dashboard as a Product/Price object
- Price IDs are stored in environment variables (`STRIPE_PRICE_ECHAUFFEMENT`, `STRIPE_PRICE_PERFORMANCE`)
- No admin intervention needed — établissements self-subscribe via Stripe Checkout

**Dynamic Plans (Compétition):**

- Price is negotiated between the sales team and the client
- Admin creates the subscription via a backoffice endpoint: `POST /api/admin/abonnements/competition`
- Backend passes `price_data` inline to Stripe, which generates a unique Price ID for that client
- Stripe automatically handles billing cycles and webhooks

### 1.3 Admin Management Capabilities

Admins can:

- **Create custom subscriptions** for Compétition clients with any price (e.g., 600€/month)
- **Cancel or pause subscriptions** for any plan
- **Resume paused subscriptions**
- **Modify quotas or prices** by updating Stripe and syncing the database
- **View all subscriptions and quota usage** via the backoffice
- **Audit subscription events** via `AbonnementEvenement` trail

---

## 2. Stripe Integration & Entity Linking

### 2.1 Linking Model

```
ProfilEtablissement
    └── Abonnement (1 active at a time)
            ├── stripeSubscriptionId (links to Stripe subscription)
            ├── stripePriceId (links to Stripe price)
            ├── stripeCurrentPeriodStart / stripeCurrentPeriodEnd
            └── AbonnementEvenement[] (audit trail)
```

### 2.2 Stripe Subscription Flow

**For self-serve (Échauffement/Performance):**

```
1. Établissement clicks "Subscribe" on /abonnement page
2. Frontend calls POST /api/abonnements/checkout { plan: "performance" }
3. Backend creates Stripe Checkout Session with the Price ID from env
4. User redirected to Stripe Checkout → pays 199€/month
5. Stripe webhook: checkout.session.completed
6. Backend creates Abonnement record:
   - statut: "actif"
   - stripeSubscriptionId: "sub_xxx"
   - stripePriceId: "price_yyy" (from the fixed Stripe Price)
   - stripeCurrentPeriodStart/End: synced from Stripe subscription
7. Frontend redirected to /abonnement with confirmation
```

**For custom (Compétition):**

```
1. Sales team negotiates price (e.g., 600€/month) with client
2. Admin calls POST /api/admin/abonnements/competition
   { profilEtablissementId, prixMensuelHT: 600 }
3. Backend creates Stripe Customer if not exists
4. Backend calls stripe.subscriptions.create() with inline price_data:
   {
     customer: stripeCustomerId,
     items: [{
       price_data: {
         currency: 'eur',
         product: STRIPE_PRODUCT_COMPETITION_ID,
         unit_amount: 60000, // 600€ in cents
         recurring: { interval: 'month' }
       }
     }]
   }
5. Stripe generates a unique Price ID for this client
6. Webhook: customer.subscription.updated
7. Backend creates Abonnement record with the new stripePriceId
8. Each client Compétition has its own Price ID — this is intentional
```

### 2.3 Environment Variables

**Backend (renford-api/.env):**

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRODUCT_ECHAUFFEMENT=prod_xxx
STRIPE_PRICE_ECHAUFFEMENT=price_yyy
STRIPE_PRODUCT_PERFORMANCE=prod_aaa
STRIPE_PRICE_PERFORMANCE=price_bbb
STRIPE_PRODUCT_COMPETITION=prod_ccc
```

**Frontend (renford-dashboard/.env):**

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 3. Quota Management

### 3.1 Billing Period Definition

> **The quota period is the subscription billing cycle, NOT the calendar month.**

- A client subscribing on the **15th** has a billing period of **15th → 14th** (next month)
- Stripe returns `current_period_start` and `current_period_end` on every subscription object
- These are stored in the DB as `stripeCurrentPeriodStart` and `stripeCurrentPeriodEnd`
- **Fallback:** If period dates aren't available, use the calendar month (1st → last day)

### 3.2 Quota Counting & Verification

**Function: `getMissionsCreatedInCurrentPeriod(profilEtablissementId)`**

Counts missions created by the établissement (all sites) during the current billing period:

```ts
{
  count: number,           // How many missions created this period
  periodStart: Date,       // Period start (from Stripe or calendar)
  periodEnd: Date          // Period end (from Stripe or calendar)
}
```

**Function: `checkQuotaExceeded(profilEtablissementId)`**

Checks if the quota is exhausted. Returns:

```ts
{
  hasSubscription: boolean,    // true = has active subscription, false = no sub (à la carte mode)
  exceeded: boolean,           // true = quota reached/exceeded
  remaining: number,           // missions left (0 if exceeded, Infinity if unlimited)
  quotaMissions: number,       // total quota for the plan (0 = unlimited)
  missionsCreated: number,     // missions created in current period
  plan: string | null          // "echauffement" | "performance" | "competition" | null
}
```

### 3.3 Quota Enforcement

**At mission creation (POST /api/missions):**

```
1. Extract profilEtablissementId from token
2. Call checkQuotaExceeded(profilEtablissementId)
3. If exceeded === true:
   → Return HTTP 402 Payment Required
   → Error: { error: "QUOTA_EXCEEDED", remaining: 0, plan: "echauffement", quotaMissions: 10 }
   → Mission creation blocked
4. If exceeded === false:
   → Proceed with mission creation
   → Mission is counted in the next quota check
```

**Frontend behavior when quota reached:**

- Quota bar on `/abonnement` page turns red
- "Create mission" button is disabled with tooltip: "Quota atteint — upgradez votre plan"
- User is redirected to upgrade plan

### 3.4 Quota Reset (Automatic)

> **No manual reset needed.**

When Stripe renews the subscription:

1. `invoice.paid` webhook received
2. Backend updates `stripeCurrentPeriodStart` and `stripeCurrentPeriodEnd`
3. Next time `getMissionsCreatedInCurrentPeriod` is called, it uses the new period boundaries
4. Mission count resets automatically (because dates changed, not because of a manual reset)

---

## 4. Overage & Additional Missions

### 4.1 No Automatic Overage Billing

**For subscribed établissements:**

- If quota is reached, mission creation is **blocked** (HTTP 402)
- No automatic pay-per-mission overage charge
- Must upgrade to a higher plan or switch to Compétition (unlimited)

### 4.2 Without Subscription (à la carte / FLEX/COACH)

Établissements without an active subscription can still create missions at any time:

| Mode  | Fee     | Per               |
| ----- | ------- | ----------------- |
| FLEX  | 15%     | Mission HT amount |
| COACH | 375€ HT | Per introduction  |

In this mode, `checkQuotaExceeded` returns `hasSubscription: false`, `exceeded: false`, `remaining: Infinity` — **no blocking**.

### 4.3 Upgrading & Downgrading

- **Upgrade (e.g., Échauffement → Performance):** Établissement clicks another plan on `/abonnement`, new Stripe subscription created, old one cancelled. Quota resets.
- **Downgrade (e.g., Performance → Échauffement):** Same flow; if current usage > new quota, warning shown but downgrade still allowed. Mission creation will be blocked after change.

---

## 5. Database Model

### 5.1 Abonnement Table

```sql
CREATE TABLE abonnements (
  id UUID PRIMARY KEY,
  profilEtablissementId UUID NOT NULL REFERENCES profils_etablissements(id),

  -- Plan metadata
  plan ENUM ('echauffement', 'performance', 'competition'),
  statut ENUM ('en_attente', 'actif', 'annule', 'expire', 'en_pause'),
  quotaMissions INT,                    -- 0 = unlimited
  missionsUtilisees INT DEFAULT 0,      -- dénormalisé (optionnel, pour affichage rapide)

  -- Pricing
  prixMensuelHT DECIMAL(10,2),

  -- Period
  dateDebut DATETIME,
  dateFin DATETIME,
  dateProchainRenouvellement DATETIME,

  -- Stripe
  stripeSubscriptionId VARCHAR UNIQUE,
  stripePriceId VARCHAR,
  stripeCurrentPeriodStart DATETIME,
  stripeCurrentPeriodEnd DATETIME,

  -- Metadata
  dateCreation DATETIME DEFAULT NOW(),
  dateMiseAJour DATETIME DEFAULT NOW() ON UPDATE NOW(),

  KEY (profilEtablissementId),
  KEY (statut),
  KEY (plan)
);
```

### 5.2 AbonnementEvenement (Audit Trail)

Each subscription state change creates an event record:

```sql
CREATE TABLE abonnement_evenements (
  id UUID PRIMARY KEY,
  abonnementId UUID NOT NULL REFERENCES abonnements(id),

  type ENUM (
    'creation', 'activation', 'renouvellement', 'annulation',
    'expiration', 'mise_en_pause', 'reprise', 'changement_plan',
    'paiement_reussi', 'paiement_echoue', 'remboursement'
  ),

  ancienStatut ENUM (...),
  nouveauStatut ENUM (...),
  montantCentimes INT,              -- For payment events

  stripeEventId VARCHAR,            -- Stripe event ID
  stripeEventType VARCHAR,          -- e.g., "invoice.paid"
  stripeSubscriptionId VARCHAR,

  details JSON,                     -- Extra data
  occurredAt DATETIME DEFAULT NOW()
);
```

---

## 6. Stripe Webhooks

The backend listens to these Stripe events:

| Event                           | Action                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `checkout.session.completed`    | Create `Abonnement`, statut → `actif`, create `activation` event                                         |
| `customer.subscription.updated` | Update `stripeCurrentPeriodStart/End`, statut (if changed), create event                                 |
| `customer.subscription.deleted` | statut → `annule`, create `annulation` event                                                             |
| `invoice.paid`                  | Update period dates, create `renouvellement` + `paiement_reussi` events, montantCentimes = invoice.total |
| `invoice.payment_failed`        | statut → `en_pause`, create `paiement_echoue` event                                                      |

### 6.1 Webhook Handler

Located in `renford-api/src/modules/abonnements/abonnement.webhook.ts`:

```ts
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      // Create Abonnement from session
      break;
    case "invoice.paid":
      // Update period dates, create events
      break;
    case "customer.subscription.deleted":
      // Mark as annule
      break;
    // ... other cases
  }
}
```

---

## 7. Admin Backoffice Endpoints

### 7.1 Create Custom Subscription (Compétition)

**POST /api/admin/abonnements/competition** (admin only)

```json
{
  "profilEtablissementId": "uuid",
  "prixMensuelHT": 600
}
```

Response:

```json
{
  "abonnementId": "uuid",
  "stripeSubscriptionId": "sub_xxx",
  "stripePriceId": "price_yyy",
  "statut": "actif"
}
```

### 7.2 Get All Subscriptions

**GET /api/admin/abonnements** → List all with quota usage

### 7.3 Cancel Subscription

**POST /api/admin/abonnements/:abonnementId/cancel** → Set statut to `annule`

### 7.4 Pause/Resume

**POST /api/admin/abonnements/:abonnementId/pause** → Set statut to `en_pause`

**POST /api/admin/abonnements/:abonnementId/resume** → Set statut to `actif`

---

## 8. Implementation Checklist

### Backend

- [x] Create `src/config/stripe.ts` (Stripe instance)
- [x] Define `Abonnement` and `AbonnementEvenement` models in Prisma schema
- [x] Implement `getMissionsCreatedInCurrentPeriod` in `src/lib/abonnement-quota.ts`
- [x] Implement `checkQuotaExceeded` in `src/lib/abonnement-quota.ts`
- [ ] Create `src/modules/abonnements/abonnement.controller.ts`:
  - [ ] `POST /api/abonnements/checkout` (self-serve)
  - [ ] `GET /api/abonnements/current` (fetch active subscription + quota)
  - [ ] `POST /api/abonnements/cancel` (user cancellation)
- [ ] Create `src/modules/abonnements/abonnement.webhook.ts` (webhook handler)
- [ ] Create `POST /api/admin/abonnements/competition` (admin custom plan)
- [ ] Hook `checkQuotaExceeded` into `POST /api/missions` before mission creation
- [x] Add env vars for Stripe keys and Product IDs

### Frontend

- [ ] Wire `/abonnement` page to real data (hook `useAbonnementActif`)
- [ ] Remove debug controls once in production
- [ ] Disable "Create mission" button if quota exceeded
- [ ] Show in-app notifications at 80% and 100% quota
- [ ] Wire "Contact sales" button on Compétition plan card

### Stripe Dashboard

- [ ] Create 3 Products: `renford-echauffement`, `renford-performance`, `renford-competition`
- [ ] Create Prices for Échauffement (99€/mo) and Performance (199€/mo)
- [ ] Configure webhooks → `POST /api/abonnements/webhook`
- [ ] Set statement descriptor and branding

---

## 9. Execution Flow Examples

### Example 1: Self-Serve Subscription (Performance Plan)

```
User (Établissement) on /abonnement page
  ↓ clicks "Subscribe to PERFORMANCE"
  ↓ Frontend: POST /api/abonnements/checkout { plan: "performance" }
  ↓ Backend creates Stripe Checkout Session with STRIPE_PRICE_PERFORMANCE
  ↓ Redirect to Stripe Checkout
  ↓ User pays 199€/month
  ↓ Stripe creates subscription + sends webhook
  ↓ Backend: checkout.session.completed webhook arrives
  ↓ Backend creates Abonnement record {
      plan: "performance", quotaMissions: 25, stripeSubscriptionId: "sub_xxx",
      stripePriceId: "price_bbb", stripeCurrentPeriodStart: 2026-04-20, ...
    }
  ↓ Backend creates AbonnementEvenement { type: "activation" }
  ↓ Frontend redirected to /abonnement with success message
  ↓ Quota bar shows 0/25 missions used
```

### Example 2: Create Mission with Quota Check

```
User clicks "Create mission"
  ↓ Frontend: POST /api/missions { ... }
  ↓ Backend extracts profilEtablissementId from JWT
  ↓ Backend calls checkQuotaExceeded(profilEtablissementId)
  ↓ If hasSubscription=true, quotaMissions=25, missionsCreated=25:
    → exceeded = true
    → HTTP 402 { error: "QUOTA_EXCEEDED", remaining: 0, plan: "performance" }
    → Mission NOT created
  ↓ Frontend receives 402, shows error toast "Quota atteint"
  ↓ "Create mission" button stays disabled until upgrade

  OR if missionsCreated=20 (5 remaining):
    → exceeded = false, remaining = 5
    → Mission creation proceeds
    → Mission saved to DB with dateCreation = now()
    → Next quota check will count 21/25
```

### Example 3: Quota Auto-Reset on Renewal

```
Subscription is active, Period: 2026-04-15 → 2026-05-15
User has created 25/25 missions (quota exhausted)
  ↓ On 2026-05-15 00:00, Stripe auto-renews (if payment succeeds)
  ↓ Stripe sends webhook: invoice.paid
  ↓ Webhook handler calls:
      prisma.abonnement.update({
        stripeCurrentPeriodStart: 2026-05-15,
        stripeCurrentPeriodEnd: 2026-06-15
      })
  ↓ Dashboard refreshes /abonnement
  ↓ Frontend calls GET /api/abonnements/current
  ↓ Backend calls checkQuotaExceeded() again
  ↓ getMissionsCreatedInCurrentPeriod() now counts missions since 2026-05-15
  ↓ Result: 0/25 (quota reset automatically!)
  ↓ Frontend shows quota bar at 0/25
  ↓ User can create missions again
```

### Example 4: Admin Creates Custom Compétition Plan

```
Sales closes a deal: 2000€/mo for unlimited missions
Admin logs into backoffice
  ↓ Calls POST /api/admin/abonnements/competition
    { profilEtablissementId: "uuid", prixMensuelHT: 2000 }
  ↓ Backend:
    1. Creates/fetches Stripe Customer
    2. Calls stripe.subscriptions.create() with price_data inline
    3. Stripe generates unique Price ID (price_zzz)
    4. Creates Abonnement {
        plan: "competition", quotaMissions: 0 (unlimited),
        stripeSubscriptionId: "sub_yyy", stripePriceId: "price_zzz",
        prixMensuelHT: 2000
      }
    5. Creates AbonnementEvenement { type: "creation" }
    6. Webhook: customer.subscription.updated arrives
    7. Creates AbonnementEvenement { type: "activation" }
  ↓ Établissement now has unlimited missions
  ↓ checkQuotaExceeded() returns exceeded: false, remaining: Infinity
```

---

## 10. Key Takeaways

1. **Plans are defined in the DB**, not hardcoded — flexibility for future changes.
2. **Static plans** (99€, 199€) use fixed Stripe Prices; **dynamic plans** (custom pricing) use inline price_data per client.
3. **Quota resets automatically** on subscription renewal — no manual intervention needed.
4. **Quota is always calculated dynamically** — no need to manually decrement a counter.
5. **Billing period is from Stripe**, ensuring alignment between quota counting and actual subscription cycle.
6. **Audit trail is comprehensive** — every subscription event logged for compliance and debugging.
7. **à la carte mode is always available** — if quota exceeded, user can fall back to FLEX/COACH and pay per mission.
8. **Admin has full control** over Compétition plans — customize price, pause, resume, cancel at any time.

---

## References

- **Prisma Schema:** `renford-api/prisma/schema.prisma` (models: `Abonnement`, `AbonnementEvenement`)
- **Quota Logic:** `renford-api/src/lib/abonnement-quota.ts`
- **Stripe Config:** `renford-api/src/config/stripe.ts`
- **Existing Doc:** [Docs/RENFORD_ABONNEMENT_QUOTAS.md](RENFORD_ABONNEMENT_QUOTAS.md) (detailed technical spec)
- **Payment Plan:** [Docs/STRIPE_CONNECT_INTEGRATION_PLAN.md](STRIPE_CONNECT_INTEGRATION_PLAN.md)
