import { LayoutGrid, MapPin } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

export type SimilarPropertyItem = {
  id: number | string;
  title: string;
  developer?: string;
  location?: string;
  price: string;
  image_url?: string | null;
};

type SimilarSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
  similarProperties: SimilarPropertyItem[];
};

const MAX_SIMILAR = 4;

function SimilarCard({ p }: { p: SimilarPropertyItem }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-shadow duration-200 hover:shadow-md">
      
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold tracking-tight line-clamp-1">
          {p.title}
        </h3>

        {(p.location || p.developer) && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {p.location ?? p.developer}
            </span>
          </div>
        )}

        <p className="text-sm font-semibold text-primary">
          {p.price}
        </p>
      </div>
    </div>
  );
}

export function SimilarSection({
  sectionRef,
  similarProperties,
}: SimilarSectionProps) {
  const list = similarProperties.slice(0, MAX_SIMILAR);

  return (
    <section
      ref={sectionRef}
      data-section="Similar Properties"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Similar Properties
        </h2>

        {list.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {list.map((p) => (
              <SimilarCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            No similar properties available.
          </p>
        )}
      </div>
    </section>
  );
}
