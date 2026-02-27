import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, DollarSign, Layers, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { cn } from "../../lib/utils";

export type FilterOptions = {
  statuses: string[];
  locations: string[];
  bhkTypes: string[];
};

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  statuses: [],
  locations: [],
  bhkTypes: [],
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500; // Lakhs
const SLIDER_STEP = 5;

type FilterFieldKey = "status" | "locationVal" | "bhkType";
const FILTER_FIELDS: Array<{
  key: FilterFieldKey;
  paramKey: string;
  label: string;
  placeholder: string;
  optionsKey: keyof FilterOptions;
  Icon: typeof MapPin | null;
}> = [
  { key: "status", paramKey: "status", label: "Status", placeholder: "Any Status", optionsKey: "statuses", Icon: null },
  { key: "locationVal", paramKey: "location", label: "Location", placeholder: "Any Location", optionsKey: "locations", Icon: MapPin },
  { key: "bhkType", paramKey: "bhk", label: "BHK Type", placeholder: "Any BHK", optionsKey: "bhkTypes", Icon: Layers },
];

type PropertySearchProps = {
  filterOptions?: FilterOptions;
  onFilterChange?: (hasActiveFilters: boolean) => void;
  onSearchComplete?: () => void;
  urlSearch?: string;
  /** Max value for budget slider in Lakhs (e.g. from data). Falls back to DEFAULT_MAX_PRICE. */
  priceRangeMax?: number;
};

function parsePriceParam(value: string | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * Format budget value for display. Input may be in Lakhs (typical slider 0–500) or Rupees (from data).
 * Values >= 10000 are treated as Rupees and converted to Lakhs; smaller values are treated as Lakhs.
 * Output: "₹X Lakh" when amount < 1 Cr, "₹X Cr" when >= 1 Crore (100 Lakh).
 */
function formatBudgetLabel(value: number): string {
  const lakhs = value >= 10_000 ? value / 100_000 : value;
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return cr % 1 === 0 ? `₹${cr} Cr` : `₹${cr.toFixed(2)} Cr`;
  }
  const fmt = lakhs % 1 === 0 ? `${lakhs}` : lakhs.toFixed(1);
  return `₹${fmt} Lakh`;
}

function PropertySearchInner({
  filterOptions = DEFAULT_FILTER_OPTIONS,
  onFilterChange,
  onSearchComplete,
  urlSearch,
  priceRangeMax = DEFAULT_MAX_PRICE,
}: PropertySearchProps) {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);

  const sliderMax = useMemo(
    () => Math.max(DEFAULT_MAX_PRICE, priceRangeMax),
    [priceRangeMax]
  );

  const values = useMemo(
    () => ({ status, locationVal, bhkType }),
    [status, locationVal, bhkType]
  );
  const setters = useMemo(
    () => ({ status: setStatus, locationVal: setLocationVal, bhkType: setBhkType }),
    []
  );

  const statusesKey = filterOptions.statuses.join(",");
  const locationsKey = filterOptions.locations.join(",");
  const bhkTypesKey = filterOptions.bhkTypes.join(",");

  const searchToSync = urlSearch ?? (typeof window !== "undefined" ? window.location.search : "");
  useEffect(() => {
    const params = new URLSearchParams(searchToSync || "");
    setStatus(params.get("status") ?? "");
    setLocationVal(params.get("location") ?? "");
    setBhkType(params.get("bhk") ?? "");
    const min = parsePriceParam(params.get("minPrice"));
    const max = parsePriceParam(params.get("maxPrice"));
    setMinPrice(max === 0 ? DEFAULT_MIN_PRICE : Math.min(min, max));
    setMaxPrice(max === 0 ? sliderMax : Math.max(min, max));
  }, [searchToSync, sliderMax]);

  useEffect(() => {
    const opts = filterOptions;
    setStatus((s) => (s && opts.statuses.length > 0 && !opts.statuses.includes(s) ? "" : s));
    setLocationVal((l) => (l && opts.locations.length > 0 && !opts.locations.includes(l) ? "" : l));
    setBhkType((b) => (b && opts.bhkTypes.length > 0 && !opts.bhkTypes.includes(b) ? "" : b));
  }, [statusesKey, locationsKey, bhkTypesKey]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (locationVal.trim()) params.set("location", locationVal.trim());
    if (bhkType) params.set("bhk", bhkType);
    if (minPrice > DEFAULT_MIN_PRICE) params.set("minPrice", String(minPrice));
    if (maxPrice < sliderMax) params.set("maxPrice", String(maxPrice));
    const qs = params.toString();
    setLocation(qs ? `/properties?${qs}` : "/properties");
    onSearchComplete?.();
  }, [status, locationVal, bhkType, minPrice, maxPrice, sliderMax, setLocation, onSearchComplete]);

  const handleClearFilters = useCallback(() => {
    setStatus("");
    setLocationVal("");
    setBhkType("");
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(sliderMax);
    setLocation("/properties");
    onSearchComplete?.();
  }, [sliderMax, setLocation, onSearchComplete]);

  const hasActiveFilters = !!(
    status ||
    locationVal.trim() ||
    bhkType ||
    minPrice > DEFAULT_MIN_PRICE ||
    maxPrice < sliderMax
  );

  useEffect(() => {
    onFilterChange?.(hasActiveFilters);
  }, [hasActiveFilters, onFilterChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      const [min, max] = value;
      setMinPrice(min);
      setMaxPrice(max);
    },
    []
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
          className={cn(
            "h-12 transition-colors",
            variant === "desktop" &&
              "border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background disabled:opacity-50"
          )}
        >
          {variant === "desktop" && Icon ? (
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : null}
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const budgetLabel =
    minPrice === DEFAULT_MIN_PRICE && maxPrice >= sliderMax
      ? "Any budget"
      : `${formatBudgetLabel(minPrice)} – ${formatBudgetLabel(maxPrice)}`;

  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10 mb-20">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Mobile */}
        <div className="md:hidden space-y-5">
          <div className="grid grid-cols-1 gap-4">
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
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Budget (Lakhs)</span>
            </label>
            <p className="text-sm font-medium text-foreground tabular-nums">{budgetLabel}</p>
            <Slider
              min={DEFAULT_MIN_PRICE}
              max={sliderMax}
              step={SLIDER_STEP}
              value={[minPrice, maxPrice]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>

          <div className="flex gap-3 flex-col sm:flex-row pt-2">
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
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            {FILTER_FIELDS.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-0.5 flex items-center gap-1">
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
            ))}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-0.5 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                Budget (Lakhs)
              </label>
              <p className="text-sm font-medium text-foreground tabular-nums mb-1">{budgetLabel}</p>
              <Slider
                min={DEFAULT_MIN_PRICE}
                max={sliderMax}
                step={SLIDER_STEP}
                value={[minPrice, maxPrice]}
                onValueChange={handleSliderChange}
                className="py-2"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              size="lg"
              className="h-12 min-h-[44px] px-6 md:px-8 shadow-sm touch-manipulation"
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
