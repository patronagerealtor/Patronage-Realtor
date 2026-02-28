import type { ImgHTMLAttributes } from "react";
import { getTransformedImageUrl, isSupabaseStorageUrl } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export type SupabaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Image URL (Supabase or any). */
  src: string;
  /** Optional: request a smaller size from Supabase CDN (Pro plan). */
  transformWidth?: number;
  /** Optional: request a smaller size from Supabase CDN (Pro plan). */
  transformHeight?: number;
  /** Optional: quality 20–100 for transformed images. */
  transformQuality?: number;
  /** Set "high" for LCP images (e.g. first hero); omit for lazy below-the-fold. */
  fetchPriority?: "high" | "low" | "auto";
  /** Extra class names. */
  className?: string;
};

/**
 * Image component for Supabase (and other) URLs with lazy loading and optional
 * CDN transform. Use for property images, gallery, thumbnails, etc.
 */
export function SupabaseImage({
  src,
  alt = "",
  transformWidth,
  transformHeight,
  transformQuality,
  fetchPriority,
  loading,
  decoding = "async",
  className,
  ...rest
}: SupabaseImageProps) {
  const isSupabase = isSupabaseStorageUrl(src);
  const finalSrc =
    isSupabase && (transformWidth != null || transformHeight != null || transformQuality != null)
      ? getTransformedImageUrl(src, {
          width: transformWidth,
          height: transformHeight,
          quality: transformQuality,
        })
      : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={fetchPriority === "high" ? "eager" : loading ?? "lazy"}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={cn(className)}
      {...rest}
    />
  );
}
