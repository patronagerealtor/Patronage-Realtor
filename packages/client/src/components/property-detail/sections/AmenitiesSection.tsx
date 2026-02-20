import { LayoutGrid } from "lucide-react";
import { AmenityIcon } from "@/components/shared/AmenityIcon";
import type { PropertyDetailData } from "@/types/propertyDetail";

type AmenitiesSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

export function AmenitiesSection({
  data,
  sectionRef,
}: AmenitiesSectionProps) {
  const amenities = data.amenities?.length ? data.amenities : [];

  if (!amenities.length) {
    return (
      <section
        ref={sectionRef}
        data-section="Amenities"
        className="scroll-mt-24"
      >
        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Amenities
          </h2>

          <div className="mt-6 flex items-center justify-center rounded-lg border border-border bg-muted p-10">
            <LayoutGrid className="h-10 w-10 text-muted-foreground" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No amenities added.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-section="Amenities"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Amenities
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-10 text-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.amenities?.map((amenity) => (
            <div
              key={amenity.id}
              className="group flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105"
            >
              <AmenityIcon
                name={amenity.icon}
                className="h-10 w-10 text-primary"
              />
              <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {amenity.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
