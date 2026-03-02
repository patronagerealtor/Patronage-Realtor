import type { ImgHTMLAttributes } from "react";
import { imageService } from "@/services/image";
import { cn } from "@/lib/utils";

export type SupabaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Image URL (Supabase or Cloudinary). */
  src: string;
  /** Max width for CDN transform and responsive srcset (reduces bandwidth). */
  transformWidth?: number;
  /** Max height for CDN transform. */
  transformHeight?: number;
  /** Quality 20–100. Omit for q_auto (recommended). */
  transformQuality?: number;
  /** Set "high" for LCP images (e.g. first hero); omit for lazy below-the-fold. */
  fetchPriority?: "high" | "low" | "auto";
  /** Use responsive srcset for Cloudinary (smaller cache, on-demand sizes). Default true when transformWidth set. */
  responsive?: boolean;
  /** Override default sizes for srcset (e.g. "100vw" for hero). */
  sizes?: string;
  /** Extra class names. */
  className?: string;
};

/**
 * Image component with CDN optimizations: lazy loading, f_auto/q_auto for Cloudinary,
 * responsive srcset to reduce memory and bandwidth. Use for property images, gallery, thumbnails.
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
  responsive = true,
  sizes: sizesProp,
  className,
  ...rest
}: SupabaseImageProps) {
  const isSupabase = imageService.isSupabaseStorageUrl(src);
  const isCloudinary = imageService.isCloudinaryUrl(src);

  const applyTransform =
    isSupabase && (transformWidth != null || transformHeight != null || transformQuality != null);
  const finalSrc = applyTransform
    ? imageService.getTransformedImageUrl(src, {
        width: transformWidth,
        height: transformHeight,
        quality: transformQuality,
      })
    : isCloudinary
      ? imageService.getTransformedImageUrl(src, {})
      : src;

  const useSrcSet =
    responsive && isCloudinary && transformWidth != null && transformWidth > 0;
  const srcSet = useSrcSet
    ? imageService.getCloudinarySrcSet(src, {
        maxWidth: transformWidth,
        height: transformHeight,
        quality: transformQuality,
        resize: "fill",
      })
    : undefined;
  const sizes = useSrcSet
    ? sizesProp ?? "(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 600px"
    : undefined;

  return (
    <img
      src={finalSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={fetchPriority === "high" ? "eager" : loading ?? "lazy"}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={cn(className)}
      {...rest}
    />
  );
}
