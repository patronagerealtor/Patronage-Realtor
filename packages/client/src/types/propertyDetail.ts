export type PropertyDetailData = {
  id: string;
  title: string;
  developer?: string;
  location?: string;
  address?: string;
  price?: string;
  price_value?: number | null;
  beds?: number;
  sqft?: string;
  status?: string;
  propertyType?: string;
  bhkType?: string;
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
  google_map_link?: string | null;
  reraApplicable?: boolean;
  reraNumber?: string | null;
}
