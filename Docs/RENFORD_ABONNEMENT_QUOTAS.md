# Renford — Système d'Abonnement & Gestion des Quotas

> Ce document décrit l'architecture complète du système d'abonnement pour les établissements : plans, quotas, cycle de facturation, intégration Stripe, comportement en quota dépassé, et audit trail.

---

## 1. Vue d'ensemble

Les établissements (profils) peuvent s'abonner à un plan mensuel qui leur octroie un volume de missions publiables par période de facturation. Sans abonnement, ils peuvent créer des missions en mode **à la carte** (FLEX : commission 15%, COACH : frais fixes 375 € HT).

---

## 2. Plans disponibles

| Plan         | Clé DB (`PlanAbonnement`) | Quota missions/période | Prix mensuel HT | Mode                         |
| ------------ | ------------------------- | ---------------------- | --------------- | ---------------------------- |
| Échauffement | `echauffement`            | 10                     | 99 €            | Self-serve (Stripe Checkout) |
| Performance  | `performance`             | 25                     | 199 €           | Self-serve (Stripe Checkout) |
| Compétition  | `competition`             | Illimitées (`0`)       | Sur mesure      | Manuel (admin + négociation) |

> **Compétition** : le prix est négocié avec chaque client. L'abonnement est créé par un admin via un endpoint interne avec `price_data` inline (voir section 5.3). Il n'y a pas de self-serve pour ce plan.

---

## 3. Modèle de données

### 3.1 Table `Abonnement`

```
ProfilEtablissement
    └── Abonnement[]          (un seul actif à la fois)
            └── AbonnementEvenement[]    (audit trail)
```

**Champs clés :**

| Champ                      | Rôle                                                      |
| -------------------------- | --------------------------------------------------------- |
| `plan`                     | `echauffement` / `performance` / `competition`            |
| `statut`                   | `actif` / `annule` / `expire` / `en_pause` / `en_attente` |
| `quotaMissions`            | Nombre de missions incluses (`0` = illimité)              |
| `missionsUtilisees`        | Compteur dénormalisé (optionnel, pour affichage rapide)   |
| `prixMensuelHT`            | Montant négocié ou tarif standard                         |
| `stripeSubscriptionId`     | ID Stripe de l'abonnement                                 |
| `stripePriceId`            | ID Stripe du prix (par-client pour Compétition)           |
| `stripeCurrentPeriodStart` | Début de la période en cours (vient de Stripe)            |
| `stripeCurrentPeriodEnd`   | Fin de la période en cours (vient de Stripe)              |

### 3.2 Statuts d'abonnement

```
en_attente  ──► actif  ──► annule
                 │
                 ├──► en_pause  ──► actif
                 │
                 └──► expire
```

| Statut       | Signification                                                |
| ------------ | ------------------------------------------------------------ |
| `en_attente` | Abonnement créé, paiement initial pas encore confirmé        |
| `actif`      | Abonnement en cours, quota disponible                        |
| `en_pause`   | Suspendu temporairement (ex : échec de paiement récupérable) |
| `annule`     | Annulation explicite par l'établissement ou l'admin          |
| `expire`     | Fin de période sans renouvellement                           |

---

## 4. Quotas : définition et calcul

### 4.1 Qu'est-ce qu'une "période" ?

> **La période est le cycle de facturation Stripe**, pas le mois calendaire.

Un établissement qui s'abonne le **15 janvier** a sa période du **15 janvier au 14 février**. Son quota se réinitialise le 15 de chaque mois, pas le 1er.

Stripe retourne `current_period_start` et `current_period_end` sur chaque objet `subscription`. Ces dates sont stockées dans `stripeCurrentPeriodStart` / `stripeCurrentPeriodEnd` sur la table `Abonnement` et mises à jour à chaque renouvellement via webhook.

**Fallback** : si ces dates ne sont pas encore disponibles (rare, phase de transition), on utilise le mois calendaire courant (du 1er au dernier jour du mois).

### 4.2 Ce qui compte dans le quota

Le quota est consommé à chaque **création de mission** par n'importe quel établissement (site/succursale) rattaché au `ProfilEtablissement`.

```
ProfilEtablissement
    ├── Etablissement A  ← missions comptées
    ├── Etablissement B  ← missions comptées
    └── Etablissement C  ← missions comptées
```

Toutes les missions créées par tous les sites d'un même profil sont agrégées pour le contrôle du quota.

### 4.3 Fonction de comptage (`getMissionsCreatedInCurrentPeriod`)

Fichier : `renford-api/src/lib/abonnement-quota.ts`

```ts
const { count, periodStart, periodEnd } =
  await getMissionsCreatedInCurrentPeriod(profilEtablissementId);
```

Retourne :

- `count` — nombre de missions créées dans la période courante
- `periodStart` — début de la période (Stripe ou 1er du mois)
- `periodEnd` — fin de la période (Stripe ou fin du mois)

### 4.4 Fonction de vérification (`checkQuotaExceeded`)

```ts
const quota = await checkQuotaExceeded(profilEtablissementId);
```

Retourne :

```ts
{
  hasSubscription: boolean,   // false = mode à la carte (FLEX/COACH)
  exceeded: boolean,          // true = quota atteint ou dépassé
  remaining: number,          // missions restantes (Infinity si illimité)
  quotaMissions: number,      // quota total du plan (0 = illimité)
  missionsCreated: number,    // créées dans la période courante
  plan: string | null,        // "echauffement" | "performance" | "competition" | null
}
```

---

## 5. Intégration Stripe

### 5.1 Configuration

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Les Product IDs Stripe sont créés une fois dans le Stripe Dashboard :

- `STRIPE_PRODUCT_ECHAUFFEMENT` → produit avec un Price fixe à 99 €/mois
- `STRIPE_PRODUCT_PERFORMANCE` → produit avec un Price fixe à 199 €/mois
- `STRIPE_PRODUCT_COMPETITION` → produit sans Price prédéfini (prix inline per-client)

### 5.2 Souscription self-serve (Échauffement / Performance)

**Flux :**

```
1. Établissement clique "S'abonner" sur la page /abonnement
2. POST /api/abonnements/checkout
   → Crée une Stripe Checkout Session avec le Price ID du plan
   → Retourne checkout_url
3. Redirect vers Stripe Checkout
4. Paiement validé → Stripe envoie webhook checkout.session.completed
5. Webhook handler :
   → Crée/met à jour l'Abonnement en BDD
   → statut = actif
   → stocke stripeSubscriptionId, stripePriceId
   → stripeCurrentPeriodStart/End synchronisés depuis subscription.current_period_start/end
   → Crée un AbonnementEvenement { type: "activation" }
```

### 5.3 Souscription manuelle (Compétition)

Pas de self-serve. Processus :

```
1. Équipe commerciale négocie le prix (ex : 600 €/mois)
2. Admin appelle POST /api/admin/abonnements/competition
   body: { profilEtablissementId, prixMensuelHT: 600 }
3. Backend crée l'abonnement Stripe avec price_data inline :

   stripe.subscriptions.create({
     customer: stripeCustomerId,
     items: [{
       price_data: {
         currency: 'eur',
         product: COMPETITION_PRODUCT_ID,
         unit_amount: 60000, // centimes
         recurring: { interval: 'month' }
       }
     }]
   })

4. Stripe génère automatiquement un Price ID unique pour ce client
5. Webhook active l'abonnement en BDD avec ce Price ID
```

> Chaque client Compétition a son propre `stripePriceId` — c'est normal et intentionnel.

### 5.4 Webhooks à écouter

| Événement Stripe                | Action                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `checkout.session.completed`    | Créer l'Abonnement, statut → `actif`, créer événement `activation`                                                        |
| `customer.subscription.updated` | Mettre à jour `stripeCurrentPeriodStart/End`, statut si changé, créer événement                                           |
| `customer.subscription.deleted` | statut → `annule`, créer événement `annulation`                                                                           |
| `invoice.paid`                  | Mettre à jour `stripeCurrentPeriodStart/End`, créer événement `renouvellement` + `paiement_reussi` avec `montantCentimes` |
| `invoice.payment_failed`        | statut → `en_pause`, créer événement `paiement_echoue`                                                                    |

### 5.5 Synchronisation des dates de période

À chaque `invoice.paid` ou `customer.subscription.updated` :

```ts
await prisma.abonnement.update({
  where: { stripeSubscriptionId: subscription.id },
  data: {
    stripeCurrentPeriodStart: new Date(
      subscription.current_period_start * 1000,
    ),
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
  },
});
```

---

## 6. Comportement quand le quota est atteint

### 6.1 Blocage à la création de mission

Avant de créer une mission, le backend appelle `checkQuotaExceeded` et, si `exceeded === true`, retourne une erreur `402` / `403` avec un message explicite.

```
POST /api/missions
→ checkQuotaExceeded(profilEtablissementId)
→ exceeded: true
→ HTTP 402 Payment Required
  { error: "QUOTA_EXCEEDED", remaining: 0, plan: "echauffement", quotaMissions: 10 }
```

### 6.2 Ce qui est encore possible sans quota

Même avec le quota épuisé, l'établissement peut :

- ✅ Consulter ses missions existantes
- ✅ Gérer les candidatures sur des missions déjà créées
- ✅ Signer des contrats
- ✅ Valider des missions en cours
- ✅ Upgrader son plan

Ce qui est bloqué :

- ❌ Créer une nouvelle mission
- ❌ Dupliquer une mission existante

### 6.3 Ce que voit l'utilisateur (frontend)

La page `/abonnement` affiche en temps réel :

```
Volume de missions : ÉCHAUFFEMENT
[████████████████░░░░] 8/10 missions utilisées
```

Quand le quota est atteint (`remaining === 0`) :

- La barre passe au rouge
- Un bandeau d'avertissement apparaît
- Le bouton "Créer une mission" est désactivé avec un tooltip "Quota atteint — upgradez votre plan"
- L'utilisateur est redirigé vers `/abonnement` pour upgrader

### 6.4 Réinitialisation du quota

Le quota se remet à zéro **automatiquement au renouvellement Stripe** : lorsque `invoice.paid` est reçu, `stripeCurrentPeriodStart` est mis à jour. La prochaine fois que `checkQuotaExceeded` est appelé, il compte les missions depuis la nouvelle `stripeCurrentPeriodStart`, donc le compteur repart de zéro sans aucune action manuelle.

> **Il n'y a pas de champ `missionsUtilisees` à remettre à zéro** — le comptage est toujours calculé dynamiquement à partir de `dateCreation` des missions dans la période courante.

---

## 7. Audit Trail — `AbonnementEvenement`

Chaque changement d'état de l'abonnement génère un enregistrement `AbonnementEvenement`.

### 7.1 Types d'événements

| Type (`TypeEvenementAbonnement`) | Quand                                                           |
| -------------------------------- | --------------------------------------------------------------- |
| `creation`                       | Abonnement créé en BDD (avant paiement)                         |
| `activation`                     | Premier paiement validé, abonnement actif                       |
| `renouvellement`                 | Renouvellement mensuel réussi                                   |
| `paiement_reussi`                | Invoice Stripe payée (avec `montantCentimes`)                   |
| `paiement_echoue`                | Échec de paiement Stripe                                        |
| `annulation`                     | Annulation explicite                                            |
| `expiration`                     | Fin de période sans renouvellement                              |
| `mise_en_pause`                  | Suspension (ex : après échec de paiement)                       |
| `reprise`                        | Réactivation après pause                                        |
| `changement_plan`                | Upgrade/downgrade (avec `details: { ancienPlan, nouveauPlan }`) |
| `remboursement`                  | Remboursement partiel ou total                                  |

### 7.2 Structure d'un événement

```ts
{
  id: "uuid",
  abonnementId: "uuid",
  type: "renouvellement",
  ancienStatut: "actif",
  nouveauStatut: "actif",
  montantCentimes: 19900,           // 199€
  stripeEventId: "evt_xxx",
  stripeEventType: "invoice.paid",
  stripeSubscriptionId: "sub_xxx",
  details: { /* JSON libre */ },
  occurredAt: "2026-04-15T10:00:00Z"
}
```

---

## 8. Sans abonnement (mode à la carte)

Sans abonnement actif (`hasSubscription: false`), les établissements ne sont pas bloqués — ils paient à la mission :

| Mode      | Frais                              |
| --------- | ---------------------------------- |
| **FLEX**  | 15% du montant HT de la mission    |
| **COACH** | 375 € HT fixe par mise en relation |

La fonction `checkQuotaExceeded` retourne `exceeded: false` / `remaining: Infinity` dans ce cas — aucun blocage.

---

## 9. Fichiers concernés

| Fichier                                                                                       | Rôle                                                      |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `renford-api/prisma/schema.prisma`                                                            | Modèles `Abonnement`, `AbonnementEvenement`, enums        |
| `renford-api/src/lib/abonnement-quota.ts`                                                     | `getMissionsCreatedInCurrentPeriod`, `checkQuotaExceeded` |
| `renford-api/src/config/stripe.ts`                                                            | Instance Stripe configurée                                |
| `renford-api/src/modules/abonnements/`                                                        | Controllers, routes, webhooks (à créer)                   |
| `renford-dashboard/app/(dashboard)/dashboard/etablissement/abonnement/`                       | Page UI abonnement                                        |
| `renford-dashboard/app/(dashboard)/dashboard/etablissement/abonnement/quota-progress-bar.tsx` | Barre de quota                                            |
| `renford-dashboard/app/(dashboard)/dashboard/etablissement/abonnement/debug-controls.tsx`     | Contrôles debug                                           |

---

## 10. Checklist d'implémentation

### Backend

- [ ] Créer `src/config/stripe.ts` (instance Stripe)
- [ ] Créer `src/modules/abonnements/abonnement.controller.ts`
  - [ ] `POST /api/abonnements/checkout` — générer Checkout Session (Échauffement/Performance)
  - [ ] `GET /api/abonnements/current` — retourner abonnement actif + quota
  - [ ] `POST /api/abonnements/cancel` — annuler l'abonnement
- [ ] Créer `src/modules/abonnements/abonnement.webhook.ts` — handler webhooks Stripe
- [ ] Créer `POST /api/admin/abonnements/competition` — création manuelle (admin uniquement)
- [ ] Brancher `checkQuotaExceeded` dans `POST /api/missions` avant création
- [ ] Ajouter `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` dans `env.ts`
- [ ] Créer les produits Stripe dans le Dashboard et ajouter les IDs en env

### Frontend

- [ ] Câbler la page `/abonnement` sur les données réelles (hook `useAbonnementActif`)
- [ ] Supprimer les `debug-controls.tsx` une fois en production
- [ ] Désactiver le bouton "Créer une mission" si quota épuisé
- [ ] Afficher une notification in-app quand quota à 80% et à 100%
- [ ] Bouton "Nous contacter" sur la carte Compétition (pas de self-serve)

### Stripe Dashboard

- [ ] Créer 3 Products : `renford-echauffement`, `renford-performance`, `renford-competition`
- [ ] Créer les Prices mensuels pour Échauffement (99€) et Performance (199€)
- [ ] Configurer les webhooks vers `POST /api/abonnements/webhook`
