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

// ---------------------------------------------------------------------------
// Webinar registrations — run in Supabase SQL editor:
// create table webinar_registrations (
//   id uuid primary key default gen_random_uuid(),
//   name text not null,
//   email text not null,
//   contact_number text not null,
//   created_at timestamptz default now()
// );
// alter table webinar_registrations enable row level security;
// create policy "Allow anonymous insert" on webinar_registrations for insert with (true);
// create policy "Allow read for authenticated" on webinar_registrations for select using (auth.role() = 'authenticated' or auth.role() = 'service_role');
// ---------------------------------------------------------------------------

const WEBINAR_REGISTRATIONS_TABLE = "webinar_registrations";

export type WebinarRegistrationRow = {
  name: string;
  email: string;
  contact_number: string;
};

export type WebinarRegistrationResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function insertWebinarRegistration(
  row: WebinarRegistrationRow
): Promise<WebinarRegistrationResult> {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
    };
  }
  const payload = {
    name: row.name.trim(),
    email: row.email.trim(),
    contact_number: row.contact_number.trim(),
  };
  const { data, error } = await supabase
    .from(WEBINAR_REGISTRATIONS_TABLE)
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    console.error("[Supabase] insert webinar_registrations error:", error);
    return {
      success: false,
      error: error.message || "Database error. Check table name and RLS policies.",
    };
  }
  return data?.id ? { success: true, id: String(data.id) } : { success: false, error: "No id returned" };
}

const WEBINAR_PAYMENT_BUCKET = "webinar-payment-proofs";

export type UploadPaymentProofResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadWebinarPaymentProof(
  registrationId: string,
  file: File
): Promise<UploadPaymentProofResult> {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase is not configured.",
    };
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${registrationId}/proof.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(WEBINAR_PAYMENT_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) {
    console.error("[Supabase] storage upload error:", uploadError);
    return {
      success: false,
      error: uploadError.message || "Upload failed.",
    };
  }
  const { data: urlData } = supabase.storage.from(WEBINAR_PAYMENT_BUCKET).getPublicUrl(path);
  const url = urlData.publicUrl;
  const { error: updateError } = await supabase
    .from(WEBINAR_REGISTRATIONS_TABLE)
    .update({ payment_proof_url: url })
    .eq("id", registrationId);
  if (updateError) {
    console.error("[Supabase] update payment_proof_url error:", updateError);
    return {
      success: false,
      error: updateError.message || "Failed to save proof link.",
    };
  }
  return { success: true, url };
}
