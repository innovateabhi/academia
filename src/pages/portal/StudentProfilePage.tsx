import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Receipt,
  Download,
  CreditCard,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { computeStudentAttendanceStats } from "@/store/selectors";
import { formatINR, formatIndianDate } from "@/utils/formatters";
import { downloadReceiptPdf } from "@/services/pdfReceiptService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { StudentStatus, PaymentMethod } from "@/types";

export function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const store = useAcademyStore();
  const {
    students,
    courses,
    batches,
    feeAccounts,
    installments,
    receipts,
    attendance,
    updateStudent,
    recordPayment,
  } = store;

  const student = students.find((s) => s.id === id);
  const course = courses.find((c) => c.id === student?.courseId);
  const batch = batches.find((b) => b.id === student?.batchId);
  const feeAccount = feeAccounts.find((fa) => fa.studentId === student?.id);
  const studentInstallments = installments.filter((i) => i.studentId === student?.id);
  const studentReceipts = receipts.filter((r) => r.studentId === student?.id);
  const attendanceStats = computeStudentAttendanceStats(student?.id || "", attendance);

  // Quick Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(
    feeAccount ? Math.min(1500, feeAccount.outstandingBalance) : 0
  );
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Cash");
  const [payRef, setPayRef] = useState("");

  // Edit Student Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(student?.fullName || "");
  const [editPhone, setEditPhone] = useState(student?.phone || "");
  const [editGuardian, setEditGuardian] = useState(student?.guardianName || "");
  const [editAddress, setEditAddress] = useState(student?.address || "");
  const [editStatus, setEditStatus] = useState<StudentStatus>(student?.status || "Active");
  const [editBatchId, setEditBatchId] = useState(student?.batchId || "");

  if (!student) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-base font-bold text-[#0B2B5B]">Student Record Not Found</div>
        <Link to="/portal/students">
          <Button size="sm" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Student Directory
          </Button>
        </Link>
      </div>
    );
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeAccount || payAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    if (payAmount > feeAccount.outstandingBalance) {
      toast.error(`Cannot exceed outstanding balance of ₹${feeAccount.outstandingBalance}`);
      return;
    }

    try {
      const { receipt } = recordPayment({
        studentId: student.id,
        amount: payAmount,
        method: payMethod,
        paymentDate: new Date().toISOString().slice(0, 10),
        reference: payRef,
      });

      toast.success(`Payment of ₹${payAmount} recorded! Receipt: ${receipt.receiptNumber}`);
      setIsPayModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment error";
      toast.error(msg);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateStudent(student.id, {
        fullName: editName,
        phone: editPhone,
        email: student.email,
        guardianName: editGuardian,
        dateOfBirth: student.dateOfBirth,
        address: editAddress,
        courseId: student.courseId,
        batchId: editBatchId,
        status: editStatus,
      });

      toast.success("Student profile updated successfully");
      setIsEditModalOpen(false);
    } catch {
      toast.error("Failed to update student profile");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Context Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link to="/portal/students">
            <Button size="xs" variant="outline" className="h-8 px-2.5">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading text-[#0B2B5B] tracking-tight">
                {student.fullName}
              </h1>
              <Badge
                variant={
                  student.status === "Active"
                    ? "success"
                    : student.status === "Completed"
                    ? "default"
                    : "neutral"
                }
                size="sm"
              >
                {student.status}
              </Badge>
            </div>
            <div className="text-xs text-[#64748B] font-mono mt-0.5">
              ID: {student.id} • Enrolled {formatIndianDate(student.admissionDate)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit Profile
          </Button>

          {feeAccount && feeAccount.outstandingBalance > 0 && (
            <Button
              size="sm"
              variant="orange"
              className="font-bold"
              onClick={() => {
                setPayAmount(Math.min(1500, feeAccount.outstandingBalance));
                setIsPayModalOpen(true);
              }}
            >
              <CreditCard className="w-3.5 h-3.5 mr-1" />
              Collect Dues
            </Button>
          )}
        </div>
      </div>

      {/* Grid: Personal Bio + Attendance + Fee Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Col 1: Bio */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-card space-y-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9]">
            Personal Information
          </h3>
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Contact Mobile</span>
            <span className="font-mono font-bold text-[#111827]">{student.phone}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Guardian Name</span>
            <span className="font-semibold text-[#111827]">{student.guardianName}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Date of Birth</span>
            <span className="text-[#111827]">{formatIndianDate(student.dateOfBirth)}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Enrolled Course</span>
            <span className="font-bold text-[#0754BD]">{course?.name}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <span className="text-[#64748B]">Assigned Batch</span>
            <span className="text-[#111827]">{batch?.name} ({batch?.timing})</span>
          </div>
          <div className="py-1">
            <span className="text-[#64748B] block mb-0.5">Address</span>
            <span className="text-[#111827] leading-relaxed">{student.address}</span>
          </div>
        </div>

        {/* Col 2: Attendance */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9] mb-4">
              Attendance Summary
            </h3>

            <div className="p-4 rounded-lg bg-[#F8FAFC] text-center mb-4">
              <div className="text-3xl font-extrabold text-[#0B2B5B] font-heading tabular-nums">
                {attendanceStats.percentage !== null ? `${attendanceStats.percentage}%` : "—"}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5 font-medium">Overall Attendance Rate</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                <span className="font-bold text-sm block">{attendanceStats.present}</span>
                <span className="text-[10px]">Days Present</span>
              </div>
              <div className="p-2.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                <span className="font-bold text-sm block">{attendanceStats.absent}</span>
                <span className="text-[10px]">Days Absent</span>
              </div>
              <div className="p-2.5 rounded bg-[#EFF6FF] text-[#0754BD] border border-[#BFDBFE]">
                <span className="font-bold text-sm block">{attendanceStats.late}</span>
                <span className="text-[10px]">Late Arrivals</span>
              </div>
              <div className="p-2.5 rounded bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                <span className="font-bold text-sm block">{attendanceStats.leave}</span>
                <span className="text-[10px]">Leaves Approved</span>
              </div>
            </div>
          </div>

          <Link to="/portal/attendance" className="block pt-4">
            <Button size="xs" variant="outline" className="w-full">
              View Batch Attendance Roster
            </Button>
          </Link>
        </div>

        {/* Col 3: Fee Health */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9] mb-4">
              Fee Ledger Status
            </h3>

            {feeAccount && (
              <div className="p-4 rounded-lg bg-[#F8FAFC] space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Total Course Fee:</span>
                  <span className="font-bold text-[#111827] tabular-nums">{formatINR(feeAccount.totalFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Verified Paid:</span>
                  <span className="font-bold text-[#15803D] tabular-nums">{formatINR(feeAccount.totalPaid)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E2E8F0] text-sm">
                  <span className="font-bold text-[#0B2B5B]">Outstanding Due:</span>
                  <span className="font-extrabold text-[#C2410C] tabular-nums">
                    {formatINR(feeAccount.outstandingBalance)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#64748B]">Account Status:</span>
              <Badge
                variant={
                  feeAccount?.status === "Fully Paid"
                    ? "success"
                    : feeAccount?.status === "Partially Paid"
                    ? "blue"
                    : "warning"
                }
              >
                {feeAccount?.status}
              </Badge>
            </div>
          </div>

          {feeAccount && feeAccount.outstandingBalance > 0 && (
            <Button
              size="sm"
              variant="orange"
              onClick={() => {
                setPayAmount(Math.min(1500, feeAccount.outstandingBalance));
                setIsPayModalOpen(true);
              }}
              className="w-full mt-4 font-bold"
            >
              Collect Due Installment
            </Button>
          )}
        </div>
      </div>

      {/* Installments & Payment Receipts History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Installment Breakdown */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-card">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9] mb-4">
            Installment Schedule Breakdown
          </h3>

          <div className="space-y-2.5">
            {studentInstallments.map((inst) => (
              <div
                key={inst.id}
                className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0B2B5B]">Installment #{inst.installmentNumber}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Due Date: {formatIndianDate(inst.dueDate)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#111827] tabular-nums">
                    {formatINR(inst.amountDue)}
                  </div>
                  <Badge
                    variant={
                      inst.status === "Paid"
                        ? "success"
                        : inst.status === "Partial"
                        ? "blue"
                        : inst.status === "Overdue"
                        ? "danger"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {inst.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Receipts History */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-card">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9] mb-4">
            Payment Receipts History
          </h3>

          <div className="space-y-2.5">
            {studentReceipts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#94A3B8]">
                No payment receipts issued yet.
              </div>
            ) : (
              studentReceipts.map((rcpt) => (
                <div
                  key={rcpt.id}
                  className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold font-mono text-[#0B2B5B]">{rcpt.receiptNumber}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {formatIndianDate(rcpt.paymentDate)} via {rcpt.paymentMethod}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div className="font-bold text-[#15803D] tabular-nums">
                        {formatINR(rcpt.amountReceived)}
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        Bal: {formatINR(rcpt.remainingBalance)}
                      </div>
                    </div>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => downloadReceiptPdf(rcpt)}
                      className="text-[#0754BD]"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Record Student Fee Payment
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#64748B] mb-1">
                  Outstanding Due Balance
                </label>
                <div className="p-2.5 bg-[#FFF7ED] text-[#C2410C] font-mono font-bold rounded-lg tabular-nums">
                  {formatINR(feeAccount?.outstandingBalance || 0)}
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
                  max={feeAccount?.outstandingBalance || 100000}
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
                  Reference Note (Optional)
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
                  onClick={() => setIsPayModalOpen(false)}
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Edit Student Information
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Guardian Name</label>
                <input
                  type="text"
                  required
                  value={editGuardian}
                  onChange={(e) => setEditGuardian(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Assigned Batch</label>
                <select
                  value={editBatchId}
                  onChange={(e) => setEditBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.timing})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Student Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as StudentStatus)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="navy" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
