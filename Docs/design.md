# Présentation du Design de la Plateforme Renford

Voici une présentation structurée, page par page, du design de la plateforme Renford, incluant la description des fonctionnalités et le détail des champs de formulaire avec leurs types de données.

## I. Authentification et Inscription (Pages 1 à 7)

### Page 1-2 : Inscription (Sign-up)

**Description :** Interface de création de compte pour les nouveaux utilisateurs.

**Champs du formulaire :**

- **Email\*** : Texte (Email).
- **Mot de passe\*** : Texte (Mot de passe masqué).
- **Case à cocher** : Booléen (Acceptation CGV et politique de confidentialité).

**Actions :** Inscription via email ou bouton "S'inscrire avec Google".

### Page 3 : Connexion (Login)

**Description :** Accès aux comptes existants.

**Champs du formulaire :**

- **Email\*** : Texte (Email).
- **Mot de passe\*** : Texte (Mot de passe).

**Actions :** Connexion, Mot de passe oublié, Connexion avec Google.

### Page 4-5 : Informations de Contact

**Description :** Collecte des données personnelles de base après la création du compte.

**Champs du formulaire :**

- **Prénom (contact principal)** : Texte.
- **Nom (contact principal)** : Texte.
- **Numéro de téléphone** : Numérique/Tel.

### Page 6-7 : Choix du Rôle

**Description :** Sélection du type de profil utilisateur pour orienter le parcours.

**Champs du formulaire :**

- **Je suis...** : Boutons de sélection unique (Établissement ou Renford/Coach).

## II. Profil Établissement (Pages 8 à 11)

### Page 8-9 : Identité de l'Établissement

**Description :** Enregistrement des informations légales de la structure.

**Champs du formulaire :**

- **Raison sociale\*** : Texte.
- **Numéro SIRET (14 chiffres)\*** : Numérique (14 caractères).
- **Adresse de l'établissement\*** : Texte (Recherche d'adresse).
- **Code postal\*** : Numérique (5 chiffres).
- **Ville\*** : Texte.
- **Type d'établissement\*** : Menu déroulant (Sélection).
- **Adresse de facturation (si différente)** : Formulaire dépliable avec les mêmes champs d'adresse.

### Page 10-11 : Invitation de Favoris

**Description :** Ajout de coachs connus pour les notifier en priorité.

**Champs / Actions :**

- **Ajouter un Renford** : Texte (Nom/Email).
- **Importer via CSV** : Téléchargement de fichier.

## III. Profil Renford / Coach (Pages 15 à 24)

### Page 15 : Identité Légale

**Description :** Vérification de la conformité administrative de l'indépendant.

**Champs du formulaire :**

- **Numéro SIRET (14 chiffres)\*** : Numérique.
- **Statut (Auto-entrepreneur/EI/...)** : Case à cocher/Sélection.
- **Date de naissance\*** : Date (JJ/MM/AAAA).
- **Attestation de vigilance URSSAF** : Téléchargement de document (PDF/Image).

### Page 17-18 : Profil Public

**Description :** Mise en avant des compétences auprès des établissements.

**Champs du formulaire :**

- **Photo** : Téléchargement d'image.
- **Titre du profil** : Texte (ex: Coach Pilates).
- **Description du profil** : Zone de texte libre.
- **Type de mission** : Menu déroulant.
- **Certification Assurance RC Pro** : Case à cocher (Engagement sur l'honneur).

### Page 19-20 : Qualifications et Tarifs

**Description :** Détails techniques et financiers.

**Champs du formulaire :**

- **Niveau d'expérience** : Sélection (Débutant, Confirmé, Expert).
- **Diplôme(s) / Carte Pro** : Sélection et Téléchargement de justificatifs.
- **Tarif horaire** : Numérique (€/h).
- **Tarif journée / demi-journée** : Numérique (€) (Optionnel).

### Page 21-22 : Informations Bancaires (Stripe)

**Description :** Configuration des paiements.

**Champs du formulaire :**

- **IBAN** : Texte (Format FR...).
- **Carte d’identité** : Téléchargement de document.

### Page 23-24 : Disponibilités

**Description :** Paramétrage des créneaux de travail.

**Champs du formulaire :**

- **Jours de la semaine** : Multi-sélection (Lundi à Dimanche).
- **Dates (De/A)** : Date.
- **Zone de déplacement** : Curseur/Numérique (km).

## IV. Gestion des Missions (Pages 48 à 60)

### Page 48-51 : Type de Mission

**Description :** Choix entre un besoin urgent ou régulier.

**Sélection :** Renford Flex (ponctuel) ou Renford Coach (récurrent).

### Page 52-54 : Détails du Besoin

**Champs du formulaire :**

- **Sport concerné et Spécialité** : Menu déroulant.
- **Niveau d'expérience requis** : Sélection.
- **Matériels** : Menu déroulant (facultatif).
- **Description détaillée** : Zone de texte.

### Page 55-56 : Lieux et Tarification

**Champs du formulaire :**

- **Site d'exécution** : Menu déroulant (Sites pré-enregistrés).
- **Plages horaires** : Sélecteur de temps.
- **Tarif proposé** : Numérique.
- **Variation possible (+10/20/50%)** : Case à cocher.

### Page 58-59 : Paiement (Mandat SEPA)

**Description :** Enregistrement des coordonnées bancaires de l'établissement.

**Champs :**

- **Titulaire de la carte**
- **Numéro de carte/IBAN**
- **Date d'expiration**
- **CVC**

## V. Tableaux de Bord et Planning (Pages 64 à 78)

### Page 64-68 : Liste des Missions

**Description :** Suivi de l'état des demandes.

**Filtres :** En recherche, Confirmées, Terminées, Site d'exécution, Dates.

**Détail mission :** Visualisation du profil du coach, signature du contrat, et évaluation.

### Page 70-71 : Planning et Indisponibilités

**Description :** Vue calendrier des missions et gestion des congés.

**Champs d'indisponibilité :**

- **Journée entière** (Booléen)
- **Heure de début/fin**
- **Fréquence** (Tous les jours/semaines).

### Page 76-78 : Paramètres du Compte

**Description :** Gestion des informations personnelles et des factures.

**Sections :** Profil, Notifications, Gestion des sites (pour établissements multi-sites), Historique des factures téléchargeables.
