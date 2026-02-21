/**
 * Format numeric price for Indian display (₹ Lakh / ₹ Cr).
 * Uses price_value; fallback to price_display in UI where needed.
 * Accepts number | string | null | undefined; converts string to number safely.
 */
export function formatIndianPrice(value?: number | string | null): string {
  if (value == null || value === "") return "Price on request";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num) || num < 0) return "Price on request";
  if (num < 10_000_000) {
    const formatted = (num / 100_000).toFixed(2).replace(/\.00$/, "");
    return `₹ ${formatted} Lakh`;
  }
  const formatted = (num / 10_000_000).toFixed(2).replace(/\.00$/, "");
  return `₹ ${formatted} Cr`;
}
