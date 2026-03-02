/**
 * Image URL helpers (transform, srcset). No direct Supabase/Cloudinary calls from components;
 * use this service for optimized image URLs. Used by SupabaseImage and similar.
 */
import {
  getTransformedImageUrl,
  getCloudinarySrcSet,
  isCloudinaryUrl,
  isSupabaseStorageUrl,
  type ImageTransformOptions,
} from "@/lib/supabase";

export type { ImageTransformOptions };

export const imageService = {
  getTransformedImageUrl,
  getCloudinarySrcSet,
  isCloudinaryUrl,
  isSupabaseStorageUrl,
};
