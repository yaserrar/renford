# Renford — Mission Lifecycle & Statuses

> Complete reference document covering the full lifecycle of a mission on the Renford platform, from creation to payment, based on the Cahier des Charges and all workflow documents.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Phase 1 — Mission Creation](#2-phase-1--mission-creation)
3. [Phase 2 — Publication & Payment Validation](#3-phase-2--publication--payment-validation)
4. [Phase 3 — Matching](#4-phase-3--matching)
5. [Phase 4 — Candidate Selection](#5-phase-4--candidate-selection)
6. [Phase 5 — Contract](#6-phase-5--contract)
7. [Phase 6 — Active Mission](#7-phase-6--active-mission)
8. [Phase 7 — Absence & Cancellation](#8-phase-7--absence--cancellation)
9. [Phase 8 — Closure, Rating & Payment](#9-phase-8--closure-rating--payment)
10. [Complete Status Reference](#10-complete-status-reference)
11. [Full Flow Summary](#11-full-flow-summary)

---

## 1. Overview

Every mission on Renford follows a structured lifecycle that differs slightly depending on the **mission type**:

| Type | Description | Payment timing | Use case |
|------|-------------|----------------|----------|
| **Renford Flex** | Short-term, urgent, or one-off mission | Post-mission (after completion) | Substitute coach, one-day event |
| **Renford Coach** | Long-term, structured, contractualised mission | At time of matching/mise en relation | Regular weekly coaching, ongoing program |

Both types share the same core lifecycle phases, but differ in matching logic and payment timing.

---

## 2. Phase 1 — Mission Creation

### Who creates it?
The **establishment** (B2B client) initiates the mission from their dashboard.

### Flex — Mission form fields
- Establishment concerned (dropdown)
- Type of position required (coach, instructor, etc.)
- Experience level: Beginner / Confirmed / Expert
- Mission dates and time slots (supports multiple slots per day)
- Pricing method:
  - Hourly rate (< 45€ / 45–59€ / 60€+)
  - Flat rate per service (half-day or full day)
  - Degressive rate by number of participants
- Description / comments
- Required equipment
- Billing information (IBAN, SIRET, billing address)

### Coach — Additional fields
- Diploma or certification required (optional)
- Number of people to supervise
- Course level
- Whether travel expenses are covered
- Deferred secure payment via Stripe (funds held but not captured until mission confirmed)

### Step 2 — Mission Summary
Before submission, the establishment sees a recap page showing:
- Position type, dates, hourly/total cost estimate
- Commission amount
- Edit button (modify any field via pop-up)
- **"Accept"** button to submit → triggers the matching algorithm

> After submission, an automatic confirmation email is sent to the establishment (Annexe 5 of CDC).

---

## 3. Phase 2 — Publication & Payment Validation

Once the mission is submitted, the system checks whether a valid payment method exists.

```
Payment method valid?
  ├── NO  → Status: DRAFT (BROUILLON) — publication blocked
  └── YES → Mission published
               ├── Flex: published immediately
               └── Coach: waiting for matching confirmation
```

### Payment methods supported
**Credit Card (Stripe SetupIntent)**
- Card verified via Stripe but not yet charged
- If card invalid → error displayed, establishment must retry

**SEPA / IBAN**
- IBAN entered, SEPA mandate generated
- Stripe sends mandate confirmation email
- If mandate not validated → reminder email sent after X hours

> If no valid payment method exists at any point → **ERREUR: moyen de paiement requis** → publication blocked.

---

## 4. Phase 3 — Matching

### How the algorithm works
Once published, the Renford matching algorithm automatically selects the most relevant Renfords based on:

- Mission type and required skills
- **Priority to the establishment's "Favourites"** (Mes Renfords > Mes Favoris)
- Experience level and past similar missions
- Availability (checked against the Renford's calendar)
- Location (same department or adjacent department in Île-de-France)
- Hourly rate compatibility (with tolerance margin set by the Renford)
- Optional: specific diplomas, pedagogical approach, target audience

> The current implementation uses an **AI conversational agent** applying business rules, with a roadmap toward a weighted scoring algorithm.

### Notification to Renfords
Once matched, eligible Renfords receive:
- **Email** with mission details (type, location, dates, rate, required equipment)
- **SMS** with a summary and link to their dashboard
- **Dashboard notification** shown automatically upon login

Renfords can accept or decline directly from their dashboard or by replying to the email.

---

## 5. Phase 4 — Candidate Selection

This phase works differently for Flex and Coach.

---

### 4A — Renford Flex

**Maximum 10 candidates in the queue.**

```
1 candidate available?
  ├── NO  → Status: PUBLIÉE (establishment waiting)
  └── YES → Establishment sees 1 profile (no name/contact shown)
               ├── REFUSE → Next candidate in queue
               └── ACCEPT → Candidate selected
                              └── Renford notified
                                    ├── ACCEPT → Check for schedule conflict
                                    │              ├── Conflict → Removed from queue
                                    │              └── No conflict → Mise en relation executed ✅
                                    └── REFUSE → Mission moves down in list
                                                  Status Renford: DÉCLINÉE
```

**Schedule conflict rule:** If the Renford has already accepted a mission at overlapping times, a rule applies (proposed: < 50% coverage of mission hours triggers conflict).

---

### 4B — Renford Coach

**Maximum 10 candidates, up to 3 profiles shown simultaneously.**

```
Establishment sees up to 3 profiles
  For each profile, establishment can:
  ├── REFUSE → Replaced by next candidate in queue
  ├── ACCEPT → Proceed to contract
  └── REQUEST VIDEO CALL (max 3 video call requests)
        └── Visio process:
              Renford receives 3 time slots (based on their calendar)
              ├── Accept 1 slot → Visio confirmed
              │     → Emails sent to all 3 parties (Renford, Independant, Establishment)
              │     → Calendly invitation sent
              │     → Establishment decides:
              │           ├── ACCEPT → Proceed to contract
              │           └── REFUSE → Next candidate
              ├── No slot works → 3 new slots proposed
              └── Refuse entirely → Removed from queue
```

**Queue management for Coach:**

| Situation | Renford Status |
|-----------|---------------|
| Among first 3 candidates | **CANDIDATURES EN COURS** |
| In waiting queue | **CANDIDATURES EN COURS** |
| A spot opens up | Renford moves up automatically |
| Not selected | Email "Non retenu" → **CANDIDATURES NON RETENU** |
| Selected | Email "Vous avez été sélectionné" |

> Once a Renford is selected for Coach, the other candidates are notified by email that they were not retained, and the establishment can no longer view other profiles.

---

## 6. Phase 5 — Contract

### Generation
Once a candidate is confirmed, a **service contract** is automatically generated via **YouSign or DocuSign**, containing:
- Mission details (dates, hours, rate)
- A notice clause (minimum 15 days notice for Coach missions)
- Legal terms

The contract is sent to all relevant parties for **electronic signature**.

```
Status: EN ATTENTE DE SIGNATURE
  └── Signatures received?
        ├── YES → All signed → Status: SIGNÉ → Status: CONFIRMÉE
        └── NO  → 3 automatic reminders sent at J+1
                    └── Still not signed after 3 reminders?
                          → Independant and/or Establishment marked NON RÉACTIF
                          → Establishment can decide:
                                ├── Relaunch search → Status returns to: PUBLIÉE
                                └── Cancel → Prestation ANNULÉE + Refund
```

### For Flex
- Contract signed → payment triggered via Stripe
- Mission added to both parties' calendars
- Calendar reminders activated

### For Coach
- After signature, full billing info collected from establishment (IBAN, SIRET, address)
- Funds unlocked from Stripe hold
- Renford receives full contact info for the establishment
- Mission displayed in both parties' personal spaces

---

## 7. Phase 6 — Active Mission

```
Start date reached? → Status: ACTIVE
```

### During the mission

**For the establishment:**
- Dashboard shows mission progress
- Can report an absence (with reason, dates, and comment)
- Can request a mission duration adjustment
- Can signal recurring issues → email sent to Renford admin → admin arbitrates

**For the Renford:**
- Daily reminders sent each morning (schedule, location, required equipment)
- Status updated in real time
- Can signal a change (schedule, date, location) → subject to establishment approval
- Can cancel (with risk of account suspension if < 24h before start)
- Working hours validated automatically if no incidents

> In V1, direct messaging between the two parties is **not available**. All communication goes through Renford support: contact@renford.fr / 06 25 92 27 70.

---

## 8. Phase 7 — Absence & Cancellation

### Declared Absence

```
Absence declared
  └── Duration?
        ├── < 1 month → Automatic replacement search → Status: EN PAUSE
        │                 └── Replacement found?
        │                       ├── YES → Status: EN REMPLACEMENT
        │                       │          └── Absence ends → Resume with original Renford
        │                       └── NO  → Mission stays on hold
        └── > 1 month → User blocked
```

### Cancellation Request

```
Cancellation requested
  └── Cancellation possible?
        ├── YES → Both parties agree?
        │           ├── YES → Set end date → Status: TERMINÉE
        │           └── NO  → Status: EN LITIGE
        │                       → Email to Renford admin
        │                       → Admin arbitrates
        │                       → Pro-rated payment applied
        └── NO  → No cancellation possible
```

### Renford cancellation penalties
- Cancellation **> 24h before start** → No penalty
- Cancellation **< 24h before start** → 7-day account suspension
- **2 late cancellations within 30 days** → Permanent account suspension
- Force majeure recognized → No penalty applied

---

## 9. Phase 8 — Closure, Rating & Payment

### Mission End

```
Mission finished? → Status: TERMINÉE
```

### Rating

```
Rating request sent to establishment
  └── Note given?
        ├── NO  → Automatic reminder sent
        └── YES → Note visible on Renford's profile
                    └── Note contested?
                          ├── NO  → End of workflow ✅
                          └── YES → Renford support decides
```

The Renford also completes an end-of-mission questionnaire (sent at J+1, reminders at J+2 and J+5).

### Payment

| Mission Type | When is payment triggered? |
|---|---|
| **Flex** | Payment already captured at the time of the visio / mission validation |
| **Coach** | Payment triggered at end of mission |

```
Payment dispute?
  ├── NO  → Stripe processes payment → Status: FACTURÉE
  │           → Invoice generated (FactureX format, conformant 2026)
  │           → Invoice sent to establishment + Renford
  │           → Renford paid via Stripe Connect
  │           → Documents archived in mission file
  └── YES → Manual adjustment by admin
```

### Documents generated at closure
- Final invoice for the establishment (services + commission)
- Invoice in the Renford's name addressed to Renford
- Mission completion attestation
- URSSAF attestation de vigilance (mandatory if mission > €5,000)
- Signed service contract (archived)

---

## 10. Complete Status Reference

| Status | Who it applies to | Meaning |
|--------|-------------------|---------|
| **BROUILLON** | Mission | Publication blocked — payment method invalid |
| **PUBLIÉE** | Mission / Establishment | Live and visible to eligible Renfords |
| **CANDIDATURES DISPONIBLES** | Mission | At least 1 candidate has applied (Flex) |
| **CANDIDATURES EN COURS** | Renford | Application submitted, awaiting establishment decision |
| **CANDIDATURES NON RETENU** | Renford | Not selected for the mission |
| **DÉCLINÉE** | Renford | Renford refused the mission — moves to bottom of list |
| **EN ATTENTE DE SIGNATURE** | Mission | Contract generated, awaiting electronic signatures |
| **SIGNÉ** | Mission | All parties have signed the contract |
| **CONFIRMÉE** | Mission | Fully confirmed, waiting for start date |
| **ACTIVE** | Mission | Start date reached, mission in progress |
| **EN PAUSE** | Mission | Absence declared, replacement being searched |
| **EN REMPLACEMENT** | Mission | Replacement Renford found and active |
| **EN LITIGE** | Mission | Cancellation or payment dispute — admin arbitration required |
| **TERMINÉE** | Mission | Mission completed |
| **FACTURÉE** | Mission | Payment processed, invoice sent to all parties |
| **NON RÉACTIF** | User | User hasn't signed after 3 reminders — flagged by system |

---

## 11. Full Flow Summary

```
ESTABLISHMENT CREATES MISSION
  └── Payment method valid?
        ├── NO  → [BROUILLON] — blocked
        └── YES → [PUBLIÉE]
                    └── Matching algorithm runs
                          └── Renfords notified (email + SMS + dashboard)
                                └── Renfords apply → become candidates

                                ┌─────────────────────────────────┐
                                │           FLEX                  │
                                │  1 profile shown at a time      │
                                │  Establishment: Accept/Refuse   │
                                │  Renford: Accept/Refuse         │
                                │  → Check schedule conflict      │
                                └─────────────────────────────────┘
                                ┌─────────────────────────────────┐
                                │           COACH                 │
                                │  Up to 3 profiles shown         │
                                │  Option: request video call     │
                                │  Establishment: Accept/Refuse   │
                                │  Renford: Accept/Refuse         │
                                └─────────────────────────────────┘

                          └── Candidate confirmed → [CANDIDATURE SÉLECTIONNÉE]

CONTRACT PHASE
  └── Contract auto-generated (YouSign/DocuSign)
        └── [EN ATTENTE DE SIGNATURE]
              └── All signed? → [SIGNÉ] → [CONFIRMÉE]
                    └── Start date reached → [ACTIVE]

ACTIVE MISSION
  ├── Normal progress → hours validated automatically
  ├── Absence declared → [EN PAUSE] → replacement search → [EN REMPLACEMENT]
  └── Cancellation requested → agreement? → [TERMINÉE] or [EN LITIGE]

CLOSURE
  └── [TERMINÉE]
        └── Rating sent to establishment
              └── Renford questionnaire sent (J+1)
                    └── Payment triggered
                          └── Stripe processes → [FACTURÉE]
                                └── Documents archived
                                      └── Renford paid via Stripe Connect ✅
```

---

*Document based on: Workflow Demande de Mission, Workflow de Paiement, Workflow Gestion de la Mission, and Cahier des Charges V1 — Renford.*
