import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import {
  isCloudinaryConfigured,
  getReelPublicUrl as cloudinaryGetReelPublicUrl,
  getTransformedImageUrl as cloudinaryGetTransformedImageUrl,
  getCloudinarySrcSet as cloudinaryGetCloudinarySrcSet,
  isCloudinaryUrl,
  cloudinaryUploadImage,
  cloudinaryUploadRaw,
} from "./cloudinary";

const supabaseUrl = typeof import.meta?.env?.VITE_SUPABASE_2_URL === "string" ? import.meta.env.VITE_SUPABASE_2_URL : "";
const supabaseAnonKey = typeof import.meta?.env?.VITE_SUPABASE_2_ANON_KEY === "string" ? import.meta.env.VITE_SUPABASE_2_ANON_KEY : "";

const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const useCloudinary = isCloudinaryConfigured();

/** True when Supabase backend is available (for Data Entry). */
export function isBackendConfigured(): boolean {
  return !!supabaseClient;
}

export const supabase: SupabaseClient | null = supabaseClient;

// ---------------------------------------------------------------------------
// Storage: reels (Cloudinary or Supabase)
// ---------------------------------------------------------------------------

const REELS_BUCKET = "reels";

/** Public CDN URL for a reel video. Path = Cloudinary public_id (folder/name e.g. reels/canary, reels/premium, reels/luxury) or Supabase object path. */
export function getReelPublicUrl(path: string, version?: string): string {
  if (!path || typeof path !== "string") return "";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  if (normalized.startsWith("http")) return normalized;
  if (useCloudinary) return cloudinaryGetReelPublicUrl(path, version);
  if (!supabaseUrl) return "";
  // Object path inside bucket: strip "reels/" prefix only; do not append .mp4 (storage key may be id-only)
  const bucketPath = normalized.startsWith("reels/") ? normalized.slice(6) : normalized;
  return `${supabaseUrl}/storage/v1/object/public/${REELS_BUCKET}/${bucketPath}`;
}

// ---------------------------------------------------------------------------
// Image CDN: Cloudinary (server-side cache) or Supabase transform
// ---------------------------------------------------------------------------

const OBJECT_PUBLIC_RE = /^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

/** Optimized image URL (Cloudinary or Supabase). Server-side CDN when using Cloudinary. */
export function getTransformedImageUrl(
  url: string,
  options?: ImageTransformOptions
): string {
  if (!url) return url;
  if (isCloudinaryUrl(url)) return cloudinaryGetTransformedImageUrl(url, options);
  if (!supabaseUrl) return url;
  const match = url.match(OBJECT_PUBLIC_RE);
  if (!match) return url;
  const [, origin, bucket, path] = match;
  const renderPath = `${origin}/storage/v1/render/image/public/${bucket}/${path}`;
  const params = new URLSearchParams();
  if (options?.width != null) params.set("width", String(Math.round(options.width)));
  if (options?.height != null) params.set("height", String(Math.round(options.height)));
  if (options?.quality != null) params.set("quality", String(Math.min(100, Math.max(20, options.quality))));
  if (options?.resize) params.set("resize", options.resize);
  const qs = params.toString();
  return qs ? `${renderPath}?${qs}` : renderPath;
}

/** True if URL is Cloudinary or Supabase Storage (for lazy/transform). */
export function isSupabaseStorageUrl(url: string): boolean {
  return (typeof url === "string" && OBJECT_PUBLIC_RE.test(url)) || isCloudinaryUrl(url);
}

/** Responsive srcset for Cloudinary images (CDN-friendly, on-demand sizes). */
export function getCloudinarySrcSet(
  url: string,
  options: { maxWidth: number; height?: number; quality?: number; resize?: "cover" | "contain" | "fill" }
): string {
  return cloudinaryGetCloudinarySrcSet(url, options);
}

export { isCloudinaryUrl };

export type SupabaseConnectionResult =
  | { connected: true; message: string; count: number }
  | { connected: false; message: string; error?: unknown };

const PROPERTIES_TABLE = "properties";
const PROPERTY_IMAGES_TABLE = "property_images";
const PROPERTY_AMENITIES_TABLE = "property_amenities";
const REELS_TABLE = "reels";
const SITE_STATS_TABLE = "site_stats";

/** Verifies Supabase backend and that properties are reachable. */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      connected: false,
      message: "Missing env: set VITE_SUPABASE_2_URL and VITE_SUPABASE_2_ANON_KEY in .env",
    };
  }
  if (!supabaseClient) {
    return { connected: false, message: "Supabase client not initialized." };
  }
  try {
    const { count, error } = await supabaseClient
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
  address?: string;
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
  google_map_link?: string | null;
  possession_date?: string | null;
  bhk_type?: string | null;
  possession_by?: string | null;
  amenities?: {
    id: string;
    name: string;
    icon: string;
  }[];
  price_value?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  slug?: string;
  rera_applicable?: boolean;
  rera_number?: string | null;
};

type PropertyImageRow = { image_url: string; sort_order: number };

type PropertiesTableRow = {
  id?: string;
  title?: string | null;
  location?: string | null;
  address?: string | null;
  developer?: string | null;
  property_type?: string | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: string | null;
  construction_status?: string | null;
  created_at?: string | null;
  city?: string | null;
  possession_date?: string | null;
  bhk_type?: string | null;
  possession_by?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  google_map_link?: string | null;
  price_value?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  slug?: string | null;
  description?: string | null;
  rera_applicable?: boolean | null;
  rera_number?: string | null;
  property_amenities?: {
    amenities: { id: string; name: string; icon: string } | null;
  }[] | null;
  property_images?: PropertyImageRow[] | null;
};

function toPropertyRow(row: PropertiesTableRow | null): PropertyRow | null {
  if (!row || row.id == null) return null;
  const rawImages = row.property_images;
  const imagesArray = Array.isArray(rawImages)
    ? rawImages
    : rawImages && typeof rawImages === "object"
      ? [rawImages]
      : [];
  const images = imagesArray
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => (img && typeof img === "object" && "image_url" in img ? img.image_url : null))
    .filter((url): url is string => typeof url === "string" && url.trim().startsWith("http"));
  return {
    id: String(row.id),
    title: row.title ?? "",
    location: row.location ?? "",
    address: row.address ?? "",
    developer: row.developer ?? undefined,
    property_type: row.property_type ?? undefined,
    price:
      row.price_min != null && row.price_max != null
        ? `${row.price_min} - ${row.price_max}`
        : row.price_value != null
          ? String(row.price_value)
          : "",
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    sqft: row.sqft ?? "",
    status: row.construction_status ?? "",
    image_url: images.length ? images[0] : null,
    images,
    description: row.description ?? "",
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    google_map_link: row.google_map_link ?? null,
    possession_date: row.possession_date ?? null,
    bhk_type: row.bhk_type ?? undefined,
    possession_by: row.possession_by ?? undefined,
    amenities: (() => {
      const list = row.property_amenities?.map((pa) => pa.amenities) ?? [];
      return list.filter(
        (a): a is { id: string; name: string; icon: string } =>
          a != null && typeof a === "object" && "id" in a && "name" in a && "icon" in a
      );
    })(),
    price_value: row.price_value != null ? Number(row.price_value) : null,
    price_min: row.price_min != null ? Number(row.price_min) : null,
    price_max: row.price_max != null ? Number(row.price_max) : null,
    slug: row.slug ?? undefined,
    rera_applicable: row.rera_applicable ?? false,
    rera_number: row.rera_number ?? undefined,
  };
}

export async function fetchPropertiesFromSupabase(): Promise<PropertyRow[]> {
  if (!supabaseClient) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_2_URL and VITE_SUPABASE_2_ANON_KEY in .env to load properties."
    );
  }
  const { data, error } = await supabaseClient
    .from(PROPERTIES_TABLE)
    .select(
      `
      *,
      property_images (
        image_url,
        sort_order
      ),
      property_amenities (
        amenities (
          id,
          name,
          icon
        )
      )
    `
    )
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[Supabase] fetch properties error:", error);
    throw new Error(error.message || "Failed to load properties from database.");
  }
  const rows = (data ?? []) as PropertiesTableRow[];
  return rows.map((r) => toPropertyRow(r)).filter((r): r is PropertyRow => r != null);
}

export async function fetchAmenities(): Promise<{ id: string; name: string; icon: string }[]> {
  if (!supabaseClient) return [];
  const { data } = await supabaseClient.from("amenities").select("*");
  return (data ?? []).map((r: { id: string; name: string; icon: string }) => ({ id: String(r.id).toLowerCase(), name: r.name ?? "", icon: r.icon ?? "" }));
}

export type ReelRow = {
  id: string | number;
  projectName: string;
  config: string;
  location: string;
  instagramUrl: string;
  videoPath: string;
  cloudinaryVersion?: string;
  price?: string;
};

export async function fetchReels(): Promise<ReelRow[]> {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from(REELS_TABLE)
    .select("id, project_name, config, location, instagram_url, video_path, cloudinary_version, price, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[Supabase] fetch reels error:", error.message);
    return [];
  }
  const rows = (data ?? []) as { id: string; project_name?: string; config?: string; location?: string; instagram_url?: string; video_path?: string; cloudinary_version?: string | null; price?: string | null }[];
  return rows
    .filter((r) => r.id != null && (r.video_path ?? "").trim() !== "")
    .map((r) => ({
      id: r.id,
      projectName: r.project_name ?? "",
      config: r.config ?? "",
      location: r.location ?? "",
      instagramUrl: r.instagram_url ?? "",
      videoPath: (r.video_path ?? "").trim(),
      cloudinaryVersion: r.cloudinary_version ?? undefined,
      price: r.price ?? undefined,
    }));
}

export type SiteStatsRow = {
  happy_clients: number;
  properties_sold: number;
  years_experience: number;
};

const DEFAULT_SITE_STATS: SiteStatsRow = { happy_clients: 1000, properties_sold: 500, years_experience: 4 };

export async function fetchSiteStats(): Promise<SiteStatsRow> {
  if (!supabaseClient) return DEFAULT_SITE_STATS;
  const { data, error } = await supabaseClient
    .from(SITE_STATS_TABLE)
    .select("happy_clients, properties_sold, years_experience")
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    console.warn("[Supabase] fetch site_stats error:", error.message);
    return DEFAULT_SITE_STATS;
  }
  if (!data) return DEFAULT_SITE_STATS;
  return {
    happy_clients: Number(data.happy_clients) || DEFAULT_SITE_STATS.happy_clients,
    properties_sold: Number(data.properties_sold) || DEFAULT_SITE_STATS.properties_sold,
    years_experience: Number(data.years_experience) || DEFAULT_SITE_STATS.years_experience,
  };
}

export async function updateSiteStats(updates: Partial<SiteStatsRow>): Promise<void> {
  if (!supabaseClient) throw new Error("Backend not configured.");
  const payload: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };
  const { error } = await supabaseClient.from(SITE_STATS_TABLE).update(payload).eq("id", "default");
  if (error) throw error;
}

/** Subscribe to site_stats changes (Realtime). Returns unsubscribe. */
export function subscribeSiteStats(onStats: (stats: SiteStatsRow) => void): () => void {
  if (!supabaseClient) return () => {};
  const channel = supabaseClient
    .channel("site_stats_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: SITE_STATS_TABLE },
      (payload) => {
        const r = (payload.new as { happy_clients?: number; properties_sold?: number; years_experience?: number }) ?? {};
        onStats({
          happy_clients: Number(r.happy_clients) ?? DEFAULT_SITE_STATS.happy_clients,
          properties_sold: Number(r.properties_sold) ?? DEFAULT_SITE_STATS.properties_sold,
          years_experience: Number(r.years_experience) ?? DEFAULT_SITE_STATS.years_experience,
        });
      }
    )
    .subscribe();
  return () => {
    supabaseClient.removeChannel(channel);
  };
}

export async function insertPropertyBackend(id: string, payload: Record<string, unknown>): Promise<void> {
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { error } = await supabaseClient.from(PROPERTIES_TABLE).insert({ ...payload, id }).select("id").single();
  if (error) throw error;
}

export async function updatePropertyBackend(id: string, payload: Record<string, unknown>): Promise<void> {
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { error } = await supabaseClient.from(PROPERTIES_TABLE).update(payload).eq("id", id);
  if (error) throw error;
}

/** Insert or update by id. Use this when saving so a second save with the same id (e.g. after uploading images) does not 409. */
export async function upsertPropertyBackend(id: string, payload: Record<string, unknown>): Promise<void> {
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { error } = await supabaseClient
    .from(PROPERTIES_TABLE)
    .upsert({ ...payload, id }, { onConflict: "id" })
    .select("id")
    .single();
  if (error) throw error;
}

export async function deletePropertyBackend(id: string): Promise<void> {
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { data: imageRows } = await supabaseClient.from(PROPERTY_IMAGES_TABLE).select("image_url").eq("property_id", id);
  const re = /\/property-images\/([^?#]+)/;
  const paths = Array.isArray(imageRows)
    ? (imageRows as { image_url: string }[]).map((r) => re.exec(r.image_url ?? "")?.[1]).filter((x): x is string => !!x)
    : [];
  if (paths.length > 0) {
    try {
      await supabaseClient.storage.from(STORAGE_BUCKET).remove(paths);
    } catch (_) {}
  }
  await supabaseClient.from(PROPERTY_IMAGES_TABLE).delete().eq("property_id", id);
  await supabaseClient.from(PROPERTIES_TABLE).delete().eq("id", id);
}

export async function syncPropertyImagesBackend(propertyId: string, imageUrls: string[]): Promise<void> {
  if (!supabaseClient) return;
  const id = String(propertyId).trim();
  const { error: deleteError } = await supabaseClient.from(PROPERTY_IMAGES_TABLE).delete().eq("property_id", id);
  if (deleteError) {
    console.error("[Supabase] syncPropertyImages delete error:", deleteError);
    throw deleteError;
  }
  const validUrls = imageUrls.filter((url) => typeof url === "string" && url.trim().startsWith("http"));
  if (validUrls.length) {
    const rows = validUrls.map((image_url, sort_order) => ({
      property_id: id,
      image_url: image_url.trim(),
      sort_order,
    }));
    const { data, error: insertError } = await supabaseClient
      .from(PROPERTY_IMAGES_TABLE)
      .insert(rows)
      .select("id, property_id, image_url");
    if (insertError) {
      console.error("[Supabase] syncPropertyImages insert error:", insertError);
      throw insertError;
    }
    if (!data?.length) {
      console.warn("[Supabase] syncPropertyImages insert returned no rows; RLS may block SELECT on insert.");
    }
  }
}

export async function syncPropertyAmenitiesBackend(propertyId: string, amenityIds: string[]): Promise<void> {
  if (!supabaseClient) return;
  await supabaseClient.from(PROPERTY_AMENITIES_TABLE).delete().eq("property_id", propertyId);
  if (amenityIds.length) {
    await supabaseClient.from(PROPERTY_AMENITIES_TABLE).insert(amenityIds.map((amenity_id) => ({ property_id: propertyId, amenity_id })));
  }
}

const STORAGE_BUCKET = "property-images";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/webp" as const,
  initialQuality: 0.8,
};

/**
 * Uploads property images to Cloudinary (server-side CDN) or Supabase Storage.
 * Returns public URLs; caller syncs to backend via syncPropertyImagesBackend.
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<string[]> {
  if (!files.length) return [];
  const urls: string[] = [];

  if (useCloudinary) {
    const folder = `property-images/${propertyId}`;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileToUpload: File = file;
      try {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        if (compressed?.size) fileToUpload = compressed;
      } catch (_) {}
      const result = await cloudinaryUploadImage(fileToUpload, folder);
      if ("url" in result) urls.push(result.url);
    }
    return urls;
  }

  if (!supabaseClient) return [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    let fileToUpload: File = file;
    const name = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let path: string;
    try {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      if (compressed?.size) {
        fileToUpload = compressed;
        path = `${propertyId}/${name}.webp`;
      } else {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        path = `${propertyId}/${name}.${/^[a-z0-9]+$/i.test(ext) ? ext : "jpg"}`;
      }
    } catch {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      path = `${propertyId}/${name}.${/^[a-z0-9]+$/i.test(ext) ? ext : "jpg"}`;
    }
    try {
      const { error: uploadError } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(path, fileToUpload, { upsert: true, cacheControl: "31536000" });
      if (uploadError) continue;
      const { data } = supabaseClient.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
      await supabaseClient.from(PROPERTY_IMAGES_TABLE).insert({ property_id: propertyId, image_url: data.publicUrl, sort_order: index });
    } catch (_) {}
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
  const payload = {
    name: row.name.trim(),
    email: row.email.trim(),
    contact_number: row.contact_number.trim(),
  };
  if (!supabaseClient) return { success: false, error: "Backend not configured." };
  const { data, error } = await supabaseClient.from(WEBINAR_REGISTRATIONS_TABLE).insert(payload).select("id").single();
  if (error) return { success: false, error: error.message || "Database error." };
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
  let url: string;
  if (useCloudinary) {
    const folder = `webinar-proofs/${registrationId}`;
    const isPdf = file.type === "application/pdf";
    const result = isPdf ? await cloudinaryUploadRaw(file, folder) : await cloudinaryUploadImage(file, folder);
    if ("error" in result) return { success: false, error: result.error };
    url = result.url;
  } else {
    if (!supabaseClient) return { success: false, error: "Backend not configured." };
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${registrationId}/proof.${ext}`;
    const { error: uploadError } = await supabaseClient.storage.from(WEBINAR_PAYMENT_BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message || "Upload failed." };
    url = supabaseClient.storage.from(WEBINAR_PAYMENT_BUCKET).getPublicUrl(path).data.publicUrl;
  }
  if (!supabaseClient) return { success: false, error: "Backend not configured." };
  const { error: updateError } = await supabaseClient.from(WEBINAR_REGISTRATIONS_TABLE).update({ payment_proof_url: url }).eq("id", registrationId);
  if (updateError) return { success: false, error: updateError.message || "Failed to save proof link." };
  return { success: true, url };
}

// ---------------------------------------------------------------------------
// Newsletter subscribers (Footer). Run supabase-newsletter_subscribers.sql first.
// ---------------------------------------------------------------------------

const NEWSLETTER_SUBSCRIBERS_TABLE = "newsletter_subscribers";

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

export type NewsletterSubscriberInsert = {
  email: string;
};

export type InsertNewsletterSubscriberResult =
  | { success: true }
  | { success: false; code: "duplicate"; message: string }
  | { success: false; code: "error"; message: string };

const PG_UNIQUE_VIOLATION = "23505";

export async function insertNewsletterSubscriber(
  email: string
): Promise<InsertNewsletterSubscriberResult> {
  if (!supabaseClient) return { success: false, code: "error", message: "Backend not configured." };
  const trimmed = email.trim();
  const { error } = await supabaseClient.from(NEWSLETTER_SUBSCRIBERS_TABLE).insert({ email: trimmed });
  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return { success: false, code: "duplicate", message: "Already subscribed" };
    return { success: false, code: "error", message: error.message || "Failed to subscribe." };
  }
  return { success: true };
}

export async function fetchNewsletterSubscribers(): Promise<NewsletterSubscriberRow[]> {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient.from(NEWSLETTER_SUBSCRIBERS_TABLE).select("id, email, created_at").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as NewsletterSubscriberRow[];
}

export async function deleteMultipleNewsletterSubscribers(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { error } = await supabaseClient.from(NEWSLETTER_SUBSCRIBERS_TABLE).delete().in("id", ids);
  if (error) throw new Error(error.message || "Failed to delete subscribers.");
}

// ---------------------------------------------------------------------------
// Contact leads (property inquiry form). Run supabase-contact_leads.sql first.
// ---------------------------------------------------------------------------

const CONTACT_LEADS_TABLE = "contact_leads";

export type ContactLeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_id: string | null;
  property_title: string;
  created_at: string;
};

export type ContactLeadInsert = {
  name: string;
  email: string;
  phone: string;
  property_id: string;
  property_title: string;
  /** Optional. Defaults to "site_visit" when omitted. Use "floorplan_request" for floor plan requests. */
  lead_type?: string;
};

export type InsertContactLeadResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function insertContactLead(
  row: ContactLeadInsert
): Promise<InsertContactLeadResult> {
  const payload = {
    name: row.name.trim(),
    email: row.email.trim(),
    phone: row.phone.trim(),
    property_id: row.property_id,
    property_title: row.property_title.trim(),
    lead_type: row.lead_type ?? "site_visit",
  };
  if (!supabaseClient) return { success: false, error: "Backend not configured." };
  const { data, error } = await supabaseClient.from(CONTACT_LEADS_TABLE).insert(payload).select("id").single();
  if (error) return { success: false, error: error.message || "Database error." };
  return data?.id ? { success: true, id: String(data.id) } : { success: false, error: "No id returned" };
}

export async function fetchContactLeads(): Promise<ContactLeadRow[]> {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient.from(CONTACT_LEADS_TABLE).select("id, name, email, phone, property_id, property_title, created_at").order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as ContactLeadRow[];
}

export async function deleteMultipleContactLeads(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  if (!supabaseClient) throw new Error("Backend not configured.");
  const { error } = await supabaseClient.from(CONTACT_LEADS_TABLE).delete().in("id", ids);
  if (error) throw new Error(error.message || "Failed to delete leads.");
}

// ---------------------------------------------------------------------------
// User profiles (name, email, phone). Run supabase-user_profiles.sql first.
// ---------------------------------------------------------------------------

const USER_PROFILES_TABLE = "user_profiles";

export type UserProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  purpose_of_visit: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfileUpsert = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  purpose_of_visit?: string | null;
};

export async function getProfile(userId: string): Promise<UserProfileRow | null> {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from(USER_PROFILES_TABLE)
    .select("id, email, full_name, phone, avatar_url, purpose_of_visit, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[Supabase] getProfile error:", error);
    return null;
  }
  return data as UserProfileRow | null;
}

export type UpsertProfileResult =
  | { success: true; profile: UserProfileRow }
  | { success: false; error: string };

export async function upsertProfile(row: UserProfileUpsert): Promise<UpsertProfileResult> {
  if (!supabaseClient) return { success: false, error: "Backend not configured." }
  // Use RPC so the profile is upserted with auth.uid() server-side, avoiding FK and 409 issues.
  const { data, error } = await supabaseClient.rpc("upsert_my_profile", {
    p_phone: row.phone ?? null,
    p_full_name: row.full_name ?? null,
    p_email: row.email ?? null,
    p_avatar_url: row.avatar_url ?? null,
    p_purpose_of_visit: row.purpose_of_visit ?? null,
  });
  if (error) return { success: false, error: error.message || "Failed to save profile." };
  const profile = Array.isArray(data) ? data[0] : data;
  if (!profile) return { success: false, error: "No profile returned." };
  return { success: true, profile: profile as UserProfileRow };
}
