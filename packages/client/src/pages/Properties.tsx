import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PropertySearch } from "../components/home/PropertySearch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PlaceholderImage } from "../components/shared/PlaceholderImage";
import { PropertyDetailDialog } from "../components/shared/PropertyDetailDialog";
import { MapPin, Building2, Home, CalendarDays, Ruler } from "lucide-react";
import { useProperties } from "../hooks/use-properties";
import type { PropertyRow } from "../lib/supabase";
import { getDisplayPrice } from "../lib/formatIndianPrice";
import type { FilterOptions } from "../components/home/PropertySearch";

function getSearchParamsFromQuery(queryString: string): URLSearchParams {
  return new URLSearchParams(queryString || "");
}

const BUDGET_RANGES: Record<string, [number, number]> = {
  low: [0, 50],
  med: [51, 100],
  high: [101, Infinity],
};

type FilterResult = { filteredProperties: PropertyRow[]; filterOptions: FilterOptions };

/** Single pass: filter by params and derive cascading options from the filtered set. */
function filterAndDeriveOptions(
  properties: PropertyRow[],
  params: URLSearchParams
): FilterResult {
  const statusQ = params.get("status")?.trim();
  const locationQ = params.get("location")?.trim().toLowerCase();
  const bhkQ = params.get("bhk")?.trim();
  const typeQ = params.get("type")?.trim();
  const budgetQ = params.get("budget")?.trim();
  const budgetRange = budgetQ ? BUDGET_RANGES[budgetQ] : null;

  const statusSet = new Set<string>();
  const locationSet = new Set<string>();
  const bhkSet = new Set<string>();
  const typeSet = new Set<string>();
  const filtered: PropertyRow[] = [];

  const sortStr = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];

    if (statusQ && (p.status ?? "") !== statusQ) continue;
    if (locationQ && !(p.location ?? "").toLowerCase().includes(locationQ)) continue;
    if (bhkQ && (p.bhk_type ?? "") !== bhkQ) continue;
    if (typeQ && (p.property_type ?? "") !== typeQ) continue;
    if (budgetRange) {
      const v = p.price_value;
      if (v == null) continue;
      if (v < budgetRange[0] || v > budgetRange[1]) continue;
    }

    filtered.push(p);
    const st = (p.status ?? "").trim();
    if (st) statusSet.add(st);
    const loc = (p.location ?? "").trim();
    if (loc) locationSet.add(loc);
    const bhk = (p.bhk_type ?? "").trim();
    if (bhk) bhkSet.add(bhk);
    const typ = (p.property_type ?? "").trim();
    if (typ) typeSet.add(typ);
  }

  return {
    filteredProperties: filtered,
    filterOptions: {
      statuses: [...statusSet].sort(sortStr),
      locations: [...locationSet].sort(sortStr),
      bhkTypes: [...bhkSet].sort(sortStr),
      propertyTypes: [...typeSet].sort(sortStr),
    },
  };
}

/** wouter's useLocation() returns only pathname (no query). Use actual URL search so filters work. */
function useQueryString(): [string, () => void] {
  const [version, setVersion] = useState(0);
  const queryString =
    typeof window !== "undefined" ? (window.location.search || "") : "";
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const onPopState = () => setVersion((v) => v + 1);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return [queryString, refresh];
}

export default function Properties() {
  const [queryString, refreshQueryString] = useQueryString();
  const { properties, isLoading, error } = useProperties();
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const { filteredProperties, filterOptions } = useMemo(() => {
    const params = getSearchParamsFromQuery(queryString);
    return filterAndDeriveOptions(properties, params);
  }, [properties, queryString]);

  const openDetail = useCallback((property: PropertyRow) => {
    setDetailProperty(property);
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailProperty(null);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [queryString]);

  // Get similar properties (same type/location but different property)
  const similarProperties = useMemo(
    () =>
      filteredProperties
        .filter((p) => p.id !== detailProperty?.id)
        .slice(0, 4),
    [filteredProperties, detailProperty?.id]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading properties: {error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12">
          <Badge
            variant="outline"
            className="text-xs tracking-widest uppercase mb-4"
          >
            Inventory
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            All Properties
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore our complete collection of premium real estate, from luxury
            villas to modern city apartments.
          </p>
        </div>

        <div className="mb-16">
          <PropertySearch
            filterOptions={filterOptions}
            onFilterChange={setHasActiveFilters}
            onSearchComplete={refreshQueryString}
            urlSearch={queryString}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {queryString
                ? "No properties match your filters. Try adjusting location, type, or budget."
                : "No properties available."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden group border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openDetail(property)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetail(property);
                    }
                  }}
                >
                  <CardHeader className="p-0 relative">
                    <Badge className="absolute top-4 left-4 z-10 bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
                      {property.status}
                    </Badge>
                    {property.rera_applicable && (
                      <span className="absolute top-4 right-4 z-10 rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                        ✓ RERA
                      </span>
                    )}
                    <div className="overflow-hidden h-64 bg-muted">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : property.image_url ? (
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <PlaceholderImage
                          height="h-full"
                          text="Property Image"
                          className="rounded-none group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-heading font-bold text-xl line-clamp-2">
                        {property.title}
                      </h3>
                      <span className="font-bold text-lg text-primary shrink-0">
                        {getDisplayPrice(property)}
                      </span>
                    </div>
                    {property.developer ? (
                      <div className="flex items-center text-muted-foreground text-sm mb-1">
                        <Building2 className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{property.developer}</span>
                      </div>
                    ) : null}
                    {property.location ? (
                      <div className="flex items-center text-muted-foreground text-sm mb-1">
                        <MapPin className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    ) : null}
                    {property.property_type ? (
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <Home className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{property.property_type}</span>
                      </div>
                    ) : (
                      <div className="mb-4" />
                    )}

                    <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border gap-2">
                      {property.bhk_type ? (
                        <span className="flex items-center gap-1">
                          <Home className="h-4 w-4 shrink-0" /> {property.bhk_type}
                        </span>
                      ) : null}
                      {property.possession_by ? (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 shrink-0" />{" "}
                          {property.possession_by.replace(/^(\d{4})-(\d{2})$/, "$2/$1")}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Ruler className="h-4 w-4 shrink-0" /> {property.sqft} sq.ft
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full"
                      variant="outline"
                      type="button"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
        similarProperties={similarProperties}
        onSimilarPropertySelect={setDetailProperty}
      />

      <Footer />
    </div>
  );
}