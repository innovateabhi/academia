import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Download,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { formatINR, formatIndianDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { StudentStatus } from "@/types";

export function StudentsPage() {
  const store = useAcademyStore();
  const { students, courses, batches, feeAccounts, registerStudent } = store;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("2004-05-15");
  const [address, setAddress] = useState("Station Road, Ward 4 (Sample)");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [batchId, setBatchId] = useState(batches[0]?.id || "");
  const [totalFee, setTotalFee] = useState<number>(courses[0]?.fee || 4500);
  const [initialPayment, setInitialPayment] = useState<number>(1500);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Bank Transfer">("Cash");
  const [status] = useState<StudentStatus>("Active");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesCourse = selectedCourse === "All" || s.courseId === selectedCourse;
    const matchesStatus = selectedStatus === "All" || s.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleCourseChange = (newCourseId: string) => {
    setCourseId(newCourseId);
    const crs = courses.find((c) => c.id === newCourseId);
    if (crs) {
      setTotalFee(crs.fee);
      setInitialPayment(Math.min(1500, crs.fee));
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter student full name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      toast.error("Enter a valid 10-digit sample mobile number");
      return;
    }
    if (initialPayment > totalFee) {
      toast.error("Initial payment cannot exceed total course fee");
      return;
    }

    try {
      const { student, receipt } = registerStudent({
        fullName,
        phone,
        email,
        guardianName,
        dateOfBirth,
        address,
        courseId,
        batchId,
        admissionDate: new Date().toISOString().slice(0, 10),
        totalFee,
        initialPayment,
        paymentMethod,
        status,
      });

      toast.success(`Student enrolled! ID: ${student.id}`, {
        description: receipt
          ? `Receipt ${receipt.receiptNumber} issued for ₹${initialPayment}.`
          : "Created with pending initial fee.",
      });

      setIsAddModalOpen(false);
      setFullName("");
      setPhone("");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register student";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider">
            Academic Roster
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#0B2B5B] tracking-tight mt-0.5">
            Student Management
          </h1>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="orange"
          size="sm"
          className="font-bold shadow-subtle"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Enroll New Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-card">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by student name, ID or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            />
          </div>

          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            >
              <option value="All">All Courses ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            >
              <option value="All">All Student Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Leave">On Leave</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clean Professional Data Table */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Student ID &amp; Name</th>
                <th className="py-3 px-4">Course &amp; Batch</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Admission</th>
                <th className="py-3 px-4">Fee Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    No student records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const course = courses.find((c) => c.id === student.courseId);
                  const batch = batches.find((b) => b.id === student.batchId);
                  const fee = feeAccounts.find((fa) => fa.studentId === student.id);

                  return (
                    <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/portal/students/${student.id}`}
                          className="font-bold text-[#0B2B5B] hover:text-[#0754BD] transition-colors"
                        >
                          {student.fullName}
                        </Link>
                        <div className="text-[10px] text-[#64748B] font-mono">{student.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#111827]">{course?.code || "Course"}</div>
                        <div className="text-[11px] text-[#64748B]">{batch?.name || "Batch"}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#111827] font-semibold">{student.phone}</div>
                        <div className="text-[11px] text-[#64748B]">{student.guardianName} (G)</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {formatIndianDate(student.admissionDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        {fee ? (
                          <div>
                            <Badge
                              variant={
                                fee.status === "Fully Paid"
                                  ? "success"
                                  : fee.status === "Partially Paid"
                                  ? "blue"
                                  : fee.status === "Overdue"
                                  ? "danger"
                                  : "warning"
                              }
                              size="sm"
                            >
                              {fee.status}
                            </Badge>
                            <div className="text-[10px] text-[#64748B] mt-0.5 tabular-nums font-mono">
                              Due: {formatINR(fee.outstandingBalance)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            student.status === "Active"
                              ? "success"
                              : student.status === "Completed"
                              ? "default"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/portal/students/${student.id}`}>
                          <Button size="xs" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-8">
            <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0B2B5B] font-heading">
                  Student Admission &amp; Enrollment
                </h2>
                <p className="text-xs text-[#64748B]">
                  Creates student profile, allocates fee account, and registers in the batch roster.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanushree Mondal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Sample Contact Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number (e.g. 9832154321)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Guardian / Father's Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biren Mondal"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Sample Locality / Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Market Para, Ward 5"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Enrolling Course *
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({formatINR(c.fee)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Assigned Batch *
                  </label>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full text-xs rounded-md border border-[#CBD5E1] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.timing})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee & Initial Payment Settings */}
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-3">
                <span className="text-xs font-bold text-[#0B2B5B] block">
                  Fee Account &amp; Initial Receipt
                </span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Total Course Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={totalFee}
                      onChange={(e) => setTotalFee(Number(e.target.value))}
                      className="w-full text-xs rounded border border-[#CBD5E1] p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Initial Paid Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={totalFee}
                      value={initialPayment}
                      onChange={(e) => setInitialPayment(Number(e.target.value))}
                      className="w-full text-xs rounded border border-[#CBD5E1] p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "Cash" | "UPI" | "Bank Transfer")}
                      className="w-full text-xs rounded border border-[#CBD5E1] p-2 bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="orange" size="sm" className="font-bold">
                  Confirm Admission &amp; Enrol
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
