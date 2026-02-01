import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export function Hero() {
  const [, setLocation] = useLocation();
  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/Hero/hero-background.png")' }}
      >
        <div className="absolute inset-0 bg-background/65" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
              Find a place you will call{" "}
              <span className="text-muted-foreground/70 decoration-4 decoration-border underline-offset-4">
                home
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Discover a curated selection of premium properties, luxury
              apartments, and modern homes designed for your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => setLocation("/properties")}
                className="h-14 px-8 text-base shadow-sm"
                data-testid="button-explore"
              >
                Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-2"
                data-testid="button-contact"
              >
                Contact Us
              </Button>
            </div>

            {/* Trust Indicators / Stats (Optional enhancement for wireframe) */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border mt-8">
              <div>
                <p className="text-2xl font-bold font-heading">1.2k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Properties
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">300+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Agents
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">15k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Happy Clients
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/30 rounded-2xl transform rotate-3 -z-10" />
            <img
              src="/Hero/hero-1.png"
              alt="Modern Luxury Villa"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover shadow-xl border-4 border-background rounded-lg transition-transform duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
