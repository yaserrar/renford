# Workflow — Paiement de Mission

## Vue d'ensemble

Ce document décrit le processus de paiement après publication d'une mission, selon le type (Renford Flex ou Renford Coach) et le moyen de paiement choisi.

---

## Point de départ — Mission Publiée

Une fois la mission publiée, le flux se divise selon le type de mission :

| Type              | Comportement initial                                 |
| ----------------- | ---------------------------------------------------- |
| **Renford Flex**  | Mission publiée immédiatement                        |
| **Renford Coach** | Mise en attente d'acceptation de la mise en relation |

---

## Flux Renford Flex

### Étape 1 — Choix du moyen de paiement

#### Option A — Carte Bancaire

| Situation          | Résultat                                                            |
| ------------------ | ------------------------------------------------------------------- |
| Carte **valide**   | Stripe déclenche le paiement                                        |
| Carte **invalide** | Mission NON publiée + email envoyé à l'établissement pour réessayer |

Si le paiement est déclenché :

1. Mission publiée ✅
2. Mission réalisée
3. Paiement en fin de mission ou facturation mensuelle
4. Reversement au Renford via **Stripe Connect**
5. **Fin — Mission Flex CB**

#### Option B — SEPA

| Situation                  | Résultat                              |
| -------------------------- | ------------------------------------- |
| Mandat SEPA **validé**     | Mission publiée ✅                    |
| Mandat SEPA **non validé** | Email de rappel envoyé après X heures |

Si le mandat est validé :

1. Mission publiée ✅
2. Mission réalisée
3. Paiement automatique (fin de mission ou mensuel)
4. Reversement au Renford via **Stripe Connect**
5. **Fin — Mission Flex SEPA**

---

## Flux Renford Coach

### Étape 1 — Acceptation de la mise en relation

L'établissement est notifié par email et doit accepter la mise en relation.

| Décision Renford  | Résultat                                         |
| ----------------- | ------------------------------------------------ |
| **Accepte**       | Email de confirmation de mise en relation envoyé |
| **N'accepte pas** | Mission **BLOQUÉE**                              |

### Étape 2 — Après acceptation

1. Mission publiée ✅
2. Mission réalisée
3. Paiement en fin de mission ou facturation mensuelle
4. Reversement au Renford via **Stripe Connect**
5. **Fin — Mission Coach**

---

## Résumé du flux

```
Mission Publiée
  ├─► Renford Flex  ──► Mission publiée immédiatement
  │     └─► Moyen de paiement ?
  │           ├─► Carte Bancaire
  │           │     ├─► Valide    ──► Stripe déclenche paiement ──► Mission publiée
  │           │     └─► Invalide  ──► Mission NON publiée ──► Email établissement (réessayer)
  │           └─► SEPA
  │                 ├─► Mandat validé    ──► Mission publiée
  │                 └─► Mandat non validé ──► Email rappel après X heures
  │
  └─► Renford Coach  ──► Attente acceptation mise en relation
        ├─► Accepte      ──► Email confirmation ──► Mission publiée
        └─► N'accepte pas ──► Mission BLOQUÉE

Mission publiée (tous types)
  └─► Mission réalisée
        └─► Paiement fin de mission / mensuel
              └─► Reversement Renford via Stripe Connect
                    ├─► Fin — Mission Flex CB
                    ├─► Fin — Mission Flex SEPA
                    └─► Fin — Mission Coach
```
