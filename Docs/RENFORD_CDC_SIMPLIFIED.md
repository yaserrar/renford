# Renford — Cahier des Charges Simplifié

> Version française complète — Toutes fonctionnalités et règles métier

---

## 1. Présentation du Projet

### 1.1 Description

**Renford** est une plateforme SaaS B2B2C qui met en relation des **établissements sportifs** (salles de sport, centres fitness, studios, clubs...) avec des **professionnels du sport indépendants** (coachs, instructeurs, formateurs...) appelés **Renfords**.

La plateforme gère l'intégralité du cycle : création de mission → matching → acceptation → signature de contrat → paiement → clôture → évaluation.

### 1.2 Problème résolu

Les établissements sportifs ont régulièrement besoin de remplacer des coachs absents, de couvrir des périodes de forte fréquentation ou de lancer de nouvelles offres de cours. Trouver des professionnels qualifiés rapidement et gérer tous les aspects administratifs (contrats, paiements, attestations) est aujourd'hui complexe et morcelé.

Renford centralise ce processus en un seul outil.

### 1.3 Proposition de valeur

| Pour les Établissements | Pour les Renfords (Freelances) |
|------------------------|-------------------------------|
| Accès immédiat à des profils vérifiés et certifiés | Accès à des missions qualifiées sans démarchage |
| Contrats générés automatiquement | Paiements sécurisés et garantis |
| Paiement sécurisé via Stripe | Zéro commission prélevée sur leurs revenus |
| Gestion simplifiée des remplacements | Gestion de la disponibilité et du planning |
| Historique et documents archivés | Visibilité et notation publique |

---

## 2. Rôles Utilisateurs

### 2.1 Types d'utilisateurs

| Type | Enum | Description |
|------|------|-------------|
| Établissement | `etablissement` | Publie des missions, signe les contrats, effectue les paiements, évalue les Renfords |
| Renford | `renford` | Accepte ou refuse des propositions, signe les contrats, exécute les missions, reçoit les paiements |
| Administrateur | `administrator` | Gestion complète de la plateforme : vérification, litiges, statistiques, configuration |

### 2.2 Statuts de compte

| Statut | Description |
|--------|-------------|
| `active` | Compte opérationnel |
| `pending_verification` | En attente de vérification (Renford uniquement) |
| `suspended` | Suspendu temporairement (ex : annulation tardive) |
| `banned` | Banni définitivement |
| `deactivated` | Désactivé par l'utilisateur |

### 2.3 Statut de certification (Renford)

| Statut | Description |
|--------|-------------|
| `pending` | Profil soumis, en attente de vérification admin |
| `certified` | Profil vérifié, badge "Certifié" affiché |
| `rejected` | Profil rejeté (documents insuffisants ou invalides) |

---

## 3. Hiérarchie des Établissements

### 3.1 Structure

Un **ProfilÉtablissement** est l'entité racine qui regroupe un ou plusieurs sites physiques.

```
ProfilÉtablissement (compte facturation, abonnement)
    ├── Établissement Principal (site principal)
    ├── Établissement Secondaire A
    └── Établissement Secondaire B
```

### 3.2 Règles

| Règle | Détail |
|-------|--------|
| Un profil = un abonnement | L'abonnement est partagé entre tous les sites |
| Quota mutualisé | Les missions créées par tous les sites consomment le même quota mensuel |
| Principal vs Secondaire | `EstablishmentRole`: `main` / `secondary` |
| Ajout de site | Seul le site principal peut ajouter des sites secondaires |
| Statistiques | Le principal voit les stats globales du groupe ; le secondaire voit uniquement les siennes |
| Favoris | Les favoris d'un site peuvent être recommandés aux autres sites du groupe |

---

## 4. Modes de Mission

### 4.1 FLEX — Mission Express

| Caractéristique | Détail |
|----------------|--------|
| Objectif | Remplacement ponctuel ou besoin court terme |
| Matching | Algorithme automatique (toutes les 5 min) |
| Délai | Résultat rapide, notifications immédiates |
| Paiement | Mis en attente (hold) à la signature du contrat |
| Contrat | Généré et signé électroniquement automatiquement |
| Commission | 15 % prélevée sur l'établissement (mode à la carte sans abonnement) |

### 4.2 COACH — Mission Long Terme

| Caractéristique | Détail |
|----------------|--------|
| Objectif | Collaboration récurrente ou longue durée |
| Matching | Sélection manuelle sur une shortlist de 1 à 3 profils |
| Délai | Prise de contact par visioconférence préalable |
| Paiement | Sécurisé (held) dès la soumission de la mission |
| Contrat | Généré après acceptation par les deux parties |
| Annulation | Préavis de 15 jours requis |
| Frais fixes | 375 € HT (mode à la carte sans abonnement) |

---

## 5. Types d'Établissements

Les établissements peuvent être de l'un des 28 types suivants :

- Salle de sport / Fitness Center
- Centre de fitness
- Studio de yoga
- Studio de Pilates
- Salle d'escalade
- Studio de danse
- Club de tennis
- Centre de natation
- Club de golf
- Centre de cyclisme / vélo indoor
- École de surf / sports nautiques
- Centre de sports de combat / arts martiaux
- Centre de bien-être / spa sportif
- Complexe sportif polyvalent
- Club de rugby / football / sports collectifs
- Centre équestre
- Salle de boxe
- Centre de crossfit
- Studio de méditation / pleine conscience
- Centre sportif médical
- Activité Physique Adaptée (APA)
- École de sports de plein air / aventure
- Parc de trampoline
- Académie de sports
- Stade / Arena
- Centre de réhabilitation sportive
- Club de sport communautaire
- Établissement scolaire / universitaire

---

## 6. Types de Postes et Spécialisations

### 6.1 Catégories de postes (PositionType)

| Catégorie | Spécialisations disponibles |
|-----------|----------------------------|
| **Pilates** | Mat Pilates · Reformer Pilates · Pilates en suspension · Pilates prénatal/postnatal · Pilates thérapeutique · Pilates pour sportifs · Pilates seniors · Pilates enfants/ados · Pilates cadiovasculaire · Pilates en groupe |
| **Yoga** | Hatha Yoga · Vinyasa · Ashtanga · Yin Yoga · Yoga Nidra · Yoga prénatal · Power Yoga · Kundalini · Yoga thérapeutique · Yoga aérien (aerial yoga) · Yoga pour enfants |
| **Fitness & Musculation** | Body Sculpt / Renfo global · LIA (Low Impact Aerobic) · Step / Step chorégraphié · HIIT / Tabata · Circuit training · Cross Training / CrossFit · TRX / Suspension training · RPM / Vélo Indoor · Body Pump · Stretching / Mobilité · Cardio boxing · Bootcamp · Gym posturale / dos |
| **Escalade** | Encadrement en salle (bloc / voie) · Encadrement en milieu naturel · Ouvreur de voies/blocs · Coaching escalade (performance) · Cours enfants / ados · Escalade thérapeutique / APA · Initiation / loisirs adultes |
| **Boxe** | Boxe anglaise · Boxe française / savate · Kickboxing · Muay Thai · Boxe éducative enfants/ados · Cardio Boxe / Boxe fitness · Coaching boxe (loisir ou compétiteur) |
| **Danse** | Danse classique · Danse contemporaine · Jazz / Modern jazz · Hip Hop / Street dance · Ragga dancehall · Danses latines (salsa, bachata...) · Zumba · Danse africaine · Danse enfants · Barre au sol |
| **Gymnastique** | Baby-gym · Gymnastique artistique · Gym au sol · Gym tonique · Gym douce · Gym senior · Gym adaptée (APA) · Acrogym / Portés acrobatiques |
| **Tennis** | Tennis loisir enfants · Tennis compétition jeunes · Tennis adulte loisir · Tennis senior / sport santé · Préparation physique pour tennis · Tennis en fauteuil (adapté) |
| **APA** | APA pathologies métaboliques · APA pathologies chroniques · APA seniors / prévention chute · APA santé mentale · APA handicap moteur · APA handicap psychique / cognitif · APA rééducation post-blessure · APA en EHPAD / structures médico-sociales |

### 6.2 Niveaux d'expérience

| Niveau | Définition |
|--------|-----------|
| Débutant | Moins de 2 ans d'expérience |
| Confirmé | Entre 5 et 10 ans d'expérience |
| Expert | Plus de 10 ans d'expérience |

---

## 7. Diplômes & Certifications

### 7.1 Diplômes universitaires

- **Licence STAPS** (Entraînement Sportif, APA, Éducation et Motricité, Management du Sport)
- **Master STAPS** (Performance Sportive, APA & Santé, Ingénierie de l'AP, Management)
- **Doctorat en Sciences du Sport**

### 7.2 Diplômes d'État

- **BPJEPS** — Brevet Professionnel Jeunesse, Éducation Populaire et du Sport (AGFF, Aquatique, APT, Randonnée)
- **DEJEPS** — Diplôme d'État (Perfectionnement Sportif, Développement de Projets)
- **DESJEPS** — Diplôme d'État Supérieur

### 7.3 Certifications professionnelles

- **CQP** — Certificat de Qualification Professionnelle (Moniteur escalade, Instructeur fitness, Coach musculation...)
- **Brevets fédéraux** — Issus des fédérations sportives
- **BEES** — Brevet d'État d'Éducateur Sportif
- **CAED** — Certificat d'Aptitude à l'Enseignement de la Danse
- Diplôme de Masseur-Kinésithérapeute
- Diplôme de Préparateur Physique

---

## 8. Parcours Utilisateurs

### 8.1 Inscription et Onboarding — Établissement

```
1. Création de compte (email + mot de passe)
2. Vérification de l'adresse email (code)
3. Onboarding :
   a. Informations générales (nom, type, adresse, SIRET, contact principal)
   b. Informations de facturation (IBAN, nom du titulaire, raison sociale)
   c. Ajout de sites secondaires (optionnel)
   d. Ajout de Renfords favoris (optionnel)
4. Accès au tableau de bord
```

**Données requises :**
- Nom de l'établissement, type, adresse complète, téléphone, email
- SIRET / SIREN
- Contact principal, raison sociale de facturation
- IBAN (nom du titulaire, adresse de facturation)

### 8.2 Inscription et Onboarding — Renford

```
1. Création de compte (email + mot de passe)
2. Vérification de l'adresse email (code)
3. Onboarding (5 étapes) :
   a. Informations générales (nom, prénom, photo, titre, description)
   b. Qualifications (type de poste, spécialisations, niveau d'expérience, diplômes + justificatifs)
   c. Tarification (taux horaire, jauge de flexibilité, tarifs demi-journée/journée optionnels)
   d. Disponibilités (type : illimité ou plage de dates, jours/heures)
   e. Documents (carte professionnelle, IBAN, attestation de vigilance URSSAF, assurance)
4. Soumission pour vérification
5. Vérification manuelle par l'admin → badge "Certifié"
6. Accès au tableau de bord Renford
```

**Documents vérifiés par l'admin :**
- Diplômes et justificatifs
- Carte professionnelle
- Attestation de vigilance URSSAF (obligatoire si missions > 5 000 €)
- Justificatif d'assurance professionnelle

---

## 9. Cycle de Vie d'une Mission

### 9.1 Cycle complet FLEX

```
Établissement crée la mission
        ↓
Définit : type de poste · spécialisations · niveau · dates · horaires
          mode de tarification · diplôme requis · équipement · description
        ↓
Soumet la mission (statut : "envoyée")
        ↓
Algorithme de matching (toutes les 5 min) → sélectionne les Renfords correspondants
        ↓
Notifications envoyées aux Renfords (email + SMS + dashboard)
        ↓
Renford accepte ou refuse la proposition
        ↓
[Acceptation] → Génération du devis → envoi à l'établissement
        ↓
Établissement approuve le devis → Génération du contrat
        ↓
Signature électronique des deux parties → Paiement mis en hold (Stripe)
        ↓
Mission "En cours" → Exécution
        ↓
Établissement valide la mission
        ↓
Paiement libéré vers le Renford (net de commission)
        ↓
Évaluations mutuelles
        ↓
Mission "Terminée" → Archivage
```

### 9.2 Cycle complet COACH

```
Établissement crée la mission COACH
        ↓
Paiement sécurisé (hold) dès la soumission
        ↓
Algorithme sélectionne une shortlist de 1 à 3 profils
        ↓
Établissement consulte les profils (sans données de contact)
        ↓
Établissement planifie un appel vidéo (Calendly) avec le(s) Renford(s)
        ↓
Établissement sélectionne son Renford
        ↓
Proposition envoyée au Renford → Acceptation ou refus
        ↓
[Acceptation] → Génération et signature du contrat
        ↓
Exécution de la mission
        ↓
Validation → Libération du paiement
        ↓
Évaluations mutuelles → Archivage
```

### 9.3 Statuts de mission

| Statut | Description |
|--------|-------------|
| `envoyée` | Mission créée, en attente de matching |
| `en_cours_de_matching` | Algorithme en cours d'exécution |
| `proposée` | Proposée à un ou plusieurs Renfords |
| `acceptée` | Acceptée par un Renford |
| `contrat_signé` | Contrat signé par les deux parties |
| `payée` | Paiement sécurisé (hold Stripe) confirmé |
| `en_cours` | Mission en cours d'exécution |
| `à_valider` | Mission terminée, en attente de validation établissement |
| `validée` | Validée par l'établissement |
| `terminée` | Cycle complet terminé, évaluations faites |
| `archivée` | Archivage final |
| `annulée` | Mission annulée |

### 9.4 Gestion des modifications de mission

**Modifications par le Renford (avec approbation établissement) :**
- Ajustement des horaires
- Changement de date de début ou de fin
- Changement de lieu
- Autre (avec justification)

**Processus :** Renford soumet → Établissement notifié → Approuve ou refuse → Les deux parties notifiées

### 9.5 Signalement d'absence

L'établissement peut signaler l'absence d'un Renford :
- Nom du Renford
- Date de début / fin d'absence
- Motif : autre mission imprévue · problème de communication · problème de disponibilité · absence non planifiée · autre
- Commentaires libres

### 9.6 Ajustement de durée

L'établissement peut modifier la durée en cours de mission :
- Nouveau début / nouvelle fin
- Motif : retard de démarrage · problème imprévu nécessitant prolongation · extension · changement des besoins · autre

---

## 10. Algorithme de Matching

### 10.1 Critères et poids

| Critère | Poids | Description |
|---------|-------|-------------|
| Favoris | Maximal | Priorité aux Renfords favoris de l'établissement |
| Type de poste | Élevé | Concordance des compétences requises |
| Niveau d'expérience | Élevé | Correspond au niveau demandé |
| Disponibilités | Élevé | Les dates doivent se chevaucher |
| Localisation | Moyen | Même département ou département adjacents |
| Tarification | Moyen | Dans la fourchette demandée (avec tolérance) |
| Diplômes | Moyen | Concordance avec le diplôme exigé |
| Performances passées | Moyen | Note moyenne et historique de missions |
| Spécialisations | Faible | Compétences spécifiques supplémentaires |

### 10.2 Correspondance géographique (Île-de-France)

Les départements suivants sont considérés comme "adjacents" pour le matching :

- Paris ↔ Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne
- Seine-et-Marne ↔ Val-de-Marne, Essonne
- Yvelines ↔ Hauts-de-Seine, Val-d'Oise, Essonne
- Essonne ↔ Hauts-de-Seine, Val-de-Marne, Seine-et-Marne, Yvelines
- Hauts-de-Seine ↔ Paris, Yvelines, Essonne, Val-de-Marne
- Seine-Saint-Denis ↔ Paris, Val-d'Oise, Val-de-Marne
- Val-de-Marne ↔ Paris, Seine-Saint-Denis, Hauts-de-Seine, Essonne, Seine-et-Marne
- Val-d'Oise ↔ Yvelines, Seine-Saint-Denis

### 10.3 Logique de correspondance tarifaire

| Fourchette mission | Plage acceptée côté Renford |
|--------------------|----------------------------|
| Moins de 45 €/h | ≤ 55 €/h |
| Entre 45 et 59 €/h | 35 € – 70 €/h |
| Plus de 60 €/h | ≥ 50 €/h |

### 10.4 Jauge de flexibilité (Renford)

- Le Renford peut indiquer une flexibilité tarifaire de 0 % à -15 %
- Non affichée publiquement
- Utilisée uniquement par l'algorithme pour élargir les correspondances
- Plage de tarification : 20 €/h minimum — 200 €/h maximum

### 10.5 Exécution

L'algorithme de matching s'exécute automatiquement **toutes les 5 minutes** via un scheduler (`node-cron`). Il peut également être déclenché manuellement via l'interface admin.

---

## 11. Tarification des Missions

### 11.1 Méthodes de tarification

| Méthode | Enum | Description |
|---------|------|-------------|
| Horaire | `hourly` | Tarif à l'heure selon la fourchette choisie |
| Fixe | `fixed` | Montant forfaitaire pour la prestation |
| Dégressif | `degressive` | Tarif variable selon le nombre de participants |

### 11.2 Fourchettes horaires

| Fourchette | Valeur |
|-----------|--------|
| Moins de 45 €/h | `Moins de 45 euros de l'heure` |
| Entre 45 et 59 €/h | `Entre 45 et 59 euros de l'heure` |
| Plus de 60 €/h | `Plus de 60 euros de l'heure` |

---

## 12. Système de Paiement

### 12.1 Architecture

La plateforme utilise **Stripe Connect** en mode marketplace. Les fonds transitent par Renford (la plateforme) avant redistribution.

```
Établissement → Stripe (capture + hold) → Commission plateforme déduite → Virement net au Renford
```

### 12.2 Flux selon le mode mission

| Étape | FLEX | COACH |
|-------|------|-------|
| Hold (mise en attente) | À la signature du contrat | À la soumission de la mission |
| Libération | À la validation par l'établissement | À la validation par l'établissement |
| Refus / annulation avant contrat | Aucun frais | Remboursement intégral |

### 12.3 Statuts de paiement

| Statut | Description |
|--------|-------------|
| `pending` | En attente |
| `processing` | En cours de traitement |
| `held` | Fonds bloqués (attente validation) |
| `released` | Fonds libérés vers le Renford |
| `refunded` | Remboursé |
| `failed` | Échec du paiement |
| `disputed` | Litige en cours |

### 12.4 Informations bancaires requises

**Établissement :**
- Nom du titulaire du compte
- Email de facturation
- IBAN
- Raison sociale de facturation
- Adresse de facturation
- SIRET

**Renford :**
- Nom du titulaire du compte
- IBAN

### 12.5 Commission plateforme

- Mode à la carte FLEX : **15 %** (prélevé sur l'établissement)
- Mode à la carte COACH : **375 € HT** (frais fixes)
- Avec abonnement : commission incluse dans l'abonnement mensuel
- Les Renfords ne paient **aucune commission**

---

## 13. Système d'Abonnement

### 13.1 Plans disponibles

| Plan | Quota missions/période | Prix mensuel HT | Activation |
|------|----------------------|----------------|-----------|
| **Échauffement** | 10 missions | 99 € | Self-serve (Stripe Checkout) |
| **Performance** | 25 missions | 199 € | Self-serve (Stripe Checkout) |
| **Compétition** | Illimitées | Sur mesure (négocié) | Manuel (admin) |

> Sans abonnement : mode **à la carte** (FLEX = 15 % de commission, COACH = 375 € HT par mission).

### 13.2 Statuts d'abonnement

```
en_attente → actif → annulé
               │
               ├── en_pause → actif (récupération paiement)
               │
               └── expiré
```

| Statut | Description |
|--------|-------------|
| `en_attente` | Créé, paiement initial non encore confirmé |
| `actif` | En cours, quota disponible |
| `en_pause` | Suspendu (ex : échec de paiement récupérable) |
| `annulé` | Annulation explicite |
| `expiré` | Fin de période sans renouvellement |

### 13.3 Gestion des quotas

- La **période** correspond au cycle de facturation Stripe (pas le mois calendaire)
- Le quota est **mutualisé** pour tous les sites d'un même ProfilÉtablissement
- Le quota se réinitialise à chaque renouvellement automatique
- Si le quota est dépassé → blocage de la création de mission + invitation à upgrader

### 13.4 Webhooks Stripe écoutés

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Activation de l'abonnement en BDD |
| `customer.subscription.updated` | Mise à jour des dates de période |
| `customer.subscription.deleted` | Statut → `annulé` |
| `invoice.paid` | Renouvellement + événement `paiement_réussi` |
| `invoice.payment_failed` | Statut → `en_pause` + événement `paiement_échoué` |

---

## 14. Documents Générés Automatiquement

### 14.1 Liste des documents

| Document | Déclencheur | Destinataires |
|----------|------------|--------------|
| **Devis** | Renford accepte la mission | Établissement |
| **Contrat de prestation** | Devis accepté par l'établissement | Les deux parties (signature électronique) |
| **Facture** | Mission validée | Les deux parties |
| **Attestation de mission** | Mission terminée | Les deux parties |
| **Attestation de vigilance URSSAF** | Missions > 5 000 € (obligatoire) | Fournie par le Renford |
| **Bordereau de paiement** | Paiement effectué | Les deux parties |

### 14.2 Format et conformité

- Tous les documents sont générés au format **PDF**
- Les factures respectent la norme **Facture-X** (conformité facturation électronique 2026)
- Transmission via PDP ou PPF pour les échanges certifiés
- Tous les documents sont archivés dans le dossier mission

### 14.3 Signature électronique

Le module de signature électronique (intégration Yousign/DocuSign/PandaDoc) gère :
- Génération automatique du lien de signature
- Relances automatiques par email
- Archivage de la preuve de signature
- Notifications de signature complète aux deux parties

---

## 15. Système de Notifications

### 15.1 Canaux de notification

| Canal | Usage |
|-------|-------|
| **Email** | Toutes les actions importantes (voir section 15.3) |
| **SMS** | Alertes urgentes : nouvelle mission, acceptation, rappels J-2 |
| **Dashboard** | Notifications in-app en temps réel |
| **Calendrier** | Rappels de mission (Google Calendar) |

### 15.2 Préférences de notification

Chaque utilisateur peut configurer ses préférences par canal et par type d'événement.

### 15.3 Événements déclencheurs d'emails (47 templates)

#### Authentification
- Vérification d'email (code)
- Confirmation d'inscription établissement / Renford
- Réinitialisation de mot de passe
- Connexion depuis un nouvel appareil

#### Onboarding
- Bienvenue établissement / Renford
- Compte soumis pour vérification
- Compte certifié / rejeté
- Rappel d'onboarding incomplet

#### Missions
- Nouvelle mission disponible (Renford)
- Mission proposée / acceptée / refusée
- Contrat disponible pour signature
- Rappel de signature (J+1, J+2)
- Mission démarrée
- Mission à valider
- Mission terminée
- Mission annulée

#### Évaluations
- Rappel d'évaluation (J+1, J+2, J+5)

#### Paiements
- Paiement effectué (Renford)
- Facture disponible (Établissement)

#### Abonnements
- Abonnement activé
- Renouvellement réussi
- Échec de paiement
- Annulation confirmée
- Quota bientôt atteint

#### Alertes certifications
- Attestation URSSAF expirante
- Assurance professionnelle à renouveler

#### Documents
- Devis disponible
- Attestation de mission disponible

---

## 16. Système d'Évaluation

### 16.1 L'Établissement évalue le Renford

| Question | Type de réponse |
|----------|----------------|
| La prestation a-t-elle répondu aux attentes ? | Oui / Non (commentaire si Non) |
| Ajouter à mes favoris ? | Oui / Non |
| Qualité de la prestation | Excellent / Très bien / Bien / Moyen / Médiocre |
| Satisfaction plateforme | 1 à 5 étoiles |
| Satisfaction globale de la prestation | 1 à 5 étoiles |
| Commentaires supplémentaires | Texte libre |

### 16.2 Le Renford évalue l'Établissement

| Question | Type de réponse |
|----------|----------------|
| Qualité des conditions de travail | 1 à 5 étoiles |
| Recommanderiez-vous cet établissement ? | Oui / Non |
| Problèmes rencontrés | Texte libre |
| Aspects les plus satisfaisants | Choix multiple |
| Satisfaction plateforme | 1 à 5 étoiles |
| Commentaires supplémentaires | Texte libre |

**Aspects satisfaisants disponibles :**
- Qualité du travail réalisé
- Professionnalisme de l'équipe
- Respect des délais
- Communication efficace
- Adaptabilité aux besoins spécifiques
- Compétences techniques / expertise
- Collaboration harmonieuse avec l'équipe en place
- Clarté des instructions données
- Résolution rapide des problèmes
- Valeur ajoutée apportée à la mission

### 16.3 Rappels d'évaluation

Des rappels automatiques sont envoyés à J+1, J+2 et J+5 après la fin de la mission si l'évaluation n'a pas été soumise.

---

## 17. Système de Favoris

- Les établissements peuvent ajouter des Renfords à leur liste de favoris
- Les favoris sont **prioritaires** dans l'algorithme de matching
- Un établissement principal peut recommander ses favoris aux sites secondaires du groupe
- Un Renford peut être retiré des favoris à tout moment

---

## 18. Disponibilités du Renford

### 18.1 Types de disponibilité

| Type | Description |
|------|-------------|
| `unlimited` | Disponible indéfiniment (sans limite de date) |
| `date_range` | Disponible sur une plage de dates définie |

### 18.2 Jours de la semaine

Lundi · Mardi · Mercredi · Jeudi · Vendredi · Samedi · Dimanche

Le Renford peut définir ses créneaux horaires disponibles par jour.

---

## 19. Règles Métier

### 19.1 Politique d'annulation

| Acteur | Moment | Conséquence |
|--------|--------|-------------|
| Renford | > 24h avant la mission | Aucune pénalité |
| Renford | < 24h avant la mission | Suspension de compte 7 jours |
| Renford | 2 annulations tardives en 30 jours | Suspension permanente |
| Établissement | Avant signature du contrat | Aucune pénalité |
| Établissement | Après signature du contrat | Selon les termes du contrat |

### 19.2 Attestation de vigilance URSSAF

- **Obligatoire** pour toute mission dépassant **5 000 €**
- Doit être valide et à jour
- La plateforme alerte le Renford à l'approche de l'expiration
- L'attestation est vérifiée lors de l'onboarding puis renvoyée avant les missions concernées

### 19.3 Certification des profils Renford

- La certification est accordée après **vérification manuelle** par un administrateur
- Éléments vérifiés : diplômes, carte professionnelle, assurance, attestation URSSAF
- Les profils certifiés reçoivent le **badge "Certifié"** sur leur profil public
- La certification est un critère de priorité dans l'algorithme de matching

### 19.4 Mode COACH — Préavis d'annulation

- Un préavis de **15 jours** est requis avant toute annulation d'une mission COACH active

---

## 20. Module Administration

### 20.1 Gestion des utilisateurs

- Consulter tous les utilisateurs avec filtres (nom, statut, date d'inscription, nombre de missions)
- Modifier, suspendre, bannir ou supprimer un compte
- Vérifier les diplômes et accorder/retirer le badge "Certifié"
- Créer manuellement un compte établissement ou Renford
- Réinitialiser un mot de passe
- Consulter l'historique d'activité d'un utilisateur

### 20.2 Gestion des missions

- Consulter toutes les missions (en cours, passées, à venir) avec filtres avancés
- Modifier ou annuler une mission en cours
- Assigner manuellement un Renford à une mission
- Gérer les litiges entre établissements et Renfords
- Réexécuter l'algorithme de matching manuellement

### 20.3 Gestion des paiements

- Consulter toutes les transactions Stripe
- Modifier les tarifs de commission
- Gérer les remboursements manuels
- Suivre les abonnements actifs / suspendus / annulés
- Créer un abonnement Compétition (tarif négocié) pour un établissement

### 20.4 Gestion des templates d'emails

47 templates d'emails personnalisables depuis l'interface admin :
- **Valeurs par défaut** : définies dans le code (sujet, titre, introduction, closing, label CTA)
- **Valeurs personnalisées** : saisies dans l'interface admin et stockées en base
- **Valeurs effectives** : la valeur personnalisée prime sur la valeur par défaut si elle existe
- Prévisualisation des valeurs effectives avant enregistrement

### 20.5 Gestion des abonnements Compétition

1. L'équipe commerciale négocie un tarif mensuel avec l'établissement
2. L'admin saisit le tarif via l'interface `/admin/abonnements/competition`
3. Stripe crée un Price unique pour cet établissement
4. L'abonnement est activé via webhook → statut `actif`

### 20.6 Tableau de bord analytique

- Nombre d'utilisateurs actifs (Renfords, Établissements)
- Missions publiées / en cours / terminées
- Taux d'acceptation des propositions
- Volume de transactions
- Revenus et commissions
- Analyse de la performance des Renfords
- Visualisation des tendances

### 20.7 Gestion des documents

- Consulter tous les documents générés (contrats, factures, attestations)
- Personnaliser les modèles de documents
- Ajouter manuellement un document à un dossier mission
- Adapter les templates aux évolutions légales

---

## 21. Architecture Technique

### 21.1 Stack technologique

| Couche | Technologie |
|--------|-------------|
| **Backend** | Node.js + Express.js (TypeScript) |
| **ORM / Base de données** | Prisma v6 + PostgreSQL |
| **Frontend (Dashboard)** | Next.js 14 (App Router, TypeScript) |
| **UI** | shadcn/ui + Tailwind CSS |
| **Authentification** | JWT (Access Token + Refresh Token) |
| **Emails** | Resend |
| **Paiements** | Stripe Connect (marketplace) |
| **Signature électronique** | Yousign / DocuSign / PandaDoc |
| **Calendrier** | Google Calendar |
| **Visioconférence** | Calendly |
| **Monitoring** | Pino (logs) |
| **Scheduler** | node-cron |
| **Conteneurisation** | Docker + docker-compose |
| **Reverse Proxy** | Nginx |
| **Cache** | Redis |

### 21.2 Structure API (RESTful)

| Préfixe | Module | Description |
|---------|--------|-------------|
| `/api/auth/*` | Auth | Inscription, connexion, refresh, reset mot de passe |
| `/api/account-verification/*` | Vérification | Vérification email par code |
| `/api/utilisateur/*` | Utilisateur | Profil connecté, changement de mot de passe |
| `/api/onboarding/*` | Onboarding | Statut et étapes d'onboarding |
| `/api/profil-renford/*` | Profil Renford | Profil public, diplômes, disponibilités |
| `/api/profil-etablissement/*` | Profil Établissement | Infos, sites secondaires, favoris |
| `/api/etablissement/missions/*` | Missions (établissement) | CRUD missions, validation, paiement |
| `/api/renford/missions/*` | Missions (Renford) | Réponse à une proposition, listing |
| `/api/missions/:id/matching` | Matching | Déclenchement manuel du matching |
| `/api/documents/*` | Documents | Génération, signature, téléchargement |
| `/api/paiements/*` | Paiements | Intent, webhook Stripe, historique |
| `/api/evaluations/*` | Évaluations | Soumission, consultation, statistiques |
| `/api/notifications/*` | Notifications | Listing, lecture, préférences |
| `/api/abonnements/*` | Abonnements | Checkout, statut, annulation |
| `/api/upload` | Uploads | Upload de fichiers (multer) |
| `/api/admin/*` | Admin | Gestion globale (utilisateurs, missions, emails, stats) |

### 21.3 Authentification

- **Access Token JWT** : durée courte (ex : 15 min)
- **Refresh Token JWT** : durée longue (ex : 7 jours), stocké en cookie HttpOnly
- Middleware `authenticateToken` : injection `req.userId` + `req.utilisateur`
- Vérification du type d'utilisateur par route (établissement / Renford / admin)

### 21.4 Modules Admin

| Préfixe | Fonctionnalité |
|---------|---------------|
| `/api/admin/utilisateurs/*` | Gestion utilisateurs |
| `/api/admin/missions/*` | Gestion missions + matching manuel |
| `/api/admin/paiements/*` | Transactions, remboursements |
| `/api/admin/abonnements/*` | Abonnements + plan Compétition |
| `/api/admin/emails/*` | Templates d'emails (47 types) |
| `/api/admin/stats/*` | Analytics et statistiques |
| `/api/admin/documents/*` | Gestion des documents générés |

---

## 22. Performance & Sécurité

### 22.1 Objectifs de performance

| Métrique | Cible |
|----------|-------|
| Temps de réponse API | < 200 ms (charge normale) |
| Utilisateurs simultanés | 10 000+ |
| Disponibilité | 99,9 % |
| Mises à jour temps réel | Immédiates pour les actions critiques |

### 22.2 Sécurité

| Exigence | Implémentation |
|----------|---------------|
| Conformité RGPD | Consentement explicite, droit d'accès et de suppression, anonymisation |
| Chiffrement données sensibles | AES-256 |
| Protection PCI-DSS | Aucune donnée carte bancaire stockée côté serveur (Stripe gère tout) |
| Authentification | JWT avec refresh token + validation Zod sur toutes les entrées |
| Protection injections | Prisma ORM (pas de SQL brut), validation stricte des entrées |
| Routes DevOps | Protégées par `NODE_ENV` (pas accessibles en production) |

### 22.3 Conformité légale

- **RGPD** : Consent Manager, droit d'accès, de rectification et de suppression, anonymisation des comptes inactifs
- **Code du travail (Art. L.8222-1)** : Attestation de vigilance URSSAF obligatoire au-delà de 5 000 €
- **Facturation électronique 2026** : Format Facture-X, transmission via PDP/PPF
- **Statut indépendant** : Contrats de prestation conformes (pas de lien de subordination)

---

## 23. Support & Qualité

### 23.1 Canaux de support

| Canal | Usage |
|-------|-------|
| Email | contact@renford.fr |
| Téléphone | Hotline urgences |
| Chat | Intégration Hubspot |
| FAQ | Base de connaissances en self-service |

### 23.2 SLA support

- Délai de réponse cible : **24h en jours ouvrés**
- Gestion des tickets via système de ticketing interne
- Contact direct utilisateur possible depuis l'interface admin

---

## 24. Modèle de Données Simplifié

### 24.1 ProfilÉtablissement

```
ProfilÉtablissement {
  id, nom, siret, adresse, téléphone, email
  typeEtablissement, rôle (main/secondary)
  parentId (nullable, pour les secondaires)
  logo, capacité, horaires, services, équipements
  informationsBancaires { titulaire, email, IBAN, raisonSociale, adresse }
  abonnement → Abonnement (un seul actif)
  sites → [Établissement]
  missions → [Mission]
  favoris → [Renford]
}
```

### 24.2 ProfilRenford

```
ProfilRenford {
  id, prénom, nom, email, téléphone, photo
  titre, description, typePoste, spécialisations
  niveauExpérience, diplômes, justificatifsDiplômes
  tarifHoraire, jaugeFlexibilité, tarifDemiJournée, tarifJournée
  disponibilité { type, dateDebut, dateFin, joursHeures }
  cartePro, IBAN, attestationURSSAF, assurance
  statutCertification, note, missionsRealisées
}
```

### 24.3 Mission

```
Mission {
  id, establishmentId, mode (FLEX/COACH)
  typePoste, spécialisations, niveauExpérience
  dateDebut, dateFin, horaires
  methodeTarification, fourchette, montantFixe, nbParticipants
  description, équipementRequis, diplômeRequis
  statut, statutPaiement
  renfordAssigné (nullable)
  renfordsMatchés []
  documents { devis, contrat, facture, attestation, bordereau }
  évaluationEtablissement, évaluationRenford
  totalHeures, coûtTotal, commission
}
```

### 24.4 Abonnement

```
Abonnement {
  id, profilEtablissementId, plan, statut
  quotaMissions, missionUtilisées
  prixMensuelHT
  stripeSubscriptionId, stripePriceId
  stripeCurrentPeriodStart, stripeCurrentPeriodEnd
  événements → [AbonnementEvenement]
}
```

### 24.5 EmailTemplate (Admin)

```
EmailTemplate {
  type (TypeEmailTemplate — 47 valeurs)
  sujet, titre, intro, corps, closing, ctaLabel (tous nullables)
  → Si null : la valeur par défaut du code est utilisée
}
```

---

*Document généré à partir du CDC original, des modules backend implémentés, du schéma Prisma et des fonctionnalités développées sur la plateforme Renford.*
