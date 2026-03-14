/**
 * Set document title and meta description per route. Call from layout or page.
 * Canonical is derived from env.appUrl + pathname (no hardcoded protocol/domain).
 */
import { useEffect } from "react";
import { env } from "@/config/env";

const DEFAULT_TITLE = "Patronage Realtor";
const DEFAULT_DESCRIPTION =
  "Patronage Realtor – modern real estate platform. Properties, investment, webinars, and expert guidance.";

type PageMetaOptions = {
  title?: string;
  description?: string;
  /**
   * Optional JSON-LD schema object or array. When provided, it will be injected
   * into a single <script type="application/ld+json" id="patronage-schema"> tag
   * in <head>. Pass plain objects/arrays; they will be stringified safely.
   */
  schema?: unknown;
};

export function usePageMeta(options: PageMetaOptions = {}) {
  const title = options.title ? `${options.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const schemaJson = options.schema ? JSON.stringify(options.schema) : "";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;

    // Helper to safely create/update meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Standard SEO
    setMetaTag("name", "description", description);

    // Open Graph (WhatsApp, LinkedIn, Facebook)
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");

    // Twitter Cards
    setMetaTag("name", "twitter:card", "summary");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

  }, [title, description]);

  // JSON-LD schema (single managed script tag for the page)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.getElementById("patronage-schema");
    if (!schemaJson) {
      if (existing) existing.remove();
      return;
    }
    let script = existing as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "patronage-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = schemaJson;
  }, [schemaJson]);
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
    
    // Set Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    // Set OG URL to match canonical
    let metaUrl = document.querySelector('meta[property="og:url"]');
    if (!metaUrl) {
      metaUrl = document.createElement("meta");
      metaUrl.setAttribute("property", "og:url");
      document.head.appendChild(metaUrl);
    }
    metaUrl.setAttribute("content", href);

  }, [pathname]);
}