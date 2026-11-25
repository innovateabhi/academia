import { format, subDays, subMonths } from "date-fns";
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
  Enrollment,
  Exam,
  ExamResult,
  Expense,
  ExpenseCategory,
  ExpenseDivision,
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
import { buildInstallmentSchedule, recalculateFeeState } from "@/utils/feeCalculations";

export interface AcademyDataset {
  courses: Course[];
  batches: Batch[];
  students: Student[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  feeAccounts: FeeAccount[];
  installments: Installment[];
  payments: Payment[];
  receipts: Receipt[];
  enquiries: Enquiry[];
  staff: StaffMember[];
  cscServices: CSCService[];
  cscTransactions: CSCTransaction[];
  expenses: Expense[];
  cashAdjustments: CashAdjustment[];
  dailyClosings: DailyClosing[];
  exams: Exam[];
  examResults: ExamResult[];
  idCards: StudentIdCard[];
  certificates: Certificate[];
  reminders: ReminderRecord[];
  activityLogs: ActivityLog[];
  websiteContent: WebsiteContent;
  settings: AppSettings;
}

const BENGALI_STUDENT_NAMES = [
  { name: "Ananya Chatterjee", guardian: "Subrata Chatterjee", dob: "2004-03-14", address: "Station Road, Ward 4" },
  { name: "Subhajit Mondal", guardian: "Pradip Mondal", dob: "2003-08-22", address: "Netaji Para, Block B" },
  { name: "Moumita Sarkar", guardian: "Tapan Sarkar", dob: "2005-01-19", address: "College More, North" },
  { name: "Debashis Ghosh", guardian: "Bimal Ghosh", dob: "2002-11-05", address: "Rabindra Nagar" },
  { name: "Rituparna Das", guardian: "Ashok Das", dob: "2004-06-28", address: "Bazar Para" },
  { name: "Sourav Banerjee", guardian: "Kalyan Banerjee", dob: "2003-09-12", address: "School Bagan" },
  { name: "Arpita Roy", guardian: "Sanjoy Roy", dob: "2005-04-07", address: "Hospital Road" },
  { name: "Tanmoy Mukherjee", guardian: "Dilip Mukherjee", dob: "2003-12-18", address: "Subhas Pally" },
  { name: "Poulomi Bose", guardian: "Partha Bose", dob: "2004-07-09", address: "Vivekananda Sarani" },
  { name: "Koushik Sen", guardian: "Ratan Sen", dob: "2001-10-25", address: "Deshbandhu Para" },
  { name: "Srijita Bhattacharya", guardian: "Alok Bhattacharya", dob: "2005-05-16", address: "Shantipur Lane" },
  { name: "Arindam Paul", guardian: "Nirmal Paul", dob: "2003-02-21", address: "Kachari Para" },
  { name: "Priyanka Halder", guardian: "Sujit Halder", dob: "2004-09-30", address: "Kalibari Road" },
  { name: "Rohan Chakraborty", guardian: "Debabrata Chakraborty", dob: "2003-07-11", address: "Cinema Hall More" },
  { name: "Sohini Dutta", guardian: "Samar Dutta", dob: "2005-02-14", address: "Gopalpur East" },
  { name: "Abhishek Biswas", guardian: "Haradhan Biswas", dob: "2002-04-03", address: "Thana Road" },
  { name: "Nandini Saha", guardian: "Gopal Saha", dob: "2004-11-27", address: "Bus Stand Area" },
  { name: "Sayan Karmakar", guardian: "Bikash Karmakar", dob: "2003-01-08", address: "Rath Tala" },
  { name: "Tania Majumdar", guardian: "Sudip Majumdar", dob: "2005-08-19", address: "Park Circus Lane" },
  { name: "Mainak Kundu", guardian: "Tapas Kundu", dob: "2003-05-23", address: "New Colony" },
  { name: "Debolina Mitra", guardian: "Ashim Mitra", dob: "2004-12-01", address: "Lake Town Sector" },
  { name: "Suvojit Pal", guardian: "Kamal Pal", dob: "2002-06-15", address: "Post Office Road" },
  { name: "Ipsita Nandi", guardian: "Subir Nandi", dob: "2005-03-29", address: "Bazar Para North" },
  { name: "Pratikshawari Roy", guardian: "Manoj Roy", dob: "2004-10-12", address: "High School Para" },
  { name: "Bishal Pramanik", guardian: "Gautam Pramanik", dob: "2003-04-18", address: "Nutanganj" },
  { name: "Shreya Mukherjee", guardian: "Shyamal Mukherjee", dob: "2004-11-09", address: "Rail Gate Colony" },
  { name: "Dipayan Samanta", guardian: "Tarun Samanta", dob: "2002-08-14", address: "Puratan Bazar" },
  { name: "Sulata Adhikary", guardian: "Animesh Adhikary", dob: "2005-06-25", address: "Arambagh Road" },
  { name: "Niladri Sekhar Roy", guardian: "Biswanath Roy", dob: "2003-03-30", address: "Shyambazar" },
  { name: "Madhumita Ghosh", guardian: "Bholanath Ghosh", dob: "2004-01-17", address: "Court Road" },
  { name: "Kunal Goswami", guardian: "Pabitra Goswami", dob: "2002-09-04", address: "Tarakeswar Road" },
  { name: "Soma Bhowmik", guardian: "Narayan Bhowmik", dob: "2005-07-22", address: "Kolkata Link Road" },
  { name: "Anupam Bag", guardian: "Swapan Bag", dob: "2003-11-13", address: "Bishnupur Road" },
  { name: "Piu Dasgupta", guardian: "Prabir Dasgupta", dob: "2004-05-08", address: "Dakshin Para" },
  { name: "Rajib Mallick", guardian: "Kartik Mallick", dob: "2002-12-29", address: "Milan Pally" },
  { name: "Jhuma Bagchi", guardian: "Dhiren Bagchi", dob: "2005-03-11", address: "Shibpur Road" },
  { name: "Siddhartha Guha", guardian: "Soumen Guha", dob: "2003-06-02", address: "Masterpara" },
  { name: "Rumki Choudhury", guardian: "Dipak Choudhury", dob: "2004-08-16", address: "Natun Pally" },
  { name: "Tuhin Subhra Dey", guardian: "Shankar Dey", dob: "2002-10-21", address: "Dakbangla More" },
  { name: "Paramita Singha", guardian: "Uttam Singha", dob: "2005-09-05", address: "Ghat Road" },
  { name: "Avik Sadhukhan", guardian: "Nimai Sadhukhan", dob: "2003-01-31", address: "Tentultala" },
  { name: "Mitali Koley", guardian: "Sukumar Koley", dob: "2004-04-15", address: "Bhadrakali" },
  { name: "Pinaki Bhattacharya", guardian: "Gouranga Bhattacharya", dob: "2002-05-19", address: "Rasulpur" },
  { name: "Sangita Barman", guardian: "Subal Barman", dob: "2005-10-03", address: "Chowrasta" },
  { name: "Chandan Mondal", guardian: "Kanai Mondal", dob: "2003-08-07", address: "Mayapur Road" },
  { name: "Bhaswati Das", guardian: "Nanda Das", dob: "2004-02-24", address: "Amtala" },
  { name: "Ayanava Sen", guardian: "Sunil Sen", dob: "2002-07-12", address: "Durgapur Link" },
  { name: "Sampa Dhara", guardian: "Rabi Dhara", dob: "2005-11-18", address: "Gariahat Lane" },
  { name: "Somnath Panja", guardian: "Madhab Panja", dob: "2003-09-28", address: "Chinsurah More" },
  { name: "Kakali Hazra", guardian: "Debu Hazra", dob: "2004-12-14", address: "Bandel Station" },
  { name: "Debabrata Kanjilal", guardian: "Birendra Kanjilal", dob: "2002-03-08", address: "Sreerampur" },
  { name: "Riya Patra", guardian: "Gokul Patra", dob: "2005-04-20", address: "Rishra Ward 2" },
  { name: "Subhasis Nayak", guardian: "Haripada Nayak", dob: "2003-10-05", address: "Konnagar" },
  { name: "Barnali Sil", guardian: "Gour Sil", dob: "2004-06-11", address: "Uttarpara" },
  { name: "Suman Kalyan Ghosh", guardian: "Pulin Ghosh", dob: "2002-11-23", address: "Dankuni" },
  { name: "Pooja Roychowdhury", guardian: "Sajal Roychowdhury", dob: "2005-08-01", address: "Belgharia" },
  { name: "Souradeep Poddar", guardian: "Nirmalya Poddar", dob: "2003-07-19", address: "Agarpara" },
  { name: "Tanusree Manna", guardian: "Joydeb Manna", dob: "2004-09-14", address: "Sodepur" },
  { name: "Arunabha Das", guardian: "Pranab Das", dob: "2002-04-27", address: "Panihati" },
  { name: "Bristi Mukherjee", guardian: "Arun Mukherjee", dob: "2005-05-30", address: "Khardaha" },
  { name: "Supratim Roy", guardian: "Manab Roy", dob: "2003-12-04", address: "Titagarh" },
  { name: "Anwesha Ganguly", guardian: "Prabhat Ganguly", dob: "2004-07-26", address: "Barrackpore" },
];

export function createSeedData(now = new Date()): AcademyDataset {
  const year = now.getFullYear();
  const todayStr = format(now, "yyyy-MM-dd");

  // 1. Staff Members (6 members)
  const staff: StaffMember[] = [
    {
      id: "STF-001",
      name: "Tanmay Mukherjee",
      email: "director@example.com",
      phone: "9830012341",
      role: "owner",
      designation: "Academy Director & Founder",
      assignedBatches: ["BAT-M1", "BAT-M2", "BAT-E1"],
      joiningDate: "2020-01-15",
      status: "Active",
    },
    {
      id: "STF-002",
      name: "Priya Sengupta",
      email: "admissions@example.com",
      phone: "9830012342",
      role: "receptionist",
      designation: "Senior Receptionist & Front Desk Manager",
      assignedBatches: [],
      joiningDate: "2021-03-01",
      status: "Active",
    },
    {
      id: "STF-003",
      name: "Amitava Roy",
      email: "tally.faculty@example.com",
      phone: "9830012343",
      role: "instructor",
      designation: "Senior Faculty — Accounting & TallyPrime",
      assignedBatches: ["BAT-M2", "BAT-E2"],
      joiningDate: "2021-07-10",
      status: "Active",
    },
    {
      id: "STF-004",
      name: "Sangeeta Karmakar",
      email: "design.faculty@example.com",
      phone: "9830012344",
      role: "instructor",
      designation: "Senior Faculty — Design & DTP Layouts",
      assignedBatches: ["BAT-A1", "BAT-E3"],
      joiningDate: "2022-02-15",
      status: "Active",
    },
    {
      id: "STF-005",
      name: "Debasis Banerjee",
      email: "lab.instructor@example.com",
      phone: "9830012345",
      role: "instructor",
      designation: "Lab Instructor & IT Support",
      assignedBatches: ["BAT-M1", "BAT-E1", "BAT-W1"],
      joiningDate: "2022-08-01",
      status: "Active",
    },
    {
      id: "STF-006",
      name: "Sujit Pal",
      email: "accounts@example.com",
      phone: "9830012346",
      role: "accountant",
      designation: "Accounts Officer & Cashier",
      assignedBatches: [],
      joiningDate: "2022-11-10",
      status: "Active",
    },
  ];

  // 2. Courses (6 courses)
  const courses: Course[] = [
    {
      id: "CRS-DCA",
      code: "DCA",
      name: "Diploma in Computer Application",
      category: "Basic & Office",
      duration: "6 Months",
      durationMonths: 6,
      fee: 4500,
      description: "Comprehensive foundation covering Windows, MS Word, Excel formulas, PowerPoint presentations, and internet workflows.",
      highlights: ["MS Office Suite", "Typing & Speed Practice", "Internet & Email", "Practical Lab Assignments"],
      isIllustrative: true,
    },
    {
      id: "CRS-TALLY",
      code: "TALLY",
      name: "TallyPrime with GST Billing",
      category: "Accounting",
      duration: "3 Months",
      durationMonths: 3,
      fee: 3600,
      description: "Practical business accounting using TallyPrime, voucher entries, inventory tracking, and GST invoice preparation.",
      highlights: ["Ledger & Voucher Entry", "GST Billing & Returns Prep", "Inventory Management", "Daybook & Balance Sheet"],
      isIllustrative: true,
    },
    {
      id: "CRS-DTP",
      code: "DTP",
      name: "Graphic Design & DTP",
      category: "Design & DTP",
      duration: "4 Months",
      durationMonths: 4,
      fee: 4000,
      description: "Print layout, Bengali & English typing, Photoshop retouching, and CorelDraw vector design for local print workflows.",
      highlights: ["Adobe Photoshop", "CorelDraw", "PageMaker Layout", "Bengali & English DTP"],
      isIllustrative: true,
    },
    {
      id: "CRS-ADCA",
      code: "ADCA",
      name: "Advanced Diploma in Computer Application",
      category: "Diploma",
      duration: "12 Months",
      durationMonths: 12,
      fee: 8400,
      description: "Full-year multi-skill track combining office automation, TallyPrime accounting, DTP basics, and introductory web design.",
      highlights: ["Full Office & Excel", "TallyPrime Accounting", "DTP & Design", "HTML & CSS Basics"],
      isIllustrative: true,
    },
    {
      id: "CRS-CCC",
      code: "BCC",
      name: "Basic Computer & Digital Literacy",
      category: "Basic & Office",
      duration: "3 Months",
      durationMonths: 3,
      fee: 2400,
      description: "Beginner-friendly course for school students and first-time learners covering computer fundamentals and safe internet use.",
      highlights: ["Computer Fundamentals", "Word & Spreadsheet Basics", "Online Forms & Safety", "Guided Lab Practice"],
      isIllustrative: true,
    },
    {
      id: "CRS-WEB",
      code: "WEB",
      name: "Web Designing Fundamentals",
      category: "Programming",
      duration: "4 Months",
      durationMonths: 4,
      fee: 4800,
      description: "Modern website creation with HTML5, CSS3, responsive layouts, Tailwind styling, and publishing basics.",
      highlights: ["HTML5 & CSS3", "Responsive UI", "Web Forms & Media", "Live Project Hosting"],
      isIllustrative: true,
    },
  ];

  // 3. Batches (8 batches)
  const batches: Batch[] = [
    {
      id: "BAT-M1",
      name: "Morning Batch A (DCA)",
      courseId: "CRS-DCA",
      timing: "08:00 AM – 09:30 AM",
      days: "Mon – Fri",
      instructor: "Tanmay Mukherjee",
      capacity: 22,
      isActive: true,
    },
    {
      id: "BAT-M2",
      name: "Morning Batch B (Tally)",
      courseId: "CRS-TALLY",
      timing: "10:00 AM – 11:30 AM",
      days: "Mon – Fri",
      instructor: "Amitava Roy",
      capacity: 18,
      isActive: true,
    },
    {
      id: "BAT-N1",
      name: "Noon Batch (Basic Computer)",
      courseId: "CRS-CCC",
      timing: "12:00 PM – 01:30 PM",
      days: "Mon – Fri",
      instructor: "Debasis Banerjee",
      capacity: 16,
      isActive: true,
    },
    {
      id: "BAT-A1",
      name: "Afternoon Batch (DTP)",
      courseId: "CRS-DTP",
      timing: "02:00 PM – 03:30 PM",
      days: "Mon – Fri",
      instructor: "Sangeeta Karmakar",
      capacity: 16,
      isActive: true,
    },
    {
      id: "BAT-E1",
      name: "Evening Batch A (ADCA)",
      courseId: "CRS-ADCA",
      timing: "05:00 PM – 06:30 PM",
      days: "Mon – Fri",
      instructor: "Debasis Banerjee",
      capacity: 20,
      isActive: true,
    },
    {
      id: "BAT-E2",
      name: "Evening Batch B (Tally)",
      courseId: "CRS-TALLY",
      timing: "06:30 PM – 08:00 PM",
      days: "Mon – Fri",
      instructor: "Amitava Roy",
      capacity: 18,
      isActive: true,
    },
    {
      id: "BAT-E3",
      name: "Evening Batch C (Web Design)",
      courseId: "CRS-WEB",
      timing: "06:30 PM – 08:00 PM",
      days: "Mon, Wed, Fri",
      instructor: "Sangeeta Karmakar",
      capacity: 15,
      isActive: true,
    },
    {
      id: "BAT-W1",
      name: "Weekend Basic Literacy Batch",
      courseId: "CRS-CCC",
      timing: "09:30 AM – 11:30 AM",
      days: "Sat – Sun",
      instructor: "Debasis Banerjee",
      capacity: 18,
      isActive: true,
    },
  ];

  // 4. Students & Academic Ledgers
  const students: Student[] = [];
  const enrollments: Enrollment[] = [];
  const feeAccounts: FeeAccount[] = [];
  const installments: Installment[] = [];
  const payments: Payment[] = [];
  const receipts: Receipt[] = [];
  const idCards: StudentIdCard[] = [];
  const certificates: Certificate[] = [];

  let payCounter = 1;
  let receiptCounter = 1;
  let certCounter = 1;
  let idCardCounter = 1;

  BENGALI_STUDENT_NAMES.forEach((item, index) => {
    const studentNum = index + 1;
    const studentId = `STU-${year}-${String(studentNum).padStart(4, "0")}`;
    const course = courses[index % courses.length];
    const eligibleBatches = batches.filter((b) => b.courseId === course.id);
    const batch = eligibleBatches[index % eligibleBatches.length] ?? batches[0];

    const monthsAgo = (index % 6) + 1;
    const dayOffset = (index % 25) + 2;
    const admissionDate = format(subDays(subMonths(now, monthsAgo), dayOffset), "yyyy-MM-dd");

    // Status: some completed, some active, few on leave
    let status: Student["status"] = "Active";
    if (monthsAgo >= 4 && index % 7 === 0) status = "Completed";
    else if (index % 19 === 0) status = "On Leave";

    const student: Student = {
      id: studentId,
      fullName: item.name,
      phone: `9830${String(100000 + studentNum).slice(1)}`,
      email: `${item.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      guardianName: item.guardian,
      dateOfBirth: item.dob,
      address: `${item.address}, West Bengal`,
      courseId: course.id,
      batchId: batch.id,
      admissionDate,
      totalFee: course.fee,
      status,
      createdAt: `${admissionDate}T10:00:00.000Z`,
      updatedAt: `${todayStr}T10:00:00.000Z`,
    };
    students.push(student);

    // Enrollment
    enrollments.push({
      id: `ENR-${year}-${String(studentNum).padStart(4, "0")}`,
      studentId,
      courseId: course.id,
      batchId: batch.id,
      enrolledAt: admissionDate,
      status: status === "Completed" ? "Completed" : "Active",
    });

    // ID Card
    const cardId = `IDC-${year}-${String(idCardCounter++).padStart(4, "0")}`;
    idCards.push({
      id: cardId,
      cardNumber: `SVCA-ID-${year}-${String(studentNum).padStart(3, "0")}`,
      studentId,
      courseId: course.id,
      batchId: batch.id,
      issueDate: admissionDate,
      validityDate: format(new Date(Date.now() + 365 * 24 * 3600 * 1000), "yyyy-MM-dd"),
      qrPayload: `SVCA:ID:${studentId}:${course.code}:VALID`,
      issuedBy: "Priya Sengupta",
      status: "Active",
    });

    // If completed, issue certificate
    if (status === "Completed") {
      const completionDate = format(subDays(now, (index % 30) + 10), "yyyy-MM-dd");
      certificates.push({
        id: `CRT-${year}-${String(certCounter++).padStart(4, "0")}`,
        certificateNumber: `SVCA-CERT-${year}-${String(certCounter).padStart(3, "0")}`,
        studentId,
        courseId: course.id,
        courseName: course.name,
        duration: course.duration,
        completionDate,
        issueDate: format(subDays(now, (index % 15) + 2), "yyyy-MM-dd"),
        grade: index % 2 === 0 ? "A+" : "A",
        qrPayload: `SVCA:CERT:${studentId}:${course.code}:VERIFIED`,
        issuedBy: "Tanmay Mukherjee",
        status: "Issued",
      });
    }

    // Fee Schedule & Payments
    const feeAccountId = `FEE-${year}-${String(studentNum).padStart(4, "0")}`;
    const schedule = buildInstallmentSchedule(feeAccountId, studentId, course.fee, admissionDate);

    // Paid ratios
    let paidRatio = 0.5;
    if (status === "Completed") paidRatio = 1;
    else if (index % 4 === 0) paidRatio = 1;
    else if (index % 4 === 1) paidRatio = 0.67;
    else if (index % 4 === 2) paidRatio = 0.33;
    else paidRatio = 0;

    let totalPaidSoFar = 0;

    schedule.forEach((inst, instIdx) => {
      const shouldPay = paidRatio > 0 && (instIdx === 0 || (instIdx === 1 && paidRatio >= 0.6) || (instIdx === 2 && paidRatio === 1));

      if (shouldPay) {
        const payDate = format(subDays(subMonths(now, Math.max(0, monthsAgo - instIdx)), dayOffset), "yyyy-MM-dd");
        const payAmount = inst.amountDue;
        inst.amountPaid = payAmount;
        inst.status = "Paid";
        totalPaidSoFar += payAmount;

        const pId = `PAY-${year}-${String(payCounter++).padStart(5, "0")}`;
        const recNum = `REC-${year}-${String(receiptCounter++).padStart(5, "0")}`;
        const pMethod: PaymentMethod = (instIdx + index) % 3 === 0 ? "UPI" : "Cash";

        payments.push({
          id: pId,
          receiptNumber: recNum,
          feeAccountId,
          studentId,
          amount: payAmount,
          method: pMethod,
          paymentDate: payDate,
          reference: pMethod === "UPI" ? `UPI/TXN${studentNum}${instIdx}7` : undefined,
          notes: `Installment ${instIdx + 1} payment (Sample)`,
          createdAt: `${payDate}T11:30:00.000Z`,
        });

        receipts.push({
          id: `RCT-${pId}`,
          receiptNumber: recNum,
          paymentId: pId,
          studentId,
          studentName: item.name,
          courseName: course.name,
          paymentDate: payDate,
          totalFees: course.fee,
          amountReceived: payAmount,
          totalPaidAfter: totalPaidSoFar,
          remainingBalance: Math.max(0, course.fee - totalPaidSoFar),
          paymentMethod: pMethod,
          reference: pMethod === "UPI" ? `UPI/TXN${studentNum}${instIdx}7` : undefined,
          generatedAt: `${payDate}T11:31:00.000Z`,
        });
      } else {
        const isPastDue = inst.dueDate < todayStr;
        inst.status = isPastDue ? "Overdue" : "Pending";
      }
      installments.push(inst);
    });

    const initialAccount: FeeAccount = {
      id: feeAccountId,
      studentId,
      courseId: course.id,
      totalFees: course.fee,
      totalPaid: 0,
      outstandingBalance: course.fee,
      nextDueDate: schedule[0]?.dueDate,
      status: "Unpaid",
      updatedAt: `${todayStr}T11:30:00.000Z`,
    };
    const studentPayments = payments.filter((p) => p.feeAccountId === feeAccountId);
    const { account: feeAccount } = recalculateFeeState(
      initialAccount,
      schedule,
      studentPayments,
      todayStr
    );
    feeAccounts.push(feeAccount);
  });

  // 5. Attendance History (Past 45 days)
  const attendance: AttendanceRecord[] = [];
  let attCounter = 1;
  const attendanceDays = 40;

  for (let d = 0; d < attendanceDays; d++) {
    const sessionDate = subDays(now, d);
    const dayOfWeek = sessionDate.getDay();
    if (dayOfWeek === 0) continue; // Sunday off

    const dateStr = format(sessionDate, "yyyy-MM-dd");

    batches.forEach((b) => {
      const enrolled = students.filter((s) => s.batchId === b.id && s.admissionDate <= dateStr);
      enrolled.forEach((st, sIdx) => {
        let attStatus: AttendanceStatus = "Present";
        const hash = (d * 17 + sIdx * 7) % 100;
        if (hash < 82) attStatus = "Present";
        else if (hash < 91) attStatus = "Late";
        else if (hash < 97) attStatus = "Absent";
        else attStatus = "Leave";

        attendance.push({
          id: `ATT-${year}-${String(attCounter++).padStart(6, "0")}`,
          date: dateStr,
          batchId: b.id,
          courseId: b.courseId,
          studentId: st.id,
          status: attStatus,
          markedAt: `${dateStr}T10:15:00.000Z`,
        });
      });
    });
  }

  // 6. CSC Services (12 services)
  const cscServices: CSCService[] = [
    { id: "CSC-001", name: "Black & White Printing (A4)", category: "Documentation & Printing", unitPrice: 5, unitType: "per page", description: "Standard single/double-sided laser printing on 75 GSM paper.", isActive: true },
    { id: "CSC-002", name: "Colour Document Printing (A4)", category: "Documentation & Printing", unitPrice: 15, unitType: "per page", description: "Vibrant inkjet/laser colour printing for charts, notes, and cards.", isActive: true },
    { id: "CSC-003", name: "Photocopy / Xerox (Single Sided)", category: "Documentation & Printing", unitPrice: 2, unitType: "per copy", description: "High-speed document reproduction for certificates and IDs.", isActive: true },
    { id: "CSC-004", name: "High-Resolution Document Scanning", category: "Documentation & Printing", unitPrice: 10, unitType: "per document", description: "300/600 DPI PDF and JPEG digital scanning with pen drive/email transfer.", isActive: true },
    { id: "CSC-005", name: "Heavy-Duty Pouch Lamination (A4)", category: "Documentation & Printing", unitPrice: 20, unitType: "per sheet", description: "Moisture-resistant 125-micron thermal lamination for certificates.", isActive: true },
    { id: "CSC-006", name: "Online Scholarship Application Assistance", category: "Citizen Applications", unitPrice: 100, unitType: "per form", description: "Assisted entry for OASIS, Aikyashree, and National Scholarship portals.", isActive: true },
    { id: "CSC-007", name: "Voter Card / Digital Service Assistance", category: "Citizen Applications", unitPrice: 50, unitType: "per application", description: "Online form submission for correction, addition, or digital download.", isActive: true },
    { id: "CSC-008", name: "Passport Photo Set (8 Copies)", category: "Identity Services", unitPrice: 60, unitType: "per set", description: "Studio portrait capture, white/blue background, and instant glossy print.", isActive: true },
    { id: "CSC-009", name: "Professional Resume Preparation & Print", category: "Documentation & Printing", unitPrice: 80, unitType: "per resume", description: "Bilingual bio-data drafting with structured formatting and 2 copies.", isActive: true },
    { id: "CSC-010", name: "WB Electricity Bill Payment Assistance", category: "Banking & Bills", unitPrice: 20, unitType: "per bill", description: "Instant online bill payment receipt for WBSEDCL utility consumers.", isActive: true },
    { id: "CSC-011", name: "New PAN Card Form Filing Support", category: "Identity Services", unitPrice: 150, unitType: "per form", description: "NSDL/UTIITSL application entry, biometric/eKYC guidance, and receipt.", isActive: true },
    { id: "CSC-012", name: "Citizen Form / Online Admission Filing", category: "Citizen Applications", unitPrice: 120, unitType: "per form", description: "College admission, recruitment exams, and trade license form guidance.", isActive: true },
  ];

  // 7. CSC Transactions (110 simulated transactions over past 60 days)
  const cscTransactions: CSCTransaction[] = [];
  let cscTxCounter = 1;
  const cscDays = 60;

  for (let d = 0; d < cscDays; d++) {
    const txDate = subDays(now, d);
    if (txDate.getDay() === 0) continue; // Sunday closed
    const dateStr = format(txDate, "yyyy-MM-dd");

    // 1 to 3 transactions per working day
    const txCount = (d % 3) + 1;
    for (let t = 0; t < txCount; t++) {
      const txNum = cscTxCounter++;
      const s1 = cscServices[(d + t) % cscServices.length];
      const s2 = cscServices[(d * 3 + t * 2) % cscServices.length];

      const q1 = ((txNum + 2) % 5) + 1;
      const q2 = ((txNum + 1) % 3) + 1;

      const items: CSCTransactionItem[] = [
        { serviceId: s1.id, serviceName: s1.name, category: s1.category, unitPrice: s1.unitPrice, quantity: q1, total: s1.unitPrice * q1 },
      ];
      if (t === 1) {
        items.push({ serviceId: s2.id, serviceName: s2.name, category: s2.category, unitPrice: s2.unitPrice, quantity: q2, total: s2.unitPrice * q2 });
      }

      const subtotal = items.reduce((sum, it) => sum + it.total, 0);
      const discount = subtotal > 150 && txNum % 5 === 0 ? 10 : 0;
      const totalAmount = subtotal - discount;
      const pMethod: PaymentMethod = txNum % 3 === 0 ? "UPI" : "Cash";
      const staffMember = staff[txNum % 2 === 0 ? 1 : 5];

      cscTransactions.push({
        id: `CSC-TX-${year}-${String(txNum).padStart(5, "0")}`,
        receiptNumber: `CSC-POS-${year}-${String(txNum).padStart(4, "0")}`,
        customerName: txNum % 2 === 0 ? `Citizen Client #${txNum}` : undefined,
        customerPhone: txNum % 3 === 0 ? `9830${String(300000 + txNum).slice(1)}` : undefined,
        items,
        subtotal,
        discount,
        totalAmount,
        paymentMethod: pMethod,
        staffId: staffMember.id,
        staffName: staffMember.name,
        createdAt: `${dateStr}T${String(10 + (t * 2)).padStart(2, "0")}:30:00.000Z`,
        status: "Completed",
      });
    }
  }

  // 8. Business Expenses (40 expenses over past 180 days)
  const expenses: Expense[] = [];
  const EXPENSE_TEMPLATES: Array<{ title: string; category: ExpenseCategory; amount: number; division: ExpenseDivision; vendor: string }> = [
    { title: "Premises Rent (Main Facility)", category: "Rent", amount: 12000, division: "Shared Business Expense", vendor: "Premises Landlord" },
    { title: "WBSEDCL Commercial Electricity Bill", category: "Electricity", amount: 3450, division: "Shared Business Expense", vendor: "WBSEDCL" },
    { title: "High-Speed Optical Broadband (100 Mbps)", category: "Internet", amount: 1199, division: "Shared Business Expense", vendor: "Alliance Broadband" },
    { title: "Faculty Monthly Honorarium", category: "Staff Salaries", amount: 18000, division: "Academy", vendor: "Teaching Staff" },
    { title: "Front Desk & Admin Salary", category: "Staff Salaries", amount: 9500, division: "Shared Business Expense", vendor: "Administrative Team" },
    { title: "A4 Printing Paper & Thermal Rolls", category: "Printing Materials", amount: 2800, division: "CSC Centre", vendor: "Bazar Stationers" },
    { title: "Printer Laser Toner Cartridges (Black & Colour)", category: "Printing Materials", amount: 3200, division: "CSC Centre", vendor: "Tech Solutions Hub" },
    { title: "Computer Lab Keyboard & Mouse Replacements", category: "Computer Maintenance", amount: 1850, division: "Academy", vendor: "National Hardware" },
    { title: "TallyPrime Annual Subscription Support", category: "Software Subscriptions", amount: 2500, division: "Academy", vendor: "Tally Authorized Partner" },
    { title: "Local Newspaper Admission Handbill Inserts", category: "Marketing", amount: 1600, division: "Academy", vendor: "Prabhat Advertisers" },
    { title: "Lab Cleaning & Drinking Water Cans", category: "Office Supplies", amount: 950, division: "Shared Business Expense", vendor: "Fresh Water Supplies" },
    { title: "Student Refreshments & Tea Expenses", category: "Miscellaneous", amount: 750, division: "Shared Business Expense", vendor: "Local Corner Tea Stall" },
  ];

  let expCounter = 1;
  for (let m = 5; m >= 0; m--) {
    EXPENSE_TEMPLATES.forEach((tpl, tIdx) => {
      const expDate = format(subDays(subMonths(now, m), (tIdx * 2) + 1), "yyyy-MM-dd");
      const pMethod: PaymentMethod = tpl.amount > 5000 ? "Bank Transfer" : (tIdx % 2 === 0 ? "Cash" : "UPI");

      expenses.push({
        id: `EXP-${year}-${String(expCounter++).padStart(4, "0")}`,
        title: `${tpl.title} (${format(subMonths(now, m), "MMM yyyy")})`,
        category: tpl.category,
        amount: tpl.amount,
        expenseDate: expDate,
        paymentMethod: pMethod,
        vendorPayee: tpl.vendor,
        referenceNumber: pMethod === "Bank Transfer" ? `NEFT/${year}/00${expCounter}` : undefined,
        division: tpl.division,
        recordedBy: "Sujit Pal",
        createdAt: `${expDate}T16:00:00.000Z`,
        status: "Active",
      });
    });
  }

  // 9. Cash Adjustments & Daily Closings
  const cashAdjustments: CashAdjustment[] = [
    {
      id: "ADJ-001",
      date: format(subDays(now, 10), "yyyy-MM-dd"),
      type: "Opening Balance",
      amount: 15000,
      reason: "Monthly starting drawer cash reserve",
      recordedBy: "Tanmay Mukherjee",
      createdAt: `${format(subDays(now, 10), "yyyy-MM-dd")}T09:00:00.000Z`,
    },
    {
      id: "ADJ-002",
      date: format(subDays(now, 4), "yyyy-MM-dd"),
      type: "Cash Withdrawn",
      amount: 5000,
      reason: "Deposit into main business bank account",
      recordedBy: "Sujit Pal",
      createdAt: `${format(subDays(now, 4), "yyyy-MM-dd")}T17:30:00.000Z`,
    },
  ];

  const dailyClosings: DailyClosing[] = [];
  for (let c = 7; c >= 1; c--) {
    const cDate = format(subDays(now, c), "yyyy-MM-dd");
    dailyClosings.push({
      id: `CLS-${cDate}`,
      date: cDate,
      openingCash: 12500,
      academyCashCollections: 4500,
      cscCashCollections: 920,
      cashExpenses: 1150,
      cashAdjustments: 0,
      expectedCash: 16770,
      actualCountedCash: 16770,
      difference: 0,
      notes: "Cash tallied perfectly with drawer register.",
      closedBy: "Sujit Pal",
      closedAt: `${cDate}T19:00:00.000Z`,
      status: "Closed",
    });
  }

  // 10. Examinations & Results (6 exams)
  const exams: Exam[] = [
    {
      id: "EXM-001",
      name: "DCA Mid-Term Practical Evaluation",
      courseId: "CRS-DCA",
      batchId: "BAT-M1",
      subject: "MS Word & Excel Data Sheet Analysis",
      examDate: format(subDays(now, 25), "yyyy-MM-dd"),
      maxMarks: 100,
      passingMarks: 40,
      examType: "Practical",
      instructorId: "STF-001",
      status: "Published",
    },
    {
      id: "EXM-002",
      name: "TallyPrime GST Assessment Test",
      courseId: "CRS-TALLY",
      batchId: "BAT-M2",
      subject: "Voucher Entry & GST Bill Preparation",
      examDate: format(subDays(now, 20), "yyyy-MM-dd"),
      maxMarks: 50,
      passingMarks: 20,
      examType: "Practical",
      instructorId: "STF-003",
      status: "Published",
    },
    {
      id: "EXM-003",
      name: "DTP Creative Layouts & Vector Exam",
      courseId: "CRS-DTP",
      batchId: "BAT-A1",
      subject: "Photoshop Retouching & CorelDraw Banner",
      examDate: format(subDays(now, 15), "yyyy-MM-dd"),
      maxMarks: 100,
      passingMarks: 40,
      examType: "Practical",
      instructorId: "STF-004",
      status: "Published",
    },
    {
      id: "EXM-004",
      name: "ADCA Semester 1 Written Examination",
      courseId: "CRS-ADCA",
      batchId: "BAT-E1",
      subject: "Computer Fundamentals & Operating Systems",
      examDate: format(subDays(now, 10), "yyyy-MM-dd"),
      maxMarks: 100,
      passingMarks: 40,
      examType: "Written",
      instructorId: "STF-005",
      status: "Published",
    },
    {
      id: "EXM-005",
      name: "Basic Computer Typing & Office Test",
      courseId: "CRS-CCC",
      batchId: "BAT-N1",
      subject: "Speed Typing & Document Formatting",
      examDate: format(subDays(now, 5), "yyyy-MM-dd"),
      maxMarks: 50,
      passingMarks: 20,
      examType: "Practical",
      instructorId: "STF-005",
      status: "Published",
    },
    {
      id: "EXM-006",
      name: "Upcoming TallyPrime Final Assessment",
      courseId: "CRS-TALLY",
      batchId: "BAT-E2",
      subject: "Comprehensive Ledger & Tax Auditing",
      examDate: format(subDays(now, -7), "yyyy-MM-dd"),
      maxMarks: 100,
      passingMarks: 40,
      examType: "Final Examination",
      instructorId: "STF-003",
      status: "Scheduled",
    },
  ];

  const examResults: ExamResult[] = [];
  exams.filter((e) => e.status === "Published").forEach((exam) => {
    const batchStudents = students.filter((s) => s.batchId === exam.batchId);
    batchStudents.forEach((st, sIdx) => {
      const isAbsent = sIdx === 7;
      const marksObtained = isAbsent ? 0 : Math.round(exam.maxMarks * (0.65 + ((sIdx * 11) % 35) / 100));
      const percentage = (marksObtained / exam.maxMarks) * 100;

      let grade: ExamResult["grade"] = "B";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      else grade = "E";

      examResults.push({
        id: `RES-${exam.id}-${st.id}`,
        examId: exam.id,
        studentId: st.id,
        marksObtained,
        isAbsent,
        grade,
        passed: !isAbsent && marksObtained >= exam.passingMarks,
        remarks: isAbsent ? "Absent during test" : (grade === "A+" ? "Outstanding practical work" : "Satisfactory execution"),
        enteredBy: "Instructor Staff",
        updatedAt: `${exam.examDate}T17:00:00.000Z`,
      });
    });
  });

  // 11. Admission Enquiries (18 enquiries)
  const enquiries: Enquiry[] = [
    {
      id: `ENQ-${year}-0001`,
      applicantName: "Pritam Halder",
      phone: "9830020001",
      email: "pritam.h@example.com",
      interestedCourseId: "CRS-DCA",
      interestedCourseName: "Diploma in Computer Application",
      preferredBatch: "Morning Batch A (DCA)",
      source: "Website",
      followUpDate: format(subDays(now, -1), "yyyy-MM-dd"),
      assignedStaffId: "STF-002",
      message: "Interested in morning DCA batch after higher secondary exams.",
      status: "Interested",
      notes: "Followed up by telephone; confirmed visit this Saturday.",
      submittedAt: subDays(now, 1).toISOString(),
    },
    {
      id: `ENQ-${year}-0002`,
      applicantName: "Swarnali Mukherjee",
      phone: "9830020002",
      interestedCourseId: "CRS-TALLY",
      interestedCourseName: "TallyPrime with GST Billing",
      preferredBatch: "Evening Batch B (Tally)",
      source: "Walk-in",
      followUpDate: format(subDays(now, -2), "yyyy-MM-dd"),
      assignedStaffId: "STF-002",
      message: "Looking for commerce accounting with GST certification.",
      status: "New",
      notes: "Walk-in enquiry; gave course syllabus brochure.",
      submittedAt: subDays(now, 2).toISOString(),
    },
    {
      id: `ENQ-${year}-0003`,
      applicantName: "Rakesh Karmakar",
      phone: "9830020003",
      interestedCourseId: "CRS-DTP",
      interestedCourseName: "Graphic Design & DTP",
      preferredBatch: "Afternoon Batch (DTP)",
      source: "Referral",
      followUpDate: format(subDays(now, -3), "yyyy-MM-dd"),
      assignedStaffId: "STF-002",
      message: "Wants to learn Photoshop and CorelDraw for printing press job.",
      status: "Contacted",
      notes: "Spoke with guardian; demo session scheduled.",
      submittedAt: subDays(now, 3).toISOString(),
    },
    {
      id: `ENQ-${year}-0004`,
      applicantName: "Bishal Pramanik",
      phone: "9830020004",
      interestedCourseId: "CRS-ADCA",
      interestedCourseName: "Advanced Diploma in Computer Application",
      preferredBatch: "Evening Batch A (ADCA)",
      source: "Website",
      message: "Applied online via academy website.",
      status: "Converted",
      notes: "Converted to enrolled student record.",
      submittedAt: subDays(now, 18).toISOString(),
      convertedStudentId: `STU-${year}-0025`,
    },
    {
      id: `ENQ-${year}-0005`,
      applicantName: "Dipayan Samanta",
      phone: "9830020005",
      interestedCourseId: "CRS-WEB",
      interestedCourseName: "Web Designing Fundamentals",
      preferredBatch: "Evening Batch C (Web Design)",
      source: "WhatsApp",
      message: "Interested in front-end HTML/CSS design batch.",
      status: "Converted",
      notes: "Admitted into Web Designing batch.",
      submittedAt: subDays(now, 24).toISOString(),
      convertedStudentId: `STU-${year}-0027`,
    },
    {
      id: `ENQ-${year}-0006`,
      applicantName: "Madhumita Ghosh",
      phone: "9830020006",
      interestedCourseId: "CRS-CCC",
      interestedCourseName: "Basic Computer & Digital Literacy",
      preferredBatch: "Weekend Basic Literacy Batch",
      source: "Website",
      message: "Basic computer course for school student.",
      status: "Converted",
      notes: "Converted to enrolled student.",
      submittedAt: subDays(now, 30).toISOString(),
      convertedStudentId: `STU-${year}-0030`,
    },
  ];

  // 12. Reminder Records
  const reminders: ReminderRecord[] = [
    {
      id: "REM-001",
      studentId: "STU-2026-0002",
      templateType: "Upcoming Due Reminder",
      messageText: "Dear Subhajit Mondal, this is a friendly reminder from SVCA regarding your upcoming course installment of ₹1,200 due on 15th. Kindly arrange payment. Thank you.",
      recipientPhone: "9830000002",
      recordedAt: subDays(now, 2).toISOString(),
      recordedBy: "Priya Sengupta",
      status: "Recorded",
    },
    {
      id: "REM-002",
      studentId: "STU-2026-0004",
      templateType: "Overdue Fee Alert",
      messageText: "Dear Debashis Ghosh, your second installment for Graphic Design & DTP is overdue. Kindly visit the SVCA front desk to settle the pending balance.",
      recipientPhone: "9830000004",
      recordedAt: subDays(now, 5).toISOString(),
      recordedBy: "Sujit Pal",
      status: "Recorded",
    },
  ];

  // 13. Activity Logs (20+ logs)
  const activityLogs: ActivityLog[] = [
    {
      id: "LOG-001",
      action: "FEE_COLLECTION",
      module: "Fees & Billing",
      relatedEntityId: "PAY-2026-00010",
      staffName: "Sujit Pal",
      role: "accountant",
      timestamp: subDays(now, 1).toISOString(),
      description: "Recorded installment payment of ₹1,500 via UPI with receipt generation",
    },
    {
      id: "LOG-002",
      action: "ATTENDANCE_SAVED",
      module: "Attendance",
      relatedEntityId: "BAT-M1",
      staffName: "Debasis Banerjee",
      role: "instructor",
      timestamp: subDays(now, 1).toISOString(),
      description: "Marked daily attendance for Morning Batch A (18 Present, 2 Late)",
    },
    {
      id: "LOG-003",
      action: "CSC_BILL_COMPLETED",
      module: "CSC Billing",
      relatedEntityId: "CSC-TX-2026-00105",
      staffName: "Priya Sengupta",
      role: "receptionist",
      timestamp: subDays(now, 1).toISOString(),
      description: "Completed CSC bill for ₹180 (Online Application + Lamination)",
    },
    {
      id: "LOG-004",
      action: "STUDENT_REGISTERED",
      module: "Students",
      relatedEntityId: "STU-2026-0062",
      staffName: "Priya Sengupta",
      role: "receptionist",
      timestamp: subDays(now, 2).toISOString(),
      description: "Registered new student Anwesha Ganguly for DCA Morning Batch",
    },
    {
      id: "LOG-005",
      action: "EXPENSE_RECORDED",
      module: "Expenses",
      relatedEntityId: "EXP-2026-0035",
      staffName: "Sujit Pal",
      role: "accountant",
      timestamp: subDays(now, 3).toISOString(),
      description: "Recorded commercial broadband internet expense of ₹1,199",
    },
    {
      id: "LOG-006",
      action: "EXAM_PUBLISHED",
      module: "Examinations",
      relatedEntityId: "EXM-001",
      staffName: "Tanmay Mukherjee",
      role: "owner",
      timestamp: subDays(now, 5).toISOString(),
      description: "Published marks and grades for DCA Mid-Term Practical Evaluation",
    },
    {
      id: "LOG-007",
      action: "CERTIFICATE_ISSUED",
      module: "Certificates",
      relatedEntityId: "CRT-2026-0001",
      staffName: "Tanmay Mukherjee",
      role: "owner",
      timestamp: subDays(now, 6).toISOString(),
      description: "Issued course completion certificate for Rituparna Das (DCA)",
    },
    {
      id: "LOG-008",
      action: "DAILY_CLOSING",
      module: "Cashbook",
      relatedEntityId: "CLS-2026-11-24",
      staffName: "Sujit Pal",
      role: "accountant",
      timestamp: subDays(now, 1).toISOString(),
      description: "Completed daily cashbook reconciliation: Expected ₹16,770, Counted ₹16,770 (Diff: 0)",
    },
  ];

  // 14. Website Content Overrides
  const websiteContent: WebsiteContent = {
    announcement: "Admissions open for new career batches. Weekend and evening schedules available.",
    heroHeadline: "Empowering Futures with Practical Computer Education & Citizen Services",
    heroDescription: "Providing career-oriented computer certification courses and official Common Services Centre (CSC) digital assistance in West Bengal.",
    ctaText: "Apply for Admission",
    aboutText: "SVCA Computer Training Academy & CSC Centre is an established institution dedicated to bridging the digital divide.",
    isCustomized: false,
  };

  return {
    courses,
    batches,
    students,
    enrollments,
    attendance,
    feeAccounts,
    installments,
    payments,
    receipts,
    enquiries,
    staff,
    cscServices,
    cscTransactions,
    expenses,
    cashAdjustments,
    dailyClosings,
    exams,
    examResults,
    idCards,
    certificates,
    reminders,
    activityLogs,
    websiteContent,
    settings: {
      tourCompleted: false,
      tourDismissed: false,
      sidebarCollapsed: false,
      activeRole: "owner",
      currency: "INR",
      receiptPrefix: "SVCA-REC",
      cscReceiptPrefix: "CSC-POS",
      studentIdPrefix: "STU",
      lastUpdated: now.toISOString(),
    },
  };
}
