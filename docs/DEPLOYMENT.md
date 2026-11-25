# Deployment Guide
**SVCA & CSC Centre — Interactive Business Demo**
**Hosting Mode:** 100% Static Client-Side SPA (Zero Backend Servers Required)

---

## 1. Local Development & Preview Commands

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Accessible at: `http://localhost:5173/`

### Build for Production
```bash
npm run build
```
Generates an optimized static production bundle in the `dist/` directory.

### Preview Production Build Locally
```bash
npm run preview
```

### Run Vitest Automated Test Suite
```bash
npm test
```

---

## 2. Cloudflare Pages Deployment

### Method A: Git Integration (Recommended)
1. Push this repository to GitHub or GitLab.
2. In the Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Configure build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy site.

### SPA Routing Fallback (Cloudflare Pages)
The repository includes `public/_redirects` with:
```
/* /index.html 200
```
This ensures direct URLs (e.g., `/portal/students`, `/website`) load without 404 errors on refresh.

---

## 3. Vercel Deployment

### Method A: Vercel CLI
```bash
npx vercel
```

### Method B: Git Dashboard
1. Import repository on [vercel.com](https://vercel.com).
2. Framework preset will automatically detect **Vite**.
3. The included `vercel.json` ensures clean Single Page Application rewrites:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/((?!assets/|branding/|images/|favicon\\.svg|robots\\.txt).*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 4. Static Hosting Requirements & Security Checklist
- ✅ No Node.js / Express backend server required.
- ✅ No external database (MySQL/PostgreSQL/MongoDB) needed.
- ✅ No API keys or secret environment variables required in client code.
- ✅ LocalStorage handles persistence safely within the prospect's browser.
- ✅ `robots.txt` disallows search engine web scrapers for client confidentiality.
