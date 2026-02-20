import { LayoutGrid } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type GallerySectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

const GALLERY_SLOTS = 4;

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

      <div className="mt-4 grid grid-cols-7 grid-rows-1 gap-2">
        {/* Image 1 */}
        <div className="col-span-4 row-span-1 rounded-lg border border-border bg-muted overflow-hidden">
          {images[0] ? (
            <img
              src={images[0]}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Image 2 */}
        <div className="col-span-3 row-span-1 col-start-5 rounded-lg border border-border bg-muted overflow-hidden">
          {images[1] ? (
            <img
              src={images[1]}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Image 3 */}
        <div className="col-span-3 row-span-1 row-start-3 rounded-lg border border-border bg-muted overflow-hidden">
          {images[2] ? (
            <img
              src={images[2]}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Image 4 */}
        <div className="col-span-4 row-span-1 col-start-4 row-start-3 rounded-lg border border-border bg-muted overflow-hidden">
          {images[3] ? (
            <img
              src={images[3]}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}