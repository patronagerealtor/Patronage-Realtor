import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = typeof import.meta?.env?.VITE_SUPABASE_URL === "string"
  ? import.meta.env.VITE_SUPABASE_URL
  : "";
const supabaseAnonKey = typeof import.meta?.env?.VITE_SUPABASE_ANON_KEY === "string"
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : "";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type SupabaseConnectionResult =
  | { connected: true; message: string; count: number }
  | { connected: false; message: string; error?: unknown };

const PROPERTIES_TABLE = "properties";
const PROPERTY_IMAGES_TABLE = "property_images";

/** Verifies Supabase env and that the `properties` table is reachable. */
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
      .from(PROPERTIES_TABLE)
      .select("*", { count: "exact", head: true });
    if (error) {
      return {
        connected: false,
        message: `Supabase error: ${error.message}`,
        error,
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
  id: string;
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
  images?: string[];
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  possession_date?: string | null;
  amenities?: string[] | null;
  price_value?: number | null;
  slug?: string;
};

type PropertyImageRow = { image_url: string; sort_order: number };

type PropertiesTableRow = {
  id?: string;
  title?: string | null;
  location?: string | null;
  developer?: string | null;
  property_type?: string | null;
  price_display?: string | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: string | null;
  construction_status?: string | null;
  created_at?: string | null;
  city?: string | null;
  possession_date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_value?: number | null;
  slug?: string | null;
  description?: string | null;
  amenities?: string[] | null;
  property_images?: PropertyImageRow[] | null;
};

function toPropertyRow(row: PropertiesTableRow | null): PropertyRow | null {
  if (!row || row.id == null) return null;
  const images = row.property_images
    ? row.property_images
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.image_url)
    : [];
  return {
    id: String(row.id),
    title: row.title ?? "",
    location: row.location ?? "",
    developer: row.developer ?? undefined,
    property_type: row.property_type ?? undefined,
    price: row.price_display ?? "Price on request",
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    sqft: row.sqft ?? "",
    status: row.construction_status ?? "",
    image_url: null,
    images,
    description: row.description ?? "",
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    possession_date: row.possession_date ?? null,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    price_value: row.price_value ?? null,
    slug: row.slug ?? undefined,
  };
}

export async function fetchPropertiesFromSupabase(): Promise<PropertyRow[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from(PROPERTIES_TABLE)
      .select(
        `
        *,
        property_images (
          image_url,
          sort_order
        )
      `
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[Supabase] fetch properties error:", error);
      return [];
    }
    const rows = (data ?? []) as PropertiesTableRow[];
    return rows.map((r) => toPropertyRow(r)).filter((r): r is PropertyRow => r != null);
  } catch {
    return [];
  }
}

const STORAGE_BUCKET = "property-images";

/**
 * Uploads files to Supabase Storage under property-images/{propertyId}/{uuid}.{ext},
 * then inserts each into property_images (property_id, image_url, sort_order).
 * Returns an array of public URLs for successfully uploaded files.
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<string[]> {
  if (!supabase || !files.length) return [];
  const urls: string[] = [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = /^[a-z0-9]+$/i.test(ext) ? ext : "jpg";
    const name =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${propertyId}/${name}.${safeExt}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) {
        console.error("[Supabase] upload image error:", uploadError);
        continue;
      }
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      const publicUrl = data.publicUrl;
      urls.push(publicUrl);
      const { error: insertError } = await supabase
        .from(PROPERTY_IMAGES_TABLE)
        .insert({
          property_id: propertyId,
          image_url: publicUrl,
          sort_order: index,
        });
      if (insertError) {
        console.error("[Supabase] insert property_images error:", insertError);
      }
    } catch (e) {
      console.error("[Supabase] upload image exception:", e);
    }
  }
  return urls;
}
