/**
 * Supabase client and storage helpers.
 * Config: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (see .env)
 */
export { supabase, getReelPublicUrl } from "./supabase";
export type { SupabaseClient } from "@supabase/supabase-js";
