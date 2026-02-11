import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

const silverIncluded = [
  {
    title: "Kitchen",
    items: ["Basic modular kitchen (laminate finish)", "Standard countertop"],
  },
  {
    title: "Bedrooms",
    items: ["Wardrobes", "Bed structure", "Essential storage"],
  },
  {
    title: "Living Area",
    items: ["TV unit", "Simple furniture setup"],
  },
  {
    title: "Ceiling & Lighting",
    items: ["Partial false ceiling", "Basic lighting plan"],
  },
  {
    title: "Other",
    items: ["Painting", "Electrical setup", "Utility setup (for 3BHK)"],
  },
];

const silverNotIncluded = [
  "Premium veneer / luxury finishes",
  "Imported stones",
  "Smart home automation",
  "Designer décor items",
  "Branded appliances",
];

const goldBhkOptions = [
  { bhk: 1, label: "1BHK", range: "₹7 – 9 Lakhs" },
  { bhk: 2, label: "2BHK", range: "₹9 – 12 Lakhs" },
  { bhk: 3, label: "3BHK", range: "₹12 – 15 Lakhs" },
] as const;

const goldIncluded = [
  {
    title: "Kitchen",
    items: [
      "Premium modular kitchen",
      "Granite / Quartz countertop",
      "Tall unit",
      "Soft-close fittings",
    ],
  },
  {
    title: "Bedrooms",
    items: [
      "Full-height wardrobes",
      "Bed with storage",
      "Side tables",
      "Study unit (if space allows)",
    ],
  },
  {
    title: "Living Room",
    items: [
      "Designer TV unit",
      "False ceiling (major areas)",
      "Sofa layout planning",
    ],
  },
  {
    title: "Bathrooms",
    items: ["Vanity unit", "Mirror design"],
  },
  {
    title: "Lighting & Ceiling",
    items: [
      "Complete false ceiling",
      "Ambient + focus lighting plan",
    ],
  },
  {
    title: "Utility",
    items: ["Electrical setup", "Painting", "Civil adjustments (minor)"],
  },
];

const goldNotIncluded = [
  "Imported marble / Italian finishes",
  "Smart home automation",
  "Designer art pieces",
  "Premium veneer finishes",
  "Luxury loose furniture",
];

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
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
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
                selectedPackage?.id === "silver"
                  ? "max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-border/40 p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4"
                  : selectedPackage?.id === "gold"
                    ? "max-w-2xl bg-background backdrop-blur-lg rounded-3xl shadow-2xl border border-primary/20 p-0 overflow-hidden ring-2 ring-primary/10 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4"
                    : ""
              }
            >
              {selectedPackage?.id === "silver" ? (
                <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Silver</h2>
                    <p className="text-muted-foreground mt-1">
                      Smart & Practical Interiors for Modern Homes
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3">Select BHK</p>
                    <div className="flex gap-2 flex-wrap">
                      {silverBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted/50 hover:bg-muted"
                          }`}
                        >
                          {opt.label} → {opt.range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-3">What&apos;s Included</p>
                    <div className="space-y-3">
                      {silverIncluded.map((section, i) => (
                        <div
                          key={section.title}
                          className="bg-secondary/20 rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
                          style={{ animationDelay: `${i * 75}ms`, animationFillMode: "both" }}
                        >
                          <p className="font-medium text-sm mb-2">{section.title}</p>
                          <ul className="space-y-1">
                            {section.items.map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-xl p-4 text-muted-foreground">
                    <p className="font-medium text-sm mb-2 text-foreground/80">
                      Not Included
                    </p>
                    <ul className="space-y-1 text-sm">
                      {silverNotIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full rounded-full bg-primary hover:opacity-90 hover:scale-105 hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    Request Detailed Estimate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : selectedPackage?.id === "gold" ? (
                <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Gold</h2>
                    <p className="text-muted-foreground mt-1">
                      Ideal for complete mid-range home interiors
                    </p>
                    <Badge className="mt-3 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                      ⭐ Most Popular
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3">Select BHK</p>
                    <div className="flex gap-2 flex-wrap">
                      {goldBhkOptions.map((opt) => (
                        <button
                          key={opt.bhk}
                          type="button"
                          onClick={() => setSelectedBhk(opt.bhk)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                            selectedBhk === opt.bhk
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted/50 hover:bg-muted border border-primary/20"
                          }`}
                        >
                          {opt.label} → {opt.range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-3">What&apos;s Included</p>
                    <div className="space-y-3">
                      {goldIncluded.map((section, i) => (
                        <div
                          key={section.title}
                          className="bg-secondary/10 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
                          style={{ animationDelay: `${i * 75}ms`, animationFillMode: "both" }}
                        >
                          <p className="font-medium text-sm mb-2">{section.title}</p>
                          <ul className="space-y-1">
                            {section.items.map((item, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-xl p-4 text-muted-foreground">
                    <p className="font-medium text-sm mb-2 text-foreground/80">
                      Not Included
                    </p>
                    <ul className="space-y-1 text-sm">
                      {goldNotIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full rounded-full bg-primary text-white font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                    size="lg"
                  >
                    Get Personalized Estimate
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
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
