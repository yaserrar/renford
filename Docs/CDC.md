# RENFORD

## Cahier des charges V

```
ASATEKIN Seren
```

## VERE Nicolas

```
Workstation,
25 quai du Président Paul Doumer,
Courbevoie
```

_renford.fr_ (^) renford.contact@gmail.comcontact@renford.fr^

## TABLE DES MATIÈRES

- Introduction.............................................................................
- I. Description fonctionnelle..........................................................
  - 1.  Scénarios d'utilisation.........................................................
  - 2.  Fonctionnalités Avancées / Principales...................................
- II) Description Technique...........................................................
- III) Design et Interface Utilisateur................................................
  - 4.1 Environnements de Test...................................................
  - 4.2 Plan de Tests.................................................................
  - 4.3 Critères d'Acceptation......................................................
- V) Maintenance Technique & Support............................................
  - 5.1. Maintenance.................................................................
  - 5.2. Support utilisateur.........................................................
- VI) Calendrier prévisionnel pour le développement de Renford...........
- VII) Budget.............................................................................
- ANNEXES...............................................................................

## Introduction.............................................................................

Renford est une plateforme innovante, conçue pour transformer la manière dont
les professionnels indépendants du secteur sportif et les établissements sportifs
interagissent et collaborent. En réponse à une demande croissante pour des solutions de
gestion des ressources humaines spécialisées dans le sport, Renford propose une approche
unique qui combine technologie avancée et expertise sectorielle pour dynamiser le marché
de l'emploi sportif.

**Contexte du projet**

Le marché du sport en France est en pleine expansion, avec une demande accrue pour des
services spécialisés, que ce soit dans le domaine du coaching, de l'enseignement, ou de la
gestion d'événements sportifs. Parallèlement, le nombre de professionnels indépendants
dans ce secteur ne cesse de croître, **créant un besoin de solutions permettant de
simplifier la gestion des missions, des paiements, et de la conformité légale.**

Renford répond à cette problématique en offrant une plateforme tout-en-un qui **permet
aux établissements sportifs de trouver facilement des professionnels qualifiés pour des
missions temporaires ou permanentes, tout en automatisant les processus
administratifs qui sont souvent perçus comme complexes et chronophages.** Pour les
professionnels indépendants, Renford offre une visibilité accrue et un accès simplifié à des
missions adaptées à leurs compétences et disponibilités.

**Objectifs du projet**

L'objectif principal de ce projet est de développer une plateforme robuste, intuitive et
évolutive, capable de gérer l'intégralité du processus de mise en relation entre les
professionnels indépendants et les établissements sportifs. La solution doit être capable
de gérer un volume important d'utilisateurs, tout en offrant une expérience utilisateur
fluide et sécurisée.

Ce projet vise également à **positionner Renford comme un acteur clé du secteur sportif
en France** , en proposant des fonctionnalités innovantes telles qu'un algorithme de
matching avancé, une gestion automatisée des documents administratifs, et une interface
utilisateur ergonomique. Le développement de cette plateforme doit également
permettre d'intégrer facilement des fonctionnalités supplémentaires à l'avenir, telles que
l'expansion à l'international ou l'intégration de nouveaux sports et disciplines.

En se basant sur l'ébauche du site actuel ( **_renford.fr_** ) et les retours des premiers
utilisateurs, ce cahier des charges vise à détailler les exigences fonctionnelles et
techniques nécessaires pour atteindre ces objectifs ambitieux, tout en garantissant la
satisfaction des utilisateurs finaux.

## I. Description fonctionnelle..........................................................

Renford est une plateforme SaaS destinée à faciliter la gestion des ressources
humaines dans le secteur sportif. Elle s'adresse à deux segments principaux : les
établissements sportifs (B2B) et les professionnels indépendants du sport (B2B). L'objectif
est de créer un écosystème où les deux parties peuvent interagir efficacement, maximiser
leur potentiel et simplifier les processus administratifs.

La plateforme est structurée autour de trois axes principaux :

- **Matching et Recrutement** : Renford permet aux établissements sportifs de trouver
  rapidement et efficacement des professionnels qualifiés pour répondre à leurs
  besoins.
- **Gestion Administrative** : Renford automatise les tâches administratives pour
  réduire la charge de travail des établissements et des indépendants (génération des
  factures, devis, attestation...et envoie directement des cotisations à l’URSSAF).
- **Suivi et Analyse :** Renford offre des outils de suivi des performances et de
  génération de rapports pour aider les utilisateurs à optimiser leurs opérations.

### 1. Scénarios d'utilisation.........................................................

Le parcours utilisateur sur la plateforme Renford doit être fluide, intuitif, et
efficace, permettant aux établissements sportifs de recruter des professionnels qualifiés
en quelques étapes simples, et aux indépendants de s’inscrire pour recevoir rapidement
des propositions de missions qui correspondent à leurs compétences et disponibilités. Le
parcours est conçu pour maximiser l'efficacité du processus de mise en relation tout en
assurant une expérience utilisateur agréable et optimisée.

```
1.2. Scénarios d'utilisation pour les établissements
sportifs.
```

Le parcours utilisateur doit permettre aux établissements sportifs de recruter des
professionnels qualifiés rapidement. Deux modes de collaboration sont proposés : **Renford
FLEX (missions express, fonctionnement inchangé) et Renford COACH (missions
encadrées, contractualisées).**

🔁 **Étapes communes initiales :**

● **Étape 1 : Connexion à la plateforme**
L'utilisateur (responsable de l'établissement) se connecte à la plateforme Renford
en utilisant ses identifiants. S'il est nouveau, il devra d'abord s'inscrire.

**● Etape 2 : Compléter la fiche Établissement**
Permettre à l'utilisateur de renseigner les informations nécessaires sur son
établissement et de gérer plusieurs établissements s'il en a besoin (par exemple,
pour les grandes chaînes comme Neoness). Contenu de la page :

● **Formulaire Principal :**
○ **Nom de l'établissement** : Le nom officiel de l'établissement (par exemple,
Neoness).
○ **Numéro SIRET/SIREN :** (chiffres attendus)
○ **Adresse** : Inclure une adresse complète (rue, code postal, ville).
○ **Numéro de téléphone** : Contact principal pour l'établissement.
○ **Email principal** : L'adresse email utilisée pour les communications
importantes.
○ **Contact principal** : nom complet du Directeur/ Responsable de
l’établissement.
○ **Type d'établissement** : Sélection parmi plusieurs types (salle de sport,
centre de fitness, studio de yoga, etc.). _Pour la liste complète des types
d’établissements, voir Annexe 1._
○ **Champ choix unique entre Établissement Principal / Secondaire :**
■ **Si choix “Je suis l’établissement principal”, alors l’établissement
est défini comme établissement principal.**
● Apparaît alors un menu déroulant ou l’utilisateur à la
possibilité de chercher parmi les établissements déjà inscrit
sur Renford les possibles établissements secondaires
rattachés à lui.
**● Apparaît alors une Option pour ajouter des établissements
secondaires :**
○ **Bouton "+ Ajouter un autre établissement"** : Permet
à l'utilisateur de créer plusieurs fiches pour chaque
établissement (par exemple, Neoness République).
○ **Informations à dupliquer** : Par défaut, certaines
informations comme le nom et l'adresse peuvent être
dupliquées pour gagner du temps si elles sont
similaires. Les autres champs peuvent être remplis
séparément pour chaque établissement.
■ **Si choix “Je suis un établissement secondaire”,** l'utilisateur est
invité à rechercher le nom du groupe principal auquel
l'établissement secondaire est rattaché. Une barre de recherche
permet de trouver le groupe parmi ceux déjà inscrits.
● Si le groupe principal n’est pas trouvé, alors l'utilisateur le
renseigne via un champ dédié. (obligatoire)
● **Validation :**

```
○ Bouton "Suivant" : Pour passer à l'étape suivante.
○ Bouton "Sauvegarder et ajouter un autre établissement" : Permet de
sauvegarder les informations de l'établissement actuel tout en ajoutant un
autre.
```

### ● Étape 3 : Ajouter des profils favoris

```
Donner à l'utilisateur la possibilité de sélectionner des profils de Renfords
(freelancers) qu'il souhaite utiliser régulièrement ou recommander à d'autres
établissements du groupe. L’objectif in fine est de venir remplir notre base de
données tout en assurant aux établissements la possibilité de travailler avec leurs
Renfords préférés. Les données de cette page doivent bien être enregistrées avec
des fins de prospection si les utilisateurs recommandés sont inconnus de la base
ou bien, enregistrés et liés à des Renfords existants (par exemple, même email).
Ce lien permettra ensuite à l'établissement de retrouver ses Renfords favoris dans
son espace personnel.
```

```
Contenu de la page (vous pouvez retrouver cette page sur Renford.fr ):
```

```
● Introduction :
○ Titre : “Mes profils préférés”. Texte explicatif : "Ajoutez des Renfords à
vos favoris pour un accès rapide lors de vos prochaines missions."
● Formulaire de saisie :
○ Nom complet du Renford : Pour identifier clairement le Renford.
○ Email : Pour contacter directement le Renford.
○ Téléphone : Une ligne directe pour le joindre en cas d'urgence.
● Ajouter plusieurs profils :
○ Bouton "+ Ajouter un autre profil favori" : Similaire à l'ajout
d'établissements, pour permettre à l'utilisateur d'ajouter plusieurs Renfords
favoris.
● Option pour passer cette étape :
○ Bloc “Vous ne souhaitez pas ajouter de profil favoris ?” Bouton
"Découvrir mon espace" : Pour permettre à l'utilisateur de continuer sans
ajouter de profils favoris immédiatement.
```

```
● Etape 4 : Arrivée sur le tableau de bord /La recherche de Renford / Faire une
demande de mission
```

Choix entre :

**Renford FLEX** : Missions ponctuelles avec mise en relation rapide (fonctionnement déjà
décrit, inchangé).
**Renford COACH** : Missions longue durée avec sélection, contractualisation et paiement
sécurisé via la plateforme.

**\*RENFORD FLEX:**

```
● Étape 1 : La recherche de Renford / Faire une demande de mission
```

```
Configuration des critères de la mission (idéalement, diviser en plusieurs étapes
cette page afin de fluidifier le processus utilisateur).
```

```
L'utilisateur configure les critères de la mission, incluant :
```

```
○ Choix de l'établissement concerné : liste déroulante avec les
établissements recensés de l’utilisateur. Choix unique.
○ Type de poste souhaité (par exemple, coach sportif, encadrant d'escalade.
La liste complète en annexe 2 ). Attention! L’utilisateur devra avoir la
possibilité de choisir plusieurs Renfords (là aussi, prévoir un “+” pour
ajouter un ou plusieurs autres profils).
○ Niveau d'expérience requis : nous en avons défini 3 : “Débutant (moins de
2 ans d'expérience)”, “Confirmé (entre 5 et 10 ans d’expérience)” et
“Expert (plus de 10 ans d’expérience)”.
○ Durée de la mission (période spécifique avec date et horaire de début et
date et horaire de fin).
○ Plage horaire : Champs Horaires : pour chaque jour, deux champs : heure
de début et heure de fin. Cela permet à l'utilisateur de préciser les horaires
exacts pour chaque jour. + Création de Plages Horaires Multiples :
Permettre à l'utilisateur de créer plusieurs plages horaires pour une même
journée si nécessaire (ex. : 9h-12h puis 14h-18h). Boutons d'ajout de plages
: Offre un bouton “+ Ajouter une plage horaire” sous chaque jour pour
permettre d’ajouter une deuxième période de travail si nécessaire. Ajouter
une option pour "Copier les horaires du lundi sur toute la semaine" ou
"Copier la journée précédente", pour simplifier la saisie si les horaires sont
similaires d'un jour à l'autre.
○ Tarif horaire (méthode de tarification souhaitée):
■ Option 1 : tarification horaire : L'utilisateur sélectionne cette
option s'il souhaite rémunérer les freelances à l'heure. Une fois cette
option choisie, l'utilisateur peut spécifier la plage tarifaire parmi les
options suivantes :
● Moins de 45 euros de l’heure
● Entre 45 et 59 euros de l’heure
● Plus de 60 euros de l’heure
■ Option 2 : tarification à la prestation. L'utilisateur choisit cette
option si la mission est rémunérée pour l'ensemble du travail,
indépendamment du temps nécessaire. Une fois cette option
sélectionnée, un champ s’affiche permettant à l'utilisateur de saisir
le montant forfaitaire (par exemple, 150 euros). Il peut également
indiquer s’il s’agit d’une journée entière ou d’une demi-journée de
prestation, pour aider à clarifier les attentes.
```

■ **Option 3 : tarification à la prestation selon le nombre d’élèves
(tarif dégressif)** : le même processus que pour la tarification à la
prestation s’applique avec, en plus, la possibilité pour l’utilisateur
d’ajouter le nombre d'élèves présents à la session sportive prévue.
Ce nombre prévu fait baisser la tarification qui est dégressive en
fonction du nombre d'élèves prévu.
○ **Commentaire / Description de la mission :** champ texte enrichi pour laisser
l’utilisateur décrire le contenu de la mission.
○ **Matériel nécessaire** : choix multiple de matériel éventuellement nécessaire
et non fourni pour le Renford qui effectura la mission. Voir _Annexe 4_ pour la
liste du matériel. Attention! Là aussi, il faudra que le matériel qui s'affiche
soit dépendant du choix du “Type de poste souhaité” (par exemple, si le
choix est “Ouvreur”, alors le matériel proposé sera celui de l’escalade).
○ **Informations bancaires:** l’utilisateur renseigne ses informations de
facturation pour faciliter le paiement lorsque la mission est acceptée.
Champ demandé premiere étape : Nom du détenteur du compte, email,
IBAN, mention légale _(“En communiquant votre IBAN, vous autorisez Renford
et Stripe, notre prestataire de services de paiement, à émettre des demandes de
prélèvement auprès de votre banque, qui débitera votre compte conformément à
ces instructions à chaque utilisation de notre plateforme. Vous disposez du droit
de demander un remboursement auprès de votre banque, selon ses conditions,
dans un délai de 8 semaines suivant la date du prélèvement. Vos informations
bancaires sont sécurisées via Stripe._ ) - Dès l’ensemble des informations
renseignées, passer à l’étape 2 avec les champs : Nom de facturation,
Adresse, Adresse ligne 2, Code postal, Ville, Pays, SIRET.

_Exemple du processus de demande de mission jusqu’à la section “Details” - brigad.co_

```
● Étape 2 : Récapitulatif de mission.
```

```
Après avoir rempli le formulaire de demande de mission, l'utilisateur
(l'établissement) est redirigé vers une page de récapitulatif de la mission. Cette
page permet de vérifier toutes les informations saisies avant de valider la demande
finale. Pour rendre cette étape aussi intuitive et fonctionnelle que possible, voici
comment elle pourrait être structurée :
```

1. **Présentation de la Demande de Mission :**
   ○ Titre de la mission : Récapitulatif avec un titre clair et lisible.
   ○ Type de poste souhaité : Affichage du poste ou du profil sélectionné (par
   exemple, Coach boxe).
   ○ Dates : Affichage des dates de début et de fin de la mission.
   ○ Tranche tarifaire sélectionnée : Indication du tarif horaire ou du montant
   total pour une prestation.
   ○ Nombre d'heures totales : Affichage du nombre d'heures total calculé
   automatiquement en fonction des horaires renseignés pour chaque jour de
   la semaine.
2. **Estimation des coûts :**
   ○ **Estimation du coût de la mission (HT)** : Calcul automatique du coût total
   basé sur la tranche tarifaire sélectionnée et le nombre d'heures totales,
   avec une estimation du montant de la commission prélevée.
3. **Possibilité de Modifier la Mission :**

```
○ Bouton "Modifier" : Ce bouton permet à l'utilisateur de revenir sur les
détails de la mission pour effectuer des modifications sans revenir en
arrière. Une fenêtre pop-up s'affiche pour permettre à l'utilisateur de
modifier directement les informations (type de poste, dates, horaires,
etc.).
■ Gestion de la plage de la mission et des horaires : L'utilisateur peut
ajuster les horaires de chaque jour de la semaine, pour chaque
Renford, ce qui met automatiquement le nombre total d'heures de la
mission. Il peut également modifier la date de début et de fin de la
mission.
■ Modification des Critères de la Mission : L'utilisateur peut changer
les critères comme le type de poste ou la tranche tarifaire de
chaque Renford souhaité, et voir instantanément l'impact sur
l'estimation des coûts.
```

4. **Validation de la Demande :**
   ○ **Bouton "Accepter"** : Une fois la demande vérifiée et modifiée si nécessaire,
   l'utilisateur peut valider la mission. Cela envoie la demande à la plateforme
   pour commencer le processus de mise en relation avec les profils
   correspondants (algorithme de matchmaking qui fonctionne). Cela envoie
   également un mail automatique à l’utilisateur pour le remercier et lui
   récapituler la mission. ( _Voir annexe 5_ ).
   ○ **Annuler et Retour au Tableau de Bord** : Une option "Retour à l'espace" est
   aussi disponible pour ceux qui souhaitent sauvegarder les informations sans
   valider immédiatement.

```
● Étape 3 : Processus Post-Validation de la Demande de Mission
```

Une fois la demande de mission validée par l'utilisateur, plusieurs étapes s'enchaînent pour
garantir la réussite de la mission, de la sélection du Renford jusqu'à la clôture de la
mission.

**1. Notification aux Renfords correspondants**

```
● Sélection Automatique : Renford utilise son algorithme de matching pour
sélectionner les Renfords les plus qualifiés pour la mission.
● Envoi des notifications : Les Renfords sélectionnés reçoivent une notification par
email et par SMS les informant de la mission disponible. Ces notifications
contiennent un lien direct vers la mission et les détails de la demande.
● Suivi des Réponses : Les Renfords peuvent accepter ou refuser la mission
directement depuis leur espace personnel sur la plateforme.
```

**2. Proposition du Renford à l'Établissement**

```
● Processus : Après la validation du profil retenu par le Renford, un seul et unique
email est envoyé à l'établissement regroupant les éléments suivants: (de même,
```

```
cela s’affiche via une unique pop-up lorsque l’utilisateur se connecte à son tableau
de bord) :
○ Devis détaillé en PJ : Basé sur les informations de la mission, incluant le
tarif, la durée, et les services demandés ( voir Annexe 6 pour le modèle de
devis)
○ Un bouton “J’accepte la proposition” : pour permettre de valider le devis
et donc le profil retenu. Le clic doit renvoyer à l’espace personnel de
l’utilisateur, dans l’onglet de la mission, afin de cliquer sur “J’accepte la
proposition” (1er étape). Une fois coché, la deuxième étape est la signature
du contrat de prestation (généré automatiquement - voir annexe 7 pour le
modèle de contrat de prestation) prêt à être signé électroniquement via un
service comme DocuSign (ou PandaDoc ou PDFKit). Cela suppose donc la
mise en place d’une API.
○ Paiement via Stripe/Stripe Connect : une fois le contrat signé et la mission
validée, le paiement doit être automatiquement lancé via Stripe pour
débiter l'établissement (=l’utilisateur). Le paiement est bloqué avant d’être
versé sur le compte du prestataire, dès que la mission aura été validée.
● Détails techniques : La génération du devis et du contrat signé, ainsi que le lien de
paiement du montant du la prestation, sont automatisés et ensuite envoyés
regroupés dans un seul email. Le système doit également prévoir des rappels
automatiques si l'établissement ne procède pas au paiement dans un délai imparti
( Voir annexe 9 pour mail de rappel).
```

**4. Ajout de la Mission au Calendrier**

```
● Intégration au Calendrier : Une fois le contrat signé et le paiement effectué, la
mission est automatiquement ajoutée au calendrier de l'établissement et du
Renford.
● Notifications Calendrier : Des rappels automatiques sont envoyés avant le début de
la mission pour assurer que toutes les parties sont prêtes.
```

**6. Suivi et Validation de la Mission**

```
● Mise à jour du statut de la mission : en cours. Chat avec le support ouvert et
disponible en cas de problème, notamment en cas de besoin de communication
pour la mission à venir.
```

**7. Clôture de la mission et évaluation**

**Validation de la mission par l'Établissement :**

```
● Validation du travail : À la fin de la mission, l'établissement doit valider le travail
effectué par le Renford.
○ Formulaire de Validation :
■ La prestation a-t-elle répondu à vos attentes?
```

```
■ Menu déroulant : Oui / Non
■ Si "Non", un champ texte supplémentaire s'affiche : "Si non,
pourquoi ?"
■ Souhaitez-vous ajouter le prestataire de la mission en favori, afin
de le retrouver suggérer pour d’autres missions?
■ Oui/ Non
■ Comment évalueriez-vous la qualité du service fourni?
■ Menu déroulant : Excellent / Très bien / Bien / Moyen /
Médiocre
■ Êtes-vous satisfait de la plateforme Renford?
■ Système d'évaluation par étoiles : 1 à 5 étoiles
■ Êtes-vous satisfait de la prestation en général?
■ Système d'évaluation par étoiles : 1 à 5 étoiles
■ Autres commentaires :
■ Zone de texte pour des remarques supplémentaires.
```

**Processus complémentaires :**

```
● Boutons supplémentaires :
○ Signaler une absence :
■ Redirige vers un formulaire où l'utilisateur peut remplir les
détails concernant une absence imprévue d'un Renford
pendant la mission.
○ Champs :
■ Nom complet
■ Absence du (date)
■ Absence au (date)
● Motif de l’absence : Autre mission
imprévue
● Problème de communication
● Problème de disponibilité
● Absence non prévue
● Autre
■ Commentaire
○ Ajuster la durée de la mission
○ Champs :
■ Nom complet
■ Nouvelle horaire de début
■ Nouvelle horaire de fin
■ Motif de l’ajustement :
● Retard du démarrage de la mission
● Problème imprévu nécessitant une
extension
● Prolongation de la durée initialement
prévue
● Changement dans les besoins de la
mission
● Autre
```

```
■ Commentaire
```

**Étape 4 : Déblocage des fonds et paiement automatique**

```
● Déblocage des fonds : une fois la mission validée, le déblocage du règlement de la
mission peut avoir lieu afin d'être réglé au prestataire de la mission. S’ensuit :
○ La notification du paiement au Renford, avec la facture pour services
associé, et une attestation de mission.
○ La notification de l’envoi des fonds à l'établissement, avec une Facture
finale pour services et commissions ( annexe 10 ) et une attestation de
réalisation de mission ( annexe 10 ) + l’attestation de vigilance du Renford
(obligatoire si la mission dépasse les 5 000 euros).
```

Pour récapituler le processus de paiement :

**Étape 5 : Suivi et archivage**

```
● Mise à jour du tableau de bord : l'établissement voit ses informations mises à jour
sur son tableau de bord, y compris les détails des paiements et les évaluations de
la mission et la mise à jour de ses favoris (si applicable). Le profil du Renford est
mis à jour avec la nouvelle mission, l'évaluation reçue, et les statistiques de
performance.
● Archivage des documents : tous les documents associés à la mission, y compris les
bordereaux de paiement sont archivés pour consultation future.
```

**\*Renford COACH (missions longue durée)**

**Étape 1 : Définir les critères de mission**

L’utilisateur remplit un formulaire multi-étapes détaillant :

```
● Établissement concerné
● Poste souhaité (coach, animateur, etc.)
● Date de la mission
● Diplôme ou certification requis (optionnel)
● Nombre de personnes à encadrer
● Niveau du cours
● Plages horaires (heures précises par jour)
```

```
● Méthode de tarification (horaire, à la prestation, dégressif selon nombre de
participants)
● Notes de frais prise en charge ou pas
● Description libre de la mission
```

**Étape 1.2 : Récapitulatif de mission**

Une page récapitulative avec le prix de la mise en relation permet de relire et valider la
demande. L’utilisateur peut modifier les champs avant validation finale.

### Étape 1.3 : Paiement sécurisé différé

Dès validation de la mission, l’établissement procède **immédiatement** au paiement via
Stripe. Toutefois, les fonds sont **sécurisés et non capturés tant que la mission n’est pas
confirmée** (contrat signé et Renford validé). Cela permet à l’équipe Renford de chercher
un intervenant en toute sérénité tout en engageant l’établissement.

**Étape 2 : Shortlist interne**

L’algorithme (ou agent IA?) sélectionne automatiquement 1 à 3 profils pertinents. Les
profils sont visibles dans la fiche mission et l’établissement est notifié.

Les profils sont affichés à l’établissement dans une interface dédiée avec :

```
● Photo, type de poste, expertise (attention, pas de nom ni prénom ni tout moyen de
contact!)
● Expériences passées / diplômes / évaluations antérieures
● Option de visio pré-mission pour échange entre établissement et intervenant (un
lien de visio est généré automatiquement via un outil comme Calendly)
```

**Étape 3 : Choix du Renford par l’établissement**

L’établissement peut programmer une visio avec LE Renford shortlisté pour poser ses
questions (attention, inclure Renford dans la boucle, dans l’idée, nous aimerions être
présents). Il a la possibilité d’accepter ou de refuser les profils un par un via l’interface et
ne peut sélectionner qu’un profil pour la Visio. Une fois le profil validé (réciproquement)
après la Visio :

```
● Génération du contrat de prestation avec clause de préavis (15 jours minimum côté
Renford).
● Envoi pour signature électronique (ex : PandaDoc ou DropBox).
```

**Étape 4 : Paiement**

```
● Après signature du contrat, les fonds sont débloqués et Renford peut recevoir le
paiement.
● Les informations complètes de facturation sont alors demandées à l’établissement :
IBAN, nom de facturation, adresse, SIRET, etc.
● La mission s’affiche dans les deux espaces (établissement et intervenant)
● L’établissement ne peut plus consulter les autres profils proposés.
● Notifications calendaires et rappels sont activés
```

**Étape 5 : Confirmation et suivi de mission**

- Le Renford reçoit toutes les informations de contact concernant la mission et
  l’établissement. L’idée est de laisser les deux parties échanger indépendamment de
  Renford.
- La mission s’affiche dans les deux espaces (établissement et intervenant)
- Les documents sont disponibles dans la fiche mission

**Étape 6 : Clôture de la mission**

À la fin de la mission :

- Évaluation du Renford et du client souhaité
- Génération des documents : facture finale, contrat de prestation signé.

Ce processus assure sécurité, qualité et fiabilité pour les deux parties. Il permet
également à Renford de garantir un suivi administratif automatisé et la traçabilité
complète de chaque mission.

**1.2 Scénario d’utilisation pour les Renfords (freelancers) -**

**Inscription d’un indépendant sur la plateforme :**

```
● Étape 1 : Connexion à la plateforme
```

```
● Etape 2 : Inscription et création de profil
Après que l’'indépendant se soit inscrit sur la plateforme en fournissant ses
informations de base, il remplit ensuite un profil détaillé, en plusieurs étapes
(pages différentes pour plus de fluidité) :
```

**Étape 1 : Informations générales**

1. **Type de mission (\*)**
   ○ **Choix multiple pour le type de missions** (ex: coach sportif, encadrant
   d'escalade, formateur. _Voir annexe 1 pour le type de mission_ ).
2. **Titre de ton profil (\*)**
   ○ **Champ :** Texte
   ○ **Placeholder :** "Le titre qui apparaîtra ex: Coach & Champion de ..."
3. **Description de ton profil (\*)**
   ○ **Champ :** Texte (Multilignes)
   ○ **Placeholder :** Décris ton parcours, tes passions, et ce qui fait de toi un
   Renford unique.

### Étape 2 : Qualifications et Expérience

1. **Diplôme(s) (\*)**
   ○ **Champ :** Sélection parmi plusieurs options
   ○ **Placeholder :** Mentionne les diplômes pertinents pour renforcer ton profil.
   _Voir annexe 11 pour la liste des diplômes dans le sport._
2. **Niveau d'expérience (\*)**
   ○ **Champ :** Sélection parmi plusieurs niveaux
   ○ **Placeholder :** "Sélectionne ton niveau d'expérience". _Voir annexe 12 pour la_
   _liste des niveaux._
3. **Justificatif diplôme**
   ○ **Champ :** Téléchargement de fichiers
   ○ **Placeholder :** "Une copie de tes diplômes pour un profil 100% vérifié !"
4. **Tarif :** Permettre aux utilisateurs de définir leur tarification de manière flexible,
   que ce soit à l'heure ou à la prestation, tout en assurant une clarté maximale dans
   la saisie des données.
   **1. Tarif horaire (champ affiché par défaut)**
   ● **Label :** "Quel est votre tarif horaire ?"
   ● **Champ :** Texte numérique
   ● **Placeholder :** Exemple : 45 € / heure
   ● **Validation :** 20 € – 200 €

```
● Aide contextuelle : 💡 "Tarif que vous facturez habituellement à l’heure. En IDF,
les débutants tournent autour de 30–45 €, les profils expérimentés jusqu'à 50–80 €."
```

```
1.2. Souplesse tarifaire (jauge de flexibilité)
```

```
● Label : "Seriez-vous prêt·e à accepter une mission légèrement moins rémunérée, si
elle est proche de chez vous, régulière ou dans une salle de confiance ?"
● Champ : Jauge / curseur de tolérance
● Valeurs possibles :
○ 0 % → "Aucune flexibilité (je reste sur mon tarif affiché)"
○ -5 % → "Je peux baisser un peu (ex : 47,50 € si je demande 50 €)"
○ -10 % → "Je suis ouvert·e à étudier selon la mission"
○ -15 % → "Oui, si la mission vaut le coup"
● Aide contextuelle : "Cette info ne sera pas affichée publiquement. Elle nous aide
simplement à mieux cibler les missions qui pourraient vous convenir, même si elles
sont légèrement en-dessous de votre tarif affiché."
```

2. **Tarif à la prestation (optionnel)**
   ● **Case à cocher :** "Je propose aussi un tarif à la prestation (journée ou
   demi-journée)
   ● **Si coché, deux champs s'affichent :**
   ❖ **Demi-journée**
   ● **Champ :** Texte numérique
   ● **Placeholder :** Exemple : 200 €
   ● **Aide :** "Pour une durée de 3–4h environ."
   ❖ **Journée**
3. **Champ :** Texte numérique
4. **Placeholder :** Exemple : 350 €
5. **Aide :** "Tarif fixe pour une journée complète. En IDF, la moyenne est de 200–500 €
   selon les disciplines."

### Étape 3 : Identification et Disponibilité

1. **Carte Pro**
   ○ **Champ :** Téléchargement de fichier
   ○ **Placeholder :** "Une copie de ta carte Pro pour un profil 100% vérifié !”
2. **IBAN**
   ○ **Champ :** Texte
   ○ **Placeholder :** Indique ton IBAN pour que nous puissions te rémunérer pour
   tes missions.
   **3. Attestation de vigilance**
   ○ **Champ :** téléchargement de fichier
   ○ **Placeholder :** “Ton attestation de vigilance URSSAF pour anticiper tes
   missions supérieures à 5000 euros (obligatoire).
   ○ Aide contextuelle : L'attestation de vigilance est une obligation légale
   avant le début de la prestation pour s'assurer que le prestataire est en règle
   avec ses obligations sociales (conformément à l'article L.8222-1 du Code du

```
travail). Cette attestation est fournie par l’URSSAF. Vous pouvez télécharger
vos attestations directement depuis votre espace en ligne sur urssaf.fr.
```

**4. Justificatif d’assurance**

```
● Champ : Téléchargement de fichier
● Placeholder : "Pour assurer tes prestations l’esprit léger! ”
```

4. **Disponibilité**
   ○ **Champ :** Checkbox + Sélection de dates
   ○ **Placeholder :**
   ■ **Checkbox :** "Je suis disponible pour une durée illimitée"
   ■ **Sinon, je suis dispo à partir de :** Sélection de date
   ■ **Jusqu'au :** Sélection de date
   ○ **Description :** Indique tes disponibilités pour les missions, soit de façon
   illimitée, soit en sélectionnant des dates spécifiques.

### Etape 4 : Bouton de Soumission

```
○ Bouton : Envoyer
○ Description : Valide ton inscription pour recevoir tes premières propositions
de mission.
```

**Etape 3 : Mise à jour des metrics**
Une fois le profil du Renford complété et ses diplômes vérifiés par nos soins
(manuellement donc), le profil est marqué comme "Certifié", ce qui améliore sa visibilité
sur la plateforme.

Le Renford est donc pleinement opérationnel et peut être choisi par l’algorithme en cas
de nouvelle mission.

**1.3 Scénario d’utilisation pour les Renfords (freelancers) -**

**Exemple détaillé pour une mission spécifique**

**Exemple : Recrutement d'un encadrant d'escalade pour un événement de deux jours.**

**Etape 1 : Notification de la Mission :**

```
● Action : Le Renford reçoit une notification via email, SMS, et sur son tableau de
bord Renford concernant une nouvelle mission disponible. La notification inclut les
```

```
détails essentiels de la mission : type de poste, durée, lieu, tarif horaire ou à la
prestation, et matériel requis :
```

### 1. Notification par SMS :

```
○ "Nouvelle mission disponible : Encadrant Escalade à Paris, du 14/09 au
15/09. Tarif : 60€/h. Matériel requis : baudrier, chaussons d’escalade.
Accepte la mission sur ton tableau de bord. [Lien vers tableau de bord]."
```

**2. Notification par Email :** L'email peut être plus détaillé que le SMS, tout en étant
structuré de manière claire et lisible. _Voir annexe 13 pour le contenu de l’email._

### 3. Notification sur le Tableau de Bord : Le tableau de bord doit offrir une vue

```
d'ensemble avec une possibilité d'interagir facilement.
```

```
○ Module qui s’affiche de manière automatique dès la connexion du
Renford à son espace personnel :
■ Nouvelle Mission Disponible!
■ Détails :
● Type de poste : Encadrant Escalade
● Lieu : Paris
● Dates : Du 14 au 15 septembre
● Horaires : 9h00 - 18h
● Tarif : 60€/h ou 200€ pour la prestation complète (ou plus
détaillé si tarif dégressif appliqué)
● Matériel requis : Baudrier, chaussons d’escalade
● Attestation de vigilance : à fournir ou pas.
■ Actions :
● [Accepter la mission]
● [Refuser la mission]
■ [Voir plus de détails]
```

**Etape 2 : Acceptation ou Refus de la Mission :**

```
● Interface : Le Renford a la possibilité d’accepter ou de refuser la mission
directement depuis l'interface de son tableau de bord. La mission est également
visible depuis la page/ l’onglet “Mes demandes”.
● Engagement : En cas d’acceptation, le Renford reçoit une confirmation de mission
avec le récapitulatif des détails, ainsi qu’en PJ du mail, le contrat de prestation à
signer. Le mail doit renvoyer à un bouton “J’accepte la mission” pour signer
électroniquement le contrat (via API Docusign/PandaDoc/PDFKit ?). Attention! Si
le Renford n’a pas renseigné ses informations bancaires, il faut ajouter un lien pour
qu’il puisse le faire (indispensable pour être rémunéré et pour générer les
factures).
```

**Etape 3 : Suivi de la Mission :**

```
● Déroulement de la mission : Une fois la mission acceptée, le Renford peut suivre
les étapes de la mission depuis son tableau de bord, qui affiche les dates, les
horaires, et les exigences spécifiques.
● Notifications : Le Renford reçoit des rappels pour les dates clés (début de la
mission, heures de travail, etc.) via email et SMS (?) 1 semaine avant la mission et 2
jours avant.
● Il retrouve dans la section “Mes missions” les détails de toutes les missions en cours
de processus, en cours de réalisation ou qui vont avoir lieu + les missions terminées
/ archivées. Les détails de la mission sont sensiblement les mêmes à chaque fois.
Ci-dessus, un aperçu du détail de la mission sur le site renford.fr :
```

Au niveau des boutons d'action, il convient de les adapter lorsque la mission a été
acceptée ou non. Par exemple, les boutons “Accepter” et “Refuser” devront être affichés
lorsque la mission n’aura été ni acceptée ni refusée. Ensuite, il conviendra de placer en
lieu et place de ces boutons “Signaler un changement” et “Annuler la mission” :

**- Page “Signaler un changement” :**

Cette page permet aux Renfords de signaler des changements urgents ou nécessaires
concernant la mission, mais la décision finale revient à l'entreprise cliente. La page doit
également refléter les conséquences de tels changements pour le prestataire :

1. **Titre de la Page :**
   ○ **Titre :** "Signaler un Changement"
   ○ **Description :** "Signalez ici tout changement nécessaire pour la mission.
   Veuillez noter que les changements doivent être justifiés et seront soumis à
   validation par l'entreprise cliente."
2. **Formulaire de Changement :**
   ○ **Champs du Formulaire :**
   ■ **Type de Changement :**

```
■ Type : Menu déroulant
■ Options :
■ Horaires
■ Date de début
■ Date de fin
■ Lieu
■ Autres (zone de texte)
■ Motif du Changement :
■ Type : Zone de texte
■ Placeholder : "Expliquez pourquoi ce changement est
nécessaire."
■ Justification (facultatif) :
■ Type : Upload de documents justificatifs
■ Placeholder : "Téléchargez un document justificatif si
nécessaire."
```

3. **Avertissement :**
   ○ **Message :** "Tout changement signalé sera soumis à validation par l'entreprise
   cliente. Les modifications non validées peuvent entraîner des conséquences
   sur votre compte."
4. **Boutons d'Action :**
   ○ **Bouton "Soumettre" :** Envoie le formulaire à l'entreprise pour validation. Un
   message de confirmation s'affiche après l'envoi.
   ○ **Bouton "Annuler" :** Retour à la page précédente.
5. **Confirmation d'Envoi :**
   ○ **Message :** "Votre demande de changement a bien été envoyée. Vous serez
   informé de la décision de l'entreprise cliente."

### - Page "Annuler la Mission"

L’objectif est de permettre aux Renfords d'annuler une mission dans des situations
d'urgence, tout en les informant des risques de pénalité en cas d'annulation tardive :

1. **Titre de la Page :**
   ○ **Titre :** "Annuler la Mission"
   ○ **Description :** "En cas d'urgence, vous pouvez annuler une mission ici. Notez
   que des pénalités peuvent s'appliquer en cas d'annulation tardive."
2. **Popup de Confirmation :**
   ○ **Message :** "Vous êtes sur le point d'annuler cette mission. L'annulation sans
   justification 24 heures avant le début de la mission peut entraîner une
   suspension de votre compte. Confirmez-vous cette action ?"
   ○ **Boutons :**
   ■ **"Confirmer l'Annulation” :** Redirige vers la page d'annulation.
   ■ **"Retour" :** Ferme le popup et retourne à la page précédente.
3. **Formulaire d'Annulation :**
   ○ **Champs du Formulaire :**
   ■ **Raison de l'Annulation :**

```
■ Type : Menu déroulant
■ Options :
■ Maladie
■ Problème personnel
■ Conflit d'horaire
■ Autres (zone de texte)
■ Commentaires supplémentaires :
■ Type : Zone de texte
■ Placeholder : "Expliquez brièvement la raison de
l'annulation."
```

4. **Avertissement :**
   ○ **Message :** "En cas d'annulation tardive ou sans motif valable, des pénalités
   peuvent être appliquées, incluant une suspension temporaire de votre
   compte."
5. **Boutons d'Action :**
   ○ **Bouton "Annuler la Mission" :** Envoie la demande d'annulation. Un message
   de confirmation s'affiche après l'envoi.
   ○ **Bouton "Retour" :** Retour à la page précédente.
6. **Confirmation d'Annulation :**
   ○ **Message :** "Votre mission a été annulée. Un email de confirmation a été
   envoyé à l'entreprise cliente."

```
Commentaires supplémentaires sur ces deux pages :
```

```
● Limites et contrôles : Le système doit s'assurer que les Renfords ne peuvent pas
modifier les détails critiques de la mission sans validation. La possibilité de signaler
un changement doit être utilisée avec parcimonie, en particulier avec des contrôles
supplémentaires pour éviter les abus.
● Communication : En cas de désistement, un email automatique peut être envoyé à
l'entreprise cliente pour minimiser l'impact et débuter le processus de recherche de
remplacement.
```

**Étape 4 : Pendant la Mission - Suivi de la Mission en Temps Réel**

```
● Tableau de Bord du Renford :
○ Vue d’ensemble : Le tableau de bord affiche les missions en cours avec les
détails essentiels tels que le type de mission, l'établissement, la durée, les
horaires journaliers, et les informations de contact de l'établissement.
○ Statut de la Mission : Le statut de la mission est mis à jour en temps réel
pour refléter l'évolution de la mission (en attente, en cours, terminée).
○ Notifications Automatiques :
■ Rappels journaliers : Des rappels automatiques sont envoyés au
Renford chaque matin de la mission, avec un résumé de l'agenda du
jour (horaires, lieu, matériel requis).
```

```
■ Alertes de fin de mission : À l'approche de la fin de la mission, une
notification est envoyée pour rappeler au Renford de vérifier que
tout est en ordre et qu'il n'y a pas de besoins supplémentaires de
l'établissement.
● Communication avec l'Établissement :
```

La communication avec l'établissement n’est pas possible dans cette V1. Il sera donc
crucial dans un premier temps d’afficher les coordonnées de contact de l’équipe support
de Renford et notamment :

```
○ Adresse mail : contact@renford.fr
○ Interlocuteur : L’équipe Renford
○ Téléphone en cas d’urgence : 06 25 92 27 70 (changement à venir)
```

```
● Validation des Heures Travaillées :
○ Validation automatique : Si la mission s'est déroulée sans incidents, les
heures sont validées automatiquement.
○ Ajustements manuels : Si nécessaire, le Renford peut signaler des
ajustements via la page dédiée.
```

**Étape 5 : Clôture de la Mission et Questionnaire de Fin de Mission**

```
● Clôture de la Mission :
○ Validation par l'établissement : L’établissement confirme que la mission a
été réalisée conformément aux attentes.
○ Questionnaire de fin de Mission : Le Renford évalue la mission via un
questionnaire.
○ Contenu du Questionnaire :
■ Qualité du travail réalisé : Évaluation de la qualité globale du
service fourni avec une évaluation par étoiles.
■ Recommandation de l'établissement : "Recommanderiez-vous cet
établissement à d'autres personnes ?" (Oui / Non)
■ Problèmes rencontrés : Champ texte enrichie pour décrire tout
problème rencontré durant la mission.
■ Aspects les plus satisfaisants : Liste déroulante à choix multiple :
● Qualité du travail réalisé
● Professionnalisme de l'équipe
● Respect des délais
● Communication efficace
● Adaptabilité aux besoins spécifiques
● Compétences techniques/expertises
● Collaboration harmonieuse avec l'équipe existante
● Clarté des instructions fournies
● Résolution rapide des problèmes
```

```
● Valeur ajoutée apportée à la mission
■ Satisfaction de la plateforme Renford : Évaluation par étoiles.
■ Commentaires supplémentaires : Champ texte pour ajouter des
remarques.
○ Notifications et Rappels :
■ Le questionnaire sera envoyé par mail à J+1 la fin de mission. Un
rappel à J+2 et à J+5 sera envoyé par mail en cas de non complétion.
De même, la non complétion sera rappelée sur le tableau de bord de
l’utilisateur.
```

**2. Validation et Paiement :**

```
● Validation de la mission :
○ Confirmation du travail effectué : L'établissement confirme que la mission
a été réalisée conformément aux attentes.
○ Ajout de commentaires : L'établissement peut fournir des commentaires
supplémentaires sur la mission.
● Paiement (via Stripe donc) :
○ Une fois la mission validée par l’établissement, le paiement est
automatiquement déclenché. Le Renford reçoit le montant convenu sur son
compte bancaire. Un bordereau de paiement est généré et envoyé à toutes
les parties pour archivage. De même, le prestataire reçoit la facture en son
nom et à destination de Renford, avec une attestation de mission.
```

```
exemple actuel sur renford.fr du détail d’une mission terminée
```

### 2. Fonctionnalités Avancées / Principales...................................

```
2.1 Priorités Hautes
```

### 1. Matching Intelligent Renford (IA + logique modulaire)

Objectif : Proposer automatiquement les intervenants les plus pertinents selon les besoins
d’une structure, en tenant compte de critères qualitatifs et contextuels. L'approche n'est
pas celle d'une marketplace ouverte, mais d'un outil de mise en relation filtrée et
qualitative.

Méthode :

```
● Matching par IA conversationnelle (agent intelligent équipé des règles métier) dans
un premier temps, évolutif vers un scoring algorithmique pondéré.
● Reprise du matching possible par des développeurs grâce à une architecture lisible,
modulaire, documentée.
```

Critères utilisés :

```
● Type de mission et compétences requises
● Checking Favoris : priorité aux Renfords favoris de l’établissement
● Expérience et historique de missions similaires
● Disponibilités croisées (demande vs agenda Renford)
● Localisation (commune, départements limitrophes)
● Tarifs (avec gestion des tarifs horaires, forfaits et tarifs dégressifs)
● Autres critères personnalisables : diplômes, expérience spécifique, sensibilités
(pédagogie, public fragile...)
```

Fonctionnement UX :

```
● L’utilisateur entreprise remplit un besoin, l’agent IA traite les critères, puis notifie
les Renfords concernés
● Les profils disponibles apparaissent dans l’espace entreprise, avec option de visio /
contact / validation
```

### 2. Génération & Envoi Automatique de Documents par IA

Objectif : Décharger les utilisateurs de toute charge administrative en automatisant et
personnalisant les documents (factures, contrats, attestations).

Fonctionnalités :

```
● Génération et envoi des contrats (comme cité précédemment, avec Yousign ect)
● Génération des factures à partir des données mission + profil via le format
conforme à la mesure 2026 sur la facturation électronique (format facture-X)
```

```
● Intégration possible d’API (Connexion aux Plateformes de Dématérialisation
Partenaires (PDP) ou au Portail Public de Facturation (PPF)) pour la transmission
automatique des factures certifiées et conformes.
● Génération de l’attestation de mission (simple PDF avec quelques champs max)
● Historisation dans la fiche mission
```

### 3. Espace Personnel (Entreprise / Renford)

Objectif : Offrir une vision 360° claire, actionable et centralisée

Fonctionnalités Clés :

```
● Missions (passées / en cours / à venir)
● Documents liés (contrat, attestation, facture...)
● Statistiques : CA, nombre de missions, taux de satisfaction
● Notifications : rappels URSSAF, validation à effectuer, documents à signer
● Historique / messagerie (v1 ou v2)
```

### 4. Gestion Dynamique du Temps (Calendrier)

Objectif :

Fluidifier la planification, synchroniser les parties prenantes

Fonctionnalités :

```
● Vue calendrier unifiée par utilisateur (missions, échanges prévus, deadlines)
● Gestion de disponibilités par les Renfords (module simple)
● Intégration Google Calendar pour visios et rappels
● Historique filtrable avec commentaires/notes internes
```

### 5. Système de Paiement Intégré + Garantie Sécurité

Objectif : Fluidifier la transaction en assurant la sécurité et la ponctualité des paiements

Fonctionnalités :

```
● Stripe Connect
● Vérification KYC (si nécessaire)
● Paiement automatique à validation mission + attestation
● Envoi de facture + preuve de paiement archivée dans la mission
```

### 6. RGPD & Sécurité

```
● Audit RGPD (fichiers, mails, stockage)
● Gestion des droits / consentement
● Cryptage des données sensibles
● Suppression / anonymisation automatique des données inutilisées
```

**2.2 Priorités Moyennes**

**1. Notifications et Alertes**

Système d’alertes multi-canaux (email, tableau de bord) pour :

```
● Nouvelles missions disponibles
● Changement de statut d'une mission
● Signature de contrat
● Rappel d’action à effectuer
● Suivi des paiements
```

**2.3 Priorités Basses**

### 1. Intégrations Complémentaires (GTM, Consent Manager, Analytics)

```
● Connexions prévues avec les outils d'analyse, consentement et gestion SEO (voir
Annexe 18)
```

## II) Description Technique...........................................................

**_Introduction sur le nom de domaine_**

Le nom de domaine principal _renford.fr_ est déjà configuré et hébergé sur OVH, avec un
espace d'hébergement et une adresse e-mail associée (contact@renford.fr). Ce domaine
est actuellement utilisé pour héberger le MVP de Renford.

En complément, les noms de domaine renford.co, renfordblog.fr, et renfordblog.com ont
également été acquis à titre préventif.

**4.1. Architecture Logicielle :**

La plateforme Renford doit être développée selon une architecture logicielle robuste et
évolutive, permettant une maintenance facile et des mises à jour régulières. Voici les
principales technologies à utiliser :

```
● Front-End : La partie front-end sera développée en utilisant React.js ou Vue.js ,
qui sont des frameworks modernes et performants, offrant une expérience
utilisateur fluide. Ces frameworks permettent également une bonne gestion des
états complexes et une réutilisation efficace des composants.
● Back-End : Le back-end sera construit sur Node.js avec un framework comme
Express.js ou NestJS pour une gestion efficace des API et des processus
asynchrones. Node.js est bien adapté aux applications nécessitant une forte
scalabilité.
● Base de données : Utilisation de PostgreSQL pour sa robustesse, sa conformité
ACID, et ses capacités avancées de requête. Pour des fonctionnalités nécessitant un
traitement rapide et une faible latence, comme le caching, Redis sera intégré.
● Architecture du Système : Une architecture RESTful sera utilisée pour le
développement des API, permettant une interopérabilité facile avec d'autres
systèmes. Le système sera hébergé sur des serveurs cloud comme AWS ou Google
Cloud pour assurer la scalabilité et la résilience de la plateforme.
● API à intégrer :
○ Gestion des paiements : Utilisation de Stripe pour la gestion des
paiements.
○ Signature électronique des documents : API avec Docusign/ PDFKit /
PandaDoc pour automatiser et simplifier la signature des contrats de
prestation entre Établissements et indépendants.
```

**4.2. Portage des Données Utilisateurs**

Ce processus vise à transférer de manière fluide et sécurisée les données existantes
des utilisateurs actuels depuis le MVP vers le nouveau site internet. Il est crucial de

préserver l'intégrité des informations et de garantir une transition sans interruption pour
les utilisateurs.

**Objectifs :**

```
● Préserver toutes les données utilisateurs actuelles (profils, historiques de missions,
documents, etc.).
● Assurer la continuité du service sans perte d'informations.
● Informer les utilisateurs du changement et de la transition à venir.
```

**Étapes clés :**

1. **Analyse des données existantes :**
   ○ Identifier toutes les données à migrer (informations de profil, missions en
   cours/terminées/ archivées etc.).
   ○ Vérifier la compatibilité des formats de données entre le MVP et la nouvelle
   plateforme.
2. **Exportation des données :**
   ○ Extraction des données utilisateurs actuelles dans un format adapté (CSV,
   JSON, XML, etc.) pour faciliter l'importation sur la nouvelle plateforme.
3. **Sécurisation des données :**
   ○ Utiliser des techniques de chiffrement pour protéger les données sensibles
   (mots de passe, informations personnelles).
   ○ Garantir que les données ne soient accessibles que par des utilisateurs
   autorisés.
4. **Importation sur le nouveau site :**
   ○ Importer les données sur la nouvelle base de données avec vérification de la
   cohérence des informations.
   ○ Réaliser des tests pour s’assurer de la validité des données importées
   (conformité des informations, absence de doublons).
5. **Validation et test :**
   ○ Effectuer des tests utilisateurs sur un échantillon pour vérifier la fluidité de
   la migration.
   ○ Vérifier que les utilisateurs peuvent se connecter avec leurs informations
   actuelles et que toutes leurs données sont bien accessibles.
6. **Notification aux utilisateurs :**
   ○ Envoyer une communication à l'ensemble des utilisateurs pour les informer
   de la transition et des possibles impacts (date de migration, période
   d'indisponibilité, etc.).

**Notes Techniques :**

```
● Prévoir des outils de rollback pour restaurer l’état précédent en cas de problème
lors de la migration.
● Tester la performance de la nouvelle plateforme avec les données migrées pour
s'assurer qu'elle supporte la charge.
```

**4.3. Exigences de Performance :**

La performance de la plateforme Renford est un facteur clé de succès. Les objectifs de
performance incluent :

```
● Temps de Réponse : Le temps de réponse des API ne doit pas dépasser 200 ms en
conditions normales de charge.
● Charge Maximale : La plateforme doit être capable de gérer au moins 10 000
utilisateurs simultanés sans dégradation de la performance.
● Mises à jour en temps réel : Les mises à jour critiques, telles que l'acceptation des
missions, doivent être traitées en temps réel.
```

**4.4. Sécurité :**

La sécurité est primordiale pour protéger les données des utilisateurs et garantir la
conformité réglementaire.

```
● Conformité RGPD : Tous les aspects de la gestion des données personnelles doivent
respecter le RGPD. Cela inclut la mise en place de mécanismes de consentement
explicite pour la collecte de données, l'accès sécurisé aux données personnelles, et
la possibilité pour les utilisateurs de demander la suppression de leurs données
(Connexion Consent manager fournie).
● Sécurité des Données : Les données sensibles (comme les informations de
paiement) doivent être chiffrées à l'aide de AES-256. L'authentification doit être
sécurisée avec des mécanismes comme l'authentification à deux facteurs (2FA) pour
les accès critiques.
● Protection contre les attaques : Utilisation de firewalls pour protéger contre les
intrusions et de services de détection d'intrusion (IDS) pour surveiller toute activité
suspecte. Un plan de réponse aux incidents doit être mis en place pour traiter
rapidement toute violation de sécurité.
```

**4.5. Scalabilité :**

La plateforme Renford doit être conçue pour évoluer facilement avec la croissance de
l'entreprise :

```
● Scalabilité Horizontale : Les services seront conteneurisés avec Docker et
orchestrés avec Kubernetes pour permettre une mise à l'échelle horizontale en
ajoutant plus de nœuds au fur et à mesure de l'augmentation de la charge.
● Prévision des besoins futurs : Des outils de monitoring comme Prometheus et
Grafana seront utilisés pour surveiller les performances du système et prévoir les
besoins futurs en ressources.
```

## III) Design et Interface Utilisateur................................................

### 3.1 Page d'accueil

**Description :** La page d'accueil est la première impression que les utilisateurs auront du
site Renford. Elle doit être à la fois engageante et informative, tout en étant simple à
naviguer.

_Objectif_ : Donner une vue d'ensemble des services proposés par Renford, avec un accès
rapide aux fonctionnalités principales comme la recherche de missions et la gestion de
profil.

**Éléments à inclure :**

```
● Bannière principale : Présente un message accrocheur avec un appel à l'action
(CTA) pour s'inscrire ou se connecter. Une animation légère peut être ajoutée pour
attirer l'attention.
● Présentation des fonctionnalités clés : Un aperçu rapide des services proposés par
Renford avec des icônes explicatives.
● Témoignages utilisateurs : Avis et témoignages en carrousel pour renforcer la
crédibilité. Ceux-ci peuvent être extraits d'utilisateurs existants pour donner un
aspect de validation sociale.
● Section d'actualités et blog : Aperçu des derniers articles ou nouvelles concernant
le secteur sportif avec un lien direct vers les articles complets.
● Une FAQ ( pour le contenu, voir Annexe 14 )
● Pied de page : Incluant des liens vers les mentions légales, les CGU, et les réseaux
sociaux de Renford, ainsi qu’un formulaire de contact rapide.
```

### 3.2 Page d'inscription

**Description :** Page permettant aux nouveaux utilisateurs de créer un compte sur Renford.

**_CHOIX 1 : Créer une page d’inscription commune pour les Renfords et les
établissements._**

**Éléments à inclure :**

```
● Formulaire d'inscription : Comprend des champs pour choisir le type de compte
(Renford ou établissement), nom, prénom, Raison sociale (si Établissement), email,
mot de passe. Il faut également prévoir un champ à cocher pour accepter les
CGV/CGU et la Charte de confidentialité. Chaque champ doit être facilement
identifiable avec des aides contextuelles pour guider l’utilisateur.
```

```
● Option de connexion : lien vers la page de connexion.
● Captcha de sécurité : Pour éviter les inscriptions automatiques et renforcer la
sécurité.
● Mail de bienvenue : envoyé après une inscription réussie, confirmant la création
du compte et offrant des conseils pour commencer. (Voir annexe 15)
```

**_CHOIX 2 : Créer une page d’inscription distincte pour les Renfords et les
établissements._**

Le contenu reste le même, hormis que pour la page de connexion des Renfords, le champ
“Raison sociale” n'apparaîtra pas.

### 3.3 Page de connexion

**Description :** Page permettant à tous les utilisateurs existants de se connecter à leur
compte.

**Éléments à inclure :**

```
● Formulaire de connexion : Champs pour email et mot de passe avec la possibilité
de visualiser le mot de passe saisi.
● Option "Mot de passe oublié" : Un lien pour réinitialiser le mot de passe, qui
déclenche l’envoi d’un email de récupération.
● Option “Pas encore de compte? S’inscrire sur Renford” avec un lien qui renvoie
vers la page de connexion.
● Connexion via réseaux sociaux : Google, Facebook, etc., pour offrir plus de
flexibilité à l'utilisateur.
```

### 3.4 Tableau de Bord (Dashboard)

**Description :** Page centrale où l'utilisateur peut gérer ses activités et visualiser ses
données clés. Attention, **le ChatBot Hubspot doit apparaître sur le profil dès la
connexion de l’utilisateur.**

**_3.4.1 Tableau de bord pour les Établissements :_**

```
❖ Bordereau Rouge en Haut (Alerte) :
● Alerte de mission en attente : Un bandeau rouge en haut du tableau de bord
apparaît lorsque l'utilisateur a une action en attente, par exemple, la signature
d'un contrat ou la validation d'une mission.
❖ Vue d'ensemble des Missions :
```

```
● Tableau des missions : Présente les missions actives, les missions terminées, et les
missions en attente de signature. L'utilisateur peut cliquer pour voir plus de détails
ou gérer les missions en cours.
● Missions en cours : Un compteur indiquant le nombre de missions actuellement en
cours avec un lien pour voir les détails ou gérer chaque mission.
❖ Statistiques de Performance :
● Récapitulatif des performances : Affichage des métriques clés comme le nombre
de missions effectuées, le chiffre d'affaires généré, le taux de satisfaction des
clients, le nombre d’heures de renford effectué.
● Mes Renfords en favoris : section affichant les Renfords que l’établissement
souhaite contacter en 1er lorsqu’elle fait une demande de mission. Affichage du
profils des Renfords + bouton qui renvois sur le page “gestion des favoris”.
❖ Agenda :
● Vue Calendrier : Montre les missions planifiées, les échéances importantes, et les
disponibilités.
❖ Avis sur les Missions :
❖ Dernières missions effectuées : Une section dédiée où les utilisateurs peuvent voir
leurs dernières missions effectuées avec la possibilité de laisser un avis.
❖ Encouragement à laisser un avis : Une notification ou un rappel sur le tableau de
bord incitant l'utilisateur à évaluer ses expériences récentes.
❖ Bons plans :
```

Page avec la liste des bons plans de nos partenaires.

```
❖ Mises à jour de la plateforme :
● Notifications & Mises à jour : Une section pour les notifications, les mises à jour
récentes de la plateforme, et les nouvelles fonctionnalités ajoutées.
❖ Accès Rapide aux Fonctionnalités :
● Raccourcis Fonctionnalités : Accès rapide aux fonctionnalités les plus utilisées
comme l'édition du profil, la gestion des établissements, la recherche de missions,
et l'ajout de profils favoris.
❖ Section Aide & Support :
● Page “Support” : FAQ, formulaire prise de contact avec un conseiller.
```

```
Exemple de Dashboard côté entreprises (via malt.fr)
```

**_4.4.2 Tableau de bord pour les Renfords :_**

```
❖ Bordereau Rouge en Haut (Alerte)
● Alerte de Nouvelle Mission : Un bandeau rouge apparaît en haut du tableau
de bord lorsqu'une nouvelle mission correspondant aux critères du Renford
est disponible. L'utilisateur est invité à consulter les détails de la mission et
à accepter ou refuser l'offre.
❖ Vue d'ensemble des Missions
● Tableau des Missions Actives : Liste des missions en cours, avec des
indicateurs de progression (ex. : 50% terminé). L'utilisateur peut cliquer
pour voir les détails, suivre les étapes restantes, ou contacter
l'établissement.
● Missions Terminées : Historique des missions terminées, avec un accès
rapide aux avis reçus et aux informations de facturation (facture, devis..).
● Missions en Attente : Liste des missions en attente de validation, avec des
boutons pour accepter, refuser ou discuter les termes.
❖ Statistiques de Performance
○ Résumé des performances : Affichage des indicateurs clés comme le nombre
de missions effectuées, le CA total généré, les heures de travail réalisées,
le taux de satisfaction des établissements, Objectifs personnalisés : Section
permettant de définir des objectifs personnels (ex. : atteindre 10 missions
par mois) avec un suivi des progrès.
❖ Gestion des paiements
○ Gestion du solde : Affichage clair du montant total des revenus en attente
de paiement, des revenus dernièrement payés et les revenus générés sur les
12 derniers mois.
```

❖ **Gestion de l'Emploi du Temps**
○ Vue calendrier : montrant les missions planifiées, les périodes de
disponibilité et d’indisponibilité définies et les échéances importantes. Les
utilisateurs peuvent facilement ajuster leurs disponibilités.
○ Notifications d'agenda : Rappels automatiques pour les missions à venir et
les deadlines.

```
Interface malt.fr pour freelancers : la fonctionnalité en haut à droite est très
intéressante et permet à la fois de visualiser les disponibilités tout en pouvant
directement les modifier de façon simple et intuitive.
```

```
Exemple pour demander les indisponibilités des freelances (via Brigad.co)
```

❖ **Avis et Feedback**
○ Réception des Avis : Interface dédiée aux avis reçus des établissements,
avec des options pour répondre aux commentaires ou demander une
révision si nécessaire.
○ Évaluation des Missions : Invitation à évaluer les missions une fois
terminées, en se basant sur des critères tels que la clarté des instructions
et la collaboration avec l'établissement.
❖ **Mises à Jour et Notifications**
○ Actualités de la plateforme : Notifications sur les mises à jour récentes,
nouvelles fonctionnalités ou améliorations de la plateforme Renford.
○ Alertes personnalisées : Alertes spécifiques à l'utilisateur, telles que
l'expiration prochaine des certifications, de l’attestation de vigilance à
mettre à jour ou la nécessité de mettre à jour le profil.

_Exemple d’alerte & de notification user friendly (peut donc remplacer le bandeau rouge
et la section “Notification”) - via brigad.co._

```
❖ Accès Rapide aux Fonctionnalités
○ Raccourcis Fonctionnalités : Accès direct aux fonctionnalités essentielles
comme l'édition du profil, la gestion des documents administratifs, la
consultation des formations disponibles, et l'accès aux préférences de
mission.
○ Support Technique : Lien direct vers le support technique, incluant une FAQ
détaillée, une option pour ouvrir un ticket d'assistance, et un chat en direct
avec un conseiller.
```

```
Exemple de Dashboard côté freelances (via malt.fr)
```

**_3.4.1 Menu latéral gauche du Tableau de bord :_**

Le tableau de bord de Renford doit comporter un menu latéral gauche conçu pour offrir
une navigation intuitive et rapide entre les différentes sections de la plateforme. Ce menu
doit rester visible et accessible depuis n'importe quelle page du tableau de bord afin de
maximiser l'efficacité de l'utilisateur. Il doit inclure les éléments suivants :

```
❖ Accès “Tableau de bord”
❖ Mon profil
❖ “Mes missions”
➢ En cours
```

```
➢ A venir
➢ Terminées (ou archivées)
```

**Objectif :** Ces deux items permettent de suivre efficacement une mission en cours ou à
venir notamment pour suivre la signature d’un contrat, l’attente du paiement, la
validation, la notation...

```
➢ Notes de frais
```

A voir si possibilité de créer l’onglet avec un tag “à venir”?

```
➢ Questionnaire de fin de mission
```

```
❖ Messagerie
```

A voir si possibilité de créer l’onglet avec un tag “à venir”?

```
❖ Profil & paramètres
```

```
Objectif : Permettre aux utilisateurs de gérer et modifier leurs informations
personnelles, ajuster les paramètres de leur compte.
```

```
Fonctionnalités : Accès à gestion des préférences de notification, et
paramètres de confidentialité + possibilité de supprimer son compte (RGPD)
(pour cela, demander confirmation de suppression et récolter le motif de la
volonté de quitter le site (voir ici l’actuel formulaire :
https://share-eu1.hsforms.com/1aCHlR0M-TNWOW_qxBQHN_Q2dy3od).
```

```
❖ Assistance et Support
```

```
Page classique avec FAQ + formulaire de contact
```

### 3.5 Page de Profil Utilisateur

```
3.5.1. Page de profil Renfords
```

En-tête du Profil :

```
● Nom et Photo de Profil :
○ Grande image ronde pour la photo de profil.
○ Nom complet de l’utilisateur affiché en grand.
○ Un bouton "Modifier" pour changer la photo et les informations de base.
```

Résumé du Profil :

```
● Titre du profil (ex : “Champion olympique de judo”)
● Titre Professionnel :
Affiche le type de mission de l'utilisateur, comme "Coach Sportif", "Professeur de
```

```
Pilates" ou "Enseignant APA".
Ce champ est à sélection multiple et s’appuie sur une liste référencée (voir
annexe 2).
● Spécialité(s) :
Lorsqu’un type de mission est sélectionné, un champ Spécialité s’affiche
dynamiquement, proposant une liste déroulante adaptée au poste (ex : pour
Pilates → Matwork , Reformer , Séniors , etc.). (voir aussi Annexe 2)
L’utilisateur peut sélectionner plusieurs spécialités.
● Résumé rapide :
○ Brève description de l'utilisateur, ses compétences principales, et son
expérience professionnelle.
● Disponibilité :
○ Affichage de la disponibilité actuelle (ex: Disponible, Indisponible) avec la
possibilité de la modifier.
○ Un bouton pour "Confirmer ou Modifier la Disponibilité".
● Tarification indicative par heure ou par jour (ou dégressivité) sous le titre.
● Niveau d’expérience (voir aussi en annexe pour les différentes catégories
d’expérience).
```

Informations Personnelles :

```
● Détails de Contact :
○ Email, numéro de téléphone, et localisation.
○ Options pour modifier ou masquer certaines informations de contact.
○ Numéro SIRET
○ Champ “Je certifie sur l'honneur d'avoir une Assurance RC Pro” coché +
champ Fichier pour ajouter un justificatif.
○ Carte ID (justificatif)
● Paramètres du Compte :
○ Modification du mot de passe, gestion des notifications, acceptation des
services tiers (Stripe, DocuSign ou autres ?)
```

Expériences Professionnelles :

```
● Historique des Missions :
○ Liste des missions précédentes, avec une brève description, le nom de
l’établissement, et la durée.
○ Option pour ajouter de nouvelles missions ou éditer les existantes.
● Avis et Évaluations :
○ Affichage des évaluations reçues pour chaque mission.
○ Possibilité de demander de nouvelles recommandations.
```

Compétences et Certificats :

```
● Ensemble de Compétences :
○ Liste des compétences clés avec possibilité d’ajouter jusqu’à 5
compétences principales.
○ Un bouton "Ajouter une compétence" pour enrichir le profil.
```

```
● Certifications et Formations :
○ Espace dédié pour afficher les certifications obtenues et les formations
suivies.
○ Un bouton "Ajouter une certification ou formation" pour mettre à jour cette
section.
○ Un bouton pour ajouter un justificatif de formation / certification obtenu.
● Attestation de vigilance
```

Préférences de Mission :

```
● Types de Missions Acceptées :
○ Paramètres pour choisir les types de missions préférées (ex: Coaching
individuel, Sessions en groupe : voir annexe 16. )
○ Tarifs horaires ajustables pour chaque type de mission.
● Localisation et Mobilité :
○ Définir la zone géographique de travail et les préférences de déplacement.
○ Option pour indiquer si l’utilisateur peut travailler à distance ou seulement
en présentiel.
```

Portfolio et Projets :

```
● Galerie de Réalisations :
○ Possibilité d'ajouter des photos, vidéos ou autres médias pour illustrer les
réalisations passées.
○ Chaque élément du portfolio peut être commenté ou tagué avec des
compétences associées.
○ Possibilité d’ajouter un ou des liens vers des pages de réseaux sociaux afin
de rendre disponible la présence en ligne sur Renford.
```

Support et Documentation :

```
● FAQ et Support :
○ Liens directs vers la FAQ, le centre d’aide, ou la prise de contact avec le
support.
○ Un bouton pour signaler un problème ou demander une assistance.
```

Options de Partage :

```
● Partage du Profil :
○ Liens pour partager le profil sur les réseaux sociaux ou via un lien direct.
○ Options pour définir la visibilité du profil (Public, Privé).
```

### 3.5.2. Page de Profil des Établissements

**En-tête du Profil :**

1. **Nom de l'Entreprise (Groupe Principal) :**
   ○ **Grande Police :** Le nom du groupe principal (par exemple, "Groupe
   Neoness") est affiché en grande police.

```
○ Bouton "Modifier" : Permet de changer le nom ou les informations globales
de l'entreprise principale.
○ Logo de l'Entreprise : Image du logo de l’entreprise avec la possibilité de
télécharger ou de modifier le logo.
```

**Gestion des Établissements :**

1. **Liste des Établissements :**
   ○ **Champ déroulant les établissements affiliés :** Liste des établissements
   (principaux et secondaires) rattachés au groupe principal.
   ■ **Colonnes :**
   ■ **Nom de l'établissement** : Affichage du nom spécifique de
   chaque établissement.
   ■ **Adresse** : L'adresse complète de l’établissement.
   ■ **Type d'établissement** : Sélection parmi les types définis
   (salle de sport, centre de fitness, studio de yoga, etc.).
   ■ **Statut** : Indication si l’établissement est actif/inactif.
   ■ **Rôle (Principal/Secondaire)** : Indication du rôle de
   l’établissement dans le groupe.
   ■ **Bouton "Modifier" :** Accès aux détails et à la gestion de chaque
   établissement.
   ■ **Bouton “Supprimer”** : Pour supprimer un établissement secondaire
   de sa liste personnelle.
   ■ **Bouton "+ Ajouter un Établissement" :** Pour ajouter un nouvel
   établissement au groupe.
2. **Formulaire de Détails pour chaque Établissement :**
   ○ **Informations Générales :**
   ■ **Nom de l'établissement** : Le nom spécifique de chaque
   établissement (par exemple, "Neoness République").
   ■ **Adresse** : Adresse complète de l’établissement (rue, code postal,
   ville, pays).
   ■ **Numéro de téléphone :** Contact principal pour l’établissement.
   ■ **Email principal :** L'adresse email utilisée pour les communications
   spécifiques à cet établissement.
   ■ **Contact principal :** Nom complet du Directeur ou Responsable de
   l’établissement.
   ■ **Type d'établissement :** Sélection parmi les types définis (salle de
   sport, centre de fitness, studio de yoga, etc.).
   ● **Établissement Principal :**
   ○ **Case à cocher pour établissement principal :** permet de définir cet
   établissement comme le siège social ou principal.
   ○ **Ordre d'affichage :** si l’établissement est coché comme principal, il
   apparaîtra toujours en premier dans les menus ou listes déroulantes.
   ● **Informations Supplémentaires :**
   ○ **Capacité de l'établissement :** Nombre maximum de clients ou d’utilisateurs
   que l’établissement peut accueillir.
   ○ **Horaires d'Ouverture :** Jours et heures d’ouverture de l’établissement,
   avec la possibilité de définir des heures différentes pour chaque jour.

```
○ Services Offerts : Liste des services proposés dans cet établissement
(coaching personnalisé, cours collectifs, etc.).
○ Certifications : Affichage des certifications ou labels de qualité obtenus par
l’établissement (ex : ISO 9001).
○ Équipements : Détails des équipements disponibles (machines de fitness,
salles de yoga, piscines, etc.).
● Galerie de Photos :
○ Ajout de Photos : Section pour télécharger des photos de l’établissement,
avec une galerie de vignettes.
○ Description des Photos : Possibilité d’ajouter des légendes ou descriptions
pour chaque photo.
```

**Gestion des Renfords en favoris :**

```
● Affectation des Renfords :
○ Liste des Renfords associés : Tableau listant tous les Renfords actuellement
associés à cet établissement (mis en favori).
○ Bouton "Ajouter un profil favori" : Pour rechercher et associer un Renford
à cet établissement.
○ Filtrage et Recherche : Outil de recherche et de filtre pour trouver des
Renfords en fonction de leurs compétences ou disponibilités.
```

**Performance et Statistiques :**

```
● Metric du nombre de missions actuellement en cours dans cet établissement :
avec la possibilité pour l’utilisateur de cliquer pour voir les détails.
● Vue d’Ensemble des Performances :
○ Chiffre d'affaires : Récapitulatif des revenus générés par cet établissement.
○ Nombre de Missions Réalisées : Statistiques sur le nombre de missions
complétées, en cours, et planifiées.
○ Satisfaction Client : Taux de satisfaction basé sur les avis des clients et des
Renfords.
● Rapports Détaillés :
○ Téléchargement de Rapports : Options pour télécharger des rapports
détaillés sur les performances mensuelles, trimestrielles ou annuelles.
○ Graphiques de Performance : Visualisation graphique des données clés,
comme le nombre de missions, les revenus générés, et le taux de
satisfaction.
```

**Paramètres de l'Établissement :**

```
● Personnalisation :
○ Options de Notification : Choix des notifications que le responsable
souhaite recevoir (nouvelle mission, feedback, etc.).
○ Préférences de Mission : Définir les types de missions préférées pour cet
établissement, ainsi que les critères de sélection des Renfords.
● Sécurité et Accès :
```

```
○ Gestion des Accès : Définir qui au sein de l'entreprise peut accéder ou
modifier les informations de cet établissement.
○ Historique des modifications : Suivi des modifications apportées au profil
de l’établissement et par qui.
● Coordonnées bancaires :
○ Possibilité d’accéder à un module pour modifier / ajouter les données
bancaires (IBAN, Nom, Email... détaillé dans la partie processus du présent
document).
● Support et Documentation :
○ Lien vers le Support : Accès direct au support technique, à la FAQ, et à la
documentation pour gérer l’établissement.
○ Guides et Tutoriels : Accès aux ressources pour optimiser l’utilisation de la
plateforme et gérer les établissements efficacement.
```

**Validation et Sauvegarde :**

```
● Boutons d’Action :
○ Sauvegarder les Modifications : Un bouton pour enregistrer toutes les
modifications apportées au profil de l’établissement.
○ Retour au Tableau de Bord : Un bouton pour revenir au tableau de bord
principal des établissements.
```

### NOTE : Différenciation entre établissements principaux et secondaires

### sur le tableau de bord

```
En-tête du Profil pour un Établissement Secondaire :
```

```
● Affiliation : Un champ affichant l'affiliation à l'établissement principal, avec un
lien pour consulter le profil de l'établissement principal.
● Restrictions de Modification : Certaines informations, comme le nom de
l'entreprise principale, ne peuvent être modifiées que par l'administrateur du
groupe principal.
```

```
Gestion des Établissements Secondaires :
```

```
● Affichage prioritaire : L'établissement principal apparaît en premier dans toutes
les listes, suivi des établissements secondaires.
● Gestion déléguée : Les établissements secondaires peuvent avoir des
gestionnaires délégués (= souvent, par exemple, les directeurs d’établissement)
avec des permissions spécifiques, définies par l'administrateur du groupe
principal.
```

_Inscription et Modification pour les Établissements Secondaires :_

```
● Inscription : Lors de l'inscription, les établissements secondaires doivent
sélectionner leur groupe principal. Une vérification est effectuée pour s'assurer
que le groupe principal est déjà inscrit sur la plateforme.
● Modification : Les établissements secondaires peuvent mettre à jour leurs
informations spécifiques, mais les changements globaux (tels que le nom du
groupe principal ou les informations liées au siège social) ne peuvent être
effectués que par l'administrateur du groupe principal. Cela garantit une
cohérence et une centralisation des informations à l'échelle du groupe.
```

```
Résumé des Processus d'Inscription et de Gestion :
```

```
○ Inscription : Le meilleur cas d’usage est que l’établissement principal
s'inscrit en premier, créant le groupe et définissant les informations
globales (nom du groupe, SIRET, etc.). Or, cela ne sera pas tout le temps
le cas, et il faut qu’un établissement secondaire puisse quand même se
créer un compte en prenant en compte qu’il dépend tout de même d’un
établissement principal (établissement à aller prospecter et dont les
informations seront complétées soit de manière automatique si les
informations peuvent être trouvés soit de manière manuelle par notre
équipe).
○ Gestion : L'administrateur du groupe principal gère les établissements
secondaires, configure les permissions, et supervise l'ensemble des
opérations du groupe. En l'absence de l’inscription du groupe principal
existant, l’établissement secondaire dispose de tous les droits.
```

```
Implication dans le Cahier des Charges :
```

```
● Lors de l'inscription, la plateforme doit permettre une distinction claire entre les
établissements principaux et secondaires.
● Le processus d'inscription doit inclure des vérifications pour s'assurer que les
établissements secondaires sont bien affiliés à un groupe principal existant et, le
cas échéant, inscrire le groupe principal dans la base de données afin que
l’établissement secondaire puisse quand même avoir des informations fiables et
pour que nous puissions retrouver les données.
● Les permissions doivent être configurables, permettant aux établissements
principaux de déléguer certaines tâches aux gestionnaires des établissements
secondaires tout en gardant le contrôle global. Attention, en l'absence de
l’inscription d’un établissement principal, l’établissement secondaire dispose de
toutes les permissions.
```

```
Cette distinction entre les établissements principaux et secondaires permet à
Renford de s'adapter aux besoins des grandes chaînes et des groupes d'établissements,
tout en offrant une flexibilité nécessaire pour gérer efficacement chaque entité. En
intégrant ces processus dans le cahier des charges, Renford s'assure de fournir une
solution complète et adaptée à ses clients, quelle que soit la taille de leur réseau
d'établissements.
```

### 3.6 Page de Gestion des Missions

**1. Vue Mission contextualisée selon le profil**

```
● Pour les établissements :
```

```
○ Vue complète de la mission (dates, horaires, profil recherché, tarifs...).
○ Affichage des Renfords proposés (Coach uniquement) ou Renfords affectés
(Flex).
○ Boutons d’action selon le statut :
```

```
■ Voir les profils (Coach)
■ Confirmer le choix / Programmer un échange (Coach)
■ Voir la visio / Télécharger contrat / Attestation (Flex ou accepté)
```

```
○ Affichage conditionnel des documents (facture, contrat, attestation...) dès
qu’ils sont générés automatiquement.
```

```
● Pour les indépendants (Renfords) :
```

```
○ Vue des missions en cours et passées avec filtre par statut.
○ Dans chaque mission : horaires, lieu, établissement, tarif, durée, dates,
etc.
○ Affichage automatique des documents liés à la mission (PDF générés :
contrat, attestation, fiche mission...).
○ Boutons conditionnels selon le statut :
```

```
■ Accepter / Refuser / Échanger avec l’établissement
■ Télécharger documents administratifs
```

**2. Affichage des documents associés dans l’espace “Mission”**

```
● Chaque mission contient une zone dédiée aux documents visibles selon le statut :
```

```
○ Mission acceptée → contrat et attestation visible.
○ Mission terminée → facture disponible.
○ Mission annulée → pas de documents visibles.
```

**3. UX/UI simplifiée**

● Tous les documents sont **rattachés directement à chaque mission**.
● Plus besoin d’un espace Coffre-Fort séparé.
● Accès rapide et structuré par type de mission (Coach / Flex).
● Design homogène et fluide pour tous les profils.

```
Page de gestion des missions sur renford.fr espace Etablissements sportifs
```

```
Page de gestion des missions sur renford.fr espace Indépendants
```

### 3.8 Page de Simulation des Cotisations Sociales

**Description :** Outil permettant aux indépendants de calculer leurs charges sociales.

**Éléments à inclure :**

```
● Formulaire de simulation : L'utilisateur peut entrer ses revenus et voir les
cotisations correspondantes ( le code est partagé dans ce document, en annexe et
plus haut dans le présent cahier des charges ).
● Résultats détaillés : Offre un aperçu des cotisations sociales à payer en fonction
des revenus.
```

```
Capture d’écran de la simulation actuellement disponible sur le site renford.fr.
```

### 3.9. Page Bons plans (Freelances uniquement)

Objectif :Créer une page dédiée, accessible uniquement aux Renfords (freelances),
centralisant des offres négociées, réductions et services partenaires (assurances,
formations, matériel pro, etc.).

Fonctionnalités principales :
**-Affichage dynamique des offres partenaires** (cartes / blocs visuels avec logo,
description, bouton d’accès ou code promo)

**- Filtrage possible** (ex : par type d’offre : juridique, formation, matériel...)

- **Back-office pour ajout / modification / désactivation de partenariats** (accessible via
  l’espace admin)
  **- Visibilité conditionnée** : ce module n’est visible que si l’indépendant invite des amis à
  nous rejoindre!

Exemple de cas d’usage :

- Offre Legalstart : -15% sur la création d’entreprise
- Offre de formation : -10% sur la formation Pilates Reformer de notre partenaire A-lyne
  pilates.
- Matériel sportif pro à tarif préférentiel (partenaire équipementier)

```
Ex de page “Bons plans” depuis le tableau de bord (bpifrance.fr)
```

### 3.10 Page/ Module de Support et FAQ

**Description :** Page ou module fournissant assistance et réponses aux questions fréquentes.

**Éléments à inclure :**

```
● Vidéo tutoriel (sur le modèle de softr.io ci-dessous)
● FAQ
● Formulaire de contact : Pour soumettre des demandes spécifiques ou des
problèmes non couverts par la FAQ.
```

### 3.11 Page de Paramètres/ Gestion du Compte

**Description :** Gestion des paramètres du compte et des préférences de l'utilisateur.

**Éléments à inclure :**

```
● Paramètres de sécurité : Pour modifier le mot de passe, configurer une
authentification à deux facteurs, etc.
● Notifications : Permet de configurer les alertes par email et SMS selon les
préférences de l'utilisateur.
● Possibilité de Suppression du compte (RGPD)
```

```
Exemple parlant d’une page “Paramètres du compte” via superprof.fr.
```

### 3.12 Ergonomie

**Simplicité d'utilisation :**

```
● Navigation intuitive : Menus clairs avec des intitulés explicites pour guider
l'utilisateur. Utilisation d'icônes et visuels pour faciliter la compréhension des
fonctionnalités.
```

```
● Formulaires dynamiques : Pré-remplissage des informations selon les choix de
l'utilisateur pour accélérer les processus.
```

**Clarté des informations :**

```
● Mise en avant : Priorisation des informations essentielles avec des sections bien
délimitées.
● Contraste : Boutons d'action et messages d'alerte en couleurs contrastées.
● Notifications : Affichage en haut de page des alertes importantes pour garantir
leur visibilité.
```

**Fluidité de navigation :**

```
● Réduction des étapes : Simplification des processus (ex. : création/validation
d'une mission) avec le moins d'étapes possible.
● Animations légères : Indicateurs visuels lors du chargement ou du changement de
section pour informer l'utilisateur.
```

### 3.13 Responsive Design

**Compatibilité avec tous les appareils :**

```
● Conception mobile-first : Priorisation de l'expérience mobile, avec une adaptation
pour les écrans plus grands.
● Grille flexible : Ajustement automatique à la taille de l'écran, garantissant une
lisibilité optimale.
● Tests multi-navigateurs : Validation de l'interface sur divers navigateurs et
systèmes d'exploitation pour assurer une compatibilité maximale.
```

**Design et Charte Graphique :**

```
● Typographie : Utilisation de la police Comfortaa, notamment pour les titres afin
d’assurer une lecture agréable.
● Palette de couleurs : Palette actuelle en bleu (HEX 185280) et jaune (HEX FFDD57)
```

→ **Charte graphique** : L’utilisation de Comfortaa, du bleu et du jaune ne sont bien sûr pas
définitifs et nous sommes ouverts à toutes propositions d’idées pour une charte graphique
modernisée, adaptée à l'UX.

### IV. Espace Administrateur

L’espace administrateur est une interface dédiée permettant à l’équipe de Renford de
gérer efficacement la plateforme, les utilisateurs et les abonnements. Cet espace doit
être ergonomique, sécurisé et offrir une gestion centralisée des données critiques.

Objectifs:

```
● Contrôle des utilisateurs : Gestion des indépendants et des établissements (ajout,
suppression, modification des profils, accès aux documents et justificatifs).
● Gestion des abonnements et des tarifs : Modification des offres tarifaires pour les
établissements et suivi des paiements.
● Supervision des missions : Consultation et modification des missions postées,
intervention en cas de litige ou d’erreur.
● Personnalisation du site : Modification du contenu des pages statiques, des
messages d’alerte et de certaines sections de la plateforme sans nécessiter
l’intervention de développeurs.
● Support et assistance : Accès rapide aux tickets de support et interactions avec les
utilisateurs en cas de problème.
● Suivi des performances : Accès aux statistiques clés du site (nombre d’utilisateurs
actifs, missions réalisées, taux d’acceptation, etc.).
● Gestion des documents générés automatiquement : Édition, modification et
personnalisation des modèles de documents (factures, contrats, attestations, etc.).
```

**7.1 Fonctionnalités principales :**

**- Gestion des utilisateurs**

```
● Visualisation de la base d’utilisateurs avec filtres (nom, statut, date d’inscription,
missions en cours, etc.).
● Modification et suppression des utilisateurs.
● Vérification et validation manuelle des diplômes et certifications : possibilité
d’ajouter un macaron “Certifié”, une fois le profil vérifié.
● Gestion des indépendants suspendus ou bannis.
● Ajout manuel de nouveaux utilisateurs en cas de besoin.
```

### - Gestion des missions

```
● Consultation de toutes les missions en cours, passées et à venir.
● Modification ou annulation d’une mission en cas de problème.
● Possibilité d’affecter manuellement un indépendant à une mission si nécessaire.
● Gestion des litiges entre indépendants et établissements.
```

### - Gestion des abonnements et paiements

```
● Modification des tarifs et abonnements proposés aux établissements.
● Activation/désactivation de promotions ou réductions.
● Suivi des paiements via Stripe (transactions, paiements en attente,
remboursements éventuels).
● Accès aux factures et à l’historique des paiements.
```

**- Gestion / Suivi des messages envoyés automatiquement pour la demande de**
**mission**

**7.3 Personnalisation du site et du contenu**

```
● Modification des pages statiques (bons plans, contact, etc.).
● Modification/ ajout/ suppression des paramètres de demande de mission + liées
aux profils indépendant ou établissement (type de mission, type de matériel, tarif
horaires...)
● Gestion des annonces et messages d’alerte sur le tableau de bord des utilisateurs.
● Ajout de nouvelles fonctionnalités sans intervention technique.
```

**7.4 Gestion des documents générés automatiquement**

L’espace administrateur doit permettre la **modification et la personnalisation des
documents générés automatiquement** par la plateforme, tels que :

```
● Factures (possibilité d’éditer le montant, la date, le destinataire...).
● Contrats et attestations (ex : attestation de collaboration, CGU personnalisées...).
● Modèles de documents administratifs (ajout d’un logo, d’une mention légale,
mise en page personnalisable...).
● Ajout manuel de documents pour un utilisateur ou une mission spécifique.
```

Exemple :

```
● Modifier une facture en cas d’erreur.
● Ajouter manuellement un contrat pour une mission hors plateforme.
● Adapter les modèles de documents aux évolutions légales ou aux besoins des
partenaires.
```

**7.5 Support et assistance**

```
● Accès à une interface de gestion des tickets de support.
● Possibilité de contacter directement les utilisateurs en cas de besoin.
● Système de notifications pour les alertes importantes.
```

**7.6 Suivi des performances et statistiques**

```
● Dashboard des statistiques clés : nombre de missions postées, taux d’acceptation,
volume de transactions.
● Analyse des performances des utilisateurs (établissements et indépendants).
● Visualisation des tendances et de l’évolution de la communauté.
```

### Technologies recommandées pour l’espace admin

● **Back-end** : Node.js avec NestJS ou Laravel pour la gestion des accès sécurisés.
● **Base de données** : PostgreSQL ou Supabase avec gestion avancée des logs.
● **Front-end** : React.js / Vue.js pour une interface fluide et moderne.
● **Authentification et Sécurité** : Intégration d’une authentification à deux facteurs
et gestion avancée des permissions.
● **Génération de documents** : Utilisation d’outils comme **PDFKit** pour permettre
l’édition et la personnalisation des documents.

IV. Tests et Validation

La phase de tests et de validation est cruciale pour garantir que la plateforme
Renford fonctionne de manière optimale, répondant aux attentes des utilisateurs tout en
respectant les normes techniques et de sécurité. Cette section détaille les environnements
de test, les types de tests à réaliser, et les critères d'acceptation pour chaque
fonctionnalité.

### 4.1 Environnements de Test...................................................

**Caractéristiques Techniques de chaque Environnement**

1. **Environnement de Développement** :
   ○ **Serveurs** : Un serveur dédié ou une machine virtuelle avec des ressources
   modérées (CPU, RAM) pour permettre aux développeurs de tester en
   continu les nouvelles fonctionnalités.
   ○ **Base de données** : Une base de données légère, souvent locale ou
   contenant des données simulées, pour permettre des tests rapides et
   fréquents sans surcharge.
   ○ **Technologies** : Les mêmes que celles utilisées en production, mais
   configurées de manière plus légère pour favoriser la rapidité des tests.
   ○ **Accès et Permissions** : Les développeurs ont un accès complet à cet
   environnement pour ajuster, tester et déboguer les fonctionnalités.
2. **Environnement de Test d'Intégration** (recette) :
   ○ **Serveurs** : Des serveurs similaires à ceux de l'environnement de production,
   permettant de tester l'interaction entre les différents modules et services.
   ○ **Base de données** : Une base de données de test avec des jeux de données
   plus complets pour simuler des conditions proches de la production.
   ○ **Accès et Permissions** : Accès limité aux développeurs seniors et aux
   ingénieurs en assurance qualité pour éviter les modifications imprévues. Les
   processus de déploiement sont automatisés pour reproduire les conditions
   de production.
   ○ **Processus de déploiement** : Principalement automatisé, avec des scripts
   qui permettent de déployer rapidement les versions en cours de
   développement pour les tests d'intégration.
   ○ **Tests réalisés** : Tests d'intégration pour vérifier l'interopérabilité des
   modules, tests d'interface avec des services tiers (comme DocuSign/PDFKit
   pour la signature de contrats ou Banque Populaire/MangoPay/Stripe pour les
   paiements), ainsi que des tests de charge pour simuler l'utilisation
   simultanée par plusieurs utilisateurs.
3. **Environnement de Préproduction** :
   ○ **Serveurs** : Configurés pour être identiques à l'environnement de production,
   ce qui permet de simuler les conditions réelles avant le déploiement en
   production.

```
○ Base de données : Copie anonyme de la base de données de production
pour tester l'application avec des données réelles sans compromettre la
sécurité.
○ Accès et Permissions : Accès restreint aux administrateurs système et à
l'équipe de test. Les utilisateurs finaux peuvent être invités à tester dans
cet environnement sous contrôle.
○ Processus de déploiement : Semi-automatisé pour permettre des
validations manuelles avant le déploiement final.
○ Tests Réalisés : Tests de validation finale, y compris les tests de
performance, de sécurité, et d'expérience utilisateur, afin de vérifier que
tout est conforme avant la mise en production.
```

4. **Environnement de Production** :
   ○ **Serveurs** : Serveurs haute disponibilité avec des configurations de
   redondance pour assurer une continuité de service.
   ○ **Base de données** : Base de données de production en temps réel,
   hébergeant les données actives des utilisateurs.
   ○ **Accès et Permissions** : Accès très restreint, limité aux administrateurs
   système. Aucun accès direct pour les développeurs ou testeurs.
   ○ **Processus de déploiement** : Entièrement automatisé avec des outils de
   CI/CD (Continuous Integration/Continuous Deployment) pour minimiser les
   interruptions de service.
   ○ **Tests Réalisés** : Tests post-déploiement en production (smoke tests) pour
   vérifier la stabilité et le bon fonctionnement des services critiques
   immédiatement après la mise en ligne.

### 4.2 Plan de Tests.................................................................

**Tests Unitaires** :

```
● Objectif : Valider le bon fonctionnement de chaque composant individuel de la
plateforme, notamment les fonctions de l'algorithme de matching, la génération de
contrats, la gestion des paiements, etc.
● Exemple : Vérification de l'exactitude des calculs de tarifs horaires et à la
prestation, tests des champs de formulaires (ex : saisie correcte des données),
tests des notifications envoyées.
```

**Tests d'Intégration** :

```
● Objectif : Vérifier que les différents modules de la plateforme interagissent
correctement entre eux.
● Exemple : Assurer la bonne intégration entre la gestion des profils utilisateurs, la
création de missions, et l'envoi automatique des notifications. Tester également la
connexion avec des services tiers comme DocuSign/PDFKit pour la signature des
contrats et Stripe pour les paiements.
```

**Tests de Performance** :

```
● Objectif : Mesurer la rapidité, la réactivité, et la capacité de la plateforme à gérer
un nombre important de connexions simultanées.
● Exemple : Tester la performance de l'algorithme de matching avec un grand
nombre d'utilisateurs et de missions. Vérifier que la plateforme reste stable et
rapide même en période de forte utilisation.
```

**Tests Utilisateurs** :

```
● Objectif : Évaluer l'expérience utilisateur en situation réelle, en recueillant les
retours sur l'ergonomie, la fluidité du parcours utilisateur, et la satisfaction
globale.
● Exemple : Organiser des sessions de tests avec des Renfords et des établissements
sportifs pour vérifier la facilité d'inscription, l'efficacité du processus de création
de missions, et la clarté des interfaces.
```

### 4.3 Critères d'Acceptation......................................................

Pour que la plateforme Renford soit considérée comme opérationnelle, elle doit remplir
les critères suivants :

```
● Fonctionnalités Principales : Toutes les fonctionnalités principales (inscription,
création de profil, création de missions, matching, génération de contrats, gestion
des paiements) doivent fonctionner sans bugs majeurs. L'algorithme de matching
doit être précis et efficace, et les utilisateurs doivent pouvoir l'utiliser sans
difficulté.
● Expérience Utilisateur : L'interface utilisateur doit être intuitive, avec des
parcours utilisateur fluides, tant pour les Renfords que pour les établissements
sportifs. Les retours des tests utilisateurs doivent montrer une satisfaction générale
élevée, avec des retouches mineures si nécessaire.
● Sécurité et Conformité : La plateforme doit être sécurisée, avec une protection
efficace des données des utilisateurs (cryptage des données sensibles, gestion des
accès, etc.). Les processus liés aux contrats et aux paiements doivent être
conformes aux régulations légales en vigueur.
● Performance : La plateforme doit être capable de gérer un trafic élevé sans
ralentissements notables ni pannes. Le temps de réponse pour les actions critiques
(par exemple, le matching ou le chargement des profils) doit rester dans une plage
acceptable (à définir par des indicateurs spécifiques).
● Documentation et Support : Une documentation claire et complète doit être
disponible pour les utilisateurs, ainsi qu’un support technique réactif pour résoudre
les éventuels problèmes. Les FAQ, guides et tutoriels doivent être à jour et
accessibles depuis la plateforme.
```

## V) Maintenance Technique & Support............................................

### 5.1. Maintenance.................................................................

**1. Planification des Mises à Jour**

```
● Mises à jour logicielles :
○ Déploiement cyclique : Établir un calendrier régulier pour les mises à jour
majeures (nouvelles versions) et les mises à jour mineures (correctifs,
patchs) afin de maintenir la plateforme à jour.
○ Test de pré-déploiement : Utilisation d'environnements de test (sandbox)
pour vérifier l'impact des mises à jour sur les fonctionnalités existantes et
prévenir les régressions.
○ Automatisation du déploiement : Intégration continue (CI/CD) pour
automatiser le déploiement des mises à jour, minimisant les interruptions
de service.
● Mises à jour de sécurité :
○ Surveillance proactive : Utilisation de solutions de détection des intrusions
et de scanners de vulnérabilités pour surveiller en temps réel les menaces
potentielles.
○ Correctifs rapides : Mise en place d'un processus d'intervention rapide pour
déployer des correctifs de sécurité dès qu'une vulnérabilité est identifiée.
```

**2. Surveillance et Correctifs de Sécurité**

```
● Système de surveillance continue :
○ Monitoring 24/7 : Mise en place de systèmes de surveillance en continu
pour détecter les anomalies, les tentatives d'intrusion et les pannes de
service.
○ Alertes automatiques : Configuration d'alertes en temps réel pour informer
l'équipe technique de toute activité suspecte ou de tout problème de
performance.
● Réponse aux incidents de sécurité :
○ Procédure d'urgence : Développement d'un plan de réponse aux incidents
comprenant l'analyse des causes racines, la mise en quarantaine des
systèmes affectés, et la communication avec les utilisateurs.
○ Rapports post-incidents : Génération de rapports détaillés après chaque
incident pour documenter les actions prises, les impacts, et les
améliorations à mettre en place.
```

**3. Évolutions Fonctionnelles**

```
● Suivi des retours utilisateurs :
```

```
○ Collecte de feedback : Mise en place de formulaires de retour
d'expérience, enquêtes de satisfaction, et analyses des tickets de support
pour identifier les demandes fréquentes et les points d'amélioration.
○ Roadmap publique : Élaboration d'une feuille de route évolutive, accessible
aux utilisateurs, indiquant les fonctionnalités en cours de développement et
les futures améliorations prévues.
● Développement continu :
○ Prototypes et tests utilisateur : Développement de prototypes pour les
nouvelles fonctionnalités et réalisation de tests utilisateurs pour s'assurer de
leur utilité et de leur facilité d'utilisation.
○ Optimisation des performances : Surveillance des performances de la
plateforme avec des outils d'analyse pour identifier les goulets
d'étranglement et améliorer la rapidité et la réactivité du service.
```

**4. Communication avec les Utilisateurs**

```
● Notification des maintenances :
○ Calendrier des maintenances planifiées : Publication régulière du
calendrier des maintenances planifiées, avec des notifications envoyées aux
utilisateurs au moins 48 heures avant l'intervention.
○ Mise à jour en temps réel : Pendant la maintenance, affichage d'une page
d'état en temps réel informant les utilisateurs de la progression et du temps
restant.
● Rapports après maintenance :
○ Rapport de fin de maintenance : Après chaque intervention, envoi d'un
rapport aux utilisateurs affectés détaillant les mises à jour effectuées, les
éventuels impacts et les actions à venir.
```

### 5.2. Support utilisateur.........................................................

1. **Formulaire de contact** :
   ○ **Formulaire dédié** : Intégration d’un formulaire de contact sur la
   plateforme, permettant aux utilisateurs de signaler des problèmes, de
   demander des informations supplémentaires ou de soumettre des
   suggestions.
   ○ **Temps de réponse rapide** : Engagement à répondre aux demandes des
   utilisateurs dans un délai prédéterminé, par exemple sous 24 heures
   ouvrées.

## VI) Calendrier prévisionnel pour le développement de Renford...........

développement de Renford

**Mai/Juin 2025 - Préparation et Planification**

```
● Semaine 1-2 : Révision du cahier des charges et finalisation des spécifications
techniques.
● Semaine 3 : Sélection et validation des développeurs ou de l'agence de
développement.
● Semaine 4 : Obtention du prêt et finalisation des contrats de développement.
```

**Juin 2025 - Lancement du Développement**

```
● Semaine 1 : Kick-off du projet, mise en place des environnements de travail (dev,
préprod, recette).
● Semaine 2-4 : Début du développement des fonctionnalités principales.
```

**Juillet/Aout 2025 - Développement Continu et Intégration**

```
● Semaine 1-2 : Poursuite du développement avec focus sur l'ergonomie et le
responsive design.
● Semaine 3 : Tests unitaires sur les fonctionnalités développées.
● Semaine 4 : Intégration des APIs tierces ( système de paiement, API signature
électronique).
```

**Septembre 2025 - Phase de Test et Validation**

```
● Semaine 1 : Déploiement en pré production, tests unitaires et d'intégration.
● Semaine 2 : Déploiement en environnement de recette, début des tests
utilisateurs (bêta test).
● Semaine 3 : Corrections des bugs et itérations basées sur les retours.
● Semaine 4 : Préparation au lancement, tests de performance et de sécurité.
● Semaine 4bis (optionnelle) : Semaine tampon pour gérer d'éventuels retards liés à
l'intégration des APIs ou aux tests.
```

**Septembre/Octobre 2025 - Lancement et Suivi**

```
● Semaine 1 : Lancement de la plateforme, mise en production.
● Semaine 2-3 : Suivi post-lancement, support utilisateur initial.
● Semaine 4 : Révision du projet et planification des évolutions futures.
```

### Flexibilité et Agilité

```
● Sprints bi-hebdomadaires : Diviser le travail en sprints de deux semaines pour
ajuster les priorités selon les retours et les avancées.
● Points de contrôle : Prévoir des réunions hebdomadaires pour suivre l'avancement
et résoudre les obstacles rapidement.
● Itérations : Être prêt à adapter les fonctionnalités en fonction des retours
utilisateurs et des tests tout au long du projet.
```

Ce calendrier assure une progression agile, permettant des ajustements rapides et un suivi
continu jusqu'au lancement de la plateforme finale prévue pour septembre 2025.

## ANNEXES

**Annexe 1 : types d'établissements à inclure pour le choix lors du remplissage
de la fiche établissement sur Renford :**

1. Salle de sport / Gymnase
2. Centre de fitness
3. Studio de yoga
4. Studio de pilates
5. Centre de bien-être
6. Club d'escalade
7. Centre de sports aquatiques (natation, aquagym, etc.)
8. École de danse
9. Centre de formation sportive
10. Club de sport de combat (boxe, MMA, etc.)
11. Centre d'arts martiaux
12. Complexe multisports
13. Club de golf
14. Club de tennis
15. Centre d'athlétisme
16. Établissement de sports extrêmes (parapente, BMX, etc.)
17. Centre équestre
18. Club de cyclisme
19. Club de course à pied
20. Club de tir à l'arc
21. Club de voile / sports nautiques
22. Centre de musculation / bodybuilding
23. Centre de réeducation sportive / kinésithérapie
24. Stade ou arène sportive
25. Association sportive
26. Complexe de loisirs sportifs (bowling, karting, etc.)
27. Académie sportive (pour jeunes sportifs)
28. École de surf / kitesurf

**Annexe 2 : type de poste / profil souhaité**

## ANNEXES

**Annexe 1 : types d'établissements à inclure pour le choix lors du remplissage
de la fiche établissement sur Renford :**

1. Salle de sport / Gymnase
2. Centre de fitness
3. Studio de yoga
4. Studio de pilates
5. Centre de bien-être
6. Club d'escalade
7. Centre de sports aquatiques (natation, aquagym, etc.)
8. École de danse
9. Centre de formation sportive
10. Club de sport de combat (boxe, MMA, etc.)
11. Centre d'arts martiaux
12. Complexe multisports
13. Club de golf
14. Club de tennis
15. Centre d'athlétisme
16. Établissement de sports extrêmes (parapente, BMX, etc.)
17. Centre équestre
18. Club de cyclisme
19. Club de course à pied
20. Club de tir à l'arc
21. Club de voile / sports nautiques
22. Centre de musculation / bodybuilding
23. Centre de réeducation sportive / kinésithérapie
24. Stade ou arène sportive
25. Association sportive
26. Complexe de loisirs sportifs (bowling, karting, etc.)
27. Académie sportive (pour jeunes sportifs)
28. École de surf / kitesurf

**Annexe 2 : type de poste / profil souhaité**

**1. Pilates**
Matwork (au sol)
Reformer
Cadillac
Chair (Wunda Chair)
Pilates sur petits matériels (ballon, élastique, foam roller...)

Pilates prénatal / postnatal
Pilates seniors / adapté
Pilates dynamique (power pilates)
Pilates thérapeutique / rééducation
Lagree Fitness (méthode spécifique)

**2. Yoga**
Hatha Yoga
Vinyasa Yoga
Ashtanga Yoga
Yin Yoga
Kundalini Yoga
Yoga prénatal / postnatal
Yoga Nidra (relaxation guidée)
Power Yoga
Yoga seniors / adapté
Yoga enfants
Yoga thérapeutique
**3. Fitness & Musculation**
CAF (Cuisses Abdos Fessiers)
Body Sculpt / Renfo global
LIA (Low Impact Aerobic)
Step / Step chorégraphié
HIIT / Tabata
Circuit training
Cross Training / CrossFit (si diplômé)
TRX / Suspension training
RPM / Vélo Indoor
Body Pump (type Les Mills)
Stretching / Mobilité
Cardio boxing
Bootcamp
Gym posturale / dos
**4. Escalade**
Encadrement en salle (bloc / voie)
Encadrement en milieu naturel
Ouvreur de voies/blocs
Coaching escalade (performance)
Cours enfants / ados
Escalade thérapeutique / APA
Initiation / loisirs adultes
**5. Boxe**
Boxe anglaise
Boxe française / savate

Kickboxing
Muay Thai
Boxe éducative enfants / ados
Cardio Boxe / Boxe fitness
Coaching boxe (loisir ou compétiteur)

**6. Danse**
Danse classique
Danse contemporaine
Jazz / Modern jazz
Hip Hop / Street dance
Ragga dancehall
Danses latines (salsa, bachata...)
Zumba
Danse africaine
Danse enfants
Barre au sol
**7. Gymnastique**
Baby-gym
Gymnastique artistique
Gym au sol
Gym tonique
Gym douce
Gym senior
Gym adaptée (APA)
Acrogym / Portés acrobatiques
**8. Tennis**
Tennis loisir enfants
Tennis compétition jeunes
Tennis adulte loisir
Tennis senior / sport santé
Préparation physique pour tennis
Tennis en fauteuil (adapté)
**9. Activité Physique Adaptée (APA)**
APA pathologies métaboliques (diabète, obésité...)
APA pathologies chroniques (cancer, Parkinson...)
APA seniors / prévention chute
APA santé mentale
APA handicap moteur
APA handicap psychique / cognitif
APA rééducation post-blessure
APA en EHPAD / structures médico-sociales

**Annexe 3 : Algorithme de match-making (script adapté à l’environnement
Airtable)**

**// Auxiliary functions with enhanced logging
function parseDate(dateString) {
if (!dateString) return null;
const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10 ));
return new Date(year, month - 1 , day);
}**

**function isDepartmentClose(department1, department2) {
const closeDepartmentsMap = {
'Paris': ['Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne'],
'Seine-et-Marne': ['Val-de-Marne', 'Essonne'],
'Yvelines': ['Hauts-de-Seine', 'Val-d\'Oise', 'Essonne'],
'Essonne': ['Hauts-de-Seine', 'Val-de-Marne', 'Seine-et-Marne', 'Yvelines'],
'Hauts-de-Seine': ['Paris', 'Yvelines', 'Essonne', 'Val-de-Marne'],
'Seine-Saint-Denis': ['Paris', 'Val-d\'Oise', 'Val-de-Marne'],
'Val-de-Marne': ['Paris', 'Seine-Saint-Denis', 'Hauts-de-Seine', 'Essonne',
'Seine-et-Marne'],
'Val-d\'Oise': ['Yvelines', 'Seine-Saint-Denis']
};
const isClose = department1 === department2 || (closeDepartmentsMap[department1]
&& closeDepartmentsMap[department1].includes(department2));
console.log(`Comparaison de départements: ${department1} et ${department2} sont
proches? ${isClose}`);
return isClose;
}**

**function tariffMatch(freelancerRate, missionTariff) {
let match = false;
switch (missionTariff) {
case "Moins de 45 euros":
match = freelancerRate <= 55 ;
break;
case "Entre 45 et 59 euros de l'heure":
match = (freelancerRate >= 35 && freelancerRate <= 70 );
break;
case "Plus de 60 euros l'heure":
match = freelancerRate >= 50 ;
break;
}
console.log(`Comparaison de tarifs: ${freelancerRate}€ et '${missionTariff}'
correspondent? ${match}`);
return match;**

**}**

**function datesOverlap(missionStart, missionEnd, freelancerStart, freelancerEnd,
isUnlimitedAvailability) {
if (isUnlimitedAvailability === "checked") {
console.log(`Disponibilité illimitée pour le freelance, toujours
disponible.`);
return true;
}**

**let missionStartDate = parseDate(missionStart);
let missionEndDate = parseDate(missionEnd);
let freelancerStartDate = parseDate(freelancerStart);
let freelancerEndDate = parseDate(freelancerEnd);**

**let overlap = freelancerStartDate <= missionEndDate && freelancerEndDate >=
missionStartDate;
console.log(`Chevauchement des dates: du ${missionStart} au ${missionEnd} avec
${freelancerStart} - ${freelancerEnd}? ${overlap}`);
return overlap;
}**

**// Main function to match freelancers to missions
async function matchFreelancersToMissions() {
console.log("Début du matching des freelancers aux missions...");
const missionsTable = base.getTable('Details_Missions');
const usersTable = base.getTable('Users');
const missions = await missionsTable.selectRecordsAsync();
const users = await usersTable.selectRecordsAsync();**

**for (let mission of missions.records) {
let missionStatus = mission.getCellValueAsString('Statut');
if (missionStatus !== "Envoyée") continue;**

**let missionDept = mission.getCellValueAsString('Département IDF
Entreprise');
let missionTariff = mission.getCellValueAsString('Tranche tarifaire');
let missionType = mission.getCellValueAsString('Type de poste souhaité');
let missionExperience = mission.getCellValueAsString('Niveau
d\'expérience');
let missionStart = mission.getCellValueAsString('Date de début mission');
let missionEnd = mission.getCellValueAsString('Date de fin mission');**

**let suitableFreelancers = users.records.filter(freelancer => {
let freelancerDept = freelancer.getCellValueAsString('Département IDF');**

**let freelancerRate = Number(freelancer.getCellValueAsString('R-Calcul
prix à l\'heure'));
let freelancerTypes = freelancer.getCellValueAsString('Type de
mission').split(', '); // Assuming the cell returns a comma-separated string
let freelancerExperience = freelancer.getCellValueAsString('Niveau
d\'expérience');
let freelancerStart = freelancer.getCellValueAsString('Disponible à
partir de');
let freelancerEnd = freelancer.getCellValueAsString('Disponible
jusqu\'au');
let isUnlimitedAvailability = freelancer.getCellValue('Dispo illimité')
=== "checked";**

**return isDepartmentClose(missionDept, freelancerDept) &&
tariffMatch(freelancerRate, missionTariff) &&
datesOverlap(missionStart, missionEnd, freelancerStart,
freelancerEnd, isUnlimitedAvailability) &&
freelancerTypes.includes(missionType);
}).slice( 0 , 3 );**

**if (suitableFreelancers.length > 0 ) {
let freelancerNames = suitableFreelancers.map(f =>
f.getCellValueAsString('USER ID')).join(', ');
console.log(`Freelancers correspondants pour la mission ${mission.id}:
${freelancerNames}`);
await missionsTable.updateRecordAsync(mission.id,
{'RenfordsCorrespondants3': freelancerNames});
} else {
console.log(`Aucun freelancer correspondant trouvé pour la mission
${mission.id}.`);
await missionsTable.updateRecordAsync(mission.id,
{'RenfordsCorrespondants3': 'Aucun freelancer trouvé'});
}
}
console.log("Matching terminé.");
}**

**await matchFreelancersToMissions();**

**Annexe 4 : liste du matériel sportif éventuellement requis / demandé pour une
mission.**

**Coach Sportif Personnel :**

```
● Coach Fitness, Musculation, Cardio, CrossFit, Pilates, Yoga :
○ Tapis de yoga ou fitness
○ Élastiques de résistance
○ Haltères ou kettlebells
○ Corde à sauter
○ Gants de musculation
○ Serviette
○ Montre ou tracker de fitness
● Coach Nutrition :
○ Outils pour analyses corporelles (pèse-personne connecté, caliper pour mesurer la
graisse corporelle)
○ Tablettes pour les suivis nutritionnels
```

**Encadrant Sportif :**

```
● Encadrant Escalade :
○ Chaussons d'escalade
○ Harnais
○ Corde d'escalade
○ Système d'assurage
○ Casque
● Encadrant Natation :
○ Maillot de bain
○ Bonnet de bain
○ Lunettes de natation
○ Palmes
○ Planche de natation
● Encadrant Sports Collectifs (Football, Basketball, etc.) :
○ Ballons (football, basketball, handball)
○ Protège-tibias
○ Cônes d'entraînement
○ Chasubles
● Encadrant Sports de Combat (Boxe, Judo, etc.) :
○ Gants de boxe
○ Protège-tibias
○ Casques de protection
○ Kimono
○ Ceintures
● Encadrant Sports de Raquette (Tennis, Badminton, etc.) :
○ Raquettes
○ Balles ou volants
○ Cordages de rechange
○ Grip de raquette
● Encadrant Sports d’Hiver (Ski, Snowboard, etc.) :
○ Casque de ski
○ Gants
○ Lunettes de ski
○ Vêtements techniques (pantalon et veste de ski)
```

**Instructeur Spécialisé :**

```
● Instructeur Pilates, Yoga, Zumba, Danse, Stretching, CrossFit :
○ Tapis de yoga ou fitness
○ Briques de yoga
○ Sangle de yoga
○ Chaussures spécifiques pour la danse ou le CrossFit
● Instructeur Aquagym :
○ Maillot de bain
○ Équipements de flottaison
○ Aquadumbbells
○ Frites de piscine
● Instructeur Spinning/Cycling :
○ Vélo de spinning/cycling
○ Chaussures spécifiques pour pédales automatiques
○ Bidon d'eau
```

**Moniteur Sportif :**

```
● Moniteur Yoga, Pilates, Escalade, Natation, Plongée, Sports d'Hiver, Surf :
○ Matériel spécifique à chaque discipline (tapis, harnais, palmes, etc.)
○ Vêtements techniques
○ Équipements de sécurité (gilets, harnais, casques)
```

**Formateur Sportif :**

```
● Formateur en Techniques de Coaching, Préparation Physique, Sécurité Sportive, Santé et
Bien-être :
○ Matériel pédagogique (tablettes, projecteurs)
○ Outils de mesure pour les performances physiques (chronomètre, dynamomètre)
```

**Responsable de Programme :**

```
● Responsable Programme Fitness, Bien-être, Entraînement, Enfant/Adolescent, Senior :
○ Matériel d'évaluation (balances, mesureurs de tension artérielle)
○ Équipements adaptés aux différentes tranches d'âge (parcours de motricité, poids
légers)
```

**Consultant Sportif :**

```
● Consultant Stratégie Fitness, Nutrition Sportive, Préparation Mentale, Développement de
Programme Sportif :
○ Tablettes ou ordinateurs portables pour les analyses et présentations
○ Outils de mesure corporelle
```

**Kinésithérapeute du Sport :**

```
● Spécialiste Rééducation Sportive, Massage Sportif, Prévention des Blessures :
○ Tables de massage
○ Huiles ou crèmes de massage
○ Bandages élastiques
```

```
○ Outils pour thérapie par pression
```

**Professeur de Yoga/Pilates :**

```
● Yoga Hatha, Vinyasa, Ashtanga, Nidra, Pilates Reformer, Pilates Matwork :
○ Tapis de yoga
○ Reformer Pilates (pour cours spécifiques)
○ Briques de yoga
○ Sangles
```

**Animateur Sportif :**

```
● Animateur Activités Physiques Adaptées (APA), Loisirs Sportifs, Sports de Plein Air :
○ Matériel adapté aux activités physiques adaptées
○ Équipements de sécurité pour les activités de plein air (casques, harnais)
```

**Autres Profils Sportifs :**

```
● Médiateur Sportif, Guide de Montagne, Référent Pédagogique Sportif, Technicien Sportif
(Matériel, Sécurité) :
○ Matériel de communication (radios, téléphones)
○ Équipements de sécurité pour guide de montagne (cordes, piolets)
○ Outils de maintenance pour technicien sportif
```

**Annexe 5 : Mail automatique à envoyer à l’utilisateur qui vient de soumettre
une demande de mission.**

Bonjour [Prénom EntrepriseValue], [Nom EntrepriseValue]
<br>
Nous avons bien reçu votre demande de mission et tenions à vous remercier pour votre
confiance envers Renford.
Votre demande est actuellement en cours de traitement et nous mettons tout en œuvre
pour vous proposer les profils correspondants à vos attentes.
Nous vous tiendrons informé très prochainement des avancées concernant la sélection des
Renfords.
Restant à votre disposition pour toute information supplémentaire.
<br>
Cordialement,
<br>
Nicolas de Renford

**Annexe 6 pour le modèle de devis**

Disponible sur le Drive
https://docs.google.com/document/d/1-EGvfWTfB72bjrm0Jtl0HGRJlxG14HeIhCUwObi9ils/
edit?usp=sharing _(demander l’accès)._

**Annexe 7 pour le modèle de contrat de prestation**

Disponible sur le Drive
https://docs.google.com/document/d/1Ps6ymRzXcTt3l3uZQJTdGHFzsJRrnQqO/edit?usp=s
haring&ouid=105634703658582654765&rtpof=true&sd=true _(demander l’accès)._

**Annexe 8 pour les liens vers les API et la documentation Banque populaire**

Lien vers le système d’exploitation: https://paiement.systempay.fr/doc/fr-FR/

Lien site BPVF pour les avantages du service :
https://www.banquepopulaire.fr/valdefrance/professionnels/gerer-developper-activite/encaisser-pai
ements-e-mail-sms-paiement-express/

https://www.banquepopulaire.fr/valdefrance/professionnels/gerer-developper-activite/encaisser-pai
ements-ligne-securises/

**Annexe 9 pour mail de rappel aux entreprises n’ayant pas signé le devis :**

Bonjour Prénom EntrepriseValue Nom EntrepriseValue,

Nous vous avons contacté il y a quelques jours car nous avons identifié un profil de Renford
parfaitement adapté à vos besoins pour votre demande de mission : **Prénom (from Users)
(from RenfordsCorrespondants)Value** a accepté votre demande et sera votre Renford pour
toute la durée de la mission. Ses compétences et son expérience correspondent
précisément à vos critères.

Merci de bien vouloir suivre les étapes suivantes afin de commencer au plus vite la mission :

- **Validation et signature du devis** : vous trouverez <a href=" lien devis perso "> **ici** </a> le
  devis à signer ainsi que les informations bancaires à ajouter ou à modifier.
- **Signature du contrat de prestation** : dès le devis signé, le contrat de prestation de
  service vous sera envoyé via Docusign.

Tous vos documents seront ensuite disponibles dans votre espace via l'onglet "Mes
missions".

Nous sommes impatients de commencer et restons disponibles pour toute question.

Bien cordialement,

Nicolas de chez Renford

**Annexe 10 pour le modèle de facture finale & d’attestation de mission pour les
Etablissements :**

- Modèle de facture finale pour services et commissions pour les Etablissements
  Disponible sur le Drive
  https://docs.google.com/document/d/14P_Gam_5LERJodcPbjeW8jIVwVn6fdze/edi
  t?usp=sharing&ouid=105634703658582654765&rtpof=true&sd=true _(demander_
  _l’accès)._
  **- Modèle d’attestation de réalisation de mission pour les Établissements** Lien Drive
  :
  **https://docs.google.com/document/d/1-8zqpbGS0X2VqwhMtgiLyBR3yjLxLXjrObX**
  **gq_IWKjE/edit?usp=sharing** (demander l’accès).

**Annexe BIS : Modèle de Mail signature du devis, du contrat et paiement
demandé**

Bonjour Prénom EntrepriseValue, Nom EntrepriseValue ,

Nous avons le plaisir de vous annoncer que nous avons identifié un profil de Renford
parfaitement adapté à vos besoins pour votre demande de mission : **Prénom (from Users)
(from RenfordsCorrespondants)Value** a accepté votre demande et sera votre Renford
pour toute la durée de la mission. Ses compétences et son expérience correspondent
précisément à vos critères.

_Les étapes suivantes :_

- **Validation et signature du devis** : vous trouverez <a href=" lien devis perso
    "> **ici** </a> le devis à signer ainsi que les informations bancaires à ajouter ou à
  modifier.
- **Signature du contrat de prestation** : dès le devis signé, le contrat de prestation de
  service vous sera également envoyé via Docusign.

Tous vos documents seront ensuite disponibles dans votre espace via l'onglet "Mes
missions".

Nous sommes impatients de commencer et restons disponibles pour toute question.

Bien cordialement,

_Nicolas de chez Renford_

**Annexe 11 pour la liste des diplômes dans le sport.**

**1. Diplômes Universitaires :**

```
● Licence STAPS (Sciences et Techniques des Activités Physiques et Sportives) :
○ Mention "Entraînement Sportif"
○ Mention "Activité Physique Adaptée"
○ Mention "Éducation et Motricité"
○ Mention "Management du Sport"
● Master STAPS :
○ Entraînement et Optimisation de la Performance Sportive
○ Activités Physiques Adaptées et Santé
○ Ingénierie et Ergonomie de l’Activité Physique
○ Management du Sport
● Doctorat en Sciences du Sport :
○ Recherche spécialisée dans un domaine précis du sport (physiologie, psychologie,
sociologie, etc.)
```

**2. Diplômes d'État :**

```
● BPJEPS (Brevet Professionnel de la Jeunesse, de l’Éducation Populaire et du Sport) :
○ Spécialités : Activités Gymniques, de la Forme et de la Force (AGFF), Activités
Aquatiques et de la Natation, Activités Physiques pour Tous, Activités de la
Randonnée, etc.
● DEJEPS (Diplôme d’État de la Jeunesse, de l’Éducation Populaire et du Sport) :
○ Spécialités : Perfectionnement Sportif, Développement de Projets, Territoires et
Réseaux.
● DESJEPS (Diplôme d’État Supérieur de la Jeunesse, de l’Éducation Populaire et du
Sport) :
○ Spécialités : Direction de Projets et de Structures Territoriales, Entraînement
Sportif, Animation Socio-éducative.
```

**3. Certificats et Formations Professionnelles :**

```
● CQP (Certificat de Qualification Professionnelle) :
○ Moniteur d’escalade, Instructeur de fitness, Coach en musculation, etc.
● Brevets Fédéraux :
○ Issus des fédérations sportives, ces brevets permettent d’encadrer des activités
sportives spécifiques à chaque discipline.
```

**4. Diplômes Spécifiques aux Disciplines :**

```
● BEES (Brevet d’État d’Éducateur Sportif) :
○ Bien que progressivement remplacé par les BPJEPS et autres diplômes d'État,
certains BEES restent actifs pour des spécialités comme l'escalade, le ski, le surf,
etc.
● Certificat d'Aptitude à l'Enseignement de la Danse (CAED) :
○ Pour les disciplines de danse classique, contemporaine, et jazz.
```

**5. Diplômes de Kinésithérapie et Préparation Physique :** 1. **Diplôme d’État de Masseur-Kinésithérapeute :**
○ Spécialisation possible en kinésithérapie sportive. 2. **Diplôme de Préparateur Physique :**
○ Formation spécialisée souvent obtenue après une licence ou un master en STAPS.

**Annexe 12 pour la liste des niveaux de qualification sur Renford :**

“Débutant (moins de 2 ans d'expérience)”, “Confirmé (entre 5 et 10 ans d’expérience)” et
“Expert (plus de 10 ans d’expérience)”.

**Annexe 13 : Mail aux Renfords pour notification nouvelle mission**

Bonjour Prénom (from Users) (from RenfordsCorrespondants)Value ,
<br>
Nous sommes ravis de t'annoncer que nous avons identifié une mission qui pourrait
parfaitement correspondre à ton profil sur Renford. Voici les détails :

Mission : Type de poste souhaité

Établissement : Raison sociale EntrepriseValue

Lieu : Adresse complète

Date : Plage de la mission

Rémunération : tarif à l’heure ou tarif de la prestation

Si cette mission t'intéresse et que tu es disponible, merci de nous répondre :
● Soit en te connectant sur ton profil <a href="https://renford.fr">Renford</a> et en
cliquant sur la notification de demande de mission ;
● Soit en répondant directement à ce mail ;
● Tu peux également nous contacter directement, si tu as besoin de plus
d'information avant de prendre ta décision, via notre hotline (numéro 06 64 39 26
28, non surtaxé).
Une réponse rapide serait appréciée pour assurer la satisfaction de l'ensemble de nos
utilisateurs.
Nous sommes en tout cas impatients de collaborer avec toi.
<br>
Cordialement,
<br>
Seren de chez Renford

**Annexe 14 : FAQ (générale, celle des renfords et celle des entreprises ?)**

- **FAQ général** , accessible directement depuis la Home page : renford.fr

```
● FAQ pour les Renfords :
○ Comment puis-je trouver des missions sur Renford?
■ Complète ton profil et mets à jour tes disponibilités pour recevoir
des propositions de missions adaptées à tes compétences et
préférences.
○ Renford est-il gratuit pour les indépendants?
■ Renford est totalement gratuit pour les indépendants sportifs. Il n'y a
aucun frais caché! Ce sont les entreprises qui supportent les frais de
service.
○ Comment Renford assure-t-il la conformité réglementaire pour les missions?
■ Nous veillons à ce que toutes les missions respectent les normes
légales et réglementaires, assurant ainsi sécurité et transparence
pour tous les utilisateurs.
○ Comment fonctionne la mise en relation?
■ Les missions sont attribuées en fonction de la correspondance entre
tes compétences, tes disponibilités et les besoins spécifiques des
établissements sportifs.
○ Comment gérer mes paiements et factures sur Renford?
■ Toutes tes transactions financières sont automatisées. Tu recevras
tes paiements directement via la plateforme une fois la mission
validée par l'établissement sportif.
○ Comment puis-je bénéficier de conseils professionnels sur Renford?
■ Notre équipe d'experts est disponible pour te fournir des conseils
personnalisés via notre service de support, accessible par chat,
email ou téléphone.
○ Que faire si je dois annuler une mission acceptée?
■ Si tu dois annuler une mission, fais-le au moins 24 heures à l'avance
pour éviter toute pénalité. Les annulations tardives ou les absences
entraîneront une suspension temporaire de ton compte pour 7 jours,
avec possibilité de justifier ta situation. En cas de circonstances
```

```
exceptionnelles reconnues comme forces majeures, aucune sanction
ne sera appliquée.
```

```
Si deux désistements tardifs ou absences surviennent dans un
intervalle de 30 jours, ton compte pourrait être suspendu
définitivement. Nous nous engageons à minimiser l'impact sur les
entreprises clientes en cherchant des remplaçants efficacement.
```

**● FAQ pour les Établissements :**
○ Est-ce que Renford est gratuit pour les établissements sportifs?
■ L'utilisation de la plateforme Renford est gratuite, avec une
commission prélevée uniquement sur les missions complétées.
L'édition de documents administratifs, tels que les contrats et les
factures, est entièrement gratuite et incluse dans notre offre,
permettant une gestion simplifiée et sans coûts additionnels pour les
établissements sportifs.
○ Comment fonctionne la mise en relation sur Renford?
■ Renford utilise un algorithme avancé de matching pour connecter les
établissements sportifs avec des professionnels qualifiés selon les
compétences requises, la disponibilité et les préférences
géographiques. Vous pouvez poster une mission et recevoir des
propositions de candidats qualifiés en quelques clics. Renford est
notamment accompagné de juristes afin de produire des contrats
normés et légaux.
○ Comment Renford simplifie-t-il les démarches administratives pour les
établissements sportifs?
■ Renford réduit la charge administrative en automatisant la création
et la gestion des contrats, des factures et des attestations. Notre
plateforme facilite également le suivi des missions et assure la
conformité réglementaire, vous permettant de vous concentrer
pleinement sur votre activité principale sans vous soucier des tâches
administratives.
○ Renford répond-il à la réglementation?
■ Oui, Renford assure la conformité avec les normes légales et
réglementaires en vigueur dans le secteur sportif, facilitant la
gestion administrative et la conformité pour vos missions et
contrats.
○ Quel support Renford offre-t-il aux établissements sportifs?
■ Les missions sont attribuées en fonction de la correspondance entre
tes compétences, tes disponibilités et les besoins spécifiques des
établissements sportifs.
○ Qu'advient-il si un professionnel ne se présente pas ou annule à la dernière
minute?
■ Renford s'engage à minimiser ces désagréments en offrant des
solutions de remplacement rapide ou en facilitant le processus de

```
recherche d'un autre professionnel qualifié. Des politiques de gestion
des absences sont en place pour garantir la fiabilité de nos services.
○ Est-ce que Renford peut aider à former nos employés?
■ Oui, en plus de la mise en relation avec des professionnels, Renford
propose des modules de formation et des ressources éducatives pour
aider vos employés à développer leurs compétences et à rester à
jour avec les dernières tendances du secteur sportif.
○ Quels sont les avantages de choisir Renford par rapport à d'autres
plateformes?
■ Renford se distingue par sa spécialisation dans le secteur sportif,
offrant une expertise et des outils adaptés spécifiquement aux
besoins des établissements sportifs pour une gestion plus efficace et
des résultats optimisés.
```

**ANNEXE 15 : Mail de bienvenu Renford et Établissement**

**_- Mail aux Renfords_**

Bonjour Prénom ,

Félicitations et bienvenue chez Renford! Tu fais désormais partie d'une communauté
dynamique qui révolutionne la façon de se connecter dans le sport.

Voici trois étapes pour démarrer ton expérience :

1. **Renseigne tes disponibilités** pour recevoir tes premières demandes de missions ;
2. **Personnalise ton profil** pour mettre en avant tes compétences uniques ;
3. **Rejoins une communauté** soudée en parcourant le Blog Renford.
   Prêt à de nouvelles aventures entrepreneuriales avec **Renford**? Connecte-toi <a
   href="https://renford.fr"> **ici** </a>.

À très bientôt sur la plateforme,

_L'équipe Renford_

**_- Mail aux établissements_**

Bonjour Prénom Nom ,

Nous sommes ravis de vous accueillir au sein de Renford, votre nouvel allié dans la
recherche de talents exceptionnels pour des missions à la demande.

Pour tirer le meilleur parti de notre plateforme :

1. Mettez à jour votre profil - Assurez-vous que vos informations sont à jour pour attirer
   les meilleurs Renfords ;
2. Planifiez votre prochaine mission - Envoyez-nous votre première demande de mission ;

3. Parcourez le blog Renford pour vous tenir au courant des dernières actualités sportives.

Votre réussite est notre priorité. Pour toute question ou besoin d'assistance, n'hésitez pas à
contacter notre support dédié.

Prêt à débuter? Connectez-vous et lancez votre première mission <a
href="https://renford.fr"> **ici** </a>.

Au plaisir de contribuer au succès de **Raison sociale**

À très bientôt sur la plateforme,

_L'équipe Renford_

**ANNEXE 16 : Type de “mission” préférés pour les Renfords.**

Coaching Individuel :

```
● Séances de coaching personnalisé pour un client unique.
● Accompagnement spécifique sur des objectifs particuliers (perte de poids,
préparation physique, rééducation, etc.).
```

Sessions en Groupe :

```
● Cours collectifs (yoga, Pilates, Zumba, etc.).
● Entraînements en petit groupe (3-5 personnes) pour un suivi semi-personnalisé.
```

Ateliers et Workshops :

```
● Sessions thématiques (nutrition, bien-être, techniques de respiration, etc.).
● Journées découvertes ou initiation à une nouvelle discipline.
```

Événements Spéciaux :

```
● Animation d’événements sportifs (marathons, tournois, compétitions internes,
etc.).
● Organisation et animation de team-building sportif pour entreprises.
```

Remplacement Temporaire :

```
● Remplacement d’un coach ou instructeur pour une durée déterminée (congé,
maladie, etc.).
● Gestion temporaire des activités sportives d’un établissement en l’absence du
personnel permanent.
```

Consultation et Accompagnement :

```
● Consultations en nutrition, diététique, ou bien-être mental.
```

```
● Conseils et élaboration de programmes personnalisés pour les clients de
l’établissement.
```

Programmes Spécifiques :

```
● Entraînement pour des événements spécifiques (préparation à un marathon,
triathlon, etc.).
● Programmes de remise en forme postnatal ou rééducation après blessure.
```

Encadrement d’Enfants et d’Adolescents :

```
● Animation de cours ou activités spécifiques pour enfants ou adolescents.
● Organisation de camps sportifs ou d’initiation à une discipline.
```

Formation et Certification :

```
● Sessions de formation pour les membres de l’établissement (premiers secours,
nouvelles techniques, etc.).
● Encadrement de sessions menant à une certification sportive.
```

Maintenance et Gestion des Équipements :

```
● Supervision de l'entretien et de la maintenance des équipements sportifs.
● Audit et conseils sur l’optimisation de l’espace et du matériel pour les activités
sportives.
```

Suivi et Évaluation des Clients :

```
● Bilan de santé et fitness des clients avec des rapports personnalisés.
● Suivi continu de la progression des clients avec des ajustements réguliers des
programmes.
```

Encadrement de Compétitions :

```
● Organisation et arbitrage de compétitions internes ou inter-clubs.
● Gestion logistique et animation de compétitions locales.
```

Animation d’activités de loisirs :

```
● Activités récréatives non-compétitives (randonnées, jeux d’équipe, etc.).
● Séances de relaxation ou méditation en groupe.
```

Séances d’initiation :

```
● Cours pour débutants dans une discipline spécifique (escalade, boxe, etc.).
● Sessions de découverte pour attirer de nouveaux membres.
```

Consulting en Amélioration des Performances :

```
● Analyse et optimisation des programmes d’entraînement de l’établissement.
```

```
● Recommandations sur l’adoption de nouvelles technologies ou méthodes
```

**ANNEXE 17 : TOUT AUTRE DOCUMENT UTILE NON MENTIONNÉ DANS LE PRÉSENT
CAHIER DES CHARGES.**

**- Modèle de facture à destination des Renfords (Facture pour Services Rendus)**

Lien Drive :
https://docs.google.com/document/d/1N76fhAbafZxNeGXsbjNcWdRiRHsMuJZf/edit?usp=s
haring&ouid=105634703658582654765&rtpof=true&sd=true (demander l’accès).

**- Modèle d’attestation de fin de mission pour les Renfords**

Lien Drive :
**https://docs.google.com/document/d/1Jxj8rtta0KQphEgi7zdyF62TkaVMdxepDb9d43iK7
hg/edit?usp=sharing** (demander l’accès).

**- Modèle d'attestation de vigilance URSSAF (obligatoire pour toute mission**
**dépassant 5 000 euros)**

Lien Drive :
**https://docs.google.com/document/d/11yUzqAWSP9fwM4CsxlI4g63PLjUyewvIHDfDxXcz
hTk/edit?usp=sharing** (demander l’accès).

**- Modèle de note de frais**

Lien Drive :
**https://docs.google.com/document/d/1BAOaedloOd11fpMD_C4s2EX0lbKA8G__s5y0hGd
ytiE/edit?usp=sharing** (demander l’accès).

**- Exemple de l’usage de l’IA pour le site (via malt.fr) :**

**- Page de chargement sur le site** **_renford.fr_**

<!DOCTYPE html>

<html lang="fr">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Page de Chargement</title>

<style>

.loading-container {

display: flex;

justify-content: center;

align-items: center;

position: fixed;

top: 0;

left: 0;

right: 0;

bottom: 0;

background-color: rgba(255, 255, 255, 1.7);

font-family: 'Comfortaa', cursive;

font-size: 1.5em;

color: #185280;

z-index: 9999;

}

.loading-text {

text-align: center;

display: flex;

align-items: center;

}

@keyframes spin {


from {transform: rotate(0deg);}

to {transform: rotate(360deg);}

}

.loading-icon {

border: 4px solid rgba(0,0,0,0.1);

border-radius: 50%;

border-top: 4px solid #3498db;

width: 24px;

height: 24px;

animation: spin 1s linear infinite;

margin-left: 10px;

}

</style>

</head>

<body>

<div id="loadingScreen" class="loading-container">

<div class="loading-text">

Échauffez-vous, l'aventure commence bientôt !<div class="loading-icon"></div>

</div>

</div>

<script>

setTimeout(function() {

document.getElementById('loadingScreen').style.display = 'none';

}, 4000); // 4000 millisecondes = 4 secondes


</script>

<!-- Ici, le reste du contenu de la page -->

</body>

</html>

**Annexe 3 : Algorithme de match-making (script adapté à l’environnement
Airtable)**

**// Auxiliary functions with enhanced logging
function parseDate(dateString) {
if (!dateString) return null;
const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10 ));
return new Date(year, month - 1 , day);
}**

**function isDepartmentClose(department1, department2) {
const closeDepartmentsMap = {
'Paris': ['Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne'],
'Seine-et-Marne': ['Val-de-Marne', 'Essonne'],
'Yvelines': ['Hauts-de-Seine', 'Val-d\'Oise', 'Essonne'],
'Essonne': ['Hauts-de-Seine', 'Val-de-Marne', 'Seine-et-Marne', 'Yvelines'],
'Hauts-de-Seine': ['Paris', 'Yvelines', 'Essonne', 'Val-de-Marne'],
'Seine-Saint-Denis': ['Paris', 'Val-d\'Oise', 'Val-de-Marne'],
'Val-de-Marne': ['Paris', 'Seine-Saint-Denis', 'Hauts-de-Seine', 'Essonne',
'Seine-et-Marne'],
'Val-d\'Oise': ['Yvelines', 'Seine-Saint-Denis']
};
const isClose = department1 === department2 || (closeDepartmentsMap[department1]
&& closeDepartmentsMap[department1].includes(department2));
console.log(`Comparaison de départements: ${department1} et ${department2} sont
proches? ${isClose}`);
return isClose;
}**

**function tariffMatch(freelancerRate, missionTariff) {
let match = false;
switch (missionTariff) {**

**case "Moins de 45 euros":
match = freelancerRate <= 55 ;
break;
case "Entre 45 et 59 euros de l'heure":
match = (freelancerRate >= 35 && freelancerRate <= 70 );
break;
case "Plus de 60 euros l'heure":
match = freelancerRate >= 50 ;
break;
}
console.log(`Comparaison de tarifs: ${freelancerRate}€ et '${missionTariff}'
correspondent? ${match}`);
return match;
}**

**function datesOverlap(missionStart, missionEnd, freelancerStart, freelancerEnd,
isUnlimitedAvailability) {
if (isUnlimitedAvailability === "checked") {
console.log(`Disponibilité illimitée pour le freelance, toujours
disponible.`);
return true;
}**

**let missionStartDate = parseDate(missionStart);
let missionEndDate = parseDate(missionEnd);
let freelancerStartDate = parseDate(freelancerStart);
let freelancerEndDate = parseDate(freelancerEnd);**

**let overlap = freelancerStartDate <= missionEndDate && freelancerEndDate >=
missionStartDate;
console.log(`Chevauchement des dates: du ${missionStart} au ${missionEnd} avec
${freelancerStart} - ${freelancerEnd}? ${overlap}`);
return overlap;
}**

**// Main function to match freelancers to missions
async function matchFreelancersToMissions() {
console.log("Début du matching des freelancers aux missions...");
const missionsTable = base.getTable('Details_Missions');
const usersTable = base.getTable('Users');
const missions = await missionsTable.selectRecordsAsync();
const users = await usersTable.selectRecordsAsync();**

**for (let mission of missions.records) {
let missionStatus = mission.getCellValueAsString('Statut');**

**if (missionStatus !== "Envoyée") continue;**

**let missionDept = mission.getCellValueAsString('Département IDF
Entreprise');
let missionTariff = mission.getCellValueAsString('Tranche tarifaire');
let missionType = mission.getCellValueAsString('Type de poste souhaité');
let missionExperience = mission.getCellValueAsString('Niveau
d\'expérience');
let missionStart = mission.getCellValueAsString('Date de début mission');
let missionEnd = mission.getCellValueAsString('Date de fin mission');**

**let suitableFreelancers = users.records.filter(freelancer => {
let freelancerDept = freelancer.getCellValueAsString('Département IDF');
let freelancerRate = Number(freelancer.getCellValueAsString('R-Calcul
prix à l\'heure'));
let freelancerTypes = freelancer.getCellValueAsString('Type de
mission').split(', '); // Assuming the cell returns a comma-separated string
let freelancerExperience = freelancer.getCellValueAsString('Niveau
d\'expérience');
let freelancerStart = freelancer.getCellValueAsString('Disponible à
partir de');
let freelancerEnd = freelancer.getCellValueAsString('Disponible
jusqu\'au');
let isUnlimitedAvailability = freelancer.getCellValue('Dispo illimité')
=== "checked";**

**return isDepartmentClose(missionDept, freelancerDept) &&
tariffMatch(freelancerRate, missionTariff) &&
datesOverlap(missionStart, missionEnd, freelancerStart,
freelancerEnd, isUnlimitedAvailability) &&
freelancerTypes.includes(missionType);
}).slice( 0 , 3 );**

**if (suitableFreelancers.length > 0 ) {
let freelancerNames = suitableFreelancers.map(f =>
f.getCellValueAsString('USER ID')).join(', ');
console.log(`Freelancers correspondants pour la mission ${mission.id}:
${freelancerNames}`);
await missionsTable.updateRecordAsync(mission.id,
{'RenfordsCorrespondants3': freelancerNames});
} else {
console.log(`Aucun freelancer correspondant trouvé pour la mission
${mission.id}.`);
await missionsTable.updateRecordAsync(mission.id,
{'RenfordsCorrespondants3': 'Aucun freelancer trouvé'});**

**}
}
console.log("Matching terminé.");
}**

**await matchFreelancersToMissions();**

**Annexe 4 : liste du matériel sportif éventuellement requis / demandé pour une
mission.**

**Coach Sportif Personnel :**

```
● Coach Fitness, Musculation, Cardio, CrossFit, Pilates, Yoga :
○ Tapis de yoga ou fitness
○ Élastiques de résistance
○ Haltères ou kettlebells
○ Corde à sauter
○ Gants de musculation
○ Serviette
○ Montre ou tracker de fitness
● Coach Nutrition :
○ Outils pour analyses corporelles (pèse-personne connecté, caliper pour mesurer la
graisse corporelle)
○ Tablettes pour les suivis nutritionnels
```

**Encadrant Sportif :**

```
● Encadrant Escalade :
○ Chaussons d'escalade
○ Harnais
○ Corde d'escalade
○ Système d'assurage
○ Casque
● Encadrant Natation :
○ Maillot de bain
○ Bonnet de bain
○ Lunettes de natation
○ Palmes
○ Planche de natation
● Encadrant Sports Collectifs (Football, Basketball, etc.) :
○ Ballons (football, basketball, handball)
○ Protège-tibias
○ Cônes d'entraînement
○ Chasubles
● Encadrant Sports de Combat (Boxe, Judo, etc.) :
○ Gants de boxe
○ Protège-tibias
```

```
○ Casques de protection
○ Kimono
○ Ceintures
● Encadrant Sports de Raquette (Tennis, Badminton, etc.) :
○ Raquettes
○ Balles ou volants
○ Cordages de rechange
○ Grip de raquette
● Encadrant Sports d’Hiver (Ski, Snowboard, etc.) :
○ Casque de ski
○ Gants
○ Lunettes de ski
○ Vêtements techniques (pantalon et veste de ski)
```

**Instructeur Spécialisé :**

```
● Instructeur Pilates, Yoga, Zumba, Danse, Stretching, CrossFit :
○ Tapis de yoga ou fitness
○ Briques de yoga
○ Sangle de yoga
○ Chaussures spécifiques pour la danse ou le CrossFit
● Instructeur Aquagym :
○ Maillot de bain
○ Équipements de flottaison
○ Aquadumbbells
○ Frites de piscine
● Instructeur Spinning/Cycling :
○ Vélo de spinning/cycling
○ Chaussures spécifiques pour pédales automatiques
○ Bidon d'eau
```

**Moniteur Sportif :**

```
● Moniteur Yoga, Pilates, Escalade, Natation, Plongée, Sports d'Hiver, Surf :
○ Matériel spécifique à chaque discipline (tapis, harnais, palmes, etc.)
○ Vêtements techniques
○ Équipements de sécurité (gilets, harnais, casques)
```

**Formateur Sportif :**

```
● Formateur en Techniques de Coaching, Préparation Physique, Sécurité Sportive, Santé et
Bien-être :
○ Matériel pédagogique (tablettes, projecteurs)
○ Outils de mesure pour les performances physiques (chronomètre, dynamomètre)
```

**Responsable de Programme :**

```
● Responsable Programme Fitness, Bien-être, Entraînement, Enfant/Adolescent, Senior :
○ Matériel d'évaluation (balances, mesureurs de tension artérielle)
○ Équipements adaptés aux différentes tranches d'âge (parcours de motricité, poids
légers)
```

**Consultant Sportif :**

```
● Consultant Stratégie Fitness, Nutrition Sportive, Préparation Mentale, Développement de
Programme Sportif :
○ Tablettes ou ordinateurs portables pour les analyses et présentations
○ Outils de mesure corporelle
```

**Kinésithérapeute du Sport :**

```
● Spécialiste Rééducation Sportive, Massage Sportif, Prévention des Blessures :
○ Tables de massage
○ Huiles ou crèmes de massage
○ Bandages élastiques
○ Outils pour thérapie par pression
```

**Professeur de Yoga/Pilates :**

```
● Yoga Hatha, Vinyasa, Ashtanga, Nidra, Pilates Reformer, Pilates Matwork :
○ Tapis de yoga
○ Reformer Pilates (pour cours spécifiques)
○ Briques de yoga
○ Sangles
```

**Animateur Sportif :**

```
● Animateur Activités Physiques Adaptées (APA), Loisirs Sportifs, Sports de Plein Air :
○ Matériel adapté aux activités physiques adaptées
○ Équipements de sécurité pour les activités de plein air (casques, harnais)
```

**Autres Profils Sportifs :**

```
● Médiateur Sportif, Guide de Montagne, Référent Pédagogique Sportif, Technicien Sportif
(Matériel, Sécurité) :
○ Matériel de communication (radios, téléphones)
○ Équipements de sécurité pour guide de montagne (cordes, piolets)
○ Outils de maintenance pour technicien sportif
```

**Annexe 5 : Mail automatique à envoyer à l’utilisateur qui vient de soumettre
une demande de mission.**

Bonjour [Prénom EntrepriseValue], [Nom EntrepriseValue]
<br>
Nous avons bien reçu votre demande de mission et tenions à vous remercier pour votre
confiance envers Renford.
Votre demande est actuellement en cours de traitement et nous mettons tout en œuvre
pour vous proposer les profils correspondants à vos attentes.
Nous vous tiendrons informé très prochainement des avancées concernant la sélection des
Renfords.

Restant à votre disposition pour toute information supplémentaire.
<br>
Cordialement,
<br>
Nicolas de Renford

**Annexe 6 pour le modèle de devis**

Disponible sur le Drive
https://docs.google.com/document/d/1-EGvfWTfB72bjrm0Jtl0HGRJlxG14HeIhCUwObi9ils/
edit?usp=sharing _(demander l’accès)._

**Annexe 7 pour le modèle de contrat de prestation**

Disponible sur le Drive
https://docs.google.com/document/d/1Ps6ymRzXcTt3l3uZQJTdGHFzsJRrnQqO/edit?usp=s
haring&ouid=105634703658582654765&rtpof=true&sd=true _(demander l’accès)._

**Annexe 8 pour les liens vers les API et la documentation Banque populaire**

Lien vers le système d’exploitation: https://paiement.systempay.fr/doc/fr-FR/

Lien site BPVF pour les avantages du service :
https://www.banquepopulaire.fr/valdefrance/professionnels/gerer-developper-activite/encaisser-pai
ements-e-mail-sms-paiement-express/

https://www.banquepopulaire.fr/valdefrance/professionnels/gerer-developper-activite/encaisser-pai
ements-ligne-securises/

**Annexe 9 pour mail de rappel aux entreprises n’ayant pas signé le devis :**

Bonjour Prénom EntrepriseValue Nom EntrepriseValue,

Nous vous avons contacté il y a quelques jours car nous avons identifié un profil de Renford
parfaitement adapté à vos besoins pour votre demande de mission : **Prénom (from Users)
(from RenfordsCorrespondants)Value** a accepté votre demande et sera votre Renford pour
toute la durée de la mission. Ses compétences et son expérience correspondent
précisément à vos critères.

Merci de bien vouloir suivre les étapes suivantes afin de commencer au plus vite la mission :

- **Validation et signature du devis** : vous trouverez <a href=" lien devis perso "> **ici** </a> le
  devis à signer ainsi que les informations bancaires à ajouter ou à modifier.
- **Signature du contrat de prestation** : dès le devis signé, le contrat de prestation de
  service vous sera envoyé via Docusign.

Tous vos documents seront ensuite disponibles dans votre espace via l'onglet "Mes
missions".

Nous sommes impatients de commencer et restons disponibles pour toute question.

Bien cordialement,

Nicolas de chez Renford

**Annexe 10 pour le modèle de facture finale & d’attestation de mission pour les
Etablissements :**

- Modèle de facture finale pour services et commissions pour les Etablissements
  Disponible sur le Drive
  https://docs.google.com/document/d/14P_Gam_5LERJodcPbjeW8jIVwVn6fdze/edi
  t?usp=sharing&ouid=105634703658582654765&rtpof=true&sd=true _(demander_
  _l’accès)._
  **- Modèle d’attestation de réalisation de mission pour les Établissements** Lien Drive
  :
  **https://docs.google.com/document/d/1-8zqpbGS0X2VqwhMtgiLyBR3yjLxLXjrObX**
  **gq_IWKjE/edit?usp=sharing** (demander l’accès).

**Annexe BIS : Modèle de Mail signature du devis, du contrat et paiement
demandé**

Bonjour Prénom EntrepriseValue, Nom EntrepriseValue ,

Nous avons le plaisir de vous annoncer que nous avons identifié un profil de Renford
parfaitement adapté à vos besoins pour votre demande de mission : **Prénom (from Users)
(from RenfordsCorrespondants)Value** a accepté votre demande et sera votre Renford
pour toute la durée de la mission. Ses compétences et son expérience correspondent
précisément à vos critères.

_Les étapes suivantes :_

- **Validation et signature du devis** : vous trouverez <a href=" lien devis perso
    "> **ici** </a> le devis à signer ainsi que les informations bancaires à ajouter ou à
  modifier.

- **Signature du contrat de prestation** : dès le devis signé, le contrat de prestation de
  service vous sera également envoyé via Docusign.

Tous vos documents seront ensuite disponibles dans votre espace via l'onglet "Mes
missions".

Nous sommes impatients de commencer et restons disponibles pour toute question.

Bien cordialement,

_Nicolas de chez Renford_

**Annexe 11 pour la liste des diplômes dans le sport.**

**1. Diplômes Universitaires :**

```
● Licence STAPS (Sciences et Techniques des Activités Physiques et Sportives) :
○ Mention "Entraînement Sportif"
○ Mention "Activité Physique Adaptée"
○ Mention "Éducation et Motricité"
○ Mention "Management du Sport"
● Master STAPS :
○ Entraînement et Optimisation de la Performance Sportive
○ Activités Physiques Adaptées et Santé
○ Ingénierie et Ergonomie de l’Activité Physique
○ Management du Sport
● Doctorat en Sciences du Sport :
○ Recherche spécialisée dans un domaine précis du sport (physiologie, psychologie,
sociologie, etc.)
```

**2. Diplômes d'État :**

```
● BPJEPS (Brevet Professionnel de la Jeunesse, de l’Éducation Populaire et du Sport) :
○ Spécialités : Activités Gymniques, de la Forme et de la Force (AGFF), Activités
Aquatiques et de la Natation, Activités Physiques pour Tous, Activités de la
Randonnée, etc.
● DEJEPS (Diplôme d’État de la Jeunesse, de l’Éducation Populaire et du Sport) :
○ Spécialités : Perfectionnement Sportif, Développement de Projets, Territoires et
Réseaux.
● DESJEPS (Diplôme d’État Supérieur de la Jeunesse, de l’Éducation Populaire et du
Sport) :
○ Spécialités : Direction de Projets et de Structures Territoriales, Entraînement
Sportif, Animation Socio-éducative.
```

**3. Certificats et Formations Professionnelles :**

```
● CQP (Certificat de Qualification Professionnelle) :
○ Moniteur d’escalade, Instructeur de fitness, Coach en musculation, etc.
```

```
● Brevets Fédéraux :
○ Issus des fédérations sportives, ces brevets permettent d’encadrer des activités
sportives spécifiques à chaque discipline.
```

**4. Diplômes Spécifiques aux Disciplines :**

```
● BEES (Brevet d’État d’Éducateur Sportif) :
○ Bien que progressivement remplacé par les BPJEPS et autres diplômes d'État,
certains BEES restent actifs pour des spécialités comme l'escalade, le ski, le surf,
etc.
● Certificat d'Aptitude à l'Enseignement de la Danse (CAED) :
○ Pour les disciplines de danse classique, contemporaine, et jazz.
```

**5. Diplômes de Kinésithérapie et Préparation Physique :** 1. **Diplôme d’État de Masseur-Kinésithérapeute :**
○ Spécialisation possible en kinésithérapie sportive. 2. **Diplôme de Préparateur Physique :**
○ Formation spécialisée souvent obtenue après une licence ou un master en STAPS.

**Annexe 12 pour la liste des niveaux de qualification sur Renford :**

“Débutant (moins de 2 ans d'expérience)”, “Confirmé (entre 5 et 10 ans d’expérience)” et
“Expert (plus de 10 ans d’expérience)”.

**Annexe 13 : Mail aux Renfords pour notification nouvelle mission**

Bonjour Prénom (from Users) (from RenfordsCorrespondants)Value ,
<br>
Nous sommes ravis de t'annoncer que nous avons identifié une mission qui pourrait
parfaitement correspondre à ton profil sur Renford. Voici les détails :

Mission : Type de poste souhaité

Établissement : Raison sociale EntrepriseValue

Lieu : Adresse complète

Date : Plage de la mission

Rémunération : tarif à l’heure ou tarif de la prestation

Si cette mission t'intéresse et que tu es disponible, merci de nous répondre :
● Soit en te connectant sur ton profil <a href="https://renford.fr">Renford</a> et en
cliquant sur la notification de demande de mission ;
● Soit en répondant directement à ce mail ;

● Tu peux également nous contacter directement, si tu as besoin de plus
d'information avant de prendre ta décision, via notre hotline (numéro 06 64 39 26
28, non surtaxé).
Une réponse rapide serait appréciée pour assurer la satisfaction de l'ensemble de nos
utilisateurs.
Nous sommes en tout cas impatients de collaborer avec toi.
<br>
Cordialement,
<br>
Seren de chez Renford

**Annexe 14 : FAQ (générale, celle des renfords et celle des entreprises ?)**

- **FAQ général** , accessible directement depuis la Home page : renford.fr

```
● FAQ pour les Renfords :
○ Comment puis-je trouver des missions sur Renford?
■ Complète ton profil et mets à jour tes disponibilités pour recevoir
des propositions de missions adaptées à tes compétences et
préférences.
○ Renford est-il gratuit pour les indépendants?
■ Renford est totalement gratuit pour les indépendants sportifs. Il n'y a
aucun frais caché! Ce sont les entreprises qui supportent les frais de
service.
○ Comment Renford assure-t-il la conformité réglementaire pour les missions?
■ Nous veillons à ce que toutes les missions respectent les normes
légales et réglementaires, assurant ainsi sécurité et transparence
pour tous les utilisateurs.
○ Comment fonctionne la mise en relation?
■ Les missions sont attribuées en fonction de la correspondance entre
tes compétences, tes disponibilités et les besoins spécifiques des
établissements sportifs.
○ Comment gérer mes paiements et factures sur Renford?
```

```
■ Toutes tes transactions financières sont automatisées. Tu recevras
tes paiements directement via la plateforme une fois la mission
validée par l'établissement sportif.
○ Comment puis-je bénéficier de conseils professionnels sur Renford?
■ Notre équipe d'experts est disponible pour te fournir des conseils
personnalisés via notre service de support, accessible par chat,
email ou téléphone.
○ Que faire si je dois annuler une mission acceptée?
■ Si tu dois annuler une mission, fais-le au moins 24 heures à l'avance
pour éviter toute pénalité. Les annulations tardives ou les absences
entraîneront une suspension temporaire de ton compte pour 7 jours,
avec possibilité de justifier ta situation. En cas de circonstances
exceptionnelles reconnues comme forces majeures, aucune sanction
ne sera appliquée.
```

```
Si deux désistements tardifs ou absences surviennent dans un
intervalle de 30 jours, ton compte pourrait être suspendu
définitivement. Nous nous engageons à minimiser l'impact sur les
entreprises clientes en cherchant des remplaçants efficacement.
```

**● FAQ pour les Établissements :**
○ Est-ce que Renford est gratuit pour les établissements sportifs?
■ L'utilisation de la plateforme Renford est gratuite, avec une
commission prélevée uniquement sur les missions complétées.
L'édition de documents administratifs, tels que les contrats et les
factures, est entièrement gratuite et incluse dans notre offre,
permettant une gestion simplifiée et sans coûts additionnels pour les
établissements sportifs.
○ Comment fonctionne la mise en relation sur Renford?
■ Renford utilise un algorithme avancé de matching pour connecter les
établissements sportifs avec des professionnels qualifiés selon les
compétences requises, la disponibilité et les préférences
géographiques. Vous pouvez poster une mission et recevoir des
propositions de candidats qualifiés en quelques clics.Renford est
notamment accompagné de juristes afin de produire des contrats
normés et légaux.
○ Comment Renford simplifie-t-il les démarches administratives pour les
établissements sportifs?
■ Renford réduit la charge administrative en automatisant la création
et la gestion des contrats, des factures et des attestations. Notre
plateforme facilite également le suivi des missions et assure la
conformité réglementaire, vous permettant de vous concentrer
pleinement sur votre activité principale sans vous soucier des tâches
administratives.
○ Renford répond-il à la réglementation?

```
■ Oui, Renford assure la conformité avec les normes légales et
réglementaires en vigueur dans le secteur sportif, facilitant la
gestion administrative et la conformité pour vos missions et
contrats.
○ Quel support Renford offre-t-il aux établissements sportifs?
■ Les missions sont attribuées en fonction de la correspondance entre
tes compétences, tes disponibilités et les besoins spécifiques des
établissements sportifs.
○ Qu'advient-il si un professionnel ne se présente pas ou annule à la dernière
minute?
■ Renford s'engage à minimiser ces désagréments en offrant des
solutions de remplacement rapide ou en facilitant le processus de
recherche d'un autre professionnel qualifié. Des politiques de gestion
des absences sont en place pour garantir la fiabilité de nos services.
○ Est-ce que Renford peut aider à former nos employés?
■ Oui, en plus de la mise en relation avec des professionnels, Renford
propose des modules de formation et des ressources éducatives pour
aider vos employés à développer leurs compétences et à rester à
jour avec les dernières tendances du secteur sportif.
○ Quels sont les avantages de choisir Renford par rapport à d'autres
plateformes?
■ Renford se distingue par sa spécialisation dans le secteur sportif,
offrant une expertise et des outils adaptés spécifiquement aux
besoins des établissements sportifs pour une gestion plus efficace et
des résultats optimisés.
```

**ANNEXE 15 : Mail de bienvenu Renford et Établissement**

**_- Mail aux Renfords_**

Bonjour Prénom ,

Félicitations et bienvenue chez Renford! Tu fais désormais partie d'une communauté
dynamique qui révolutionne la façon de se connecter dans le sport.

Voici trois étapes pour démarrer ton expérience :

1. **Renseigne tes disponibilités** pour recevoir tes premières demandes de missions ;
2. **Personnalise ton profil** pour mettre en avant tes compétences uniques ;
3. **Rejoins une communauté** soudée en parcourant le Blog Renford.
   Prêt à de nouvelles aventures entrepreneuriales avec **Renford**? Connecte-toi <a
   href="https://renford.fr"> **ici** </a>.

À très bientôt sur la plateforme,

_L'équipe Renford_

**_- Mail aux établissements_**

Bonjour Prénom Nom ,

Nous sommes ravis de vous accueillir au sein de Renford, votre nouvel allié dans la
recherche de talents exceptionnels pour des missions à la demande.

Pour tirer le meilleur parti de notre plateforme :

1. Mettez à jour votre profil - Assurez-vous que vos informations sont à jour pour attirer
   les meilleurs Renfords ;
2. Planifiez votre prochaine mission - Envoyez-nous votre première demande de mission ;
3. Parcourez le blog Renford pour vous tenir au courant des dernières actualités sportives.

Votre réussite est notre priorité. Pour toute question ou besoin d'assistance, n'hésitez pas à
contacter notre support dédié.

Prêt à débuter? Connectez-vous et lancez votre première mission <a
href="https://renford.fr"> **ici** </a>.

Au plaisir de contribuer au succès de **Raison sociale**

À très bientôt sur la plateforme,

_L'équipe Renford_

**ANNEXE 16 : Type de “mission” préférés pour les Renfords.**

Coaching Individuel :

```
● Séances de coaching personnalisé pour un client unique.
● Accompagnement spécifique sur des objectifs particuliers (perte de poids,
préparation physique, rééducation, etc.).
```

Sessions en Groupe :

```
● Cours collectifs (yoga, Pilates, Zumba, etc.).
● Entraînements en petit groupe (3-5 personnes) pour un suivi semi-personnalisé.
```

Ateliers et Workshops :

```
● Sessions thématiques (nutrition, bien-être, techniques de respiration, etc.).
● Journées découvertes ou initiation à une nouvelle discipline.
```

Événements Spéciaux :

```
● Animation d’événements sportifs (marathons, tournois, compétitions internes,
etc.).
```

```
● Organisation et animation de team-building sportif pour entreprises.
```

Remplacement Temporaire :

```
● Remplacement d’un coach ou instructeur pour une durée déterminée (congé,
maladie, etc.).
● Gestion temporaire des activités sportives d’un établissement en l’absence du
personnel permanent.
```

Consultation et Accompagnement :

```
● Consultations en nutrition, diététique, ou bien-être mental.
● Conseils et élaboration de programmes personnalisés pour les clients de
l’établissement.
```

Programmes Spécifiques :

```
● Entraînement pour des événements spécifiques (préparation à un marathon,
triathlon, etc.).
● Programmes de remise en forme postnatal ou rééducation après blessure.
```

Encadrement d’Enfants et d’Adolescents :

```
● Animation de cours ou activités spécifiques pour enfants ou adolescents.
● Organisation de camps sportifs ou d’initiation à une discipline.
```

Formation et Certification :

```
● Sessions de formation pour les membres de l’établissement (premiers secours,
nouvelles techniques, etc.).
● Encadrement de sessions menant à une certification sportive.
```

Maintenance et Gestion des Équipements :

```
● Supervision de l'entretien et de la maintenance des équipements sportifs.
● Audit et conseils sur l’optimisation de l’espace et du matériel pour les activités
sportives.
```

Suivi et Évaluation des Clients :

```
● Bilan de santé et fitness des clients avec des rapports personnalisés.
● Suivi continu de la progression des clients avec des ajustements réguliers des
programmes.
```

Encadrement de Compétitions :

```
● Organisation et arbitrage de compétitions internes ou inter-clubs.
● Gestion logistique et animation de compétitions locales.
```

Animation d’activités de loisirs :

```
● Activités récréatives non-compétitives (randonnées, jeux d’équipe, etc.).
● Séances de relaxation ou méditation en groupe.
```

Séances d’initiation :

```
● Cours pour débutants dans une discipline spécifique (escalade, boxe, etc.).
● Sessions de découverte pour attirer de nouveaux membres.
```

Consulting en Amélioration des Performances :

```
● Analyse et optimisation des programmes d’entraînement de l’établissement.
● Recommandations sur l’adoption de nouvelles technologies ou méthodes
```

**ANNEXE 17 : TOUT AUTRE DOCUMENT UTILE NON MENTIONNÉ DANS LE PRÉSENT
CAHIER DES CHARGES.**

**- Modèle de facture à destination des Renfords (Facture pour Services Rendus)**

Lien Drive :
https://docs.google.com/document/d/1N76fhAbafZxNeGXsbjNcWdRiRHsMuJZf/edit?usp=s
haring&ouid=105634703658582654765&rtpof=true&sd=true (demander l’accès).

**- Modèle d’attestation de fin de mission pour les Renfords**

Lien Drive :
**https://docs.google.com/document/d/1Jxj8rtta0KQphEgi7zdyF62TkaVMdxepDb9d43iK7
hg/edit?usp=sharing** (demander l’accès).

**- Modèle d'attestation de vigilance URSSAF (obligatoire pour toute mission**
**dépassant 5 000 euros)**

Lien Drive :
**https://docs.google.com/document/d/11yUzqAWSP9fwM4CsxlI4g63PLjUyewvIHDfDxXcz
hTk/edit?usp=sharing** (demander l’accès).

**- Modèle de note de frais**

Lien Drive :
**https://docs.google.com/document/d/1BAOaedloOd11fpMD_C4s2EX0lbKA8G__s5y0hGd
ytiE/edit?usp=sharing** (demander l’accès).

\*\*- Exemple de l’usage de l’IA pour le site (via malt.fr) :

- Page de chargement sur le site\*\* **_renford.fr_**

<!DOCTYPE html>

<html lang="fr">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Page de Chargement</title>

<style>

.loading-container {

display: flex;

justify-content: center;

align-items: center;

position: fixed;

top: 0;

left: 0;

right: 0;

bottom: 0;


background-color: rgba(255, 255, 255, 1.7);

font-family: 'Comfortaa', cursive;

font-size: 1.5em;

color: #185280;

z-index: 9999;

}

.loading-text {

text-align: center;

display: flex;

align-items: center;

}

@keyframes spin {

from {transform: rotate(0deg);}

to {transform: rotate(360deg);}

}

.loading-icon {

border: 4px solid rgba(0,0,0,0.1);

border-radius: 50%;

border-top: 4px solid #3498db;

width: 24px;

height: 24px;

animation: spin 1s linear infinite;

margin-left: 10px;

}

</style>

</head>

<body>

<div id="loadingScreen" class="loading-container">

<div class="loading-text">

Échauffez-vous, l'aventure commence bientôt !<div class="loading-icon"></div>

</div>

</div>

<script>

setTimeout(function() {

document.getElementById('loadingScreen').style.display = 'none';

}, 4000); // 4000 millisecondes = 4 secondes

</script>

<!-- Ici, le reste du contenu de la page -->

</body>

</html>
