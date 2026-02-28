/**
 * Exchange Google access token for backend JWT and store it.
 */

import { AUTH_KEYS, setStoredJwt, clearAuth } from "./auth";

// Always use same origin so /api hits the server that served the page.
// In dev with client-only (e.g. port 5173), Vite proxies /api to the backend (see vite.config server.proxy).
const API_BASE = "";

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
    const url = `${API_BASE}/api/auth/google`;
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
