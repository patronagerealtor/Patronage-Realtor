import { MapPin, LayoutGrid, Image as ImageIcon } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type OverviewSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

function getImages(data: PropertyDetailData): string[] {
  return data.images && data.images.length > 0 ? data.images : [];
}

function getBhkRange(data: PropertyDetailData): string | null {
  if (!data.floorPlans || data.floorPlans.length === 0) return null;

  const bhks = data.floorPlans.map((fp) =>
    parseInt(fp.bhk.replace(/\D/g, ""), 10)
  ).filter(Boolean);

  if (bhks.length === 0) return null;

  const min = Math.min(...bhks);
  const max = Math.max(...bhks);

  return min === max ? `${min} BHK` : `${min}–${max} BHK`;
}

function getCarpetRange(data: PropertyDetailData): string | null {
  if (!data.floorPlans || data.floorPlans.length === 0) return null;

  const carpets = data.floorPlans
    .map((fp) => parseInt(fp.carpet.replace(/,/g, ""), 10))
    .filter(Boolean);

  if (carpets.length === 0) return null;

  const min = Math.min(...carpets);
  const max = Math.max(...carpets);

  return min === max
    ? `${min} sq.ft`
    : `${min.toLocaleString()}–${max.toLocaleString()} sq.ft`;
}

function MainImage({ src }: { src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
      <LayoutGrid className="h-12 w-12" />
    </div>
  );
}

function SideImage({ src }: { src?: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <LayoutGrid className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export function OverviewSection({ data, sectionRef }: OverviewSectionProps) {
  const images = getImages(data);
  const bhkRange = getBhkRange(data);
  const carpetRange = getCarpetRange(data);

  return (
    <section
      ref={sectionRef}
      data-section="Overview"
      className="scroll-mt-24 space-y-6"
    >
      {/* IMAGE GRID */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border md:col-span-2">
          <MainImage src={images[0]} />

          {images.length > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs text-foreground backdrop-blur">
              <ImageIcon className="h-3.5 w-3.5" />
              {images.length}
            </div>
          )}

          <span className="absolute bottom-3 left-3 rounded border border-border bg-background/90 px-2 py-1 text-xs text-foreground backdrop-blur">
            Artist&apos;s impression
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <SideImage src={images[1]} />
          <SideImage src={images[2]} />
        </div>
      </div>

      {/* PROPERTY META */}
      <div className="space-y-3">
        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
          {data.title}
        </h1>

        {data.developer && (
          <p className="text-sm text-muted-foreground">{data.developer}</p>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{data.location ?? "Location"}</span>
        </div>

        {/* Price */}
        <p className="text-lg font-semibold text-primary">
          {data.price ?? "Price on request"}
        </p>

        {/* Dynamic Summary Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          {bhkRange && (
            <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-secondary-foreground">
              {bhkRange}
            </span>
          )}

          {carpetRange && (
            <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-secondary-foreground">
              {carpetRange}
            </span>
          )}

          {data.status && (
            <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-secondary-foreground">
              {data.status}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
