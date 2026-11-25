import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Search,
  Filter,
  User,
  Clock,
  Shield,
  Layers,
} from "lucide-react";
import { formatIndianDate } from "@/utils/formatters";

export function ActivityPage() {
  const activityLogs = useAcademyStore((s) => s.activityLogs);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");

  const modules = [
    "All",
    "Admissions",
    "Students",
    "Courses",
    "Batches",
    "Attendance",
    "Fees & Billing",
    "CSC Billing",
    "Expenses",
    "Cashbook",
    "Examinations",
    "Certificates",
    "ID Cards",
    "Reminders",
    "Website Manager",
    "Administration",
  ];

  const filteredLogs = (activityLogs || []).filter((log) => {
    const matchMod = selectedModule === "All" || log.module === selectedModule;
    const matchSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchMod && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Audit Trail &amp; Activity History
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Complete real-time ledger of academic registrations, payments, void actions, and administrative operations.
          </p>
        </div>

        <Badge variant="blue" size="lg">
          {activityLogs?.length || 0} Recorded Actions
        </Badge>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs bg-white text-[#111827]"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m === "All" ? "All Modules" : m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline Log List */}
        <div className="divide-y divide-[#F1F5F9] max-h-[600px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#64748B]">
              No activity logs found matching the filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#0754BD]">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase">
                      {log.module}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#111827]">{log.description}</div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#64748B] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0B2B5B]" />
                    <span className="font-medium text-[#111827]">{log.staffName}</span>
                    <span className="text-[10px] font-mono text-blue-700">({log.role})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
