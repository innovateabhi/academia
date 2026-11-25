import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Receipt,
  MessageSquare,
  Globe,
  Home,
  UserPlus,
  CreditCard,
  X,
  Command as CommandIcon,
  ArrowRight,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Badge } from "@/components/ui/badge";

export function CommandPalette({
  isOpen,
  onClose,
  onOpenRegisterStudent,
  onOpenCollectFee,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterStudent?: () => void;
  onOpenCollectFee?: () => void;
}) {
  const navigate = useNavigate();
  const students = useAcademyStore((s) => s.students);
  const courses = useAcademyStore((s) => s.courses);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          const evt = new CustomEvent("open-command-palette");
          window.dispatchEvent(evt);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStudents = query.trim()
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase()) ||
            s.phone.includes(query)
        )
        .slice(0, 5)
    : [];

  const handleSelectRoute = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-popover border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200">
          <Search className="w-4 h-4 text-stone-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, search student, or jump to route..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs text-ink-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-stone-400 font-mono bg-stone-100 rounded border border-stone-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs space-y-4">
          {/* Quick Action Shortcuts */}
          <div>
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Operations &amp; Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenRegisterStudent) onOpenRegisterStudent();
                  else navigate("/portal/students");
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-forest-800" />
                  <span className="font-medium">Register New Student</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Admission</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenCollectFee) onOpenCollectFee();
                  else navigate("/portal/billing");
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-champagne-dark" />
                  <span className="font-medium">Record Fee Payment</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Receipt</span>
              </button>
            </div>
          </div>

          {/* Student Search Matches */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Matching Students
              </div>
              <div className="space-y-0.5">
                {filteredStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectRoute(`/portal/students/${st.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
                  >
                    <div>
                      <div className="font-semibold text-xs text-ink-900">{st.fullName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {st.id} • {st.phone}
                      </div>
                    </div>
                    <Badge variant="outline" size="sm">
                      View Profile
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          <div>
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Jump To Module
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleSelectRoute("/portal")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-stone-500" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/csc-billing")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <CreditCard className="w-4 h-4 text-[#F58220]" />
                <span className="font-semibold text-[#0B2B5B]">CSC Counter POS Billing</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/students")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <Users className="w-4 h-4 text-stone-500" />
                <span>Students Directory</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/courses-batches")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <Users className="w-4 h-4 text-stone-500" />
                <span>Courses &amp; Classroom Batches</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/attendance")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <CalendarCheck className="w-4 h-4 text-stone-500" />
                <span>Daily Batch Attendance</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/billing")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <Receipt className="w-4 h-4 text-stone-500" />
                <span>Fee Collection &amp; Receipts</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/cashbook")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Daily Cashbook &amp; Closing</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/reports")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <Receipt className="w-4 h-4 text-[#0754BD]" />
                <span>Reports &amp; Analytics (Excel/PDF)</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/enquiries")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <MessageSquare className="w-4 h-4 text-stone-500" />
                <span>Admission Enquiries</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/portal/settings")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left"
              >
                <CommandIcon className="w-4 h-4 text-stone-500" />
                <span>System Settings &amp; Roles</span>
              </button>

              <button
                onClick={() => handleSelectRoute("/website")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-ink-900 hover:bg-stone-100 transition-colors text-left border-t border-stone-100 mt-1 pt-2"
              >
                <Globe className="w-4 h-4 text-[#0754BD]" />
                <span className="font-medium text-[#0B2B5B]">Switch to Public Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
          <span>Navigate with arrow keys or click</span>
          <span className="flex items-center gap-1 font-mono">
            <kbd className="px-1 py-0.2 bg-white rounded border border-stone-200">Ctrl</kbd> +{" "}
            <kbd className="px-1 py-0.2 bg-white rounded border border-stone-200">K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
