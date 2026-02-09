import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertySearch } from "@/components/home/PropertySearch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PropertyDetailDialog } from "@/components/shared/PropertyDetailDialog";
import { MapPin, Bed, Bath, Square, Building2, Home } from "lucide-react";
import { useProperties } from "@/hooks/use-properties";
import type { PropertyRow } from "@/lib/supabase";

export default function Properties() {
  const { properties } = useProperties();
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
          <PropertySearch />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden group border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="p-0 relative">
                <Badge className="absolute top-4 left-4 z-10 bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
                  {property.status}
                </Badge>
                <div className="overflow-hidden h-64">
                  {property.image_url ? (
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
                  className="w-full"
                  variant="outline"
                  onClick={() => openDetail(property)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailProperty(null);
        }}
        similarProperties={properties.filter((p) => p.id !== detailProperty?.id).slice(0, 4)}
      />

      <Footer />
    </div>
  );
}
