import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "wouter";
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
import { SupabaseImage } from "../components/shared/SupabaseImage";
import { MapPin, Building2, Home, CalendarDays, Ruler } from "lucide-react";
import { useProperties } from "../hooks/use-properties";
import type { PropertyRow } from "../lib/supabase";
import { getDisplayPrice } from "../lib/formatIndianPrice";
import type { FilterOptions } from "../components/home/PropertySearch";

function getSearchParamsFromQuery(queryString: string): URLSearchParams {
  return new URLSearchParams(queryString || "");
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500; // Lakhs (slider max default)

function parsePriceParam(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Convert price to Lakhs. Values >= 10000 are treated as Rupees (÷100000); else already Lakhs. */
function toLakhs(v: number): number {
  return v >= 10_000 ? v / 100_000 : v;
}

type FilterResult = { filteredProperties: PropertyRow[]; filterOptions: FilterOptions };

/** Single pass: filter by params and derive cascading options from the filtered set. */
function filterAndDeriveOptions(
  properties: PropertyRow[],
  params: URLSearchParams
): FilterResult {
  const statusQ = params.get("status")?.trim();
  const locationQ = params.get("location")?.trim().toLowerCase();
  const bhkQ = params.get("bhk")?.trim();
  const hasMinPrice = params.has("minPrice");
  const hasMaxPrice = params.has("maxPrice");
  const filterByBudget = hasMinPrice || hasMaxPrice;
  const minPrice = hasMinPrice ? parsePriceParam(params.get("minPrice"), DEFAULT_MIN_PRICE) : DEFAULT_MIN_PRICE;
  const maxPrice = hasMaxPrice ? parsePriceParam(params.get("maxPrice"), DEFAULT_MAX_PRICE) : DEFAULT_MAX_PRICE;

  const statusSet = new Set<string>();
  const locationSet = new Set<string>();
  const bhkSet = new Set<string>();
  const filtered: PropertyRow[] = [];

  const sortStr = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];

    if (statusQ && (p.status ?? "") !== statusQ) continue;
    if (locationQ && !(p.location ?? "").toLowerCase().includes(locationQ)) continue;
    if (bhkQ && (p.bhk_type ?? "") !== bhkQ) continue;
    if (filterByBudget) {
      const pMinRaw = p.price_min;
      const pMaxRaw = p.price_max;
      const pValRaw = p.price_value;
      const hasRange = pMinRaw != null && pMaxRaw != null;

      if (hasRange) {
        const pMin = toLakhs(pMinRaw);
        const pMax = toLakhs(pMaxRaw);
        // Range: include if property range overlaps slider range (both in Lakhs)
        if (pMin > maxPrice || pMax < minPrice) continue;
      } else if (pMinRaw != null) {
        const pMin = toLakhs(pMinRaw);
        if (pMin < minPrice || pMin > maxPrice) continue;
      } else if (pMaxRaw != null) {
        const pMax = toLakhs(pMaxRaw);
        if (pMax < minPrice || pMax > maxPrice) continue;
      } else if (pValRaw != null) {
        const pVal = toLakhs(pValRaw);
        if (pVal < minPrice || pVal > maxPrice) continue;
      } else {
        continue; // No price data
      }
    }

    filtered.push(p);
    const st = (p.status ?? "").trim();
    if (st) statusSet.add(st);
    const loc = (p.location ?? "").trim();
    if (loc) locationSet.add(loc);
    const bhk = (p.bhk_type ?? "").trim();
    if (bhk) bhkSet.add(bhk);
  }

  return {
    filteredProperties: filtered,
    filterOptions: {
      statuses: [...statusSet].sort(sortStr),
      locations: [...locationSet].sort(sortStr),
      bhkTypes: [...bhkSet].sort(sortStr),
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
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? undefined;
  const [, setLocation] = useLocation();
  const { properties, isLoading, error } = useProperties();
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Open detail when URL has a slug (dedicated property URL)
  const propertyBySlug = useMemo(
    () => (slug && properties.length ? properties.find((p) => (p.slug ?? "").trim() === slug) ?? null : null),
    [slug, properties]
  );
  useEffect(() => {
    if (!slug) return;
    if (propertyBySlug) {
      setDetailProperty(propertyBySlug);
      setDetailOpen(true);
    } else {
      setDetailOpen(false);
      setDetailProperty(null);
    }
  }, [slug, propertyBySlug?.id]);

  const { filteredProperties, filterOptions } = useMemo(() => {
    const params = getSearchParamsFromQuery(queryString);
    return filterAndDeriveOptions(properties, params);
  }, [properties, queryString]);

  const openDetail = useCallback(
    (property: PropertyRow) => {
      setDetailProperty(property);
      setDetailOpen(true);
      if (property.slug?.trim()) setLocation(`/properties/${encodeURIComponent(property.slug.trim())}`);
    },
    [setLocation]
  );

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailProperty(null);
    if (slug) setLocation("/properties");
  }, [slug, setLocation]);

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

  const priceRangeMax = useMemo(() => {
    const toLakhs = (v: number) => (v >= 10_000 ? v / 100_000 : v);
    const values = properties
      .map((p) => [p.price_value, p.price_min, p.price_max].filter((v): v is number => v != null && Number.isFinite(v)))
      .flat()
      .map(toLakhs);
    return values.length ? Math.max(DEFAULT_MAX_PRICE, ...values) : DEFAULT_MAX_PRICE;
  }, [properties]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
          <div className="text-center py-12">
            <p className="text-red-500">
              Error loading properties: {error instanceof Error ? error.message : String(error)}
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Check .env for VITE_SUPABASE_2_URL and VITE_SUPABASE_2_ANON_KEY. In Supabase, ensure the{" "}
              <code className="text-xs bg-muted px-1 rounded">properties</code> table exists and has a policy allowing
              read (e.g. &quot;Allow anon all for migration&quot;).
            </p>
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
            priceRangeMax={priceRangeMax}
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
                ? "No properties match your filters. Try adjusting status, location, or budget."
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
                        <SupabaseImage
                          src={property.images[0]}
                          alt={property.title}
                          transformWidth={600}
                          className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : property.image_url ? (
                        <SupabaseImage
                          src={property.image_url}
                          alt={property.title}
                          transformWidth={600}
                          className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
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
        onSimilarPropertySelect={(p) => {
          setDetailProperty(p as PropertyRow);
          const nextSlug = "slug" in p ? p.slug : undefined;
          if (nextSlug?.trim()) setLocation(`/properties/${encodeURIComponent(nextSlug.trim())}`);
        }}
      />

      <Footer />
    </div>
  );
}