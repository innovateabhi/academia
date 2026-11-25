import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          950: "#051630",
          900: "#08234A", // Deep Navy
          800: "#0B2B5B", // Primary Navy
          700: "#0F3875",
          600: "#144690",
        },
        blue: {
          DEFAULT: "#0754BD", // Primary Blue
          interactive: "#1264D1", // Interactive Blue
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#0754BD",
          700: "#0B2B5B",
        },
        orange: {
          DEFAULT: "#F58220", // Accent Orange
          hover: "#DC6D12", // Accent Hover
          50: "#FFF7ED",
          100: "#FFEDD5",
          500: "#F58220",
          600: "#DC6D12",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F4F6F9", // Application Background
          200: "#E2E8F0", // Border
          300: "#CBD5E1",
          400: "#94A3B8", // Muted Text
          500: "#64748B", // Secondary Text
          900: "#111827", // Primary Text
        },
        brand: {
          navy: "#0B2B5B",
          deepNavy: "#08234A",
          blue: "#0754BD",
          orange: "#F58220",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          canvas: "#F4F6F9",
          muted: "#F8FAFC",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#0754BD",
        background: "#F4F6F9",
        foreground: "#111827",
        primary: {
          DEFAULT: "#0B2B5B",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4F6F9",
          foreground: "#111827",
        },
        accent: {
          DEFAULT: "#F58220",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#15803D",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#D97706",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "system-ui", "sans-serif"],
        heading: ["Manrope", "Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        xl: "0.625rem", // 10px
        lg: "0.5rem", // 8px
        md: "0.375rem", // 6px
        sm: "0.25rem", // 4px
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(11, 43, 91, 0.05)",
        card: "0 1px 3px 0 rgba(11, 43, 91, 0.06), 0 1px 2px -1px rgba(11, 43, 91, 0.04)",
        elevated: "0 8px 24px -4px rgba(11, 43, 91, 0.08), 0 3px 8px -2px rgba(11, 43, 91, 0.03)",
        dropdown: "0 10px 30px -5px rgba(11, 43, 91, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
