# Features & Solutions Specification
**Product:** SVCA Computer Training Academy & CSC Centre Comprehensive Business Management Platform  
**Short Name:** SVCA  
**Visual Identity:** Institutional Navy & Blue (`#0B2B5B`, `#08234A`, `#0754BD`, `#F58220`, `#F4F6F9`)  
**Creator:** Softrenix Technologies (https://www.softrenix.com)  

---

## Design System & Visual Architecture
- **Palette:** Institutional Navy (`#0B2B5B`), Deep Navy (`#08234A`), Primary Blue (`#0754BD`), Interactive Blue (`#1264D1`), Accent Orange (`#F58220`), Canvas (`#F4F6F9`), Surface White (`#FFFFFF`), Border Slate (`#E2E8F0`).
- **Typography:** Manrope for headings and display, Inter for UI data, inputs, and tabular numbers.
- **Micro-interactions:** Subtle Framer Motion transitions without bouncy gimmicks.
- **Stationary Navigation:** Fixed sidebar with collapsible navigation categories, role-based access filtering, and independent scrollable viewport.
- **Global Command Palette (`Ctrl + K`):** Quick jump to any student, batch, transaction, or module.

---

## 1. Role-Based Workspaces & Perspectives

The platform features an instant role switcher in the top bar to showcase customized perspectives:
1. **Owner / Administrator Workspace:** Unrestricted access across academic, administrative, and financial modules, high-level executive KPIs, net operating surplus, and audit logs.
2. **Receptionist Workspace:** Focused on visitor reception, admission enquiries, student registrations, ID card printing, and basic fee collection.
3. **Instructor Workspace:** Streamlined academic view featuring assigned batches, daily attendance registers, and examination marks entry.
4. **Accountant Workspace:** Dedicated financial view covering student fee ledgers, CSC counter billing, expense vouchers, cashbook drawer reconciliation, and Excel/PDF reporting.

---

## 2. Academic Management Solutions

### Solution 1: Public Business Website (`/website`)
- **Top Brand Utility Bar:** Direct telephone contact, location, and quick portal launch.
- **Sticky Navigation Bar:** Academy branding, anchor links, and mobile-responsive drawer.
- **Editorial Hero Section:** Three-slide automated carousel with verified academy messaging and dynamic CMS integration.
- **Interactive Course Catalog:** Filterable categories (Basic & Office, Accounting, Design & DTP, Programming, Diploma) with duration, fee schedule, and highlights.
- **CSC Digital Helpdesk:** Clear presentation of citizen document assistance, online form filing, utility bills, and printing support.
- **Interactive Photo Gallery:** Filterable grid with full-screen image lightbox modal.
- **Admission Enquiry Lead Engine:** Interactive form with sample filler button, Zod validation, and instant management portal notification.
- **Verified Business Information Desk:** Address, operating hours, phone info, and Google Maps direction links.

### Solution 2: Student Management System (`/portal/students`)
- **Searchable Student Directory:** Instant multi-parameter filtering by student name, ID, mobile, course, and status (62+ realistic Bengali student records).
- **Student Registration:** Complete registration modal collecting guardian name, DOB, address, course, batch, notes, and initial fee payment.
- **Comprehensive Student Profile (`/portal/students/:id`):** 360-degree view combining personal details, attendance percentage, fee balance, installment schedule, and printable receipts.

### Solution 3: Courses & Batches Management (`/portal/courses`)
- **Curriculum Catalog:** Overview of 6 courses with syllabus summaries and fee schedules.
- **Classroom Batches:** Real-time capacity utilization progress bars, assigned faculty, and days/timings.
- **Interactive Weekly Timetable:** Visual weekly schedule grid organized by time slot.

### Solution 4: Daily Batch Attendance (`/portal/attendance`)
- **Batch-Wise Daily Sheet:** Date picker, batch selector, and enrolled student roster.
- **One-Click Marking:** Single-tap **Mark All Present** action alongside individual status toggles (*Present*, *Absent*, *Late*, *Leave*).
- **Instant Attendance Statistics:** Real-time percentage tracking and dashboard sync.

### Solution 5: Examinations & Marksheets (`/portal/examinations`)
- **Exam Scheduling:** Record upcoming/completed exams with max marks and passing marks.
- **Batch Marks Entry Sheet:** Tabular marks entry with automated percentage and grade calculation (A+, A, B, C, D, E).
- **Professional Marksheet PDF Generation:** Client-side jsPDF AutoTable marksheet download with student roll number, subject marks, grade, and verification stamp.

### Solution 6: Student ID Card Studio (`/portal/id-cards`)
- **CR80 PVC Format Specification:** Dual-sided ID card preview (Front & Back).
- **Embedded Security Features:** Student photo avatar, blood group, emergency contact, barcode simulation, and scannable QR verification code.
- **PDF Export:** Ready-to-print CR80 layout with sample watermark.

### Solution 7: Course Completion Certificates (`/portal/certificates`)
- **A4 Landscape Layout:** Institutional navy and gold certificate border design.
- **Customizable Details:** Student name, course title, completion date, grade/division, and certificate serial number (`SVCA-CERT-*`).
- **QR Code Verification:** Embedded QR code pointing to online verification URL.
- **Downloadable High-Res PDF:** Printable vector PDF generated directly in the browser.

---

## 3. Financial & Commercial Solutions

### Solution 8: Student Fee Ledger & Receipts (`/portal/billing`)
- **Financial Health Overview:** Total course fees assigned, total collections received, and outstanding balance summary.
- **Student Fee Directory:** Real-time balance inspection, next due dates, and fee status badges (*Fully Paid*, *Partially Paid*, *Unpaid*, *Overdue*).
- **Installment Scheduler:** Automatic 3-stage installment breakdown that updates chronologically upon payment recording.
- **Simulated Payment Gateway:** Supports *Cash*, *UPI*, and *Bank Transfer* simulated receipts.
- **Client-Side jsPDF Engine:** Generates downloadable, printable A5 fee receipts in Institutional Navy styling with official demonstration watermarks.

### Solution 9: CSC Citizen Service POS Billing (`/portal/csc-billing`)
- **2-Panel Point of Sale (POS) Counter:** Service catalog grouped by category (PAN, Aadhaar, Caste, Utility, Banking, DTP/Print) on the left; active transaction cart with quantity controls on the right.
- **Rapid Customer Checkout:** Citizen name, mobile number, and payment method selector.
- **Instant A5 Receipt Generation:** Thermal-style printable PDF receipt for citizen transactions with GST exemption demonstration notes.
- **Transaction History & Audit:** Complete log of completed transactions with void capability.

### Solution 10: Expense Management (`/portal/expenses`)
- **Operational Expense Logging:** Record rent, electricity, instructor honorariums, lab supplies, software, and marketing expenses.
- **Division Categorization:** Tag expenses as *Academy*, *CSC Centre*, or *Shared Institutional*.
- **Expense Summaries:** Monthly burn rate and category breakdown.

### Solution 11: Daily Cashbook & Drawer Reconciliation (`/portal/cashbook`)
- **Physical Cash Drawer Tracking:** Opening physical cash balance, recorded cash inflows (Fees + CSC), recorded cash outflows (Expenses + Adjustments), and expected drawer balance.
- **Digital Collections Isolation:** Segregates UPI and Bank Transfer collections from physical drawer cash.
- **Cash Discrepancy Reconciliation:** Enter actual closing cash count to detect surplus or shortage with manual adjustment vouchers.
- **Daily Drawer Closing:** Formal closing log saving reconciled cash summaries with downloadable daily closing PDF reports.

### Solution 12: Reports & Analytics Hub (`/portal/reports`)
- **Multi-Category Reports:** Fee collections, outstanding aging, CSC service revenue, expense registers, student attendance, and batch enrollment.
- **Interactive Data Preview:** Live searchable data tables with date range filters.
- **Multi-Format Export Engine:**
  - **Excel Spreadsheet (`.xlsx`):** Formatted multi-column workbook via SheetJS.
  - **Comma-Separated Values (`.csv`):** Universal data export for accounting tools.
  - **Formatted PDF Report:** AutoTable formatted PDF report with institutional headers.

---

## 4. Administrative & Engagement Solutions

### Solution 13: Staff & Faculty Directory (`/portal/staff`)
- **Faculty Directory:** Profiles of instructors, lab assistants, and administrative staff.
- **Batch Assignment:** View active batch responsibilities per teacher.
- **Role Permissions:** Perspective indicators and contact information.

### Solution 14: WhatsApp Outstanding Due Reminders (`/portal/reminders`)
- **Due Student Directory:** Filter students with overdue installments.
- **Smart Template Selection:** Gentle reminder, urgent final notice, or exam fee alert.
- **Dynamic Placeholder Replacement:** Automatically injects student name, course, amount due, and due date.
- **1-Click Actions:** Copy formatted WhatsApp message directly to clipboard and log the reminder event into the audit trail.

### Solution 15: In-Portal Website CMS Manager (`/portal/website-manager`)
- **Live Banner Announcement Bar:** Toggle on/off admission alerts or holiday notices with custom text and CTA links.
- **Hero Section Copy Editor:** Update headline, sub-headline, and description without touching code.
- **Interactive Live Preview Card:** Immediate visual confirmation of website copy before saving.
- **Real-Time Store Synchronization:** Instantly updates the live public website (`/website`) across the shared frontend state.

### Solution 16: Activity History & Audit Trail (`/portal/activity`)
- **Chronological Audit Timeline:** Searchable and filterable history of every action performed in the system (payments, registrations, CSC sales, expenses, cash closures).
- **Module & User Filters:** Filter by module or staff member for accountability.
