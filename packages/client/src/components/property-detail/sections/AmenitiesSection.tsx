import {
  Car,
  Dumbbell,
  Radio,
  Waves,
  TreePine,
  Flower2,
  Activity,
  Droplets,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type AmenitiesSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

const LABEL_TO_ICON: Record<string, LucideIcon> = {
  "Car Parking": Car,
  Gym: Dumbbell,
  "Basketball Court": Activity,
  Intercom: Radio,
  "Swimming Pool": Waves,
  Amphitheater: Waves,
  "Meditation Space": Flower2,
  "Landscaped Garden": TreePine,
  "Jogging Track": Activity,
  "Rainwater Harvesting": Droplets,
};

function getIcon(label: string): LucideIcon {
  return LABEL_TO_ICON[label] ?? LayoutGrid;
}

export function AmenitiesSection({
  data,
  sectionRef,
}: AmenitiesSectionProps) {
  const amenities = data.amenities ?? [];

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
            Amenities information is not available.
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

        <div className="mt-8 grid gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {amenities.map((label, index) => {
            const Icon = getIcon(label);

            return (
              <div
                key={`${label}-${index}`}
                className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted/40 transition-colors duration-200 group-hover:border-primary group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 text-foreground transition-colors duration-200 group-hover:text-primary" />
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
