## Champs manquants ou incomplets - FLEX

1. Titre de mission.
2. `Niveau d'expérience` incohérent avec le CDC:
   - CDC: `Débutant < 2 ans`, `Confirmé 5-10 ans`, `Expert > 10 ans`;
   - maquette (Onboarding): `Confirmé 2-5 ans`, `Expert > 5 ans`.
   - maquette (Demande de mission): `Peu importe`
3. Description de mission explicite (champ principal), distincte d'un simple "détail supplémentaire".
4. Type de poste (multichoix) et remplacé par "sport concerné".
5. Méthode de tarification conforme CDC:
   - horaire par tranches (moins de 45 / 45-59 / plus de 60)
   - forfait/prestation
   - dégressif selon nombre de participants
6. Champ "nombre de participants/élèves" pour la tarification dégressive.
7. En mode prestation: champ de montant forfaitaire clairement visible.
8. Bloc informations bancaires (étape 1) incomplet:
   - Nom du détenteur du compte
   - Email
   - IBAN
   - Mention légale/mandat
9. Bloc informations de facturation (étape 2) manquant:
   - Nom de facturation
   - Adresse
   - Adresse ligne 2
   - Code postal
   - Ville
   - Pays
   - SIRET

## Champs manquants - COACH

Tous ce flow n'existe pas, mais si on veut utiliser les écrans existants comme base, les champs suivants sont à ajouter:

1. Diplôme/certification requis (optionnel).
2. Nombre de personnes à encadrer.
3. Niveau du cours.
4. Notes de frais prises en charge (oui/non).
5. Description libre de la mission (champ explicite).
6. Poste souhaité (granularité métier, pas uniquement discipline/sport).

## Écart fonctionnel important

- Le champ "pourcentage de variation possible sur le tarif" présent dans les maquettes ne correspond pas à la logique de création de mission établissement décrite dans le CDC (tranches / forfait / dégressif).

## Listes manquantes

- liste des materiaux nécessaires à la mission (ex: tapis de sol, matériel de sonorisation, etc.)
- liste des disciplines sportives (ex: danse, yoga, etc.)
- liste des specialités de chaque discipline (ex: danse classique, danse contemporaine, etc.)
