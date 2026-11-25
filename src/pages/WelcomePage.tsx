import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Users,
  CreditCard,
  CalendarCheck,
  Compass,
  Monitor,
  Sparkles,
  PhoneCall,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function WelcomePage() {
  const resetDemo = useAcademyStore((s) => s.resetDemo);
  const studentsCount = useAcademyStore((s) => s.students.length);
  const coursesCount = useAcademyStore((s) => s.courses.length);

  const handleReset = () => {
    if (window.confirm("Restore sample demonstration dataset to default state?")) {
      resetDemo();
      toast.success("Demonstration dataset reset to initial state");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#111827] flex flex-col justify-between selection:bg-[#F58220]/20 selection:text-[#0B2B5B]">
      {/* Top Banner Notice */}
      <div className="bg-[#0B2B5B] text-white px-4 py-2 text-xs border-b border-[#08234A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F58220] animate-pulse" />
            <span className="font-semibold">Personalized Software Solution Concept</span>
            <span className="text-blue-300">•</span>
            <span className="text-blue-100 truncate">Prepared for {businessConfig.identity.name}</span>
          </div>
          <div className="flex items-center gap-4 text-blue-200">
            <span className="hidden sm:inline">West Bengal, India</span>
            <button
              onClick={handleReset}
              className="text-white hover:text-[#F58220] text-xs inline-flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full flex-1">
        {/* Presentation Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#0754BD] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
            Proposed Digital Business Solution by Softrenix Technologies
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B2B5B] font-heading tracking-tight leading-tight">
            Your Academy. Intelligently Connected.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            A comprehensive, bespoke digital platform designed specifically for{" "}
            <strong className="text-[#111827]">{businessConfig.identity.name}</strong> to streamline student admissions, daily batch attendance, installment fee tracking, and professional web presence.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-[#64748B] font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0754BD]" /> {studentsCount} Enrolled Students
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#F58220]" /> {coursesCount} Career Courses
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#64748B]" /> West Bengal, India
            </span>
          </div>
        </div>

        {/* Three Primary Demonstration Experiences */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Experience 01: Public Business Website */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-card hover:shadow-elevated hover:border-[#0754BD]/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0754BD] font-mono">
                    Experience 01
                  </span>
                  <Badge variant="blue" size="sm">
                    Public Facing
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-[#0B2B5B] font-heading mb-1.5">
                  Public Business Website
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Interactive course showcase, CSC digital desk, and online admission lead form syncing directly to portal.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC]">
                <div className="rounded-lg border border-[#E2E8F0] overflow-hidden shadow-subtle group h-40 relative">
                  <img
                    src="/images/hero/hero-classroom.jpg"
                    alt="Computer training academy classroom preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B5B]/85 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold">Live Lead Engine &amp; Courses</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link to="/website">
                <Button size="sm" variant="orange" className="w-full justify-between font-bold">
                  <span>Explore Website</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Experience 02: Owner Management Portal */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-card hover:shadow-elevated hover:border-[#0754BD]/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B2B5B] font-mono">
                    Experience 02
                  </span>
                  <Badge variant="navy" size="sm">
                    Executive Control
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-[#0B2B5B] font-heading mb-1.5">
                  Owner Command Center
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Comprehensive financial analytics, student directories, batch schedules, CSC revenue, and website CMS.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC]">
                <div className="rounded-lg border border-[#E2E8F0] overflow-hidden shadow-subtle group h-40 relative">
                  <img
                    src="/images/hero/hero-lab.jpg"
                    alt="Management portal workstation overview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08234A]/85 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold">Revenue &amp; Academic Health</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link to="/portal">
                <Button size="sm" variant="navy" className="w-full justify-between font-bold">
                  <span>Launch Owner Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Experience 03: Staff Operational Workspaces */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-card hover:shadow-elevated hover:border-[#0754BD]/40 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                    Experience 03
                  </span>
                  <Badge variant="success" size="sm">
                    Staff Desks
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-[#0B2B5B] font-heading mb-1.5">
                  Role-Based Workspaces
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Simulate Receptionist front desk admissions, Instructor attendance &amp; exam roll-calls, or Accountant cashbook.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] space-y-2">
                <Link
                  to="/portal/csc-billing"
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#0754BD] flex items-center justify-between text-xs transition-colors block"
                >
                  <span className="font-semibold text-[#111827]">Receptionist: CSC Service Billing</span>
                  <span className="text-[10px] text-[#0754BD] font-bold">POS Desk &rarr;</span>
                </Link>
                <Link
                  to="/portal/attendance"
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#0754BD] flex items-center justify-between text-xs transition-colors block"
                >
                  <span className="font-semibold text-[#111827]">Instructor: 5-Sec Attendance</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Roll-Call &rarr;</span>
                </Link>
                <Link
                  to="/portal/cashbook"
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#0754BD] flex items-center justify-between text-xs transition-colors block"
                >
                  <span className="font-semibold text-[#111827]">Accountant: Daily Drawer Closing</span>
                  <span className="text-[10px] text-[#F58220] font-bold">Audit &rarr;</span>
                </Link>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link to="/portal/settings">
                <Button size="sm" variant="outline" className="w-full justify-between text-xs font-semibold">
                  <span>Switch Perspectives in Settings</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars Institutional Grid */}
        <div className="border-t border-[#E2E8F0] pt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0754BD] font-mono">
              Solution Benefits
            </span>
            <h3 className="text-2xl font-bold text-[#0B2B5B] font-heading mt-1">
              Four Interconnected Systems. Zero Database Complexity.
            </h3>
            <p className="text-xs text-[#64748B] mt-2">
              Everything works in your browser with LocalStorage persistence and instant data reactivity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#0754BD] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0B2B5B] mb-1">Student Management</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Centralized student profiles, batch assignments, and course enrollment records.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0B2B5B] mb-1">Batch Attendance</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                5-second batch roll calls with "Mark All Present" button and presence rate tracking.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F58220] flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0B2B5B] mb-1">Billing &amp; Fee Receipts</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                3-stage installment ledger, partial collections, and instant downloadable PDF receipts.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#E2E8F0] bg-white shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#0B2B5B] flex items-center justify-center mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0B2B5B] mb-1">24/7 Digital Presence</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Public course catalog, CSC helpdesk services, and direct admission lead capture.
              </p>
            </div>
          </div>
        </div>

        {/* Softrenix Solution Discussion CTA Card */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-[#0B2B5B] to-[#08234A] text-white p-8 md:p-10 shadow-elevated flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[#F58220] text-xs font-bold uppercase tracking-wider font-mono">
              Engineering Beyond Boundaries
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mt-1">
              Discuss Implementing This Solution
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Softrenix Technologies specializes in building fast, reliable, custom business software for computer academies, institutes, and local enterprises in West Bengal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a
              href={businessConfig.softrenix.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="orange" className="w-full font-bold">
                <span>Visit Softrenix Technologies</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="w-full sm:w-auto text-white border-blue-400/40 hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Reset Sample Data</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-5 px-6 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Personalized concept demonstration prepared for <strong>{businessConfig.identity.name}</strong>
          </div>
          <div>
            Developed by{" "}
            <a
              href={businessConfig.softrenix.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#0754BD] font-semibold hover:underline"
            >
              {businessConfig.softrenix.companyName}
            </a>{" "}
            — {businessConfig.softrenix.tagline}
          </div>
        </div>
      </footer>
    </div>
  );
}
