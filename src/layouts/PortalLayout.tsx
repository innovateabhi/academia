import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Globe,
  Home,
  RefreshCw,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { PORTAL_NAV_GROUPS } from "@/config/navigation.config";
import { ROLES_CONFIG } from "@/config/roles.config";
import { toast } from "sonner";
import { formatIndianDate } from "@/utils/formatters";
import type { DemoRole } from "@/types";

export function PortalLayout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  const resetDemo = useAcademyStore((s) => s.resetDemo);
  const activeRole = useAcademyStore((s) => s.settings.activeRole || "owner");
  const setActiveRole = useAcademyStore((s) => s.setActiveRole);

  const pendingEnquiriesCount = useAcademyStore(
    (s) => s.enquiries.filter((e) => e.status === "New" || e.status === "Interested").length
  );
  const pendingRemindersCount = useAcademyStore(
    (s) => s.feeAccounts.filter((fa) => fa.outstandingBalance > 0).length
  );

  // Automatically scroll main workspace back to top on every route change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname, location.search]);

  const handleNavClick = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
      mainContentRef.current.scrollTop = 0;
    }
    setMobileNavOpen(false);
  };

  useEffect(() => {
    const handleOpenPalette = () => setCommandPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpenPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenPalette);
  }, []);

  const handleReset = () => {
    if (window.confirm("Reset all student records, attendance, and fee history to default sample dataset?")) {
      resetDemo();
      toast.success("Demonstration dataset reset to initial state");
    }
  };

  const currentRoleConfig = ROLES_CONFIG[activeRole] || ROLES_CONFIG.owner;

  // Filter navigation groups according to current role permissions
  const visibleGroups = PORTAL_NAV_GROUPS.map((group) => {
    const visibleItems = group.items.filter((item) =>
      currentRoleConfig.allowedNavHrefs.includes(item.href)
    );
    return {
      ...group,
      items: visibleItems,
    };
  }).filter((group) => group.items.length > 0);

  // Compute breadcrumb title from path
  const pathSegment = location.pathname.split("/").filter(Boolean)[1] || "dashboard";
  const pageTitle = pathSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="h-screen bg-[#F4F6F9] flex flex-col md:flex-row text-[#111827] font-sans selection:bg-[#F58220]/20 selection:text-[#0B2B5B] overflow-hidden">
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Deep Navy Sidebar (Stationary Fixed Layout) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B2B5B] text-white shrink-0 justify-between border-r border-[#08234A] h-full overflow-y-auto">
        <div>
          {/* Academy Brand Section */}
          <div className="p-4 border-b border-[#0F3875] flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="SVCA Logo"
              className="w-9 h-9 rounded-lg shrink-0 object-contain shadow-subtle"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-white truncate font-heading leading-tight tracking-wide">
                {businessConfig.identity.shortName}
              </div>
              <div className="text-[10px] text-blue-200 font-mono">Management Portal</div>
            </div>
          </div>

          {/* Role Status Tag */}
          <div className="px-3 pt-3">
            <div className="p-2.5 rounded-lg bg-[#08234A] border border-[#0F3875] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-semibold text-[11px] truncate max-w-[130px]">
                  {currentRoleConfig.label}
                </span>
              </div>
              <Badge variant="blue" size="sm" className="text-[9px] px-1 py-0">
                {currentRoleConfig.badge}
              </Badge>
            </div>
          </div>

          {/* Quick Command Trigger */}
          <div className="p-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#08234A] hover:bg-[#051630] border border-[#0F3875] text-blue-200 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">Command Palette</span>
              </div>
              <kbd className="text-[9px] font-mono bg-[#0B2B5B] px-1 py-0.5 rounded border border-[#0F3875] text-blue-200">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <div className="p-3 space-y-4">
            {visibleGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                <div className="text-[10px] font-bold text-blue-300 font-mono tracking-wider px-3 pb-1">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/portal"
                      ? location.pathname === "/portal"
                      : location.pathname.startsWith(item.href);

                  let badgeCount: number | undefined;
                  if (item.badgeKey === "enquiries" && pendingEnquiriesCount > 0) {
                    badgeCount = pendingEnquiriesCount;
                  } else if (item.badgeKey === "reminders" && pendingRemindersCount > 0) {
                    badgeCount = pendingRemindersCount;
                  }

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#0754BD] text-white shadow-subtle font-semibold"
                          : "text-blue-100 hover:bg-[#0F3875] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {badgeCount !== undefined && (
                        <span className="bg-[#F58220] text-white font-bold px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#0F3875] space-y-1 text-xs">
          <Link
            to="/website"
            className="flex items-center gap-2.5 text-blue-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#0F3875] transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#F58220]" />
            <span className="text-[11px]">Public Website</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2.5 text-blue-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#0F3875] transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Welcome Hub</span>
          </Link>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-start gap-2.5 text-blue-200 hover:text-[#F58220] px-3 py-1.5 rounded-lg hover:bg-[#0F3875] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset Demo Dataset</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame (Independent Scroll Area) */}
      <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-subtle shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#111827] hover:bg-slate-100"
              aria-label="Open Mobile Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-[#0754BD] uppercase font-mono tracking-wider hidden sm:inline">
                  Portal Desk
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-[#64748B] flex items-center gap-1 text-[11px]">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <strong className="text-[#111827] font-semibold">{pageTitle}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Demonstration Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0B2B5B] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#0754BD]" />
                <span className="hidden sm:inline">Role: {currentRoleConfig.label}</span>
                <span className="sm:hidden">{currentRoleConfig.badge}</span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-2 z-50 text-xs">
                  <div className="px-2 py-1.5 font-bold text-[10px] text-[#64748B] uppercase tracking-wider">
                    Switch Demonstration Perspective
                  </div>
                  {(["owner", "receptionist", "instructor", "accountant"] as DemoRole[]).map((r) => {
                    const cfg = ROLES_CONFIG[r];
                    const isSelected = activeRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setActiveRole(r);
                          setRoleMenuOpen(false);
                          toast.success(`Switched role to: ${cfg.label}`);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                          isSelected ? "bg-[#EFF6FF] text-[#0754BD] font-bold" : "hover:bg-slate-50 text-[#111827]"
                        }`}
                      >
                        <div>
                          <div>{cfg.label}</div>
                          <div className="text-[10px] text-[#64748B] font-normal">{cfg.badge}</div>
                        </div>
                        {isSelected && <Badge variant="blue" size="sm">Active</Badge>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-mono text-[#64748B]">
              <span>{formatIndianDate(new Date().toISOString().slice(0, 10))}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCommandPaletteOpen(true)}
              className="text-xs hidden sm:flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-[#0754BD]" />
              <span>Search</span>
            </Button>
          </div>
        </header>

        {/* Content Outlet */}
        <main key={location.pathname} className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E2E8F0] bg-white py-3 px-6 text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div>
            Personalized Demonstration • <strong>{businessConfig.identity.name}</strong> (West Bengal)
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> LocalStorage Synced
            </span>
            <span>•</span>
            <a
              href={businessConfig.softrenix.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#0754BD] hover:underline font-semibold"
            >
              Softrenix Technologies
            </a>
          </div>
        </footer>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-[#0B2B5B]/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative w-72 bg-[#0B2B5B] text-white flex flex-col justify-between p-5 z-10 shadow-2xl overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#0F3875] mb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/favicon.svg"
                      alt="SVCA Logo"
                      className="w-8 h-8 rounded-lg shrink-0 object-contain shadow-subtle"
                    />
                    <span className="font-bold text-sm text-white font-heading">
                      {businessConfig.identity.shortName}
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1 rounded text-blue-200 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleGroups.map((group) => (
                    <div key={group.id} className="space-y-1">
                      <div className="text-[10px] font-bold text-blue-300 font-mono tracking-wider px-3 pb-1">
                        {group.title}
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          item.href === "/portal"
                            ? location.pathname === "/portal"
                            : location.pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={handleNavClick}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                              isActive ? "bg-[#0754BD] text-white font-semibold" : "text-blue-100 hover:bg-[#0F3875]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#0F3875] space-y-2 text-xs">
                <Link
                  to="/website"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-blue-200 hover:text-white py-1"
                >
                  Visit Public Website
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="block text-blue-200 hover:text-white py-1"
                >
                  Welcome Hub
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
