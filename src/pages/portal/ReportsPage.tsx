import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Users,
  CreditCard,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportsPage() {
  const students = useAcademyStore((s) => s.students);
  const courses = useAcademyStore((s) => s.courses);
  const batches = useAcademyStore((s) => s.batches);
  const feeAccounts = useAcademyStore((s) => s.feeAccounts);
  const payments = useAcademyStore((s) => s.payments);
  const cscTransactions = useAcademyStore((s) => s.cscTransactions);
  const expenses = useAcademyStore((s) => s.expenses);
  const enquiries = useAcademyStore((s) => s.enquiries);

  const [reportCategory, setReportCategory] = useState<"students" | "fees" | "csc" | "expenses" | "enquiries">("fees");

  // Prepare data based on selected category
  let reportTitle = "";
  let headers: string[] = [];
  let rows: (string | number)[][] = [];

  if (reportCategory === "fees") {
    reportTitle = "Student Fee Ledger & Collections Statement";
    headers = ["Student ID", "Full Name", "Course", "Total Fees", "Amount Paid", "Balance Due", "Status"];
    rows = feeAccounts.map((fa) => {
      const st = students.find((s) => s.id === fa.studentId);
      const c = courses.find((crs) => crs.id === fa.courseId);
      return [
        fa.studentId,
        st?.fullName || "Student",
        c?.code || "Course",
        fa.totalFees,
        fa.totalPaid,
        fa.outstandingBalance,
        fa.status,
      ];
    });
  } else if (reportCategory === "students") {
    reportTitle = "Comprehensive Student Directory";
    headers = ["Student ID", "Full Name", "Mobile", "Course", "Batch", "Admission Date", "Status"];
    rows = students.map((st) => {
      const c = courses.find((crs) => crs.id === st.courseId);
      const b = batches.find((bat) => bat.id === st.batchId);
      return [
        st.id,
        st.fullName,
        st.phone,
        c?.name || "Course",
        b?.name || "Batch",
        formatIndianDate(st.admissionDate),
        st.status,
      ];
    });
  } else if (reportCategory === "csc") {
    reportTitle = "CSC Digital Counter Sales History";
    headers = ["Receipt No", "Date", "Customer", "Services", "Amount", "Mode", "Status"];
    rows = cscTransactions.map((tx) => [
      tx.receiptNumber,
      formatIndianDate(tx.createdAt.slice(0, 10)),
      tx.customerName || "Walk-in Citizen",
      tx.items.map((i) => `${i.serviceName} (${i.quantity})`).join(", "),
      tx.totalAmount,
      tx.paymentMethod,
      tx.status,
    ]);
  } else if (reportCategory === "expenses") {
    reportTitle = "Business Operational Expense Statement";
    headers = ["Expense ID", "Title", "Category", "Division", "Date", "Amount", "Mode"];
    rows = expenses
      .filter((e) => e.status === "Active")
      .map((e) => [
        e.id,
        e.title,
        e.category,
        e.division,
        formatIndianDate(e.expenseDate),
        e.amount,
        e.paymentMethod,
      ]);
  } else {
    reportTitle = "Website & Walk-in Admission Enquiries";
    headers = ["Enquiry ID", "Applicant Name", "Phone", "Interested Course", "Source", "Date", "Status"];
    rows = enquiries.map((enq) => [
      enq.id,
      enq.applicantName,
      enq.phone,
      enq.interestedCourseName,
      enq.source || "Website",
      formatIndianDate(enq.submittedAt.slice(0, 10)),
      enq.status,
    ]);
  }

  // EXCEL EXPORT
  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      [businessConfig.identity.name],
      [reportTitle],
      [`Generated on: ${new Date().toLocaleString("en-IN")}`],
      [],
      headers,
      ...rows,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportCategory}-report.xlsx`);
    toast.success("Excel (.xlsx) report exported successfully");
  };

  // CSV EXPORT
  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join(
        "\n"
      );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportCategory}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report exported successfully");
  };

  // PDF EXPORT
  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: rows[0]?.length > 6 ? "landscape" : "portrait",
    });

    doc.setFillColor(11, 43, 91);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(businessConfig.identity.name, doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(245, 130, 32);
    doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    autoTable(doc, {
      startY: 32,
      head: [headers],
      body: rows.map((r) => r.map((v) => String(v))),
      theme: "striped",
      headStyles: { fillColor: [11, 43, 91] },
      styles: { fontSize: 7.5 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    doc.setFontSize(7);
    doc.setTextColor(220, 38, 38);
    doc.text(
      "DEMONSTRATION REPORT — GENERATED FOR LOCAL PRESENTATION ONLY",
      doc.internal.pageSize.getWidth() / 2,
      finalY + 12,
      { align: "center" }
    );

    doc.save(`${reportCategory}-report.pdf`);
    toast.success("PDF report downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Reports &amp; Financial Analytics
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Export academic directories, course fee ledger statements, CSC sales history, and expense reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCsv}>
            <Download className="w-3.5 h-3.5 mr-1" />
            CSV
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="text-emerald-700 hover:text-emerald-800">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Excel (.xlsx)
          </Button>
          <Button size="sm" variant="navy" onClick={handleExportPdf}>
            <FileText className="w-3.5 h-3.5 mr-1" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setReportCategory("fees")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            reportCategory === "fees"
              ? "bg-[#0B2B5B] text-white border-[#0B2B5B] shadow-subtle"
              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Fees &amp; Collections
        </button>
        <button
          onClick={() => setReportCategory("students")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            reportCategory === "students"
              ? "bg-[#0B2B5B] text-white border-[#0B2B5B] shadow-subtle"
              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Student Directory
        </button>
        <button
          onClick={() => setReportCategory("csc")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            reportCategory === "csc"
              ? "bg-[#0B2B5B] text-white border-[#0B2B5B] shadow-subtle"
              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          CSC Service Sales
        </button>
        <button
          onClick={() => setReportCategory("expenses")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            reportCategory === "expenses"
              ? "bg-[#0B2B5B] text-white border-[#0B2B5B] shadow-subtle"
              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          Expense Statement
        </button>
        <button
          onClick={() => setReportCategory("enquiries")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
            reportCategory === "enquiries"
              ? "bg-[#0B2B5B] text-white border-[#0B2B5B] shadow-subtle"
              : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Admission Leads
        </button>
      </div>

      {/* Live Preview Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">{reportTitle}</h3>
            <p className="text-xs text-[#64748B]">Showing {rows.length} total records</p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="sticky top-0 bg-[#F8FAFC] border-b text-[#64748B]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3">
                      {typeof cell === "number" && (cIdx === 3 || cIdx === 4 || cIdx === 5) ? (
                        <span className="font-mono font-semibold text-[#0B2B5B]">
                          {formatIndianCurrency(cell)}
                        </span>
                      ) : (
                        <span>{String(cell)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
