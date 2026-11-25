import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  RefreshCw,
  Building,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { ROLES_CONFIG } from "@/config/roles.config";
import { toast } from "sonner";
import type { DemoRole } from "@/types";

export function SettingsPage() {
  const settings = useAcademyStore((s) => s.settings);
  const updateSettings = useAcademyStore((s) => s.updateSettings);
  const resetDemo = useAcademyStore((s) => s.resetDemo);
  const setActiveRole = useAcademyStore((s) => s.setActiveRole);

  const [receiptPrefix, setReceiptPrefix] = useState(settings.receiptPrefix || "SVCA-REC");
  const [cscPrefix, setCscPrefix] = useState(settings.cscReceiptPrefix || "CSC-POS");
  const [studentPrefix, setStudentPrefix] = useState(settings.studentIdPrefix || "STU");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      receiptPrefix,
      cscReceiptPrefix: cscPrefix,
      studentIdPrefix: studentPrefix,
    });
    toast.success("Settings updated successfully");
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all demo data? This will restore the initial 60+ student records, sample attendance, and financial ledgers."
      )
    ) {
      resetDemo();
      toast.success("Demonstration dataset reset to initial state");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            System &amp; Demonstration Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Configure business identity metadata, invoice number prefixes, demonstration roles, and dataset restoration.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleReset} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Reset Demo Data
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Settings (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* Section 1: Business Profile Overview */}
            <div>
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0754BD]" />
                Verified Business Identity
              </h3>

              <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0] space-y-2 text-[#64748B]">
                <div>
                  Academy Name: <strong className="text-[#111827]">{businessConfig.identity.name}</strong>
                </div>
                <div>
                  Short Brand Name: <strong className="text-[#111827]">{businessConfig.identity.shortName}</strong>
                </div>
                <div>
                  Address: <span className="text-[#111827]">{businessConfig.contact.fullAddress}</span>
                </div>
                <div>
                  Telephone: <span className="text-[#111827]">{businessConfig.contact.phoneDisplay}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Google Business Profile Integration
                </div>
              </div>
            </div>

            {/* Section 2: Document & Numbering Prefixes */}
            <div className="border-t border-[#F1F5F9] pt-5">
              <h3 className="font-bold text-sm text-[#0B2B5B] font-heading mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#F58220]" />
                Receipt &amp; Document Numbering
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">
                    Student Fee Receipt
                  </label>
                  <input
                    type="text"
                    value={receiptPrefix}
                    onChange={(e) => setReceiptPrefix(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">
                    CSC POS Receipt
                  </label>
                  <input
                    type="text"
                    value={cscPrefix}
                    onChange={(e) => setCscPrefix(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">
                    Student ID Prefix
                  </label>
                  <input
                    type="text"
                    value={studentPrefix}
                    onChange={(e) => setStudentPrefix(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <Button type="submit" variant="navy" size="sm">
                Save Preferences
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Demonstration Role Switcher (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-bold text-sm text-[#0B2B5B] font-heading flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Demonstration Role Switcher
            </h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Switch perspective to show how different staff members experience the platform.
            </p>
          </div>

          <div className="space-y-2.5">
            {(["owner", "receptionist", "instructor", "accountant"] as DemoRole[]).map((r) => {
              const cfg = ROLES_CONFIG[r];
              const isCurrent = settings.activeRole === r;

              return (
                <div
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    toast.success(`Active demonstration role switched to: ${cfg.label}`);
                  }}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-[#EFF6FF] border-[#0754BD] shadow-subtle"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0B2B5B] font-heading">
                      {cfg.label}
                    </span>
                    <Badge variant={isCurrent ? "blue" : "neutral"} size="sm">
                      {cfg.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    {cfg.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-800 space-y-1">
            <div className="font-bold">Demonstration Notice:</div>
            <div>
              All four roles share the identical unified local data layer. For example, when a receptionist registers a student or takes a fee, the accountant and owner immediately see the update.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
