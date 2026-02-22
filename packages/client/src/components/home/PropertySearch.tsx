import { useState, useEffect } from "react";
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

function getSearchParamsFromLocation(location: string): URLSearchParams {
  const query = location.includes("?") ? location.slice(location.indexOf("?")) : "";
  return new URLSearchParams(query);
}

type PropertySearchProps = {
  filterOptions?: FilterOptions;
};

export function PropertySearch({ filterOptions = { statuses: [], locations: [], bhkTypes: [], propertyTypes: [] } }: PropertySearchProps) {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<string>("");
  const [locationVal, setLocationVal] = useState<string>("");
  const [bhkType, setBhkType] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  // Sync filter state from URL whenever route changes (Search click, back/forward, direct link)
  useEffect(() => {
    const params = getSearchParamsFromLocation(location);
    setStatus(params.get("status") ?? "");
    setLocationVal(params.get("location") ?? "");
    setBhkType(params.get("bhk") ?? "");
    setPropertyType(params.get("type") ?? "");
    setBudget(params.get("budget") ?? "");
  }, [location]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (locationVal.trim()) params.set("location", locationVal.trim());
    if (bhkType) params.set("bhk", bhkType);
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    setLocation(qs ? `/properties?${qs}` : "/properties");
  };

  const handleClearFilters = () => {
    setStatus("");
    setLocationVal("");
    setBhkType("");
    setPropertyType("");
    setBudget("");
    setLocation("/properties");
  };

  const hasActiveFilters = !!(status || locationVal.trim() || bhkType || propertyType || budget);

  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10 mb-20">
      <div className="bg-card shadow-xl border border-border rounded-xl p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Mobile View - Stacked */}
        <div className="md:hidden space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Select value={status || undefined} onValueChange={setStatus}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <Select value={locationVal || undefined} onValueChange={setLocationVal}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Location" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">BHK Type</label>
            <Select value={bhkType || undefined} onValueChange={setBhkType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any BHK" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.bhkTypes.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Property Type</label>
            <Select value={propertyType || undefined} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.propertyTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Budget</label>
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

        {/* Desktop View - Horizontal */}
        <div className="hidden md:flex flex-wrap items-end gap-3">
          <div className="w-[140px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Status</label>
            <Select value={status || undefined} onValueChange={setStatus}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-12 w-[1px] bg-border hidden lg:block" />
          <div className="w-[180px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Location</label>
            <Select value={locationVal || undefined} onValueChange={setLocationVal}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-12 w-[1px] bg-border hidden lg:block" />
          <div className="w-[140px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">BHK Type</label>
            <Select value={bhkType || undefined} onValueChange={setBhkType}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="BHK" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.bhkTypes.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator orientation="vertical" className="h-12 w-[1px] bg-border hidden lg:block" />
          <div className="w-[160px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Property Type</label>
            <Select value={propertyType || undefined} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.propertyTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
