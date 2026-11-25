import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  Plus,
  Search,
  Filter,
  DollarSign,
  Building,
  Laptop,
  Layers,
} from "lucide-react";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import type { ExpenseCategory, ExpenseDivision, PaymentMethod } from "@/types";

export function ExpensesPage() {
  const expenses = useAcademyStore((s) => s.expenses);
  const recordExpense = useAcademyStore((s) => s.recordExpense);
  const voidExpense = useAcademyStore((s) => s.voidExpense);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // New Expense Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Rent");
  const [amount, setAmount] = useState<number>(1000);
  const [division, setDivision] = useState<ExpenseDivision>("Shared Business Expense");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendorPayee, setVendorPayee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [notes, setNotes] = useState("");

  const categories: ExpenseCategory[] = [
    "Rent",
    "Electricity",
    "Internet",
    "Staff Salaries",
    "Office Supplies",
    "Printing Materials",
    "Computer Maintenance",
    "Software Subscriptions",
    "Marketing",
    "Transportation",
    "Miscellaneous",
  ];

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      toast.error("Please enter a valid expense title and amount.");
      return;
    }
    recordExpense({
      title,
      category,
      amount: Number(amount),
      division,
      expenseDate,
      vendorPayee: vendorPayee || "Vendor",
      paymentMethod,
      notes,
      recordedBy: "Accounts Officer",
    });

    toast.success(`Expense of ${formatIndianCurrency(amount)} recorded`);
    setAddModalOpen(false);
    setTitle("");
    setVendorPayee("");
    setNotes("");
  };

  const handleVoid = (id: string) => {
    const reason = window.prompt("Reason for voiding this expense:");
    if (reason && reason.trim()) {
      voidExpense(id, reason.trim());
      toast.success("Expense voided successfully");
    }
  };

  const activeExpenses = expenses.filter((e) => e.status === "Active");
  const totalAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
  const academyTotal = activeExpenses
    .filter((e) => e.division === "Academy")
    .reduce((sum, e) => sum + e.amount, 0);
  const cscTotal = activeExpenses
    .filter((e) => e.division === "CSC Centre")
    .reduce((sum, e) => sum + e.amount, 0);
  const sharedTotal = activeExpenses
    .filter((e) => e.division === "Shared Business Expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchDiv = selectedDivision === "All" || e.division === selectedDivision;
    const matchCat = selectedCategory === "All" || e.category === selectedCategory;
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendorPayee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDiv && matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Operational Expenses &amp; Outflows
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Track center rents, faculty honorariums, printing materials, electricity bills, and maintenance.
          </p>
        </div>

        <Button size="sm" variant="orange" onClick={() => setAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Record Expense
        </Button>
      </div>

      {/* 4 Financial Expense KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-subtle">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Total Operational Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-[#0B2B5B] font-heading">
            {formatIndianCurrency(totalAmount)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">{activeExpenses.length} active records</div>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-subtle">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Academy Division</span>
            <Building className="w-4 h-4 text-[#0754BD]" />
          </div>
          <div className="text-xl font-extrabold text-[#0754BD] font-heading">
            {formatIndianCurrency(academyTotal)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">Faculty &amp; course supplies</div>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-subtle">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>CSC Counter Division</span>
            <Laptop className="w-4 h-4 text-[#F58220]" />
          </div>
          <div className="text-xl font-extrabold text-[#F58220] font-heading">
            {formatIndianCurrency(cscTotal)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">Paper, toner &amp; laminates</div>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-subtle">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Shared Business Facility</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-heading">
            {formatIndianCurrency(sharedTotal)}
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">Rent, broadband &amp; electric</div>
        </div>
      </div>

      {/* Filters & Expense Ledger Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-2.5 py-1.5 border rounded-lg text-xs bg-white text-[#111827]"
            >
              <option value="All">All Divisions</option>
              <option value="Academy">Academy</option>
              <option value="CSC Centre">CSC Centre</option>
              <option value="Shared Business Expense">Shared Facility</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 border rounded-lg text-xs bg-white text-[#111827]"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b text-[#64748B]">
                <th className="p-3">Expense ID</th>
                <th className="p-3">Title &amp; Payee</th>
                <th className="p-3">Category</th>
                <th className="p-3">Division</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-[#0B2B5B]">{exp.id}</td>
                  <td className="p-3">
                    <div className="font-semibold text-[#111827]">{exp.title}</div>
                    <div className="text-[10px] text-[#64748B]">Payee: {exp.vendorPayee}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#111827] text-[10px] font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 text-[#64748B]">{exp.division}</td>
                  <td className="p-3 text-[#64748B]">{formatIndianDate(exp.expenseDate)}</td>
                  <td className="p-3 font-bold font-mono text-rose-600">
                    {formatIndianCurrency(exp.amount)}
                  </td>
                  <td className="p-3 text-[#64748B] font-medium">{exp.paymentMethod}</td>
                  <td className="p-3">
                    <Badge variant={exp.status === "Active" ? "success" : "danger"} size="sm">
                      {exp.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {exp.status === "Active" && (
                      <button
                        onClick={() => handleVoid(exp.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Void
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Record Business Expense
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Enter operational cost, select business division, and specify payee details.
            </p>

            <form onSubmit={handleRecordExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Toner Refill & Cartridge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Division</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Academy">Academy</option>
                    <option value="CSC Centre">CSC Centre</option>
                    <option value="Shared Business Expense">Shared Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. National Stationers"
                    value={vendorPayee}
                    onChange={(e) => setVendorPayee(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Cash">Cash (Physical Drawer)</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional voucher/bill details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Save Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
