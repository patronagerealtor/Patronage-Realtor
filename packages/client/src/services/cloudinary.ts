/**
 * Cloudinary upload service. Unsigned uploads only; no secrets in frontend.
 * Centralizes upload logic with client-side file size and type validation.
 */
import {
  cloudinaryUploadImage as libUploadImage,
  cloudinaryUploadVideo as libUploadVideo,
  cloudinaryUploadRaw as libUploadRaw,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_RAW_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB (e.g. PDF)

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const RAW_TYPES = ["application/pdf"];

function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return `Allowed types: ${IMAGE_TYPES.join(", ")}`;
  if (file.size > MAX_IMAGE_SIZE_BYTES) return `Max size ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} MB`;
  return null;
}

function validateVideo(file: File): string | null {
  if (!VIDEO_TYPES.includes(file.type) && !file.type.startsWith("video/")) return "Allowed: MP4, WebM, QuickTime";
  if (file.size > MAX_VIDEO_SIZE_BYTES) return `Max size ${MAX_VIDEO_SIZE_BYTES / 1024 / 1024} MB`;
  return null;
}

function validateRaw(file: File): string | null {
  if (!RAW_TYPES.includes(file.type) && file.type !== "application/pdf") return "Allowed: PDF";
  if (file.size > MAX_RAW_SIZE_BYTES) return `Max size ${MAX_RAW_SIZE_BYTES / 1024 / 1024} MB`;
  return null;
}

export const cloudinaryService = {
  isConfigured: isCloudinaryConfigured,

  async uploadImage(file: File, folder: string): Promise<{ url: string } | { error: string }> {
    const err = validateImage(file);
    if (err) return { error: err };
    return libUploadImage(file, folder);
  },

  async uploadVideo(file: File, folder: string, publicId?: string): Promise<{ url: string } | { error: string }> {
    const err = validateVideo(file);
    if (err) return { error: err };
    return libUploadVideo(file, folder, publicId);
  },

  async uploadRaw(file: File, folder: string): Promise<{ url: string } | { error: string }> {
    const err = validateRaw(file);
    if (err) return { error: err };
    return libUploadRaw(file, folder);
  },
};
