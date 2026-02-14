import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export function Interiors() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-y border-border">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/interiors/interior-bg-1.png")' }}
      >
        <div className="absolute inset-0 bg-secondary/65" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Mobile Order: Text First, then Image */}
          <div className="order-1 md:order-2">
            <div className="relative p-2 border-2 border-border rounded-xl bg-background overflow-hidden group">
               <img 
                 src="/interiors/interior-hero.png"
                 alt="Interior Design Showcase"
                 className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg transition-transform duration-700 md:group-hover:scale-105"
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

            <Button className="mt-4" size="lg" onClick={() => setLocation("/interiors")}>
              Explore Interiors <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
