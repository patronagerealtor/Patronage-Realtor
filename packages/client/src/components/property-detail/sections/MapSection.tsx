import { MapPin } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

/** Validates and returns embed URL only if it contains google.com/maps. Prevents invalid URLs. */
function buildGoogleEmbedUrl(rawLink?: string | null): string | null {
  if (rawLink == null || typeof rawLink !== "string") return null;
  const link = rawLink.trim();
  if (!link) return null;
  if (!link.includes("google.com/maps")) return null;
  return link;
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
            <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-12 w-12" />
              <p className="text-sm font-medium">Location Map Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
