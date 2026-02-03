# RENFORD - Simplified Technical Specification

## 1. Project Overview

### 1.1 Description

Renford is a SaaS platform designed to facilitate human resource management in the sports sector. It connects sports establishments (B2B) with independent sports professionals (freelancers).

### 1.2 Core Objectives

- **Matching & Recruitment**: Enable sports establishments to quickly find qualified professionals
- **Administrative Management**: Automate administrative tasks (invoices, quotes, certificates, URSSAF contributions)
- **Tracking & Analysis**: Provide performance tracking and reporting tools

---

## 2. User Roles & Permissions

### 2.1 User Types

| Role                                | Description                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| **Établissement (Sports Facility)** | Sports establishments that post missions and hire freelancers             |
| **Renford (Freelancer)**            | Independent sports professionals who accept and complete missions         |
| **Administrator**                   | Platform managers with full access to manage users, missions, and content |

### 2.2 Établissement Permissions

| Permission                          | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| Create/Manage Establishment Profile | Register and update establishment information                   |
| Manage Multiple Establishments      | Handle main/secondary establishment hierarchy                   |
| Post Missions                       | Create mission requests (FLEX or COACH modes)                   |
| View Renford Profiles               | Access matched freelancer profiles (limited info in COACH mode) |
| Manage Favorites                    | Add/remove favorite Renfords                                    |
| Sign Contracts                      | Digitally sign service contracts                                |
| Process Payments                    | Pay for missions via Stripe                                     |
| Validate Missions                   | Confirm mission completion                                      |
| Evaluate Renfords                   | Rate and review freelancers                                     |
| Access Documents                    | View/download invoices, contracts, attestations                 |
| View Statistics                     | Access performance metrics and reports                          |

### 2.3 Renford (Freelancer) Permissions

| Permission              | Description                                     |
| ----------------------- | ----------------------------------------------- |
| Create/Manage Profile   | Register and maintain professional profile      |
| Set Availability        | Define availability periods                     |
| Set Pricing             | Configure hourly/daily rates                    |
| Accept/Refuse Missions  | Respond to mission proposals                    |
| Sign Contracts          | Digitally sign service contracts                |
| Track Missions          | Monitor mission progress                        |
| Signal Changes          | Request mission modifications                   |
| Cancel Missions         | Cancel accepted missions (with conditions)      |
| Receive Payments        | Get paid via Stripe Connect                     |
| Evaluate Establishments | Rate and review establishments                  |
| Access Documents        | View/download invoices, contracts, attestations |
| View Statistics         | Access earnings and performance metrics         |

### 2.4 Administrator Permissions

| Permission              | Description                                 |
| ----------------------- | ------------------------------------------- |
| User Management         | View, edit, delete, suspend users           |
| Profile Verification    | Verify diplomas and add "Certified" badge   |
| Mission Management      | View, modify, cancel any mission            |
| Manual Assignment       | Manually assign freelancers to missions     |
| Dispute Resolution      | Handle conflicts between parties            |
| Subscription Management | Modify pricing and subscriptions            |
| Payment Tracking        | Monitor Stripe transactions                 |
| Content Management      | Edit static pages and announcements         |
| Document Management     | Edit document templates                     |
| Parameter Management    | Manage mission types, equipment lists, etc. |
| Statistics Access       | View platform-wide analytics                |
| Support Management      | Handle support tickets                      |

---

## 3. Establishment Hierarchy

### 3.1 Main vs Secondary Establishments

```
┌─────────────────────────────────────┐
│     Main Establishment (Group)      │
│   (e.g., Neoness Headquarters)      │
├─────────────────────────────────────┤
│  - Full admin permissions           │
│  - Manages all secondary locations  │
│  - Controls group-level settings    │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼───┐             ┌───▼───┐
│ Secondary           │ Secondary
│ Establishment 1     │ Establishment 2
│ (e.g., Neoness      │ (e.g., Neoness
│ République)         │ Bastille)
└─────────────────────┴─────────────────
```

### 3.2 Permissions by Establishment Type

| Feature                      | Main Establishment | Secondary Establishment |
| ---------------------------- | ------------------ | ----------------------- |
| Modify group name            | ✅                 | ❌                      |
| Modify own info              | ✅                 | ✅                      |
| Add secondary establishments | ✅                 | ❌                      |
| Post missions                | ✅                 | ✅                      |
| View group statistics        | ✅                 | Own only                |
| Delegate permissions         | ✅                 | ❌                      |

---

## 4. Mission Modes

### 4.1 Renford FLEX (Express Missions)

**Purpose**: Quick, short-term missions with rapid matching

**Characteristics**:

- Punctual/temporary missions
- Rapid matching via algorithm
- Immediate payment flow
- Automated contract generation

### 4.2 Renford COACH (Long-term Missions)

**Purpose**: Extended missions with curated selection and contractualization

**Characteristics**:

- Long-duration missions
- Curated shortlist (1-3 profiles)
- Pre-mission video calls available
- 15-day minimum notice period for cancellation
- Secured payment (held until contract signed)

---

## 5. User Flows

### 5.1 Établissement Registration Flow

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Register   │────▶│ Complete Profile │────▶│ Add Favorites   │
│   Account    │     │ (Establishment)  │     │   (Optional)    │
└──────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   Dashboard     │
                                              └─────────────────┘
```

**Profile Requirements**:

- Establishment name
- SIRET/SIREN number
- Complete address
- Phone number
- Primary email
- Primary contact name
- Establishment type
- Main/Secondary designation

### 5.2 Renford Registration Flow

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Register   │────▶│   General Info   │────▶│ Qualifications  │
│   Account    │     │   & Profile      │     │ & Experience    │
└──────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ ID & Availability│
                                              └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Profile Review │
                                              │  (Admin verify) │
                                              └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   "Certified"   │
                                              │     Badge       │
                                              └─────────────────┘
```

**Profile Requirements**:

- Mission types (multiple selection)
- Profile title
- Profile description
- Diplomas (with justification upload)
- Experience level
- Hourly/daily rates
- Flexibility gauge (-0% to -15%)
- Professional card (upload)
- IBAN
- URSSAF vigilance attestation
- Insurance justification
- Availability dates

### 5.3 Mission Request Flow (FLEX)

```
┌─────────────────┐
│ Create Mission  │
│    Request      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Define Criteria │
│ - Establishment │
│ - Position type │
│ - Experience    │
│ - Duration      │
│ - Schedule      │
│ - Pricing       │
│ - Description   │
│ - Equipment     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Summary &     │
│    Review       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Submit       │
│    Request      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Matching    │
│  Algorithm      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify Matched  │
│   Renfords      │
└─────────────────┘
```

### 5.4 Mission Request Flow (COACH)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Create Mission  │────▶│   Summary &     │────▶│ Secured Payment │
│   (+ Level,     │     │    Review       │     │ (Not captured)  │
│   Participants) │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Internal Short- │
                                                │ list (1-3)      │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ View Profiles   │
                                                │ (No contact     │
                                                │  info shown)    │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Schedule Video  │
                                                │ Call (Calendly) │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Select Renford  │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Contract Sign   │
                                                │ (e-signature)   │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ Payment         │
                                                │ Captured        │
                                                └─────────────────┘
```

### 5.5 Renford Mission Acceptance Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Receive Mission │────▶│ Review Mission  │────▶│ Accept/Refuse   │
│ Notification    │     │    Details      │     │                 │
│ (Email+SMS+     │     │                 │     │                 │
│  Dashboard)     │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                        ┌────────────────┴────────────────┐
                                        │                                 │
                                        ▼                                 ▼
                               ┌─────────────────┐               ┌─────────────────┐
                               │    ACCEPT       │               │    REFUSE       │
                               └────────┬────────┘               └─────────────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Sign Contract   │
                               │ (e-signature)   │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Mission Added   │
                               │ to Calendar     │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Execute Mission │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Mission Closure │
                               │ & Evaluation    │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Receive Payment │
                               └─────────────────┘
```

### 5.6 Mission Lifecycle

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Created │────▶│ Matching│────▶│ Accepted│────▶│Contracted│
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                     │
                                                     ▼
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Archived│◀────│Completed│◀────│Validated│◀────│In Progress│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

**Mission Statuses**:
| Status | Description |
|--------|-------------|
| Envoyée (Sent) | Mission submitted, awaiting matching |
| En cours de matching | Algorithm searching for suitable Renfords |
| Proposée | Renford(s) notified |
| Acceptée | Renford accepted, awaiting contract |
| Contrat signé | Contract signed by both parties |
| Payée | Payment processed |
| En cours | Mission in progress |
| À valider | Awaiting validation from establishment |
| Validée | Mission validated |
| Terminée | Mission completed |
| Archivée | Mission archived |
| Annulée | Mission cancelled |

---

## 6. Payment System

### 6.1 Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │Establish-│───▶│  Stripe  │───▶│  Renford │───▶│ Renford  │  │
│  │   ment   │    │  (Hold)  │    │ Platform │    │(Freelancer)│  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │          │
│       │               │               │               │          │
│   Payment         Funds held      Commission       Net payment   │
│   submitted       until            deducted        released      │
│                   validation                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Payment Conditions

| Event                              | Action                                       |
| ---------------------------------- | -------------------------------------------- |
| Mission request submitted (FLEX)   | No payment yet                               |
| Contract signed (FLEX)             | Payment processed, funds held                |
| Mission request submitted (COACH)  | Payment processed, funds held (not captured) |
| Contract signed (COACH)            | Funds captured                               |
| Mission validated by establishment | Funds released to Renford                    |
| Dispute raised                     | Funds held pending resolution                |

### 6.3 Pricing Methods

| Method                      | Description                                    |
| --------------------------- | ---------------------------------------------- |
| **Hourly Rate**             | Payment per hour worked                        |
| **Fixed Rate (Prestation)** | Flat fee for entire mission                    |
| **Degressive Rate**         | Rate decreases based on number of participants |

**Hourly Rate Brackets**:

- Less than €45/hour
- Between €45 and €59/hour
- More than €60/hour

### 6.4 Commission Structure

- Platform commission deducted from mission cost
- Commission percentage on completed missions only
- Establishments bear the service fees
- Free for Renfords (freelancers)

### 6.5 Required Banking Information

**For Establishments**:

- Account holder name
- Email
- IBAN
- Billing name
- Address
- Postal code, City, Country
- SIRET

**For Renfords**:

- Account holder name
- IBAN

---

## 7. Document Generation

### 7.1 Automatically Generated Documents

| Document                                     | Trigger                 | Recipients            |
| -------------------------------------------- | ----------------------- | --------------------- |
| **Devis (Quote)**                            | Renford accepts mission | Establishment         |
| **Contrat de prestation (Service Contract)** | Quote accepted          | Both parties          |
| **Facture (Invoice)**                        | Mission validated       | Both parties          |
| **Attestation de mission**                   | Mission completed       | Both parties          |
| **Attestation de vigilance URSSAF**          | Missions > €5,000       | Required from Renford |
| **Bordereau de paiement (Payment slip)**     | Payment processed       | Both parties          |

### 7.2 Document Requirements

- Format: PDF (Facture-X format for invoices, compliant with 2026 e-invoicing regulations)
- Electronic signature: Via DocuSign/PandaDoc/Yousign
- Storage: Archived in mission file
- Accessibility: Available in user dashboards

---

## 8. Notification System

### 8.1 Notification Channels

| Channel       | Use Case                                |
| ------------- | --------------------------------------- |
| **Email**     | All notifications, detailed information |
| **SMS**       | Mission alerts, urgent notifications    |
| **Dashboard** | In-app notifications, alerts            |
| **Calendar**  | Mission reminders, deadlines            |

### 8.2 Notification Events

| Event                                  | Recipients       | Channels              |
| -------------------------------------- | ---------------- | --------------------- |
| New mission available                  | Matched Renfords | Email, SMS, Dashboard |
| Mission accepted                       | Establishment    | Email, Dashboard      |
| Contract ready for signature           | Both parties     | Email                 |
| Payment processed                      | Renford          | Email                 |
| Mission reminder (1 week before)       | Both parties     | Email, SMS            |
| Mission reminder (2 days before)       | Both parties     | Email, SMS            |
| Mission completed - evaluation request | Both parties     | Email, Dashboard      |
| Document expiring (certifications)     | Renford          | Dashboard             |
| Quote reminder (unsigned)              | Establishment    | Email                 |
| Evaluation reminder (J+1, J+2, J+5)    | Both parties     | Email                 |

---

## 9. Matching Algorithm

### 9.1 Matching Criteria

| Criterion            | Weight  | Description                                   |
| -------------------- | ------- | --------------------------------------------- |
| **Favorites**        | Highest | Priority to establishment's favorite Renfords |
| **Mission type**     | High    | Match required competencies                   |
| **Experience level** | High    | Match required experience                     |
| **Availability**     | High    | Dates must overlap                            |
| **Location**         | Medium  | Same or neighboring departments               |
| **Pricing**          | Medium  | Within specified range (with tolerance)       |
| **Diplomas**         | Medium  | Match required certifications                 |
| **Past performance** | Medium  | Rating and mission history                    |
| **Specializations**  | Low     | Additional specific skills                    |

### 9.2 Location Matching (Île-de-France)

Adjacent departments considered "close":

- Paris ↔ Hauts-de-Seine, Seine-Saint-Denis, Val-de-Marne
- Seine-et-Marne ↔ Val-de-Marne, Essonne
- Yvelines ↔ Hauts-de-Seine, Val-d'Oise, Essonne
- Essonne ↔ Hauts-de-Seine, Val-de-Marne, Seine-et-Marne, Yvelines
- Hauts-de-Seine ↔ Paris, Yvelines, Essonne, Val-de-Marne
- Seine-Saint-Denis ↔ Paris, Val-d'Oise, Val-de-Marne
- Val-de-Marne ↔ Paris, Seine-Saint-Denis, Hauts-de-Seine, Essonne, Seine-et-Marne
- Val-d'Oise ↔ Yvelines, Seine-Saint-Denis

### 9.3 Pricing Match Logic

| Mission Bracket     | Renford Accepted Range |
| ------------------- | ---------------------- |
| Less than €45/hour  | ≤ €55/hour             |
| Between €45-59/hour | €35-70/hour            |
| More than €60/hour  | ≥ €50/hour             |

---

## 10. Mission Management Features

### 10.1 Mission Modification (By Renford)

**Allowed Changes** (subject to establishment approval):

- Schedule adjustments
- Start/end date changes
- Location changes
- Other (with justification)

**Process**:

1. Renford submits change request
2. Establishment notified
3. Establishment approves/rejects
4. Both parties notified of decision

### 10.2 Mission Cancellation

**By Renford**:

- Must cancel at least 24 hours before
- Late cancellation → 7-day account suspension
- 2 late cancellations in 30 days → Permanent suspension
- Force majeure exceptions apply

**By Establishment**:

- Can cancel before contract signature without penalty
- After contract → Subject to terms

### 10.3 Absence Reporting (By Establishment)

**Fields**:

- Renford name
- Absence start date
- Absence end date
- Reason (dropdown):
  - Unexpected other mission
  - Communication problem
  - Availability problem
  - Unplanned absence
  - Other
- Comments

### 10.4 Duration Adjustment (By Establishment)

**Fields**:

- Renford name
- New start time
- New end time
- Reason (dropdown):
  - Mission start delay
  - Unexpected issue requiring extension
  - Duration extension
  - Change in mission needs
  - Other
- Comments

---

## 11. Evaluation System

### 11.1 Establishment Evaluates Renford

| Question                           | Type                                              |
| ---------------------------------- | ------------------------------------------------- |
| Did the service meet expectations? | Yes/No (+ comment if No)                          |
| Add to favorites?                  | Yes/No                                            |
| Service quality rating             | Dropdown: Excellent/Très bien/Bien/Moyen/Médiocre |
| Platform satisfaction              | 1-5 stars                                         |
| Overall service satisfaction       | 1-5 stars                                         |
| Additional comments                | Text                                              |

### 11.2 Renford Evaluates Establishment

| Question                                | Type            |
| --------------------------------------- | --------------- |
| Work quality rating                     | 1-5 stars       |
| Would you recommend this establishment? | Yes/No          |
| Problems encountered                    | Text            |
| Most satisfying aspects                 | Multiple choice |
| Platform satisfaction                   | 1-5 stars       |
| Additional comments                     | Text            |

**Satisfying Aspects Options**:

- Quality of work performed
- Team professionalism
- Respect of deadlines
- Effective communication
- Adaptability to specific needs
- Technical competencies/expertise
- Harmonious collaboration with existing team
- Clarity of instructions provided
- Quick problem resolution
- Added value to the mission

---

## 12. Technical Requirements

### 12.1 Technology Stack

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| **Front-End**        | React.js or Vue.js                    |
| **Back-End**         | Node.js with Express.js or NestJS     |
| **Database**         | PostgreSQL (primary), Redis (caching) |
| **Architecture**     | RESTful API                           |
| **Hosting**          | AWS or Google Cloud                   |
| **Containerization** | Docker + Kubernetes                   |
| **Monitoring**       | Prometheus + Grafana                  |

### 12.2 Third-Party Integrations

| Service     | Provider                  | Purpose                |
| ----------- | ------------------------- | ---------------------- |
| Payments    | Stripe Connect            | Payment processing     |
| E-Signature | DocuSign/PandaDoc/Yousign | Contract signing       |
| Calendar    | Google Calendar           | Scheduling & reminders |
| Video Calls | Calendly                  | Pre-mission meetings   |
| Chat        | Hubspot                   | Customer support       |
| Analytics   | GTM, Google Analytics     | Usage tracking         |
| Consent     | Consent Manager           | GDPR compliance        |

### 12.3 Performance Requirements

| Metric            | Target                         |
| ----------------- | ------------------------------ |
| API Response Time | < 200ms (normal load)          |
| Concurrent Users  | 10,000+                        |
| Real-time Updates | Immediate for critical actions |
| Availability      | 99.9% uptime                   |

### 12.4 Security Requirements

| Requirement       | Implementation                                   |
| ----------------- | ------------------------------------------------ |
| GDPR Compliance   | Consent mechanisms, data access, deletion rights |
| Data Encryption   | AES-256 for sensitive data                       |
| Authentication    | 2FA for critical access                          |
| Protection        | Firewalls, IDS                                   |
| Incident Response | Defined response plan                            |

---

## 13. Data Requirements

### 13.1 Establishment Data Model

```
Establishment {
  id: UUID
  name: String (required)
  siret_siren: String (required)
  address: Address (required)
  phone: String (required)
  email: String (required)
  primary_contact: String (required)
  type: EstablishmentType (required)
  is_main: Boolean
  parent_establishment_id: UUID (nullable)
  logo: File (optional)
  capacity: Integer (optional)
  opening_hours: Schedule (optional)
  services: String[] (optional)
  certifications: String[] (optional)
  equipment: String[] (optional)
  photos: File[] (optional)
  banking_info: BankingInfo
  created_at: DateTime
  updated_at: DateTime
}
```

### 13.2 Renford (Freelancer) Data Model

```
Renford {
  id: UUID
  first_name: String (required)
  last_name: String (required)
  email: String (required)
  phone: String (required)
  profile_photo: File
  profile_title: String (required)
  description: Text (required)
  mission_types: MissionType[] (required)
  specializations: String[]
  experience_level: ExperienceLevel (required)
  diplomas: Diploma[] (required)
  diploma_justifications: File[]
  hourly_rate: Decimal (required)
  flexibility_percentage: Integer (0-15)
  daily_half_rate: Decimal (optional)
  daily_full_rate: Decimal (optional)
  professional_card: File
  iban: String
  vigilance_attestation: File
  insurance_justification: File
  availability_start: Date
  availability_end: Date
  unlimited_availability: Boolean
  location: Address
  department: String
  is_certified: Boolean (default: false)
  rating: Decimal
  missions_completed: Integer
  created_at: DateTime
  updated_at: DateTime
}
```

### 13.3 Mission Data Model

```
Mission {
  id: UUID
  establishment_id: UUID (required)
  mode: MissionMode (FLEX/COACH) (required)
  position_type: PositionType (required)
  experience_level: ExperienceLevel (required)
  start_date: DateTime (required)
  end_date: DateTime (required)
  schedules: Schedule[] (required)
  pricing_method: PricingMethod (required)
  hourly_rate_bracket: HourlyRateBracket (optional)
  fixed_rate: Decimal (optional)
  participant_count: Integer (optional)
  description: Text (required)
  required_equipment: Equipment[]
  required_diploma: Diploma (optional)
  course_level: String (optional)
  expense_coverage: Boolean
  status: MissionStatus (required)
  assigned_renford_id: UUID (nullable)
  matched_renfords: UUID[]
  quote_document: File
  contract_document: File
  invoice_document: File
  attestation_document: File
  establishment_rating: Rating
  renford_rating: Rating
  total_hours: Decimal (calculated)
  total_cost: Decimal (calculated)
  commission: Decimal (calculated)
  payment_status: PaymentStatus
  created_at: DateTime
  updated_at: DateTime
}
```

---

## 14. Admin Panel Features

### 14.1 User Management

- View all users with filters (name, status, date, missions)
- Edit/delete users
- Verify diplomas and add "Certified" badge
- Manage suspensions/bans
- Manual user creation

### 14.2 Mission Management

- View all missions (past, current, upcoming)
- Modify/cancel missions
- Manual Renford assignment
- Dispute management

### 14.3 Payment Management

- Modify pricing and subscriptions
- Manage promotions/discounts
- Track Stripe transactions
- View invoices and payment history

### 14.4 Content Management

- Edit static pages
- Manage mission parameters (types, equipment, rates)
- Dashboard announcements/alerts
- Add features without code changes

### 14.5 Document Management

- Edit generated documents (invoices, contracts, attestations)
- Customize document templates
- Add documents manually
- Adapt templates to legal changes

### 14.6 Analytics Dashboard

- Active users count
- Missions posted/completed
- Acceptance rates
- Transaction volumes
- User performance analysis
- Trend visualization

---

## 15. Business Rules

### 15.1 Cancellation Policy

| Actor         | Timing          | Consequence          |
| ------------- | --------------- | -------------------- |
| Renford       | > 24h before    | No penalty           |
| Renford       | < 24h before    | 7-day suspension     |
| Renford       | 2x in 30 days   | Permanent suspension |
| Establishment | Before contract | No penalty           |
| Establishment | After contract  | Per contract terms   |

### 15.2 URSSAF Vigilance Attestation

- **Mandatory** for missions exceeding €5,000
- Must be valid and up-to-date
- Platform alerts Renford when expiring

### 15.3 Profile Certification

- Renford profiles marked as "Certified" after manual verification
- Verification includes: diplomas, professional card, insurance
- Certified profiles get priority in matching

### 15.4 Favorite System

- Establishments can add Renfords to favorites
- Favorites get priority in matching algorithm
- Favorites can be recommended to other group establishments

### 15.5 Pricing Flexibility

- Renfords can set flexibility gauge (0% to -15%)
- Not publicly displayed
- Used by algorithm to improve matching
- Higher flexibility = more mission opportunities

---

## 16. Integration APIs

### 16.1 Stripe Integration

- Stripe Connect for marketplace payments
- KYC verification when necessary
- Automatic payment on mission validation
- Invoice generation and archiving

### 16.2 E-Signature Integration

- DocuSign/PandaDoc/Yousign for contracts
- Automatic contract generation
- Signature tracking and reminders

### 16.3 Calendar Integration

- Google Calendar sync
- Mission reminders
- Availability management
- Video call scheduling (Calendly)

### 16.4 URSSAF Integration (Future)

- Direct contribution submission
- Automatic attestation retrieval

---

## 17. Support System

### 17.1 Support Channels

- Email: contact@renford.fr
- Phone: Emergency hotline
- Chat: Hubspot integration
- FAQ: Self-service knowledge base

### 17.2 Support Features

- Ticket management system
- Direct user contact
- Automated notifications
- Response time SLA (24h business hours)

---

## 18. Compliance & Legal

### 18.1 GDPR Requirements

- Explicit consent for data collection
- Right to access personal data
- Right to delete account and data
- Data anonymization for inactive accounts
- Consent manager integration

### 18.2 French Labor Law Compliance

- Article L.8222-1 Code du travail (vigilance attestation)
- Service contracts compliant with regulations
- Proper classification of independent workers

### 18.3 E-Invoicing Compliance (2026)

- Facture-X format
- Integration with PDP or PPF for certified transmission
