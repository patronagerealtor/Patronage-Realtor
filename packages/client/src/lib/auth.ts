/**
 * Auth storage keys and types.
 * JWT from backend is the source of truth for protected routes.
 */

export const AUTH_KEYS = {
  /** Google OAuth access token (short-lived, used to exchange for JWT) */
  GOOGLE_ACCESS_TOKEN: "patronage:google_access_token",
  /** Backend JWT (use this for route protection and API auth) */
  JWT: "patronage:jwt",
  /** Decoded JWT payload cache (optional, for display) */
  USER: "patronage:user",
} as const;

export type DecodedUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: unknown;
};

export function getStoredJwt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.JWT);
}

export function setStoredJwt(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEYS.JWT, token);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEYS.GOOGLE_ACCESS_TOKEN);
  localStorage.removeItem(AUTH_KEYS.JWT);
  localStorage.removeItem(AUTH_KEYS.USER);
}

export function isAuthenticated(): boolean {
  return !!getStoredJwt();
}
