import React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "navy" | "orange" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "navy", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0754BD]/40 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.985]";

    const variants = {
      navy: "bg-[#0B2B5B] text-white hover:bg-[#08234A] shadow-subtle border border-[#08234A]/20",
      primary: "bg-[#0754BD] text-white hover:bg-[#1264D1] shadow-subtle border border-[#0754BD]/20",
      orange: "bg-[#F58220] text-white hover:bg-[#DC6D12] shadow-subtle border border-[#DC6D12]/20 font-semibold",
      secondary: "bg-white text-[#111827] hover:bg-[#F8FAFC] shadow-subtle border border-[#E2E8F0]",
      outline: "border border-[#CBD5E1] bg-transparent text-[#111827] hover:bg-white hover:border-[#94A3B8]",
      ghost: "text-[#64748B] hover:text-[#111827] hover:bg-[#E2E8F0]/50",
      danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-subtle",
    };

    const sizes = {
      xs: "h-7 px-2.5 text-[11px] rounded-md gap-1 tracking-tight font-medium",
      sm: "h-8 px-3.5 text-xs rounded-md gap-1.5 font-medium",
      md: "h-9 px-4 text-xs font-semibold rounded-lg gap-2",
      lg: "h-11 px-5 text-sm font-semibold rounded-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
