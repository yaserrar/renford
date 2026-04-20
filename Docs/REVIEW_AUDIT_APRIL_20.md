# Revue & Audit Complet — 20 Avril 2026

## Fonctionnalités implémentées (récentes)

| #   | Feature                                     | Backend                               | Frontend                   | Status |
| --- | ------------------------------------------- | ------------------------------------- | -------------------------- | ------ |
| 1   | Annulation mission côté établissement       | `cancelMissionByEtablissement`        | Dialog + mutation          | ✅ OK  |
| 2   | Annulation mission côté renford             | `annulerMissionByRenford`             | Dialog + mutation          | ✅ OK  |
| 3   | Signaler changement (établissement)         | `signalerChangementByEtablissement`   | `SignalerChangementDialog` | ✅ OK  |
| 4   | Signaler changement (renford)               | `signalerChangementByRenford`         | `SignalerChangementDialog` | ✅ OK  |
| 5   | Dates lifecycle (terminée/clôturée/annulée) | Controllers + schema                  | —                          | ✅ OK  |
| 6   | URSSAF attestation ≥ 5000€                  | `respondToMissionProposal` check      | —                          | ✅ OK  |
| 7   | Devis PDF                                   | `renderDevis` in mission-documents.ts | Document group + download  | ✅ OK  |
| 8   | RGPD suppression/anonymisation              | `deleteAccount` endpoint              | `DeleteAccountSection`     | ✅ OK  |
| 9   | Admin attestation vigilance                 | renford-details.tsx                   | SecureLink display         | ✅ OK  |
| 10  | PDF brand styling (#232e65)                 | Toutes les fonctions render\*         | —                          | ✅ OK  |

---

## Cas de test & User Flows

### 1. Suppression de compte (RGPD)

#### Flow Renford

| #   | Etape       | Action                               | Résultat attendu                                          |
| --- | ----------- | ------------------------------------ | --------------------------------------------------------- |
| 1.1 | Accès       | Renford va dans Profil               | Voit la section "Supprimer mon compte" en bas             |
| 1.2 | Clic        | Clic sur "Supprimer mon compte"      | Dialog de confirmation s'ouvre                            |
| 1.3 | Annuler     | Clic "Annuler" dans le dialog        | Dialog se ferme, rien ne change                           |
| 1.4 | Confirmer   | Clic "Confirmer la suppression"      | API DELETE /utilisateur/account appelée                   |
| 1.5 | Succès      | Réponse 200                          | Toast "Votre compte a été supprimé", logout automatique   |
| 1.6 | Redirection | Après logout                         | Redirigé vers la page de connexion                        |
| 1.7 | Reconnexion | Tentative de login avec ancien email | Échec (email changé en `supprime_xxx@deleted.renford.fr`) |

#### Flow Établissement

| #    | Etape     | Action                            | Résultat attendu                                |
| ---- | --------- | --------------------------------- | ----------------------------------------------- |
| 1.8  | Accès     | Établissement va dans Profil      | Voit la section "Supprimer mon compte" en bas   |
| 1.9  | Confirmer | Confirme la suppression           | Même flow que renford                           |
| 1.10 | Données   | Vérification DB après suppression | nom/prénom = "Compte supprimé", email anonymisé |

#### Données anonymisées — Renford

| Champ                                      | Avant            | Après                              |
| ------------------------------------------ | ---------------- | ---------------------------------- |
| `utilisateur.email`                        | user@example.com | `supprime_{id}@deleted.renford.fr` |
| `utilisateur.nom`                          | Dupont           | Compte supprimé                    |
| `utilisateur.prenom`                       | Jean             | Compte supprimé                    |
| `utilisateur.telephone`                    | 06...            | null                               |
| `utilisateur.motDePasse`                   | hash             | null                               |
| `utilisateur.statut`                       | actif            | supprime                           |
| `profilRenford.adresse`                    | 5 rue...         | null                               |
| `profilRenford.ville`                      | Paris            | null                               |
| `profilRenford.codePostal`                 | 75001            | null                               |
| `profilRenford.dateNaissance`              | 1990-01-01       | null                               |
| `profilRenford.siret`                      | 12345...         | null                               |
| `profilRenford.avatarChemin`               | /uploads/...     | null                               |
| `profilRenford.imageCouvertureChemin`      | /uploads/...     | null                               |
| `profilRenford.titreProfil`                | Coach sportif    | null                               |
| `profilRenford.descriptionProfil`          | Mon profil...    | null                               |
| `profilRenford.attestationVigilanceChemin` | /uploads/...     | null                               |
| `profilRenford.justificatifCartePro...`    | /uploads/...     | null                               |

#### Données anonymisées — Établissement

| Champ                                       | Avant          | Après           |
| ------------------------------------------- | -------------- | --------------- |
| `profilEtablissement.raisonSociale`         | Gym Club       | Compte supprimé |
| `profilEtablissement.siret`                 | 12345...       | Compte supprimé |
| `profilEtablissement.adresse`               | 10 rue...      | Compte supprimé |
| `profilEtablissement.codePostal`            | 75002          | 00000           |
| `profilEtablissement.ville`                 | Paris          | Compte supprimé |
| `profilEtablissement.aPropos`               | Notre salle... | null            |
| `profilEtablissement.avatarChemin`          | /uploads/...   | null            |
| `profilEtablissement.imageCouvertureChemin` | /uploads/...   | null            |

#### Edge Cases

| #   | Cas                                           | Comportement attendu                                               | Vérifié           |
| --- | --------------------------------------------- | ------------------------------------------------------------------ | ----------------- |
| 1.A | Compte déjà supprimé                          | 400 "Ce compte est déjà supprimé"                                  | ✅                |
| 1.B | Utilisateur non authentifié                   | 401                                                                | ✅                |
| 1.C | Utilisateur inexistant                        | 404                                                                | ✅                |
| 1.D | Missions en cours au moment de la suppression | Missions conservées, renford anonymisé, missions restent traçables | ✅ (par design)   |
| 1.E | Transaction échoue                            | Rollback complet, rien n'est modifié                               | ✅ ($transaction) |
| 1.F | FirebaseAuth inexistant                       | `deleteMany` ne fait rien (pas d'erreur)                           | ✅                |
| 1.G | Profil renford inexistant (pour un étab)      | `updateMany` ne fait rien                                          | ✅                |

---

### 2. Annulation mission — Côté Établissement

| #   | Etape  | Action                  | Résultat attendu                           |
| --- | ------ | ----------------------- | ------------------------------------------ |
| 2.1 | Accès  | Page détails mission    | Bouton "Annuler la mission" visible        |
| 2.2 | Dialog | Clic annuler            | Dialog avec sélection raison + commentaire |
| 2.3 | Envoi  | Soumet l'annulation     | API appelée                                |
| 2.4 | Statut | Mission mise à jour     | `statut: annulee`, `dateAnnulee: now()`    |
| 2.5 | MR     | MissionRenford associée | `statut: annule`                           |
| 2.6 | Email  | Notification renford    | Email envoyé au renford assigné            |

#### Edge Cases

| #   | Cas                              | Comportement                   | Vérifié |
| --- | -------------------------------- | ------------------------------ | ------- |
| 2.A | Mission déjà annulée             | Rejeté (vérification statut)   | ✅      |
| 2.B | Mission en cours (déjà démarrée) | Rejeté — annulation impossible | ✅      |
| 2.C | Pas de MissionRenford assignée   | Annulation OK, pas de cascade  | ✅      |

---

### 3. Annulation mission — Côté Renford

| #   | Etape   | Action                         | Résultat attendu                                                                       |
| --- | ------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| 3.1 | Dialog  | Sélection raison + commentaire | Envoi API                                                                              |
| 3.2 | MR      | MissionRenford mise à jour     | `statut: annule`, `raisonAnnulation`, `commentaireAnnulation`, `dateAnnulation: now()` |
| 3.3 | Mission | Mission parent                 | `statut: remplacement_en_cours`                                                        |
| 3.4 | Email   | Notification établissement     | Email envoyé                                                                           |

#### Edge Cases

| #   | Cas                                                     | Comportement | Vérifié |
| --- | ------------------------------------------------------- | ------------ | ------- |
| 3.A | Renford n'est pas propriétaire du MR                    | 403 Interdit | ✅      |
| 3.B | Statut invalide (pas contrat_signe ni mission_en_cours) | 400 Rejeté   | ✅      |
| 3.C | Mission déjà annulée                                    | 400 Rejeté   | ✅      |

---

### 4. Signaler un changement

| #   | Etape   | Action                        | Résultat attendu                 |
| --- | ------- | ----------------------------- | -------------------------------- |
| 4.1 | Dialog  | Sélection type + description  | Envoi API                        |
| 4.2 | Email   | Notification à l'autre partie | Email avec détails du changement |
| 4.3 | Réponse | Succès                        | Toast de confirmation            |

#### Note

> Le signalement de changement est un mécanisme de notification uniquement (email). Aucun enregistrement en base. C'est par design — pas de modèle `Changement` dans le schema.

---

### 5. URSSAF Attestation de Vigilance (≥ 5000€)

| #   | Cas                                      | Comportement                                   | Vérifié |
| --- | ---------------------------------------- | ---------------------------------------------- | ------- |
| 5.1 | Mission < 5000€ HT, pas d'attestation    | Renford peut accepter normalement              | ✅      |
| 5.2 | Mission ≥ 5000€ HT, attestation uploadée | Renford peut accepter                          | ✅      |
| 5.3 | Mission ≥ 5000€ HT, PAS d'attestation    | 400 — doit uploader l'attestation de vigilance | ✅      |
| 5.4 | montantHT est null                       | `Number(null ?? 0)` = 0, donc pas de blocage   | ✅      |

---

### 6. Lifecycle Dates

| Événement              | Champ mis à jour                             | Controller                             | Vérifié |
| ---------------------- | -------------------------------------------- | -------------------------------------- | ------- |
| Mission terminée       | `mission.dateTerminee = new Date()`          | `markMissionAsTermineeByEtablissement` | ✅      |
| Mission clôturée       | `mission.dateCloturee = new Date()`          | `clotureMissionByEtablissement`        | ✅      |
| Mission annulée (étab) | `mission.dateAnnulee = new Date()`           | `cancelMissionByEtablissement`         | ✅      |
| MR annulée (renford)   | `missionRenford.dateAnnulation = new Date()` | `annulerMissionByRenford`              | ✅      |

---

### 7. Devis PDF

| #    | Vérification                                                          | Statut |
| ---- | --------------------------------------------------------------------- | ------ |
| 7.1  | Titre centré en #232e65 bg + texte blanc                              | ✅     |
| 7.2  | Bloc destinataire à droite (raison sociale, adresse, SIRET)           | ✅     |
| 7.3  | Date du devis + validité 72h                                          | ✅     |
| 7.4  | Sous-titre mission (nom renford + type)                               | ✅     |
| 7.5  | Tableau 6 colonnes avec header #232e65                                | ✅     |
| 7.6  | Ligne 1: prestation avec lieu, durée, heures, tarif, TVA 0%, montants | ✅     |
| 7.7  | Ligne 2: commission 20% avec montants HT et TTC                       | ✅     |
| 7.8  | Récapitulatif: sous-total, commission, total, NET À PAYER             | ✅     |
| 7.9  | Conditions de paiement                                                | ✅     |
| 7.10 | Mode de paiement (lien Stripe)                                        | ✅     |
| 7.11 | CGV page 2 — sections 1.1, 1.2, 1.3                                   | ✅     |
| 7.12 | CGV — section 2 (paiement auto-entrepreneur)                          | ✅     |
| 7.13 | CGV — section 3.1 (annulation entreprise avec détails pénalités)      | ✅     |
| 7.14 | CGV — section 3.2 (désistement renford, suspension, force majeure)    | ✅     |
| 7.15 | CGV — section 3.3 (non-réalisation, remboursement 30j)                | ✅     |
| 7.16 | Bordures table en #232e65                                             | ✅     |
| 7.17 | Footer "Document généré automatiquement"                              | ✅     |

---

### 8. Admin — Attestation de Vigilance

| #   | Cas                             | Comportement                                   | Vérifié |
| --- | ------------------------------- | ---------------------------------------------- | ------- |
| 8.1 | Renford a uploadé l'attestation | Lien "Voir" affiché dans admin renford-details | ✅      |
| 8.2 | Renford n'a pas d'attestation   | "Non fournie" affiché                          | ✅      |

---

### 9. PDF Styling Global (#232e65)

| Document            | Title bar                | Table header             | Borders             | Vérifié |
| ------------------- | ------------------------ | ------------------------ | ------------------- | ------- |
| Devis               | ✅ Brand bg + white text | ✅ Brand bg + white text | ✅ Brand            | ✅      |
| Facture prestation  | ✅ Brand header          | ✅ Brand bg + white text | ✅ Brand            | ✅      |
| Facture commission  | ✅ Brand header          | ✅ Brand bg + white text | ✅ Brand            | ✅      |
| Contrat prestation  | ✅ Brand bg + white text | N/A                      | ✅ Brand signatures | ✅      |
| Attestation mission | ✅ Brand header          | N/A                      | ✅ Brand box        | ✅      |

---

## Bugs corrigés durant cet audit

| #   | Bug                                                                                    | Fichier                   | Fix                                                                                                 |
| --- | -------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | `ProfilRenford.telephone` n'existe pas                                                 | utilisateur.controller.ts | Supprimé                                                                                            |
| 2   | `ProfilRenford.cvChemin/diplomesChemin/carteProfessionnelleChemin` n'existent pas      | utilisateur.controller.ts | Remplacés par champs corrects (avatarChemin, imageCouvertureChemin, titreProfil, descriptionProfil) |
| 3   | `ProfilRenford.iban/bic` n'existent pas                                                | utilisateur.controller.ts | Supprimés                                                                                           |
| 4   | `ProfilEtablissement.siret/adresse/codePostal/ville` non-nullable                      | utilisateur.controller.ts | `null` → valeur anonymisée ("Compte supprimé", "00000")                                             |
| 5   | `ProfilEtablissement.telephone/photoCouvertureChemin/photoProfilChemin` n'existent pas | utilisateur.controller.ts | Remplacés par `avatarChemin`, `imageCouvertureChemin`                                               |
| 6   | Type cast incomplet dans download handler                                              | [missionId]/page.tsx      | Ajouté `"attestation_mission"`                                                                      |

## Notes de design

- **Signaler changement** : notification email uniquement (pas de persistance DB) — par design
- **Suppression compte** : anonymisation, pas de suppression physique — les missions / historiques sont conservés
- **Fichiers physiques** : les fichiers (photos, documents) ne sont pas supprimés du disque lors de l'anonymisation — nettoyage à planifier si nécessaire
