import type { PropertyDetailData } from "@/types/propertyDetail";
import type { PropertyRow } from "@/lib/supabase";
import type { Property } from "@/lib/propertyStore";

const DEFAULT_POSSESSION = "Dec 2026";

function isPropertyRow(
  p: PropertyRow | Property
): p is PropertyRow {
  return "property_type" in p || "developer" in p || "image_url" in p;
}

export function toPropertyDetailData(
  property: PropertyRow | Property | null
): PropertyDetailData {
  if (!property) {
    return {
      id: "",
      title: "Sunrise Residency",
      developer: "ABC Developers",
      location: "Hinjewadi, Pune",
      price: "Price on request",
      price_value: null,
      beds: 2,
      sqft: "850",
      status: "Under Construction",
      propertyType: "Apartment",
      possessionBy: DEFAULT_POSSESSION,
      images: [],
    };
  }

  const images =
    "images" in property && property.images?.length
      ? property.images
      : "image_url" in property && property.image_url
        ? [property.image_url]
        : [];

  const possessionByFromDate =
    "possession_date" in property && property.possession_date
      ? property.possession_date
      : "possession_date" in property
        ? undefined
        : DEFAULT_POSSESSION;
  const possessionBy =
    "possession_by" in property && (property as { possession_by?: string }).possession_by
      ? (property as { possession_by: string }).possession_by
      : possessionByFromDate ?? DEFAULT_POSSESSION;

  return {
    id: String(property.id),
    title: property.title,
    developer: "developer" in property ? property.developer ?? "Developer" : undefined,
    location: property.location || "Location",
    address: "address" in property ? property.address ?? undefined : undefined,
    price: property.price,
    price_value: "price_value" in property ? property.price_value : undefined,
    beds: property.beds,
    sqft: property.sqft,
    status: property.status,
    propertyType: isPropertyRow(property)
      ? property.property_type ?? "Apartment"
      : "Apartment",
    bhkType: "bhk_type" in property ? (property as { bhk_type?: string }).bhk_type ?? undefined : undefined,
    possessionBy: possessionBy ?? DEFAULT_POSSESSION,
    description: "description" in property ? property.description : undefined,
    images,
    amenities:
      "amenities" in property && Array.isArray(property.amenities)
        ? property.amenities.filter(
            (a): a is { id: string; name: string; icon: string } =>
              a != null && typeof a === "object" && "id" in a && "name" in a && "icon" in a
          )
        : undefined,
    floorPlans: undefined,
    latitude: "latitude" in property ? property.latitude : undefined,
    longitude: "longitude" in property ? property.longitude : undefined,
    google_map_link: "google_map_link" in property ? property.google_map_link : undefined,
    reraApplicable: "rera_applicable" in property ? property.rera_applicable ?? false : undefined,
    reraNumber: "rera_number" in property ? property.rera_number ?? undefined : undefined,
  };
}
