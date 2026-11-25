# Production Transition Roadmap
**Transitioning from Sales Demonstration to Production SaaS**
**Architected by:** Softrenix Technologies (https://www.softrenix.com)

---

## 1. Architecture Overview
This demonstration is designed with a **clean modular asynchronous mock-service layer** (`src/services/mockApiService.ts`) and a normalized state store (`src/store/useAcademyStore.ts`). When moving from the sales demonstration prototype to an authorized production system, the frontend UI components require **minimal code changes**—only the mock adapter calls are replaced with production REST or GraphQL clients.

---

## 2. Milestone 1: Production Authentication & Role-Based Access Control (RBAC)
- **Identity Provider:** Auth0, Clerk, or self-hosted JWT authentication.
- **Roles:**
  - `SUPER_ADMIN`: Full access to fee accounts, staff management, and system settings.
  - `INSTRUCTOR`: Daily batch attendance marking, student attendance histories, and syllabus progress.
  - `RECEPTIONIST`: New admission enquiries, student registration, and fee collection entry.
  - `STUDENT_PARENT_PORTAL`: Read-only view of attendance percentage and fee receipts.

---

## 3. Milestone 2: Backend Database & REST API
- **Backend Stack Options:**
  - Option A (Go / Node.js): Express or NestJS with Prisma ORM.
  - Option B (PostgreSQL): Direct transactional database with ACID guarantees for financial ledger tables.
- **Data Models:**
  - `organizations` (multi-tenant support for multiple branches)
  - `students`
  - `courses` & `batches`
  - `attendance_records` (composite index on `[student_id, date, batch_id]`)
  - `fee_accounts`, `installments`, and `payments` (double-entry audit trail)
  - `enquiries`

---

## 4. Milestone 3: Real Payment Gateway & WhatsApp Notifications
- **Payment Gateways:** Razorpay / Cashfree webhook integration for auto-reconciling online UPI payments.
- **WhatsApp Cloud API Integration:**
  - Automated WhatsApp message sent to guardian when attendance is marked *Absent*.
  - Instant PDF fee receipt link delivered to parent's WhatsApp upon payment recording.
  - Admission enquiry follow-up notifications.

---

## 5. Milestone 4: Production Security & Compliance
- HTTPS with HSTS headers.
- Cloudflare DDoS protection and WAF rate-limiting on admission enquiry endpoints.
- Nightly automated PostgreSQL backups to encrypted Amazon S3 / Google Cloud Storage.
- Daily CSV exports of student and fee ledger records for local offline archiving.
