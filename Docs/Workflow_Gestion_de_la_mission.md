# Workflow — Gestion de la Mission

## Vue d'ensemble

Ce document couvre le cycle de vie complet d'une mission, de sa création jusqu'à la facturation finale. Il est organisé en 5 grandes phases :

1. [Mission Publiée](#1-mission-publiée)
2. [Matching](#2-matching)
3. [Contrat](#3-contrat)
4. [Absence et Annulation](#4-absence-et-annulation)
5. [Notation et Facturation](#5-notation-et-facturation)

---

## 1. Mission Publiée

### Création par l'établissement

Une fois la mission créée, une vérification du moyen de paiement est effectuée :

| Paiement validé ? | Résultat |
|-------------------|----------|
| **Non** | Publication bloquée — Statut : **BROUILLON** |
| **Oui** | Mission publiée — notifications email/SMS envoyées aux Renfords éligibles |

> L'établissement peut également proposer un **Renford Favoris** directement depuis *Mes Renfords > Mes favoris*.

### Côté Candidat (Renford)

- La mission apparaît dans la section **Opportunités**
- Le Renford peut postuler → il **devient candidat**

---

## 2. Matching

Le matching fonctionne différemment selon le type de mission.

### Renford Flex — File de candidats (max. 10)

1. **1 candidat disponible ?**
   - **Oui** → L'établissement voit **1 profil**
   - **Non** → Statut établissement : **PUBLIÉE** (en attente)

2. L'établissement prend une décision sur le profil présenté :
   - **Refuser** → Candidat suivant dans la file
   - **Accepter** → Candidat sélectionné → Statut : **CANDIDATURES DISPONIBLES**

3. Le Renford sélectionné reçoit une notification et doit décider :
   - **Accepter** → Vérification de conflit horaire (voir ci-dessous)
   - **Refuser** → Mission descend en bas de liste, Statut Renford : **DÉCLINÉE**

4. **Conflit horaire ?**
   - **Non** → Mise en relation exécutée (pop-up de confirmation)
   - **Oui** → Retiré de la file *(règle à définir : ex. couverture < 50% des horaires)*

### Renford Coach — File de candidats (max. 10, jusqu'à 3 profils visibles)

1. L'établissement voit **jusqu'à 3 profils** simultanément.

2. Pour chaque profil, l'établissement peut :
   - **Refuser** → Remplacé par le candidat suivant
   - **Accepter** → Passage à la sélection
   - **Demander une visio** *(max. 3 demandes de visio)*

3. **Processus de visio :**
   - L'indépendant reçoit **3 créneaux** selon son planning
   - Il peut :
     - **Accepter 1 créneau** → Visio confirmée, emails aux 3 parties (Renford, Indépendant, Établissement) + invitation Calendly
     - **Aucun créneau ne convient** → Proposition de 3 autres créneaux
     - **Refuser** → Retiré de la file

4. Après décision finale de l'établissement :
   - **Accepter** → Mise en relation exécutée
   - **Refuser** → Candidat suivant

### Gestion de la file d'attente (Coach)

| Situation | Statut Renford |
|-----------|---------------|
| Parmi les 3 premiers candidats | **CANDIDATURES EN COURS** |
| En file d'attente | **CANDIDATURES EN COURS** (en attente d'une place) |
| Non retenu | Email "Non retenu" — Statut : **CANDIDATURES NON RETENU** |
| Sélectionné | Email "Vous avez été sélectionné" |

---

## 3. Contrat

### Génération et signature

1. Génération du contrat via **YouSign / DocuSign**
2. Statut : **EN ATTENTE DE SIGNATURE**
3. Envoi du contrat aux 3 parties *(Renford signe par défaut → 2 parties actives)*

### Suivi des signatures

- 3 relances à J+1 si non signé
- **Signé ?**
  - **Oui** → Toutes les signatures reçues → Statut : **SIGNÉ** → Statut : **CONFIRMÉE**
  - **Non** (après 3 relances) → Indépendant et/ou Établissement marqués **non réactifs**

### Annulation par l'établissement avant signature

| Décision | Résultat |
|----------|----------|
| **Relancer une recherche** | Retour au statut **PUBLIÉE** |
| **Ne pas relancer** | Prestation **annulée** + Remboursement |

### Démarrage de la mission

- Date de début atteinte → Statut : **ACTIVE**

---

## 4. Absence et Annulation

### Déclaration d'absence

| Durée de l'absence | Action |
|--------------------|--------|
| **< 1 mois** | Recherche de remplacement automatique — Statut : **EN PAUSE** |
| **> 1 mois** | Blocage utilisateur |

**Remplacement trouvé ?**
- **Oui** → Statut : **EN REMPLACEMENT**
  - Fin d'absence → Reprise avec le Renford initial
- **Non** → Maintien en pause

### Demande d'annulation

1. **Annulation possible ?**
   - **Oui** → Processus d'annulation
     - Les 2 parties d'accord → Saisie de la date de fin
     - Non → Statut : **EN LITIGE** → Email à Renford → Renford Admin tranche → Paiement proratisé
   - **Non** → Pas d'annulation

2. **Fin de mission ?**
   - **Oui** → Statut : **TERMINÉE**
   - **Non** → Mission en cours

### Problème récurrent

- Signalement → Envoi d'un mail à Renford → Renford Admin tranche

---

## 5. Notation et Facturation

### Notation

1. Demande de notation envoyée à l'établissement
2. **Note donnée ?**
   - **Non** → Relance automatique
   - **Oui** → Note visible sur le profil du Renford
3. **Contestation de la note ?**
   - **Non** → Fin du workflow
   - **Oui** → Support Renford décide

### Facturation

| Type de mission | Paiement |
|-----------------|----------|
| **Flex** | Paiement déjà effectué lors de la visio |
| **Coach** | Paiement en fin de mission |

**Litige sur le paiement ?**
- **Non** → Traitement paiement Stripe → Statut : **FACTURÉE** → Envoi facture
- **Oui** → Ajustement manuel

> ⚠️ La facture doit être au format **FactuX** pour être conforme.
> À définir : envoi via API à un PDP pour les structures, ou gestion directe pour les coachs.

---

## Résumé des statuts

| Statut | Description |
|--------|-------------|
| **BROUILLON** | Publication bloquée (paiement non validé) |
| **PUBLIÉE** | Mission visible, en attente de candidats |
| **CANDIDATURES DISPONIBLES** | Au moins 1 candidat disponible |
| **CANDIDATURES EN COURS** | Renford en attente de décision |
| **CANDIDATURES NON RETENU** | Renford non sélectionné |
| **EN ATTENTE DE SIGNATURE** | Contrat généré, signatures en attente |
| **SIGNÉ** | Toutes les signatures reçues |
| **CONFIRMÉE** | Mission confirmée, en attente du démarrage |
| **ACTIVE** | Mission en cours |
| **EN PAUSE** | Absence déclarée, remplacement recherché |
| **EN REMPLACEMENT** | Remplaçant trouvé |
| **EN LITIGE** | Désaccord entre les parties |
| **TERMINÉE** | Mission achevée |
| **FACTURÉE** | Paiement traité, facture envoyée |

---

## Résumé du flux global

```
Mission créée
  └─► Paiement validé ?
        ├─► Non  ──► BROUILLON (bloquée)
        └─► Oui  ──► MISSION PUBLIÉE
                        └─► MATCHING
                              ├─► Flex : 1 profil présenté à l'établissement
                              └─► Coach : jusqu'à 3 profils + option visio
                                    └─► Candidat accepté ──► Mise en relation
                                          └─► CONTRAT
                                                └─► Signatures complètes
                                                      └─► CONFIRMÉE ──► ACTIVE
                                                            ├─► Absence ──► EN PAUSE / EN REMPLACEMENT
                                                            ├─► Annulation ──► EN LITIGE ou TERMINÉE
                                                            └─► Fin normale ──► TERMINÉE
                                                                  └─► NOTATION & FACTURATION
                                                                        └─► FACTURÉE ──► Fin
```
