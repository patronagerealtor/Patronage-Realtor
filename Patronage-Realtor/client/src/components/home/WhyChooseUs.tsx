import { Home, Shield, Users, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Home,
    title: "Wide Range of Properties",
    description: "Access to over 10,000+ verified listings across the country."
  },
  {
    icon: Shield,
    title: "Trusted by Thousands",
    description: "We verify every property and agent to ensure your safety."
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Our team of experts is available 24/7 to guide you through."
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Streamlined paperwork and mortgage assistance to save time."
  }
];

export function WhyChooseUs() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Background with transparency overlay */}
      <div
        className="absolute inset-0 bg-muted/50 bg-[linear-gradient(to_bottom,hsl(var(--muted)/0.6),hsl(var(--background)/0.85))]"
        aria-hidden
      />
      <div className="container relative z-10 mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose Us</h2>
        <p className="text-muted-foreground">
          We are committed to providing the best real estate experience through transparency and expertise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, idx) => (
          <div key={idx} className="bg-card border border-border p-6 md:p-8 rounded-lg text-center hover:border-primary/50 transition-colors duration-300">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <feature.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 font-heading">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
