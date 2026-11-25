import { format, parseISO, isValid } from "date-fns";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrDecimalFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatINR(amount: number, showDecimals = false): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return showDecimals ? inrDecimalFormatter.format(safe) : inrFormatter.format(safe);
}

export const formatIndianCurrency = formatINR;

export function formatIndianDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) {
    const fallback = new Date(dateStr);
    return isValid(fallback) ? format(fallback, "dd MMM yyyy") : dateStr;
  }
  return format(parsed, "dd MMM yyyy");
}

export function formatIndianDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return dateStr;
  return format(parsed, "dd MMM yyyy, hh:mm a");
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatMonthLabel(ym: string): string {
  const parsed = parseISO(`${ym}-01`);
  return isValid(parsed) ? format(parsed, "MMM yy") : ym;
}
