import { useMemo, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type MapSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

export function MapSection({ data, sectionRef }: MapSectionProps) {
  const [mapType, setMapType] = useState<"map" | "satellite">("map");

  const lat = data.latitude ?? 18.59530120398497;
  const lng = data.longitude ?? 73.73494132498988;

  const embedUrl = useMemo(() => {
    const base = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    if (mapType === "satellite") {
      return `https://www.google.com/maps?q=${lat},${lng}&z=18&t=k&output=embed`;
    }

    return base;
  }, [mapType, lat, lng]);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

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

        {/* Toggle Buttons */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMapType("map")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              mapType === "map"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Map
          </button>

          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              mapType === "satellite"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Map Frame */}
        <div className="mt-6 aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Directions Button */}
        <div className="mt-6">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
