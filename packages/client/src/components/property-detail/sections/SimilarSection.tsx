import { MapPin } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";
import { getDisplayPrice } from "@/lib/formatIndianPrice";

export type SimilarPropertyItem = {
  id: number | string;
  title: string;
  developer?: string;
  location?: string;
  price: string;
  price_value?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  image_url?: string | null;
};

type SimilarSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
  similarProperties: SimilarPropertyItem[];
  onCardClick?: (id: string | number) => void;
};

const MAX_SIMILAR = 4;

function SimilarCard({ p, onClick }: { p: SimilarPropertyItem; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex shrink-0 w-[280px] flex-col rounded-xl border border-border bg-background p-4 text-left transition-shadow duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
    >
      <h3 className="text-base font-semibold tracking-tight line-clamp-2">
        {p.title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-primary">
        {getDisplayPrice(p)}
      </p>
      {(p.location || p.developer) && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {p.location ?? p.developer}
          </span>
        </div>
      )}
    </button>
  );
}

export function SimilarSection({
  sectionRef,
  similarProperties,
  onCardClick,
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
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth md:mt-8">
            {list.map((p) => (
              <SimilarCard
                key={p.id}
                p={p}
                onClick={onCardClick ? () => onCardClick(p.id) : undefined}
              />
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
