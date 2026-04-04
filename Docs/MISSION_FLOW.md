# Flux des Statuts de Mission — Renford

Ce document décrit le cycle de vie complet d'une mission, depuis sa création jusqu'à sa clôture, en précisant pour chaque transition l'acteur responsable et l'action déclenchante.

---

## Table des matières

1. [Modèle Mission — Vue d'ensemble](#1-modèle-mission--vue-densemble)
2. [Modèle MissionRenford — Vue d'ensemble](#2-modèle-missionrenford--vue-densemble)
3. [Flux de la Mission (étape par étape)](#3-flux-de-la-mission-étape-par-étape)
4. [Flux du MissionRenford (étape par étape)](#4-flux-du-missionrenford-étape-par-étape)
5. [Vue globale : diagramme de transition](#5-vue-globale--diagramme-de-transition)
6. [Cas particuliers & effets de bord](#6-cas-particuliers--effets-de-bord)
7. [Groupes d'affichage dans le dashboard](#7-groupes-daffichage-dans-le-dashboard)

---

## 1. Modèle Mission — Vue d'ensemble

Le modèle `Mission` représente l'offre de mission publiée par un établissement.

| Statut                     | Libellé affiché              | Description                                                                           |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `brouillon`                | Brouillon                    | Mission en cours de rédaction, non soumise                                            |
| `ajouter_mode_paiement`    | Ajouter un mode de paiement  | Publication bloquée : aucun moyen de paiement valide                                  |
| `en_recherche`             | En recherche                 | Mission publiée, le système recherche des candidats                                   |
| `candidatures_disponibles` | Candidature(s) disponible(s) | Au moins un Renford a accepté la mission, en attente de sélection par l'établissement |
| `attente_de_signature`     | Attente de signature         | L'établissement a retenu un Renford, contrat en attente de signature                  |
| `mission_en_cours`         | Mission en cours             | Contrat signé, prestation démarrée                                                    |
| `remplacement_en_cours`    | Remplacement en cours        | Remplacement temporaire en raison d'une absence                                       |
| `en_litige`                | En litige                    | Incident ou désaccord nécessitant arbitrage                                           |
| `mission_terminee`         | Mission terminée             | Prestation terminée opérationnellement                                                |
| `archivee`                 | Archivée                     | Mission clôturée et archivée                                                          |
| `annulee`                  | Annulée                      | Mission annulée avant clôture normale                                                 |

---

## 2. Modèle MissionRenford — Vue d'ensemble

Le modèle `MissionRenford` représente la relation entre **un Renford** et **une Mission** — c'est-à-dire la candidature ou proposition faite à ce Renford.

| Statut                     | Libellé affiché          | Description                                                                        |
| -------------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| `nouveau`                  | Nouveau                  | Proposition nouvellement créée par le système, pas encore consultée par le Renford |
| `vu`                       | Vu                       | Proposition consultée par le Renford, en attente d'une décision                    |
| `refuse_par_renford`       | Refusé par Renford       | Le Renford a refusé la mission                                                     |
| `selection_en_cours`       | Sélection en cours       | Le Renford a accepté, en file d'attente pour décision de l'établissement           |
| `attente_de_signature`     | Attente de signature     | Ce Renford est retenu, contrat en préparation                                      |
| `refuse_par_etablissement` | Refusé par établissement | L'établissement n'a pas retenu ce Renford                                          |
| `contrat_signe`            | Contrat signé            | Contrat signé, mission confirmée pour ce Renford                                   |
| `mission_en_cours`         | Mission en cours         | Prestation démarrée                                                                |
| `mission_terminee`         | Mission terminée         | Prestation terminée                                                                |
| `annule`                   | Annulé                   | Assignation annulée avant la fin normale                                           |

---

## 3. Flux de la Mission (étape par étape)

### PHASE 1 — Création

```
[Aucun] ──────────────────────────────────────────────────► en_recherche
```

| Acteur            | Action                                      | Fonction backend  |
| ----------------- | ------------------------------------------- | ----------------- |
| **Établissement** | Soumet le formulaire de création de mission | `createMission()` |

- Le statut est **toujours** `en_recherche` à la création.
- Le système lance immédiatement `syncMissionMatches()` pour trouver des candidats.

> **Note :** Les statuts `brouillon` et `ajouter_mode_paiement` existent dans l'enum mais la création directe passe à `en_recherche`. Ils peuvent être utilisés pour des missions incomplètes ou sans mode de paiement enregistré.

---

### PHASE 2 — Recherche de candidats

```
en_recherche ────────────────────────────────────────────► candidatures_disponibles
```

| Acteur      | Action                            | Fonction backend                                                         |
| ----------- | --------------------------------- | ------------------------------------------------------------------------ |
| **Renford** | Accepte la proposition de mission | `registerMissionRenfordResponse()` avec `response: 'selection_en_cours'` |

- Dès qu'un premier Renford accepte, la mission passe à `candidatures_disponibles`.
- Si plusieurs Renfords acceptent, tous apparaissent dans la file d'attente (`ordreShortlist`), ordonnée par date d'acceptation.

```
candidatures_disponibles ─── (Établissement refuse tous les candidats) ──► en_recherche
```

| Acteur            | Action                                                        | Fonction backend                                                                            |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Établissement** | Refuse un candidat, et il ne reste plus personne dans la file | `registerEtablissementMissionRenfordResponse()` avec `response: 'refuse_par_etablissement'` |

---

### PHASE 3 — Sélection et signature

```
candidatures_disponibles ───────────────────────────────► attente_de_signature
```

| Acteur            | Action                        | Fonction backend                                                                        |
| ----------------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| **Établissement** | Accepte un candidat (Renford) | `registerEtablissementMissionRenfordResponse()` avec `response: 'attente_de_signature'` |

- En acceptant un Renford, **tous les autres** candidats en `selection_en_cours` sont automatiquement rejetés (`refuse_par_etablissement`).
- La mission passe à `attente_de_signature`.

---

### PHASE 4 — Exécution

```
attente_de_signature ───────────────────────────────────► mission_en_cours
mission_en_cours     ─── (incident) ────────────────────► en_litige
mission_en_cours     ─── (remplacement) ────────────────► remplacement_en_cours
```

> Ces transitions sont déclenchées **manuellement** ou via des processus admin/système (signature de contrat, événements terrain).

---

### PHASE 5 — Clôture

```
mission_en_cours  ──────────────────────────────────────► mission_terminee
mission_terminee  ──────────────────────────────────────► archivee
[tout statut]     ─── (annulation) ─────────────────────► annulee
```

---

## 4. Flux du MissionRenford (étape par étape)

### PHASE 1 — Proposition (Système)

```
[Aucun] ──────────────────────────────────────────────────► nouveau
```

| Acteur             | Action                                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Système / Cron** | `syncMissionMatches()` exécuté périodiquement — crée des `MissionRenford` avec statut `nouveau` pour les top 10 profils compatibles |

---

### PHASE 2 — Consultation (Renford)

```
nouveau ──────────────────────────────────────────────────► vu
```

| Acteur      | Action                                | Lieu                                                         |
| ----------- | ------------------------------------- | ------------------------------------------------------------ |
| **Renford** | Ouvre la page de détail de la mission | `getMissionRenfordDetails()` — auto-transition à l'ouverture |

> Effet de bord automatique : si `statut === 'nouveau'` lors de la consultation, le statut passe à `vu` sans action explicite du Renford.

---

### PHASE 3 — Décision du Renford

#### Cas A — Le Renford accepte

```
nouveau / vu ──────────────────────────────────────────────► selection_en_cours
```

| Acteur      | Action                | Fonction backend                                                         |
| ----------- | --------------------- | ------------------------------------------------------------------------ |
| **Renford** | Clique sur "Accepter" | `registerMissionRenfordResponse()` avec `response: 'selection_en_cours'` |

- `ordreShortlist` est attribué (1, 2, 3…) par ordre d'acceptation.
- La `Mission` passe à `candidatures_disponibles`.

#### Cas B — Le Renford refuse

```
nouveau / vu ──────────────────────────────────────────────► refuse_par_renford
```

| Acteur      | Action               | Fonction backend                                                         |
| ----------- | -------------------- | ------------------------------------------------------------------------ |
| **Renford** | Clique sur "Refuser" | `registerMissionRenfordResponse()` avec `response: 'refuse_par_renford'` |

- `syncMissionMatches()` est relancé pour tenter de trouver un remplaçant.

---

### PHASE 4 — Décision de l'Établissement

#### Cas A — L'établissement accepte

```
selection_en_cours ────────────────────────────────────────► attente_de_signature
```

| Acteur            | Action                                            | Fonction backend                                                                        |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Établissement** | Clique sur "Accepter" dans les détails de mission | `registerEtablissementMissionRenfordResponse()` avec `response: 'attente_de_signature'` |

- **Tous les autres** MissionRenford en `selection_en_cours` pour cette mission → `refuse_par_etablissement` (transaction atomique).

#### Cas B — L'établissement refuse

```
selection_en_cours ────────────────────────────────────────► refuse_par_etablissement
```

| Acteur            | Action                                           | Fonction backend                                                                            |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Établissement** | Clique sur "Refuser" dans les détails de mission | `registerEtablissementMissionRenfordResponse()` avec `response: 'refuse_par_etablissement'` |

- La file d'attente (`ordreShortlist`) est renormalisée.
- Si personne ne reste en `selection_en_cours` : la `Mission` repasse à `en_recherche`.

---

### PHASE 5 — Signature et exécution

```
attente_de_signature ───────────────────────────────────────► contrat_signe
contrat_signe        ───────────────────────────────────────► mission_en_cours
mission_en_cours     ───────────────────────────────────────► mission_terminee
```

> Ces transitions sont déclenchées via processus de signature de contrat et suivi terrain.

---

### PHASE 6 — Fin

```
[tout statut] ──────────────────────────────────────────────► annule
mission_en_cours / mission_terminee ────────────────────────► mission_terminee
```

---

## 5. Vue globale : diagramme de transition

### Mission

```
                        ┌──────────────┐
                        │   Creation   │
                        │ (Etab crée)  │
                        └──────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                 ┌────►│  en_recherche │◄──────────────────────────────────────┐
                 │     └──────┬────────┘                                       │
                 │            │ Renford accepte                                │
                 │            │ (1er candidat)                                 │
                 │            ▼                                                │
                 │  ┌───────────────────────────┐                             │
                 │  │  candidatures_disponibles  │                             │
                 │  └──────────────┬────────────┘                             │
                 │                 │ Etab accepte                              │
                 │                 │ un candidat                               │
                 │                 ▼                        Etab refuse        │
                 │       ┌──────────────────────┐     tous les candidats      │
                 │       │ attente_de_signature  │─────────────────────────────┘
                 │       └──────────┬───────────┘
                 │                  │ Signature
                 │                  ▼
                 │        ┌──────────────────┐
                 │        │  mission_en_cours │
                 │        └──────┬───────────┘
                 │               │ Fin
                 │               ▼
                 │      ┌────────────────────┐
                 │      │  mission_terminee   │
                 │      └──────┬─────────────┘
                 │             │ Archivage
                 │             ▼
                 │        ┌──────────┐
                 │        │ archivee │
                 │        └──────────┘
                 │
                 │   ┌─────────┐
                 └───┤ annulee │ (depuis tout statut)
                     └─────────┘
```

### MissionRenford

```
                          ┌─────────────────────────────────┐
                          │  Système (cron matching)        │
                          │  crée la proposition            │
                          └──────────────┬──────────────────┘
                                         │
                                         ▼
                                     ┌───────┐
                                     │nouveau│
                                     └───┬───┘
                                         │ Renford consulte la mission
                                         ▼
                                      ┌────┐
                                      │ vu │
                                      └──┬─┘
                          ┌─────────────┼──────────────────┐
                          │ Refuse      │                   │ Accepte
                          ▼             │                   ▼
              ┌────────────────────┐   │        ┌────────────────────┐
              │ refuse_par_renford │   │        │ selection_en_cours  │
              └────────────────────┘   │        └──────────┬─────────┘
              (syncMissionMatches      │              ┌─────┴──────────┐
               relancé)                │              │ Etab décide    │
                                       │         Accepte           Refuse
                                       │              │                │
                                       │              ▼                ▼
                                       │  ┌────────────────────┐  ┌───────────────────────┐
                                       │  │ attente_de_signature│  │ refuse_par_etablissement│
                                       │  └──────────┬─────────┘  └───────────────────────┘
                                       │             │ Signature
                                       │             ▼
                                       │      ┌──────────────┐
                                       │      │ contrat_signe │
                                       │      └──────┬────────┘
                                       │             │ Démarrage
                                       │             ▼
                                       │    ┌──────────────────┐
                                       │    │  mission_en_cours │
                                       │    └──────┬───────────┘
                                       │           │ Fin
                                       │           ▼
                                       │   ┌───────────────────┐
                                       │   │  mission_terminee  │
                                       │   └───────────────────┘
                                       │
                                       │  ┌────────┐
                                       └─►│ annule │ (depuis tout statut)
                                          └────────┘
```

---

## 6. Cas particuliers & effets de bord

### Rejet automatique des co-candidats

Quand l'établissement **accepte** un Renford (`attente_de_signature`), **tous les autres** Renfords en `selection_en_cours` pour la même mission sont automatiquement rejetés (`refuse_par_etablissement`) dans la même transaction atomique.

### Re-matching automatique

Le re-matching via `syncMissionMatches()` est déclenché dans deux cas :

1. **Un Renford refuse** (`refuse_par_renford`) — le système tente de trouver un nouveau candidat.
2. **L'établissement refuse tous les candidats** — la mission repasse à `en_recherche` et le système relance la recherche.

### Le cron de matching respecte les statuts verrouillés

Le job `syncMissionMatches` ne supprime **jamais** les `MissionRenford` dont le statut est :

| Catégorie                                  | Statuts                                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Verrouillés (`LOCKED_ASSIGNMENT_STATUSES`) | `selection_en_cours`, `attente_de_signature`, `refuse_par_etablissement`, `contrat_signe`, `mission_en_cours` |
| Bloquants (`REMATCH_BLOCKING_STATUSES`)    | `refuse_par_renford`, `annule`, `mission_terminee`                                                            |

Seules les entrées `nouveau` ou `vu` qui ne sont plus dans le top 10 peuvent être supprimées lors d'un re-matching.

### Auto-passage `nouveau` → `vu`

Quand un Renford ouvre la page de détail d'une mission, si son `MissionRenford` est encore en `nouveau`, il passe **automatiquement** à `vu` sans action explicite.

### Visibilité côté Établissement

L'établissement ne voit **pas** les `MissionRenford` aux statuts `nouveau`, `vu` ou `refuse_par_renford` dans le détail de sa mission. Seuls les statuts avancés (à partir de `selection_en_cours`) sont affichés.

---

## 7. Groupes d'affichage dans le dashboard

### Vue Établissement

| Onglet           | Statuts inclus                                                                   |
| ---------------- | -------------------------------------------------------------------------------- |
| **En recherche** | `brouillon`, `ajouter_mode_paiement`, `en_recherche`, `candidatures_disponibles` |
| **Confirmées**   | `attente_de_signature`, `mission_en_cours`, `remplacement_en_cours`, `en_litige` |
| **Terminées**    | `mission_terminee`, `archivee`, `annulee`                                        |

### Vue Renford (MissionRenford)

| Onglet           | Statuts inclus                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| **Opportunités** | `nouveau`, `vu`                                                          |
| **Candidatures** | `selection_en_cours`, `attente_de_signature`, `refuse_par_etablissement` |
| **Validées**     | `contrat_signe`, `mission_en_cours`, `mission_terminee`                  |

---

_Document généré à partir du code source — `missions-matching.ts`, `missions.controller.ts`, `missions-renford.controller.ts`, `schema.prisma`, `validations/mission.ts`, `validations/mission-renford.ts`._
