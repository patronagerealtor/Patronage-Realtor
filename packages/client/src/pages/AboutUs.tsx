import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Award, Users, Target, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const stats = [
  { label: "Happy Clients", value: "1000+", icon: Users },
  { label: "Trust", value: "100%", icon: CheckCircle2 },
  { label: "Properties Sold", value: "500+", icon: Target },
  { label: "Years Experience", value: "4+", icon: Award }


];


export default function AboutUs() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // change to "auto" if you want instant
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
            Redefining the Standard of{" "}
            <span className="text-primary">Luxury Living</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Since 2021, Patronage Realtor has been at the forefront of the
            premium real estate market, connecting discerning clients with
            extraordinary homes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
  Patronage Realtor was founded in <strong>2021</strong> with a vision to redefine how individuals experience real estate — through clarity, trust, and professional guidance. What began as a self-funded entrepreneurial initiative by <strong>Samyak Gaikwad</strong> during his college years evolved through hands-on industry learning, persistence, and a strong belief in transparent, value-driven real estate solutions. From the outset, the focus was never limited to transactions, but on helping individuals make informed and confident decisions for their future.
</p>

<p className="text-lg text-muted-foreground mb-6">
  During the early phase, <strong>Prathmesh Mahidwar</strong> closely supported the journey, sharing a deep interest in promoting awareness and education within the real estate space. As their long-term vision aligned, he joined the organization, strengthening its strategic direction and contributing to the development of Patronage Realtor as an integrated real estate solutions platform. Today, the company offers property consulting, financial guidance, and interior solutions through trusted partner networks — ensuring clients receive comprehensive, ethical, and reliable support at every step of their journey.
</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="text-center p-6 border-none bg-secondary/10"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background shadow-sm border border-border">
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p className="text-muted-foreground">
                Transparency is the foundation of every relationship we build
                with our clients and partners.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-background shadow-sm border border-border">
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for perfection in every detail, from property
                selection to final interior finishes.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-background shadow-sm border border-border">
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                Leveraging modern technology to provide a seamless and efficient
                property search experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Our team of expert consultants is ready to guide you through every
            step of the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-12">
              Contact Our Team
            </Button>
            <Button
              size="lg"
              onClick={() => setLocation("/properties")}
              variant="outline"
              className="px-12 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              View Listings
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
