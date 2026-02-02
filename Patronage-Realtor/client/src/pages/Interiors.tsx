import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const packages = [
  {
    name: "Silver",
    price: "₹499/sqft",
    description: "Essential design for a modern home.",
    features: ["2D Layout Plans", "Color Consultation", "Material Selection Guide", "Basic Lighting Plan"],
    color: "bg-slate-100",
  },
  {
    name: "Gold",
    price: "₹899/sqft",
    description: "Elevated aesthetics with detailed planning.",
    features: ["Everything in Silver", "3D Realistic Renders", "False Ceiling Design", "Modular Kitchen Planning"],
    color: "bg-yellow-50",
  },
  {
    name: "Platinum",
    price: "₹1,499/sqft",
    description: "Premium craftsmanship and bespoke designs.",
    features: ["Everything in Gold", "Custom Furniture Design", "Home Automation", "On-site Supervision"],
    color: "bg-blue-50",
  },
  {
    name: "Luxury",
    price: "Custom",
    description: "The pinnacle of interior excellence.",
    features: ["Everything in Platinum", "International Sourcing", "Art Curation", "Turnkey Execution"],
    color: "bg-purple-50",
  },
];

export default function Interiors() {
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [houseType, setHouseType] = useState("2BHK");
  const [totalArea, setTotalArea] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
        style={{ backgroundImage: 'url("/interiors/interior-bg-2.png")' }}
      >
        <div className="absolute inset-0 bg-background/65" />
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-heading font-bold mb-6 tracking-tight">
            Interiors that make your neighbor's <span className="text-primary italic">"accidental"</span> peeking worthwhile.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We don't just move furniture; we orchestrate a symphony of style where your sofa actually talks to your curtains (and they agree on everything). Because "good enough" is for people who still use flip phones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.name} className={`flex flex-col border-2 transition-all hover:shadow-lg ${pkg.color}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="font-semibold text-lg text-primary">{pkg.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-6">{pkg.description}</p>
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedPackage(pkg)}>
                      Select {pkg.name}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`sm:max-w-[500px] border-2 shadow-2xl ${pkg.color}`}>
                    <DialogHeader className="text-center">
                      <DialogTitle className="text-3xl">Customize {pkg.name} Package</DialogTitle>
                      <DialogDescription>
                        Share your home details for a personalized quote.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-8 py-4">
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold">House Type</Label>
                        <RadioGroup 
                          value={houseType} 
                          onValueChange={setHouseType}
                          className="grid grid-cols-3 gap-4"
                        >
                          {["1BHK", "2BHK", "3BHK"].map((type) => (
                            <div key={type} className="flex items-center space-x-2 border p-4 rounded-xl hover:bg-white/50 transition-colors cursor-pointer bg-white/30">
                              <RadioGroupItem value={type} id={type} />
                              <Label htmlFor={type} className="cursor-pointer font-medium">{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="area" className="text-lg font-semibold">Total Area (sq.ft.)</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="e.g. 1200"
                          value={totalArea}
                          onChange={(e) => setTotalArea(e.target.value)}
                          className="text-lg py-6 rounded-xl bg-white/50 border-white/50"
                        />
                      </div>

                      <Button className="w-full text-lg py-6 rounded-xl mt-4">
                        Get Estimated Quote
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center bg-secondary/30 p-12 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Still confused?</h2>
          <p className="mb-8 text-muted-foreground">Our designers have a PhD in matching cushions to your personality. Even if your personality is "I just want it to look like a Pinterest board."</p>
          <Button size="lg" className="rounded-full px-8">Talk to our Designers</Button>
        </div>
      </main>
      <Footer />
      </div>
    </div>
  );
}
