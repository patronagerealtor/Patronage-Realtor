/**
 * Profile service. Components and hooks use this instead of calling Supabase directly.
 * RLS: user_profiles are scoped by auth.uid() via upsert_my_profile RPC.
 */
import {
  getProfile,
  upsertProfile,
  type UserProfileRow,
  type UserProfileUpsert,
  type UpsertProfileResult,
} from "@/lib/supabase";

export type { UserProfileRow, UserProfileUpsert, UpsertProfileResult };

export const profileService = {
  getProfile,
  upsertProfile,
};
