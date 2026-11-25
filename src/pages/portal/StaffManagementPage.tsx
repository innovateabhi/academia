import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Shield,
  BookOpen,
  Calendar,
} from "lucide-react";
import { formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import type { DemoRole } from "@/types";

export function StaffManagementPage() {
  const staff = useAcademyStore((s) => s.staff);
  const batches = useAcademyStore((s) => s.batches);
  const addStaffMember = useAcademyStore((s) => s.addStaffMember);
  const activeRole = useAcademyStore((s) => s.settings.activeRole);
  const setActiveRole = useAcademyStore((s) => s.setActiveRole);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<DemoRole>("instructor");
  const [designation, setDesignation] = useState("Faculty Instructor");

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter staff name and phone number.");
      return;
    }
    addStaffMember({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone,
      role,
      designation,
      assignedBatches: ["BAT-M1"],
      joiningDate: new Date().toISOString().slice(0, 10),
      status: "Active",
    });
    toast.success(`Staff member ${name} added successfully`);
    setAddModalOpen(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Staff Directory &amp; Roles
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage instructors, receptionists, accounts personnel, and classroom batch allocations.
          </p>
        </div>

        <Button size="sm" variant="orange" onClick={() => setAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map((member) => {
          const isCurrentActive = member.role === activeRole;
          const assignedBatchNames = batches
            .filter((b) => member.assignedBatches.includes(b.id))
            .map((b) => b.name);

          return (
            <div
              key={member.id}
              className={`bg-white rounded-xl border p-5 shadow-subtle flex flex-col justify-between transition-all ${
                isCurrentActive ? "border-[#0754BD] ring-1 ring-[#0754BD]" : "border-[#E2E8F0]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={member.role === "owner" ? "navy" : member.role === "instructor" ? "blue" : "orange"}>
                    {member.role.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#64748B]">{member.id}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B2B5B] text-white flex items-center justify-center font-bold text-base font-heading shrink-0 shadow-subtle">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0B2B5B] font-heading leading-tight">
                      {member.name}
                    </h3>
                    <div className="text-xs text-[#64748B]">{member.designation}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#64748B] mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#0754BD]" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Joined: {formatIndianDate(member.joiningDate)}</span>
                  </div>
                </div>

                {member.role === "instructor" && (
                  <div className="border-t border-[#F1F5F9] pt-3 text-xs">
                    <span className="text-[#64748B] block mb-1 font-semibold">Assigned Batches:</span>
                    <div className="flex flex-wrap gap-1">
                      {assignedBatchNames.length > 0 ? (
                        assignedBatchNames.map((bn, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-[#111827] font-medium"
                          >
                            {bn}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#94A3B8]">No batches assigned</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#F1F5F9] pt-4 mt-4 flex items-center justify-between">
                <Button
                  size="sm"
                  variant={isCurrentActive ? "navy" : "outline"}
                  onClick={() => {
                    setActiveRole(member.role);
                    toast.success(`Switched role to ${member.role.toUpperCase()}`);
                  }}
                  className="w-full text-xs font-semibold"
                >
                  {isCurrentActive ? "Active Demo Role" : `Switch to ${member.role.toUpperCase()}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD STAFF MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0B2B5B] mb-1 font-heading">
              Add New Staff Member
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Register instructor, receptionist, or accountant profile.
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subir Karmakar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="instructor">Instructor</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="accountant">Accountant</option>
                    <option value="owner">Owner / Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="98300..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Designation Title</label>
                <input
                  type="text"
                  placeholder="e.g. Faculty — Web Designing & Coding"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm">
                  Add Staff
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
