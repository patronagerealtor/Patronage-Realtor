import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { BackgroundPaths } from "@/components/ui/background-paths";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Animated Background Paths */}
      <div className="absolute inset-0 z-0">
        <BackgroundPaths />
        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Hero Content */}
      <div className="container relative z-20 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1]">
              Find a place you will call{" "}
              <span className="text-muted-foreground/70 underline-offset-4">
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
                className="h-14 px-8 text-base shadow-sm
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-lg
                  active:translate-y-0.5"
              >
                Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-2"
              >
                Contact Us
              </Button>
            </div>

            {/* Trust Indicators */}
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
              className="w-full h-[400px] md:h-[500px] lg:h-[600px]
                object-cover rounded-lg border-4 border-background
                shadow-xl transition-transform duration-500 ease-out
                hover:scale-[1.02] hover:shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
