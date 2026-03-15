{/* Interiors.tsx */}

import React, { useCallback, useEffect, useState } from "react";
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
  Share2,
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
      "6 Months Maintenance",
      "6 Months Support",
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
      "6 Months Maintenance",
      "6 Months Support",
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
    id: "storage",
    name: "Storage Under Staircase",
    icon: <Lamp className="w-8 h-8" />,
    description: "Smart storage under staircase",
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

// Luxury Bedroom — all images from public/interiors/Bedroom (used in the popup)
const bedroomImages: DesignImage[] = [
  { id: "br-1", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/803e6d1e-41ba-4a9b-a890-1d7a2802a699.jpg") },
  { id: "br-2", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/26de277a-2d98-4f09-8529-7cef43773064.jpg") },
  { id: "br-3", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/57786595-1dfa-4a21-851e-e92a8772fb3c.jpg") },
  { id: "br-4", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/650922c4-07bc-4192-b3fe-76fbb353bdda.jpg") },
  { id: "br-5", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/6df5287f-a30c-4cc2-bf90-f3ea95980ada.jpg") },
  { id: "br-6", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/ade20db6-b4a1-4384-aade-355ec0072413.jpg") },
  { id: "br-7", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/d25cca5f-e963-4748-9e13-00b10523a1d2.jpg") },
  { id: "br-8", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/40f79fd6-e16f-4e79-9aa0-efe4300706b6.jpg") },
  { id: "br-9", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/f8648fc1-da9d-4efb-918d-a69c6f4456a1.jpg") },
  { id: "br-10", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/d2305fa2-71ab-4d5a-b253-46e6065cba97.jpg") },
  { id: "br-11", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/62b00f34-cde8-436a-ad31-9f8821d78d4a.jpg") },
  { id: "br-12", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/1cfaa05a-5c66-4ca8-a92f-a9ea86e010df.jpg") },
  { id: "br-13", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/09695180-f271-48c2-9b5d-166f1d9afda6.jpg") },
  { id: "br-14", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/aa26645e-e2c8-4b0f-9872-bcbfcb757f4d.jpg") },
  { id: "br-15", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/1922ec6c-7e1b-4c18-b05f-0595282fe2f4.jpg") },
  { id: "br-16", title: "Luxury Bedroom", category: "bedroom", image: assetUrl("/interiors/Bedroom/6a35c729-5198-4f20-8a83-14e2ca25ec8a.jpg") },
];

// Contemporary Kitchen — all images from public/interiors/Kitchen_images (used in the popup)
const kitchenImages: DesignImage[] = [
  { id: "kt-1", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/7e212246-8ddd-4323-944a-1adf3921df7f.jpg") },
  { id: "kt-2", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/82e2f44c-52cc-44d8-8f2d-8e11670d9ee8.jpg") },
  { id: "kt-3", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/c7aeeeac-e300-413e-8ac3-efb0125c47af.jpg") },
  { id: "kt-4", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/eb6ec706-bb78-477c-b34b-f7c10f3a2363.jpg") },
  { id: "kt-5", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/088f6d0d-16f7-4de2-b3f5-77457d7de41d.jpg") },
  { id: "kt-6", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/286b53cc-ef76-4baf-9298-8e3f39b00950.jpg") },
  { id: "kt-7", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/c7aeeeac-e300-413e-8ac3-efb0125c47af(1).jpg") },
  { id: "kt-8", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/0e437133-eeea-4034-9e37-a67ae5d123e6.jpg") },
  { id: "kt-9", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/672a47a6-bc5b-4736-9aba-560c53f72f44.jpg") },
  { id: "kt-10", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/0e8af338-e6e4-406c-8311-d44f0fd0b476.jpg") },
  { id: "kt-11", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/0ddf1a33-266e-4014-bec0-3eed9d36db9c.jpg") },
  { id: "kt-12", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/41875487-979d-4902-8695-5d80f3361c6b.jpg") },
  { id: "kt-13", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/03f6f126-def5-4a95-83e6-141395397502.jpg") },
  { id: "kt-14", title: "Contemporary Kitchen", category: "kitchen", image: assetUrl("/interiors/Kitchen_images/6567abea-68dc-4d58-a937-fbe6d7e99e14.jpg") },
];

// Elegant Bathroom — all images from public/interiors/Bathroom (used in the popup)
const bathroomImages: DesignImage[] = [
  { id: "ba-1", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/7f4475ba-f3af-423a-b292-5c156dcb9440.jpg") },
  { id: "ba-2", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/e7411768-0e0c-44ef-9802-12ad83e477d1.jpg") },
  { id: "ba-3", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/354d3976-b0d9-47c0-89a5-35528cfe859e.jpg") },
  { id: "ba-4", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/f2b66058-db29-454c-8a33-06638baee7ea.jpg") },
  { id: "ba-5", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/f57c9cbd-2be7-4a89-8172-f1cf0b46454b.jpg") },
  { id: "ba-6", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/1002ba07-ae2a-44b0-a5be-42567b51840e.jpg") },
  { id: "ba-7", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/2c7c4f40-8c63-49d3-8cdb-c91112ff0568.jpg") },
  { id: "ba-8", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/3f01754f-faec-4c97-9e20-de721671850e.jpg") },
  { id: "ba-9", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/44e0999b-ac62-4fe9-8bfd-c2584bf150a0.jpg") },
  { id: "ba-10", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/064523d4-c3ff-43f3-ac9f-da699c3c7434.jpg") },
  { id: "ba-11", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/2c1ce441-b367-4148-8963-8e4393c9b3ec.jpg") },
  { id: "ba-12", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/307ecd2a-05df-4f28-9007-423255cb16f6.jpg") },
  { id: "ba-13", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/77c1e090-eebe-4a07-9e8a-885b66fc580f.jpg") },
  { id: "ba-14", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/bf381c2b-4d7c-4dca-895e-d4c4541b0b73.jpg") },
  { id: "ba-15", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/ec39d9e4-cc44-4b49-a614-3c1cf7d86b64.jpg") },
  { id: "ba-16", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/06710a85-19f8-4e66-91e8-fd2be177a413.jpg") },
  { id: "ba-17", title: "Elegant Bathroom", category: "bathroom", image: assetUrl("/interiors/Bathroom/7765ca6a-f133-4df0-b43b-ccef67189cff.jpg") },
];

// Storage Under Staircase — all images from public/interiors/Storage_Under_Staircase (used in the popup)
const storageImages: DesignImage[] = [
  { id: "st-14", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/884bfbea-e9af-4a41-885c-de839595427c.jpg") },
  { id: "st-1", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/81292848-5365-48e8-af0e-43de71f8458d.jpg") },
  { id: "st-2", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/9509ccbf-46a9-47f4-a57b-86c68da3695c.jpg") },
  { id: "st-3", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/2b6d66f4-24b1-4e00-9ed7-916f49cafef2.jpg") },
  { id: "st-4", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/7df53900-7c47-4d88-8676-34bb3603b4e6.jpg") },
  { id: "st-5", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/c5086727-ad7a-4e5b-8cf2-7fb2e3810ceb.jpg") },
  { id: "st-6", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/cf06f146-11aa-4828-808c-588636e469f3.jpg") },
  { id: "st-7", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/e803b733-6345-43db-ac68-a739e5e7792a.jpg") },
  { id: "st-8", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/fa162bfa-acd4-4af5-9655-96336b2c7357.jpg") },
  { id: "st-9", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/275d8401-915f-47e8-82af-f3af64bda0df.jpg") },
  { id: "st-10", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/69555065-d421-4d01-82f2-37030b845bc0.jpg") },
  { id: "st-11", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/b7b3bf15-5d2e-45e1-bfe7-bc0d399eb113.jpg") },
  { id: "st-12", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/1d2987c9-f262-482d-b433-85ff6326330f.jpg") },
  { id: "st-13", title: "Storage Under Staircase", category: "storage", image: assetUrl("/interiors/Storage_Under_Staircase/494291ca-fbe1-49a9-9317-56b3bbe31516.jpg") },
];

const designImages: DesignImage[] = [
  // Modern Living Room (single card in the grid; popup shows all via livingRoomImages)
  { id: "1", title: "Modern Living Room", category: "living", image: assetUrl("/interiors/LivingRoom/39c6b823-7503-440e-9946-04f8cafaa8a0.jpg") },
  {
    id: "2",
    title: "Luxury Bedroom",
    category: "bedroom",
    image: assetUrl("/interiors/Bedroom/803e6d1e-41ba-4a9b-a890-1d7a2802a699.jpg"),
  },
  {
    id: "3",
    title: "Contemporary Kitchen",
    category: "kitchen",
    image: assetUrl("/interiors/Kitchen_images/c7aeeeac-e300-413e-8ac3-efb0125c47af.jpg"),
  },
  {
    id: "4",
    title: "Elegant Bathroom",
    category: "bathroom",
    image: assetUrl("/interiors/Bathroom/7f4475ba-f3af-423a-b292-5c156dcb9440.jpg"),
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
    title: "Storage Under Staircase",
    category: "storage",
    image: assetUrl("/interiors/Storage_Under_Staircase/884bfbea-e9af-4a41-885c-de839595427c.jpg"),
  },
];

const galleryBadgeLabel = (category: string) =>
  category === "storage" ? "Storage Under Staircase" : category;


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
  onShareGallery: () => void;
}) {
  const { galleryPopupImages, onImageClick, onCloseGallery, onShareGallery } = props;

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

                  <Badge className="mb-2">
                    {galleryBadgeLabel(image.category)}
                  </Badge>

                  <h3 className="text-white text-xl font-bold">
                    {image.title}
                  </h3>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Popup */}
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
            >

              {/* HEADER */}
              <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-200 flex-shrink-0">

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-black" />
                  <span>
                    Love this design? Share it with someone planning their dream home
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  <Button
                    onClick={onShareGallery}
                    className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 px-4"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>

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
              </div>

              {/* IMAGES */}
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

                      <p className="p-2 text-sm font-medium text-gray-900 truncate">
                        {img.title}
                      </p>

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
  const [galleryCategory, setGalleryCategory] = useState<string | null>(null);

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
        : categoryId === "bedroom"
          ? bedroomImages
          : categoryId === "kitchen"
            ? kitchenImages
            : categoryId === "bathroom"
              ? bathroomImages
              : categoryId === "storage"
                ? storageImages
        : designImages.filter((img) => img.category === categoryId);
    const toShow = images.length > 0 ? images : designImages;
    setTimeout(() => setGalleryPopupImages(toShow), 450);
    setGalleryCategory(categoryId);
  }, []);

  const handleImageClick = useCallback((category: string) => {
    const images =
      category === "living"
        ? livingRoomImages
        : category === "bedroom"
          ? bedroomImages
          : category === "kitchen"
            ? kitchenImages
            : category === "bathroom"
              ? bathroomImages
              : category === "storage"
                ? storageImages
        : designImages.filter((img) => img.category === category);
    setGalleryPopupImages(images.length > 0 ? images : designImages);
    setGalleryCategory(category);
  }, []);

  const handleShareGallery = useCallback(() => {
    // Get the current category from state or infer from the popup
    const categoryToShare = galleryCategory || (galleryPopupImages?.[0]?.category);
    
    if (!categoryToShare) return;

    const url = `${window.location.origin}/interiors?gallery=${encodeURIComponent(categoryToShare)}`;

    if (navigator.share) {
      navigator.share({
        title: "Interior Design Inspiration",
        text: "Check out these interior designs!",
        url: url,
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(url);
        alert("Gallery link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Gallery link copied to clipboard!");
    }
  }, [galleryCategory, galleryPopupImages]);

  const handleClosePackageDialog = useCallback(() => {
    setSelectedPackage(null);
    setSelectedBhk(1);
  }, []);

  const handleCloseGallery = useCallback(() => setGalleryPopupImages(null), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gallery = params.get("gallery");

    if (!gallery) return;

    // Directly open the gallery popup without click trigger
    handleImageClick(gallery);
    
    // Scroll to gallery section
    setTimeout(() => {
      const element = document.getElementById("gallery");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [handleImageClick]);

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
        onShareGallery={handleShareGallery}
      />

      <InteriorsWhySection />

      <InteriorsCTASection onScrollToSection={scrollToSection} />

      <Footer />
    </div>
  );
}