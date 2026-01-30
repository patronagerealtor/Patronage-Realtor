import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";

const FEATURED_PROPERTIES = [
  { id: 1, title: "Modern Villa", location: "Beverly Hills, CA", price: "$2,500,000", beds: 4, baths: 3, sqft: "3,200", status: "For Sale" },
  { id: 2, title: "Downtown Loft", location: "New York, NY", price: "$1,200,000", beds: 2, baths: 2, sqft: "1,400", status: "For Rent" },
  { id: 3, title: "Seaside Condo", location: "Miami, FL", price: "$850,000", beds: 3, baths: 2, sqft: "1,800", status: "For Sale" },
  { id: 4, title: "Mountain Cabin", location: "Aspen, CO", price: "$3,100,000", beds: 5, baths: 4, sqft: "4,500", status: "New" },
  { id: 5, title: "Urban Townhouse", location: "Chicago, IL", price: "$950,000", beds: 3, baths: 2.5, sqft: "2,100", status: "For Sale" },
  { id: 6, title: "Suburban Family Home", location: "Austin, TX", price: "$650,000", beds: 4, baths: 2, sqft: "2,400", status: "For Sale" },
];

export function FeaturedProperties() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs tracking-widest uppercase">Latest Listings</Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Featured Properties</h2>
          <p className="text-muted-foreground max-w-lg">Handpicked selection of the finest properties available this week.</p>
        </div>
        <Button variant="outline" className="hidden md:flex gap-2">View All Properties <ArrowRight className="h-4 w-4" /></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURED_PROPERTIES.slice(0, 3).map((property) => (
          <Card key={property.id} className="overflow-hidden group border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 relative">
              <Badge className="absolute top-4 left-4 z-10 bg-background/90 text-foreground backdrop-blur-sm shadow-sm">{property.status}</Badge>
              <div className="overflow-hidden h-64">
                 <PlaceholderImage 
                   height="h-full" 
                   text="Property Image" 
                   className="rounded-none group-hover:scale-105 transition-transform duration-500" 
                 />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading font-bold text-xl">{property.title}</h3>
                <span className="font-bold text-lg text-primary">{property.price}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.beds} Beds</span>
                <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.baths} Baths</span>
                <span className="flex items-center gap-1"><Square className="h-4 w-4" /> {property.sqft} sqft</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full" variant="outline">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <Button className="w-full" variant="outline">View All Properties</Button>
      </div>
    </section>
  );
}
