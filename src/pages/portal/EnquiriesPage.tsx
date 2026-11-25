import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  UserCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { formatIndianDateTime } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { EnquiryStatus } from "@/types";

export function EnquiriesPage() {
  const navigate = useNavigate();
  const store = useAcademyStore();
  const { enquiries, courses, batches, updateEnquiryStatus, registerStudent } = store;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Conversion Modal State
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<(typeof enquiries)[0] | null>(null);
  const [guardianName, setGuardianName] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || "");
  const [initialPayment, setInitialPayment] = useState<number>(1500);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.includes(searchTerm) ||
      enq.interestedCourseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "All" || enq.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOpenConvert = (enq: (typeof enquiries)[0]) => {
    if (enq.status === "Converted") {
      toast.info("This enquiry is already enrolled as an active student.");
      return;
    }
    setSelectedEnquiry(enq);
    setGuardianName(`${enq.applicantName.split(" ")[1] || "Mondal"} Guardian (Sample)`);
    setIsConvertModalOpen(true);
  };

  const handleConvertStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const course = courses.find((c) => c.id === selectedEnquiry.interestedCourseId) || courses[0];

    try {
      const { student, receipt } = registerStudent(
        {
          fullName: selectedEnquiry.applicantName,
          phone: selectedEnquiry.phone,
          email: selectedEnquiry.email,
          guardianName,
          dateOfBirth: "2004-06-15",
          address: "Sample Locality, West Bengal",
          courseId: course.id,
          batchId: selectedBatchId,
          admissionDate: new Date().toISOString().slice(0, 10),
          totalFee: course.fee,
          initialPayment,
          paymentMethod: "Cash",
          status: "Active",
        },
        selectedEnquiry.id
      );

      toast.success(`Enquiry converted! Student ID: ${student.id}`, {
        description: receipt ? `Receipt ${receipt.receiptNumber} generated.` : undefined,
      });

      setIsConvertModalOpen(false);
      navigate(`/portal/students/${student.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to convert enquiry";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider">
            Admissions Pipeline
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#0B2B5B] tracking-tight mt-0.5">
            Admission Enquiries
          </h1>
        </div>

        <Link to="/website#admission">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Website Enquiry Form
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-card">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by applicant name, mobile, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-md border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
            >
              <option value="All">All Lead Statuses ({enquiries.length})</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Pipeline Cards */}
      <div className="space-y-3">
        {filteredEnquiries.length === 0 ? (
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-12 text-center text-xs text-[#94A3B8]">
            No admission enquiries matching your query.
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-card hover:border-[#0754BD]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#0B2B5B] font-heading">{enq.applicantName}</span>
                  <Badge
                    variant={
                      enq.status === "New"
                        ? "orange"
                        : enq.status === "Converted"
                        ? "success"
                        : enq.status === "Interested"
                        ? "blue"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {enq.status}
                  </Badge>
                  <span className="text-[10px] text-[#64748B] font-mono">{enq.id}</span>
                </div>

                <div className="text-xs text-[#475569] flex flex-wrap items-center gap-3 font-medium">
                  <span className="font-bold text-[#0754BD]">{enq.interestedCourseName}</span>
                  <span>•</span>
                  <span>Batch: {enq.preferredBatch}</span>
                  <span>•</span>
                  <span className="font-mono">{enq.phone}</span>
                </div>

                {enq.message && (
                  <p className="text-xs text-[#64748B] italic bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] max-w-2xl leading-relaxed">
                    "{enq.message}"
                  </p>
                )}

                <div className="text-[10px] text-[#94A3B8]">
                  Submitted: {formatIndianDateTime(enq.submittedAt)}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                {enq.status !== "Converted" ? (
                  <>
                    <select
                      value={enq.status}
                      onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                      className="text-xs rounded border border-[#CBD5E1] py-1.5 px-2 bg-white"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <Button
                      size="xs"
                      variant="orange"
                      onClick={() => handleOpenConvert(enq)}
                      className="h-8 font-bold"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Convert to Student
                    </Button>
                  </>
                ) : (
                  <Link to={`/portal/students/${enq.convertedStudentId}`}>
                    <Button size="xs" variant="outline" className="h-8">
                      View Enrolled Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Convert to Student Modal */}
      {isConvertModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2B5B]/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading">
                Convert Enquiry to Student Admission
              </h3>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertStudent} className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#111827]">{selectedEnquiry.applicantName}</div>
                <div className="text-[#64748B] text-[11px]">
                  {selectedEnquiry.phone} • {selectedEnquiry.interestedCourseName}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Guardian / Father Name *
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Assign Batch Schedule *
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] text-xs bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.timing})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Initial Fee Received (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={initialPayment}
                  onChange={(e) => setInitialPayment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-md border border-[#CBD5E1] font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsConvertModalOpen(false)}
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
