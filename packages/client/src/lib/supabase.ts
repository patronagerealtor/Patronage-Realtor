import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type SupabaseConnectionResult =
  | { connected: true; message: string; count: number }
  | { connected: false; message: string; error?: unknown };

/** Call this to verify Supabase env and that the `properties` table is reachable. */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      connected: false,
      message: "Missing env: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env",
    };
  }
  if (!supabase) {
    return { connected: false, message: "Supabase client not initialized." };
  }
  try {
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });
    if (error) {
      return {
        connected: false,
        message: `Supabase error: ${error.message}`,
        error: error,
      };
    }
    return {
      connected: true,
      message: "Connected. Properties table is reachable.",
      count: count ?? 0,
    };
  } catch (e) {
    return {
      connected: false,
      message: e instanceof Error ? e.message : "Connection check failed",
      error: e,
    };
  }
}

export type PropertyRow = {
  id: number | string;
  title: string;
  location: string;
  developer?: string;
  property_type?: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  status: string;
  image_url?: string | null;
  /** All property images (cover first when from Supabase). Used in detail view. */
  images?: string[];
};

type BhkEnum = "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5 BHK";
type ConstructionStatusEnum = "Under Construction" | "Ready to Move";

type SupabaseProperty = {
  id: string;
  title: string;
  developer: string;
  bhk_type: BhkEnum;
  carpet_area: number;
  property_type: string;
  construction_status: ConstructionStatusEnum;
  possession_by: string | null;
  created_at: string;
  property_images?: { image_url: string; is_cover: boolean }[];
};

function bhkToBeds(bhk: BhkEnum): number {
  const n = parseInt(bhk.replace(/\D/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

export async function fetchPropertiesFromSupabase(): Promise<PropertyRow[]> {
  if (!supabase) {
    return [];
  }
  let data: SupabaseProperty[] | null = null;
  const { data: withImages, error: err1 } = await supabase
    .from("properties")
    .select(
      "id, title, developer, bhk_type, carpet_area, property_type, construction_status, possession_by, created_at, property_images(image_url, is_cover)"
    )
    .order("created_at", { ascending: false });
  if (!err1 && withImages) {
    data = withImages as SupabaseProperty[];
  } else {
    const { data: noImages, error: err2 } = await supabase
      .from("properties")
      .select("id, title, developer, bhk_type, carpet_area, property_type, construction_status, possession_by, created_at")
      .order("created_at", { ascending: false });
    if (err2) {
      console.error("[Supabase] fetch properties error:", err2);
      return [];
    }
    data = (noImages ?? []).map((r) => ({ ...r, property_images: [] })) as SupabaseProperty[];
  }
  const rows = data ?? [];
  return rows.map((row) => {
    const imgs = row.property_images ?? [];
    const cover = imgs.find((i) => i.is_cover);
    const imageUrl = cover?.image_url ?? imgs[0]?.image_url ?? null;
    const allUrls =
      imgs.length > 0 ? imgs.map((i) => i.image_url) : imageUrl ? [imageUrl] : undefined;
    return {
      id: row.id,
      title: row.title,
      location: "",
      developer: row.developer,
      property_type: row.property_type,
      price: "Price on request",
      beds: bhkToBeds(row.bhk_type),
      baths: bhkToBeds(row.bhk_type),
      sqft: row.carpet_area.toLocaleString("en-IN"),
      status: row.construction_status,
      image_url: imageUrl,
      images: allUrls?.length ? allUrls : undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// DataEntry: property_listings table (CRUD for add, edit, delete)
// Run the SQL in docs/supabase-property-listings.sql to create the table.
// ---------------------------------------------------------------------------

export type PropertyListingRow = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  status: string;
  description: string | null;
  images: string[];
  amenities: string[];
  highlights: string[];
};

const PROPERTY_LISTINGS_TABLE = "property_listings";

export async function fetchPropertyListings(): Promise<PropertyListingRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(PROPERTY_LISTINGS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[Supabase] fetch property_listings error:", error);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: String(row.id),
    title: row.title ?? "",
    location: row.location ?? "",
    price: row.price ?? "",
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    sqft: String(row.sqft ?? ""),
    status: row.status ?? "For Sale",
    description: row.description ?? null,
    images: Array.isArray(row.images) ? row.images : [],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  }));
}

export async function insertPropertyListing(
  row: Omit<PropertyListingRow, "id">,
  id?: string
): Promise<string | null> {
  if (!supabase) return null;
  const newId =
    id ??
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `prop_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const { data, error } = await supabase
    .from(PROPERTY_LISTINGS_TABLE)
    .insert({
      id: newId,
      title: row.title,
      location: row.location,
      price: row.price,
      beds: row.beds,
      baths: row.baths,
      sqft: row.sqft,
      status: row.status,
      description: row.description || null,
      images: row.images ?? [],
      amenities: row.amenities ?? [],
      highlights: row.highlights ?? [],
    })
    .select("id")
    .single();
  if (error) {
    console.error("[Supabase] insert property_listings error:", error);
    return null;
  }
  return data?.id ? String(data.id) : newId;
}

export async function updatePropertyListing(
  id: string,
  row: Partial<Omit<PropertyListingRow, "id">>
): Promise<boolean> {
  if (!supabase) return false;
  const payload: Record<string, unknown> = {};
  if (row.title !== undefined) payload.title = row.title;
  if (row.location !== undefined) payload.location = row.location;
  if (row.price !== undefined) payload.price = row.price;
  if (row.beds !== undefined) payload.beds = row.beds;
  if (row.baths !== undefined) payload.baths = row.baths;
  if (row.sqft !== undefined) payload.sqft = row.sqft;
  if (row.status !== undefined) payload.status = row.status;
  if (row.description !== undefined) payload.description = row.description ?? null;
  if (row.images !== undefined) payload.images = row.images;
  if (row.amenities !== undefined) payload.amenities = row.amenities;
  if (row.highlights !== undefined) payload.highlights = row.highlights;
  const { error } = await supabase
    .from(PROPERTY_LISTINGS_TABLE)
    .update(payload)
    .eq("id", id);
  if (error) {
    console.error("[Supabase] update property_listings error:", error);
    return false;
  }
  return true;
}

export async function deletePropertyListing(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from(PROPERTY_LISTINGS_TABLE)
    .delete()
    .eq("id", id);
  if (error) {
    console.error("[Supabase] delete property_listings error:", error);
    return false;
  }
  return true;
}
