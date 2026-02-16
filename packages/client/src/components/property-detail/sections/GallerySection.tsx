import { LayoutGrid } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type GallerySectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

const GALLERY_SLOTS = 6;

function imageList(data: PropertyDetailData): string[] {
  return data.images ?? [];
}

export function GallerySection({ data, sectionRef }: GallerySectionProps) {
  const images = imageList(data);

  return (
    <section
      ref={sectionRef}
      data-section="Gallery"
      className="scroll-mt-24"
    >
      <h2 className="font-heading text-xl font-semibold">Gallery</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
        {Array.from({ length: GALLERY_SLOTS }, (_, i) => {
          const src = images[i];
          return (
            <div
              key={i}
              className="aspect-square rounded-lg border border-border bg-muted"
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
