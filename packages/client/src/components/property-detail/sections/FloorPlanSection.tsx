import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type FloorPlanSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
  /** Called when user clicks "Request a Floor Plan" (only when no plans). */
  onRequestFloorPlan?: () => void;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function FloorPlanSection({
  data,
  sectionRef,
  onRequestFloorPlan,
}: FloorPlanSectionProps) {
  const plans = data.floorPlans ?? [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index if plans change
  useEffect(() => {
    setSelectedIndex(0);
  }, [plans.length]);

  if (!plans.length) {
    return (
      <section
        ref={sectionRef}
        data-section="Floor Plan"
        className="scroll-mt-24"
      >
        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Floor Plan
          </h2>

          <div className="relative mt-6 w-full overflow-hidden rounded-lg border border-border min-h-[180px] sm:min-h-[240px] md:min-h-[280px]">
            <img
              src="/Hero/FloorPlan Fallback Image.png"
              alt="Floor plan fallback"
              className="h-full min-h-[180px] w-full object-cover sm:min-h-[240px] md:min-h-[280px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <button
                type="button"
                onClick={() => onRequestFloorPlan?.()}
                className="rounded-full bg-background/25 px-5 py-2.5 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 backdrop-blur-md transition-transform duration-200 hover:scale-105 hover:bg-background/30 sm:px-7 sm:py-3 sm:text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_0_1px_rgba(0,0,0,0.8)]"
              >
                Request a Floor Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = plans[selectedIndex];

  return (
    <section
      ref={sectionRef}
      data-section="Floor Plan"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Floor Plan
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {plans.map((plan, index) => (
            <button
              key={`${plan.bhk}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedIndex === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {plan.bhk}
            </button>
          ))}
        </div>

        {/* Image */}
        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
          {current.image ? (
            <img
              src={current.image}
              alt={current.bhk}
              className="h-full w-full object-contain"
            />
          ) : (
            <LayoutGrid className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        {/* Info Row */}
        <div className="mt-6 border-t border-border pt-6">
          <div className="grid gap-y-6 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="BHK Type" value={current.bhk} />
            <DetailItem
              label="Carpet Area"
              value={
                current.carpet
                  ? `${current.carpet} Sq.Ft`
                  : undefined
              }
            />
            <DetailItem label="Base Price" value={current.price} />
          </div>
        </div>
      </div>
    </section>
  );
}
