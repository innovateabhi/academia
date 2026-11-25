import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Building,
  Laptop,
} from "lucide-react";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { businessConfig } from "@/config/business.config";

export function DailyCashbookPage() {
  const payments = useAcademyStore((s) => s.payments);
  const cscTransactions = useAcademyStore((s) => s.cscTransactions);
  const expenses = useAcademyStore((s) => s.expenses);
  const cashAdjustments = useAcademyStore((s) => s.cashAdjustments);
  const dailyClosings = useAcademyStore((s) => s.dailyClosings);
  const addCashAdjustment = useAcademyStore((s) => s.addCashAdjustment);
  const saveDailyClosing = useAcademyStore((s) => s.saveDailyClosing);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [closingModalOpen, setClosingModalOpen] = useState(false);

  // Adjustment state
  const [adjType, setAdjType] = useState<any>("Cash Added");
  const [adjAmount, setAdjAmount] = useState<number>(1000);
  const [adjReason, setAdjReason] = useState("");

  // Closing state
  const [actualCountedCash, setActualCountedCash] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState("");

  // Calculate movements for selected date
  const academyCash = payments
    .filter((p) => p.paymentDate === selectedDate && p.method === "Cash")
    .reduce((sum, p) => sum + p.amount, 0);

  const academyDigital = payments
    .filter((p) => p.paymentDate === selectedDate && p.method !== "Cash")
    .reduce((sum, p) => sum + p.amount, 0);

  const cscCash = cscTransactions
    .filter(
      (tx) =>
        tx.createdAt.slice(0, 10) === selectedDate &&
        tx.paymentMethod === "Cash" &&
        tx.status === "Completed"
    )
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  const cscDigital = cscTransactions
    .filter(
      (tx) =>
        tx.createdAt.slice(0, 10) === selectedDate &&
        tx.paymentMethod !== "Cash" &&
        tx.status === "Completed"
    )
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  const cashOutflow = expenses
    .filter(
      (e) =>
        e.expenseDate === selectedDate &&
        e.paymentMethod === "Cash" &&
        e.status === "Active"
    )
    .reduce((sum, e) => sum + e.amount, 0);

  const adjustmentsToday = cashAdjustments.filter((a) => a.date === selectedDate);
  const netAdjustment = adjustmentsToday.reduce((sum, a) => {
    if (a.type === "Cash Added" || a.type === "Opening Balance") return sum + a.amount;
    return sum - a.amount;
  }, 0);

  const openingCashBalance = 15000; // Simulated opening baseline
  const expectedClosingCash =
    openingCashBalance + academyCash + cscCash - cashOutflow + netAdjustment;

  const existingClosing = dailyClosings.find((c) => c.date === selectedDate);

  const handleAddAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjReason || adjAmount <= 0) {
      toast.error("Please specify an amount and reason.");
      return;
    }
    addCashAdjustment({
      date: selectedDate,
      type: adjType,
      amount: Number(adjAmount),
      reason: adjReason,
      recordedBy: "Accounts Officer",
    });
    toast.success(`Cash adjustment of ${formatIndianCurrency(adjAmount)} recorded`);
    setAdjustModalOpen(false);
    setAdjReason("");
  };

  const handleSaveClosing = (e: React.FormEvent) => {
    e.preventDefault();
    const diff = actualCountedCash - expectedClosingCash;
    saveDailyClosing({
      date: selectedDate,
      openingCash: openingCashBalance,
      academyCashCollections: academyCash,
      cscCashCollections: cscCash,
      cashExpenses: cashOutflow,
      cashAdjustments: netAdjustment,
      expectedCash: expectedClosingCash,
      actualCountedCash,
      difference: diff,
      notes: closingNotes || (diff === 0 ? "Cash drawer verified" : "Discrepancy noted"),
      closedBy: "Accounts Officer",
      status: "Closed",
    });
    toast.success("Daily cash drawer closed successfully");
    setClosingModalOpen(false);
  };

  const handleDownloadClosingPdf = (closing: typeof dailyClosings[0]) => {
    const doc = new jsPDF();
    doc.setFillColor(11, 43, 91);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(businessConfig.identity.name, 105, 12, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(245, 130, 32);
    doc.text(`Daily Cash Drawer Closing Report — ${formatIndianDate(closing.date)}`, 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 38,
      head: [["Financial Component", "Amount (INR)"]],
      body: [
        ["Opening Drawer Cash", `Rs. ${closing.openingCash}`],
        ["Academy Student Cash Collections", `+ Rs. ${closing.academyCashCollections}`],
        ["CSC Digital Counter Cash Collections", `+ Rs. ${closing.cscCashCollections}`],
        ["Cash Expenses Recorded", `- Rs. ${closing.cashExpenses}`],
        ["Manual Cash Adjustments", `Rs. ${closing.cashAdjustments}`],
        ["Expected Drawer Cash Balance", `Rs. ${closing.expectedCash}`],
        ["Actual Physically Counted Cash", `Rs. ${closing.actualCountedCash}`],
        ["Cash Difference / Discrepancy", `Rs. ${closing.difference}`],
        ["Closing Status", closing.status],
        ["Closed By Staff", closing.closedBy],
      ],
      theme: "striped",
      headStyles: { fillColor: [11, 43, 91] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 130;
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text("DEMO DOCUMENT — INTERNAL CASHBOOK AUDIT SUMMARY", 105, finalY + 15, { align: "center" });

    doc.save(`CashClosing-${closing.date}.pdf`);
    toast.success("Daily Closing PDF downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Daily Cashbook &amp; Drawer Reconciler
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time physical currency tracking, digital reconciliation, drawer audit, and daily closing sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-xs bg-white text-[#111827] font-semibold"
          />

          <Button size="sm" variant="outline" onClick={() => setAdjustModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Adjust Cash
          </Button>

          <Button
            size="sm"
            variant="orange"
            onClick={() => {
              setActualCountedCash(expectedClosingCash);
              setClosingModalOpen(true);
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {existingClosing ? "Review Closing" : "Perform Daily Closing"}
          </Button>
        </div>
      </div>

      {/* Primary Drawer Cash Reconciliation Strip */}
      <div className="bg-gradient-to-r from-[#0B2B5B] to-[#08234A] rounded-xl text-white p-6 shadow-elevated">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-[#F58220] text-xs font-bold uppercase tracking-wider font-mono">
              Physical Drawer Balance
            </span>
            <div className="text-3xl font-extrabold font-heading mt-1">
              {formatIndianCurrency(expectedClosingCash)}
            </div>
            <p className="text-blue-200 text-xs mt-0.5">
              Target closing cash in register for {formatIndianDate(selectedDate)}
            </p>
          </div>

          {existingClosing && (
            <Badge variant="success" size="lg" className="border border-emerald-400">
              Drawer Reconciled &amp; Closed
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-5 border-t border-blue-900/60 text-xs">
          <div>
            <div className="text-blue-200">Opening Balance</div>
            <div className="font-bold text-sm text-white font-mono mt-0.5">
              {formatIndianCurrency(openingCashBalance)}
            </div>
          </div>
          <div>
            <div className="text-emerald-300">+ Academy Fees</div>
            <div className="font-bold text-sm text-white font-mono mt-0.5">
              {formatIndianCurrency(academyCash)}
            </div>
          </div>
          <div>
            <div className="text-emerald-300">+ CSC Services</div>
            <div className="font-bold text-sm text-white font-mono mt-0.5">
              {formatIndianCurrency(cscCash)}
            </div>
          </div>
          <div>
            <div className="text-rose-300">- Cash Expenses</div>
            <div className="font-bold text-sm text-white font-mono mt-0.5">
              {formatIndianCurrency(cashOutflow)}
            </div>
          </div>
          <div>
            <div className="text-amber-300">+/- Adjustments</div>
            <div className="font-bold text-sm text-white font-mono mt-0.5">
              {formatIndianCurrency(netAdjustment)}
            </div>
          </div>
        </div>
      </div>

      {/* Non-Cash Digital Collections (UPI & Bank Transfer) */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#0754BD] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B]">Digital Academy Collections (UPI/Bank)</div>
              <div className="text-lg font-bold text-[#0B2B5B] font-mono">
                {formatIndianCurrency(academyDigital)}
              </div>
            </div>
          </div>
          <Badge variant="blue">Direct to Bank</Badge>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F58220] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#64748B]">Digital CSC Counter Collections (UPI)</div>
              <div className="text-lg font-bold text-[#0B2B5B] font-mono">
                {formatIndianCurrency(cscDigital)}
              </div>
            </div>
          </div>
          <Badge variant="orange">Direct to UPI</Badge>
        </div>
      </div>

      {/* Historical Closings Summary Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
            Past Daily Drawer Closing Records
          </h3>
          <span className="text-xs text-[#64748B]">Audited daily reconciliations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b text-[#64748B]">
                <th className="p-3">Date</th>
                <th className="p-3">Opening Cash</th>
                <th className="p-3">Cash Inflow</th>
                <th className="p-3">Cash Outflow</th>
                <th className="p-3">Expected Balance</th>
                <th className="p-3">Counted Balance</th>
                <th className="p-3">Discrepancy</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {dailyClosings.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-[#0B2B5B]">{formatIndianDate(c.date)}</td>
                  <td className="p-3 font-mono">{formatIndianCurrency(c.openingCash)}</td>
                  <td className="p-3 font-mono text-emerald-700">
                    +{formatIndianCurrency(c.academyCashCollections + c.cscCashCollections)}
                  </td>
                  <td className="p-3 font-mono text-rose-600">
                    -{formatIndianCurrency(c.cashExpenses)}
                  </td>
                  <td className="p-3 font-mono font-semibold">{formatIndianCurrency(c.expectedCash)}</td>
                  <td className="p-3 font-mono font-bold text-[#0754BD]">
                    {formatIndianCurrency(c.actualCountedCash)}
                  </td>
                  <td className="p-3 font-mono">
                    {c.difference === 0 ? (
                      <span className="text-emerald-600 font-semibold">Exact (0)</span>
                    ) : (
                      <span className="text-rose-600 font-bold">{formatIndianCurrency(c.difference)}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={c.difference === 0 ? "success" : "warning"} size="sm">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadClosingPdf(c)}
                      className="h-7 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST CASH MODAL */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Manual Cash Drawer Adjustment
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Record cash additions, owner bank deposits, or drawer float corrections.
            </p>

            <form onSubmit={handleAddAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Adjustment Type</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Cash Added">Cash Added into Drawer</option>
                  <option value="Cash Withdrawn">Cash Withdrawn for Bank Deposit</option>
                  <option value="Cash Correction">Float Balance Correction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason / Voucher Note</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank cash withdrawal for petty expense float"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setAdjustModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Save Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY CLOSING MODAL */}
      {closingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Daily Drawer Closing &amp; Reconciler
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Date: <strong>{formatIndianDate(selectedDate)}</strong>
            </p>

            <div className="bg-[#EFF6FF] p-3 rounded-lg border border-[#BFDBFE] text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Calculated System Balance:</span>
                <strong className="font-mono text-[#0B2B5B]">
                  {formatIndianCurrency(expectedClosingCash)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Physical Cash Counted:</span>
                <strong className="font-mono text-[#0754BD]">
                  {formatIndianCurrency(actualCountedCash)}
                </strong>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold">
                <span>Difference:</span>
                <span
                  className={
                    actualCountedCash === expectedClosingCash
                      ? "text-emerald-700"
                      : "text-rose-600"
                  }
                >
                  {formatIndianCurrency(actualCountedCash - expectedClosingCash)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveClosing} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Actual Physical Counted Cash (₹)</label>
                <input
                  type="number"
                  required
                  value={actualCountedCash}
                  onChange={(e) => setActualCountedCash(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Closing Audit Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. All currency notes verified against register"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setClosingModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Sign &amp; Complete Closing
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
