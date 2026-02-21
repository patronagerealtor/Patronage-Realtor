import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
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
import { formatIndianPrice } from "../lib/formatIndianPrice";
import type { FilterOptions } from "../components/home/PropertySearch";

function getSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  const loc = window.location.pathname + window.location.search;
  const query = loc.includes("?") ? loc.slice(loc.indexOf("?")) : "";
  return new URLSearchParams(query);
}

function deriveFilterOptions(properties: PropertyRow[]): FilterOptions {
  const statuses = [...new Set(properties.map((p) => p.status).filter(Boolean))].sort();
  const locations = [...new Set(properties.map((p) => (p.location ?? "").trim()).filter(Boolean))].sort();
  const bhkTypes = [...new Set(properties.map((p) => p.bhk_type).filter((v): v is string => v != null && v !== ""))].sort();
  const propertyTypes = [...new Set(properties.map((p) => p.property_type).filter((v): v is string => v != null && v !== ""))].sort();
  return { statuses, locations, bhkTypes, propertyTypes };
}

function filterProperties(
  properties: PropertyRow[],
  params: URLSearchParams
): PropertyRow[] {
  const statusQ = params.get("status")?.trim();
  const locationQ = params.get("location")?.trim().toLowerCase();
  const bhkQ = params.get("bhk")?.trim();
  const typeQ = params.get("type")?.trim();
  const budgetQ = params.get("budget")?.trim();

  return properties.filter((p) => {
    if (statusQ && (p.status ?? "") !== statusQ) return false;
    if (locationQ && !(p.location ?? "").toLowerCase().includes(locationQ)) return false;
    if (bhkQ && (p.bhk_type ?? "") !== bhkQ) return false;
    if (typeQ && (p.property_type ?? "") !== typeQ) return false;
    if (budgetQ && p.price_value != null) {
      const v = p.price_value;
      if (budgetQ === "low" && v > 50) return false;
      if (budgetQ === "med" && (v <= 50 || v > 100)) return false;
      if (budgetQ === "high" && v <= 100) return false;
    }
    if (budgetQ && p.price_value == null) return false;
    return true;
  });
}

export default function Properties() {
  const [location] = useLocation();
  const { properties } = useProperties();
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const searchKey = location.includes("?") ? location.slice(location.indexOf("?")) : "";
  const filteredProperties = useMemo(
    () => filterProperties(properties, getSearchParams()),
    [properties, searchKey]
  );
  const filterOptions = useMemo(() => deriveFilterOptions(properties), [properties]);

  const openDetail = (property: PropertyRow) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <PropertySearch key={searchKey} filterOptions={filterOptions} />
        </div>

        {filteredProperties.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            {searchKey
              ? "No properties match your filters. Try adjusting location, type, or budget."
              : "No properties available."}
          </p>
        ) : (
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
                <div className="overflow-hidden h-64">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-xl">
                    {property.title}
                  </h3>
                  <span className="font-bold text-lg text-primary">
                    {formatIndianPrice(property.price_value ?? property.price)}
                  </span>
                </div>
                {property.developer ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <Building2 className="h-4 w-4 mr-1 shrink-0" />
                    <span>{property.developer}</span>
                  </div>
                ) : null}
                {property.location ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                    <span>{property.location}</span>
                  </div>
                ) : null}
                {property.property_type ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <Home className="h-4 w-4 mr-1 shrink-0" />
                    <span>{property.property_type}</span>
                  </div>
                ) : (
                  <div className="mb-4" />
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                  {property.bhk_type ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" /> {property.bhk_type}
                    </span>
                  ) : null}
                  {property.possession_by ? (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />{" "}
                      {property.possession_by.replace(/^(\d{4})-(\d{2})$/, "$2/$1")}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" /> {property.sqft} sq.ft
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
        )}
      </main>

      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailProperty(null);
        }}
        similarProperties={filteredProperties.filter((p) => p.id !== detailProperty?.id).slice(0, 4)}
      />

      <Footer />
    </div>
  );
}
