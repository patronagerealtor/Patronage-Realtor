/**
 * Cloudinary backend for images, PDFs, and videos. Replaces Supabase Storage.
 * Uses config/env (VITE_CLOUDINARY_*). No API secret in frontend — unsigned uploads only.
 */
import { env } from "@/config/env";

const cloudName = env.cloudinaryCloudName;
const uploadPreset = env.cloudinaryUploadPreset;
const uploadPresetVideo = env.cloudinaryUploadPresetVideo || uploadPreset;

const CLOUDINARY_IMAGE_BASE = `https://res.cloudinary.com/${cloudName}/image/upload`;
const CLOUDINARY_VIDEO_BASE = `https://res.cloudinary.com/${cloudName}/video/upload`;
const CLOUDINARY_RAW_BASE = `https://res.cloudinary.com/${cloudName}/raw/upload`;

/** Match Cloudinary delivery URLs (image/upload, video/upload, raw/upload). */
const CLOUDINARY_URL_RE = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/;

export function isCloudinaryConfigured(): boolean {
  return !!cloudName && !!uploadPreset;
}

/**
 * Upload image to Cloudinary (unsigned). Folder: property-images/{propertyId}/ or webinar-proofs/{registrationId}/
 * Returns public URL. Server-side CDN caching is handled by Cloudinary.
 */
export async function cloudinaryUploadImage(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  if (!cloudName || !uploadPreset) return { error: "Cloudinary not configured." };
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    return { error: err || "Upload failed." };
  }
  const data = (await res.json()) as { secure_url: string };
  return { url: data.secure_url };
}

/**
 * Upload video to Cloudinary (unsigned). Folder: reels/. Optional publicId (e.g. reels/canary) forces that delivery path.
 */
export async function cloudinaryUploadVideo(
  file: File,
  folder: string,
  publicId?: string
): Promise<{ url: string } | { error: string }> {
  if (!cloudName || !uploadPresetVideo) return { error: "Cloudinary video upload not configured." };
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPresetVideo);
  form.append("folder", folder);
  if (publicId) form.append("public_id", publicId);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    return { error: err || "Video upload failed." };
  }
  const data = (await res.json()) as { secure_url: string };
  return { url: data.secure_url };
}

/**
 * Upload raw file (e.g. PDF) to Cloudinary.
 */
export async function cloudinaryUploadRaw(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  if (!cloudName || !uploadPreset) return { error: "Cloudinary not configured." };
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    return { error: err || "Upload failed." };
  }
  const data = (await res.json()) as { secure_url: string };
  return { url: data.secure_url };
}

/**
 * Return public Cloudinary URL for a reel video.
 * path = Cloudinary public_id (e.g. reels/canary). If you get 404, check Media Library: public_id must match exactly.
 */
export function getReelPublicUrl(path: string, version?: string): string {
  if (!cloudName) return "";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  if (normalized.startsWith("http")) return normalized;
  if (version) return `${CLOUDINARY_VIDEO_BASE}/v${version}/${normalized}`;
  return `${CLOUDINARY_VIDEO_BASE}/${normalized}`;
}

/** True if url is a Cloudinary delivery URL. */
export function isCloudinaryUrl(url: string): boolean {
  return typeof url === "string" && CLOUDINARY_URL_RE.test(url);
}

export type ImageTransformOptions = {
  width?: number;
  height?: number;
  /** Explicit quality 20–100. Omit for q_auto (recommended for smaller size). */
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

/** Responsive breakpoints (widths in px) for srcset. Reduces memory by on-demand delivery. */
export const CLOUDINARY_BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1536] as const;

/**
 * Build Cloudinary transform string with CDN optimizations:
 * - f_auto: optimal format (WebP/AVIF) per browser
 * - q_auto: automatic quality to reduce size
 * - dpr_auto: device pixel ratio for sharpness
 */
function buildCloudinaryTransform(rest: string, options?: ImageTransformOptions): string {
  const parts: string[] = [];
  if (options?.width != null) parts.push(`w_${Math.round(options.width)}`);
  if (options?.height != null) parts.push(`h_${Math.round(options.height)}`);
  if (options?.quality != null) parts.push(`q_${Math.min(100, Math.max(20, options.quality))}`);
  else parts.push("q_auto");
  if (options?.resize === "fill") parts.push("c_fill");
  else if (options?.resize === "contain") parts.push("c_fit");
  else if (options?.resize === "cover" || (options?.width != null) || (options?.height != null))
    parts.push("c_fill");
  parts.push("f_auto", "dpr_auto");
  return `${parts.join(",")}/${rest}`;
}

/**
 * Apply Cloudinary transform to a Cloudinary image URL (server-side transform + CDN cache).
 * Uses f_auto, q_auto, dpr_auto to minimize bandwidth and cache size.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function getTransformedImageUrl(
  url: string,
  options?: ImageTransformOptions
): string {
  if (!url) return url;
  const match = url.match(CLOUDINARY_URL_RE);
  if (!match) return url;
  const type = match[1];
  const rest = match[2];
  if (type !== "image") return url;
  const transform = buildCloudinaryTransform(rest, options);
  return `${CLOUDINARY_IMAGE_BASE}/${transform}`;
}

/**
 * Build responsive srcset for a Cloudinary image (reduces memory: browser requests one size).
 * Uses breakpoints up to maxWidth. Pass same options as getTransformedImageUrl (width will be overridden per candidate).
 */
export function getCloudinarySrcSet(
  url: string,
  options: { maxWidth: number; height?: number; quality?: number; resize?: ImageTransformOptions["resize"] }
): string {
  if (!url) return "";
  const match = url.match(CLOUDINARY_URL_RE);
  if (!match) return "";
  if (match[1] !== "image") return "";
  const rest = match[2];
  const widths = CLOUDINARY_BREAKPOINTS.filter((w) => w <= options.maxWidth);
  if (widths.length === 0) {
    const single = getTransformedImageUrl(url, { width: options.maxWidth, height: options.height, quality: options.quality, resize: options.resize });
    return single ? `${single} ${options.maxWidth}w` : "";
  }
  return widths
    .map((w) => {
      const t = buildCloudinaryTransform(rest, {
        width: w,
        height: options.height,
        quality: options.quality,
        resize: options.resize ?? "fill",
      });
      return `${CLOUDINARY_IMAGE_BASE}/${t} ${w}w`;
    })
    .join(", ");
}
