import { describe, it, expect, beforeEach } from "vitest";
import { useAcademyStore } from "../src/store/useAcademyStore";
import { computeDashboardMetrics } from "../src/store/selectors";

describe("SVCA Store & Workflows", () => {
  beforeEach(() => {
    useAcademyStore.getState().resetDemo();
  });

  it("should initialize with courses, batches, and sample students", () => {
    const state = useAcademyStore.getState();
    expect(state.courses.length).toBeGreaterThanOrEqual(4);
    expect(state.batches.length).toBeGreaterThanOrEqual(3);
    expect(state.students.length).toBeGreaterThanOrEqual(20);
    expect(state.feeAccounts.length).toBe(state.students.length);
  });

  it("Workflow 1: Website Enquiry submission adds record and updates metrics", () => {
    const state = useAcademyStore.getState();
    const initialEnquiriesCount = state.enquiries.length;
    const initialMetrics = computeDashboardMetrics(state);

    const enq = state.submitEnquiry({
      applicantName: "Pritam Mondal (Test)",
      phone: "9876543210",
      email: "pritam@example.com",
      interestedCourseId: state.courses[0].id,
      preferredBatch: "Morning (08:00 AM – 09:30 AM)",
      message: "Testing enquiry flow",
    });

    const updatedState = useAcademyStore.getState();
    expect(updatedState.enquiries.length).toBe(initialEnquiriesCount + 1);
    expect(enq.id).toMatch(/^ENQ-\d{4}-\d{4}$/);

    const updatedMetrics = computeDashboardMetrics(updatedState);
    expect(updatedMetrics.pendingEnquiriesCount).toBe(initialMetrics.pendingEnquiriesCount + 1);
  });

  it("Workflow 2: Student Registration creates student, fee account, and updates directory", () => {
    const state = useAcademyStore.getState();
    const initialStudentsCount = state.students.length;
    const course = state.courses[0];
    const batch = state.batches[0];

    const { student, receipt } = state.registerStudent({
      fullName: "Anirban Sen (Test)",
      phone: "9832112233",
      email: "anirban@example.com",
      guardianName: "B. Sen",
      dateOfBirth: "2003-04-10",
      address: "Station Road (Test)",
      courseId: course.id,
      batchId: batch.id,
      admissionDate: "2026-11-25",
      totalFee: course.fee,
      initialPayment: 1000,
      paymentMethod: "Cash",
      status: "Active",
    });

    const updatedState = useAcademyStore.getState();
    expect(updatedState.students.length).toBe(initialStudentsCount + 1);
    expect(student.id).toMatch(/^STU-\d{4}-\d{4}$/);
    expect(receipt).toBeDefined();
    expect(receipt?.amountReceived).toBe(1000);

    const feeAccount = updatedState.feeAccounts.find((fa) => fa.studentId === student.id);
    expect(feeAccount).toBeDefined();
    expect(feeAccount?.totalPaid).toBe(1000);
    expect(feeAccount?.outstandingBalance).toBe(course.fee - 1000);
  });

  it("Workflow 3: Batch Attendance saving updates records and reflects on summary", () => {
    const state = useAcademyStore.getState();
    const batch = state.batches[0];
    const course = state.courses[0];
    const batchStudents = state.students.filter((s) => s.batchId === batch.id);

    expect(batchStudents.length).toBeGreaterThan(0);

    const testDate = "2026-11-25";
    const entries = batchStudents.map((st, i) => ({
      studentId: st.id,
      status: (i === 0 ? "Absent" : "Present") as "Absent" | "Present",
    }));

    state.saveBatchAttendance(testDate, batch.id, course.id, entries);

    const updatedState = useAcademyStore.getState();
    const records = updatedState.attendance.filter(
      (a) => a.date === testDate && a.batchId === batch.id
    );
    expect(records.length).toBe(batchStudents.length);
    expect(records.find((r) => r.studentId === batchStudents[0].id)?.status).toBe("Absent");
  });

  it("Workflow 4: Fee Collection decreases outstanding balance accurately", () => {
    const state = useAcademyStore.getState();
    const studentWithDue = state.feeAccounts.find((fa) => fa.outstandingBalance > 500);
    expect(studentWithDue).toBeDefined();

    if (!studentWithDue) return;

    const initialDue = studentWithDue.outstandingBalance;
    const payAmount = 500;

    const { payment, receipt } = state.recordPayment({
      studentId: studentWithDue.studentId,
      amount: payAmount,
      method: "UPI",
      paymentDate: "2026-11-25",
      reference: "UPI-TEST-12345",
      notes: "Unit test fee collection",
    });

    expect(payment.amount).toBe(payAmount);
    expect(receipt.remainingBalance).toBe(initialDue - payAmount);

    const updatedState = useAcademyStore.getState();
    const updatedAccount = updatedState.feeAccounts.find((fa) => fa.id === studentWithDue.id);
    expect(updatedAccount?.outstandingBalance).toBe(initialDue - payAmount);
  });

  it("Workflow 6: Enquiry Conversion registers student without duplication", () => {
    const state = useAcademyStore.getState();
    const newEnq = state.submitEnquiry({
      applicantName: "Swarnali Paul",
      phone: "9832199887",
      interestedCourseId: state.courses[0].id,
      preferredBatch: "Morning",
    });

    const { student } = state.registerStudent(
      {
        fullName: newEnq.applicantName,
        phone: newEnq.phone,
        guardianName: "P. Paul",
        dateOfBirth: "2004-02-12",
        address: "College More",
        courseId: newEnq.interestedCourseId,
        batchId: state.batches[0].id,
        admissionDate: "2026-11-25",
        totalFee: 4500,
        initialPayment: 0,
        paymentMethod: "Cash",
        status: "Active",
      },
      newEnq.id
    );

    const updatedState = useAcademyStore.getState();
    const convEnq = updatedState.enquiries.find((e) => e.id === newEnq.id);
    expect(convEnq?.status).toBe("Converted");
    expect(convEnq?.convertedStudentId).toBe(student.id);

    // Attempting to convert again should throw
    expect(() =>
      state.registerStudent(
        {
          fullName: newEnq.applicantName,
          phone: newEnq.phone,
          guardianName: "P. Paul",
          dateOfBirth: "2004-02-12",
          address: "College More",
          courseId: newEnq.interestedCourseId,
          batchId: state.batches[0].id,
          admissionDate: "2026-11-25",
          totalFee: 4500,
          initialPayment: 0,
          paymentMethod: "Cash",
          status: "Active",
        },
        newEnq.id
      )
    ).toThrow();
  });

  it("Workflow 7: CSC POS Billing creates completed transaction with receipt", () => {
    const state = useAcademyStore.getState();
    const service1 = state.cscServices[0];
    const initialTxCount = state.cscTransactions.length;

    const tx = state.recordCSCTransaction({
      customerName: "Somenath Das (Test)",
      customerPhone: "9830099999",
      items: [
        {
          serviceId: service1.id,
          serviceName: service1.name,
          category: service1.category,
          unitPrice: service1.unitPrice,
          quantity: 4,
          total: service1.unitPrice * 4,
        },
      ],
      discount: 0,
      paymentMethod: "Cash",
    });

    const updated = useAcademyStore.getState();
    expect(updated.cscTransactions.length).toBe(initialTxCount + 1);
    expect(tx.receiptNumber).toMatch(/^CSC-POS-/);
    expect(tx.totalAmount).toBe(service1.unitPrice * 4);
    expect(tx.status).toBe("Completed");
  });

  it("Workflow 8: Expense recording updates expenses ledger and cashbook calculations", () => {
    const state = useAcademyStore.getState();
    const initialCount = state.expenses.length;

    const exp = state.recordExpense({
      title: "Paper and Thermal Rolls (Test)",
      category: "Printing Materials",
      amount: 1400,
      expenseDate: "2026-11-25",
      paymentMethod: "Cash",
      vendorPayee: "Local Stationer",
      division: "CSC Centre",
      recordedBy: "Accounts Officer",
    });

    const updated = useAcademyStore.getState();
    expect(updated.expenses.length).toBe(initialCount + 1);
    expect(exp.id).toMatch(/^EXP-/);
    expect(exp.amount).toBe(1400);
  });

  it("Workflow 9: Examination scheduling and marks publishing", () => {
    const state = useAcademyStore.getState();
    const course = state.courses[0];
    const batch = state.batches[0];

    const exam = state.createExam({
      name: "DCA Test Assessment",
      courseId: course.id,
      batchId: batch.id,
      subject: "MS Excel Functions",
      examDate: "2026-11-25",
      maxMarks: 50,
      passingMarks: 20,
      examType: "Practical",
      instructorId: "STF-001",
      status: "Scheduled",
    });

    expect(exam.id).toBeDefined();

    const batchStudents = state.students.filter((s) => s.batchId === batch.id);
    state.saveExamResults(exam.id, [
      { studentId: batchStudents[0].id, marksObtained: 42, isAbsent: false, remarks: "Top marks" },
    ]);

    const updated = useAcademyStore.getState();
    const result = updated.examResults.find((r) => r.examId === exam.id);
    expect(result).toBeDefined();
    expect(result?.passed).toBe(true);
    expect(result?.grade).toBe("A");
  });

  it("Workflow 10: ID Card and Certificate Generation", () => {
    const state = useAcademyStore.getState();
    const student = state.students[0];

    const card = state.issueIdCard(student.id);
    expect(card.cardNumber).toMatch(/^SVCA-ID-/);
    expect(card.studentId).toBe(student.id);

    const cert = state.issueCertificate(student.id, "A+");
    expect(cert.certificateNumber).toMatch(/^SVCA-CERT-/);
    expect(cert.grade).toBe("A+");
  });

  it("Workflow 11: Website Content CMS updating and restoration", () => {
    const state = useAcademyStore.getState();
    const testHeadline = "Leading Computer Training in West Bengal (Test)";

    state.updateWebsiteContent({
      heroHeadline: testHeadline,
      announcement: "Test Alert Banner",
    });

    let updated = useAcademyStore.getState();
    expect(updated.websiteContent.heroHeadline).toBe(testHeadline);
    expect(updated.websiteContent.isCustomized).toBe(true);

    state.restoreWebsiteContent();
    updated = useAcademyStore.getState();
    expect(updated.websiteContent.isCustomized).toBe(false);
  });

  it("Workflow 12: Role Switching updates active state correctly", () => {
    const state = useAcademyStore.getState();
    state.setActiveRole("instructor");
    expect(useAcademyStore.getState().settings.activeRole).toBe("instructor");

    state.setActiveRole("accountant");
    expect(useAcademyStore.getState().settings.activeRole).toBe("accountant");

    state.setActiveRole("owner");
    expect(useAcademyStore.getState().settings.activeRole).toBe("owner");
  });
});
