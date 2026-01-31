import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function AboutPreview() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About Our Company</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
            We are redefining the <br/> real estate experience
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2015, Estate.co has grown from a small local agency to a nationwide platform. 
            We believe that finding a home should be an exciting journey, not a stressful task.
          </p>
          <div className="pt-4">
            <Link href="/about-us">
              <Button variant="outline" size="lg" className="border-2">
                Read More About Us
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PlaceholderImage height="h-64" text="Team" className="mt-8" />
          <PlaceholderImage height="h-64" text="Office" />
        </div>

      </div>
    </section>
  );
}
