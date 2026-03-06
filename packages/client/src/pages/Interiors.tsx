{/* Interiors.tsx */}

import React, { useCallback, useState } from "react";
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
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { InteriorPriceCalculator } from "../components/interiors/InteriorPriceCalculator";
import { InteriorsHero } from "../components/interiors/InteriorsHero";
import { SupabaseImage } from "../components/shared/SupabaseImage";
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
  Shield,
  Check,
  X,
  Minus,
} from "lucide-react";

import { env } from "../config/env";
const CONTACT_FORM_URL = env.contactFormUrl || "https://forms.gle/oSqrGhasHGWenKNf8";

/** Resolve public asset URLs for hosted base paths (e.g. GitHub Pages). */
function assetUrl(path: string): string {
  const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base === "/" || base === "") return p;
  return base.replace(/\/$/, "") + p;
}

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
    id: "essence",
    name: "Essence",
    tagline: "Budget Friendly Package",
    highlights: [
      "Basic 3D Design",
      "3D Design Revisable upto 2 times",
      "1 Room Ceiling",
      "Standard Materials",
      "24/7 Support",
      "", // blank for delivery time alignment
    ],
    deliveryTime: "45 - 60 Days",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "signature",
    name: "Signature",
    tagline: "Mid Budget Package",
    highlights: [
      "Advanced 3D Design",
      "3D Design Revisable upto 4 times",
      "Up to 3 Room's Ceiling",
      "Premium Materials",
      "24/7 Support",
      "",
      ],
    
    deliveryTime: "60 - 75 Days",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=400&fit=crop",
    popular: true,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Premium Package",
    highlights: [
      "Premium 3D Design",
      "3D Design Revisable upto 6 times",
      "All Room's Ceiling",
      "Luxury Materials",
      "24/7 Support",
      "", // blank for delivery time alignment
    ],
    deliveryTime: "75 - 90 Days",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=400&fit=crop",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "bespoke",
    name: "Bespoke",
    tagline: "Ultimate luxury experience",
    highlights: [
      "Ultra Premium 3D Design",
      "3D Design Revisable upto 8 times",
      "Unlimited Rooms",
      "Exclusive Materials",
      "Dedicated Manager",
      "24/7 Support",
    ],
    deliveryTime: "According to Project Specs.",
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

type BhkConfig = {
  included: string[];
  notIncluded: string[];
};

type PackageConfig = {
  bhk: Record<Bhk, BhkConfig>;
  postInstallation?: string[];
};
const packageByBhk: Record<string, PackageConfig> = {
  essence: {
    bhk: {
      1: {
        included: [
          "Modular kitchen (Standard laminate finish)",
          "Wardrobe + TV unit + Loft",
          "False ceiling in 1 Room",
          "Painting & basic electrical work",
          "Standard lighting & storage solutions",
        ],
        notIncluded: [
          "Bed + Mattress",
          "Premium hardware/veneer",
          "Imported materials or high-end counters",
          "Smart home/automation",
          "Luxury decor items",
        ],
      },
      2: {
        included: [
          "Modular kitchen (Standard laminate finish)",
          "Wardrobes in bedrooms",
          "TV unit + Loft",
          "False ceiling for 1 Room",
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
          "Modular kitchen (Standard laminate finish)",
          "Wardrobes + loft + living room setup",
          "False ceiling in 1 Room",
          "Painting & basic lighting",
          "Standard Fittings",
        ],
        notIncluded: [
          "Designer finishes/premium hardware",
          "Imported stones/rich textures",
          "Smart home systems",
        ],
      },
    },
    postInstallation: [
      "6 Months Maintenance",
      "6 Months Support",
      "Gift Dinner Set",
    ],
  },
  signature: {
    bhk: {
      1: {
      included: [
        "Everything you get in Essence package",
        "Enhanced kitchen with professional laminates/handles",
        "Premium wardrobes & storage",
        "Designer TV unit + quality lighting",
        "Side, Dressing and Study Tables",
        "Detailed false ceilings for 3 Rooms",
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
        "Everything you get in Essence package",
        "Enhanced kitchen with professional laminates/handles",
        "Premium wardrobes & storage",
        "Designer TV unit + quality lighting",
        "Side, Dressing and Study Tables",
        "Detailed false ceilings for 3 Rooms",
        "Feature walls, textured paint",
      ],
      notIncluded: [
        "High-end smart home tech beyond basic control",
        "Luxury imported materials",
      ],
    },
    3: {
      included: [
        "Enhanced kitchen with professional laminates/handles",
        "Premium wardrobes & storage",
        "Designer TV unit + quality lighting",
        "Side, Dressing and Study Tables",
        "Detailed false ceilings for 3 Rooms",
        "Feature walls, textured paint",
      ],
      notIncluded: [
        "Top-tier imported stone/marble",
        "Fully integrated home automation",
      ],
    },
    },
    postInstallation: [
      "9 Months Maintenance",
      "9 Months Support",
      "Kitchen Appliances (Client Choice: Mixer-Grinder/Water Purifier)",
    ],
  },
  elite: {
    bhk: {
      1: {
      included: [
        "Complete house Interior Design",
        "High-end modular kitchen (quartz/granite options) and Hardware",
        "Premium wardrobes + designer furniture",
        "Feature lighting & designer ceilings",
        "Accent walls with special finishes",
        "Better décor & upholstery",
        "Basic to Advanced Fittings",
      ],
      notIncluded: [
        "Full smart home technology",
        "Imported luxury art / world-class designer pieces",
      ],
    },
    2: {
      included: [
        "Complete house Interior Design",
        "High-end modular kitchen (quartz/granite options) and Hardware",
        "Premium wardrobes + designer furniture",
        "Feature lighting & designer ceilings",
        "Accent walls with special finishes",
        "Better décor & upholstery",
        "Basic to Advanced Fittings",
      ],
      notIncluded: [
        "Top-tier home automation beyond basics",
        "Rare imported materials or art",
      ],
    },
    3: {
      included: [
        "Complete house Interior Design",
        "High-end modular kitchen (quartz/granite options) and Hardware",
        "Premium wardrobes + designer furniture",
        "Feature lighting & designer ceilings",
        "Accent walls with special finishes",
        "Better décor & upholstery",
        "Basic to Advanced Fittings",
      ],
      notIncluded: [
        "Full automation systems",
        "Collector art & imported designer fixtures",
      ],
    },
    },
    postInstallation: [
      "12 Months Maintenance",
      "12 Months Support",
      "Kitchen Appliances (Client Choice: Microwave/Chimney)",
    ],
  },
  bespoke: {
    bhk: {
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
    postInstallation: [
      "18 Months Maintenance",
      "18 Months Support",
      "Surprise Gift",
    ],
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

// Modern Living Room — all images from public/interiors/LivingRoom (used in the popup)
const livingRoomImages: DesignImage[] = [
  { id: "lr-1", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/39c6b823-7503-440e-9946-04f8cafaa8a0.jpg") },
  { id: "lr-2", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/78f91f89-485f-4255-bc3d-70c2fa83b50d.jpg") },
  { id: "lr-3", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/38c2a80a-bc34-4270-9365-7ee46fb9657a.jpg") },
  { id: "lr-4", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/41fbe49a-f9e5-42bb-85ae-e92989d9216d.jpg") },
  { id: "lr-5", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/aa609f0a-1c2a-4624-a2a6-b7581d47a7ce.jpg") },
  { id: "lr-6", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/026bcd4d-91be-4ddf-8b81-76bb42179477.jpg") },
  { id: "lr-7", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/7d4b42a9-358a-4b7f-8092-b43372689008.jpg") },
  { id: "lr-8", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/14e02a96-7d8a-4a0a-b57a-7993ed11b26a.jpg") },
  { id: "lr-9", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/de1d2217-4599-47fa-8283-a6a11a16421d.jpg") },
  { id: "lr-10", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/c0f328df-e403-42c2-8832-f03c642a99d6.jpg") },
  { id: "lr-11", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/18db0288-b60f-4c81-83cd-b81a5db7a37e.jpg") },
  { id: "lr-12", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/97baf277-1a80-49e1-8cae-b0e616659352.jpg") },
  { id: "lr-13", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/c912feb5-5aba-4ffb-bd16-0a4401fed525.jpg") },
  { id: "lr-14", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/312d5644-ed32-4d35-ae61-5352001912eb.jpg") },
  { id: "lr-15", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/75a63945-b794-456e-9cd2-9781dd6961c6.jpg") },
  { id: "lr-16", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/af5ae335-c176-43e6-b2bb-3b1264c623b0.jpg") },
  { id: "lr-17", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/64e0330a-1622-4510-8d59-1930f05b2a5d.jpg") },
  { id: "lr-18", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/6ee4cb01-ffb1-4047-8ca9-7f638bcbe4c5.jpg") },
  { id: "lr-19", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/46db0e2e-3a4c-497d-ba48-76dff403cbda.jpg") },
  { id: "lr-20", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/b04fafff-3d4e-4c55-8352-29be9f3f4fe0.jpg") },
  { id: "lr-21", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/c5819a6d-a0e9-4844-bf39-67856f847f72.jpg") },
  { id: "lr-22", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/d72d7cdf-c80d-4d45-954b-88aa74b5935e.jpg") },
  { id: "lr-23", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/25b872f5-b1e8-46ae-92ca-2838d5dc472d.jpg") },
  { id: "lr-24", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/0570fc51-3b42-4308-b2e0-0154b075434c.jpg") },
  { id: "lr-25", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/ecb14911-77da-454e-badc-d6d1f2cea8dc.jpg") },
  { id: "lr-26", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/6a4b875c-f309-4b1f-aafd-cd1fa7404d06.jpg") },
  { id: "lr-27", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/b3ce8716-ade2-41d9-930e-5ced8c99380c.jpg") },
  { id: "lr-28", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/1f0f1bcc-9c18-47b8-9c80-8df3d46f2e17.jpg") },
  { id: "lr-29", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/fe9f8a0b-c6af-4107-8ec9-c0e20962c3b1.jpg") },
];

const designImages: DesignImage[] = [
  // Modern Living Room (single card in the grid; popup shows all via livingRoomImages)
  { id: "1", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/39c6b823-7503-440e-9946-04f8cafaa8a0.jpg") },
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

// Memoized sections: only re-render when their props change (not on scroll).

const InteriorsPackagesSection = React.memo(function InteriorsPackagesSection(props: {
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
  selectedBhk: Bhk;
  onBhkChange: (bhk: Bhk) => void;
  onCloseDialog: () => void;
}) {
  const { selectedPackage, onSelectPackage, selectedBhk, onBhkChange, onCloseDialog } = props;
  return (
    <section id="packages" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Our Packages</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Luxury Within Reach ~ Starting at JUST ₹3 Lakhs !!!</h2>
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
                  <SupabaseImage
                    src={pkg.image}
                    alt={pkg.name}
                    transformWidth={500}
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
                      <li key={idx} className={`flex items-start gap-2 ${!highlight.trim() ? "list-none" : ""}`}>
                        {highlight.trim() ? (
                          <>
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{highlight}</span>
                          </>
                        ) : (
                          <span className="text-sm invisible select-none" aria-hidden="true">&nbsp;</span>
                        )}
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
                    onClick={() => onSelectPackage(pkg)}
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
            if (!open) onCloseDialog();
          }}
        >
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
            {selectedPackage && packageByBhk[selectedPackage.id] && (
              <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
                <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-lg">
                  <SupabaseImage
                    src={selectedPackage.image}
                    alt={selectedPackage.name}
                    transformWidth={800}
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
                        onClick={() => onBhkChange(opt.bhk)}
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
                        {packageByBhk[selectedPackage.id].bhk[selectedBhk].included.map((item, j) => (
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
                        {packageByBhk[selectedPackage.id].bhk[selectedBhk].notIncluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {packageByBhk[selectedPackage.id].postInstallation &&
                    packageByBhk[selectedPackage.id].postInstallation!.length > 0 && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                        <p className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                            <Shield className="w-4 h-4" />
                          </span>
                          Post-Installation
                        </p>
                        <ul className="space-y-2.5">
                          {packageByBhk[selectedPackage.id].postInstallation!.map((item, k) => (
                            <li key={k} className="flex items-start gap-3 text-sm">
                              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
  );
});

const InteriorsTypesSection = React.memo(function InteriorsTypesSection(props: {
  onInteriorTypeClick: (categoryId: string) => void;
}) {
  const { onInteriorTypeClick } = props;
  return (
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
                onClick={() => onInteriorTypeClick(type.id)}
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
  );
});

const InteriorsGallerySection = React.memo(function InteriorsGallerySection(props: {
  galleryPopupImages: DesignImage[] | null;
  onImageClick: (category: string) => void;
  onCloseGallery: () => void;
}) {
  const { galleryPopupImages, onImageClick, onCloseGallery } = props;
  return (
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
                onClick={() => onImageClick(image.category)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onImageClick(image.category);
                  }
                }}
                className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer border border-border hover:border-primary/50 transition-colors"
              >
                <SupabaseImage
                  src={image.image}
                  alt={image.title}
                  transformWidth={600}
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
                onClick={onCloseGallery}
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
                    onClick={onCloseGallery}
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
                      <SupabaseImage
                        src={img.image}
                        alt={img.title}
                        transformWidth={500}
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
  );
});

const InteriorsWhySection = React.memo(function InteriorsWhySection() {
  return (
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
  );
});

const InteriorsCTASection = React.memo(function InteriorsCTASection(props: {
  onScrollToSection: (sectionId: string) => void;
}) {
  const { onScrollToSection } = props;
  return (
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
            onClick={() => onScrollToSection("packages")}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
  );
});

export default function Interiors() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedBhk, setSelectedBhk] = useState<Bhk>(1);
  const [galleryPopupImages, setGalleryPopupImages] = useState<DesignImage[] | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleInteriorTypeClick = useCallback((categoryId: string) => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    const images =
      categoryId === "living"
        ? livingRoomImages
        : designImages.filter((img) => img.category === categoryId);
    const toShow = images.length > 0 ? images : designImages;
    setTimeout(() => setGalleryPopupImages(toShow), 450);
  }, []);

  const handleImageClick = useCallback((category: string) => {
    const images =
      category === "living"
        ? livingRoomImages
        : designImages.filter((img) => img.category === category);
    setGalleryPopupImages(images.length > 0 ? images : designImages);
  }, []);

  const handleClosePackageDialog = useCallback(() => {
    setSelectedPackage(null);
    setSelectedBhk(1);
  }, []);

  const handleCloseGallery = useCallback(() => setGalleryPopupImages(null), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <InteriorsHero onScrollToSection={scrollToSection} />

      <InteriorsPackagesSection
        selectedPackage={selectedPackage}
        onSelectPackage={setSelectedPackage}
        selectedBhk={selectedBhk}
        onBhkChange={setSelectedBhk}
        onCloseDialog={handleClosePackageDialog}
      />

      <InteriorPriceCalculator />

      <InteriorsTypesSection onInteriorTypeClick={handleInteriorTypeClick} />

      <InteriorsGallerySection
        galleryPopupImages={galleryPopupImages}
        onImageClick={handleImageClick}
        onCloseGallery={handleCloseGallery}
      />

      <InteriorsWhySection />

      <InteriorsCTASection onScrollToSection={scrollToSection} />

      <Footer />
    </div>
  );
}