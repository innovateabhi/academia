# SVCA Computer Training Academy & CSC Centre — Comprehensive Management Platform
**Advanced Interactive Business Demonstration Developed by Softrenix Technologies**  
Website: [https://www.softrenix.com](https://www.softrenix.com) | Tagline: *Engineering Beyond Boundaries*

---

## Executive Summary
This project is an enterprise-grade, interactive sales demonstration tailored specifically for **SVCA Computer Training Academy & CSC Centre** (West Bengal, India), verified from their public Google Business profile.

Developed by **Softrenix Technologies**, the system demonstrates the capabilities of a professionally commissioned custom business management solution (valued at ₹90,000–₹1,00,000), implemented as a **100% frontend-only static SPA** running with zero backend or external database requirements.

---

## 4 Interconnected Role Perspectives
The platform provides a top-bar **Role Perspective Switcher** with tailored workflows:
1. **Owner / Administrator Workspace:** Complete visibility over revenue metrics, net operating surplus, multi-division reports, staff directories, and audit trails.
2. **Receptionist Workspace:** Front-desk lead capture, enquiry conversion, student admissions, ID card issuance, and fee collection.
3. **Instructor Workspace:** Academic roster, daily batch attendance marking, exam marks entry, and student marksheets.
4. **Accountant Workspace:** Student fee ledgers, CSC counter POS billing, expense management, daily cashbook drawer closing, and Excel export.

---

## Primary Solutions & Modules

### Academic Solutions
- **Public Business Website (`/website`):** Hero carousel, course catalog, CSC service directory, interactive photo gallery, Google Maps location, and admission enquiry form.
- **Students 360° Directory (`/portal/students`):** 62+ realistic Bengali student profiles with filterable directory, admission modal, and comprehensive student dossiers (`/portal/students/:id`).
- **Courses & Batches Management (`/portal/courses`):** 6 academic courses, capacity bars, instructor allocations, and weekly schedule timetable.
- **Daily Batch Attendance (`/portal/attendance`):** 5-second batch attendance register with "Mark All Present" and live rate calculation.
- **Examinations & Marksheets (`/portal/examinations`):** Exam scheduling, batch marks entry, auto grade computation (A+ to E), and downloadable PDF student marksheets.
- **Student ID Card Studio (`/portal/id-cards`):** Dual-sided CR80 PVC card preview (Front & Back), QR code verification, and PDF export.
- **Course Completion Certificates (`/portal/certificates`):** A4 Landscape certificate with institutional gold/navy border, QR code, and print-ready PDF download.
- **Admission Enquiry Lead Engine (`/portal/enquiries`):** Website lead synchronization and 1-click student conversion.

### Financial Solutions
- **Student Fee Tracking & Ledger (`/portal/billing`):** Outstanding balances, 3-stage installment schedules, cash/UPI receipt issuance, and downloadable A5 PDF receipts.
- **CSC Citizen Service POS Billing (`/portal/csc-billing`):** 2-panel POS counter for citizen services (PAN, Aadhaar, Caste, Utility, Banking, DTP), instant receipt generation, and transaction voiding.
- **Expense Management (`/portal/expenses`):** Operating expense recording with Academy, CSC, or Shared institutional division tagging.
- **Daily Cashbook & Drawer Closing (`/portal/cashbook`):** Physical drawer cash reconciliation, separation of digital UPI/Bank collections, discrepancy analysis, and closing summary PDF.
- **Reports & Analytics Hub (`/portal/reports`):** Interactive report preview with multi-format export to Excel (`.xlsx` via SheetJS), CSV, and PDF.

### Administrative & Communication Solutions
- **Staff Directory (`/portal/staff`):** Faculty profiles, role indicators, and batch allocations.
- **WhatsApp Outstanding Due Reminders (`/portal/reminders`):** Dynamic template-based WhatsApp reminder generator with 1-click clipboard copy and logging.
- **In-Portal Website CMS Manager (`/portal/website-manager`):** Live announcement banner toggling, hero headline, description, and about text editor with instant website sync.
- **Activity History Audit Trail (`/portal/activity`):** Chronological activity log of all business events with module and user filtering.
- **System Settings & Perspectives (`/portal/settings`):** Business profile, receipt numbering, role perspective switcher, and 1-click demonstration reset.

---

## Quick Start & Local Development

### Requirements
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Run
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## Demonstration Safety Notice
This software is an interactive frontend demonstration built for prospective client presentations by Softrenix Technologies. All student records, phone numbers, and financial transactions are simulated demonstration data. Generated payment receipts, certificates, ID cards, and reports include clear demonstration watermarks.
