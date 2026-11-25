# Test & Quality Assurance Report
**Application:** SVCA Computer Training Academy & CSC Centre — Interactive Demo
**Evaluation Date:** 25 November 2026
**Test Runner:** Vitest v2.1.9 & JSDOM Browser Simulation

---

## 1. Automated Test Summary
All 6 primary end-to-end user workflows and state transformations were executed with automated Vitest test suites:

```text
✓ tests/workflows.test.ts (6 tests)
  ✓ Workflow 1: Website Enquiry submission adds record and updates metrics
  ✓ Workflow 2: Student Registration creates student, fee account, and updates directory
  ✓ Workflow 3: Batch Attendance saving updates records and reflects on summary
  ✓ Workflow 4: Fee Collection decreases outstanding balance accurately
  ✓ Workflow 6: Enquiry Conversion registers student without duplication
  ✓ Initial Seed Data integrity verification

Test Files:  1 passed (1)
Tests:       6 passed (6)
Duration:    0.35s
```

---

## 2. Manual Verification Checklist Across Key Workflows

### Workflow 1: Website Enquiry Flow
- **Procedure:** Submit sample enquiry from `/website#admission`.
- **Result:** Pass. Generates sequential `ENQ-2026-XXXX` identifier, triggers toast notification, stores in Zustand persistence layer, and immediately increments the **Pending Enquiries** metric on the Dashboard.

### Workflow 2: Student Registration Flow
- **Procedure:** Click **Register New Student** in `/portal/students` and submit form.
- **Result:** Pass. Allocates unique `STU-2026-XXXX` ID, creates associated Fee Account, initializes 3-part installment schedule, assigns student to designated batch, and records initial payment receipt if selected.

### Workflow 3: Batch Attendance Flow
- **Procedure:** Select batch in `/portal/attendance`, toggle statuses or click **Mark All Present**, then click **Save Attendance**.
- **Result:** Pass. Attendance records are deduplicated per student/batch/date and immediately reflect on the Dashboard's **Today's Attendance** KPI card and breakdown summary.

### Workflow 4: Partial Fee Collection
- **Procedure:** Open `/portal/billing` or student profile, record a partial payment of ₹1,500.
- **Result:** Pass. Total paid increases by ₹1,500, outstanding balance decreases, installments are credited chronologically, and duplicate double-click submissions are blocked.

### Workflow 5: jsPDF Receipt Generation
- **Procedure:** Click **Download PDF** on any receipt in `/portal/billing` or student profile.
- **Result:** Pass. Generates an A5 formatted PDF with academy logo, address, student ID, course details, payment breakdown, and **"DEMO — NOT A VALID PAYMENT RECEIPT"** watermark.

### Workflow 6: Enquiry to Admission Conversion
- **Procedure:** Open `/portal/enquiries` and click **Convert to Student**.
- **Result:** Pass. Prefills student details into registration flow, assigns batch, updates enquiry status to *Converted*, and links the student ID to avoid duplicate conversions.

### Workflow 7: Data Persistence & Demo Reset
- **Procedure:** Perform edits, refresh browser, and click **Reset Demo Data**.
- **Result:** Pass. LocalStorage persists all actions seamlessly; clicking reset restores the pristine demonstration dataset with sample Bengali student names.

### Workflow 8: Mobile Responsiveness Verification
- **Screen Viewports Tested:** 360px, 375px, 390px, 430px, 768px, 1024px, 1440px.
- **Result:** Pass. No horizontal overflow, touch-friendly buttons, accessible mobile drawer navigation, responsive table containers, and mobile-optimized KPI cards.
