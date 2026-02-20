export type PropertyDetailData = {
  id: string;
  title: string;
  developer?: string;
  location?: string;
  price?: string;
  beds?: number;
  sqft?: string;
  status?: string;
  propertyType?: string;
  possessionBy?: string;
  description?: string;
  images?: string[];
  amenities?: { id: string; name: string; icon: string }[];
  floorPlans?: {
    bhk: string;
    carpet: string;
    price: string;
    image?: string;
  }[];
  latitude?: number | null;
  longitude?: number | null;
};
