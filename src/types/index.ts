export type StudentStatus = "Active" | "Completed" | "On Leave" | "Dropped";
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";
export type FeeStatus = "Fully Paid" | "Partially Paid" | "Unpaid" | "Overdue";
export type InstallmentStatus = "Paid" | "Partial" | "Pending" | "Overdue";
export type PaymentMethod = "Cash" | "UPI" | "Bank Transfer";
export type EnquiryStatus = "New" | "Contacted" | "Interested" | "Converted" | "Closed";

export interface Course {
  id: string;
  code: string;
  name: string;
  category: "Basic & Office" | "Accounting" | "Design & DTP" | "Programming" | "Diploma";
  duration: string;
  durationMonths: number;
  fee: number;
  description: string;
  highlights: string[];
  isIllustrative?: boolean;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  timing: string;
  days: string;
  instructor: string;
  capacity: number;
  isActive: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  guardianName: string;
  dateOfBirth: string;
  address: string;
  courseId: string;
  batchId: string;
  admissionDate: string;
  totalFee: number;
  status: StudentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  batchId: string;
  enrolledAt: string;
  status: "Active" | "Completed" | "Withdrawn";
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  batchId: string;
  courseId: string;
  studentId: string;
  status: AttendanceStatus;
  markedAt: string;
}

export interface Installment {
  id: string;
  feeAccountId: string;
  studentId: string;
  installmentNumber: number;
  dueDate: string; // YYYY-MM-DD
  amountDue: number;
  amountPaid: number;
  status: InstallmentStatus;
}

export interface FeeAccount {
  id: string;
  studentId: string;
  courseId: string;
  totalFees: number;
  totalPaid: number;
  outstandingBalance: number;
  nextDueDate?: string;
  status: FeeStatus;
  updatedAt: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  feeAccountId: string;
  studentId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  studentId: string;
  studentName: string;
  courseName: string;
  paymentDate: string;
  totalFees: number;
  amountReceived: number;
  totalPaidAfter: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  generatedAt: string;
}

export type DemoRole = "owner" | "receptionist" | "instructor" | "accountant";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: DemoRole;
  designation: string;
  assignedBatches: string[];
  joiningDate: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

export interface CSCService {
  id: string;
  name: string;
  category: "Documentation & Printing" | "Citizen Applications" | "Banking & Bills" | "Identity Services";
  unitPrice: number;
  unitType: string; // e.g. "per page", "per application", "per copy"
  description: string;
  isActive: boolean;
}

export interface CSCTransactionItem {
  serviceId: string;
  serviceName: string;
  category: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface CSCTransaction {
  id: string;
  receiptNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: CSCTransactionItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  staffId: string;
  staffName: string;
  createdAt: string;
  status: "Completed" | "Voided";
  voidReason?: string;
}

export type ExpenseCategory =
  | "Rent"
  | "Electricity"
  | "Internet"
  | "Staff Salaries"
  | "Office Supplies"
  | "Printing Materials"
  | "Computer Maintenance"
  | "Software Subscriptions"
  | "Marketing"
  | "Transportation"
  | "Miscellaneous";

export type ExpenseDivision = "Academy" | "CSC Centre" | "Shared Business Expense";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  vendorPayee: string;
  referenceNumber?: string;
  division: ExpenseDivision;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  status: "Active" | "Voided";
  voidReason?: string;
}

export interface CashAdjustment {
  id: string;
  date: string; // YYYY-MM-DD
  type: "Cash Added" | "Cash Withdrawn" | "Cash Correction" | "Opening Balance";
  amount: number;
  reason: string;
  recordedBy: string;
  createdAt: string;
}

export interface DailyClosing {
  id: string;
  date: string; // YYYY-MM-DD
  openingCash: number;
  academyCashCollections: number;
  cscCashCollections: number;
  cashExpenses: number;
  cashAdjustments: number;
  expectedCash: number;
  actualCountedCash: number;
  difference: number;
  notes?: string;
  closedBy: string;
  closedAt: string;
  status: "Closed" | "Needs Review";
}

export type ExamType = "Written" | "Practical" | "Internal Assessment" | "Final Examination";

export interface Exam {
  id: string;
  name: string;
  courseId: string;
  batchId: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  maxMarks: number;
  passingMarks: number;
  examType: ExamType;
  instructorId: string;
  status: "Scheduled" | "Completed" | "Published";
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  isAbsent: boolean;
  grade: "A+" | "A" | "B" | "C" | "D" | "E";
  passed: boolean;
  remarks?: string;
  enteredBy: string;
  updatedAt: string;
}

export interface StudentIdCard {
  id: string;
  cardNumber: string;
  studentId: string;
  courseId: string;
  batchId: string;
  issueDate: string;
  validityDate: string;
  qrPayload: string;
  issuedBy: string;
  status: "Active" | "Reissued";
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  courseId: string;
  courseName: string;
  duration: string;
  completionDate: string;
  issueDate: string;
  grade?: string;
  qrPayload: string;
  issuedBy: string;
  status: "Issued" | "Revoked";
  revokeReason?: string;
}

export interface ReminderRecord {
  id: string;
  studentId: string;
  templateType: string;
  messageText: string;
  recipientPhone: string;
  recordedAt: string;
  recordedBy: string;
  status: "Drafted" | "Recorded";
}

export interface ActivityLog {
  id: string;
  action: string;
  module: string;
  relatedEntityId?: string;
  staffName: string;
  role: DemoRole;
  timestamp: string;
  description: string;
}

export interface WebsiteContent {
  announcement: string;
  heroHeadline: string;
  heroDescription: string;
  ctaText: string;
  aboutText: string;
  isCustomized: boolean;
}

export interface Enquiry {
  id: string;
  applicantName: string;
  phone: string;
  email?: string;
  interestedCourseId: string;
  interestedCourseName: string;
  preferredBatch: string;
  source?: "Website" | "Walk-in" | "Telephone" | "WhatsApp" | "Referral" | "Other";
  followUpDate?: string;
  assignedStaffId?: string;
  message: string;
  status: EnquiryStatus;
  notes: string;
  submittedAt: string;
  convertedStudentId?: string;
}

export interface AppSettings {
  tourCompleted: boolean;
  tourDismissed: boolean;
  sidebarCollapsed: boolean;
  activeRole: DemoRole;
  currency: string;
  receiptPrefix: string;
  cscReceiptPrefix: string;
  studentIdPrefix: string;
  lastUpdated: string;
}
