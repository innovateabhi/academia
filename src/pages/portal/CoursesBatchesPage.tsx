import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { formatIndianCurrency } from "@/utils/formatters";
import { toast } from "sonner";

export function CoursesBatchesPage() {
  const courses = useAcademyStore((s) => s.courses);
  const batches = useAcademyStore((s) => s.batches);
  const students = useAcademyStore((s) => s.students);
  const addCourse = useAcademyStore((s) => s.addCourse);
  const addBatch = useAcademyStore((s) => s.addBatch);

  const [activeTab, setActiveTab] = useState<"batches" | "courses" | "timetable">("batches");
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // New Course Form State
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState<any>("Basic & Office");
  const [courseDuration, setCourseDuration] = useState("6 Months");
  const [courseFee, setCourseFee] = useState(4500);
  const [courseDesc, setCourseDesc] = useState("");

  // New Batch Form State
  const [batchName, setBatchName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [batchTiming, setBatchTiming] = useState("08:00 AM – 09:30 AM");
  const [batchDays, setBatchDays] = useState("Mon – Fri");
  const [batchInstructor, setBatchInstructor] = useState("Amitava Roy");
  const [batchCapacity, setBatchCapacity] = useState(20);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseCode) {
      toast.error("Please fill in course title and code.");
      return;
    }
    addCourse({
      code: courseCode,
      name: courseName,
      category: courseCategory,
      duration: courseDuration,
      durationMonths: 6,
      fee: Number(courseFee),
      description: courseDesc || "Comprehensive practical training course.",
      highlights: "Theory, Practical Lab, Project Evaluation",
    });
    toast.success(`Course ${courseName} created successfully`);
    setCourseModalOpen(false);
    setCourseCode("");
    setCourseName("");
    setCourseDesc("");
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName) {
      toast.error("Please enter batch name.");
      return;
    }
    addBatch({
      name: batchName,
      courseId: selectedCourseId,
      timing: batchTiming,
      days: batchDays,
      instructor: batchInstructor,
      capacity: Number(batchCapacity),
    });
    toast.success(`Batch ${batchName} created successfully`);
    setBatchModalOpen(false);
    setBatchName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Courses &amp; Classroom Batches
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage academic curriculum, class schedules, instructor allocations, and seat capacities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "courses" ? (
            <Button size="sm" variant="navy" onClick={() => setCourseModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add New Course
            </Button>
          ) : (
            <Button size="sm" variant="orange" onClick={() => setBatchModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Batch
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("batches")}
          className={`pb-3 transition-colors ${
            activeTab === "batches"
              ? "text-[#0754BD] border-b-2 border-[#0754BD]"
              : "text-[#64748B] hover:text-[#111827]"
          }`}
        >
          Classroom Batches ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 transition-colors ${
            activeTab === "courses"
              ? "text-[#0754BD] border-b-2 border-[#0754BD]"
              : "text-[#64748B] hover:text-[#111827]"
          }`}
        >
          Course Catalog ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("timetable")}
          className={`pb-3 transition-colors ${
            activeTab === "timetable"
              ? "text-[#0754BD] border-b-2 border-[#0754BD]"
              : "text-[#64748B] hover:text-[#111827]"
          }`}
        >
          Weekly Timetable Grid
        </button>
      </div>

      {/* TAB 1: BATCHES */}
      {activeTab === "batches" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((batch) => {
            const course = courses.find((c) => c.id === batch.courseId);
            const enrolled = students.filter((s) => s.batchId === batch.id && s.status === "Active");
            const fillPct = Math.round((enrolled.length / batch.capacity) * 100);

            return (
              <div
                key={batch.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle hover:border-[#0754BD]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue" size="sm">
                      {course?.code || "COURSE"}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#64748B]">{batch.id}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#0B2B5B] mb-1 font-heading">
                    {batch.name}
                  </h3>
                  <div className="text-xs text-[#64748B] mb-4">{course?.name}</div>

                  <div className="space-y-2 text-xs text-[#64748B] mb-5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#0754BD]" />
                      <span>{batch.timing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F58220]" />
                      <span>{batch.days}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instructor: <strong className="text-[#111827]">{batch.instructor}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="border-t border-[#F1F5F9] pt-4">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-[#64748B]">Enrollment Capacity</span>
                    <span className="text-[#111827]">
                      <strong>{enrolled.length}</strong> / {batch.capacity} Students ({fillPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fillPct >= 90
                          ? "bg-rose-500"
                          : fillPct >= 70
                          ? "bg-[#F58220]"
                          : "bg-[#0754BD]"
                      }`}
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: COURSES */}
      {activeTab === "courses" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const batchCount = batches.filter((b) => b.courseId === course.id).length;
            const studentCount = students.filter((s) => s.courseId === course.id).length;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EFF6FF] text-[#0754BD] border border-[#BFDBFE]">
                      {course.category}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#0B2B5B]">
                      {formatIndianCurrency(course.fee)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0B2B5B] font-heading mb-1">
                    {course.name}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="space-y-1.5 mb-5">
                    {course.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-[#111827]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#F1F5F9] pt-3 flex items-center justify-between text-xs text-[#64748B]">
                  <span>Duration: <strong className="text-[#111827]">{course.duration}</strong></span>
                  <span>{studentCount} Students ({batchCount} Batches)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: TIMETABLE */}
      {activeTab === "timetable" && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle">
          <div className="mb-4">
            <h3 className="font-bold text-base text-[#0B2B5B] font-heading">
              Weekly Classroom Schedule
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time daily lab allocation across morning, afternoon, and evening sessions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]">
                  <th className="p-3 font-semibold">Time Slot</th>
                  <th className="p-3 font-semibold">Batch Name</th>
                  <th className="p-3 font-semibold">Course</th>
                  <th className="p-3 font-semibold">Days</th>
                  <th className="p-3 font-semibold">Faculty</th>
                  <th className="p-3 font-semibold">Active Seats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {batches.map((batch) => {
                  const course = courses.find((c) => c.id === batch.courseId);
                  const enrolled = students.filter((s) => s.batchId === batch.id && s.status === "Active");
                  return (
                    <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[#0B2B5B] font-mono">{batch.timing}</td>
                      <td className="p-3 font-semibold text-[#111827]">{batch.name}</td>
                      <td className="p-3 text-[#64748B]">{course?.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                          {batch.days}
                        </span>
                      </td>
                      <td className="p-3 text-[#111827] font-medium">{batch.instructor}</td>
                      <td className="p-3 font-mono">
                        {enrolled.length} / {batch.capacity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Add New Computer Course
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Add a certificate or diploma course with fee structure and syllabus overview.
            </p>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PYTHON"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Basic & Office">Basic &amp; Office</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Design & DTP">Design &amp; DTP</option>
                    <option value="Programming">Programming</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Programming & Automation"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Course Fee (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={courseFee}
                    onChange={(e) => setCourseFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Course summary..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="navy" size="sm">
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Create Classroom Batch
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Set schedule time, faculty assignment, and maximum student intake capacity.
            </p>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Batch B"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Associated Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Timings</label>
                  <input
                    type="text"
                    value={batchTiming}
                    onChange={(e) => setBatchTiming(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Days</label>
                  <input
                    type="text"
                    value={batchDays}
                    onChange={(e) => setBatchDays(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Instructor</label>
                  <input
                    type="text"
                    value={batchInstructor}
                    onChange={(e) => setBatchInstructor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Intake Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={batchCapacity}
                    onChange={(e) => setBatchCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setBatchModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Create Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
