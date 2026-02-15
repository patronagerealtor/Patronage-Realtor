import { useEffect, useState } from "react";
import { Scene } from "../components/ui/hero-section";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import {
  Home,
  Sparkles,
  Check,
  ArrowRight,
  Bed,
  Utensils,
  Bath,
  Sofa,
  Lamp,
  Shield,
  Award,
  Clock,
  Users,
  ChevronDown,
  Minus,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  tagline: string;
  priceRange: string;
  highlights: string[];
  deliveryTime: string;
  image: string;
  popular?: boolean;
  color: string;
}

interface InteriorType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DesignImage {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface WhyChooseItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const packages: Package[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "Perfect for small spaces",
    priceRange: "₹2,999 - ₹4,999",
    highlights: [
      "Basic 3D Design",
      "Up to 2 Rooms",
      "Standard Materials",
      "Email Support",
    ],
    deliveryTime: "30 Days",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "Ideal for medium homes",
    priceRange: "₹5,999 - ₹9,999",
    highlights: [
      "Advanced 3D Design",
      "Up to 4 Rooms",
      "Premium Materials",
      "Priority Support",
    ],
    deliveryTime: "45 Days",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=400&fit=crop",
    popular: true,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Complete home makeover",
    priceRange: "₹9,999 - ₹15,999",
    highlights: [
      "Premium 3D Design",
      "Up to 6 Rooms",
      "Luxury Materials",
      "24/7 Support",
    ],
    deliveryTime: "60 Days",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=400&fit=crop",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "luxury",
    name: "Luxury",
    tagline: "Ultimate luxury experience",
    priceRange: "₹19,999+",
    highlights: [
      "Ultra Premium 3D Design",
      "Unlimited Rooms",
      "Exclusive Materials",
      "Dedicated Manager",
    ],
    deliveryTime: "90 Days",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=400&fit=crop",
    color: "from-purple-400 to-purple-600",
  },
];

const interiorTypes: InteriorType[] = [
  {
    id: "bedroom",
    name: "Bedroom",
    icon: <Bed className="w-8 h-8" />,
    description: "Cozy and comfortable bedroom designs",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: <Utensils className="w-8 h-8" />,
    description: "Modern and functional kitchen spaces",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: <Bath className="w-8 h-8" />,
    description: "Luxurious bathroom interiors",
  },
  {
    id: "living",
    name: "Living Room",
    icon: <Sofa className="w-8 h-8" />,
    description: "Elegant living room designs",
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: <Lamp className="w-8 h-8" />,
    description: "Ambient lighting solutions",
  },
];

const designImages: DesignImage[] = [
  {
    id: "1",
    title: "Modern Living Room",
    category: "Living",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Luxury Bedroom",
    category: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Contemporary Kitchen",
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Elegant Bathroom",
    category: "Bathroom",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Minimalist Office",
    category: "Office",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Cozy Dining",
    category: "Dining",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
  },
];

const whyChooseUs: WhyChooseItem[] = [
  {
    icon: <Award className="w-10 h-10" />,
    title: "Award Winning",
    description:
      "Recognized for excellence in interior design with multiple industry awards",
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Expert Team",
    description:
      "Experienced designers with 10+ years in creating stunning interiors",
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "On-Time Delivery",
    description: "We guarantee project completion within the agreed timeline",
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Quality Assured",
    description:
      "Premium materials and craftsmanship with lifetime warranty",
  },
];

const silverBhkOptions = [
  { bhk: 1, label: "1BHK", range: "₹4 – 6 Lakhs" },
  { bhk: 2, label: "2BHK", range: "₹6 – 8 Lakhs" },
  { bhk: 3, label: "3BHK", range: "₹8 – 10 Lakhs" },
] as const;

const silverByBhk: Record<1 | 2 | 3, { included: string[]; notIncluded: string[] }> = {
  1: {
    included: [
      "Modular kitchen (basic laminate finish)",
      "Bed + wardrobe + TV unit",
      "False ceiling in key areas",
      "Painting & basic electrical work",
      "Basic lighting & storage solutions",
    ],
    notIncluded: [
      "Premium hardware/veneer",
      "Imported materials or high-end counters",
      "Smart home/automation",
      "Luxury decor items",
    ],
  },
  2: {
    included: [
      "Modular kitchen (standard laminate)",
      "Wardrobes in bedrooms",
      "TV unit + simple furniture pieces",
      "False ceiling (select rooms)",
      "Painting + lighting + electrical setup",
    ],
    notIncluded: [
      "Premium materials/veneer finishes",
      "Branded appliances or automation",
      "Luxury lighting/decor",
    ],
  },
  3: {
    included: [
      "Modular kitchen (entry laminate)",
      "Wardrobes + beds + living room setup",
      "False ceiling (partial)",
      "Painting & basic lighting",
      "Utility area setup",
    ],
    notIncluded: [
      "Designer finishes/premium hardware",
      "Imported stones/rich textures",
      "Smart home systems",
    ],
  },
};

const goldBhkOptions = [
  { bhk: 1, label: "1BHK", range: "₹6 – 10 Lakhs" },
  { bhk: 2, label: "2BHK", range: "₹10 – 18 Lakhs" },
  { bhk: 3, label: "3BHK", range: "₹15 – 28 Lakhs" },
] as const;

const goldByBhk: Record<1 | 2 | 3, { included: string[]; notIncluded: string[] }> = {
  1: {
    included: [
      "Enhanced kitchen with better laminates/handles",
      "Premium wardrobes & storage",
      "Designer TV unit + quality lighting",
      "Detailed false ceilings",
      "Feature walls, textured paint",
    ],
    notIncluded: [
      "Imported marble/stone",
      "Full smart home automation",
      "Ultra-luxury furnishings",
    ],
  },
  2: {
    included: [
      "Mid-grade modular kitchen + countertop",
      "Bedroom wardrobes & beds",
      "Layered false ceilings + premium lighting",
      "Decor pieces & good furniture",
      "Electrical + civil work",
    ],
    notIncluded: [
      "High-end smart home tech beyond basic control",
      "Luxury imported materials",
    ],
  },
  3: {
    included: [
      "Quality modular kitchen (better hardware)",
      "Bedrooms + guest room cabinetry",
      "Living room with feature walls + décor",
      "Better lighting scheme + detail design",
      "Branded hardware & decent counters",
    ],
    notIncluded: [
      "Top-tier imported stone/marble",
      "Fully integrated home automation",
    ],
  },
};

const platinumBhkOptions = [
  { bhk: 1, label: "1BHK", range: "₹12 – 18 Lakhs" },
  { bhk: 2, label: "2BHK", range: "₹20 – 40 Lakhs" },
  { bhk: 3, label: "3BHK", range: "₹30 – 60L+" },
] as const;

const platinumByBhk: Record<1 | 2 | 3, { included: string[]; notIncluded: string[] }> = {
  1: {
    included: [
      "High-end modular kitchen (quartz/granite options)",
      "Premium wardrobes + designer furniture",
      "Feature lighting & designer ceilings",
      "Accent walls with special finishes",
      "Better décor & upholstery",
    ],
    notIncluded: [
      "Full smart home technology",
      "Imported luxury art / world-class designer pieces",
    ],
  },
  2: {
    included: [
      "Luxury kitchen with premium countertops",
      "Custom wardrobe & storage systems",
      "Rich décor + custom lighting plan",
      "High-end hardware (Hettich/Blum etc.)",
      "Premium upholstery & furniture pieces",
    ],
    notIncluded: [
      "Top-tier home automation beyond basics",
      "Rare imported materials or art",
    ],
  },
  3: {
    included: [
      "Premium kitchen with luxury fittings",
      "Bespoke furniture throughout",
      "Designer lighting & layered ceilings",
      "Accent stone/veneer walls",
      "High quality décor, upholstery, finishes",
    ],
    notIncluded: [
      "Full automation systems",
      "Collector art & imported designer fixtures",
    ],
  },
};

const luxuryBhkOptions = [
  { bhk: 1, label: "1BHK", range: "₹20 – 35 Lakhs+" },
  { bhk: 2, label: "2BHK", range: "₹40 – 80 Lakhs+" },
  { bhk: 3, label: "3BHK", range: "₹60L – 1.5 Cr+" },
] as const;

const luxuryByBhk: Record<1 | 2 | 3, { included: string[]; notIncluded: string[] }> = {
  1: {
    included: [
      "Bespoke metal/wood finishes",
      "Imported stone/quartz & designer cabinetry",
      "Integrated smart systems (lights/climate/audio)",
      "Custom furniture by premium brands",
    ],
    notIncluded: [
      "Designer art collections",
      "High-end appliances (client choice)",
    ],
  },
  2: {
    included: [
      "Fully custom interiors",
      "High-end smart home system",
      "Premium imported materials",
      "Designer lighting and AV",
    ],
    notIncluded: ["Appliances beyond interior scope"],
  },
  3: {
    included: [
      "Luxury finishes everywhere",
      "Complete automation (lights, HVAC, audio/video)",
      "Imported marble & custom cabinetry",
      "Art curation & bespoke décor",
    ],
    notIncluded: [
      "Appliances/standalone equipments (client supply)",
    ],
  },
};

export default function Interiors() {
  const [scrollY, setScrollY] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBhk, setSelectedBhk] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-[#000] to-[#1A2428] text-white"
      >
        <div className="absolute inset-0">
          <Scene />
        </div>
        <div
          className="relative z-10 container mx-auto px-4 text-center"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500),
          }}
        >
          <Badge
            className="mb-4 text-sm px-4 py-2"
            variant="secondary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Transform Your Space
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">
            Design Your Dream
            <br />
            <span className="text-amber-300">Interior</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Where creativity meets functionality. Let us bring your vision to
            life with stunning interior designs.
          </p>
          <Button
            size="lg"
            className="group text-lg px-8 py-6"
            onClick={() => scrollToSection("packages")}
          >
            Explore Interiors
            <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Pricing Plans</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Choose Your Package</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Select the perfect package that fits your needs and budget</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group flex flex-col ${
                  pkg.popular ? "border-primary border-2" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary">Popular</Badge>
                  </div>
                )}
                <div className="overflow-hidden rounded-t-xl">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className={`h-2 bg-gradient-to-r ${pkg.color}`} />
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.tagline}</CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">{pkg.priceRange}</span>
                    <span className="text-muted-foreground">/project</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {pkg.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Delivery: {pkg.deliveryTime}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full group"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Dialog
            open={!!selectedPackage}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedPackage(null);
                setSelectedBhk(1);
              }
            }}
          >
            <DialogContent
              className={
                selectedPackage?.id === "silver" || selectedPackage?.id === "gold" || selectedPackage?.id === "platinum" || selectedPackage?.id === "luxury"
                  ? "max-w-4xl w-[95vw] max-h-[90vh] bg-background backdrop-blur-lg rounded-3xl shadow-2xl border border-primary/20 p-0 overflow-hidden ring-2 ring-primary/10 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4"
                  : ""
              }
            >
              {selectedPackage?.id === "silver" ? (
                <div className="flex flex-col h-full max-h-[90vh] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  {/* Image header with overlay */}
                  <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=400&fit=crop"
                      alt="Budget-friendly interiors"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                      <Badge className="mb-2 bg-slate-500/20 text-slate-700 dark:text-slate-300 border-0">Budget-Friendly</Badge>
                      <h2 className="text-2xl font-bold tracking-tight">Silver Package</h2>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        Best for new homeowners on a tight budget who want functional interiors without luxury finishes
                      </p>
                    </div>
                  </div>

                  {/* BHK comparison cards */}
                  <div className="px-6 pt-6 pb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Compare by BHK</p>
                    <div className="flex gap-3 overflow-x-auto pb-1 scroll-smooth">
                      {silverBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`flex-shrink-0 px-6 py-4 rounded-2xl text-left min-w-[130px] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/40"
                              : "bg-muted/50 hover:bg-muted/80 border border-border/60 hover:border-primary/30"
                          }`}
                        >
                          <span className="block text-base font-bold">{opt.label}</span>
                          <span className="block text-sm opacity-90 mt-0.5">{opt.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 scroll-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included */}
                      <div
                        key={selectedBhk}
                        className="rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Check className="w-4 h-4" />
                          </span>
                          What&apos;s Included
                        </p>
                        <ul className="space-y-2.5">
                          {silverByBhk[selectedBhk].included.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Not Included */}
                      <div
                        key={`not-${selectedBhk}`}
                        className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/30 p-6 hover:shadow-lg hover:border-border hover:-translate-y-1 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Minus className="w-4 h-4" />
                          </span>
                          Not Included
                        </p>
                        <ul className="space-y-2.5 text-muted-foreground">
                          {silverByBhk[selectedBhk].notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-2xl bg-primary text-white font-semibold text-base py-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      Request Detailed Estimate
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ) : selectedPackage?.id === "gold" ? (
                <div className="flex flex-col h-full max-h-[90vh] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  {/* Image header with overlay */}
                  <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=400&fit=crop"
                      alt="Mid-range interiors"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                      <Badge className="mb-2 bg-primary/20 text-primary border-0">⭐ Most Popular</Badge>
                      <h2 className="text-2xl font-bold tracking-tight">Gold Package</h2>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        Best for balanced quality, good materials, enhanced aesthetics without ultra-luxury
                      </p>
                    </div>
                  </div>

                  {/* BHK comparison cards */}
                  <div className="px-6 pt-6 pb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Compare by BHK</p>
                    <div className="flex gap-3 overflow-x-auto pb-1 scroll-smooth">
                      {goldBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`flex-shrink-0 px-6 py-4 rounded-2xl text-left min-w-[130px] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/40"
                              : "bg-muted/50 hover:bg-muted/80 border border-border/60 hover:border-primary/30"
                          }`}
                        >
                          <span className="block text-base font-bold">{opt.label}</span>
                          <span className="block text-sm opacity-90 mt-0.5">{opt.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 scroll-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included */}
                      <div
                        key={selectedBhk}
                        className="rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Check className="w-4 h-4" />
                          </span>
                          What&apos;s Included
                        </p>
                        <ul className="space-y-2.5">
                          {goldByBhk[selectedBhk].included.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Not Included */}
                      <div
                        key={`not-${selectedBhk}`}
                        className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/30 p-6 hover:shadow-lg hover:border-border hover:-translate-y-1 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Minus className="w-4 h-4" />
                          </span>
                          Not Included
                        </p>
                        <ul className="space-y-2.5 text-muted-foreground">
                          {goldByBhk[selectedBhk].notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-2xl bg-primary text-white font-semibold text-base py-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      Get Personalized Estimate
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ) : selectedPackage?.id === "platinum" ? (
                <div className="flex flex-col h-full max-h-[90vh] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  {/* Image header with overlay */}
                  <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=400&fit=crop"
                      alt="Premium interiors"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                      <Badge className="mb-2 bg-slate-400/20 text-slate-700 dark:text-slate-300 border-0">Luxury Package</Badge>
                      <h2 className="text-2xl font-bold tracking-tight">Platinum Package</h2>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        Best for premium material quality, bespoke furniture, rich finishes & comprehensive design
                      </p>
                    </div>
                  </div>

                  {/* BHK comparison cards */}
                  <div className="px-6 pt-6 pb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Compare by BHK</p>
                    <div className="flex gap-3 overflow-x-auto pb-1 scroll-smooth">
                      {platinumBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`flex-shrink-0 px-6 py-4 rounded-2xl text-left min-w-[130px] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/40"
                              : "bg-muted/50 hover:bg-muted/80 border border-border/60 hover:border-primary/30"
                          }`}
                        >
                          <span className="block text-base font-bold">{opt.label}</span>
                          <span className="block text-sm opacity-90 mt-0.5">{opt.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 scroll-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included */}
                      <div
                        key={selectedBhk}
                        className="rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Check className="w-4 h-4" />
                          </span>
                          What&apos;s Included
                        </p>
                        <ul className="space-y-2.5">
                          {platinumByBhk[selectedBhk].included.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Not Included */}
                      <div
                        key={`not-${selectedBhk}`}
                        className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/30 p-6 hover:shadow-lg hover:border-border hover:-translate-y-1 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Minus className="w-4 h-4" />
                          </span>
                          Not Included
                        </p>
                        <ul className="space-y-2.5 text-muted-foreground">
                          {platinumByBhk[selectedBhk].notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-2xl bg-primary text-white font-semibold text-base py-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      Get Personalized Estimate
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ) : selectedPackage?.id === "luxury" ? (
                <div className="flex flex-col h-full max-h-[90vh] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  {/* Image header with overlay */}
                  <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=400&fit=crop"
                      alt="Ultra-luxury interiors"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                      <Badge className="mb-2 bg-purple-500/20 text-purple-700 dark:text-purple-300 border-0">Ultra-Premium</Badge>
                      <h2 className="text-2xl font-bold tracking-tight">Ultra-Luxury Package</h2>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                        Best for ultra-premium clients seeking bespoke finishes, imported materials, smart automation & curated art
                      </p>
                    </div>
                  </div>

                  {/* BHK comparison cards */}
                  <div className="px-6 pt-6 pb-3">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Compare by BHK</p>
                    <div className="flex gap-3 overflow-x-auto pb-1 scroll-smooth">
                      {luxuryBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`flex-shrink-0 px-6 py-4 rounded-2xl text-left min-w-[130px] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/40"
                              : "bg-muted/50 hover:bg-muted/80 border border-border/60 hover:border-primary/30"
                          }`}
                        >
                          <span className="block text-base font-bold">{opt.label}</span>
                          <span className="block text-sm opacity-90 mt-0.5">{opt.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 scroll-smooth">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included */}
                      <div
                        key={selectedBhk}
                        className="rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Check className="w-4 h-4" />
                          </span>
                          What&apos;s Included
                        </p>
                        <ul className="space-y-2.5">
                          {luxuryByBhk[selectedBhk].included.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Excluded */}
                      <div
                        key={`not-${selectedBhk}`}
                        className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/30 p-6 hover:shadow-lg hover:border-border hover:-translate-y-1 transition-all duration-300"
                      >
                        <p className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Minus className="w-4 h-4" />
                          </span>
                          Excluded
                        </p>
                        <ul className="space-y-2.5 text-muted-foreground">
                          {luxuryByBhk[selectedBhk].notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                              <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-2xl bg-primary text-white font-semibold text-base py-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                      size="lg"
                    >
                      Get Personalized Estimate
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ) : selectedPackage ? (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedPackage.name} Package</DialogTitle>
                    <DialogDescription>
                      {selectedPackage.tagline} — {selectedPackage.priceRange}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Delivery timeline: {selectedPackage.deliveryTime}
                    </p>
                    <ul className="space-y-2">
                      {selectedPackage.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      Proceed to Enquiry
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Types of Interiors */}
      <section id="types" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Types of Interiors We Offer
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive interior design solutions for every space in your
              home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {interiorTypes.map((type) => (
              <Card
                key={type.id}
                className="text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary cursor-pointer group"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl">{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Portfolio
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Existing Interior Designs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our stunning collection of completed projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer border border-border"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Badge className="mb-2">{image.category}</Badge>
                    <h3 className="text-white text-xl font-bold">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Our Advantages
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We deliver excellence in every project with our commitment to
              quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            Your Imagination is Just a Click Away
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Transform your space into something extraordinary. Let&apos;s start
            your interior design journey today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 group"
            onClick={() => scrollToSection("packages")}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
