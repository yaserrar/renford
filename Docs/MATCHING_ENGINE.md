# Moteur de Matching Renford

Ce document décrit le fonctionnement complet du matching entre une mission et des profils Renford, d'apres l'implementation actuelle dans le backend.

## Objectif

Le moteur cherche les meilleurs profils Renford pour une mission en:

1. appliquant des filtres d'eligibilite stricts,
2. calculant un score de pertinence,
3. classant les profils,
4. conservant uniquement les meilleurs profils en file de proposition.

Le matching principal est implemente dans `syncMissionMatches`.

## Quand le matching s'execute

Le matching est lance dans ces cas:

1. a la creation d'une mission (statut `en_recherche`),
2. lors des runs de scheduler (`syncMissionMatchesForOpenMissions`) pour les missions ouvertes,
3. apres un refus d'un Renford (`refuse_par_renford`) pour relancer une recherche.

Le matching ne s'applique que si la mission est au statut `en_recherche`.

## Taille de la file de matching

Le moteur garde un maximum de 50 profils proposes par mission:

- constante: `MATCH_QUEUE_LIMIT = 50`.

## Etape 1: preselection technique des profils

Les profils charges sont deja filtres par base de donnees:

1. profil ayant la specialite principale de la mission dans `typeMission`,
2. utilisateur de type `renford`,
3. utilisateur actif (`statut = actif`).

Ensuite, des filtres metier supplementaires sont appliques profil par profil.

## Etape 2: filtres d'eligibilite (bloquants)

Si un filtre bloque, le profil est exclu (score non calcule).

### 2.1 Blocage par statut existant

Un profil deja lie a la mission peut etre ignore selon son statut existant.

- Statuts bloquants re-match (`REMATCH_BLOCKING_STATUSES`):
  - `refuse_par_renford`
  - `annule`
  - `mission_terminee`

Si le lien mission-renford a deja un de ces statuts, le profil est ignore.

Pourquoi les autres statuts ne sont pas ignores ?

1. Le cron ne rematch que les missions en `en_recherche`.
2. Les statuts "actifs" (`nouveau`, `vu`) doivent rester ajustables pour garder une shortlist fraiche.
3. Les statuts "verrouilles" ne sont jamais modifies par le cron:
   - `selection_en_cours`
   - `attente_de_signature`
   - `refuse_par_etablissement`
   - `contrat_signe`
   - `mission_en_cours`

Donc le cron ne remet pas un candidat accepte a l'etat par defaut.
Il conserve les statuts engages, et ne nettoie que les propositions non engagees (`nouveau`/`vu`) sorties du top.

### 2.2 Type utilisateur / activite

Le profil est exclu si:

1. l'utilisateur n'est pas de type `renford`, ou
2. l'utilisateur n'est pas `actif`.

### 2.3 Adequation specialite principale

La mission impose `specialitePrincipale`.
Le profil doit avoir cette specialite dans `typeMission`.

### 2.4 Assurance obligatoire

Si la mission exige une assurance (`assuranceObligatoire = true`),
le profil doit avoir `assuranceRCPro = true`.

### 2.5 Niveau d'experience minimal

Le niveau requis de mission (`niveauExperienceRequis`) est compare au niveau profil (`niveauExperience`) avec ce rang:

- `peut_importe` = 0
- `debutant` = 1
- `confirme` = 2
- `expert` = 3

Si la mission n'est pas `peut_importe`, le profil doit avoir un rang >= rang requis.

### 2.6 Disponibilites (dates + creneaux)

Le profil doit couvrir:

1. la plage de dates mission,
2. tous les creneaux horaires de toutes les plages mission.

Regles:

1. si `dureeIllimitee = false`, `dateDebut/dateFin` du profil doivent englober la mission,
2. chaque plage mission (`heureDebut/heureFin`) est convertie en buckets:
   - `matin`
   - `midi`
   - `apres_midi`
   - `soir`
3. le profil doit avoir tous les buckets requis pour le jour de semaine concerne.

### 2.7 Localisation / mobilite

Si coordonnees GPS disponibles des deux cotes:

1. distance calculee (Haversine),
2. si `zoneDeplacement` existe et distance > zone, profil exclu.

Si coordonnees indisponibles:

1. meme ville => compatible,
2. sinon meme departement (2 premiers caracteres du code postal) => compatible partiel,
3. sinon compatible faible mais non bloquant.

### 2.8 Compatibilite tarifaire

Le tarif Renford est choisi selon `methodeTarification` de la mission:

1. `horaire` -> `tarifHoraire`
2. `journee` -> `tarifJournee` (si `proposeJournee = true`)
3. `demi_journee` -> `tarifDemiJournee` (si `proposeDemiJournee = true`)

Le profil est exclu si:

1. pas de tarif disponible pour la methode, ou
2. tarif profil > tarif max supporte mission

Formule du plafond:

`maxSupportedTarif = missionTarif * (1 + pourcentageVariationTarif / 100)`

## Etape 3: calcul du score

Base:

- score initial = 100

Bonus ajoutes:

1. Favori etablissement: +80
2. Match sur specialites secondaires: +12
3. Localisation:
   - avec GPS: `max(0, 30 - distanceKm / 2)`
   - fallback ville: +22
   - fallback departement: +12
   - sinon: +0
4. Experience niveau: `rankExperience * 8`
5. Missions completees: `min(12, nombreMissionsCompletees * 0.4)`
6. Experiences pro: `min(10, nbExperiences * 2)`
7. Diplomes: `min(6, nbDiplomes * 2)`
8. Carte pro justifiee: +3
9. Proximite tarifaire:
   - `priceGapRatio = abs(renfordTarif - missionTarif) / missionTarif` (si missionTarif > 0)
   - bonus `max(0, 25 - priceGapRatio * 40)`

## Etape 4: ranking et selection finale

Apres evaluation:

1. on retire les profils non eligibles,
2. on trie par score descendant,
3. on prend les top 50 (`MATCH_QUEUE_LIMIT`).

## Etape 5: synchronisation des propositions en base

Le moteur aligne la table `MissionRenford` avec la shortlist cible:

1. conserve les assignations verrouillees (`LOCKED_ASSIGNMENT_STATUSES`):
   - `selection_en_cours`
   - `attente_de_signature`
   - `refuse_par_etablissement`
   - `contrat_signe`
   - `mission_en_cours`

2. conserve les statuts bloquants rematch:
   - `refuse_par_renford`
   - `annule`
   - `mission_terminee`

3. supprime uniquement les anciennes propositions non confirmees qui sortent du top:
   - statuts supprimes possibles: `nouveau` ou `vu`

4. cree de nouvelles lignes `MissionRenford` en `nouveau` pour les nouveaux profils top.

Important:

- si un profil est deja `vu` et reste dans le top, il n'est pas reset en `nouveau`.

## Notifications liees au matching

Le moteur envoie des notifications internes:

1. lors de nouvelles propositions creees (vers chaque Renford concerne),
2. quand un Renford accepte une mission (vers l'etablissement),
3. quand l'etablissement retient un Renford (vers ce Renford).

## Re-matching et transitions metier

### Refus par Renford

Quand le Renford refuse:

1. son lien passe a `refuse_par_renford`,
2. le moteur relance `syncMissionMatches` pour chercher des remplacements.

### Acceptation par Renford

Quand le Renford accepte:

1. son lien passe a `selection_en_cours`,
2. un ordre de shortlist est assigne,
3. la mission passe a `candidatures_disponibles`.

### Decision etablissement

- Si l'etablissement retient un Renford:
  1. ce lien passe `attente_de_signature`,
  2. les autres (`nouveau`, `vu`, `selection_en_cours`) sont rejetes `refuse_par_etablissement`,
  3. la mission passe `attente_de_signature`.

- Si l'etablissement refuse un Renford en file:
  1. ce lien passe `refuse_par_etablissement`,
  2. re-normalisation de l'ordre des restants,
  3. si plus personne en `selection_en_cours`, la mission repasse `en_recherche`.

## Limites et point d'evolution

Le hook des favoris est actuellement neutre:

- `getFavoriteRenfordIdsForMission` retourne un set vide.

Donc le bonus +80 existe dans le score, mais n'est pas applique tant que cette partie n'est pas reliee a une source de donnees favoris.

## Resume court

Le matching Renford combine:

1. des filtres stricts (eligibilite legale, metier, disponibilite, geographie, tarif),
2. un scoring pondere (profil, proximite, experience, prix),
3. une shortlist limitee a 10,
4. une synchronisation prudente des statuts pour ne jamais casser les candidatures deja engagees.
