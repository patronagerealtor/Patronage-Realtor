/**
 * Microsoft Bing IndexNow integration.
 *
 * Submits URLs to IndexNow so search engines (Bing, Yandex, etc.) can discover
 * content changes quickly. Submissions run asynchronously and do not block the UI.
 *
 * @see https://www.indexnow.org/documentation
 * @see https://www.bing.com/indexnow/getstarted
 */

import { env } from "@/config/env";

/** Maximum URLs per IndexNow POST request (protocol limit). */
const INDEXNOW_BATCH_SIZE = 10_000;

/** IndexNow API endpoint (Bing and participating engines). */
const INDEXNOW_API_URL = "https://api.indexnow.org/indexnow";

/**
 * Builds the canonical URL for a property detail page.
 * Used when notifying IndexNow of property add/update/delete.
 *
 * @param id - Property id (used when slug is missing)
 * @param slug - Optional slug for pretty URL
 * @returns Full URL to the property page
 */
export function getPropertyPageUrl(id: string, slug?: string | null): string {
  const base = (env.appUrl || "").replace(/\/$/, "") || "https://patronagerealtor.in";
  if (slug && String(slug).trim()) {
    return `${base}/properties/${encodeURIComponent(String(slug).trim())}`;
  }
  return `${base}/properties?property=${encodeURIComponent(id)}`;
}

/**
 * Returns the properties listing page URL (submitted when any property changes).
 */
export function getPropertiesListingUrl(): string {
  const base = (env.appUrl || "").replace(/\/$/, "") || "https://patronagerealtor.in";
  return `${base}/properties`;
}

/**
 * Submits a list of URLs to IndexNow via the app's API route.
 * Runs asynchronously (fire-and-forget); does not slow down the caller.
 * Batches URLs in chunks of INDEXNOW_BATCH_SIZE when needed.
 *
 * @param urlList - Full URLs to submit (added, updated, or deleted)
 */
export function submitToIndexNow(urlList: string[]): void {
  const urls = urlList.filter((u) => typeof u === "string" && u.startsWith("http"));
  if (urls.length === 0) return;

  /**
   * Fire-and-forget: do not await. Runs in background so the app stays responsive.
   */
  void (async () => {
    for (let i = 0; i < urls.length; i += INDEXNOW_BATCH_SIZE) {
      const batch = urls.slice(i, i + INDEXNOW_BATCH_SIZE);
      try {
        const res = await fetch("/api/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urlList: batch }),
        });
        if (!res.ok) {
          console.warn("[IndexNow] submission failed:", res.status, await res.text());
        }
      } catch (err) {
        console.warn("[IndexNow] request error:", err);
      }
    }
  })();
}

/**
 * Notifies IndexNow that a property page was created, updated, or deleted.
 * Call this after successful property insert/update/upsert/delete.
 * Submissions are asynchronous and batched.
 *
 * @param id - Property id
 * @param slug - Optional slug for canonical URL
 * @param includeListing - If true, also submits the /properties listing URL (default true)
 */
export function notifyIndexNowPropertyChange(
  id: string,
  slug?: string | null,
  includeListing = true
): void {
  const propertyUrl = getPropertyPageUrl(id, slug);
  const urls = includeListing ? [getPropertiesListingUrl(), propertyUrl] : [propertyUrl];
  submitToIndexNow(urls);
}
