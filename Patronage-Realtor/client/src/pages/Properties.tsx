import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { useEffect } from "react";

const ALL_PROPERTIES = [
  { id: 1, title: "Modern Villa", location: "Beverly Hills, CA", price: "$2,500,000", beds: 4, baths: 3, sqft: "3,200", status: "For Sale" },
  { id: 2, title: "Downtown Loft", location: "New York, NY", price: "$1,200,000", beds: 2, baths: 2, sqft: "1,400", status: "For Rent" },
  { id: 3, title: "Seaside Condo", location: "Miami, FL", price: "$850,000", beds: 3, baths: 2, sqft: "1,800", status: "For Sale" },
  { id: 4, title: "Mountain Retreat", location: "Aspen, CO", price: "$3,100,000", beds: 5, baths: 4, sqft: "4,500", status: "For Sale" },
  { id: 5, title: "Lakeside Cottage", location: "Lake Tahoe, CA", price: "$950,000", beds: 3, baths: 2, sqft: "2,100", status: "For Sale" },
  { id: 6, title: "City Penthouse", location: "Chicago, IL", price: "$1,800,000", beds: 3, baths: 3, sqft: "2,800", status: "For Rent" },
];

export default function Properties() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12">
          <Badge variant="outline" className="text-xs tracking-widest uppercase mb-4">Inventory</Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">All Properties</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore our complete collection of premium real estate, from luxury villas to modern city apartments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PROPERTIES.map((property) => (
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
      </main>

      <Footer />
    </div>
  );
}
