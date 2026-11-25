import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import {
  IdCard,
  Download,
  Printer,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import jsPDF from "jspdf";

export function IdCardsPage() {
  const students = useAcademyStore((s) => s.students);
  const courses = useAcademyStore((s) => s.courses);
  const batches = useAcademyStore((s) => s.batches);
  const idCards = useAcademyStore((s) => s.idCards);
  const issueIdCard = useAcademyStore((s) => s.issueIdCard);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const course = courses.find((c) => c.id === selectedStudent?.courseId);
  const batch = batches.find((b) => b.id === selectedStudent?.batchId);
  const existingCard = idCards.find((c) => c.studentId === selectedStudent?.id);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCard = () => {
    if (!selectedStudent) return;
    issueIdCard(selectedStudent.id);
    toast.success(`Generated ID Card for ${selectedStudent.fullName}`);
  };

  const handleDownloadPdf = () => {
    if (!selectedStudent) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150], // Standard pocket document size
    });

    // Front Side
    doc.setFillColor(11, 43, 91); // #0B2B5B
    doc.roundedRect(8, 8, 84, 54, 3, 3, "F");

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(businessConfig.identity.name, 50, 15, { align: "center", maxWidth: 76 });

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(245, 130, 32); // #F58220
    doc.text("OFFICIAL STUDENT IDENTITY CARD", 50, 23, { align: "center" });

    // Inner card body
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 26, 76, 32, 2, 2, "F");

    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(selectedStudent.fullName, 16, 32);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${selectedStudent.id}`, 16, 37);
    doc.text(`Course: ${course?.code || "DCA"} — ${course?.name}`, 16, 42, { maxWidth: 50 });
    doc.text(`Batch: ${batch?.name}`, 16, 48, { maxWidth: 50 });
    doc.text(`Valid Upto: ${formatIndianDate(existingCard?.validityDate || "2027-11-25")}`, 16, 53);

    // Demonstration watermark
    doc.setFontSize(6);
    doc.setTextColor(220, 38, 38);
    doc.text("DEMO SAMPLE — NOT FOR LEGAL IDENTIFICATION", 50, 68, { align: "center" });

    doc.save(`${selectedStudent.id}-IDCard.pdf`);
    toast.success("Student ID Card PDF downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Student Identity Card Studio
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Generate and print institutional CR80 student ID cards with secure verification QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!existingCard ? (
            <Button size="sm" variant="orange" onClick={handleGenerateCard}>
              <Sparkles className="w-4 h-4 mr-1.5" />
              Issue Card
            </Button>
          ) : (
            <Button size="sm" variant="navy" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4 mr-1.5" />
              Download ID Card PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Selector List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-subtle space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div className="overflow-y-auto max-h-[550px] space-y-1.5 pr-1">
            {filteredStudents.map((st) => {
              const isSelected = st.id === selectedStudentId;
              const hasCard = idCards.some((c) => c.studentId === st.id);
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#EFF6FF] border-[#0754BD] shadow-subtle"
                      : "bg-white border-[#F1F5F9] hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-[#111827]">{st.fullName}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{st.id}</div>
                  </div>
                  {hasCard ? (
                    <Badge variant="success" size="sm">Issued</Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">Unissued</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Card Preview */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Card Preview (CR80 Standard Size)
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Showing {cardSide === "front" ? "Front Side" : "Back Side"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCardSide(cardSide === "front" ? "back" : "front")}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Flip to {cardSide === "front" ? "Back" : "Front"}
              </Button>
            </div>
          </div>

          {/* CR80 Physical Card Frame (3.375" x 2.125" aspect ratio) */}
          <div className="w-full max-w-md aspect-[85.6/53.98] rounded-2xl shadow-elevated border border-slate-300 overflow-hidden relative transition-all duration-300">
            {cardSide === "front" ? (
              /* CARD FRONT */
              <div className="w-full h-full bg-gradient-to-br from-[#0B2B5B] via-[#08234A] to-[#04142B] text-white p-5 flex flex-col justify-between select-none">
                {/* Header */}
                <div className="flex items-center gap-2.5 border-b border-blue-900/60 pb-2.5">
                  <img src="/favicon.svg" alt="SVCA Logo" className="w-8 h-8 rounded shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-xs font-heading tracking-wide uppercase leading-tight truncate">
                      {businessConfig.identity.name}
                    </div>
                    <div className="text-[9px] text-[#F58220] font-mono tracking-wider font-semibold">
                      STUDENT IDENTITY CARD
                    </div>
                  </div>
                </div>

                {/* Body: Photo & Details */}
                <div className="flex items-center gap-4 my-auto">
                  {/* Photo Frame */}
                  <div className="w-20 h-24 rounded-lg bg-white/10 border-2 border-[#F58220] flex items-center justify-center font-bold text-lg text-blue-200 shrink-0 shadow-subtle overflow-hidden">
                    {selectedStudent.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1 text-xs">
                    <div className="font-extrabold text-sm text-white font-heading leading-tight">
                      {selectedStudent.fullName}
                    </div>
                    <div className="text-[10px] text-blue-200 font-mono">
                      ID: <span className="text-white font-bold">{selectedStudent.id}</span>
                    </div>
                    <div className="text-[11px] text-blue-100">
                      Course: <strong>{course?.name}</strong>
                    </div>
                    <div className="text-[11px] text-blue-200">
                      Batch: {batch?.name}
                    </div>
                    <div className="text-[10px] text-amber-300 font-medium">
                      Valid Upto: {formatIndianDate(existingCard?.validityDate || "2027-11-25")}
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="border-t border-blue-900/60 pt-2 flex items-center justify-between text-[8px] text-blue-300 font-mono">
                  <span>CARD NO: {existingCard?.cardNumber || `SVCA-ID-${selectedStudent.id}`}</span>
                  <span className="text-[#F58220] font-bold">AUTHORIZED STUDENT</span>
                </div>
              </div>
            ) : (
              /* CARD BACK */
              <div className="w-full h-full bg-white text-[#111827] p-5 flex flex-col justify-between select-none">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B2B5B] border-b pb-1 mb-2 font-heading">
                    Terms &amp; Instructions
                  </div>
                  <ul className="text-[9px] text-[#64748B] space-y-1 list-disc pl-3">
                    <li>This card is non-transferable and must be carried to all lab sessions.</li>
                    <li>Loss of card must be reported to the SVCA front desk immediately.</li>
                    <li>Valid only during active course enrollment duration.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t pt-2">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-bold text-[#111827]">Front Desk Assistance:</div>
                    <div className="text-[9px] text-[#64748B]">{businessConfig.contact.phoneDisplay}</div>
                    <div className="text-[8px] text-[#64748B]">{businessConfig.contact.fullAddress}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <QRCodeSVG
                      value={existingCard?.qrPayload || `SVCA:ID:${selectedStudent.id}:VALID`}
                      size={44}
                    />
                    <span className="text-[7px] text-[#64748B] font-mono mt-0.5">SCAN TO VERIFY</span>
                  </div>
                </div>

                <div className="text-center text-[7px] font-bold text-red-600 tracking-wider">
                  DEMONSTRATION DOCUMENT — NOT A GOVERNMENT ID
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button size="sm" variant="orange" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4 mr-1.5" />
              Download Ready-to-Print PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1.5" />
              Print Directly
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
