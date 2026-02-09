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
