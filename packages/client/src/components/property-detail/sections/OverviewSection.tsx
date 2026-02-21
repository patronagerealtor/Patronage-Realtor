import { motion } from "framer-motion";
import { MapPin, LayoutGrid, Image as ImageIcon, Home, Ruler, Banknote } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";
import { formatIndianPrice } from "@/lib/formatIndianPrice";

type OverviewSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

function getImages(data: PropertyDetailData): string[] {
  return data.images && data.images.length > 0 ? data.images : [];
}

function getBhkRange(data: PropertyDetailData): string | null {
  if (!data.floorPlans || data.floorPlans.length === 0) return null;

  const bhks = data.floorPlans
    .map((fp) => parseInt(fp.bhk.replace(/\D/g, ""), 10))
    .filter(Boolean);

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
      {/* SINGLE MAIN IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
        <MainImage src={images[0]} />
        {data.reraApplicable && (
          <span className="absolute top-4 right-4 z-10 rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
            ✓ RERA
          </span>
        )}
        {images.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs text-foreground backdrop-blur">
            <ImageIcon className="h-3.5 w-3.5" />
            {images.length}
          </div>
        )}
      </div>

      {/* TOP SECTION: Title + meta left, Price + RERA right */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {data.title}
          </h1>
          {data.developer && (
            <p className="text-sm text-muted-foreground">{data.developer}</p>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{data.address || data.location || "Location"}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 text-right">
          <p className="text-xl font-bold text-primary md:text-2xl">
            {formatIndianPrice(data.price_value ?? data.price)}
          </p>
          {data.reraApplicable && data.reraNumber && (
            <p className="mt-1 text-sm text-muted-foreground">
              RERA: {data.reraNumber}
            </p>
          )}
        </div>
      </div>

      {/* Status badge: above the stripe, below the address */}
      {data.status && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
            {data.status}
          </span>
        </div>
      )}

      {/* INFORMATION STRIP: 3 columns - grey glass morphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-2xl bg-gray-400/25 backdrop-blur-md border border-gray-500/30 shadow-sm p-6 dark:bg-gray-400/35 dark:border-gray-500/50"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y divide-gray-500/30 sm:divide-y-0 sm:divide-x dark:divide-gray-500/40">
          <div className="flex flex-col items-center justify-center gap-2 py-5 sm:py-0 sm:px-6 text-center">
            <Home className="h-6 w-6 text-black dark:text-black" />
            <p className="text-xs font-medium uppercase tracking-wider text-black">
              Configurations
            </p>
            <p className="text-lg font-semibold tracking-tight text-black">
              {data.bhkType ?? bhkRange ?? "—"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-5 sm:py-0 sm:px-6 text-center">
            <Ruler className="h-6 w-6 text-black dark:text-black" />
            <p className="text-xs font-medium uppercase tracking-wider text-black">
              Carpet Area
            </p>
            <p className="text-lg font-semibold tracking-tight text-black">
              {data.sqft ?? carpetRange ?? "—"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-5 sm:py-0 sm:px-6 text-center">
            <Banknote className="h-6 w-6 text-black dark:text-black" />
            <p className="text-xs font-medium uppercase tracking-wider text-black">
              Avg. Price
            </p>
            <p className="text-lg font-semibold tracking-tight text-black">
              {formatIndianPrice(data.price_value ?? data.price)}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}