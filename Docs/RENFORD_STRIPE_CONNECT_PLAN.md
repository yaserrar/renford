# RENFORD - Plan d'Implémentation Stripe Connect

> **Objectif** : Implémenter un système de paiement complet via Stripe Connect pour la plateforme Renford (marketplace sportive).

---

## 1. Architecture de Paiement

### 1.1 Modèle Stripe Connect

**Type** : Stripe Connect avec **Destination Charges**

- **Renford (plateforme)** = Compte principal Stripe
- **Renfords (freelancers)** = Comptes connectés Stripe Express
- **Établissements** = Clients Stripe (Customers) qui paient

**Flux de paiement** :

```
Établissement  →  Stripe (plateforme Renford)  →  Renford (freelancer)
   (paye)          (retient commission)              (reçoit paiement net)
```

### 1.2 Flux Détaillé

```
1. Établissement crée une mission
2. Mission matchée → Renford accepte → Établissement confirme
3. Contrat signé par les deux parties
4. Mission se déroule
5. Établissement valide la mission (mission_terminee)
6. Paiement déclenché :
   a. PaymentIntent créé avec destination charge vers le compte Connect du Renford
   b. Commission Renford déduite via application_fee_amount
   c. Fonds transférés au compte Connect du Renford
7. Factures générées et envoyées
```

---

## 2. Éléments à Implémenter

### 2.1 Backend (renford-api)

#### A. Configuration Stripe

- [ ] Ajouter `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` à `env.ts`
- [ ] Créer `src/config/stripe.ts` - Instance Stripe configurée

#### B. Migration Prisma

- [ ] Décommenter et adapter le modèle `Paiement` dans schema.prisma
- [ ] Ajouter `stripeConnectAccountId` au modèle `ProfilRenford`
- [ ] Ajouter `stripeConnectOnboardingComplete` (Boolean) au modèle `ProfilRenford`
- [ ] Ajouter `stripeCustomerId` au modèle `ProfilEtablissement`
- [ ] Créer migration

#### C. Module Paiement (`/src/modules/paiement/`)

- [ ] `paiement.controller.ts` - Endpoints de paiement
- [ ] `paiement.route.ts` - Routes
- [ ] `paiement.schema.ts` - Validation Zod
- [ ] `paiement.service.ts` - Logique métier Stripe

**Endpoints** :
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/paiement/connect/onboarding` | Créer lien d'onboarding Stripe Connect (Renford) |
| GET | `/api/paiement/connect/status` | Vérifier statut du compte Connect (Renford) |
| POST | `/api/paiement/create-checkout` | Créer session Checkout Stripe (Établissement) |
| POST | `/api/paiement/webhook` | Webhook Stripe (non authentifié) |
| GET | `/api/paiement/history` | Historique des paiements |
| GET | `/api/paiement/mission/:missionId` | Statut paiement d'une mission |

#### D. Webhook Handler

- [ ] Écouter `checkout.session.completed` → créer enregistrement Paiement
- [ ] Écouter `payment_intent.succeeded` → mettre à jour statut
- [ ] Écouter `account.updated` → mettre à jour statut onboarding Connect
- [ ] Écouter `transfer.created` → confirmer transfert vers Renford

#### E. Adaptation du flux Mission

- [ ] Après `mission_terminee` → proposer le paiement
- [ ] Après paiement confirmé → passer en `archivee`
- [ ] Remplacer le stockage des données bancaires brutes par Stripe

### 2.2 Frontend (renford-dashboard)

#### A. Configuration

- [ ] Ajouter `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` correctement au `.env`
- [ ] Créer `lib/stripe.ts` - Instance Stripe côté client

#### B. Onboarding Connect (Renford)

- [ ] Bouton "Configurer mon compte de paiement" dans le profil Renford
- [ ] Redirection vers Stripe Connect Onboarding
- [ ] Page de retour après onboarding (succès/échec)
- [ ] Indicateur de statut du compte Connect

#### C. Paiement Mission (Établissement)

- [ ] Bouton "Payer la mission" dans les détails mission (après mission_terminee)
- [ ] Redirection vers Stripe Checkout
- [ ] Page de retour après paiement (succès/échec)
- [ ] Statut de paiement visible dans la fiche mission

#### D. Hooks React Query

- [ ] `useStripeConnectOnboarding()` - Lancer l'onboarding
- [ ] `useStripeConnectStatus()` - Statut du compte
- [ ] `useCreateCheckoutSession()` - Créer session de paiement
- [ ] `usePaymentHistory()` - Historique des paiements
- [ ] `useMissionPaymentStatus()` - Statut paiement mission

### 2.3 Suppression de l'Ancien Système

Le système actuel stocke les données bancaires brutes (numéro de carte, CVV, IBAN) directement en base de données. **C'est une faille de sécurité majeure (PCI DSS non-compliance).** Stripe gère tout cela de manière sécurisée.

- [ ] Supprimer les champs de carte bancaire du modèle Mission
- [ ] Supprimer les champs IBAN/BIC du modèle Mission
- [ ] Supprimer `finalizeMissionPayment` endpoint et schema
- [ ] Adapter le frontend pour ne plus collecter les données bancaires directement

---

## 3. Commission Renford

La plateforme prélève une commission sur chaque mission :

- `application_fee_amount` dans le PaymentIntent = commission Renford
- Paramètre configurable (ex: 15% du montant TTC)

---

## 4. Ordre d'Implémentation

1. **Config Stripe** (env + instance)
2. **Migration Prisma** (nouveaux champs)
3. **Module paiement backend** (service + controller + routes + webhook)
4. **Intégration dans le flux mission**
5. **Frontend : onboarding Connect Renford**
6. **Frontend : paiement mission Établissement**
7. **Nettoyage ancien système de paiement**
8. **Types frontend**
9. **Vérification build**

---

## 5. Variables d'Environnement Requises

### Backend (`renford-api/.env`)

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_COMMISSION_PERCENT=15
```

### Frontend (`renford-dashboard/.env`)

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
