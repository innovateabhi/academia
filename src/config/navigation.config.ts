import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Receipt,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Award,
  IdCard,
  ShoppingBag,
  TrendingDown,
  Wallet,
  BarChart3,
  UserCheck,
  Send,
  Globe,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { DemoRole } from "@/types";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: "enquiries" | "reminders" | "overdue";
  requiredRoles?: DemoRole[];
}

export interface NavGroupConfig {
  id: string;
  title: string;
  items: NavItemConfig[];
}

export const PORTAL_NAV_GROUPS: NavGroupConfig[] = [
  {
    id: "overview",
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    ],
  },
  {
    id: "academics",
    title: "ACADEMIC MANAGEMENT",
    items: [
      { label: "Admissions", href: "/portal/enquiries", icon: MessageSquare, badgeKey: "enquiries" },
      { label: "Students", href: "/portal/students", icon: Users },
      { label: "Courses & Batches", href: "/portal/courses-batches", icon: BookOpen },
      { label: "Attendance", href: "/portal/attendance", icon: CalendarCheck },
      { label: "Examinations", href: "/portal/examinations", icon: GraduationCap },
      { label: "Student ID Cards", href: "/portal/id-cards", icon: IdCard },
      { label: "Certificates", href: "/portal/certificates", icon: Award },
    ],
  },
  {
    id: "finance",
    title: "BUSINESS & FINANCE",
    items: [
      { label: "Fees & Billing", href: "/portal/billing", icon: Receipt },
      { label: "CSC Service Billing", href: "/portal/csc-billing", icon: ShoppingBag },
      { label: "Expenses", href: "/portal/expenses", icon: TrendingDown },
      { label: "Daily Cashbook", href: "/portal/cashbook", icon: Wallet },
      { label: "Reports & Analytics", href: "/portal/reports", icon: BarChart3 },
    ],
  },
  {
    id: "admin",
    title: "ADMINISTRATION",
    items: [
      { label: "Staff Management", href: "/portal/staff", icon: UserCheck },
      { label: "WhatsApp Reminders", href: "/portal/reminders", icon: Send, badgeKey: "reminders" },
      { label: "Website Manager", href: "/portal/website-manager", icon: Globe },
      { label: "Activity History", href: "/portal/activity", icon: History },
      { label: "Settings", href: "/portal/settings", icon: Settings },
    ],
  },
];
