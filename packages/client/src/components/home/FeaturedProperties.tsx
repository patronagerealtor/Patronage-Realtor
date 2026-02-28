import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { PlaceholderImage } from "../shared/PlaceholderImage";
import { PropertyDetailDialog } from "../shared/PropertyDetailDialog";
import { SupabaseImage } from "../shared/SupabaseImage";
import { cn } from "../../lib/utils";
import { MapPin, ArrowRight, Building2, Home, CalendarDays, Ruler } from "lucide-react";
import { useProperties } from "../../hooks/use-properties";
import type { PropertyRow } from "../../lib/supabase";
import { getDisplayPrice } from "../../lib/formatIndianPrice";

/** Deterministic hash from string (for daily seed). Same date => same featured set. */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

/** Pick 3 properties at random, changing each day (seeded by YYYY-MM-DD). */
function getDailyFeatured(properties: PropertyRow[], count: number): PropertyRow[] {
  if (properties.length === 0) return [];
  const today = new Date();
  const dateSeed =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const shuffled = [...properties].sort((a, b) => {
    const ha = hashString(`${dateSeed}-${a.id}`);
    const hb = hashString(`${dateSeed}-${b.id}`);
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

export function FeaturedProperties() {
  const { properties } = useProperties();
  const featured = useMemo(() => getDailyFeatured(properties, 3), [properties]);
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (property: PropertyRow) => {
    setDetailProperty(property);
    setDetailOpen(true);
  };

  return (
    <motion.section
      id="featured-properties"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-16 md:py-24"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <Badge variant="outline" className="text-xs tracking-widest uppercase">
            Latest Listings
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-lg">
            A fresh random selection of three properties, updated every day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden md:inline-flex gap-2 hover:scale-105 transition-transform"
            )}
          >
            View All Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {featured.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex"
          >
            <Card
              className="overflow-hidden group border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full min-h-[560px]"
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
              <CardHeader className="p-0 relative shrink-0">
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
                    <SupabaseImage
                      src={property.images[0]}
                      alt={property.title}
                      transformWidth={600}
                      className="w-full h-full object-cover rounded-none group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : property.image_url ? (
                    <SupabaseImage
                      src={property.image_url}
                      alt={property.title}
                      transformWidth={600}
                      className="w-full h-full object-cover rounded-none group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <PlaceholderImage
                      height="h-full"
                      text="Property Image"
                      className="rounded-none group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-heading font-bold text-xl line-clamp-2 min-w-0">
                    {property.title}
                  </h3>
                  <span className="font-bold text-lg text-primary shrink-0">
                    {getDisplayPrice(property)}
                  </span>
                </div>

                {property.developer ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-1 min-w-0">
                    <Building2 className="h-4 w-4 mr-1 shrink-0" />
                    <span className="truncate">{property.developer}</span>
                  </div>
                ) : null}

                {property.location ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-1 min-w-0">
                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                ) : null}

                {property.property_type ? (
                  <div className="flex items-center text-muted-foreground text-sm mb-4 min-w-0">
                    <Home className="h-4 w-4 mr-1 shrink-0" />
                    <span className="truncate">{property.property_type}</span>
                  </div>
                ) : (
                  <div className="mb-4" />
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border mt-auto shrink-0">
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

              <CardFooter className="p-6 pt-0 shrink-0">
                <Button
                  className="w-full transition-transform duration-300 hover:scale-105"
                  variant="outline"
                  type="button"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailProperty(null);
        }}
        similarProperties={properties
          .filter((p) => p.id !== detailProperty?.id)
          .slice(0, 4)}
        onSimilarPropertySelect={setDetailProperty}
      />

      <div className="mt-8 md:hidden">
        <Link
          href="/properties"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full inline-flex justify-center hover:scale-105 transition-transform"
          )}
        >
          View All Properties
        </Link>
      </div>
    </motion.section>
  );
}
