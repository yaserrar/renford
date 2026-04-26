# Renford — Cahier des Charges Simplifié

> Plateforme de mise en relation entre établissements sportifs et professionnels du sport indépendants.

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Utilisateurs de la plateforme](#2-utilisateurs-de-la-plateforme)
3. [Parcours Établissement — Inscription et onboarding](#3-parcours-établissement--inscription-et-onboarding)
4. [Parcours Renford — Inscription et onboarding](#4-parcours-renford--inscription-et-onboarding)
5. [Les deux modes de mission : FLEX et COACH](#5-les-deux-modes-de-mission--flex-et-coach)
6. [Parcours FLEX — Création de mission](#6-parcours-flex--création-de-mission)
7. [Parcours COACH — Création de mission](#7-parcours-coach--création-de-mission)
8. [Réponse à une mission — côté Renford](#8-réponse-à-une-mission--côté-renford)
9. [Signature du contrat et paiement](#9-signature-du-contrat-et-paiement)
10. [Clôture de la mission](#10-clôture-de-la-mission)
11. [Cycle de vie d'une mission — statuts](#11-cycle-de-vie-dune-mission--statuts)
12. [Algorithme de matching](#12-algorithme-de-matching)
13. [Système de paiement et commissions](#13-système-de-paiement-et-commissions)
14. [Abonnements](#14-abonnements)
15. [Documents générés automatiquement](#15-documents-générés-automatiquement)
16. [Notifications](#16-notifications)
17. [Évaluations](#17-évaluations)
18. [Module Administration](#18-module-administration)
19. [Règles métier](#19-règles-métier)
20. [Types d'établissements, postes et spécialisations](#20-types-détablissements-postes-et-spécialisations)
21. [Architecture technique](#21-architecture-technique)

---

## 1. Présentation du projet

**Renford** est une plateforme SaaS B2B qui met en relation des **établissements sportifs** (salles de sport, studios, clubs…) avec des **professionnels du sport indépendants** appelés **Renfords** (coachs, instructeurs, formateurs freelances).

### Problème résolu

Les établissements ont régulièrement besoin de remplacer un coach absent, de couvrir une période de forte fréquentation ou de lancer un nouveau cours. Trouver rapidement un professionnel qualifié, gérer le contrat, le paiement et les obligations légales (URSSAF, attestations) est aujourd'hui complexe et morcelé.

Renford centralise l'intégralité de ce processus en un seul outil.

### Ce que fait la plateforme

- **Matching** : algorithme automatique pour trouver le bon professionnel selon les critères de la mission
- **Gestion administrative** : contrats, devis, factures et attestations générés automatiquement
- **Paiement sécurisé** : via Stripe Connect, les fonds sont bloqués puis libérés automatiquement à la validation
- **Suivi** : tableau de bord, historique des missions, évaluations, statistiques

### Proposition de valeur

| Pour les Établissements                       | Pour les Renfords                               |
| --------------------------------------------- | ----------------------------------------------- |
| Accès immédiat à des profils vérifiés         | Accès à des missions qualifiées sans démarchage |
| Contrats et documents générés automatiquement | Paiements sécurisés et garantis                 |
| Paiement sécurisé via Stripe                  | Aucune commission prélevée sur ses revenus      |
| Gestion simplifiée des remplacements          | Gestion de son planning et de sa visibilité     |

---

## 2. Utilisateurs de la plateforme

### 2.1 Trois types d'utilisateurs

| Type               | Rôle                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Établissement**  | Publie des missions, sélectionne un Renford, signe les contrats, effectue les paiements, évalue                    |
| **Renford**        | Reçoit des propositions de mission, accepte ou refuse, signe les contrats, exécute, reçoit le paiement             |
| **Administrateur** | Gère la plateforme : certifie les profils, gère les litiges, configure les templates emails, suit les statistiques |

### 2.2 Statuts de compte

| Statut                       | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| `actif`                      | Compte opérationnel                                             |
| `en attente de vérification` | Profil Renford soumis, en attente de validation admin           |
| `suspendu`                   | Suspendu temporairement (ex : annulation tardive d'une mission) |
| `banni`                      | Banni définitivement                                            |
| `désactivé`                  | Désactivé par l'utilisateur lui-même                            |

---

## 3. Parcours Établissement — Inscription et onboarding

### Étape 1 — Création de compte

L'utilisateur s'inscrit en fournissant email et mot de passe. Un email de vérification est envoyé avec un code de confirmation.

### Étape 2 — Fiche établissement

L'utilisateur renseigne les informations de son établissement :

- **Nom officiel** de l'établissement
- **SIRET / SIREN**
- **Adresse complète** (rue, code postal, ville)
- **Numéro de téléphone**
- **Email principal**
- **Contact principal** (nom complet du directeur / responsable)
- **Type d'établissement** (salle de sport, studio yoga, club tennis… — voir section 20)

### Étape 2.1 — Établissement principal ou secondaire

L'utilisateur choisit entre deux statuts :

**"Je suis l'établissement principal"**

- Il peut rechercher parmi les établissements déjà inscrits sur Renford les sites secondaires rattachés à lui
- Il peut ajouter des établissements secondaires via un bouton "+ Ajouter un autre établissement" ; certaines informations (nom, adresse) sont pré-remplies pour aller plus vite
- L'abonnement et le quota de missions sont partagés entre tous les sites du groupe

**"Je suis un établissement secondaire"**

- L'utilisateur recherche le groupe principal auquel il appartient ; s'il n'est pas trouvé, il le renseigne manuellement
- Un établissement secondaire ne peut pas ajouter d'autres sites secondaires
- Il ne voit que ses propres statistiques (pas celles du groupe)

### Étape 3 — Profils favoris (facultatif)

L'utilisateur peut ajouter des Renfords connus (nom, email, téléphone) à sa liste de favoris :

- S'ils sont déjà inscrits sur Renford → le lien est créé automatiquement
- S'ils sont inconnus de la base → les données sont enregistrées à des fins de prospection
- Les favoris ont la **priorité maximale** dans l'algorithme de matching
- Cette étape est facultative — l'utilisateur peut la passer

### Étape 4 — Accès au tableau de bord

Une fois l'onboarding terminé, l'établissement accède à son espace personnel et peut créer des missions.

> Un établissement ne peut pas accéder au tableau de bord tant que l'onboarding n'est pas complété.

---

## 4. Parcours Renford — Inscription et onboarding

Un Renford est un professionnel du sport indépendant (freelance). Son profil doit être vérifié manuellement par un administrateur avant qu'il puisse recevoir des propositions de mission.

### Étape 1 — Création de compte

Inscription email + mot de passe + vérification de l'adresse email par code.

### Étape 2 — Informations générales

- Type(s) de mission (coach, encadrant escalade, formateur… — plusieurs choix possibles)
- Titre du profil (affiché publiquement)
- Description du profil
- Photo de profil

### Étape 3 — Qualifications et expérience

- Diplôme(s) obtenus + fichiers justificatifs à uploader
- Niveau d'expérience : **Débutant** (moins de 2 ans) · **Confirmé** (5 à 10 ans) · **Expert** (plus de 10 ans)
- Spécialisations (dépendent du type de poste choisi)

### Étape 4 — Tarification

- **Taux horaire** : entre 20 €/h et 200 €/h
- **Jauge de flexibilité** : de 0 % à -15 % (non affichée publiquement, utilisée uniquement par l'algorithme de matching pour élargir les correspondances)
- Tarifs demi-journée et journée complète (optionnels)

### Étape 5 — Disponibilités

- Type : **illimitée** (pas de limite de date) ou **plage de dates définie** (date de début / date de fin)
- Jours disponibles et créneaux horaires par jour

### Étape 6 — Documents

- Carte professionnelle
- IBAN (pour recevoir les paiements)
- Attestation de vigilance URSSAF
- Justificatif d'assurance professionnelle

### Étape 7 — Soumission et vérification

Une fois le profil soumis, son statut passe à **"en attente de vérification"**. Un administrateur vérifie manuellement les diplômes, la carte professionnelle, l'assurance et l'attestation URSSAF.

- Si **validé** → badge **"Certifié"** accordé + email de confirmation envoyé → accès aux missions débloqué
- Si **rejeté** → email d'explication envoyé → le Renford peut modifier son profil et soumettre à nouveau

> Un Renford non certifié ne reçoit aucune proposition de mission.

---

## 5. Les deux modes de mission : FLEX et COACH

Renford propose deux types de collaboration :

|                                | **FLEX**                              | **COACH**                                      |
| ------------------------------ | ------------------------------------- | ---------------------------------------------- |
| **Usage**                      | Remplacement ponctuel, mission courte | Collaboration longue durée, récurrente         |
| **Matching**                   | Algorithme automatique                | Shortlist 1-3 profils, l'établissement choisit |
| **Visioconférence**            | Non                                   | Oui — échange préalable entre les parties      |
| **Moment du hold Stripe**      | À la signature du contrat             | Dès la soumission de la mission                |
| **Annulation**                 | Sans préavis avant contrat            | Préavis 15 jours minimum après contrat         |
| **Commission sans abonnement** | 15 % sur le montant HT                | 375 € HT (forfait fixe)                        |

---

## 6. Parcours FLEX — Création de mission

### Étape 1 — Configuration des critères

L'utilisateur remplit un formulaire multi-étapes :

- **Établissement concerné** (liste déroulante si plusieurs sites)
- **Type de poste** (coach sportif, encadrant escalade… — plusieurs Renfords possibles sur une même mission via un bouton "+")
- **Niveau d'expérience requis** : Débutant / Confirmé / Expert
- **Dates et horaires** : date de début, date de fin, plages horaires par jour. Possibilité de créer plusieurs créneaux par jour et de copier les horaires d'un jour à l'autre
- **Méthode de tarification** :
  - _Horaire_ → fourchette : moins de 45 €/h · entre 45 et 59 €/h · plus de 60 €/h
  - _Forfait prestation_ → montant fixe avec indication journée entière ou demi-journée
  - _Dégressif selon le nombre de participants_ → même principe que le forfait, avec le nombre de participants prévu en plus
- **Description de la mission** (texte libre enrichi)
- **Matériel nécessaire** (liste dépendant du type de poste sélectionné)
- **Informations bancaires** de l'établissement (si non encore renseignées) :
  - Étape 1 : nom du titulaire, email, IBAN + mention légale SEPA
  - Étape 2 : nom de facturation, adresse, code postal, ville, pays, SIRET

### Étape 2 — Récapitulatif de mission

Page de synthèse reprenant tous les critères saisis. L'établissement peut modifier n'importe quel champ via une pop-up sans revenir en arrière. Il voit également une **estimation automatique du coût total HT** et du montant de la commission.

### Étape 3 — Validation et matching

Une fois la demande validée :

1. L'algorithme de matching sélectionne les Renfords compatibles (exécution toutes les 5 minutes)
2. Les Renfords sélectionnés reçoivent une **notification par email et par SMS**
3. Les Renfords peuvent accepter ou refuser depuis leur espace personnel
4. Dès qu'un Renford accepte → un devis est généré automatiquement et envoyé à l'établissement

---

## 7. Parcours COACH — Création de mission

### Étape 1 — Configuration des critères

Le formulaire est identique au FLEX avec des champs supplémentaires :

- Diplôme ou certification requis (optionnel)
- Nombre de personnes à encadrer
- Niveau du cours
- Prise en charge des frais de déplacement (oui / non)

### Étape 1.2 — Récapitulatif et validation

Page récapitulative identique au FLEX. L'établissement valide la demande.

### Étape 1.3 — Paiement sécurisé immédiat

Dès la validation de la mission COACH, l'établissement effectue immédiatement le paiement Stripe. Les fonds sont **bloqués (hold) mais non capturés** tant que le contrat n'est pas signé. Cela engage l'établissement tout en laissant le temps au matching de s'effectuer.

### Étape 2 — Shortlist interne

L'algorithme sélectionne **1 à 3 profils** pertinents, présentés à l'établissement avec :

- Photo, type de poste, expertise
- Expériences passées, diplômes, évaluations antérieures
- Lien pour planifier une visioconférence (généré automatiquement via Calendly)

> Aucun nom, prénom ou moyen de contact n'est visible à ce stade. L'identité complète n'est révélée qu'après sélection et signature du contrat.

### Étape 3 — Sélection du Renford

L'établissement peut programmer une visioconférence avec un profil de la shortlist. Renford assiste à cet échange. L'établissement accepte ou refuse chaque profil un par un.

Une fois un profil validé mutuellement après la visio :

- Le **contrat de prestation** est généré avec une **clause de préavis de 15 jours minimum** côté Renford
- Le contrat est envoyé pour signature électronique

### Étape 4 — Paiement et confirmation

Après signature du contrat par les deux parties :

- Les fonds bloqués sont confirmés et la mission est officiellement démarrée
- Les informations de contact complètes du Renford sont transmises à l'établissement
- La mission s'affiche dans les deux espaces (établissement et Renford)
- Les notifications calendaires et rappels sont activés
- L'établissement ne peut plus consulter les autres profils de la shortlist

---

## 8. Réponse à une mission — côté Renford

Lorsqu'une mission compatible est trouvée par l'algorithme, le Renford reçoit :

- Une notification par **email**
- Une notification par **SMS**
- Une notification dans son **tableau de bord**

Il consulte les détails de la mission et choisit :

**Accepter** → un devis est automatiquement généré et envoyé à l'établissement

**Refuser** → la mission est remise en matching pour d'autres Renfords disponibles

---

## 9. Signature du contrat et paiement

### Côté Établissement — après acceptation du Renford

L'établissement reçoit un **email unique** contenant :

- Le **devis détaillé** en pièce jointe (tarif, durée, services)
- Un bouton **"J'accepte la proposition"** renvoyant vers l'espace mission

Dans l'espace mission, l'établissement :

1. Clique "J'accepte la proposition"
2. Le **contrat de prestation** est généré automatiquement
3. Le contrat est envoyé aux deux parties pour **signature électronique** (Yousign / DocuSign / PandaDoc)
4. Des rappels automatiques sont envoyés si le contrat n'est pas signé à J+1 et J+2

Une fois le contrat signé par les deux parties :

- Pour **FLEX** → le paiement est mis en **hold** chez Stripe
- Pour **COACH** → le hold déjà réalisé lors de la soumission est confirmé
- La mission est ajoutée au **calendrier** des deux parties avec des rappels

---

## 10. Clôture de la mission

### Validation par l'établissement

À la fin de la mission, l'établissement valide le travail effectué via un formulaire :

| Question                                          | Type de réponse                                 |
| ------------------------------------------------- | ----------------------------------------------- |
| La prestation a-t-elle répondu à vos attentes ?   | Oui / Non (champ texte si Non)                  |
| Souhaitez-vous ajouter ce Renford à vos favoris ? | Oui / Non                                       |
| Qualité du service fourni                         | Excellent / Très bien / Bien / Moyen / Médiocre |
| Satisfaction envers la plateforme                 | 1 à 5 étoiles                                   |
| Satisfaction globale de la prestation             | 1 à 5 étoiles                                   |
| Commentaires libres                               | Texte                                           |

En parallèle, l'établissement peut :

- **Signaler une absence** du Renford : nom complet, dates (début/fin), motif (autre mission imprévue · problème de communication · problème de disponibilité · absence non prévue · autre), commentaire
- **Ajuster la durée** de la mission : nouveaux horaires début/fin, motif (retard de démarrage · problème imprévu · prolongation · changement des besoins · autre), commentaire

### Déblocage des fonds et envoi des documents

Une fois la mission validée par l'établissement, le paiement est libéré et les documents sont envoyés automatiquement.

**Le Renford reçoit :**

- La notification de paiement avec le montant net versé
- Sa facture pour services
- L'attestation de mission

**L'établissement reçoit :**

- La notification de l'envoi des fonds
- La facture finale (services + commission)
- L'attestation de réalisation de mission
- L'attestation de vigilance URSSAF du Renford (obligatoire si la mission dépasse 5 000 €)

### Archivage

Tous les documents (contrat, factures, bordereaux de paiement, attestations) sont archivés dans le dossier de la mission. Le tableau de bord de chaque partie est mis à jour avec les nouvelles statistiques.

---

## 11. Cycle de vie d'une mission — statuts

```
envoyée
   ↓
en_cours_de_matching
   ↓
proposée            ← Renfords notifiés
   ↓
acceptée            ← Renford accepte
   ↓
contrat_signé       ← Signatures des deux parties
   ↓
payée               ← Hold Stripe confirmé
   ↓
en_cours            ← Date de début atteinte
   ↓
à_valider           ← Date de fin atteinte
   ↓
validée             ← Établissement valide
   ↓
terminée            ← Évaluations complètes
   ↓
archivée

━━━ À tout moment ━━━
annulée
```

---

## 12. Algorithme de matching

L'algorithme s'exécute automatiquement **toutes les 5 minutes**. Il peut également être déclenché manuellement par un administrateur depuis le back-office.

### Critères de sélection

| Critère                                                 | Importance |
| ------------------------------------------------------- | ---------- |
| Renford dans les favoris de l'établissement             | Maximale   |
| Type de poste correspondant                             | Élevée     |
| Niveau d'expérience correspondant                       | Élevée     |
| Disponibilités compatibles avec les dates de la mission | Élevée     |
| Localisation (même département ou département adjacent) | Moyenne    |
| Tarif du Renford dans la fourchette demandée            | Moyenne    |
| Diplômes correspondant à l'exigence de la mission       | Moyenne    |
| Note moyenne et historique de missions                  | Moyenne    |
| Spécialisations correspondantes                         | Faible     |

### Tolérance tarifaire

| Fourchette demandée | Plage acceptée côté Renford |
| ------------------- | --------------------------- |
| Moins de 45 €/h     | Jusqu'à 55 €/h              |
| Entre 45 et 59 €/h  | Entre 35 € et 70 €/h        |
| Plus de 60 €/h      | À partir de 50 €/h          |

### Géographie — Île-de-France

Les départements suivants sont considérés proches pour le matching :

- Paris ↔ Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne
- Hauts-de-Seine ↔ Paris, Yvelines, Essonne, Val-de-Marne
- Yvelines ↔ Hauts-de-Seine, Val-d'Oise, Essonne
- Essonne ↔ Hauts-de-Seine, Val-de-Marne, Seine-et-Marne, Yvelines
- Val-de-Marne ↔ Paris, Seine-Saint-Denis, Hauts-de-Seine, Essonne, Seine-et-Marne
- Seine-Saint-Denis ↔ Paris, Val-d'Oise, Val-de-Marne
- Val-d'Oise ↔ Yvelines, Seine-Saint-Denis
- Seine-et-Marne ↔ Val-de-Marne, Essonne

---

## 13. Système de paiement et commissions

### Architecture

Renford utilise **Stripe Connect** en mode marketplace. Les fonds transitent par la plateforme avant redistribution.

```
Établissement → Stripe (capture + hold)
                        ↓
             Mission validée par l'établissement
                        ↓
             Commission déduite par Renford (plateforme)
                        ↓
             Virement net au Renford
```

### Commissions

| Mode         | Avec abonnement          | Sans abonnement (à la carte) |
| ------------ | ------------------------ | ---------------------------- |
| FLEX         | Inclus dans l'abonnement | 15 % sur le montant HT       |
| COACH        | Inclus dans l'abonnement | 375 € HT forfaitaire         |
| Côté Renford | **0 %**                  | **0 %**                      |

### Moment du hold selon le mode

- **FLEX** : hold créé au moment de la **signature du contrat** par les deux parties
- **COACH** : hold créé dès la **soumission de la mission** par l'établissement

### Méthodes de tarification disponibles

| Méthode            | Description                                    |
| ------------------ | ---------------------------------------------- |
| Horaire            | Tarif à l'heure selon la fourchette choisie    |
| Forfait prestation | Montant fixe pour l'ensemble de la mission     |
| Dégressif          | Tarif variable selon le nombre de participants |

---

## 14. Abonnements

### Plans disponibles

| Plan             | Missions incluses / période | Prix HT / mois | Activation                   |
| ---------------- | --------------------------- | -------------- | ---------------------------- |
| **Échauffement** | 10 missions                 | 99 €           | Self-serve (Stripe Checkout) |
| **Performance**  | 25 missions                 | 199 €          | Self-serve (Stripe Checkout) |
| **Compétition**  | Illimitées                  | Tarif négocié  | Manuel via admin             |

Sans abonnement → mode **à la carte** avec commission par mission.

### Règles de quota

- La période de quota correspond au **cycle de facturation Stripe** (pas nécessairement le 1er du mois — dépend de la date d'activation de l'abonnement)
- Le quota est **mutualisé** entre tous les sites d'un même groupe (principal + secondaires)
- Quand le quota est épuisé → la création de mission est bloquée avec une invitation à upgrader le plan
- L'abonnement **Compétition** est créé manuellement par un administrateur après négociation commerciale

### Statuts d'abonnement

| Statut       | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `en attente` | Paiement initial non encore confirmé                           |
| `actif`      | Abonnement en cours, quota disponible                          |
| `en pause`   | Paiement échoué — accès restreint en attente de régularisation |
| `annulé`     | Résilié explicitement par l'établissement ou l'admin           |
| `expiré`     | Fin de période sans renouvellement                             |

---

## 15. Documents générés automatiquement

| Document                              | Déclencheur                             | Destinataires                                       |
| ------------------------------------- | --------------------------------------- | --------------------------------------------------- |
| **Devis**                             | Le Renford accepte la mission           | Établissement                                       |
| **Contrat de prestation de services** | Devis accepté par l'établissement       | Les deux parties (pour signature électronique)      |
| **Facture**                           | Mission validée par l'établissement     | Les deux parties                                    |
| **Attestation de mission**            | Mission terminée                        | Les deux parties                                    |
| **Attestation de vigilance URSSAF**   | Mission dépassant 5 000 € (obligatoire) | Fournie par le Renford, transmise à l'établissement |
| **Bordereau de paiement**             | Paiement effectué                       | Les deux parties                                    |

Tous les documents sont au format **PDF**. Les factures respectent la norme **Facture-X** (conformité facturation électronique 2026). L'ensemble des documents est archivé dans le dossier de la mission.

---

## 16. Notifications

### Canaux disponibles

| Canal          | Usage                                                       |
| -------------- | ----------------------------------------------------------- |
| **Email**      | Toutes les actions importantes (47 templates distincts)     |
| **SMS**        | Alertes urgentes : nouvelle mission disponible, rappels J-2 |
| **Dashboard**  | Notifications in-app en temps réel                          |
| **Calendrier** | Rappels de mission (Google Calendar)                        |

Les préférences de notification de chaque utilisateur sont configurables par canal et par type d'événement.

### Principaux événements notifiés

**Compte et authentification**

- Code de vérification email
- Bienvenue après inscription (établissement et Renford)
- Compte certifié ou rejeté (Renford)
- Réinitialisation de mot de passe

**Missions**

- Nouvelle mission disponible (Renford)
- Mission acceptée / refusée
- Contrat disponible pour signature + rappels automatiques à J+1 et J+2 si non signé
- Mission démarrée / à valider / terminée / annulée

**Paiements et documents**

- Paiement reçu (Renford)
- Facture disponible (Établissement)
- Devis et attestations disponibles

**Abonnements**

- Abonnement activé / renouvelé
- Échec de paiement de l'abonnement
- Quota bientôt atteint

**Évaluations**

- Rappels d'évaluation à J+1, J+2 et J+5 si l'évaluation n'a pas été soumise

**Alertes certifications**

- Attestation URSSAF bientôt expirante
- Assurance professionnelle à renouveler

---

## 17. Évaluations

Les évaluations sont disponibles uniquement après la fin d'une mission. Une évaluation soumise ne peut plus être modifiée. Des rappels automatiques sont envoyés à J+1, J+2 et J+5.

### L'Établissement évalue le Renford

| Question                                          | Réponse                                         |
| ------------------------------------------------- | ----------------------------------------------- |
| La prestation a-t-elle répondu à vos attentes ?   | Oui / Non (champ texte si Non)                  |
| Souhaitez-vous ajouter ce Renford à vos favoris ? | Oui / Non                                       |
| Qualité du service fourni                         | Excellent · Très bien · Bien · Moyen · Médiocre |
| Satisfaction envers la plateforme                 | 1 à 5 étoiles                                   |
| Satisfaction globale de la prestation             | 1 à 5 étoiles                                   |
| Commentaires libres                               | Texte                                           |

### Le Renford évalue l'Établissement

| Question                                | Réponse        |
| --------------------------------------- | -------------- |
| Qualité des conditions de travail       | 1 à 5 étoiles  |
| Recommanderiez-vous cet établissement ? | Oui / Non      |
| Problèmes rencontrés                    | Texte libre    |
| Aspects les plus satisfaisants          | Choix multiple |
| Satisfaction envers la plateforme       | 1 à 5 étoiles  |
| Commentaires libres                     | Texte          |

**Aspects satisfaisants disponibles (choix multiple) :**
Qualité du travail réalisé · Professionnalisme de l'équipe · Respect des délais · Communication efficace · Adaptabilité aux besoins spécifiques · Compétences techniques / expertise · Collaboration harmonieuse avec l'équipe en place · Clarté des instructions données · Résolution rapide des problèmes · Valeur ajoutée apportée à la mission

---

## 18. Module Administration

L'interface admin (accessible via `/admin`) est réservée aux utilisateurs de type `administrator`.

### Gestion des utilisateurs

- Lister tous les comptes avec filtres (nom, statut, date d'inscription, missions)
- Modifier, suspendre, bannir ou supprimer un compte
- **Certifier ou rejeter** un profil Renford après vérification manuelle des documents
- Créer manuellement un compte établissement ou Renford

### Gestion des missions

- Voir toutes les missions avec filtres avancés (statut, date, type, établissement)
- Modifier ou annuler une mission
- Assigner manuellement un Renford à une mission
- Gérer les litiges entre les parties
- Déclencher manuellement l'algorithme de matching

### Gestion des paiements et abonnements

- Consulter toutes les transactions Stripe
- Effectuer des remboursements manuels
- Gérer tous les abonnements actifs
- Créer un abonnement **Compétition** avec tarif négocié pour un établissement

### Gestion des templates d'emails (47 templates)

Chaque template possède :

- Des **valeurs par défaut** définies dans le code (sujet, titre, introduction, texte de clôture, label du bouton CTA)
- Des **valeurs personnalisées** saisissables par l'admin et stockées en base de données
- La règle d'affichage : **la valeur personnalisée prend le dessus** sur la valeur par défaut si elle est renseignée
- Une **prévisualisation des valeurs effectives** disponible avant enregistrement

### Tableau de bord analytique

- Nombre d'utilisateurs actifs (Renfords et Établissements)
- Missions publiées / en cours / terminées
- Taux d'acceptation des propositions
- Volume de transactions et revenus de la plateforme
- Analyse des performances et tendances

---

## 19. Règles métier

### Politique d'annulation

| Qui annule    | Quand                              | Conséquence                                   |
| ------------- | ---------------------------------- | --------------------------------------------- |
| Renford       | Plus de 24h avant la mission       | Aucune pénalité                               |
| Renford       | Moins de 24h avant la mission      | Suspension du compte 7 jours                  |
| Renford       | 2 annulations tardives en 30 jours | Suspension permanente du compte               |
| Établissement | Avant signature du contrat         | Aucune pénalité — remboursement si mode COACH |
| Établissement | Après signature du contrat         | Selon les termes du contrat                   |

### Obligation URSSAF

Pour toute mission dépassant **5 000 €**, l'attestation de vigilance URSSAF est **obligatoire** (Article L.8222-1 du Code du travail). La plateforme alerte automatiquement le Renford à l'approche de l'expiration de son attestation.

### Certification des profils Renford

La certification est accordée après vérification manuelle d'un admin. Éléments vérifiés : diplômes et justificatifs, carte professionnelle, assurance professionnelle, attestation URSSAF. Les profils certifiés reçoivent le badge **"Certifié"** et sont prioritaires dans le matching.

### Mode COACH — préavis d'annulation

Un préavis de **15 jours minimum** est requis côté Renford pour toute annulation après signature du contrat d'une mission COACH.

### Confidentialité en mode COACH

L'établissement ne voit **aucune coordonnée** du Renford (ni nom, ni prénom, ni email, ni téléphone) pendant la phase de shortlist. Ces informations ne sont transmises qu'après signature du contrat.

### Hiérarchie des établissements

- Les sites secondaires ne peuvent pas ajouter d'autres sites secondaires
- Le quota d'abonnement est mutualisé entre tous les sites du groupe
- Un site secondaire n'a accès qu'à ses propres statistiques

---

## 20. Types d'établissements, postes et spécialisations

### Types d'établissements

Salle de sport · Centre de fitness · Studio de yoga · Studio de Pilates · Salle d'escalade · Studio de danse · Club de tennis · Centre de natation · Club de golf · Centre de cyclisme / vélo indoor · École de surf / sports nautiques · Centre de sports de combat / arts martiaux · Centre de bien-être / spa sportif · Complexe sportif polyvalent · Club de rugby / football / sports collectifs · Centre équestre · Salle de boxe · Centre de crossfit · Studio de méditation · Centre sportif médical · Activité Physique Adaptée (APA) · École de sports de plein air / aventure · Parc de trampoline · Académie de sports · Stade / Arena · Centre de réhabilitation sportive · Club communautaire · Établissement scolaire / universitaire

### Types de postes et spécialisations

| Poste                     | Exemples de spécialisations                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Pilates**               | Mat Pilates · Reformer · Pilates prénatal/postnatal · Pilates thérapeutique · Pilates seniors · Pilates en suspension             |
| **Yoga**                  | Hatha · Vinyasa · Ashtanga · Yin Yoga · Yoga Nidra · Yoga prénatal · Power Yoga · Kundalini · Yoga aérien                         |
| **Fitness & Musculation** | HIIT / Tabata · CrossFit · TRX · RPM / Vélo Indoor · Body Pump · Cardio boxing · Bootcamp · Stretching / Mobilité · Gym posturale |
| **Escalade**              | Encadrement en salle (bloc/voie) · Milieu naturel · Ouvreur de voies · Coaching performance · Cours enfants/ados                  |
| **Boxe**                  | Boxe anglaise · Savate · Kickboxing · Muay Thai · Boxe éducative enfants · Cardio boxe · Coaching compétition                     |
| **Danse**                 | Classique · Contemporaine · Jazz · Hip Hop / Street dance · Danses latines · Zumba · Danse africaine · Barre au sol               |
| **Gymnastique**           | Baby-gym · Gym artistique · Gym douce · Gym senior · Gym adaptée (APA) · Acrogym                                                  |
| **Tennis**                | Enfants loisir · Compétition jeunes · Adulte loisir · Senior / santé · Tennis en fauteuil                                         |
| **APA**                   | Pathologies métaboliques · Pathologies chroniques · Seniors / prévention chute · Santé mentale · Handicap moteur · EHPAD          |

### Niveaux d'expérience

| Niveau   | Définition                     |
| -------- | ------------------------------ |
| Débutant | Moins de 2 ans d'expérience    |
| Confirmé | Entre 5 et 10 ans d'expérience |
| Expert   | Plus de 10 ans d'expérience    |

### Diplômes reconnus

**Universitaires** : Licence STAPS · Master STAPS · Doctorat en Sciences du Sport

**Diplômes d'État** : BPJEPS · DEJEPS · DESJEPS

**Certifications professionnelles** : CQP · Brevets fédéraux · BEES · CAED · Diplôme de masseur-kinésithérapeute · Diplôme de préparateur physique
