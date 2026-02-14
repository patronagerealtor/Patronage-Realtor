import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { PlaceholderImage } from "../shared/PlaceholderImage";
import { PropertyDetailDialog } from "../shared/PropertyDetailDialog";
import { cn } from "../../lib/utils";
import { MapPin, Bed, Bath, Square, ArrowRight, Building2, Home } from "lucide-react";
import { useProperties } from "../../hooks/use-properties";
import type { PropertyRow } from "../../lib/supabase";

export function FeaturedProperties() {
  const { properties } = useProperties();
  const featured = properties.slice(0, 3);
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
            Handpicked selection of the finest properties available this week.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-0 relative">
                <Badge className="absolute top-4 left-4 z-10 bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
                  {property.status}
                </Badge>

                <div className="overflow-hidden h-64">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
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

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-xl">
                    {property.title}
                  </h3>
                  <span className="font-bold text-lg text-primary">
                    {property.price}
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
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" /> {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" /> {property.baths} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" /> {property.sqft} sq.ft
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full transition-transform duration-300 hover:scale-105"
                  variant="outline"
                  onClick={() => openDetail(property)}
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
