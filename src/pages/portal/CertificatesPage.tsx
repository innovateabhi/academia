import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import jsPDF from "jspdf";

export function CertificatesPage() {
  const students = useAcademyStore((s) => s.students);
  const courses = useAcademyStore((s) => s.courses);
  const certificates = useAcademyStore((s) => s.certificates);
  const issueCertificate = useAcademyStore((s) => s.issueCertificate);

  const [selectedCertId, setSelectedCertId] = useState<string>(certificates[0]?.id || "");
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedStudentForIssue, setSelectedStudentForIssue] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("A+");

  const selectedCert = certificates.find((c) => c.id === selectedCertId) || certificates[0];
  const certStudent = students.find((s) => s.id === selectedCert?.studentId);

  // Eligible students for new certificate (Active or Completed without an existing cert)
  const eligibleStudents = students.filter(
    (s) => !certificates.some((c) => c.studentId === s.id)
  );

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForIssue) {
      toast.error("Please select an eligible student.");
      return;
    }
    const cert = issueCertificate(selectedStudentForIssue, selectedGrade);
    toast.success(`Issued certificate ${cert.certificateNumber}`);
    setSelectedCertId(cert.id);
    setIssueModalOpen(false);
  };

  const handleDownloadPdf = (cert: typeof selectedCert) => {
    if (!cert) return;
    const student = students.find((s) => s.id === cert.studentId);
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Elegant Double Border
    doc.setDrawColor(11, 43, 91); // #0B2B5B
    doc.setLineWidth(3);
    doc.rect(8, 8, 281, 194);

    doc.setDrawColor(245, 130, 32); // #F58220
    doc.setLineWidth(1);
    doc.rect(12, 12, 273, 186);

    // Academy Masthead
    doc.setTextColor(11, 43, 91);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(businessConfig.identity.name.toUpperCase(), 148.5, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${businessConfig.contact.fullAddress} | Ph: ${businessConfig.contact.phoneDisplay}`, 148.5, 38, { align: "center" });

    // Certificate Title
    doc.setTextColor(245, 130, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CERTIFICATE OF COURSE COMPLETION", 148.5, 54, { align: "center" });

    // Body Text
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("This is to certify that", 148.5, 70, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(11, 43, 91);
    doc.text(student?.fullName || "Student Name", 148.5, 84, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(
      `has successfully completed the prescribed curriculum and practical assessments for the course`,
      148.5,
      96,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(7, 84, 189);
    doc.text(cert.courseName, 148.5, 108, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Duration: ${cert.duration} | Performance Grade: ${cert.grade || "A+"}`,
      148.5,
      118,
      { align: "center" }
    );

    // Footer signatures and QR
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(`Certificate No: ${cert.certificateNumber}`, 25, 160);
    doc.text(`Issue Date: ${formatIndianDate(cert.issueDate)}`, 25, 166);
    doc.text(`Enrollment ID: ${cert.studentId}`, 25, 172);

    doc.setFont("helvetica", "bold");
    doc.text("Director & Authorized Signatory", 220, 160, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(businessConfig.identity.name, 220, 166, { align: "center" });

    // Watermark
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(8);
    doc.text("DEMO DOCUMENT — SAMPLE COURSE COMPLETION CERTIFICATE", 148.5, 190, { align: "center" });

    doc.save(`${cert.certificateNumber}.pdf`);
    toast.success("Certificate PDF downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Course Completion Certificates
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Issue, preview, and download authenticated graduation certificates with unique verification credentials.
          </p>
        </div>

        <Button size="sm" variant="orange" onClick={() => setIssueModalOpen(true)}>
          <Award className="w-4 h-4 mr-1.5" />
          Issue New Certificate
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Certificate List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-subtle space-y-3">
          <div className="font-bold text-xs text-[#0B2B5B] font-heading uppercase tracking-wider mb-1">
            Issued Certificates Directory ({certificates.length})
          </div>

          <div className="overflow-y-auto max-h-[550px] space-y-2">
            {certificates.map((cert) => {
              const student = students.find((s) => s.id === cert.studentId);
              const isSelected = cert.id === selectedCertId;

              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCertId(cert.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-[#EFF6FF] border-[#0754BD] shadow-subtle"
                      : "bg-white border-[#F1F5F9] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#0754BD] font-semibold">
                      {cert.certificateNumber}
                    </span>
                    <Badge variant="success" size="sm">
                      Grade {cert.grade || "A+"}
                    </Badge>
                  </div>
                  <div className="font-bold text-xs text-[#111827]">{student?.fullName}</div>
                  <div className="text-[11px] text-[#64748B]">{cert.courseName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Preview Frame */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Certificate Preview (A4 Landscape)
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {selectedCert?.certificateNumber} • {certStudent?.fullName}
              </p>
            </div>

            <Button size="sm" variant="navy" onClick={() => handleDownloadPdf(selectedCert)}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF
            </Button>
          </div>

          {/* Certificate Graphical Layout */}
          {selectedCert && (
            <div className="w-full aspect-[297/210] rounded-xl border-4 border-[#0B2B5B] p-6 bg-gradient-to-br from-amber-50/20 via-white to-slate-50 relative flex flex-col justify-between shadow-elevated select-none">
              {/* Inner Decorative Golden Border */}
              <div className="absolute inset-2 border border-[#F58220]/50 rounded-lg pointer-events-none" />

              {/* Header */}
              <div className="text-center relative z-10">
                <div className="font-extrabold text-sm md:text-base text-[#0B2B5B] font-heading tracking-wide uppercase">
                  {businessConfig.identity.name}
                </div>
                <div className="text-[9px] text-[#64748B] mt-0.5">
                  {businessConfig.contact.fullAddress}
                </div>
                <div className="inline-block mt-3 px-3 py-0.5 rounded-full bg-[#FFF7ED] border border-[#F58220]/30 text-[#F58220] font-extrabold text-xs tracking-wider">
                  CERTIFICATE OF COMPLETION
                </div>
              </div>

              {/* Body */}
              <div className="text-center my-auto relative z-10 space-y-1">
                <div className="text-xs text-[#64748B]">This is proudly presented to</div>
                <div className="font-extrabold text-lg md:text-2xl text-[#0B2B5B] font-heading">
                  {certStudent?.fullName || "Student Name"}
                </div>
                <div className="text-xs text-[#64748B] max-w-md mx-auto">
                  for successfully finishing all prescribed practical coursework and evaluations in
                </div>
                <div className="font-extrabold text-sm md:text-base text-[#0754BD] font-heading">
                  {selectedCert.courseName}
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Duration: {selectedCert.duration} • Performance Grade: <strong className="text-[#111827]">{selectedCert.grade || "A+"}</strong>
                </div>
              </div>

              {/* Signatures & QR */}
              <div className="flex items-end justify-between border-t border-slate-200 pt-3 relative z-10 text-[9px] text-[#64748B]">
                <div>
                  <div>Certificate ID: <strong className="text-[#111827]">{selectedCert.certificateNumber}</strong></div>
                  <div>Issued: {formatIndianDate(selectedCert.issueDate)}</div>
                </div>

                <div className="flex flex-col items-center">
                  <QRCodeSVG value={selectedCert.qrPayload} size={42} />
                  <span className="text-[8px] font-mono text-[#64748B] mt-0.5">VERIFIED SAMPLE</span>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[#0B2B5B] text-xs">Director &amp; Signatory</div>
                  <div>{businessConfig.identity.shortName}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ISSUE CERTIFICATE MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Issue Course Certificate
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Select an eligible student to grant official completion certification.
            </p>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudentForIssue}
                  onChange={(e) => setSelectedStudentForIssue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">-- Choose student --</option>
                  {eligibleStudents.map((st) => {
                    const c = courses.find((course) => course.id === st.courseId);
                    return (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.id}) — {c?.code}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Graduation Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="A+">A+ (Outstanding: 90%+)</option>
                  <option value="A">A (Excellent: 80% - 89%)</option>
                  <option value="B">B (Good: 70% - 79%)</option>
                  <option value="C">C (Satisfactory: 60% - 69%)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIssueModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Generate &amp; Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
