import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search,
  MapPin,
  DollarSign,
  Home,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "land", label: "Land" },
] as const;

const BUDGET_OPTIONS = [
  { value: "low", label: "Up to ₹50 Lakh" },
  { value: "med", label: "₹50 Lakh – ₹1 Cr" },
  { value: "high", label: "₹1 Cr+" },
] as const;

function getSearchParamsFromLocation(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  const loc = window.location.pathname + window.location.search;
  const query = loc.includes("?") ? loc.slice(loc.indexOf("?")) : "";
  return new URLSearchParams(query);
}

export function PropertySearch() {
  const [, setLocation] = useLocation();
  const [locationInput, setLocationInput] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  useEffect(() => {
    const params = getSearchParamsFromLocation();
    setLocationInput(params.get("location") ?? "");
    setPropertyType(params.get("type") ?? "");
    setBudget(params.get("budget") ?? "");
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationInput.trim()) params.set("location", locationInput.trim());
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    setLocation(qs ? `/properties?${qs}` : "/properties");
  };

  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10 mb-20">
      <div className="bg-card shadow-xl border border-border rounded-xl p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Mobile View - Stacked */}
        <div className="md:hidden space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City, Neighborhood, or Zip"
                className="pl-9 h-12"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Property Type
            </label>
            <Select value={propertyType || undefined} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Budget
            </label>
            <Select value={budget || undefined} onValueChange={setBudget}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full h-12 text-lg shadow-sm"
            data-testid="button-search-mobile"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {/* Desktop View - Horizontal */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City, Zip..."
                className="pl-9 h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="h-12 w-[1px] bg-border"
          />

          <div className="w-[200px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Type
            </label>
            <Select value={propertyType || undefined} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Property" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator
            orientation="vertical"
            className="h-12 w-[1px] bg-border"
          />

          <div className="w-[200px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Budget
            </label>
            <Select value={budget || undefined} onValueChange={setBudget}>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Price Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="lg"
            className="h-12 px-8 ml-2 shadow-sm"
            data-testid="button-search-desktop"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>
    </section>
  );
}
