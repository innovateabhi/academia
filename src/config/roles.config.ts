import type { DemoRole } from "@/types";

export interface RoleConfig {
  id: DemoRole;
  label: string;
  badge: string;
  description: string;
  defaultRoute: string;
  allowedNavHrefs: string[];
}

export const ROLES_CONFIG: Record<DemoRole, RoleConfig> = {
  owner: {
    id: "owner",
    label: "Academy Director / Owner",
    badge: "Full Access",
    description: "Complete executive control over academic, financial, administrative, and public website operations.",
    defaultRoute: "/portal",
    allowedNavHrefs: [
      "/portal",
      "/portal/enquiries",
      "/portal/students",
      "/portal/courses-batches",
      "/portal/attendance",
      "/portal/examinations",
      "/portal/id-cards",
      "/portal/certificates",
      "/portal/billing",
      "/portal/csc-billing",
      "/portal/expenses",
      "/portal/cashbook",
      "/portal/reports",
      "/portal/staff",
      "/portal/reminders",
      "/portal/website-manager",
      "/portal/activity",
      "/portal/settings",
    ],
  },
  receptionist: {
    id: "receptionist",
    label: "Senior Receptionist",
    badge: "Front Desk",
    description: "Handle student admission enquiries, student directory, fee collections, CSC service billing, and ID card issuing.",
    defaultRoute: "/portal/enquiries",
    allowedNavHrefs: [
      "/portal",
      "/portal/enquiries",
      "/portal/students",
      "/portal/courses-batches",
      "/portal/billing",
      "/portal/csc-billing",
      "/portal/id-cards",
      "/portal/reminders",
      "/portal/activity",
      "/portal/settings",
    ],
  },
  instructor: {
    id: "instructor",
    label: "Faculty / Instructor",
    badge: "Academics",
    description: "Manage assigned classroom batches, 5-second daily attendance roll-calls, tests, examinations, and grade evaluation.",
    defaultRoute: "/portal/attendance",
    allowedNavHrefs: [
      "/portal",
      "/portal/students",
      "/portal/courses-batches",
      "/portal/attendance",
      "/portal/examinations",
      "/portal/activity",
      "/portal/settings",
    ],
  },
  accountant: {
    id: "accountant",
    label: "Accounts & Financial Officer",
    badge: "Finance Desk",
    description: "Track student course fee balances, receipts, daily cashbook movements, operational expenses, and financial reports.",
    defaultRoute: "/portal/billing",
    allowedNavHrefs: [
      "/portal",
      "/portal/billing",
      "/portal/csc-billing",
      "/portal/expenses",
      "/portal/cashbook",
      "/portal/reports",
      "/portal/reminders",
      "/portal/activity",
      "/portal/settings",
    ],
  },
};
