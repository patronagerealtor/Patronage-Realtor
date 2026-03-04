import { MapPin } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

/**
 * Google Maps iframe only accepts the Embed URL (Share → Embed a map).
 * Share links (e.g. goo.gl/maps, ?cid=...) cause "Invalid 'pb' parameter".
 * Returns the embed URL if valid, otherwise null so we show a fallback.
 */
function buildGoogleEmbedUrl(rawLink?: string | null): string | null {
  if (rawLink == null || typeof rawLink !== "string") return null;
  let link = rawLink.trim();
  if (!link) return null;

  // If admin pasted full iframe HTML, extract the src
  const iframeSrcMatch = link.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch?.[1]) link = iframeSrcMatch[1].trim();

  // Must be the embed endpoint with a non-empty pb parameter (required by Google)
  if (!link.includes("google.com/maps/embed")) return null;
  try {
    const url = new URL(link);
    const pb = url.searchParams.get("pb");
    if (!pb || pb.length < 10) return null; // pb is typically a long encoded string
    return link;
  } catch {
    return null;
  }
}

/** Builds a "Open in Google Maps" search URL from an address string. */
function mapsSearchUrl(location?: string | null): string {
  const q = encodeURIComponent((location || "").trim() || "India");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

type MapSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

export function MapSection({ data, sectionRef }: MapSectionProps) {
  const embedUrl = buildGoogleEmbedUrl(data.google_map_link);

  return (
    <section
      ref={sectionRef}
      data-section="Map"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Map & Neighborhood
        </h2>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{data.location ?? "Property Location"}</span>
        </div>

        <div className="mt-6 h-[400px] w-full overflow-hidden rounded-lg border border-border bg-muted">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Location Map"
              className="h-full w-full rounded-lg"
            />
          ) : (
            <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground">
              <MapPin className="h-12 w-12" />
              <p className="text-sm font-medium">
                {data.google_map_link?.trim()
                  ? "Invalid map link. Use the embed URL from Google Maps (Share → Embed a map)."
                  : "Location Map Coming Soon"}
              </p>
              <a
                href={mapsSearchUrl(data.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
