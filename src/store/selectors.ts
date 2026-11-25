import { format, subMonths } from "date-fns";
import type { AcademyStoreState } from "@/store/useAcademyStore";
import { formatMonthLabel, todayISO } from "@/utils/formatters";

export interface DashboardMetrics {
  activeStudentsCount: number;
  totalStudentsCount: number;
  todayPresentCount: number;
  todayMarkedCount: number;
  todayAttendanceRate: number;
  monthlyCollection: number;
  totalCollected: number;
  totalOutstanding: number;
  totalAssignedFees: number;
  overdueAccountsCount: number;
  pendingEnquiriesCount: number;
}

export function computeDashboardMetrics(state: AcademyStoreState, referenceDate = new Date()): DashboardMetrics {
  const todayStr = format(referenceDate, "yyyy-MM-dd");
  const currentMonthPrefix = format(referenceDate, "yyyy-MM");

  const activeStudents = state.students.filter((s) => s.status === "Active");
  const todayRecords = state.attendance.filter((a) => a.date === todayStr);
  const todayPresentCount = todayRecords.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;
  const todayMarkedCount = todayRecords.length;
  const todayAttendanceRate =
    todayMarkedCount > 0 ? Math.round((todayPresentCount / todayMarkedCount) * 100) : 0;

  const monthlyCollection = state.payments
    .filter((p) => p.paymentDate.startsWith(currentMonthPrefix))
    .reduce((sum, p) => sum + p.amount, 0);

  const totalAssignedFees = state.feeAccounts.reduce((sum, f) => sum + f.totalFees, 0);
  const totalCollected = state.feeAccounts.reduce((sum, f) => sum + f.totalPaid, 0);
  const totalOutstanding = state.feeAccounts.reduce((sum, f) => sum + f.outstandingBalance, 0);
  const overdueAccountsCount = state.feeAccounts.filter((f) => f.status === "Overdue").length;

  const pendingEnquiriesCount = state.enquiries.filter(
    (e) => e.status === "New" || e.status === "Contacted" || e.status === "Interested"
  ).length;

  return {
    activeStudentsCount: activeStudents.length,
    totalStudentsCount: state.students.length,
    todayPresentCount,
    todayMarkedCount,
    todayAttendanceRate,
    monthlyCollection,
    totalCollected,
    totalOutstanding,
    totalAssignedFees,
    overdueAccountsCount,
    pendingEnquiriesCount,
  };
}

export function computeSixMonthCollectionSeries(
  state: AcademyStoreState,
  referenceDate = new Date()
): Array<{ month: string; label: string; amount: number }> {
  const series: Array<{ month: string; label: string; amount: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const dt = subMonths(referenceDate, i);
    const ym = format(dt, "yyyy-MM");
    const amount = state.payments
      .filter((p) => p.paymentDate.startsWith(ym))
      .reduce((sum, p) => sum + p.amount, 0);
    series.push({
      month: ym,
      label: formatMonthLabel(ym),
      amount,
    });
  }
  return series;
}

export function computeStudentAttendanceStats(
  studentId: string,
  attendance: AcademyStoreState["attendance"]
) {
  const records = attendance.filter((a) => a.studentId === studentId);
  const totalMarked = records.length;
  const present = records.filter((a) => a.status === "Present").length;
  const late = records.filter((a) => a.status === "Late").length;
  const absent = records.filter((a) => a.status === "Absent").length;
  const leave = records.filter((a) => a.status === "Leave").length;
  const percentage =
    totalMarked > 0 ? Math.round(((present + late) / totalMarked) * 100) : null;

  return {
    totalMarked,
    present,
    late,
    absent,
    leave,
    percentage,
  };
}

export function computeTodayAttendanceBreakdown(state: AcademyStoreState, dateStr = todayISO()) {
  const records = state.attendance.filter((a) => a.date === dateStr);
  return {
    present: records.filter((r) => r.status === "Present").length,
    late: records.filter((r) => r.status === "Late").length,
    absent: records.filter((r) => r.status === "Absent").length,
    leave: records.filter((r) => r.status === "Leave").length,
    totalMarked: records.length,
  };
}
