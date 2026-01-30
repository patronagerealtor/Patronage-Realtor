import { Search, MapPin, DollarSign, Home, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function PropertySearch() {
  return (
    <section className="container mx-auto px-4 -mt-8 relative z-10 mb-20">
      <div className="bg-card shadow-xl border border-border rounded-xl p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        
        {/* Mobile View - Stacked */}
        <div className="md:hidden space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="City, Neighborhood, or Zip" className="pl-9 h-12" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Property Type</label>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Budget</label>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">$0 - $100k</SelectItem>
                <SelectItem value="med">$100k - $500k</SelectItem>
                <SelectItem value="high">$500k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full h-12 text-lg shadow-sm" data-testid="button-search-mobile">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {/* Desktop View - Horizontal */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="City, Zip..." className="pl-9 h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors" />
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-12 w-[1px] bg-border" />

          <div className="w-[200px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Type</label>
            <Select>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Property" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-12 w-[1px] bg-border" />

          <div className="w-[200px] space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Budget</label>
            <Select>
              <SelectTrigger className="h-12 border-transparent bg-secondary/30 hover:bg-secondary/50 focus:bg-background transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Price Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">$0 - $500k</SelectItem>
                <SelectItem value="med">$500k - $1M</SelectItem>
                <SelectItem value="high">$1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" className="h-14 px-8 ml-2 shadow-sm" data-testid="button-search-desktop">
            <Search className="h-5 w-5 mr-2" /> Search
          </Button>
        </div>
      </div>
    </section>
  );
}
