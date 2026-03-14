/**
 * Runtime env config. Only VITE_* variables are safe in the client bundle.
 * Fails fast if required vars are missing (production or when CHECK_ENV=true).
 */

const get = (key: string): string => {
  const v = typeof import.meta !== "undefined" && import.meta.env?.[key as keyof ImportMeta["env"]];
  return typeof v === "string" ? v : "";
};

/** Support legacy names; prefer standard names. */
export const env = {
  get supabaseUrl(): string {
    return get("VITE_SUPABASE_URL") || get("VITE_SUPABASE_2_URL");
  },
  get supabaseAnonKey(): string {
    return get("VITE_SUPABASE_ANON_KEY") || get("VITE_SUPABASE_2_ANON_KEY");
  },
  get cloudinaryCloudName(): string {
    return get("VITE_CLOUDINARY_CLOUD_NAME");
  },
  get cloudinaryUploadPreset(): string {
    return get("VITE_CLOUDINARY_UPLOAD_PRESET");
  },
  get cloudinaryUploadPresetVideo(): string {
    return get("VITE_CLOUDINARY_UPLOAD_PRESET_VIDEO") || get("VITE_CLOUDINARY_UPLOAD_PRESET");
  },
  get appUrl(): string {
    return get("VITE_APP_URL");
  },
  get afterSignInRedirect(): string {
    return get("VITE_AFTER_SIGNIN_REDIRECT") || "/";
  },
  get dataEntryAllowedEmail(): string {
    return get("VITE_DATA_ENTRY_ALLOWED_EMAIL");
  },
  get contactFormUrl(): string {
    return get("VITE_CONTACT_FORM_URL");
  },
  get webinarPaymentLink(): string {
    return get("VITE_WEBINAR_PAYMENT_LINK");
  },
  get webinarContactFormUrl(): string {
    return get("VITE_WEBINAR_CONTACT_FORM_URL");
  },
  get googleClientId(): string {
    return get("VITE_GOOGLE_CLIENT_ID");
  },
  /** Site domain for IndexNow (e.g. patronagerealtor.in). Used when building canonical URLs. Falls back to appUrl host. */
  get siteDomain(): string {
    const domain = get("VITE_SITE_DOMAIN");
    if (domain) return domain;
    const url = get("VITE_APP_URL");
    if (!url) return "";
    try {
      const u = new URL(url);
      return u.hostname || "";
    } catch {
      return "";
    }
  },
  get isDev(): boolean {
    return get("MODE") === "development" || import.meta.env?.DEV === true;
  },
} as const;

function checkRequired(): void {
  const forceCheck = get("VITE_CHECK_ENV") === "true" || (!env.isDev && typeof import.meta.env?.MODE === "string");
  if (!forceCheck) return;
  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push("VITE_SUPABASE_URL (or VITE_SUPABASE_2_URL)");
  if (!env.supabaseAnonKey) missing.push("VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_2_ANON_KEY)");
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Copy .env.example to .env.local and set values.`
    );
  }
}

/** Call once at app startup. Throws if required env is missing in production. */
export function requireEnv(): void {
  checkRequired();
}
