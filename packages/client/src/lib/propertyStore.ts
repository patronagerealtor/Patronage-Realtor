export type PropertyStatus = "For Sale" | "For Rent" | "Sold" | "Coming Soon";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  sqft: string;
  status: PropertyStatus;
  description?: string;
  images?: string[];
  amenities?: string[];
  highlights?: string[];
  developer?: string;
  property_type?: string;
  city?: string;
  possession_date?: string | null;
  bhk_type?: string;
  possession_by?: string;
  latitude?: number | null;
  longitude?: number | null;
  price_value?: number | null;
  slug?: string;
};

const STORAGE_KEY = "patronage:properties:v1";

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Villa",
    location: "Beverly Hills, CA",
    price: "$2,500,000",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    status: "For Sale",
    description:
      "A bright, contemporary villa with open-plan living, expansive glazing, and a private outdoor lounge.",
    amenities: ["Pool", "Garden", "2-Car Garage", "Smart Home"],
  },
  {
    id: "2",
    title: "Downtown Loft",
    location: "New York, NY",
    price: "$1,200,000",
    beds: 2,
    baths: 2,
    sqft: "1,400",
    status: "For Rent",
    description:
      "Industrial-chic loft with high ceilings, exposed brick, and walkable access to the best of downtown.",
    amenities: ["Doorman", "Gym", "Rooftop", "Pet Friendly"],
  },
  {
    id: "3",
    title: "Seaside Condo",
    location: "Miami, FL",
    price: "$850,000",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    status: "For Sale",
    description:
      "Ocean-view condo featuring a breezy balcony, modern finishes, and resort-style building amenities.",
    amenities: ["Ocean View", "Pool", "Concierge", "Parking"],
  },
  {
    id: "4",
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: "$3,100,000",
    beds: 5,
    baths: 4,
    sqft: "4,500",
    status: "For Sale",
    description:
      "A serene mountain home with cozy interiors, panoramic views, and quick access to trails and slopes.",
    amenities: ["Fireplace", "Hot Tub", "Ski Room", "Deck"],
  },
  {
    id: "5",
    title: "Lakeside Cottage",
    location: "Lake Tahoe, CA",
    price: "$950,000",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    status: "For Sale",
    description:
      "Charming lakeside cottage with natural light, warm wood accents, and peaceful waterfront vibes.",
    amenities: ["Lake Access", "Dock", "Patio", "Outdoor Grill"],
  },
  {
    id: "6",
    title: "City Penthouse",
    location: "Chicago, IL",
    price: "$1,800,000",
    beds: 3,
    baths: 3,
    sqft: "2,800",
    status: "For Rent",
    description:
      "Top-floor penthouse with skyline views, spacious entertaining areas, and premium finishes throughout.",
    amenities: ["Terrace", "Skyline View", "Elevator", "Security"],
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadProperties(): Property[] {
  if (!canUseStorage()) return DEFAULT_PROPERTIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROPERTIES;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_PROPERTIES;
    return parsed as Property[];
  } catch {
    return DEFAULT_PROPERTIES;
  }
}

export function saveProperties(properties: Property[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  window.dispatchEvent(new Event("patronage:properties:changed"));
}

export function resetPropertiesToDefaults() {
  saveProperties(DEFAULT_PROPERTIES);
}

export function createPropertyId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `prop_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

