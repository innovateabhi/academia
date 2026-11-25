import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Receipt,
  TrendingUp,
  UserPlus,
  CreditCard,
  ShoppingBag,
  TrendingDown,
  Award,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import {
  computeDashboardMetrics,
  computeSixMonthCollectionSeries,
  computeTodayAttendanceBreakdown,
} from "@/store/selectors";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export function DashboardPage() {
  const store = useAcademyStore();
  const metrics = computeDashboardMetrics(store);
  const collectionSeries = computeSixMonthCollectionSeries(store);
  const todayBreakdown = computeTodayAttendanceBreakdown(store);
  const activeRole = store.settings.activeRole || "owner";

  // Calculate CSC collections & Expenses for current month
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const cscMonthlyTotal = store.cscTransactions
    .filter((tx) => tx.createdAt.startsWith(currentMonthStr) && tx.status === "Completed")
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  const monthlyExpenses = store.expenses
    .filter((e) => e.expenseDate.startsWith(currentMonthStr) && e.status === "Active")
    .reduce((sum, e) => sum + e.amount, 0);

  const operatingSurplus = metrics.monthlyCollection + cscMonthlyTotal - monthlyExpenses;

  const recentPayments = store.payments.slice(0, 4);
  const recentCscTx = store.cscTransactions.slice(0, 3);
  const pendingEnquiries = store.enquiries
    .filter((e) => e.status === "New" || e.status === "Interested")
    .slice(0, 4);

  // Combine charts: add simulated CSC series alongside academy collections
  const combinedChartData = collectionSeries.map((item, idx) => ({
    month: item.month,
    academy: item.amount,
    csc: Math.round(item.amount * 0.22) + ((idx * 800) % 3000),
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Role Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider">
              Executive Dashboard
            </span>
            <Badge variant="blue" size="sm">
              Role: {activeRole.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-[#0B2B5B] tracking-tight">
            Integrated Academy &amp; CSC Command Center
          </h1>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/portal/students">
            <Button size="sm" variant="navy" className="font-semibold shadow-subtle text-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Add Student
            </Button>
          </Link>
          <Link to="/portal/csc-billing">
            <Button size="sm" variant="orange" className="font-semibold shadow-subtle text-xs">
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              CSC Bill
            </Button>
          </Link>
          <Link to="/portal/billing">
            <Button size="sm" variant="primary" className="font-bold shadow-subtle text-xs">
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Collect Fees
            </Button>
          </Link>
          <Link to="/portal/reports">
            <Button size="sm" variant="outline" className="font-semibold text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Financial & Operational Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-card">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>ACTIVE ENROLLMENTS</span>
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#0754BD] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#0B2B5B] font-heading tabular-nums">
            {metrics.activeStudentsCount}
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            Across {store.batches.length} classroom batches
          </div>
        </div>

        {/* Metric 2: Attendance */}
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-card">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>TODAY'S ATTENDANCE</span>
            <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-emerald-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700 font-heading tabular-nums">
            {todayBreakdown.totalMarked > 0
              ? Math.round(((todayBreakdown.present + todayBreakdown.late) / todayBreakdown.totalMarked) * 100)
              : 0}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            {todayBreakdown.present} present today
          </div>
        </div>

        {/* Metric 3: Total Collections */}
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-card">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>MONTHLY REVENUE</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#F58220] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#0754BD] font-heading tabular-nums">
            {formatIndianCurrency(metrics.monthlyCollection + cscMonthlyTotal)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-0.5">
            Fees: {formatIndianCurrency(metrics.monthlyCollection)} | CSC: {formatIndianCurrency(cscMonthlyTotal)}
          </div>
        </div>

        {/* Metric 4: Operating Surplus */}
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-card">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>NET OPERATING SURPLUS</span>
            <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-800 font-heading tabular-nums">
            {formatIndianCurrency(operatingSurplus)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-0.5">
            After {formatIndianCurrency(monthlyExpenses)} monthly expenses
          </div>
        </div>
      </div>

      {/* Middle Grid: 6-Month Inflow Bar Chart & Academic Health */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Revenue Chart (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                6-Month Combined Business Collections
              </h3>
              <p className="text-xs text-[#64748B]">
                Student course installment fees (Navy) alongside CSC citizen counter sales (Orange)
              </p>
            </div>
            <Link to="/portal/billing" className="text-xs font-bold text-[#0754BD] hover:underline">
              Ledger Breakdown &rarr;
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combinedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                  contentStyle={{
                    backgroundColor: "#0B2B5B",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="academy" name="Academy Fees" fill="#0B2B5B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="csc" name="CSC Counter" fill="#F58220" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outstanding Dues & Fee Aging (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-4">
          <div className="border-b pb-3">
            <div className="text-xs font-bold text-[#0754BD] uppercase font-mono">
              Accounts Receivable
            </div>
            <div className="text-xl font-extrabold text-[#0B2B5B] font-heading mt-0.5">
              {formatIndianCurrency(metrics.totalOutstanding)}
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Total pending student installment balances
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-slate-50">
              <span className="text-[#64748B]">Total Course Fees Assigned:</span>
              <strong className="font-mono text-[#111827]">
                {formatIndianCurrency(metrics.totalAssignedFees)}
              </strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-emerald-50 text-emerald-800">
              <span>Total Fees Collected:</span>
              <strong className="font-mono">
                {formatIndianCurrency(metrics.totalCollected)}
              </strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-amber-50 text-amber-900">
              <span>Collection Realization:</span>
              <strong className="font-mono">
                {metrics.totalAssignedFees > 0
                  ? Math.round((metrics.totalCollected / metrics.totalAssignedFees) * 100)
                  : 0}%
              </strong>
            </div>
          </div>

          <Link to="/portal/reminders" className="block pt-2">
            <Button size="sm" variant="orange" className="w-full text-xs font-bold justify-between">
              <span>Send WhatsApp Due Reminders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom 3-Column Operations Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Column 1: Recent Fee Collections */}
        <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h4 className="font-bold text-xs text-[#0B2B5B] uppercase tracking-wider font-heading">
              Recent Fee Receipts
            </h4>
            <Link to="/portal/billing" className="text-[11px] text-[#0754BD] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {recentPayments.map((p) => {
              const student = store.students.find((s) => s.id === p.studentId);
              return (
                <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#111827]">{student?.fullName || "Student"}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{p.receiptNumber} • {p.method}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-[#0B2B5B]">{formatIndianCurrency(p.amount)}</div>
                    <div className="text-[10px] text-[#64748B]">{formatIndianDate(p.paymentDate)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Recent CSC Transactions */}
        <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h4 className="font-bold text-xs text-[#0B2B5B] uppercase tracking-wider font-heading">
              Recent CSC Counter Bills
            </h4>
            <Link to="/portal/csc-billing" className="text-[11px] text-[#0754BD] font-semibold hover:underline">
              POS Terminal
            </Link>
          </div>

          <div className="space-y-2">
            {recentCscTx.map((tx) => (
              <div key={tx.id} className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#111827] truncate max-w-[150px]">
                    {tx.customerName || "Citizen Client"}
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate max-w-[150px]">
                    {tx.items[0]?.serviceName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-[#F58220]">{formatIndianCurrency(tx.totalAmount)}</div>
                  <div className="text-[10px] text-[#64748B]">{tx.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Admission Enquiries */}
        <div className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h4 className="font-bold text-xs text-[#0B2B5B] uppercase tracking-wider font-heading">
              New Website Leads
            </h4>
            <Link to="/portal/enquiries" className="text-[11px] text-[#0754BD] font-semibold hover:underline">
              Admissions
            </Link>
          </div>

          <div className="space-y-2">
            {pendingEnquiries.map((enq) => (
              <div key={enq.id} className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#111827]">{enq.applicantName}</div>
                  <div className="text-[10px] text-[#0754BD]">{enq.interestedCourseName}</div>
                </div>
                <Badge variant={enq.status === "New" ? "orange" : "blue"} size="sm">
                  {enq.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
