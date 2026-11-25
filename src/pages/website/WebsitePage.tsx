import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileCheck2,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
  ExternalLink,
  Menu,
  X,
  Send,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Printer,
  Receipt,
  IdCard,
  Landmark,
  BookOpen,
  Award,
  Users,
  Compass,
  Laptop,
} from "lucide-react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { businessConfig } from "@/config/business.config";
import { formatINR } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function WebsitePage() {
  const courses = useAcademyStore((s) => s.courses);
  const submitEnquiry = useAcademyStore((s) => s.submitEnquiry);
  const websiteContent = useAcademyStore((s) => s.websiteContent);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Form State
  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interestedCourseId, setInterestedCourseId] = useState(courses[0]?.id || "");
  const [preferredBatch, setPreferredBatch] = useState("Morning (08:00 AM – 09:30 AM)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lightbox Modal for Gallery
  const [activeLightboxImg, setActiveLightboxImg] = useState<{
    src: string;
    caption: string;
    category: string;
  } | null>(null);

  const heroSlides = [
    {
      image: "/images/hero/hero-classroom.jpg",
      title: websiteContent?.heroHeadline || "Upgrade Your Computer Skills for a Better Career",
      subtitle:
        websiteContent?.heroDescription ||
        "Join job-ready certification tracks in DCA, TallyPrime with GST Billing, and graphic design with daily 1:1 computer workstation practice in West Bengal.",
      highlight: "New Batches Open This Week",
    },
    {
      image: "/images/hero/hero-lab.jpg",
      title: "Hands-on Practical Computer Laboratory",
      subtitle:
        "Learn essential office productivity, accounting software, and typing speed from friendly instructors with bilingual support in Bengali and English.",
      highlight: "100% Practical Workstation Sessions",
    },
    {
      image: "/images/services/csc-service.jpg",
      title: "Authorized Common Services Centre (CSC) Helpdesk",
      subtitle:
        "Single-window citizen assistance for online application forms, document scanning, government portal submissions, and utility bill clearing.",
      highlight: "Digital India Citizen Service Hub",
    },
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];

  // Helper to get course photograph
  const getCourseImage = (code: string) => {
    switch (code) {
      case "DCA":
        return "/images/courses/dca.jpg";
      case "TALLY":
        return "/images/courses/tally.jpg";
      case "DTP":
        return "/images/courses/dtp.jpg";
      case "ADCA":
        return "/images/courses/adca.jpg";
      case "BCC":
      default:
        return "/images/courses/bcc.jpg";
    }
  };

  const handleFillSample = () => {
    setApplicantName("Amitava Chakraborty (Sample)");
    setPhone("9832109876");
    setEmail("amitava.sample@gmail.com");
    if (courses[0]) setInterestedCourseId(courses[0].id);
    setPreferredBatch("Morning (08:00 AM – 09:30 AM)");
    setMessage("Interested in learning MS Excel & office automation for competitive exams.");
    toast.info("Sample demo details prefilled in enquiry form");
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      toast.error("Please enter applicant name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit sample mobile number (starting with 6-9)");
      return;
    }

    setIsSubmitting(true);
    try {
      const enq = submitEnquiry({
        applicantName,
        phone,
        email,
        interestedCourseId,
        preferredBatch,
        message,
      });

      toast.success(`Enquiry submitted! ID: ${enq.id}`, {
        description: "This enquiry is now live inside your Management Portal dashboard.",
      });

      setApplicantName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to submit sample enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCscIcon = (iconName: string) => {
    switch (iconName) {
      case "FileCheck2":
        return <FileCheck2 className="w-5 h-5 text-[#0754BD]" />;
      case "GraduationCap":
        return <GraduationCap className="w-5 h-5 text-[#0754BD]" />;
      case "Receipt":
        return <Receipt className="w-5 h-5 text-[#F58220]" />;
      case "Printer":
        return <Printer className="w-5 h-5 text-[#0B2B5B]" />;
      case "IdCard":
        return <IdCard className="w-5 h-5 text-[#0754BD]" />;
      case "Landmark":
        return <Landmark className="w-5 h-5 text-[#15803D]" />;
      default:
        return <FileCheck2 className="w-5 h-5 text-[#0754BD]" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#F58220]/20 selection:text-[#0B2B5B]">
      {/* 1. TOP INFORMATION BAR (Navy Header) */}
      <div className="bg-[#0B2B5B] text-white text-xs py-2 px-4 sm:px-8 border-b border-[#08234A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
          {/* Left contact info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
              {businessConfig.contact.fullAddress}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F58220]" />
              Mon – Sat: 08:00 AM – 08:00 PM
            </span>
          </div>

          {/* Right contact number & quick demo link */}
          <div className="flex items-center gap-4 text-blue-100">
            <a
              href={`tel:${businessConfig.contact.phoneDisplay}`}
              className="flex items-center gap-1.5 hover:text-[#F58220] transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-[#F58220]" />
              {businessConfig.contact.phoneDisplay}
            </a>
            <span className="text-blue-400">|</span>
            <Link
              to="/portal"
              className="text-[#F58220] hover:underline font-semibold flex items-center gap-1"
            >
              Staff Portal <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Announcement Banner from CMS */}
      {websiteContent?.announcement && (
        <div className="bg-[#0754BD] text-white py-1.5 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-blue-600">
          <span className="w-2 h-2 rounded-full bg-[#F58220] animate-pulse" />
          <span>{websiteContent.announcement}</span>
        </div>
      )}

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Business Logo & Name */}
          <Link to="/website" className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="SVCA Logo"
              className="w-11 h-11 rounded-lg shrink-0 object-contain shadow-subtle"
            />
            <div>
              <div className="font-extrabold text-[#0B2B5B] font-heading leading-tight text-base sm:text-lg tracking-tight">
                {businessConfig.identity.shortName}
              </div>
              <div className="text-[11px] text-[#64748B] font-medium hidden sm:block">
                Computer Academy &amp; CSC Digital Services
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#111827]">
            <a href="#home" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-[#F58220]">
              Home
            </a>
            <a href="#courses" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-transparent hover:border-[#F58220]">
              Courses
            </a>
            <a href="#csc" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-transparent hover:border-[#F58220]">
              CSC Services
            </a>
            <a href="#about" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-transparent hover:border-[#F58220]">
              About
            </a>
            <a href="#gallery" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-transparent hover:border-[#F58220]">
              Gallery
            </a>
            <a href="#contact" className="hover:text-[#0754BD] transition-colors py-2 border-b-2 border-transparent hover:border-[#F58220]">
              Contact
            </a>

            <a href="#admission">
              <Button size="sm" variant="orange" className="font-bold shadow-subtle">
                Admission Enquiry
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#111827] hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E2E8F0] bg-white px-6 py-4 space-y-3 shadow-lg">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#0B2B5B] py-1.5"
            >
              Home
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#111827] py-1.5"
            >
              Courses
            </a>
            <a
              href="#csc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#111827] py-1.5"
            >
              CSC Digital Services
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#111827] py-1.5"
            >
              About the Academy
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#111827] py-1.5"
            >
              Classroom Gallery
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#111827] py-1.5"
            >
              Contact &amp; Location
            </a>
            <div className="pt-2">
              <a href="#admission" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" variant="orange" className="w-full font-bold">
                  Admission Enquiry Form
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (Split Layout with Carousel Controls) */}
      <section id="home" className="relative bg-gradient-to-r from-[#0B2B5B] via-[#0B2B5B] to-[#0754BD] text-white py-16 md:py-24 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F58220] text-white text-xs font-bold uppercase tracking-wider shadow-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              {heroSlides[activeHeroSlide].highlight}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight tracking-tight">
              {heroSlides[activeHeroSlide].title}
            </h1>

            <p className="text-base sm:text-lg text-blue-100 max-w-xl leading-relaxed">
              {heroSlides[activeHeroSlide].subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#courses">
                <Button size="lg" variant="orange" className="font-bold shadow-elevated">
                  <span>Explore All Courses</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#admission">
                <Button size="lg" variant="secondary" className="font-bold bg-white text-[#0B2B5B] hover:bg-blue-50 border-white">
                  Admission Enquiry
                </Button>
              </a>
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-2 pt-4">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHeroSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeHeroSlide === i ? "w-8 bg-[#F58220]" : "w-2.5 bg-blue-300/40 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Photograph Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-elevated bg-slate-800">
              <img
                src={heroSlides[activeHeroSlide].image}
                alt="SVCA Computer Training Classroom"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B5B]/85 via-transparent to-transparent flex items-end p-6">
                <div>
                  <Badge variant="orange" size="sm" className="mb-1">
                    Representative Lab Facility
                  </Badge>
                  <div className="text-sm font-bold text-white">
                    Individual Workstations with Hands-on Guidance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUSINESS HIGHLIGHTS SECTION */}
      <section className="bg-white border-b border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#0754BD] flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#0B2B5B]">100% Practical Labs</div>
              <div className="text-[11px] text-[#64748B]">Individual student workstations</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#0B2B5B]">Course Certificates</div>
              <div className="text-[11px] text-[#64748B]">Assessments &amp; completion cards</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F58220] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#0B2B5B]">Experienced Faculty</div>
              <div className="text-[11px] text-[#64748B]">Bilingual concept support</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#0B2B5B] flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#0B2B5B]">CSC Digital Counter</div>
              <div className="text-[11px] text-[#64748B]">Online forms &amp; citizen assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR COURSES SECTION (Rich Photographic Catalogue) */}
      <section id="courses" className="py-20 bg-[#F4F6F9] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="blue" className="mb-2">
              Career Oriented Programs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Our Professional Computer Courses
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Structured modules for high schoolers, college learners, and competitive job applicants.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#0B2B5B] text-white shadow-subtle"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:text-[#0754BD]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-card hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Course Photographic Thumbnail */}
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={getCourseImage(c.code)}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded bg-[#0B2B5B]/90 text-white font-mono text-[11px] font-bold">
                        {c.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="orange" size="sm">
                        {c.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-[#0B2B5B] font-heading mb-2">
                      {c.name}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                      {c.description}
                    </p>

                    <div className="space-y-1.5 mb-2">
                      {c.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#475569]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Fee & CTA */}
                <div className="p-6 pt-0 border-t border-[#F1F5F9] mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Fee Structure</span>
                    <span className="text-base font-extrabold text-[#0B2B5B] tabular-nums font-heading">
                      {formatINR(c.fee)}
                    </span>
                  </div>

                  <a
                    href="#admission"
                    onClick={() => setInterestedCourseId(c.id)}
                  >
                    <Button size="sm" variant="orange" className="font-bold">
                      Enquire Now
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT THE ACADEMY SECTION (Split Layout) */}
      <section id="about" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Photograph */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-card">
              <img
                src="/images/about/about-lab.jpg"
                alt="Academy computer lab environment"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E2E8F0] shadow-subtle">
                <div className="font-bold text-xs text-[#0B2B5B]">Dedicated Practical Focus</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Over 10+ active workstations with high-speed internet and uninterrupted power backup.
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-7 space-y-5">
            <Badge variant="blue">About Our Institute</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Dedicated to Skill Development &amp; Digital Empowerment
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              <strong>{businessConfig.identity.name}</strong> was established with a singular focus: to bridge the digital divide for students and citizens in West Bengal. We believe that true computer literacy requires hands-on screen time, clear conceptual explanations in local languages, and step-by-step guidance.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-3">
              {businessConfig.facilities.map((fac, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                  <h4 className="font-bold text-xs text-[#0B2B5B] mb-1">{fac.title}</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{fac.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a href="#contact">
                <Button size="md" variant="navy">
                  Visit Our Centre in West Bengal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CSC SERVICES SECTION (Structured Service Directory) */}
      <section id="csc" className="py-20 bg-[#F4F6F9] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="orange" className="mb-2">
              Digital India Facilitation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Common Services Centre (CSC) Helpdesk
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Assisted citizen digital services, documentation support, and online form applications for local residents.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessConfig.cscServices.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-card hover:border-[#0754BD]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-4">
                  {getCscIcon(service.iconName)}
                </div>
                <div className="text-[11px] font-semibold text-[#0754BD] uppercase font-mono mb-1">
                  {service.category}
                </div>
                <h3 className="text-base font-bold text-[#0B2B5B] font-heading mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-[#F58220] hover:text-[#DC6D12] inline-flex items-center gap-1"
                >
                  Counter Enquiry <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 text-xs text-[#0B2B5B] flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-[#0754BD] shrink-0" />
            <span>
              <strong>CSC Facilitation Notice:</strong> Our centre assists citizens with application entry, document scanning, and print facilitation. Official approvals and registrations are issued directly by the respective government authorities.
            </span>
          </div>
        </div>
      </section>

      {/* 8. GALLERY SECTION (Responsive Grid with Lightbox) */}
      <section id="gallery" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="blue" className="mb-2">
              Classroom &amp; Lab Environment
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Our Training Facilities &amp; Campus Life
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Explore our laboratory workstations, lecture classrooms, and practical learning environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessConfig.gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveLightboxImg(img)}
                className="group relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-card cursor-pointer bg-slate-900"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B5B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <Badge variant="orange" size="sm" className="self-start mb-1">
                    {img.category}
                  </Badge>
                  <p className="text-xs font-medium text-white">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Dialog */}
          {activeLightboxImg && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              onClick={() => setActiveLightboxImg(null)}
            >
              <div
                className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveLightboxImg(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={activeLightboxImg.src}
                  alt={activeLightboxImg.caption}
                  className="w-full max-h-[70vh] object-cover"
                />
                <div className="p-4 bg-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#0B2B5B]">{activeLightboxImg.caption}</h4>
                    <span className="text-xs text-[#64748B] font-mono">{activeLightboxImg.category}</span>
                  </div>
                  <Badge variant="blue">Authorized Representative Photo</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. ADMISSION ENQUIRY SECTION (Interactive Form with Live Portal Sync) */}
      <section id="admission" className="py-20 bg-[#F4F6F9] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <Badge variant="orange" className="mb-2">
              Admissions Open 2026
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Apply for Admission / Send Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              Submit your enquiry below. It appears live inside the management portal dashboard immediately!
            </p>
          </div>

          <Card className="border-2 border-[#BFDBFE] shadow-elevated bg-white">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F1F5F9]">
                <div className="text-xs text-[#64748B]">
                  <span className="font-bold text-[#0B2B5B]">Demonstration Mode:</span> Submitting creates a live record stored in your browser.
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={handleFillSample}
                  className="text-[#0754BD] border-[#BFDBFE] hover:bg-[#EFF6FF]"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#F58220]" />
                  Fill Sample Details
                </Button>
              </div>

              <form onSubmit={handleSubmitEnquiry} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1.5">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amitava Chakraborty"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1.5">
                      Sample Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number (e.g. 9832109876)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="applicant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1.5">
                      Interested Course *
                    </label>
                    <select
                      value={interestedCourseId}
                      onChange={(e) => setInterestedCourseId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({formatINR(c.fee)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5">
                    Preferred Batch Timing
                  </label>
                  <select
                    value={preferredBatch}
                    onChange={(e) => setPreferredBatch(e.target.value)}
                    className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                  >
                    <option value="Morning (08:00 AM – 09:30 AM)">Morning (08:00 AM – 09:30 AM)</option>
                    <option value="Morning (10:00 AM – 11:30 AM)">Morning (10:00 AM – 11:30 AM)</option>
                    <option value="Afternoon (02:00 PM – 03:30 PM)">Afternoon (02:00 PM – 03:30 PM)</option>
                    <option value="Evening (05:00 PM – 06:30 PM)">Evening (05:00 PM – 06:30 PM)</option>
                    <option value="Weekend (Sat – Sun)">Weekend (Sat – Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5">
                    Questions or Learning Goals (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ask about batch timings, fees, or course syllabus..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs rounded-lg border border-[#CBD5E1] p-3 focus:outline-none focus:ring-2 focus:ring-[#0754BD]/40 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="orange"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-elevated"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Sample Admission Enquiry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B5B] font-heading">
              Visit Our Academy &amp; CSC Helpdesk
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Centrally accessible for student classes and community citizen services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <MapPin className="w-6 h-6 text-[#0754BD] mb-3" />
              <h3 className="font-bold text-sm text-[#0B2B5B] mb-1">Our Location</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {businessConfig.contact.fullAddress}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <Clock className="w-6 h-6 text-[#0754BD] mb-3" />
              <h3 className="font-bold text-sm text-[#0B2B5B] mb-1">Operating Hours</h3>
              <ul className="text-xs text-[#475569] space-y-1">
                <li>Monday – Friday: 08:00 AM – 08:00 PM</li>
                <li>Saturday: 08:00 AM – 06:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <Phone className="w-6 h-6 text-[#F58220] mb-3" />
              <h3 className="font-bold text-sm text-[#0B2B5B] mb-1">Phone &amp; Inquiries</h3>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                {businessConfig.contact.phoneDisplay}
              </p>
              <Link to="/portal">
                <Button size="xs" variant="outline" className="w-full">
                  Staff Management Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER (Dark Navy Theme) */}
      <footer className="bg-[#0B2B5B] text-blue-100 py-14 px-4 sm:px-8 text-xs border-t border-[#08234A]">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <img
                src="/favicon.svg"
                alt="SVCA Logo"
                className="w-8 h-8 rounded-lg shrink-0 object-contain shadow-subtle"
              />
              <div className="font-extrabold text-white text-base font-heading">
                {businessConfig.identity.shortName}
              </div>
            </div>
            <p className="text-blue-200 text-xs leading-relaxed">
              Equipping youth and community members with job-ready digital capabilities and citizen services in West Bengal.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider text-[#F58220]">
              Quick Links
            </div>
            <ul className="space-y-1.5 text-blue-200">
              <li><a href="#home" className="hover:text-white">Home Overview</a></li>
              <li><a href="#courses" className="hover:text-white">Computer Courses</a></li>
              <li><a href="#csc" className="hover:text-white">CSC Citizen Desk</a></li>
              <li><a href="#admission" className="hover:text-white">Admission Enquiry</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider text-[#F58220]">
              Staff Workspace
            </div>
            <ul className="space-y-1.5 text-blue-200">
              <li><Link to="/portal" className="hover:text-white">Management Dashboard</Link></li>
              <li><Link to="/portal/students" className="hover:text-white">Student Directory</Link></li>
              <li><Link to="/portal/attendance" className="hover:text-white">Batch Attendance</Link></li>
              <li><Link to="/portal/billing" className="hover:text-white">Fee Tracking &amp; Receipts</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider text-[#F58220]">
              Development Partner
            </div>
            <p className="text-blue-200 text-xs leading-relaxed mb-3">
              Solution designed and presented by <strong>{businessConfig.softrenix.companyName}</strong>.
            </p>
            <a
              href={businessConfig.softrenix.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#F58220] hover:underline font-semibold"
            >
              <span>Visit Softrenix Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#0F3875] flex flex-col sm:flex-row items-center justify-between gap-3 text-blue-300 text-[11px]">
          <div>
            © {new Date().getFullYear()} {businessConfig.identity.name}. All demo rights reserved.
          </div>
          <div>
            Concept Demonstration by {businessConfig.softrenix.companyName}
          </div>
        </div>
      </footer>
    </div>
  );
}
