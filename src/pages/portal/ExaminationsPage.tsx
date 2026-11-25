import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  Download,
  AlertCircle,
  Award,
} from "lucide-react";
import { formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ExaminationsPage() {
  const exams = useAcademyStore((s) => s.exams);
  const examResults = useAcademyStore((s) => s.examResults);
  const courses = useAcademyStore((s) => s.courses);
  const batches = useAcademyStore((s) => s.batches);
  const students = useAcademyStore((s) => s.students);
  const createExam = useAcademyStore((s) => s.createExam);
  const saveExamResults = useAcademyStore((s) => s.saveExamResults);

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || "");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [marksModalOpen, setMarksModalOpen] = useState(false);

  // Form states
  const [examName, setExamName] = useState("");
  const [examCourseId, setExamCourseId] = useState(courses[0]?.id || "");
  const [examBatchId, setExamBatchId] = useState(batches[0]?.id || "");
  const [examSubject, setExamSubject] = useState("");
  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [examMaxMarks, setExamMaxMarks] = useState(100);
  const [examPassingMarks, setExamPassingMarks] = useState(40);
  const [examType, setExamType] = useState<any>("Practical");

  // Temporary marks entry table
  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const eligibleStudents = students.filter((s) => s.batchId === selectedExam?.batchId);

  const [marksDraft, setMarksDraft] = useState<
    Record<string, { marks: number; isAbsent: boolean; remarks: string }>
  >({});

  const handleOpenMarksModal = (exam: typeof selectedExam) => {
    setSelectedExamId(exam.id);
    const existing = examResults.filter((er) => er.examId === exam.id);
    const draft: Record<string, { marks: number; isAbsent: boolean; remarks: string }> = {};

    const batchStudents = students.filter((s) => s.batchId === exam.batchId);
    batchStudents.forEach((st) => {
      const match = existing.find((e) => e.studentId === st.id);
      draft[st.id] = {
        marks: match ? match.marksObtained : Math.round(exam.maxMarks * 0.75),
        isAbsent: match ? match.isAbsent : false,
        remarks: match?.remarks || "Good practical execution",
      };
    });

    setMarksDraft(draft);
    setMarksModalOpen(true);
  };

  const handleSaveMarks = () => {
    if (!selectedExam) return;
    const entries = Object.entries(marksDraft).map(([studentId, data]) => ({
      studentId,
      marksObtained: Number(data.marks),
      isAbsent: data.isAbsent,
      remarks: data.remarks,
    }));

    saveExamResults(selectedExam.id, entries);
    toast.success(`Marks published for ${selectedExam.name}`);
    setMarksModalOpen(false);
  };

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !examSubject) {
      toast.error("Please fill in examination name and subject.");
      return;
    }
    createExam({
      name: examName,
      courseId: examCourseId,
      batchId: examBatchId,
      subject: examSubject,
      examDate,
      maxMarks: Number(examMaxMarks),
      passingMarks: Number(examPassingMarks),
      examType,
      instructorId: "STF-001",
      status: "Scheduled",
    });
    toast.success(`Scheduled ${examName}`);
    setScheduleModalOpen(false);
    setExamName("");
    setExamSubject("");
  };

  const handleDownloadMarksheet = (exam: typeof selectedExam) => {
    const doc = new jsPDF();
    const course = courses.find((c) => c.id === exam.courseId);
    const batch = batches.find((b) => b.id === exam.batchId);
    const results = examResults.filter((er) => er.examId === exam.id);

    // Header styling
    doc.setFillColor(11, 43, 91); // #0B2B5B
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SVCA COMPUTER TRAINING ACADEMY & CSC CENTRE", 105, 12, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Official Examination Marksheet — ${exam.name}`, 105, 20, { align: "center" });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9);
    doc.text(`Course: ${course?.name} (${course?.code})`, 14, 38);
    doc.text(`Batch: ${batch?.name} | Date: ${formatIndianDate(exam.examDate)}`, 14, 44);
    doc.text(`Max Marks: ${exam.maxMarks} | Passing Marks: ${exam.passingMarks}`, 14, 50);

    const tableRows = results.map((r, i) => {
      const student = students.find((s) => s.id === r.studentId);
      return [
        String(i + 1),
        r.studentId,
        student?.fullName || "Student",
        r.isAbsent ? "ABSENT" : String(r.marksObtained),
        r.isAbsent ? "N/A" : r.grade,
        r.passed ? "PASS" : "FAIL",
        r.remarks || "-",
      ];
    });

    autoTable(doc, {
      startY: 56,
      head: [["#", "Student ID", "Full Name", "Marks", "Grade", "Result", "Remarks"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [11, 43, 91] },
      styles: { fontSize: 8 },
    });

    // Demonstration safety notice
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(8);
    doc.text("DEMONSTRATION DOCUMENT — NOT AN OFFICIAL GOVERNMENT CERTIFICATE", 105, finalY + 15, { align: "center" });

    doc.save(`${exam.id}-Marksheet.pdf`);
    toast.success("Marksheet PDF downloaded successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Examinations &amp; Performance Evaluation
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Conduct practical lab tests, input student evaluation marks, compute grades, and export official marksheets.
          </p>
        </div>

        <Button size="sm" variant="orange" onClick={() => setScheduleModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Examination
        </Button>
      </div>

      {/* Examination Directory Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => {
          const course = courses.find((c) => c.id === exam.courseId);
          const batch = batches.find((b) => b.id === exam.batchId);
          const results = examResults.filter((er) => er.examId === exam.id);
          const passedCount = results.filter((r) => r.passed).length;
          const passPct = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;

          return (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={exam.status === "Published" ? "success" : "blue"} size="sm">
                    {exam.status}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#64748B]">{exam.id}</span>
                </div>

                <h3 className="font-bold text-base text-[#0B2B5B] font-heading mb-1">
                  {exam.name}
                </h3>
                <div className="text-xs text-[#0754BD] font-semibold mb-3">
                  {course?.name} • {batch?.name}
                </div>

                <div className="space-y-1.5 text-xs text-[#64748B] mb-5">
                  <div>Subject: <strong className="text-[#111827]">{exam.subject}</strong></div>
                  <div>Exam Date: <strong className="text-[#111827]">{formatIndianDate(exam.examDate)}</strong></div>
                  <div>Type: <strong className="text-[#111827]">{exam.examType}</strong> (Max: {exam.maxMarks}, Pass: {exam.passingMarks})</div>
                  {results.length > 0 && (
                    <div className="pt-2 text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#F58220]" />
                      Pass Rate: {passPct}% ({passedCount}/{results.length} students)
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F1F5F9] pt-4 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenMarksModal(exam)}
                  className="flex-1 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-[#0754BD]" />
                  {exam.status === "Published" ? "Edit Marks" : "Enter Marks"}
                </Button>
                {results.length > 0 && (
                  <Button
                    size="sm"
                    variant="navy"
                    onClick={() => handleDownloadMarksheet(exam)}
                    className="text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    PDF
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MARKS ENTRY MODAL */}
      {marksModalOpen && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 border border-[#E2E8F0] max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2B5B] font-heading">
                    Marks Entry — {selectedExam.name}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Max Marks: {selectedExam.maxMarks} | Passing: {selectedExam.passingMarks}
                  </p>
                </div>
                <Badge variant="navy">{selectedExam.examType}</Badge>
              </div>

              <div className="overflow-y-auto max-h-[55vh]">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-[#64748B]">
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Marks Obtained</th>
                      <th className="p-2.5 text-center">Absent?</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {eligibleStudents.map((st) => {
                      const row = marksDraft[st.id] || { marks: 0, isAbsent: false, remarks: "" };
                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <div className="font-semibold text-[#111827]">{st.fullName}</div>
                            <div className="text-[10px] text-[#64748B] font-mono">{st.id}</div>
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              min="0"
                              max={selectedExam.maxMarks}
                              disabled={row.isAbsent}
                              value={row.marks}
                              onChange={(e) =>
                                setMarksDraft({
                                  ...marksDraft,
                                  [st.id]: { ...row, marks: Number(e.target.value) },
                                })
                              }
                              className="w-20 px-2 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={row.isAbsent}
                              onChange={(e) =>
                                setMarksDraft({
                                  ...marksDraft,
                                  [st.id]: { ...row, isAbsent: e.target.checked },
                                })
                              }
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={row.remarks}
                              onChange={(e) =>
                                setMarksDraft({
                                  ...marksDraft,
                                  [st.id]: { ...row, remarks: e.target.value },
                                })
                              }
                              className="w-full px-2 py-1 border rounded text-xs"
                              placeholder="Evaluation comments..."
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button size="sm" variant="outline" onClick={() => setMarksModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="orange" onClick={handleSaveMarks}>
                Save &amp; Publish Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE EXAM MODAL */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Schedule New Examination
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Create practical evaluation test or terminal semester examination for a batch.
            </p>

            <form onSubmit={handleScheduleExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Examination Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DCA Semester 1 Practical Evaluation"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Course</label>
                  <select
                    value={examCourseId}
                    onChange={(e) => setExamCourseId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Batch</label>
                  <select
                    value={examBatchId}
                    onChange={(e) => setExamBatchId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject / Practical Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MS Excel Formulas & Advanced VLOOKUP"
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={examMaxMarks}
                    onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={examPassingMarks}
                    onChange={(e) => setExamPassingMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
