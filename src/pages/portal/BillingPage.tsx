import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  X,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { formatINR, formatIndianDate } from "@/utils/formatters";
import { downloadReceiptPdf } from "@/services/pdfReceiptService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types";

export function BillingPage() {
  const store = useAcademyStore();
  const { students, courses, feeAccounts, receipts, recordPayment } = store;

  const [activeTab, setActiveTab] = useState<"directory" | "history">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>("All");

  // Collect Payment Modal
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(1500);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Cash");
  const [payRef, setPayRef] = useState("");

  const totalAssigned = feeAccounts.reduce((sum, f) => sum + f.totalFees, 0);
  const totalCollected = feeAccounts.reduce((sum, f) => sum + f.totalPaid, 0);
  const totalOutstanding = feeAccounts.reduce((sum, f) => sum + f.outstandingBalance, 0);

  const selectedStudentAccount = feeAccounts.find((fa) => fa.studentId === selectedStudentId);

  const filteredAccounts = feeAccounts.filter((acc) => {
    const student = students.find((s) => s.id === acc.studentId);
    if (!student) return false;

    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedFeeStatus === "All" || acc.status === selectedFeeStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStudentSelectInModal = (stuId: string) => {
    setSelectedStudentId(stuId);
    const acc = feeAccounts.find((fa) => fa.studentId === stuId);
    if (acc) {
      setPayAmount(Math.min(1500, acc.outstandingBalance));
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentAccount || payAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (payAmount > selectedStudentAccount.outstandingBalance) {
      toast.error(`Cannot exceed balance of ₹${selectedStudentAccount.outstandingBalance}`);
      return;
    }

    try {
      const { receipt } = recordPayment({
        studentId: selectedStudentId,
        amount: payAmount,
        method: payMethod,
        paymentDate: new Date().toISOString().slice(0, 10),
        reference: payRef,
      });

      toast.success(`Fee payment recorded! Receipt: ${receipt.receiptNumber}`, {
        description: `Balance updated. Download sample PDF receipt anytime.`,
      });
      setIsCollectModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment submission failed";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider">
            Collections &amp; Invoicing
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#0B2B5B] tracking-tight mt-0.5">
            Billing &amp; Fee Management
          </h1>
        </div>

        <Button
          onClick={() => {
            if (students[0]) handleStudentSelectInModal(students[0].id);
            setIsCollectModalOpen(true);
          }}
          variant="orange"
          size="sm"
          className="font-bold shadow-subtle"
        >
          <CreditCard className="w-4 h-4 mr-1.5" />
          Collect Installment Dues
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            Total Course Fee Commitments
          </span>
          <div className="text-2xl font-extrabold text-[#0B2B5B] tabular-nums font-heading mt-2">
            {formatINR(totalAssigned)}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Cumulative across all active students</div>
        </div>

        <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            Verified Collections Received
          </span>
          <div className="text-2xl font-extrabold text-[#15803D] tabular-nums font-heading mt-2">
            {formatINR(totalCollected)}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{receipts.length} simulated receipts issued</div>
        </div>

        <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            Total Outstanding Balance
          </span>
          <div className="text-2xl font-extrabold text-[#C2410C] tabular-nums font-heading mt-2">
            {formatINR(totalOutstanding)}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Pending student installment dues</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-6 border-b border-[#E2E8F0] text-xs">
        <button
          onClick={() => setActiveTab("directory")}
          className={`pb-3 font-bold transition-colors border-b-2 -mb-px ${
            activeTab === "directory"
              ? "border-[#0754BD] text-[#0754BD]"
              : "border-transparent text-[#64748B] hover:text-[#0B2B5B]"
          }`}
        >
          Student Fee Accounts ({filteredAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 font-bold transition-colors border-b-2 -mb-px ${
            activeTab === "history"
              ? "border-[#0754BD] text-[#0754BD]"
              : "border-transparent text-[#64748B] hover:text-[#0B2B5B]"
          }`}
        >
          All Issued Receipts ({receipts.length})
        </button>
      </div>

      {/* Tab 1: Fee Directory */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Filter by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                />
              </div>
              <div>
                <select
                  value={selectedFeeStatus}
                  onChange={(e) => setSelectedFeeStatus(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                >
                  <option value="All">All Fee Statuses</option>
                  <option value="Fully Paid">Fully Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111827]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Total Fee</th>
                    <th className="py-3 px-4">Paid to Date</th>
                    <th className="py-3 px-4">Outstanding</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredAccounts.map((acc) => {
                    const student = students.find((s) => s.id === acc.studentId);
                    const course = courses.find((c) => c.id === acc.courseId);

                    return (
                      <tr key={acc.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-4">
                          <Link
                            to={`/portal/students/${student?.id}`}
                            className="font-bold text-[#0B2B5B] hover:text-[#0754BD]"
                          >
                            {student?.fullName || acc.studentId}
                          </Link>
                          <div className="text-[10px] text-[#64748B] font-mono">{acc.studentId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#475569]">{course?.code || "Course"}</td>
                        <td className="py-3.5 px-4 tabular-nums font-semibold text-[#111827]">
                          {formatINR(acc.totalFees)}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-[#15803D] font-bold">
                          {formatINR(acc.totalPaid)}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-[#C2410C] font-extrabold">
                          {formatINR(acc.outstandingBalance)}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              acc.status === "Fully Paid"
                                ? "success"
                                : acc.status === "Partially Paid"
                                ? "blue"
                                : acc.status === "Overdue"
                                ? "danger"
                                : "warning"
                            }
                            size="sm"
                          >
                            {acc.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {acc.outstandingBalance > 0 ? (
                            <Button
                              size="xs"
                              variant="orange"
                              className="font-bold"
                              onClick={() => {
                                handleStudentSelectInModal(acc.studentId);
                                setIsCollectModalOpen(true);
                              }}
                            >
                              Collect
                            </Button>
                          ) : (
                            <span className="text-[11px] text-[#15803D] font-semibold">Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Receipts History */}
      {activeTab === "history" && (
        <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt No.</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4 text-right">PDF Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {receipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B2B5B]">
                      {rcpt.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/portal/students/${rcpt.studentId}`}
                        className="font-medium text-[#111827] hover:text-[#0754BD]"
                      >
                        {rcpt.studentName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">{rcpt.courseName}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{formatIndianDate(rcpt.paymentDate)}</td>
                    <td className="py-3.5 px-4 tabular-nums font-bold text-[#15803D]">
                      {formatINR(rcpt.amountReceived)}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">{rcpt.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => downloadReceiptPdf(rcpt)}
                        className="text-[#0754BD] border-[#BFDBFE] hover:bg-[#EFF6FF]"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Collect Student Fee Installment
              </h3>
              <button
                onClick={() => setIsCollectModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Select Enrolled Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelectInModal(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] text-xs bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#64748B] mb-1">
                  Outstanding Due Balance
                </label>
                <div className="p-2.5 bg-[#FFF7ED] text-[#C2410C] font-mono font-bold rounded-md tabular-nums">
                  {formatINR(selectedStudentAccount?.outstandingBalance || 0)}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Received Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedStudentAccount?.outstandingBalance || 50000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] font-mono text-xs focus:ring-2 focus:ring-[#0754BD]/40"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Payment Mode *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] text-xs bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Reference Identifier (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash Memo / UPI Transaction ID"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCollectModalOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm" className="font-bold">
                  Save Payment &amp; Issue Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
