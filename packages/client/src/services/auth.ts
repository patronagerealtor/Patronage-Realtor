/**
 * Auth service. Components use this instead of calling Supabase auth directly.
 * Session persistence and token refresh are handled by the Supabase client (lib/supabase).
 */
import { supabase } from "@/lib/supabase";
import { env } from "@/config/env";

export const authService = {
  async signInWithOAuth(redirectTo: string = env.afterSignInRedirect) {
    if (!supabase) return { error: new Error("Supabase is not configured.") };
    const baseUrl = env.appUrl
      ? String(env.appUrl).replace(/\/$/, "")
      : typeof window !== "undefined"
        ? window.location.origin
        : "";
    const redirect = `${baseUrl}${redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`}`;
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirect },
    });
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },
};
