import React, { useState } from "react";
import {
  CalendarCheck,
  CheckCheck,
  Save,
  Users,
  Clock,
  Calendar,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { formatIndianDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AttendanceStatus } from "@/types";

export function AttendancePage() {
  const store = useAcademyStore();
  const { batches, courses, students, attendance, saveBatchAttendance } = store;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || "");

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const activeCourse = courses.find((c) => c.id === activeBatch?.courseId);

  const batchStudents = students.filter(
    (s) => s.batchId === activeBatch?.id && (s.status === "Active" || s.status === "On Leave")
  );

  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  React.useEffect(() => {
    const existing = attendance.filter(
      (a) => a.date === selectedDate && a.batchId === activeBatch?.id
    );

    const initialMap: Record<string, AttendanceStatus> = {};
    batchStudents.forEach((st) => {
      const match = existing.find((e) => e.studentId === st.id);
      if (match) {
        initialMap[st.id] = match.status;
      } else {
        initialMap[st.id] = "Present";
      }
    });

    setStatusMap(initialMap);
  }, [selectedDate, selectedBatchId, attendance.length, batchStudents.length]);

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const nextMap: Record<string, AttendanceStatus> = {};
    batchStudents.forEach((st) => {
      nextMap[st.id] = "Present";
    });
    setStatusMap(nextMap);
    toast.info("All batch students marked as Present");
  };

  const handleSave = () => {
    if (!activeBatch || !activeCourse) return;

    const entries = batchStudents.map((st) => ({
      studentId: st.id,
      status: statusMap[st.id] || "Present",
    }));

    saveBatchAttendance(selectedDate, activeBatch.id, activeCourse.id, entries);
    toast.success(`Attendance saved for ${activeBatch.name}!`, {
      description: `${entries.length} roll-call records updated for ${formatIndianDate(selectedDate)}.`,
    });
  };

  const counts = {
    present: Object.values(statusMap).filter((v) => v === "Present").length,
    late: Object.values(statusMap).filter((v) => v === "Late").length,
    absent: Object.values(statusMap).filter((v) => v === "Absent").length,
    leave: Object.values(statusMap).filter((v) => v === "Leave").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider">
            Batch Operations
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#0B2B5B] tracking-tight mt-0.5">
            Daily Attendance Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllPresent}
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            Mark All Present
          </Button>
          <Button
            size="sm"
            variant="orange"
            onClick={handleSave}
            className="font-bold shadow-subtle"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Date & Batch Selectors */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-card">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Select Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.timing})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Roster Counters */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-white border border-[#BBF7D0] bg-[#F0FDF4] text-center shadow-subtle">
          <span className="text-[10px] font-bold text-[#15803D] uppercase block">Present</span>
          <span className="text-2xl font-extrabold text-[#15803D] font-heading tabular-nums block mt-0.5">
            {counts.present}
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-white border border-[#BFDBFE] bg-[#EFF6FF] text-center shadow-subtle">
          <span className="text-[10px] font-bold text-[#0754BD] uppercase block">Late</span>
          <span className="text-2xl font-extrabold text-[#0754BD] font-heading tabular-nums block mt-0.5">
            {counts.late}
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-white border border-[#FECACA] bg-[#FEF2F2] text-center shadow-subtle">
          <span className="text-[10px] font-bold text-[#DC2626] uppercase block">Absent</span>
          <span className="text-2xl font-extrabold text-[#DC2626] font-heading tabular-nums block mt-0.5">
            {counts.absent}
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-white border border-[#FDE68A] bg-[#FFFBEB] text-center shadow-subtle">
          <span className="text-[10px] font-bold text-[#D97706] uppercase block">Leave</span>
          <span className="text-2xl font-extrabold text-[#D97706] font-heading tabular-nums block mt-0.5">
            {counts.leave}
          </span>
        </div>
      </div>

      {/* Batch Attendance Table */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
        <div className="p-4 px-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0754BD]" />
            <span className="text-xs font-bold text-[#0B2B5B] font-heading">
              {activeBatch?.name} — {batchStudents.length} Active Students
            </span>
          </div>
          <Badge variant="blue" size="sm">
            {activeCourse?.name}
          </Badge>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {batchStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#94A3B8]">
              No active students enrolled in this batch.
            </div>
          ) : (
            batchStudents.map((st) => {
              const currentStatus = statusMap[st.id] || "Present";

              return (
                <div
                  key={st.id}
                  className="p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-[#111827]">{st.fullName}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {st.id} • {st.phone}
                    </div>
                  </div>

                  {/* Clean Accessible Toggle Controls */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, "Present")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        currentStatus === "Present"
                          ? "bg-[#15803D] text-white shadow-subtle"
                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, "Late")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        currentStatus === "Late"
                          ? "bg-[#0754BD] text-white shadow-subtle"
                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, "Absent")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        currentStatus === "Absent"
                          ? "bg-[#DC2626] text-white shadow-subtle"
                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, "Leave")}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        currentStatus === "Leave"
                          ? "bg-[#D97706] text-white shadow-subtle"
                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                      }`}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
