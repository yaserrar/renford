# RENFORD - Development Plan

> **Context**: Fast developer using TypeScript + AI assistance, UI design already completed
> **Estimated Total Duration**: 10-12 weeks (solo developer, full-time)

---

## Tech Stack Summary

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Frontend     | React.js / Next.js + TypeScript |
| Backend      | Node.js + Express + TypeScript  |
| Database     | PostgreSQL + Prisma ORM         |
| Cache        | Redis                           |
| Auth         | JWT                             |
| Payments     | Stripe Connect                  |
| E-Signature  | Yousign / PandaDoc API          |
| File Storage | Local / Minio                   |
| Email        | SendGrid / Resend               |
| SMS          | Twilio                          |
| Calendar     | Google Calendar API             |
| Hosting      | Docker                          |

---

## Development Phases Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Foundation (Week 1-2)                                     │
│  ├── Project Setup & Architecture                                   │
│  ├── Database Schema & Prisma                                       │
│  └── Auth Module                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: Core User Features (Week 3-4)                             │
│  ├── User Profiles Module                                           │
│  ├── Establishment Module                                           │
│  └── File Upload System                                             │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: Mission System (Week 5-6)                                 │
│  ├── Mission CRUD Module                                            │
│  ├── Matching Algorithm                                             │
│  └── Mission Workflow                                               │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: Payments & Documents (Week 7-8)                           │
│  ├── Stripe Integration                                             │
│  ├── Document Generation                                            │
│  └── E-Signature Integration                                        │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 5: Communication & Calendar (Week 9)                         │
│  ├── Notification System                                            │
│  ├── Email/SMS Templates                                            │
│  └── Calendar Integration                                           │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 6: Admin & Polish (Week 10-11)                               │
│  ├── Admin Panel                                                    │
│  ├── Dashboard & Statistics                                         │
│  └── Testing & Bug Fixes                                            │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 7: Deployment & Launch (Week 12)                             │
│  ├── Production Setup                                               │
│  ├── Data Migration                                                 │
│  └── Final QA                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: Foundation (Week 1-2)

### Module 1.1: Project Setup

**Duration**: 2 days

| Task                                    | Priority  | Est. Time |
| --------------------------------------- | --------- | --------- |
| Initialize Next.js + TypeScript project | 🔴 High   | 1h        |
| Initialize NestJS + TypeScript backend  | 🔴 High   | 1h        |
| Setup monorepo structure (Turborepo/Nx) | 🟡 Medium | 2h        |
| Configure ESLint, Prettier, Husky       | 🟡 Medium | 1h        |
| Setup environment variables structure   | 🔴 High   | 1h        |
| Configure Docker for local development  | 🟡 Medium | 2h        |
| Setup PostgreSQL + Redis locally        | 🔴 High   | 1h        |
| Create shared types package             | 🔴 High   | 2h        |
| Setup API client (Axios/React Query)    | 🔴 High   | 2h        |

**Deliverables**:

- [ ] Working monorepo with frontend + backend
- [ ] Local Docker environment
- [ ] Shared TypeScript types between FE/BE

---

### Module 1.2: Database Schema

**Duration**: 2 days

| Task                                    | Priority  | Est. Time |
| --------------------------------------- | --------- | --------- |
| Design Prisma schema for Users          | 🔴 High   | 2h        |
| Design Prisma schema for Establishments | 🔴 High   | 2h        |
| Design Prisma schema for Renfords       | 🔴 High   | 2h        |
| Design Prisma schema for Missions       | 🔴 High   | 3h        |
| Design Prisma schema for Documents      | 🔴 High   | 1h        |
| Design Prisma schema for Payments       | 🔴 High   | 2h        |
| Design Prisma schema for Notifications  | 🟡 Medium | 1h        |
| Design Prisma schema for Evaluations    | 🟡 Medium | 1h        |
| Setup migrations & seed data            | 🔴 High   | 2h        |

**Deliverables**:

- [ ] Complete Prisma schema
- [ ] Initial migrations
- [ ] Seed data for development

---

### Module 1.3: Authentication

**Duration**: 3 days

#### Backend Tasks

| Task                                        | Priority  | Est. Time |
| ------------------------------------------- | --------- | --------- |
| Setup Passport.js with JWT strategy         | 🔴 High   | 2h        |
| Create auth guards (JWT, Roles)             | 🔴 High   | 2h        |
| Implement register endpoint (Etablissement) | 🔴 High   | 2h        |
| Implement register endpoint (Renford)       | 🔴 High   | 2h        |
| Implement login endpoint                    | 🔴 High   | 1h        |
| Implement password reset flow               | 🔴 High   | 2h        |
| Implement email verification                | 🔴 High   | 2h        |
| Setup refresh token mechanism               | 🔴 High   | 2h        |
| Implement Google OAuth                      | 🟡 Medium | 2h        |
| Implement Facebook OAuth                    | 🟢 Low    | 2h        |

#### Frontend Tasks

| Task                                                 | Priority  | Est. Time |
| ---------------------------------------------------- | --------- | --------- |
| Create auth context/store (Zustand)                  | 🔴 High   | 2h        |
| Implement login page                                 | 🔴 High   | 1h        |
| Implement registration page (common)                 | 🔴 High   | 2h        |
| Implement registration page (Etablissement specific) | 🔴 High   | 1h        |
| Implement registration page (Renford specific)       | 🔴 High   | 1h        |
| Implement forgot password page                       | 🔴 High   | 1h        |
| Implement reset password page                        | 🔴 High   | 1h        |
| Create protected route HOC                           | 🔴 High   | 1h        |
| Implement social login buttons                       | 🟡 Medium | 1h        |
| Add form validation (Zod + React Hook Form)          | 🔴 High   | 2h        |

**Deliverables**:

- [ ] Complete auth flow (register, login, logout, reset)
- [ ] JWT token management
- [ ] Protected routes
- [ ] Social login (Google, Facebook)

---

## PHASE 2: Core User Features (Week 3-4)

### Module 2.1: Renford Profile

**Duration**: 3 days

#### Backend Tasks

| Task                                               | Priority  | Est. Time |
| -------------------------------------------------- | --------- | --------- |
| CRUD endpoints for Renford profile                 | 🔴 High   | 2h        |
| Profile completion percentage calculator           | 🟡 Medium | 1h        |
| Availability management endpoints                  | 🔴 High   | 2h        |
| Pricing management endpoints                       | 🔴 High   | 1h        |
| Diploma/certification upload endpoints             | 🔴 High   | 2h        |
| Documents upload endpoints (carte pro, IBAN, etc.) | 🔴 High   | 2h        |
| Specializations management                         | 🔴 High   | 1h        |
| Profile visibility settings                        | 🟡 Medium | 1h        |

#### Frontend Tasks

| Task                                          | Priority | Est. Time |
| --------------------------------------------- | -------- | --------- |
| Profile wizard (multi-step form)              | 🔴 High  | 4h        |
| Step 1: General info form                     | 🔴 High  | 2h        |
| Step 2: Qualifications form                   | 🔴 High  | 2h        |
| Step 3: Pricing form (with flexibility gauge) | 🔴 High  | 2h        |
| Step 4: Documents upload form                 | 🔴 High  | 2h        |
| Step 5: Availability calendar                 | 🔴 High  | 3h        |
| Profile view page                             | 🔴 High  | 2h        |
| Profile edit page                             | 🔴 High  | 2h        |
| Skills/specializations selector               | 🔴 High  | 2h        |

**Deliverables**:

- [ ] Complete Renford profile management
- [ ] Document upload system
- [ ] Availability calendar

---

### Module 2.2: Establishment Profile

**Duration**: 3 days

#### Backend Tasks

| Task                               | Priority  | Est. Time |
| ---------------------------------- | --------- | --------- |
| CRUD endpoints for Establishment   | 🔴 High   | 2h        |
| Main/Secondary establishment logic | 🔴 High   | 3h        |
| Multi-establishment management     | 🔴 High   | 2h        |
| Favorite Renfords management       | 🔴 High   | 2h        |
| Banking info management            | 🔴 High   | 2h        |
| Establishment search for linking   | 🟡 Medium | 2h        |

#### Frontend Tasks

| Task                               | Priority  | Est. Time |
| ---------------------------------- | --------- | --------- |
| Establishment profile wizard       | 🔴 High   | 3h        |
| Main/Secondary selection UI        | 🔴 High   | 2h        |
| Add secondary establishments form  | 🔴 High   | 2h        |
| Favorites management page          | 🔴 High   | 2h        |
| Establishment listing (for groups) | 🔴 High   | 2h        |
| Banking info form                  | 🔴 High   | 2h        |
| Establishment search component     | 🟡 Medium | 2h        |

**Deliverables**:

- [ ] Complete Establishment profile management
- [ ] Multi-establishment hierarchy
- [ ] Favorites system

---

### Module 2.3: File Upload System

**Duration**: 2 days

#### Backend Tasks

| Task                                   | Priority  | Est. Time |
| -------------------------------------- | --------- | --------- |
| Setup AWS S3 / Cloudinary integration  | 🔴 High   | 2h        |
| Create file upload service             | 🔴 High   | 2h        |
| Implement file validation (type, size) | 🔴 High   | 1h        |
| Create presigned URL generation        | 🔴 High   | 2h        |
| File deletion endpoints                | 🟡 Medium | 1h        |

#### Frontend Tasks

| Task                                  | Priority  | Est. Time |
| ------------------------------------- | --------- | --------- |
| Create reusable file upload component | 🔴 High   | 3h        |
| Implement drag & drop                 | 🟡 Medium | 1h        |
| File preview component                | 🟡 Medium | 2h        |
| Progress indicator                    | 🟡 Medium | 1h        |

**Deliverables**:

- [ ] Cloud file storage integration
- [ ] Reusable upload components
- [ ] File validation

---

## PHASE 3: Mission System (Week 5-6)

### Module 3.1: Mission CRUD

**Duration**: 3 days

#### Backend Tasks

| Task                             | Priority | Est. Time |
| -------------------------------- | -------- | --------- |
| Create mission endpoint (FLEX)   | 🔴 High  | 3h        |
| Create mission endpoint (COACH)  | 🔴 High  | 3h        |
| Mission listing with filters     | 🔴 High  | 2h        |
| Mission detail endpoint          | 🔴 High  | 1h        |
| Mission update endpoint          | 🔴 High  | 2h        |
| Mission cancel endpoint          | 🔴 High  | 2h        |
| Mission status workflow          | 🔴 High  | 3h        |
| Schedule management (time slots) | 🔴 High  | 2h        |
| Cost calculation service         | 🔴 High  | 2h        |

#### Frontend Tasks

| Task                                     | Priority  | Est. Time |
| ---------------------------------------- | --------- | --------- |
| Mission creation wizard (FLEX)           | 🔴 High   | 4h        |
| Mission creation wizard (COACH)          | 🔴 High   | 4h        |
| Schedule selector component              | 🔴 High   | 3h        |
| Pricing options form                     | 🔴 High   | 2h        |
| Equipment selector (dynamic by position) | 🔴 High   | 2h        |
| Mission summary/review page              | 🔴 High   | 2h        |
| Mission listing page (Etablissement)     | 🔴 High   | 2h        |
| Mission listing page (Renford)           | 🔴 High   | 2h        |
| Mission detail page                      | 🔴 High   | 3h        |
| Mission status badges/timeline           | 🟡 Medium | 2h        |

**Deliverables**:

- [ ] Complete mission creation flow
- [ ] Mission management for both user types
- [ ] Status workflow implementation

---

### Module 3.2: Matching Algorithm

**Duration**: 2 days

#### Backend Tasks

| Task                                      | Priority  | Est. Time |
| ----------------------------------------- | --------- | --------- |
| Create matching service                   | 🔴 High   | 4h        |
| Implement favorites priority              | 🔴 High   | 1h        |
| Implement location matching (departments) | 🔴 High   | 2h        |
| Implement availability overlap check      | 🔴 High   | 2h        |
| Implement pricing match logic             | 🔴 High   | 2h        |
| Implement skills/position matching        | 🔴 High   | 1h        |
| Implement experience level matching       | 🟡 Medium | 1h        |
| Scoring & ranking system                  | 🔴 High   | 2h        |
| Shortlist generation (COACH mode)         | 🔴 High   | 2h        |

**Deliverables**:

- [ ] Working matching algorithm
- [ ] Shortlist generation for COACH
- [ ] Ranking by relevance

---

### Module 3.3: Mission Workflow

**Duration**: 3 days

#### Backend Tasks

| Task                                        | Priority | Est. Time |
| ------------------------------------------- | -------- | --------- |
| Mission accept endpoint (Renford)           | 🔴 High  | 2h        |
| Mission refuse endpoint (Renford)           | 🔴 High  | 1h        |
| Mission validation endpoint (Etablissement) | 🔴 High  | 2h        |
| Change request endpoint                     | 🔴 High  | 2h        |
| Cancellation endpoint with rules            | 🔴 High  | 3h        |
| Absence reporting endpoint                  | 🔴 High  | 2h        |
| Duration adjustment endpoint                | 🔴 High  | 2h        |
| Mission completion flow                     | 🔴 High  | 2h        |

#### Frontend Tasks

| Task                           | Priority | Est. Time |
| ------------------------------ | -------- | --------- |
| Mission notification popup     | 🔴 High  | 2h        |
| Accept/Refuse mission UI       | 🔴 High  | 2h        |
| Change request form            | 🔴 High  | 2h        |
| Cancellation form with warning | 🔴 High  | 2h        |
| Absence reporting form         | 🔴 High  | 2h        |
| Duration adjustment form       | 🔴 High  | 2h        |
| Mission validation form        | 🔴 High  | 2h        |
| Shortlist view (COACH)         | 🔴 High  | 3h        |

**Deliverables**:

- [ ] Complete mission lifecycle
- [ ] All modification flows
- [ ] Cancellation with policy enforcement

---

## PHASE 4: Payments & Documents (Week 7-8)

### Module 4.1: Stripe Integration

**Duration**: 4 days

#### Backend Tasks

| Task                                 | Priority  | Est. Time |
| ------------------------------------ | --------- | --------- |
| Setup Stripe Connect                 | 🔴 High   | 3h        |
| Create Connect account for Renfords  | 🔴 High   | 3h        |
| Implement payment intent creation    | 🔴 High   | 2h        |
| Implement payment hold (COACH)       | 🔴 High   | 2h        |
| Implement payment capture            | 🔴 High   | 2h        |
| Implement payment release to Renford | 🔴 High   | 2h        |
| Commission calculation & deduction   | 🔴 High   | 2h        |
| Refund handling                      | 🔴 High   | 2h        |
| Stripe webhooks handling             | 🔴 High   | 3h        |
| Payment history endpoints            | 🟡 Medium | 2h        |

#### Frontend Tasks

| Task                         | Priority  | Est. Time |
| ---------------------------- | --------- | --------- |
| Stripe Elements integration  | 🔴 High   | 3h        |
| Payment form component       | 🔴 High   | 2h        |
| Connect onboarding flow      | 🔴 High   | 3h        |
| Payment status display       | 🔴 High   | 2h        |
| Payment history page         | 🟡 Medium | 2h        |
| Earnings dashboard (Renford) | 🔴 High   | 3h        |

**Deliverables**:

- [ ] Complete Stripe Connect integration
- [ ] Payment flow for both modes
- [ ] Commission handling
- [ ] Payment tracking

---

### Module 4.2: Document Generation

**Duration**: 3 days

#### Backend Tasks

| Task                                            | Priority  | Est. Time |
| ----------------------------------------------- | --------- | --------- |
| Setup PDF generation library (PDFKit/Puppeteer) | 🔴 High   | 2h        |
| Create quote (devis) template & generator       | 🔴 High   | 3h        |
| Create service contract template                | 🔴 High   | 3h        |
| Create invoice template (Facture-X compliant)   | 🔴 High   | 4h        |
| Create mission attestation template             | 🔴 High   | 2h        |
| Create payment slip template                    | 🟡 Medium | 2h        |
| Document storage & linking to missions          | 🔴 High   | 2h        |
| Document retrieval endpoints                    | 🔴 High   | 1h        |

#### Frontend Tasks

| Task                                | Priority | Est. Time |
| ----------------------------------- | -------- | --------- |
| Document viewer component           | 🔴 High  | 2h        |
| Document download buttons           | 🔴 High  | 1h        |
| Documents section in mission detail | 🔴 High  | 2h        |

**Deliverables**:

- [ ] All document templates
- [ ] Automatic generation on triggers
- [ ] Document viewing/downloading

---

### Module 4.3: E-Signature Integration

**Duration**: 2 days

#### Backend Tasks

| Task                               | Priority | Est. Time |
| ---------------------------------- | -------- | --------- |
| Setup Yousign/PandaDoc API         | 🔴 High  | 2h        |
| Create signature request service   | 🔴 High  | 3h        |
| Handle signature webhooks          | 🔴 High  | 2h        |
| Update mission status on signature | 🔴 High  | 2h        |
| Store signed documents             | 🔴 High  | 1h        |

#### Frontend Tasks

| Task                           | Priority | Est. Time |
| ------------------------------ | -------- | --------- |
| Signature request UI           | 🔴 High  | 2h        |
| Signature status tracking      | 🔴 High  | 2h        |
| Redirect to signature provider | 🔴 High  | 1h        |

**Deliverables**:

- [ ] E-signature flow integration
- [ ] Automatic contract signing
- [ ] Status synchronization

---

## PHASE 5: Communication & Calendar (Week 9)

### Module 5.1: Notification System

**Duration**: 2 days

#### Backend Tasks

| Task                                   | Priority  | Est. Time |
| -------------------------------------- | --------- | --------- |
| Create notification service            | 🔴 High   | 2h        |
| Setup SendGrid/Resend for emails       | 🔴 High   | 2h        |
| Setup Twilio for SMS                   | 🔴 High   | 2h        |
| Create notification queue (Bull/Redis) | 🔴 High   | 2h        |
| Notification preferences management    | 🟡 Medium | 2h        |
| In-app notifications (WebSocket)       | 🟡 Medium | 3h        |

#### Frontend Tasks

| Task                              | Priority  | Est. Time |
| --------------------------------- | --------- | --------- |
| Notification bell/dropdown        | 🔴 High   | 2h        |
| Notification list page            | 🔴 High   | 2h        |
| Notification preferences settings | 🟡 Medium | 2h        |
| Real-time notification toasts     | 🟡 Medium | 2h        |

**Deliverables**:

- [ ] Email notifications
- [ ] SMS notifications
- [ ] In-app notifications

---

### Module 5.2: Email/SMS Templates

**Duration**: 2 days

#### Backend Tasks

| Task                                        | Priority | Est. Time |
| ------------------------------------------- | -------- | --------- |
| Welcome email template (Renford)            | 🔴 High  | 1h        |
| Welcome email template (Etablissement)      | 🔴 High  | 1h        |
| New mission notification template           | 🔴 High  | 1h        |
| Mission accepted template                   | 🔴 High  | 1h        |
| Contract ready template                     | 🔴 High  | 1h        |
| Payment received template                   | 🔴 High  | 1h        |
| Mission reminder templates (1 week, 2 days) | 🔴 High  | 1h        |
| Evaluation request template                 | 🔴 High  | 1h        |
| Quote reminder template                     | 🔴 High  | 1h        |
| Password reset template                     | 🔴 High  | 1h        |
| SMS templates for all notifications         | 🔴 High  | 2h        |

**Deliverables**:

- [ ] All email templates
- [ ] All SMS templates
- [ ] Template variables system

---

### Module 5.3: Calendar Integration

**Duration**: 2 days

#### Backend Tasks

| Task                                 | Priority  | Est. Time |
| ------------------------------------ | --------- | --------- |
| Setup Google Calendar API            | 🔴 High   | 2h        |
| Create calendar event service        | 🔴 High   | 2h        |
| Sync mission to calendar             | 🔴 High   | 2h        |
| Calendar reminders setup             | 🔴 High   | 2h        |
| Calendly integration for COACH visio | 🟡 Medium | 3h        |

#### Frontend Tasks

| Task                           | Priority | Est. Time |
| ------------------------------ | -------- | --------- |
| Calendar view component        | 🔴 High  | 3h        |
| Google Calendar connect button | 🔴 High  | 2h        |
| Mission calendar display       | 🔴 High  | 2h        |

**Deliverables**:

- [ ] Google Calendar sync
- [ ] Calendar view in dashboard
- [ ] Calendly integration for COACH

---

## PHASE 6: Admin & Polish (Week 10-11)

### Module 6.1: Admin Panel

**Duration**: 4 days

#### Backend Tasks

| Task                          | Priority  | Est. Time |
| ----------------------------- | --------- | --------- |
| Admin authentication & roles  | 🔴 High   | 2h        |
| User management endpoints     | 🔴 High   | 3h        |
| Profile verification endpoint | 🔴 High   | 2h        |
| Mission management endpoints  | 🔴 High   | 2h        |
| Payment/transaction endpoints | 🔴 High   | 2h        |
| Platform statistics endpoints | 🔴 High   | 3h        |
| Document template management  | 🟡 Medium | 2h        |
| Enum/constants management     | 🟡 Medium | 2h        |

#### Frontend Tasks

| Task                         | Priority  | Est. Time |
| ---------------------------- | --------- | --------- |
| Admin layout & navigation    | 🔴 High   | 2h        |
| User listing with filters    | 🔴 High   | 3h        |
| User detail & edit page      | 🔴 High   | 2h        |
| Profile verification UI      | 🔴 High   | 2h        |
| Mission listing & management | 🔴 High   | 3h        |
| Payment/transaction listing  | 🔴 High   | 2h        |
| Statistics dashboard         | 🔴 High   | 4h        |
| Platform settings page       | 🟡 Medium | 2h        |

**Deliverables**:

- [ ] Complete admin panel
- [ ] User management
- [ ] Profile verification
- [ ] Analytics dashboard

---

### Module 6.2: User Dashboards

**Duration**: 3 days

#### Frontend Tasks (Etablissement Dashboard)

| Task                        | Priority  | Est. Time |
| --------------------------- | --------- | --------- |
| Dashboard layout            | 🔴 High   | 2h        |
| Mission overview cards      | 🔴 High   | 2h        |
| Statistics widgets          | 🔴 High   | 3h        |
| Favorites section           | 🔴 High   | 2h        |
| Calendar widget             | 🔴 High   | 2h        |
| Alerts/notifications banner | 🔴 High   | 2h        |
| Quick actions section       | 🟡 Medium | 1h        |

#### Frontend Tasks (Renford Dashboard)

| Task                                          | Priority  | Est. Time |
| --------------------------------------------- | --------- | --------- |
| Dashboard layout                              | 🔴 High   | 2h        |
| Mission overview (active, pending, completed) | 🔴 High   | 2h        |
| Earnings widget                               | 🔴 High   | 2h        |
| Availability widget                           | 🔴 High   | 2h        |
| Statistics widgets                            | 🔴 High   | 2h        |
| Calendar widget                               | 🔴 High   | 2h        |
| Rating/reviews section                        | 🟡 Medium | 2h        |

**Deliverables**:

- [ ] Etablissement dashboard
- [ ] Renford dashboard
- [ ] Statistics & analytics

---

### Module 6.3: Evaluation System

**Duration**: 2 days

#### Backend Tasks

| Task                                 | Priority | Est. Time |
| ------------------------------------ | -------- | --------- |
| Create evaluation endpoints          | 🔴 High  | 2h        |
| Rating calculation service           | 🔴 High  | 2h        |
| Evaluation reminders (J+1, J+2, J+5) | 🔴 High  | 2h        |

#### Frontend Tasks

| Task                                      | Priority | Est. Time |
| ----------------------------------------- | -------- | --------- |
| Evaluation form (Etablissement → Renford) | 🔴 High  | 2h        |
| Evaluation form (Renford → Etablissement) | 🔴 High  | 2h        |
| Reviews display component                 | 🔴 High  | 2h        |
| Rating stars component                    | 🔴 High  | 1h        |

**Deliverables**:

- [ ] Complete evaluation system
- [ ] Rating display
- [ ] Automatic reminders

---

### Module 6.4: Testing & Bug Fixes

**Duration**: 3 days

| Task                                | Priority  | Est. Time |
| ----------------------------------- | --------- | --------- |
| Unit tests for critical services    | 🔴 High   | 4h        |
| Integration tests for API endpoints | 🔴 High   | 4h        |
| E2E tests for critical flows        | 🔴 High   | 4h        |
| Bug fixes from testing              | 🔴 High   | 8h        |
| Performance optimization            | 🟡 Medium | 4h        |
| Security audit                      | 🔴 High   | 4h        |

**Deliverables**:

- [ ] Test coverage > 70%
- [ ] Bug-free critical paths
- [ ] Performance optimized

---

## PHASE 7: Deployment & Launch (Week 12)

### Module 7.1: Production Setup

**Duration**: 2 days

| Task                                   | Priority  | Est. Time |
| -------------------------------------- | --------- | --------- |
| Setup production database              | 🔴 High   | 2h        |
| Setup production Redis                 | 🔴 High   | 1h        |
| Configure CI/CD pipeline               | 🔴 High   | 3h        |
| Setup monitoring (Sentry, LogRocket)   | 🔴 High   | 2h        |
| Setup analytics (GTM, Consent Manager) | 🟡 Medium | 2h        |
| SSL certificates                       | 🔴 High   | 1h        |
| Domain configuration                   | 🔴 High   | 1h        |
| Environment variables setup            | 🔴 High   | 1h        |

**Deliverables**:

- [ ] Production environment ready
- [ ] CI/CD pipeline working
- [ ] Monitoring in place

---

### Module 7.2: Data Migration

**Duration**: 2 days

| Task                              | Priority | Est. Time |
| --------------------------------- | -------- | --------- |
| Export data from MVP              | 🔴 High  | 2h        |
| Data transformation scripts       | 🔴 High  | 4h        |
| Data validation                   | 🔴 High  | 2h        |
| Import to production              | 🔴 High  | 2h        |
| User notification about migration | 🔴 High  | 2h        |

**Deliverables**:

- [ ] All existing data migrated
- [ ] Data integrity verified
- [ ] Users informed

---

### Module 7.3: Final QA & Launch

**Duration**: 2 days

| Task                                  | Priority | Est. Time |
| ------------------------------------- | -------- | --------- |
| Full end-to-end testing in production | 🔴 High  | 4h        |
| Payment flow testing (real)           | 🔴 High  | 2h        |
| Load testing                          | 🔴 High  | 2h        |
| Final bug fixes                       | 🔴 High  | 4h        |
| Launch preparation                    | 🔴 High  | 2h        |
| Go live!                              | 🔴 High  | 1h        |

**Deliverables**:

- [ ] Production-ready application
- [ ] All flows tested
- [ ] Successfully launched

---

## Summary: Time Estimates by Module

| Module                | Backend  | Frontend | Total    |
| --------------------- | -------- | -------- | -------- |
| Project Setup         | 8h       | 6h       | 14h      |
| Database Schema       | 16h      | -        | 16h      |
| Authentication        | 19h      | 14h      | 33h      |
| Renford Profile       | 12h      | 21h      | 33h      |
| Establishment Profile | 13h      | 15h      | 28h      |
| File Upload           | 8h       | 7h       | 15h      |
| Mission CRUD          | 20h      | 26h      | 46h      |
| Matching Algorithm    | 17h      | -        | 17h      |
| Mission Workflow      | 18h      | 19h      | 37h      |
| Stripe Integration    | 25h      | 15h      | 40h      |
| Document Generation   | 19h      | 5h       | 24h      |
| E-Signature           | 10h      | 5h       | 15h      |
| Notification System   | 13h      | 8h       | 21h      |
| Email/SMS Templates   | 12h      | -        | 12h      |
| Calendar Integration  | 11h      | 7h       | 18h      |
| Admin Panel           | 18h      | 20h      | 38h      |
| User Dashboards       | -        | 24h      | 24h      |
| Evaluation System     | 6h       | 7h       | 13h      |
| Testing               | 24h      | -        | 24h      |
| Deployment            | 13h      | -        | 13h      |
| Data Migration        | 12h      | -        | 12h      |
| Final QA              | 13h      | -        | 13h      |
| **TOTAL**             | **307h** | **199h** | **506h** |

---

## Estimated Timeline

| Phase                             | Duration | Cumulative |
| --------------------------------- | -------- | ---------- |
| Phase 1: Foundation               | 2 weeks  | Week 2     |
| Phase 2: Core User Features       | 2 weeks  | Week 4     |
| Phase 3: Mission System           | 2 weeks  | Week 6     |
| Phase 4: Payments & Documents     | 2 weeks  | Week 8     |
| Phase 5: Communication & Calendar | 1 week   | Week 9     |
| Phase 6: Admin & Polish           | 2 weeks  | Week 11    |
| Phase 7: Deployment & Launch      | 1 week   | Week 12    |

**Total: ~12 weeks (506 hours)**

> **Note**: With AI assistance and existing UI design, some tasks can be accelerated. Buffer time is included for unexpected issues. Parallel work on some modules is possible to reduce timeline if needed.

---

## Risk Mitigation

| Risk                        | Mitigation                                  |
| --------------------------- | ------------------------------------------- |
| Stripe Connect complexity   | Start early, allow extra time               |
| E-signature API issues      | Have backup provider ready                  |
| Data migration problems     | Test migration multiple times before launch |
| Performance issues          | Implement caching early, monitor from start |
| Third-party API rate limits | Implement proper queuing                    |

---

## Post-Launch Priorities (V1.1)

1. Messaging system between users
2. Mobile app (React Native)
3. Advanced analytics dashboard
4. URSSAF direct integration
5. Expense notes management
6. International expansion features
