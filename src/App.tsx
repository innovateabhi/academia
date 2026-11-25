import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { WelcomePage } from "@/pages/WelcomePage";
import { WebsitePage } from "@/pages/website/WebsitePage";
import { PortalLayout } from "@/layouts/PortalLayout";
import { DashboardPage } from "@/pages/portal/DashboardPage";
import { StudentsPage } from "@/pages/portal/StudentsPage";
import { StudentProfilePage } from "@/pages/portal/StudentProfilePage";
import { AttendancePage } from "@/pages/portal/AttendancePage";
import { BillingPage } from "@/pages/portal/BillingPage";
import { EnquiriesPage } from "@/pages/portal/EnquiriesPage";
import { CoursesBatchesPage } from "@/pages/portal/CoursesBatchesPage";
import { ExaminationsPage } from "@/pages/portal/ExaminationsPage";
import { IdCardsPage } from "@/pages/portal/IdCardsPage";
import { CertificatesPage } from "@/pages/portal/CertificatesPage";
import { CscBillingPage } from "@/pages/portal/CscBillingPage";
import { ExpensesPage } from "@/pages/portal/ExpensesPage";
import { DailyCashbookPage } from "@/pages/portal/DailyCashbookPage";
import { ReportsPage } from "@/pages/portal/ReportsPage";
import { StaffManagementPage } from "@/pages/portal/StaffManagementPage";
import { RemindersPage } from "@/pages/portal/RemindersPage";
import { WebsiteManagerPage } from "@/pages/portal/WebsiteManagerPage";
import { ActivityPage } from "@/pages/portal/ActivityPage";
import { SettingsPage } from "@/pages/portal/SettingsPage";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Experience A: Demo Welcome Page */}
        <Route path="/" element={<WelcomePage />} />

        {/* Experience B: Public Business Website */}
        <Route path="/website" element={<WebsitePage />} />

        {/* Experience C: Business Management Portal */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentProfilePage />} />
          <Route path="courses-batches" element={<CoursesBatchesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="examinations" element={<ExaminationsPage />} />
          <Route path="id-cards" element={<IdCardsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="csc-billing" element={<CscBillingPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="cashbook" element={<DailyCashbookPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="staff" element={<StaffManagementPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="website-manager" element={<WebsiteManagerPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
        </Route>

        {/* Catch-all redirect to welcome page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
