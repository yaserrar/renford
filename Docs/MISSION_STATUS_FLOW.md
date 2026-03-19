# Cycle et Statuts d'une Mission (Etablissement)

## Objectif

Ce document decrit le cycle complet d'une mission, depuis sa creation jusqu'a sa cloture, en alignant:

- le CDC simplifie
- les enums de statuts du projet
- les regles UX des maquettes "Mes missions"

## 1. Vue d'ensemble du cycle

1. Creation de la mission (demande)
2. Verification/validation du mode de paiement
3. Publication et recherche de candidatures
4. Selection d'un Renford
5. Signature du contrat par les parties
6. Execution de la mission
7. Validation de fin de mission
8. Passage en terminee puis archivee

## 2. Statuts backend (source technique)

Statuts definis dans le projet:

- `brouillon`
- `en_attente_paiement`
- `envoyee`
- `en_cours_de_matching`
- `proposee`
- `acceptee`
- `contrat_signe`
- `payee`
- `en_cours`
- `a_valider`
- `validee`
- `terminee`
- `archivee`
- `annulee`

## 3. Statuts UX "Mes missions" (maquettes)

Les maquettes Etablissement affichent 3 onglets:

- `En recherche`
- `Confirmees`
- `Terminees`

Avec les badges metier visibles:

- `Ajouter un mode de paiement`
- `En recherche`
- `Candidature(s) disponible(s)`
- `Attente de signature`
- `Mission en cours`
- `Remplacement en cours`
- `Mission terminee`

## 4. Mapping Backend -> UX (Etablissement)

### Onglet En recherche

- Badge `Ajouter un mode de paiement`
  - Backend probable: `en_attente_paiement`
  - Regle: la publication est bloquee tant qu'aucun moyen de paiement valide n'est enregistre.

- Badge `En recherche`
  - Backend probable: `envoyee` ou `en_cours_de_matching` ou `proposee`
  - Regle: mission publiee mais pas de candidature exploitable (aucune candidature ou toutes refusees).

- Badge `Candidature(s) disponible(s)`
  - Backend probable: `proposee` (et candidats presents)
  - Regle: une ou plusieurs candidatures sont disponibles et en attente de decision etablissement.

- Badge `Attente de signature`
  - Backend probable: `acceptee` (candidat selectionne, signature en attente)
  - Regle: candidature acceptee par l'etablissement, contrat a signer par toutes les parties.

### Transition En recherche -> Confirmees

- Condition metier (maquette): des que toutes les signatures du contrat sont effectuees.
- Backend cible: `contrat_signe` puis eventuellement `payee` (selon flux payment capture).

### Onglet Confirmees

- Badge `Mission en cours`
  - Backend: `en_cours`
  - Regle: mission active en execution.

- Badge `Remplacement en cours`
  - Backend: non explicite en enum principal (cas metier/etat derive ou futur statut dedie)
  - Regle: Renford absent, un remplacement est en cours; au retour, retour sur `Mission en cours`.

- Badge `Mission terminee`
  - Backend: `a_valider` ou `validee` ou pre-`terminee` selon implementation
  - Regle maquette: mission achevee, prete a sortir de l'onglet confirmees.

### Transition Confirmees -> Terminees

- Condition metier (maquette): mission achevee.
- Backend cible: `terminee` (puis possiblement `archivee`).

### Onglet Terminees

- Missions cloturees (`terminee`) avec options de notation/evaluation.
- Ensuite stockage long terme possible en `archivee`.

## 5. Cas particuliers et branches du cycle

1. Annulation

- Peut arriver avant execution (ou pendant selon regles metier).
- Backend: `annulee`.
- UX: mission sort du flux actif (affichage a definir selon produit).

2. Echec de candidature

- Si toutes les candidatures sont refusees: retour/maintien sur badge `En recherche`.

3. Paiement non valide

- Si pas de moyen de paiement valide: mission bloquee sur `Ajouter un mode de paiement`.

4. Remplacement

- Si absence du Renford pendant mission confirmee: etat metier `Remplacement en cours`, puis retour a `Mission en cours` quand resolu.

5. Validation de fin

- Fin operationnelle mission -> `a_valider` -> `validee` -> `terminee`.
- Le deblocage/release fonds suit la validation etablissement selon CDC.

## 6. Flux sequence recommande (version operationnelle)

1. `brouillon` (optionnel) ->
2. `en_attente_paiement` (si paiement manquant/invalide) ->
3. `envoyee` ->
4. `en_cours_de_matching` ->
5. `proposee` ->
6. `acceptee` ->
7. `contrat_signe` ->
8. `payee` (selon mode) ->
9. `en_cours` ->
10. `a_valider` ->
11. `validee` ->
12. `terminee` ->
13. `archivee`

Branche d'arret possible a tout moment: `annulee`.

## 7. Points d'attention produit/dev

1. `Remplacement en cours` n'est pas encore un statut enum explicite dans le modele Mission principal.
2. Les badges UX "Mes missions" sont des etats de presentation qui peuvent etre derives de plusieurs statuts backend.
3. Pour eviter les incoherences, definir une fonction unique de mapping `Mission -> Tab + Badge` dans le frontend.
4. Valider avec produit la regle exacte de passage `contrat_signe` / `payee` entre `En recherche` et `Confirmees`.

## 8. Resume metier simple

- Une mission commence en demande.
- Sans moyen de paiement valide, elle reste bloquee.
- Une fois publiee, elle reste "En recherche" jusqu'a selection et contractualisation.
- Apres signatures, elle passe en "Confirmees" et vit son execution.
- A la fin, elle bascule en "Terminees" puis eventuellement en archive.
