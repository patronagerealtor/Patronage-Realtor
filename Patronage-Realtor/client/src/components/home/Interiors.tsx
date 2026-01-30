import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { ArrowRight } from "lucide-react";

export function Interiors() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Mobile Order: Text First, then Image */}
          <div className="order-1 md:order-2">
            <div className="relative p-2 border-2 border-border rounded-xl bg-background">
               <PlaceholderImage 
                 height="h-[300px] md:h-[400px] lg:h-[500px]" 
                 text="Interior Design Showcase" 
               />
            </div>
          </div>

          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
              Design your home with <br className="hidden md:block"/> world-class interiors
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our partner interior designers help you transform your space into a sanctuary. 
              From minimalist aesthetics to classic luxury, we provide turnkey interior solutions.
            </p>
            
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-2 w-2 bg-primary rounded-full" /> 
                Custom Furniture Design
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-2 w-2 bg-primary rounded-full" /> 
                Lighting & Ambience Planning
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-2 w-2 bg-primary rounded-full" /> 
                Space Optimization Consulting
              </li>
            </ul>

            <Button className="mt-4" size="lg">
              Explore Interiors <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
