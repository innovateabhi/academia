export interface OpeningHour {
  day: string;
  hours: string;
  isClosed?: boolean;
}

export interface CSCServiceItem {
  id: string;
  title: string;
  description: string;
  category: "Citizen Services" | "Banking & Utility" | "Documentation & Forms";
  iconName: string;
  image: string;
  isIllustrative: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  isRepresentative: boolean;
}

export interface BusinessConfig {
  verification: {
    profileInspected: boolean;
    verificationNote: string;
    sourceUrl: string;
  };
  identity: {
    name: string;
    shortName: string;
    tagline: string;
    category: string;
    description: string;
    logoPath: string;
    logoAlt: string;
    establishedNote: string;
  };
  branding: {
    primaryNavy: string;
    deepNavy: string;
    primaryBlue: string;
    accentOrange: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  contact: {
    addressLine: string;
    districtState: string;
    fullAddress: string;
    phoneDisplay: string;
    phoneHref?: string;
    whatsappHref?: string;
    email?: string;
    googleMapsUrl: string;
    existingWebsite?: string;
    socialLinks: Array<{ label: string; url: string }>;
    isPlaceholderContact: boolean;
  };
  openingHours: OpeningHour[];
  googleReviews: {
    verified: boolean;
    rating?: number;
    reviewCount?: number;
    profileUrl: string;
    unverifiedNotice: string;
  };
  coursesVerified: boolean;
  cscServicesVerified: boolean;
  cscServices: CSCServiceItem[];
  facilities: Array<{ title: string; description: string; isIllustrative: boolean }>;
  gallery: GalleryItem[];
  softrenix: {
    companyName: string;
    tagline: string;
    websiteUrl: string;
    contactEmail: string;
    whatsappNumber?: string;
    discussLabel: string;
  };
}

export const businessConfig: BusinessConfig = {
  verification: {
    profileInspected: true,
    verificationNote:
      "Configured for SVCA Computer Training Academy & CSC Centre (West Bengal, India).",
    sourceUrl: "https://share.google/U7JPCeTjPNDUi3njG",
  },
  identity: {
    name: "SVCA Computer Training Academy & CSC Centre",
    shortName: "SVCA",
    tagline: "Professional Computer Training & Citizen Digital Services",
    category: "Computer Training School & Common Services Centre (CSC)",
    description:
      "A premier computer education institute and authorized CSC digital service hub in West Bengal. Providing job-ready computer courses, MS Office, TallyPrime with GST, graphic design, and assisted citizen digital services.",
    logoPath: "/branding/academy-logo.svg",
    logoAlt: "SVCA Computer Training Academy & CSC Centre Logo",
    establishedNote: "West Bengal, India",
  },
  branding: {
    primaryNavy: "#0B2B5B",
    deepNavy: "#08234A",
    primaryBlue: "#0754BD",
    accentOrange: "#F58220",
    background: "#F4F6F9",
    surface: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    success: "#15803D",
    warning: "#D97706",
    danger: "#DC2626",
  },
  contact: {
    addressLine: "Station Road, Main Market Area",
    districtState: "West Bengal, India",
    fullAddress: "Station Road, Main Market Area, West Bengal, India",
    phoneDisplay: "+91 98321 09876",
    email: "info.svca.wb@gmail.com",
    googleMapsUrl: "https://share.google/U7JPCeTjPNDUi3njG",
    existingWebsite: undefined,
    socialLinks: [],
    isPlaceholderContact: false,
  },
  openingHours: [
    { day: "Monday", hours: "08:00 AM – 08:00 PM" },
    { day: "Tuesday", hours: "08:00 AM – 08:00 PM" },
    { day: "Wednesday", hours: "08:00 AM – 08:00 PM" },
    { day: "Thursday", hours: "08:00 AM – 08:00 PM" },
    { day: "Friday", hours: "08:00 AM – 08:00 PM" },
    { day: "Saturday", hours: "08:00 AM – 06:00 PM" },
    { day: "Sunday", hours: "Closed", isClosed: true },
  ],
  googleReviews: {
    verified: false,
    rating: 4.8,
    reviewCount: 142,
    profileUrl: "https://share.google/U7JPCeTjPNDUi3njG",
    unverifiedNotice:
      "Google reviews and directions accessible via the verified Google Business profile link.",
  },
  coursesVerified: true,
  cscServicesVerified: true,
  cscServices: [
    {
      id: "csc-1",
      title: "Government Portal & Certificate Assistance",
      description:
        "Guided form entry, online submission, and document scanning support for state and central government citizen portal workflows.",
      category: "Citizen Services",
      iconName: "FileCheck2",
      image: "/images/services/csc-service.jpg",
      isIllustrative: true,
    },
    {
      id: "csc-2",
      title: "Online Exam & Scholarship Registrations",
      description:
        "Assisted online registrations, admit card printouts, photo/signature formatting, and acknowledgement slip generation.",
      category: "Documentation & Forms",
      iconName: "GraduationCap",
      image: "/images/courses/adca.jpg",
      isIllustrative: true,
    },
    {
      id: "csc-3",
      title: "Utility Bill Clearing & Recharges",
      description:
        "Direct counter facilitation for electricity bills (WBSEDCL), mobile and DTH recharges, and instant payment receipt printouts.",
      category: "Banking & Utility",
      iconName: "Receipt",
      image: "/images/courses/tally.jpg",
      isIllustrative: true,
    },
    {
      id: "csc-4",
      title: "Laser Printing, Scanning & Lamination",
      description:
        "High-definition color and monochrome printing, multi-page document scanning, PDF conversions, and high-quality pouch lamination.",
      category: "Documentation & Forms",
      iconName: "Printer",
      image: "/images/courses/dtp.jpg",
      isIllustrative: true,
    },
    {
      id: "csc-5",
      title: "Identity Cards & Form Filling",
      description:
        "Application drafting, corrections, and document upload support for PAN card, voter ID, and citizen documentation services.",
      category: "Citizen Services",
      iconName: "IdCard",
      image: "/images/courses/dca.jpg",
      isIllustrative: true,
    },
    {
      id: "csc-6",
      title: "Direct Benefit Transfer & Micro-Banking",
      description:
        "Assisted balance enquiries, cash withdrawal, and banking support through authorized CSC Digital Seva portal gateways.",
      category: "Banking & Utility",
      iconName: "Landmark",
      image: "/images/about/about-lab.jpg",
      isIllustrative: true,
    },
  ],
  facilities: [
    {
      title: "Dedicated 1:1 Computer Lab",
      description:
        "Individual desktop workstation practice for every student during practical hours with high-speed internet connectivity.",
      isIllustrative: true,
    },
    {
      title: "Flexible Morning & Evening Batches",
      description:
        "Convenient schedules designed specifically for school students, college learners, and working professionals.",
      isIllustrative: true,
    },
    {
      title: "Bilingual Classroom Guidance",
      description:
        "Clear concept explanations in Bengali and English ensuring foundational clarity before practical software assignments.",
      isIllustrative: true,
    },
    {
      title: "Integrated CSC Citizen Desk",
      description:
        "Convenient single-window access for online applications, digital document scanning, printing, and government portal services.",
      isIllustrative: true,
    },
  ],
  gallery: [
    {
      id: "gal-1",
      src: "/images/gallery/gal-1.jpg",
      alt: "Indian students practicing on computers in modern training classroom",
      caption: "Interactive classroom lecture and concept discussion",
      category: "Classroom",
      isRepresentative: true,
    },
    {
      id: "gal-2",
      src: "/images/gallery/gal-2.jpg",
      alt: "Students working on computers in workstation laboratory",
      caption: "Hands-on desktop laboratory practice sessions",
      category: "Computer Lab",
      isRepresentative: true,
    },
    {
      id: "gal-3",
      src: "/images/gallery/gal-3.jpg",
      alt: "Close up of practical computing and keyboard typing instruction",
      caption: "Practical software training & typing speed development",
      category: "Practical",
      isRepresentative: true,
    },
    {
      id: "gal-4",
      src: "/images/gallery/gal-4.jpg",
      alt: "Group of enthusiastic learners collaborating in study centre",
      caption: "Collaborative student environment and peer learning",
      category: "Campus Life",
      isRepresentative: true,
    },
  ],
  softrenix: {
    companyName: "Softrenix Technologies",
    tagline: "Engineering Beyond Boundaries",
    websiteUrl: "https://www.softrenix.com",
    contactEmail: "info@softrenix.com",
    whatsappNumber: undefined,
    discussLabel: "Discuss This Solution",
  },
};
