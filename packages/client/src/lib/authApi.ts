/**
 * Exchange Google access token for backend JWT and store it.
 */

import { AUTH_KEYS, setStoredJwt, clearAuth } from "./auth";

// Use VITE_API_URL when set. If the app is served from another host
// but VITE_API_URL is localhost, use same origin so the request hits the right server.
function getApiBase(): string {
  const envUrl =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
      : "";
  if (!envUrl) return "";
  if (typeof window === "undefined") return envUrl;
  try {
    const envHost = new URL(envUrl).hostname;
    const pageHost = window.location.hostname;
    // If env points to localhost but we're not on localhost (e.g. deployed elsewhere), use same origin.
    if (envHost === "localhost" && pageHost !== "localhost" && pageHost !== "127.0.0.1") {
      return "";
    }
  } catch {
    // ignore invalid URL
  }
  return envUrl;
}

export type GoogleAuthResponse = {
  token: string;
  user: { id?: string; email?: string; name?: string; picture?: string };
};

export type GoogleAuthError = { message: string; code?: string };

export async function exchangeGoogleToken(accessToken: string): Promise<{
  success: true;
  user: GoogleAuthResponse["user"];
} | {
  success: false;
  error: string;
}> {
  try {
    const base = getApiBase();
    const url = `${base}/api/auth/google`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.message || data?.error || `Request failed (${res.status})`;
      return { success: false, error: message };
    }

    const token = data?.token;
    const user = data?.user;

    if (!token || typeof token !== "string") {
      return { success: false, error: "Invalid response: no token" };
    }

    setStoredJwt(token);
    if (user && typeof user === "object") {
      try {
        localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
      } catch {
        // ignore storage quota
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth-change"));
    }
    return {
      success: true,
      user: user && typeof user === "object" ? user : {},
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

export function logout(): void {
  clearAuth();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-change"));
  }
}
