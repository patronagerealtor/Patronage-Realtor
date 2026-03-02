/**
 * Set document title and meta description per route. Call from layout or page.
 * Canonical is derived from env.appUrl + pathname (no hardcoded protocol/domain).
 */
import { useEffect } from "react";
import { env } from "@/config/env";

const DEFAULT_TITLE = "Patronage Realtor";
const DEFAULT_DESCRIPTION =
  "Patronage Realtor – modern real estate platform. Properties, investment, webinars, and expert guidance.";

export function usePageMeta(options: { title?: string; description?: string } = {}) {
  const title = options.title ? `${options.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
}

/** Set canonical link. Use origin from env.appUrl or window.location (works behind Cloudflare). */
export function useCanonical(pathname: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const origin = env.appUrl
      ? env.appUrl.replace(/\/$/, "")
      : typeof window !== "undefined"
        ? window.location.origin
        : "";
    const href = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [pathname]);
}
