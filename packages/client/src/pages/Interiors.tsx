import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Sparkles,
  ArrowRight,
  Bed,
  Utensils,
  Bath,
  Sofa,
  Lamp,
  Award,
  Clock,
  Users,
  ChevronDown,
  Shield,
  Check,
  X,
  Minus,
} from "lucide-react";

const CONTACT_FORM_URL =
  import.meta.env.VITE_CONTACT_FORM_URL ?? "https://forms.gle/oSqrGhasHGWenKNf8";

interface Package {
  id: string;
  name: string;
  tagline: string;
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

const bhkOptions = [
  { bhk: 1, label: "1BHK" },
  { bhk: 2, label: "2BHK" },
  { bhk: 3, label: "3BHK" },
] as const;

type Bhk = 1 | 2 | 3;
const packageByBhk: Record<string, Record<Bhk, { included: string[]; notIncluded: string[] }>> = {
  silver: {
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
  },
  gold: {
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
  },
  platinum: {
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
  },
  luxury: {
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
  },
};

const interiorTypes: InteriorType[] = [
  {
    id: "living",
    name: "Living Room",
    icon: <Sofa className="w-8 h-8" />,
    description: "Elegant living room designs",
  },
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
    category: "living",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Luxury Bedroom",
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Contemporary Kitchen",
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Elegant Bathroom",
    category: "bathroom",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Minimalist Office",
    category: "office",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Cozy Dining",
    category: "dining",
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

const HERO_SCROLL_MAX = 700;
const SCROLL_THROTTLE_STEP = 16; // ~60fps

export default function Interiors() {
  const [scrollY, setScrollY] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBhk, setSelectedBhk] = useState<Bhk>(1);
  const [galleryPopupImages, setGalleryPopupImages] = useState<DesignImage[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = Math.min(HERO_SCROLL_MAX, window.scrollY);
        const rounded = Math.floor(y / SCROLL_THROTTLE_STEP) * SCROLL_THROTTLE_STEP;
        if (rounded !== lastScrollRef.current) {
          lastScrollRef.current = rounded;
          setScrollY(rounded);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleInteriorTypeClick = useCallback((categoryId: string) => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    const images = designImages.filter((img) => img.category === categoryId);
    const toShow = images.length > 0 ? images : designImages;
    setTimeout(() => setGalleryPopupImages(toShow), 450);
  }, []);

  const handleImageClick = useCallback((category: string) => {
    const images = designImages.filter((img) => img.category === category);
    setGalleryPopupImages(images.length > 0 ? images : designImages);
  }, []);

  const heroStyle = useMemo(
    () => ({
      transform: `translateY(${scrollY * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollY / 500),
      willChange: scrollY < 500 ? "transform, opacity" : "auto",
    }),
    [scrollY]
  );

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
          style={heroStyle}
        >
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
            <Badge className="mb-4" variant="outline">Our Packages</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Choose Your Package</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Select the package that fits your needs</p>
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
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className={`h-2 bg-gradient-to-r ${pkg.color}`} />
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.tagline}</CardDescription>
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
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
            {selectedPackage && packageByBhk[selectedPackage.id] && (
              <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
                <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-lg">
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-bold tracking-tight">{selectedPackage.name} Package</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPackage.tagline}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Delivery: {selectedPackage.deliveryTime}
                    </p>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-3">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Compare by BHK</p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {bhkOptions.map((opt) => (
                      <button
                        key={opt.bhk}
                        type="button"
                        onClick={() => setSelectedBhk(opt.bhk)}
                        className={`flex-shrink-0 px-6 py-4 rounded-2xl text-left min-w-[130px] transition-all ${
                          selectedBhk === opt.bhk
                            ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/40"
                            : "bg-muted/50 hover:bg-muted border border-border"
                        }`}
                      >
                        <span className="block text-base font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6">
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                          <Check className="w-4 h-4" />
                        </span>
                        What&apos;s Included
                      </p>
                      <ul className="space-y-2.5">
                        {packageByBhk[selectedPackage.id][selectedBhk].included.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/30 p-6">
                      <p className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Minus className="w-4 h-4" />
                        </span>
                        Not Included
                      </p>
                      <ul className="space-y-2.5 text-muted-foreground">
                        {packageByBhk[selectedPackage.id][selectedBhk].notIncluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full rounded-2xl py-6 text-base font-semibold" size="lg" asChild>
                    <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer">
                      Request Detailed Estimate
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
                className="text-center transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group border-2 hover:border-primary/50"
                onClick={() => handleInteriorTypeClick(type.id)}
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

      {/* Gallery Section — popup opens from this container */}
      <section id="gallery" className="relative py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Portfolio
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Existing Interior Designs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our stunning collection — click a type above or an image below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designImages.map((image) => (
              <div
                key={image.id}
                role="button"
                tabIndex={0}
                onClick={() => handleImageClick(image.category)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageClick(image.category);
                  }
                }}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer border border-border hover:border-primary/50 transition-colors"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Badge className="mb-2">{image.category}</Badge>
                    <h3 className="text-white text-xl font-bold">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* White full-screen popup after scroll */}
          {galleryPopupImages !== null && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30"
                aria-hidden
                onClick={() => setGalleryPopupImages(null)}
              />
              <div
                className="fixed inset-4 z-50 rounded-2xl bg-white shadow-2xl flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-300 md:inset-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="gallery-popup-title"
              >
                <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-200 flex-shrink-0">
                  <h3 id="gallery-popup-title" className="text-xl font-semibold text-gray-900">
                    Gallery
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGalleryPopupImages(null)}
                    aria-label="Close gallery"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryPopupImages.map((img) => (
                      <div
                      key={img.id}
                        className="overflow-hidden rounded-lg border border-gray-200 aspect-[4/3] bg-gray-100"
                    >
                      <img
                        src={img.image}
                        alt={img.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                      />
                        <p className="p-2 text-sm font-medium text-gray-900 truncate">{img.title}</p>
                      </div>
                  ))}
                  </div>
                </div>
              </div>
            </>
          )}
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