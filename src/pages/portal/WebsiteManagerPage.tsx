import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function WebsiteManagerPage() {
  const websiteContent = useAcademyStore((s) => s.websiteContent);
  const updateWebsiteContent = useAcademyStore((s) => s.updateWebsiteContent);
  const restoreWebsiteContent = useAcademyStore((s) => s.restoreWebsiteContent);

  const [announcement, setAnnouncement] = useState(websiteContent.announcement);
  const [heroHeadline, setHeroHeadline] = useState(websiteContent.heroHeadline);
  const [heroDescription, setHeroDescription] = useState(websiteContent.heroDescription);
  const [ctaText, setCtaText] = useState(websiteContent.ctaText);
  const [aboutText, setAboutText] = useState(websiteContent.aboutText);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent({
      announcement,
      heroHeadline,
      heroDescription,
      ctaText,
      aboutText,
    });
    toast.success("Website changes published! Check /website to view updates.");
  };

  const handleRestore = () => {
    if (window.confirm("Restore official default website copy?")) {
      restoreWebsiteContent();
      const fresh = useAcademyStore.getState().websiteContent;
      setAnnouncement(fresh.announcement);
      setHeroHeadline(fresh.heroHeadline);
      setHeroDescription(fresh.heroDescription);
      setCtaText(fresh.ctaText);
      setAboutText(fresh.aboutText);
      toast.success("Default website copy restored.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            Website Content Manager (CMS)
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Empower the academy owner to update announcements, admission banners, and course headlines without developer assistance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleRestore}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Restore Defaults
          </Button>

          <Link to="/website" target="_blank">
            <Button size="sm" variant="orange">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Preview Live Website
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle">
          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#111827]">
                  Top Announcement Strip Banner
                </label>
                <span className="text-[10px] text-[#64748B]">Appears at very top of website</span>
              </div>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#111827]">
                Homepage Main Hero Headline
              </label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#111827]">
                Homepage Hero Supporting Description
              </label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-[#111827]">
                  Admission CTA Button Label
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#111827]">
                  Publish Status
                </label>
                <div className="pt-2">
                  <Badge variant={websiteContent.isCustomized ? "orange" : "success"}>
                    {websiteContent.isCustomized ? "Customized Locally" : "Default Pristine"}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#111827]">
                About Academy Introduction Paragraph
              </label>
              <textarea
                rows={4}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button type="submit" variant="navy" size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Publish Demo Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live In-Portal Preview Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-[#0B2B5B] font-heading flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#0754BD]" />
              Live Website Hero Preview
            </h3>
            <Badge variant="blue" size="sm">
              Instant Sync
            </Badge>
          </div>

          {/* Mini Mock Browser Window */}
          <div className="rounded-lg border border-slate-300 overflow-hidden shadow-card">
            {/* Mock Browser Header */}
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-[#64748B] font-mono ml-2">svca.edu.in</span>
            </div>

            {/* Announcement Banner */}
            <div className="bg-[#0B2B5B] text-white px-3 py-1.5 text-[10px] text-center font-medium truncate">
              {announcement}
            </div>

            {/* Hero Simulation */}
            <div className="p-4 bg-gradient-to-b from-[#F4F6F9] to-white space-y-2.5 text-center">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0754BD] font-bold text-[9px]">
                Admissions Open 2026
              </span>

              <h4 className="font-extrabold text-sm text-[#0B2B5B] font-heading leading-tight">
                {heroHeadline}
              </h4>

              <p className="text-[10px] text-[#64748B] leading-relaxed line-clamp-3">
                {heroDescription}
              </p>

              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-[#F58220] text-white font-bold text-[10px] shadow-subtle">
                  {ctaText}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            All edits update the public website at <strong className="text-[#111827]">/website</strong> immediately through the shared Zustand data layer and persist safely in LocalStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
