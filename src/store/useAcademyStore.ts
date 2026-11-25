import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { format } from "date-fns";
import { createSeedData, type AcademyDataset } from "@/data/seedData";
import type {
  ActivityLog,
  AppSettings,
  AttendanceRecord,
  AttendanceStatus,
  Batch,
  CashAdjustment,
  Certificate,
  Course,
  CSCService,
  CSCTransaction,
  CSCTransactionItem,
  DailyClosing,
  DemoRole,
  Enquiry,
  EnquiryStatus,
  Enrollment,
  Exam,
  ExamResult,
  Expense,
  FeeAccount,
  Installment,
  Payment,
  PaymentMethod,
  Receipt,
  ReminderRecord,
  StaffMember,
  Student,
  StudentIdCard,
  WebsiteContent,
} from "@/types";
import {
  buildInstallmentSchedule,
  recalculateFeeState,
} from "@/utils/feeCalculations";
import { todayISO } from "@/utils/formatters";
import {
  generateEnquiryId,
  generateEntityId,
  generateReceiptNumber,
  generateStudentId,
} from "@/utils/idGenerator";
import type {
  BatchFormValues,
  CollectPaymentValues,
  CourseFormValues,
  EnquiryFormValues,
  StudentEditValues,
  StudentRegistrationValues,
} from "@/schemas/forms";

export const STORE_STORAGE_KEY = "svca-business-demo-store-v2";
export const STORE_VERSION = 2;

const memoryFallback = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(name);
      }
    } catch {
      // Fallback
    }
    return memoryFallback.get(name) ?? null;
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(name, value);
        return;
      }
    } catch {
      // Fallback
    }
    memoryFallback.set(name, value);
  },
  removeItem: (name) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(name);
      }
    } catch {
      // Ignore
    }
    memoryFallback.delete(name);
  },
};

export interface AcademyStoreState extends AcademyDataset {
  lastPaymentSignature: string | null;
  lastPaymentTimestamp: number;

  // Enquiries & Admissions
  submitEnquiry: (values: EnquiryFormValues) => Enquiry;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, notes?: string) => void;
  registerStudent: (
    values: StudentRegistrationValues,
    fromEnquiryId?: string
  ) => { student: Student; receipt?: Receipt };
  updateStudent: (studentId: string, values: StudentEditValues) => void;

  // Academics
  addCourse: (values: CourseFormValues) => Course;
  updateCourse: (id: string, values: Partial<Course>) => void;
  addBatch: (values: BatchFormValues) => Batch;
  updateBatch: (id: string, values: Partial<Batch>) => void;
  saveBatchAttendance: (
    date: string,
    batchId: string,
    courseId: string,
    entries: Array<{ studentId: string; status: AttendanceStatus }>
  ) => void;

  // Student Billing
  recordPayment: (values: CollectPaymentValues) => { payment: Payment; receipt: Receipt };
  voidPayment: (paymentId: string, reason: string) => void;

  // CSC POS Billing
  addCSCService: (service: Omit<CSCService, "id">) => CSCService;
  updateCSCService: (id: string, service: Partial<CSCService>) => void;
  recordCSCTransaction: (data: {
    customerName?: string;
    customerPhone?: string;
    items: CSCTransactionItem[];
    discount: number;
    paymentMethod: PaymentMethod;
  }) => CSCTransaction;
  voidCSCTransaction: (transactionId: string, reason: string) => void;

  // Expenses
  recordExpense: (data: Omit<Expense, "id" | "createdAt" | "status">) => Expense;
  voidExpense: (expenseId: string, reason: string) => void;

  // Cashbook & Adjustments
  addCashAdjustment: (data: Omit<CashAdjustment, "id" | "createdAt">) => CashAdjustment;
  saveDailyClosing: (data: Omit<DailyClosing, "id" | "closedAt">) => DailyClosing;

  // Examinations
  createExam: (data: Omit<Exam, "id">) => Exam;
  saveExamResults: (
    examId: string,
    results: Array<{ studentId: string; marksObtained: number; isAbsent: boolean; remarks?: string }>
  ) => void;

  // ID Cards & Certificates
  issueIdCard: (studentId: string) => StudentIdCard;
  issueCertificate: (studentId: string, grade?: string) => Certificate;

  // Reminders
  recordReminder: (studentId: string, templateType: string, messageText: string, phone: string) => ReminderRecord;

  // Staff & Roles
  addStaffMember: (data: Omit<StaffMember, "id">) => StaffMember;
  updateStaffMember: (id: string, data: Partial<StaffMember>) => void;
  setActiveRole: (role: DemoRole) => void;

  // Website Content Management
  updateWebsiteContent: (content: Partial<WebsiteContent>) => void;
  restoreWebsiteContent: () => void;

  // Activity & Settings
  logActivity: (action: string, module: string, description: string, relatedEntityId?: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetDemo: () => void;
}

function isValidDataset(state: Partial<AcademyStoreState> | undefined): boolean {
  if (!state) return false;
  return (
    Array.isArray(state.courses) &&
    state.courses.length > 0 &&
    Array.isArray(state.batches) &&
    Array.isArray(state.students) &&
    Array.isArray(state.feeAccounts) &&
    Array.isArray(state.installments) &&
    Array.isArray(state.payments) &&
    Array.isArray(state.receipts) &&
    Array.isArray(state.enquiries) &&
    Array.isArray(state.attendance) &&
    Array.isArray(state.enrollments) &&
    Array.isArray(state.staff) &&
    Array.isArray(state.cscServices) &&
    Array.isArray(state.cscTransactions) &&
    Array.isArray(state.expenses) &&
    Array.isArray(state.exams)
  );
}

const initialSeed = createSeedData();

export const useAcademyStore = create<AcademyStoreState>()(
  persist(
    (set, get) => ({
      ...initialSeed,
      lastPaymentSignature: null,
      lastPaymentTimestamp: 0,

      // 1. ENQUIRIES & ADMISSIONS
      submitEnquiry: (values) => {
        const state = get();
        const course = state.courses.find((c) => c.id === values.interestedCourseId);
        const id = generateEnquiryId(state.enquiries.map((e) => e.id));
        const newEnquiry: Enquiry = {
          id,
          applicantName: values.applicantName.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || undefined,
          interestedCourseId: values.interestedCourseId,
          interestedCourseName: course?.name ?? "Computer Course",
          preferredBatch: values.preferredBatch,
          source: "Website",
          message: values.message?.trim() ?? "",
          status: "New",
          notes: "Submitted via public website enquiry form.",
          submittedAt: new Date().toISOString(),
        };

        set((prev) => ({
          enquiries: [newEnquiry, ...prev.enquiries],
        }));

        get().logActivity("ENQUIRY_SUBMITTED", "Admissions", `New enquiry received from ${newEnquiry.applicantName} for ${newEnquiry.interestedCourseName}`, id);

        return newEnquiry;
      },

      updateEnquiryStatus: (id, status, notes) => {
        set((prev) => ({
          enquiries: prev.enquiries.map((enq) =>
            enq.id === id
              ? {
                  ...enq,
                  status,
                  notes: notes !== undefined ? notes : enq.notes,
                }
              : enq
          ),
        }));

        get().logActivity("ENQUIRY_STATUS_UPDATED", "Admissions", `Updated enquiry ${id} status to ${status}`, id);
      },

      registerStudent: (values, fromEnquiryId) => {
        const state = get();

        if (fromEnquiryId) {
          const enq = state.enquiries.find((e) => e.id === fromEnquiryId);
          if (enq && (enq.status === "Converted" || enq.convertedStudentId)) {
            throw new Error(`Enquiry ${fromEnquiryId} has already been converted into an enrolled student.`);
          }
        }

        const course = state.courses.find((c) => c.id === values.courseId);
        const batch = state.batches.find((b) => b.id === values.batchId);

        if (!course || !batch) {
          throw new Error("Invalid course or batch selected for student registration.");
        }

        const now = new Date();
        const todayStr = format(now, "yyyy-MM-dd");
        const existingStudentIds = state.students.map((s) => s.id);
        const studentId = generateStudentId(existingStudentIds);

        const newStudent: Student = {
          id: studentId,
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || undefined,
          guardianName: values.guardianName.trim(),
          dateOfBirth: values.dateOfBirth,
          address: values.address.trim(),
          courseId: course.id,
          batchId: batch.id,
          admissionDate: values.admissionDate || todayStr,
          totalFee: course.fee,
          status: "Active",
          notes: (values as any).notes?.trim() || undefined,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };

        const enrollment: Enrollment = {
          id: generateEntityId("ENR"),
          studentId,
          courseId: course.id,
          batchId: batch.id,
          enrolledAt: values.admissionDate || todayStr,
          status: "Active",
        };

        const feeAccountId = generateEntityId("FEE");
        const schedule = buildInstallmentSchedule(
          feeAccountId,
          studentId,
          course.fee,
          values.admissionDate || todayStr
        );
        schedule.forEach((inst) => {
          inst.feeAccountId = feeAccountId;
        });

        let initialPayment: Payment | undefined;
        let initialReceipt: Receipt | undefined;

        const initialPayAmount = (values as any).initialPayment ?? 0;

        if (initialPayAmount && initialPayAmount > 0) {
          const payAmount = Math.min(initialPayAmount, course.fee);
          const payDate = values.admissionDate || todayStr;
          const receiptNum = generateReceiptNumber(state.receipts.map((r) => r.receiptNumber));
          const pId = generateEntityId("PAY");

          initialPayment = {
            id: pId,
            receiptNumber: receiptNum,
            feeAccountId,
            studentId,
            amount: payAmount,
            method: values.paymentMethod || "Cash",
            paymentDate: payDate,
            notes: "Initial admission payment (Demo)",
            createdAt: now.toISOString(),
          };

          initialReceipt = {
            id: generateEntityId("RCT"),
            receiptNumber: receiptNum,
            paymentId: pId,
            studentId,
            studentName: newStudent.fullName,
            courseName: course.name,
            paymentDate: payDate,
            totalFees: course.fee,
            amountReceived: payAmount,
            totalPaidAfter: payAmount,
            remainingBalance: Math.max(0, course.fee - payAmount),
            paymentMethod: values.paymentMethod || "Cash",
            generatedAt: now.toISOString(),
          };
        }

        const initialAccount: FeeAccount = {
          id: feeAccountId,
          studentId,
          courseId: course.id,
          totalFees: course.fee,
          totalPaid: 0,
          outstandingBalance: course.fee,
          nextDueDate: schedule[0]?.dueDate,
          status: "Unpaid",
          updatedAt: now.toISOString(),
        };

        const { account: feeAccount, installments: recalculatedInstallments } = recalculateFeeState(
          initialAccount,
          schedule,
          initialPayment ? [initialPayment] : [],
          todayStr
        );

        set((prev) => {
          const updatedEnquiries = fromEnquiryId
            ? prev.enquiries.map((enq) =>
                enq.id === fromEnquiryId
                  ? {
                      ...enq,
                      status: "Converted" as EnquiryStatus,
                      convertedStudentId: studentId,
                      notes: `${enq.notes}\n[Converted to Student: ${studentId}]`,
                    }
                  : enq
              )
            : prev.enquiries;

          return {
            students: [newStudent, ...prev.students],
            enrollments: [enrollment, ...prev.enrollments],
            feeAccounts: [feeAccount, ...prev.feeAccounts],
            installments: [...recalculatedInstallments, ...prev.installments],
            payments: initialPayment ? [initialPayment, ...prev.payments] : prev.payments,
            receipts: initialReceipt ? [initialReceipt, ...prev.receipts] : prev.receipts,
            enquiries: updatedEnquiries,
          };
        });

        get().logActivity("STUDENT_REGISTERED", "Students", `Registered ${newStudent.fullName} (${studentId}) for ${course.name}`, studentId);

        return { student: newStudent, receipt: initialReceipt };
      },

      updateStudent: (studentId, values) => {
        set((prev) => ({
          students: prev.students.map((st) =>
            st.id === studentId
              ? {
                  ...st,
                  ...values,
                  updatedAt: new Date().toISOString(),
                }
              : st
          ),
        }));

        get().logActivity("STUDENT_UPDATED", "Students", `Updated information for student ${studentId}`, studentId);
      },

      // 2. ACADEMICS
      addCourse: (values) => {
        const newCourse: Course = {
          id: generateEntityId("CRS"),
          code: values.code.toUpperCase().trim(),
          name: values.name.trim(),
          category: values.category,
          duration: values.duration.trim(),
          durationMonths: values.durationMonths,
          fee: values.fee,
          description: values.description.trim(),
          highlights: (values as any).highlights
            ? String((values as any).highlights).split(",").map((s: string) => s.trim()).filter(Boolean)
            : [],
          isIllustrative: true,
        };

        set((prev) => ({
          courses: [...prev.courses, newCourse],
        }));

        get().logActivity("COURSE_ADDED", "Courses", `Added new course ${newCourse.name} (${newCourse.code})`, newCourse.id);
        return newCourse;
      },

      updateCourse: (id, values) => {
        set((prev) => ({
          courses: prev.courses.map((c) => (c.id === id ? { ...c, ...values } : c)),
        }));
        get().logActivity("COURSE_UPDATED", "Courses", `Updated course ${id}`, id);
      },

      addBatch: (values) => {
        const newBatch: Batch = {
          id: generateEntityId("BAT"),
          name: values.name.trim(),
          courseId: values.courseId,
          timing: values.timing.trim(),
          days: values.days.trim(),
          instructor: values.instructor.trim(),
          capacity: values.capacity,
          isActive: true,
        };

        set((prev) => ({
          batches: [...prev.batches, newBatch],
        }));

        get().logActivity("BATCH_ADDED", "Batches", `Added new batch ${newBatch.name}`, newBatch.id);
        return newBatch;
      },

      updateBatch: (id, values) => {
        set((prev) => ({
          batches: prev.batches.map((b) => (b.id === id ? { ...b, ...values } : b)),
        }));
        get().logActivity("BATCH_UPDATED", "Batches", `Updated batch ${id}`, id);
      },

      saveBatchAttendance: (date, batchId, courseId, entries) => {
        const now = new Date().toISOString();
        const newRecords: AttendanceRecord[] = entries.map((e) => ({
          id: generateEntityId("ATT"),
          date,
          batchId,
          courseId,
          studentId: e.studentId,
          status: e.status,
          markedAt: now,
        }));

        set((prev) => {
          const filtered = prev.attendance.filter(
            (r) => !(r.date === date && r.batchId === batchId)
          );
          return {
            attendance: [...newRecords, ...filtered],
          };
        });

        get().logActivity("ATTENDANCE_SAVED", "Attendance", `Saved attendance for batch ${batchId} on ${date} (${entries.length} students)`, batchId);
      },

      // 3. STUDENT BILLING & FEES
      recordPayment: (values) => {
        const now = new Date();
        const todayStr = format(now, "yyyy-MM-dd");
        const state = get();

        const signature = `${values.studentId}:${values.amount}:${values.paymentDate}:${values.method}`;
        if (
          state.lastPaymentSignature === signature &&
          now.getTime() - state.lastPaymentTimestamp < 3000
        ) {
          throw new Error("Duplicate payment submission prevented.");
        }

        const feeAccount = state.feeAccounts.find((fa) => fa.studentId === values.studentId);
        const student = state.students.find((s) => s.id === values.studentId);
        const course = state.courses.find((c) => c.id === student?.courseId);

        if (!feeAccount || !student || !course) {
          throw new Error("Student fee record or course not found.");
        }

        if (values.amount <= 0) {
          throw new Error("Payment amount must be greater than zero.");
        }

        if (values.amount > feeAccount.outstandingBalance) {
          throw new Error(
            `Payment amount (₹${values.amount}) cannot exceed the outstanding balance (₹${feeAccount.outstandingBalance}).`
          );
        }

        const paymentId = generateEntityId("PAY");
        const receiptNumber = generateReceiptNumber(state.receipts.map((r) => r.receiptNumber));

        let remainingAllocation = values.amount;
        const studentInstallments = state.installments
          .filter((i) => i.studentId === values.studentId)
          .sort((a, b) => a.installmentNumber - b.installmentNumber);

        const updatedInstallments = studentInstallments.map((inst) => {
          if (remainingAllocation <= 0) return inst;
          const unpaidOnThis = inst.amountDue - inst.amountPaid;
          if (unpaidOnThis > 0) {
            const allocate = Math.min(remainingAllocation, unpaidOnThis);
            const newPaid = inst.amountPaid + allocate;
            remainingAllocation -= allocate;
            return {
              ...inst,
              amountPaid: newPaid,
              status: (newPaid >= inst.amountDue ? "Paid" : "Partial") as Installment["status"],
            };
          }
          return inst;
        });

        const newPayment: Payment = {
          id: paymentId,
          receiptNumber,
          feeAccountId: feeAccount.id,
          studentId: values.studentId,
          amount: values.amount,
          method: values.method,
          paymentDate: values.paymentDate || todayStr,
          reference: values.reference?.trim() || undefined,
          notes: (values as any).notes?.trim() || undefined,
          createdAt: now.toISOString(),
        };

        const totalPaidAfter = feeAccount.totalPaid + values.amount;
        const newReceipt: Receipt = {
          id: generateEntityId("RCT"),
          receiptNumber,
          paymentId,
          studentId: values.studentId,
          studentName: student.fullName,
          courseName: course.name,
          paymentDate: values.paymentDate || todayStr,
          totalFees: feeAccount.totalFees,
          amountReceived: values.amount,
          totalPaidAfter,
          remainingBalance: Math.max(0, feeAccount.totalFees - totalPaidAfter),
          paymentMethod: values.method,
          reference: values.reference?.trim() || undefined,
          generatedAt: now.toISOString(),
        };

        const allAccountPayments = [newPayment, ...state.payments.filter((p) => p.feeAccountId === feeAccount.id)];
        const { account: updatedFeeAccount, installments: finalInstallments } = recalculateFeeState(
          feeAccount,
          state.installments.filter((i) => i.feeAccountId === feeAccount.id),
          allAccountPayments,
          todayStr
        );

        set((prev) => ({
          payments: [newPayment, ...prev.payments],
          receipts: [newReceipt, ...prev.receipts],
          feeAccounts: prev.feeAccounts.map((fa) =>
            fa.id === feeAccount.id ? updatedFeeAccount : fa
          ),
          installments: prev.installments.map((inst) => {
            const updated = finalInstallments.find((ui) => ui.id === inst.id);
            return updated || inst;
          }),
          lastPaymentSignature: signature,
          lastPaymentTimestamp: now.getTime(),
        }));

        get().logActivity("FEE_COLLECTION", "Fees & Billing", `Collected ₹${values.amount} (${values.method}) for student ${student.fullName} (Receipt: ${receiptNumber})`, paymentId);

        return { payment: newPayment, receipt: newReceipt };
      },

      voidPayment: (paymentId, reason) => {
        const state = get();
        const payment = state.payments.find((p) => p.id === paymentId);
        if (!payment) return;

        const feeAccount = state.feeAccounts.find((fa) => fa.id === payment.feeAccountId);
        if (!feeAccount) return;

        const todayStr = format(new Date(), "yyyy-MM-dd");
        const remainingPayments = state.payments.filter(
          (p) => p.feeAccountId === feeAccount.id && p.id !== paymentId
        );
        const { account: updatedFeeAccount, installments: updatedInstallments } = recalculateFeeState(
          feeAccount,
          state.installments.filter((i) => i.feeAccountId === feeAccount.id),
          remainingPayments,
          todayStr
        );

        set((prev) => ({
          payments: prev.payments.filter((p) => p.id !== paymentId),
          receipts: prev.receipts.filter((r) => r.paymentId !== paymentId),
          feeAccounts: prev.feeAccounts.map((fa) => (fa.id === feeAccount.id ? updatedFeeAccount : fa)),
          installments: prev.installments.map((inst) => {
            const updated = updatedInstallments.find((ui) => ui.id === inst.id);
            return updated || inst;
          }),
        }));

        get().logActivity("PAYMENT_VOIDED", "Fees & Billing", `Voided payment ${paymentId} of ₹${payment.amount}. Reason: ${reason}`, paymentId);
      },

      // 4. CSC POS BILLING
      addCSCService: (service) => {
        const newService: CSCService = {
          ...service,
          id: generateEntityId("CSC"),
        };
        set((prev) => ({
          cscServices: [...prev.cscServices, newService],
        }));
        get().logActivity("CSC_SERVICE_ADDED", "CSC Billing", `Added new CSC service: ${newService.name}`, newService.id);
        return newService;
      },

      updateCSCService: (id, service) => {
        set((prev) => ({
          cscServices: prev.cscServices.map((s) => (s.id === id ? { ...s, ...service } : s)),
        }));
        get().logActivity("CSC_SERVICE_UPDATED", "CSC Billing", `Updated CSC service ${id}`, id);
      },

      recordCSCTransaction: (data) => {
        const now = new Date();
        const year = now.getFullYear();
        const txNum = get().cscTransactions.length + 1;
        const subtotal = data.items.reduce((sum, it) => sum + it.total, 0);
        const totalAmount = Math.max(0, subtotal - data.discount);

        const currentRole = get().settings.activeRole;
        const staff = get().staff.find((s) => s.role === currentRole) || get().staff[1];

        const newTx: CSCTransaction = {
          id: `CSC-TX-${year}-${String(txNum).padStart(5, "0")}`,
          receiptNumber: `CSC-POS-${year}-${String(txNum).padStart(4, "0")}`,
          customerName: data.customerName?.trim() || undefined,
          customerPhone: data.customerPhone?.trim() || undefined,
          items: data.items,
          subtotal,
          discount: data.discount,
          totalAmount,
          paymentMethod: data.paymentMethod,
          staffId: staff.id,
          staffName: staff.name,
          createdAt: now.toISOString(),
          status: "Completed",
        };

        set((prev) => ({
          cscTransactions: [newTx, ...prev.cscTransactions],
        }));

        get().logActivity("CSC_BILL_COMPLETED", "CSC Billing", `Completed CSC bill ${newTx.receiptNumber} for ₹${totalAmount} (${data.items.length} items)`, newTx.id);

        return newTx;
      },

      voidCSCTransaction: (transactionId, reason) => {
        set((prev) => ({
          cscTransactions: prev.cscTransactions.map((tx) =>
            tx.id === transactionId
              ? { ...tx, status: "Voided" as const, voidReason: reason }
              : tx
          ),
        }));
        get().logActivity("CSC_BILL_VOIDED", "CSC Billing", `Voided CSC bill ${transactionId}. Reason: ${reason}`, transactionId);
      },

      // 5. EXPENSES
      recordExpense: (data) => {
        const now = new Date();
        const year = now.getFullYear();
        const expId = `EXP-${year}-${String(get().expenses.length + 1).padStart(4, "0")}`;

        const newExp: Expense = {
          ...data,
          id: expId,
          createdAt: now.toISOString(),
          status: "Active",
        };

        set((prev) => ({
          expenses: [newExp, ...prev.expenses],
        }));

        get().logActivity("EXPENSE_RECORDED", "Expenses", `Recorded expense: ${newExp.title} (₹${newExp.amount}) under ${newExp.category}`, expId);
        return newExp;
      },

      voidExpense: (expenseId, reason) => {
        set((prev) => ({
          expenses: prev.expenses.map((e) =>
            e.id === expenseId
              ? { ...e, status: "Voided" as const, voidReason: reason }
              : e
          ),
        }));
        get().logActivity("EXPENSE_VOIDED", "Expenses", `Voided expense ${expenseId}. Reason: ${reason}`, expenseId);
      },

      // 6. CASHBOOK & ADJUSTMENTS
      addCashAdjustment: (data) => {
        const newAdj: CashAdjustment = {
          ...data,
          id: generateEntityId("ADJ"),
          createdAt: new Date().toISOString(),
        };

        set((prev) => ({
          cashAdjustments: [newAdj, ...prev.cashAdjustments],
        }));

        get().logActivity("CASH_ADJUSTMENT", "Cashbook", `${data.type} adjustment of ₹${data.amount}: ${data.reason}`, newAdj.id);
        return newAdj;
      },

      saveDailyClosing: (data) => {
        const newClosing: DailyClosing = {
          ...data,
          id: `CLS-${data.date}`,
          closedAt: new Date().toISOString(),
        };

        set((prev) => ({
          dailyClosings: [newClosing, ...prev.dailyClosings.filter((c) => c.date !== data.date)],
        }));

        get().logActivity("DAILY_CLOSING", "Cashbook", `Closed cashbook for ${data.date}. Counted: ₹${data.actualCountedCash}, Expected: ₹${data.expectedCash}`, newClosing.id);
        return newClosing;
      },

      // 7. EXAMINATIONS
      createExam: (data) => {
        const newExam: Exam = {
          ...data,
          id: generateEntityId("EXM"),
        };
        set((prev) => ({
          exams: [newExam, ...prev.exams],
        }));
        get().logActivity("EXAM_CREATED", "Examinations", `Scheduled examination ${newExam.name} on ${newExam.examDate}`, newExam.id);
        return newExam;
      },

      saveExamResults: (examId, results) => {
        const now = new Date().toISOString();
        const exam = get().exams.find((e) => e.id === examId);
        if (!exam) return;

        const newResults: ExamResult[] = results.map((r) => {
          const pct = exam.maxMarks > 0 ? (r.marksObtained / exam.maxMarks) * 100 : 0;
          let grade: ExamResult["grade"] = "B";
          if (pct >= 90) grade = "A+";
          else if (pct >= 80) grade = "A";
          else if (pct >= 70) grade = "B";
          else if (pct >= 60) grade = "C";
          else if (pct >= 50) grade = "D";
          else grade = "E";

          return {
            id: `RES-${examId}-${r.studentId}`,
            examId,
            studentId: r.studentId,
            marksObtained: r.marksObtained,
            isAbsent: r.isAbsent,
            grade,
            passed: !r.isAbsent && r.marksObtained >= exam.passingMarks,
            remarks: r.remarks,
            enteredBy: get().settings.activeRole,
            updatedAt: now,
          };
        });

        set((prev) => ({
          examResults: [
            ...newResults,
            ...prev.examResults.filter((er) => er.examId !== examId),
          ],
          exams: prev.exams.map((e) => (e.id === examId ? { ...e, status: "Published" as const } : e)),
        }));

        get().logActivity("EXAM_RESULTS_SAVED", "Examinations", `Published assessment marks for ${exam.name} (${results.length} students)`, examId);
      },

      // 8. ID CARDS & CERTIFICATES
      issueIdCard: (studentId) => {
        const state = get();
        const student = state.students.find((s) => s.id === studentId);
        if (!student) throw new Error("Student not found");
        const course = state.courses.find((c) => c.id === student.courseId);

        const year = new Date().getFullYear();
        const cardNum = `SVCA-ID-${year}-${String(state.idCards.length + 1).padStart(3, "0")}`;

        const newCard: StudentIdCard = {
          id: generateEntityId("IDC"),
          cardNumber: cardNum,
          studentId,
          courseId: student.courseId,
          batchId: student.batchId,
          issueDate: format(new Date(), "yyyy-MM-dd"),
          validityDate: format(new Date(Date.now() + 365 * 24 * 3600 * 1000), "yyyy-MM-dd"),
          qrPayload: `SVCA:ID:${studentId}:${course?.code || "GEN"}:VERIFIED`,
          issuedBy: get().settings.activeRole,
          status: "Active",
        };

        set((prev) => ({
          idCards: [newCard, ...prev.idCards],
        }));

        get().logActivity("ID_CARD_ISSUED", "ID Cards", `Issued student ID card ${cardNum} for ${student.fullName}`, newCard.id);
        return newCard;
      },

      issueCertificate: (studentId, grade = "A") => {
        const state = get();
        const student = state.students.find((s) => s.id === studentId);
        if (!student) throw new Error("Student not found");
        const course = state.courses.find((c) => c.id === student.courseId);

        const year = new Date().getFullYear();
        const certNum = `SVCA-CERT-${year}-${String(state.certificates.length + 1).padStart(3, "0")}`;

        const newCert: Certificate = {
          id: generateEntityId("CRT"),
          certificateNumber: certNum,
          studentId,
          courseId: student.courseId,
          courseName: course?.name || "Computer Course",
          duration: course?.duration || "6 Months",
          completionDate: format(new Date(), "yyyy-MM-dd"),
          issueDate: format(new Date(), "yyyy-MM-dd"),
          grade,
          qrPayload: `SVCA:CERT:${studentId}:${course?.code || "GEN"}:VERIFIED`,
          issuedBy: "Tanmay Mukherjee",
          status: "Issued",
        };

        set((prev) => ({
          certificates: [newCert, ...prev.certificates],
          students: prev.students.map((s) => (s.id === studentId ? { ...s, status: "Completed" as const } : s)),
        }));

        get().logActivity("CERTIFICATE_ISSUED", "Certificates", `Issued graduation certificate ${certNum} to ${student.fullName}`, newCert.id);
        return newCert;
      },

      // 9. REMINDERS
      recordReminder: (studentId, templateType, messageText, phone) => {
        const newRem: ReminderRecord = {
          id: generateEntityId("REM"),
          studentId,
          templateType,
          messageText,
          recipientPhone: phone,
          recordedAt: new Date().toISOString(),
          recordedBy: get().settings.activeRole,
          status: "Recorded",
        };

        set((prev) => ({
          reminders: [newRem, ...prev.reminders],
        }));

        get().logActivity("REMINDER_LOGGED", "Reminders", `Logged ${templateType} reminder draft for ${studentId}`, newRem.id);
        return newRem;
      },

      // 10. STAFF & ROLES
      addStaffMember: (data) => {
        const newStaff: StaffMember = {
          ...data,
          id: generateEntityId("STF"),
        };
        set((prev) => ({
          staff: [...prev.staff, newStaff],
        }));
        get().logActivity("STAFF_ADDED", "Staff", `Added staff member: ${newStaff.name} (${newStaff.designation})`, newStaff.id);
        return newStaff;
      },

      updateStaffMember: (id, data) => {
        set((prev) => ({
          staff: prev.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }));
        get().logActivity("STAFF_UPDATED", "Staff", `Updated staff member ${id}`, id);
      },

      setActiveRole: (role) => {
        set((prev) => ({
          settings: {
            ...prev.settings,
            activeRole: role,
            lastUpdated: new Date().toISOString(),
          },
        }));
        get().logActivity("ROLE_SWITCHED", "Administration", `Switched active demonstration role to ${role}`);
      },

      // 11. WEBSITE CONTENT MANAGEMENT
      updateWebsiteContent: (content) => {
        set((prev) => ({
          websiteContent: {
            ...prev.websiteContent,
            ...content,
            isCustomized: true,
          },
        }));
        get().logActivity("WEBSITE_UPDATED", "Website Manager", "Published customized website content overrides locally");
      },

      restoreWebsiteContent: () => {
        set((prev) => ({
          websiteContent: {
            announcement: "Admissions open for new career batches. Weekend and evening schedules available.",
            heroHeadline: "Empowering Futures with Practical Computer Education & Citizen Services",
            heroDescription: "Providing career-oriented computer certification courses and official Common Services Centre (CSC) digital assistance in West Bengal.",
            ctaText: "Apply for Admission",
            aboutText: "SVCA Computer Training Academy & CSC Centre is an established institution dedicated to bridging the digital divide.",
            isCustomized: false,
          },
        }));
        get().logActivity("WEBSITE_RESTORED", "Website Manager", "Restored default website content");
      },

      // 12. ACTIVITY & SETTINGS
      logActivity: (action, module, description, relatedEntityId) => {
        const state = get();
        const role = state.settings?.activeRole || "owner";
        const staff = state.staff?.find((s) => s.role === role) || state.staff?.[0];

        const log: ActivityLog = {
          id: generateEntityId("LOG"),
          action,
          module,
          relatedEntityId,
          staffName: staff?.name || "System Admin",
          role,
          timestamp: new Date().toISOString(),
          description,
        };

        set((prev) => ({
          activityLogs: [log, ...(prev.activityLogs || []).slice(0, 199)],
        }));
      },

      updateSettings: (partial) => {
        set((prev) => ({
          settings: {
            ...prev.settings,
            ...partial,
            lastUpdated: new Date().toISOString(),
          },
        }));
      },

      resetDemo: () => {
        const fresh = createSeedData(new Date());
        set({
          ...fresh,
          lastPaymentSignature: null,
          lastPaymentTimestamp: 0,
        });
      },
    }),
    {
      name: STORE_STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => safeStorage),
      migrate: (persistedState) => {
        const candidate = persistedState as Partial<AcademyStoreState> | undefined;
        if (!isValidDataset(candidate)) {
          return {
            ...createSeedData(),
            lastPaymentSignature: null,
            lastPaymentTimestamp: 0,
          };
        }
        return candidate as AcademyStoreState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !isValidDataset(state)) {
          useAcademyStore.getState().resetDemo();
        }
      },
    }
  )
);
