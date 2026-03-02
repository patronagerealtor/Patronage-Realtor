/**
 * Reels (video) service. Components use this instead of calling Supabase/Cloudinary directly.
 */
import { getReelPublicUrl, fetchReels, type ReelRow } from "@/lib/supabase";

export type { ReelRow };

export const reelsService = {
  getReelPublicUrl,
  fetchReels,
};
