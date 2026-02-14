import { Button } from "../ui/button";

export function ContactCTA() {
  return (
    <section className="w-full bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
          Looking for your dream property?
        </h2>
        <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-10">
          Connect with our expert agents today and let us help you find the perfect match.
        </p>
        <Button size="lg" className="bg-background text-foreground hover:bg-background/90 h-14 px-10 text-lg font-medium">
          Contact Us
        </Button>
      </div>
    </section>
  );
}
