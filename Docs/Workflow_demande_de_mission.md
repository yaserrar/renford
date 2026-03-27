# Workflow — Demande de Mission

## Vue d'ensemble

Ce document décrit le processus complet de traitement d'une demande de mission, depuis le choix du type jusqu'à la publication finale, en passant par la validation tarifaire et le paiement.

---

## Étape 1 — Choix du type de mission

Au démarrage, l'utilisateur choisit entre deux modes :

| Type | Description | Paiement |
|------|-------------|----------|
| **Renford Flex** | Besoins ponctuels ou urgents | Post-mission |
| **Renford Coach** | Besoins réguliers / longue durée | À la mise en relation |

---

## Étape 2 — Vérification tarifaire (Renford Coach uniquement)

Une vérification de la variation tarifaire est effectuée :

- **Variation ≤ max définie** → Un récapitulatif est affiché et un coach est proposé. L'utilisateur peut alors :
  - ✅ **Valider la mission** → passer au paiement
  - ✏️ **Modifier** → retourner à l'étape précédente
  - 🔀 **Renvoyer vers la section concernée**
- **Variation > max définie** → Aucune proposition n'est faite. Le flux s'arrête.

> ℹ️ Si le coach proposé est hors budget, il est tout de même présenté avec une mention explicite.

---

## Étape 3 — Paiement & Facturation

### Choix du moyen de paiement

Deux options sont disponibles :

#### Option A — Carte Bancaire
1. Stripe lance un **SetupIntent** pour vérifier la carte.
2. **Vérification OK** → La carte est enregistrée (non débitée immédiatement).
3. **Vérification KO** → Une erreur est affichée et un paiement alternatif est proposé.

#### Option B — SEPA / IBAN
1. L'utilisateur saisit son IBAN.
2. Un **mandat SEPA** est généré automatiquement.
3. Stripe envoie un **email de confirmation du mandat**.

---

## Étape 4 — Validation finale du paiement

| Situation | Résultat |
|-----------|----------|
| Paiement valide | ✅ **Mission publiée** |
| Aucun moyen de paiement valide | ❌ Erreur : moyen de paiement requis → **Blocage de la publication** |

---

## Résumé du flux

```
Début
  └─► Choix du type de mission
        ├─► Renford Flex  ──────────────────────────────► Paiement & Facturation
        └─► Renford Coach
              └─► Vérification variation tarifaire
                    ├─► Variation OK  ──► Récap & proposition coach
                    │     └─► Validation / Modification / Renvoi
                    │           └─► Paiement & Facturation
                    └─► Variation KO  ──► Aucune proposition (fin)

Paiement & Facturation
  ├─► Carte Bancaire
  │     ├─► OK  ──► Carte enregistrée
  │     └─► KO  ──► Erreur / Proposition alternative
  └─► SEPA/IBAN
        └─► Génération mandat + Email Stripe

Validation paiement
  ├─► Valide    ──► ✅ Mission publiée
  └─► Invalide  ──► ❌ Erreur → Blocage publication
```
