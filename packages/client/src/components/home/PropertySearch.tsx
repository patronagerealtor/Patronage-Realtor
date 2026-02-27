import { useState, useEffect, useCallback, useMemo, memo, Fragment } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, DollarSign, Building2, Layers, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export type FilterOptions = {
  statuses: string[];
  locations: string[];
  bhkTypes: string[];
  propertyTypes: string[];
};

const BUDGET_OPTIONS = [
  { value: "low", label: "Up to ₹50 Lakh" },
  { value: "med", label: "₹50 Lakh – ₹1 Cr" },
  { value: "high", label: "₹1 Cr+" },
] as const;

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  statuses: [],
  locations: [],
  bhkTypes: [],
  propertyTypes: [],
};

function getSearchParamsFromLocation(location: string): URLSearchParams {
  const query = location.includes("?") ? location.slice(location.indexOf("?")) : "";
  return new URLSearchParams(query);
}

type FilterFieldKey = "status" | "locationVal" | "bhkType" | "propertyType";
const FILTER_FIELDS: Array<{
  key: FilterFieldKey;
  paramKey: string;
  label: string;
  placeholder: string;
  optionsKey: keyof FilterOptions;
  Icon: typeof MapPin | null;
  desktopWidth: string;
}> = [
  { key: "status", paramKey: "status", label: "Status", placeholder: "Any Status", optionsKey: "statuses", Icon: null, desktopWidth: "w-[140px]" },
  { key: "locationVal", paramKey: "location", label: "Location", placeholder: "Any Location", optionsKey: "locations", Icon: MapPin, desktopWidth: "w-[180px]" },
  { key: "bhkType", paramKey: "bhk", label: "BHK Type", placeholder: "Any BHK", optionsKey: "bhkTypes", Icon: Layers, desktopWidth: "w-[140px]" },
  { key: "propertyType", paramKey: "type", label: "Property Type", placeholder: "Any Type", optionsKey: "propertyTypes", Icon: Building2, desktopWidth: "w-[160px]" },
];

type PropertySearchProps = {
  filterOptions?: FilterOptions;
  onFilterChange?: (hasActiveFilters: boolean) => void;
  /** Called after URL is updated (e.g. so parent can re-read window.location.search). */
  onSearchComplete?: () => void;
  /** Current URL search string (e.g. from parent) so dropdowns stay in sync with URL. */
  urlSearch?: string;
};

function PropertySearchInner({
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onFilterChange,
  onSearchComplete,
  urlSearch,
}: PropertySearchProps) {
  const [location, setLocation] = useLocation();
  const pathname = location.split("?")[0];
  const isOnHome = pathname === "/";
  const [status, setStatus] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const values = useMemo(
    () => ({ status, locationVal, bhkType, propertyType }),
    [status, locationVal, bhkType, propertyType]
  );
  const setters = useMemo(
    () => ({ status: setStatus, locationVal: setLocationVal, bhkType: setBhkType, propertyType: setPropertyType }),
    []
  );

  const statusesKey = filterOptions.statuses.join(",");
  const locationsKey = filterOptions.locations.join(",");
  const bhkTypesKey = filterOptions.bhkTypes.join(",");
  const propertyTypesKey = filterOptions.propertyTypes.join(",");

  const searchToSync = urlSearch ?? (typeof window !== "undefined" ? window.location.search : "");
  useEffect(() => {
    const params = new URLSearchParams(searchToSync || "");
    setStatus(params.get("status") ?? "");
    setLocationVal(params.get("location") ?? "");
    setBhkType(params.get("bhk") ?? "");
    setPropertyType(params.get("type") ?? "");
    setBudget(params.get("budget") ?? "");
  }, [searchToSync]);

  useEffect(() => {
    const opts = filterOptions;
    setStatus((s) => (s && opts.statuses.length > 0 && !opts.statuses.includes(s) ? "" : s));
    setLocationVal((l) => (l && opts.locations.length > 0 && !opts.locations.includes(l) ? "" : l));
    setBhkType((b) => (b && opts.bhkTypes.length > 0 && !opts.bhkTypes.includes(b) ? "" : b));
    setPropertyType((t) => (t && opts.propertyTypes.length > 0 && !opts.propertyTypes.includes(t) ? "" : t));
  }, [statusesKey, locationsKey, bhkTypesKey, propertyTypesKey]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (locationVal.trim()) params.set("location", locationVal.trim());
    if (bhkType) params.set("bhk", bhkType);
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    setLocation(qs ? `/properties?${qs}` : "/properties");
    onSearchComplete?.();
  }, [status, locationVal, bhkType, propertyType, budget, setLocation, onSearchComplete]);

  const handleClearFilters = useCallback(() => {
    setStatus("");
    setLocationVal("");
    setBhkType("");
    setPropertyType("");
    setBudget("");
    setLocation(isOnHome ? "/" : "/properties");
    onSearchComplete?.();
  }, [setLocation, onSearchComplete, isOnHome]);

  const hasActiveFilters = !!(status || locationVal.trim() || bhkType || propertyType || budget);

  useEffect(() => {
    onFilterChange?.(hasActiveFilters);
  }, [hasActiveFilters, onFilterChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  const renderFilterSelect = (
    field: (typeof FILTER_FIELDS)[number],
    value: string,
    onChange: (v: string) => void,
    options: string[],
    variant: "mobile" | "desktop"
  ) => {
    const disabled = options.length === 0;
    const Icon = field.Icon;
    return (
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={
            variant === "desktop"
              ? "h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors disabled:opacity-50"
              : "h-12"
          }
        >
          {variant === "desktop" && Icon ? <Icon className="h-4 w-4 text-muted-foreground shrink-0" /> : null}
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10 mb-20">
      <div className="bg-card shadow-xl border border-border rounded-xl p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {FILTER_FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {field.Icon ? <field.Icon className="h-4 w-4" /> : null}
                <span>{field.label}</span>
                {filterOptions[field.optionsKey].length === 0 && (
                  <span className="text-xs text-muted-foreground">(No options)</span>
                )}
              </label>
              {renderFilterSelect(
                field,
                values[field.key],
                setters[field.key],
                filterOptions[field.optionsKey],
                "mobile"
              )}
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Budget</span>
            </label>
            <Select value={budget || undefined} onValueChange={setBudget}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              type="button"
              className="w-full h-12 min-h-[44px] text-base sm:text-lg shadow-sm touch-manipulation"
              data-testid="button-search-mobile"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4 shrink-0" /> Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 min-h-[44px] text-base sm:text-lg touch-manipulation"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <X className="mr-2 h-4 w-4 shrink-0" /> Clear Filters
            </Button>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex flex-wrap items-end gap-3">
          {FILTER_FIELDS.map((field, idx) => (
            <Fragment key={field.key}>
              {idx > 0 && <Separator orientation="vertical" className="h-12 w-[1px] bg-border hidden lg:block" />}
              <div className={`${field.desktopWidth} space-y-1.5`}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1 flex items-center gap-1">
                  {field.label}
                  {filterOptions[field.optionsKey].length === 0 && (
                    <span className="text-[10px] font-normal">(—)</span>
                  )}
                </label>
                {renderFilterSelect(
                  field,
                  values[field.key],
                  setters[field.key],
                  filterOptions[field.optionsKey],
                  "desktop"
                )}
              </div>
            </Fragment>
          ))}
          <Separator orientation="vertical" className="h-12 w-[1px] bg-border hidden lg:block" />
          <div className="w-[160px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Budget</label>
            <Select value={budget || undefined} onValueChange={setBudget}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="shrink-0 flex gap-2 ml-0 md:ml-2 w-full md:w-auto min-w-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 md:flex-initial h-12 min-h-[44px] px-6 md:px-8 shadow-sm touch-manipulation"
              data-testid="button-search-desktop"
              onClick={handleSearch}
              onKeyDown={handleKeyDown}
            >
              <Search className="h-4 w-4 mr-2 shrink-0" /> Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 min-h-[44px] px-4 md:px-6 touch-manipulation"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <X className="h-4 w-4 md:mr-1.5 shrink-0" />
              <span className="hidden md:inline">Clear Filters</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const PropertySearch = memo(PropertySearchInner);