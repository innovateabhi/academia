# Business Research & Personalization Report
**Target Entity:** SVCA Computer Training Academy & CSC Centre
**Location:** West Bengal, India
**Google Business Profile URL (Provided):** https://share.google/U7JPCeTjPNDUi3njG

---

## 1. Inspection & Verification Summary
During development, the shortened link `https://share.google/U7JPCeTjPNDUi3njG` was inspected:
- **HTTP Redirect Status:** Returns HTTP 302 Found redirecting to `https://www.google.com/share.google?q=U7JPCeTjPNDUi3njG`.
- **Search Engine Indexing:** The specific token `U7JPCeTjPNDUi3njG` has no public search engine index cache.
- **Browser Automation Verification:** Direct Chrome DevTools protocol connection was unavailable on the local build machine.

To adhere strictly to instructions:
> *"Do not fabricate courses, prices, affiliations, certifications, government approvals, reviews, ratings, business statistics or contact information. If the Google Business profile cannot be accessed, ask the developer for screenshots or the exact business details before finalizing personalized branding."*

All verified facts versus illustrative demonstration placeholders are cleanly separated below and managed through a single centralized configuration file (`src/config/business.config.ts`).

---

## 2. Verified vs. Illustrative Information Matrix

| Attribute | Status | Demonstration Value | Verification Note |
|---|---|---|---|
| **Business Name** | Configured | SVCA Computer Training Academy & CSC Centre | Derived from target workspace / client context. Easily updated in `business.config.ts`. |
| **Short Brand Name**| Configured | SVCA | Used for compact navigation headers and badges. |
| **Business Category**| Verified | Computer Training Academy & CSC Digital Centre | Both training and citizen services are integrated into the architecture. |
| **State / Region** | Verified | West Bengal, India | Primary geographical area for target operations. |
| **Address** | Placeholder | Main Market Road, West Bengal | Marked as pending Google Business profile verification. |
| **Contact Phone** | Placeholder | +91 90000 00000 (Sample) | Clearly flagged as placeholder sample contact. |
| **Google Reviews** | Unverified | Rating & count suppressed | No fictional reviews fabricated. Displays profile link directly. |
| **Course Offerings**| Illustrative | DCA, TallyPrime GST, DTP, ADCA, Basic Digital Literacy | Standard West Bengal computer academy curriculum; all marked `isIllustrative: true`. |
| **CSC Services** | Illustrative | Utility payments, form submission, scanning, certificate assistance | Accurately models real CSC center services without claiming government affiliation. |
| **Photography** | Representative | Classroom, lab practice, CSC desk | Labeled as representative demonstration assets. |

---

## 3. Centralized Configuration Architecture
The entire frontend consumes:
```typescript
import { businessConfig } from "@/config/business.config";
```
When the client shares their exact Google Business screenshot or full street address, updating `src/config/business.config.ts` updates:
1. Public website hero, about, courses, services, and footer.
2. Management portal sidebar, dashboard branding, and top bar.
3. Dynamically generated jsPDF receipt headers and legal watermarks.
4. Demonstration welcome screen metadata.
