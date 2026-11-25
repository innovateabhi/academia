import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Copy,
  CheckCircle2,
  Calendar,
  Search,
  MessageCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";

export function RemindersPage() {
  const students = useAcademyStore((s) => s.students);
  const courses = useAcademyStore((s) => s.courses);
  const feeAccounts = useAcademyStore((s) => s.feeAccounts);
  const installments = useAcademyStore((s) => s.installments);
  const reminders = useAcademyStore((s) => s.reminders);
  const recordReminder = useAcademyStore((s) => s.recordReminder);

  // Filter students who have outstanding fees
  const dueStudents = feeAccounts
    .filter((fa) => fa.outstandingBalance > 0)
    .map((fa) => {
      const student = students.find((s) => s.id === fa.studentId);
      const course = courses.find((c) => c.id === fa.courseId);
      const nextInst = installments.find(
        (i) => i.studentId === fa.studentId && i.status !== "Paid"
      );
      return {
        feeAccount: fa,
        student,
        course,
        nextInst,
      };
    })
    .filter((item) => item.student !== undefined);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    dueStudents[0]?.student?.id || ""
  );
  const [templateType, setTemplateType] = useState<string>("Upcoming Due");
  const [customNotes, setCustomNotes] = useState("");

  const selectedItem =
    dueStudents.find((d) => d.student?.id === selectedStudentId) || dueStudents[0];

  // Dynamic template text generator
  const getTemplateText = () => {
    if (!selectedItem?.student) return "";
    const stName = selectedItem.student.fullName;
    const academyName = businessConfig.identity.name;
    const amount = formatIndianCurrency(selectedItem.feeAccount.outstandingBalance);
    const dueDate = formatIndianDate(
      selectedItem.nextInst?.dueDate || selectedItem.feeAccount.nextDueDate || "2026-12-05"
    );
    const course = selectedItem.course?.name || "Computer Training Course";

    if (templateType === "Upcoming Due") {
      return `Dear ${stName},\n\nThis is a friendly reminder from ${academyName} regarding your upcoming course fee installment of ${amount} for ${course}, due on ${dueDate}.\n\nKindly arrange the payment at the front desk or via UPI to ensure uninterrupted practical lab classes.\n\nThank you,\n${businessConfig.identity.shortName} Admissions Desk\nPh: ${businessConfig.contact.phoneDisplay}`;
    } else if (templateType === "Overdue Alert") {
      return `URGENT NOTICE\n\nDear ${stName},\n\nOur accounts records show that your course fee balance of ${amount} for ${course} is currently OVERDUE.\n\nPlease visit the SVCA counter immediately or contact us at ${businessConfig.contact.phoneDisplay} to settle the pending balance.\n\nRegards,\nAccounts Department\n${academyName}`;
    } else {
      return `Dear ${stName},\n\nGreetings from ${academyName}. We hope you are enjoying your practical classes for ${course}. This is to update you that your current remaining course fee balance is ${amount}.\n\nFeel free to contact us for payment receipts or installment queries.\n\nBest regards,\n${businessConfig.identity.shortName}`;
    }
  };

  const messageText = getTemplateText();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    toast.success("Reminder message copied to clipboard!");
  };

  const handleLogReminder = () => {
    if (!selectedItem?.student) return;
    recordReminder(
      selectedItem.student.id,
      templateType,
      messageText,
      selectedItem.student.phone
    );
    toast.success(`Reminder logged for ${selectedItem.student.fullName}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            WhatsApp Fee Reminders &amp; Alerts
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Personalized installment due notices with dynamic placeholder merging and 1-click clipboard drafts.
          </p>
        </div>

        <Badge variant="orange" size="lg">
          {dueStudents.length} Students with Pending Dues
        </Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Outstanding Fee Students (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-subtle space-y-3">
          <div className="font-bold text-xs text-[#0B2B5B] font-heading uppercase tracking-wider mb-1">
            Pending Fee Ledger Accounts
          </div>

          <div className="overflow-y-auto max-h-[550px] space-y-2 pr-1">
            {dueStudents.map((item) => {
              const isSelected = item.student?.id === selectedStudentId;
              const hasRecentRem = reminders.some(
                (r) => r.studentId === item.student?.id
              );

              return (
                <button
                  key={item.student?.id}
                  onClick={() => setSelectedStudentId(item.student?.id || "")}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-[#EFF6FF] border-[#0754BD] shadow-subtle"
                      : "bg-white border-[#F1F5F9] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#111827]">
                      {item.student?.fullName}
                    </span>
                    <span className="font-bold font-mono text-xs text-rose-600">
                      {formatIndianCurrency(item.feeAccount.outstandingBalance)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] flex justify-between">
                    <span>{item.course?.code} • {item.student?.phone}</span>
                    {hasRecentRem && (
                      <span className="text-[10px] text-emerald-700 font-semibold">Reminded</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Message Composer & Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Draft Message for: {selectedItem?.student?.fullName}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Mobile: {selectedItem?.student?.phone} | Pending Due:{" "}
                <strong className="text-rose-600 font-mono">
                  {formatIndianCurrency(selectedItem?.feeAccount?.outstandingBalance || 0)}
                </strong>
              </p>
            </div>

            {/* Template Selector */}
            <div className="flex gap-1.5">
              {["Upcoming Due", "Overdue Alert", "General Balance"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTemplateType(type)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    templateType === type
                      ? "bg-[#0B2B5B] text-white border-[#0B2B5B]"
                      : "bg-slate-50 text-[#64748B] border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Preview Screen Frame */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#E5DDD5] p-4 shadow-inner">
            <div className="bg-white rounded-lg p-3.5 shadow text-xs text-[#111827] max-w-lg space-y-2 whitespace-pre-wrap font-sans leading-relaxed border-l-4 border-emerald-500">
              {messageText}
            </div>
            <div className="text-[10px] text-[#64748B] mt-2 flex items-center justify-between">
              <span>Ready for copy &amp; paste into WhatsApp Web or Business App</span>
              <span className="font-mono">Character Count: {messageText.length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-[#64748B]">
              *Demo Safe: No real WhatsApp messages are dispatched automatically.
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyMessage}>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Message
              </Button>
              <Button size="sm" variant="orange" onClick={handleLogReminder}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Log as Reminded
              </Button>
            </div>
          </div>

          {/* Recent Reminder Logs */}
          <div className="border-t border-[#F1F5F9] pt-4 mt-4">
            <h4 className="font-bold text-xs text-[#0B2B5B] uppercase tracking-wider mb-2">
              Recent Reminder Audit Trail
            </h4>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              {reminders.slice(0, 3).map((r) => {
                const st = students.find((s) => s.id === r.studentId);
                return (
                  <div
                    key={r.id}
                    className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span>
                      Drafted <strong>{r.templateType}</strong> for{" "}
                      <strong className="text-[#111827]">{st?.fullName || r.studentId}</strong>
                    </span>
                    <span className="text-[10px] font-mono">{formatIndianDate(r.recordedAt.slice(0, 10))}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
