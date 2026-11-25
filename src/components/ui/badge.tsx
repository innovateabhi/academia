import React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "navy" | "blue" | "orange" | "success" | "warning" | "danger" | "neutral" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#F1F5F9] text-[#0B2B5B] border-[#E2E8F0]",
    navy: "bg-[#0B2B5B]/10 text-[#0B2B5B] border-[#0B2B5B]/20 font-semibold",
    blue: "bg-[#EFF6FF] text-[#0754BD] border-[#BFDBFE]",
    orange: "bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5] font-semibold",
    success: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    danger: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    neutral: "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]",
    outline: "border-[#CBD5E1] text-[#475569] bg-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] tracking-wide",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-xs font-semibold",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded border tabular-nums transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
