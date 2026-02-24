import type { PropertyRow } from "../lib/supabase";
import type { FilterOptions } from "../components/home/PropertySearch";

/**
 * URLSearchParams wrapper to safely extract query parameters
 */
export function getSearchParamsFromLocation(location: string): URLSearchParams {
  const query = location.includes("?") ? location.slice(location.indexOf("?")) : "";
  return new URLSearchParams(query);
}

/**
 * URLSearchParams wrapper for query string
 */
export function getSearchParamsFromQuery(queryString: string): URLSearchParams {
  return new URLSearchParams(queryString || "");
}

/**
 * Build URL with filter parameters
 */
export function buildFilterUrl(filters: {
  status?: string;
  location?: string;
  bhk?: string;
  type?: string;
  budget?: string;
}): string {
  const params = new URLSearchParams();
  
  if (filters.status?.trim()) params.set("status", filters.status.trim());
  if (filters.location?.trim()) params.set("location", filters.location.trim());
  if (filters.bhk?.trim()) params.set("bhk", filters.bhk.trim());
  if (filters.type?.trim()) params.set("type", filters.type.trim());
  if (filters.budget?.trim()) params.set("budget", filters.budget.trim());

  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

/**
 * Normalize price value to Lakhs
 */
export function normalizePriceToLakhs(price: number | null | undefined): number | null {
  if (price == null) return null;
  // Assuming price_value is already in Lakhs
  // Adjust if your data uses different units
  return price;
}

/**
 * Check if property matches budget filter
 */
export function matchesBudgetFilter(
  priceValue: number | null | undefined,
  budgetFilter: string | null | undefined
): boolean {
  if (!budgetFilter || priceValue == null) {
    return true;
  }

  const v = priceValue;
  
  switch (budgetFilter) {
    case "low":
      return v <= 50; // Up to ₹50 Lakh
    case "med":
      return v > 50 && v <= 100; // ₹50 Lakh – ₹1 Cr
    case "high":
      return v > 100; // ₹1 Cr+
    default:
      return true;
  }
}

/**
 * Cascading filter logic - get available filter options based on current selections
 */
export function deriveFilterOptions(
  properties: PropertyRow[],
  currentFilters: {
    status?: string;
    location?: string;
    bhk?: string;
    type?: string;
    budget?: string;
  }
): FilterOptions {
  // First pass: filter by status, location, bhk, type (excluding budget for now)
  const filtered = properties.filter((p) => {
    if (currentFilters.status && (p.status ?? "") !== currentFilters.status) return false;
    if (currentFilters.location && !(p.location ?? "").toLowerCase().includes(currentFilters.location.toLowerCase())) return false;
    if (currentFilters.bhk && (p.bhk_type ?? "") !== currentFilters.bhk) return false;
    if (currentFilters.type && (p.property_type ?? "") !== currentFilters.type) return false;
    return true;
  });

  // Extract unique values from filtered results
  const statuses = [
    ...new Set(
      filtered
        .map((p) => p.status)
        .filter((v): v is string => v != null && v !== "")
    ),
  ].sort();

  const locations = [
    ...new Set(
      filtered
        .map((p) => (p.location ?? "").trim())
        .filter(Boolean)
    ),
  ].sort();

  const bhkTypes = [
    ...new Set(
      filtered
        .map((p) => p.bhk_type)
        .filter((v): v is string => v != null && v !== "")
    ),
  ].sort();

  const propertyTypes = [
    ...new Set(
      filtered
        .map((p) => p.property_type)
        .filter((v): v is string => v != null && v !== "")
    ),
  ].sort();

  return { statuses, locations, bhkTypes, propertyTypes };
}

/**
 * Complete filtering logic with all filter types
 */
export function filterProperties(
  properties: PropertyRow[],
  currentFilters: {
    status?: string;
    location?: string;
    bhk?: string;
    type?: string;
    budget?: string;
  }
): PropertyRow[] {
  const statusQ = currentFilters.status?.trim();
  const locationQ = currentFilters.location?.trim().toLowerCase();
  const bhkQ = currentFilters.bhk?.trim();
  const typeQ = currentFilters.type?.trim();
  const budgetQ = currentFilters.budget?.trim();

  return properties.filter((p) => {
    // Status filter
    if (statusQ && (p.status ?? "") !== statusQ) return false;

    // Location filter (case-insensitive, partial match)
    if (locationQ && !(p.location ?? "").toLowerCase().includes(locationQ)) {
      return false;
    }

    // BHK Type filter
    if (bhkQ && (p.bhk_type ?? "") !== bhkQ) return false;

    // Property Type filter
    if (typeQ && (p.property_type ?? "") !== typeQ) return false;

    // Budget filter
    if (budgetQ) {
      if (p.price_value == null) return false;
      if (!matchesBudgetFilter(p.price_value, budgetQ)) return false;
    }

    return true;
  });
}

/**
 * Get count of properties matching each filter option (for badge counts)
 */
export function getFilterCounts(
  properties: PropertyRow[],
  filterType: "status" | "location" | "bhk" | "type" | "budget",
  currentFilters: Record<string, string>
): Record<string, number> {
  const counts: Record<string, number> = {};

  properties.forEach((p) => {
    let key: string | undefined;

    switch (filterType) {
      case "status":
        key = p.status ?? undefined;
        break;
      case "location":
        key = p.location ?? undefined;
        break;
      case "bhk":
        key = p.bhk_type ?? undefined;
        break;
      case "type":
        key = p.property_type ?? undefined;
        break;
      case "budget":
        if (p.price_value == null) return;
        if (p.price_value <= 50) key = "low";
        else if (p.price_value <= 100) key = "med";
        else key = "high";
        break;
    }

    if (key) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  });

  return counts;
}

/**
 * Format filter value for display
 */
export function formatFilterValue(value: string, filterType: string): string {
  switch (filterType) {
    case "budget":
      switch (value) {
        case "low":
          return "Up to ₹50 Lakh";
        case "med":
          return "₹50 Lakh – ₹1 Cr";
        case "high":
          return "₹1 Cr+";
      }
      break;
  }
  return value;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: Record<string, string | undefined>): boolean {
  return Object.values(filters).some((v) => v?.trim());
}

/**
 * Clear all filters
 */
export function clearAllFilters(): {
  status: "";
  location: "";
  bhk: "";
  type: "";
  budget: "";
} {
  return {
    status: "",
    location: "",
    bhk: "",
    type: "",
    budget: "",
  };
}

/**
 * Get filter summary for display
 */
export function getFilterSummary(filters: Record<string, string | undefined>): string[] {
  const parts: string[] = [];

  if (filters.status?.trim()) {
    parts.push(`Status: ${filters.status}`);
  }
  if (filters.location?.trim()) {
    parts.push(`Location: ${filters.location}`);
  }
  if (filters.bhk?.trim()) {
    parts.push(`BHK: ${filters.bhk}`);
  }
  if (filters.type?.trim()) {
    parts.push(`Type: ${filters.type}`);
  }
  if (filters.budget?.trim()) {
    parts.push(`Budget: ${formatFilterValue(filters.budget, "budget")}`);
  }

  return parts;
}

/**
 * Merge filter objects (useful for partial updates)
 */
export function mergeFilters(
  current: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
): Record<string, string | undefined> {
  return { ...current, ...updates };
}

/**
 * Validate filter value exists in options
 */
export function isValidFilterValue(
  value: string,
  availableOptions: string[]
): boolean {
  return value === "" || availableOptions.includes(value);
}