import type { PropertyDetailData } from "@/types/propertyDetail";

type DetailsSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

function getBhkRange(data: PropertyDetailData): string | null {
  if (!data.floorPlans || data.floorPlans.length === 0) return null;

  const bhks = data.floorPlans
    .map((fp) => parseInt(fp.bhk.replace(/\D/g, ""), 10))
    .filter(Boolean);

  if (!bhks.length) return null;

  const min = Math.min(...bhks);
  const max = Math.max(...bhks);

  return min === max ? `${min} BHK` : `${min} – ${max} BHK`;
}

function getCarpetRange(data: PropertyDetailData): string | null {
  if (!data.floorPlans || data.floorPlans.length === 0) return null;

  const carpets = data.floorPlans
    .map((fp) => parseInt(fp.carpet.replace(/,/g, ""), 10))
    .filter(Boolean);

  if (!carpets.length) return null;

  const min = Math.min(...carpets);
  const max = Math.max(...carpets);

  return min === max
    ? `${min.toLocaleString()} Sq.Ft`
    : `${min.toLocaleString()} – ${max.toLocaleString()} Sq.Ft`;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function DetailsSection({ data, sectionRef }: DetailsSectionProps) {
  const bhkRange = getBhkRange(data);
  const carpetRange = getCarpetRange(data);

  return (
    <section
      ref={sectionRef}
      data-section="Details"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Details
        </h2>

        <div className="mt-6 border-t border-border pt-6">
          <div className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Configuration */}
            <DetailItem label="BHK Type" value={bhkRange} />
            <DetailItem label="Carpet Area" value={carpetRange} />
            <DetailItem label="Construction Status" value={data.status} />

            {/* Project Info */}
            <DetailItem label="Developer" value={data.developer} />
            <DetailItem label="Property Type" value={data.propertyType} />
            <DetailItem label="Possession By" value={data.possessionBy} />

          </div>
        </div>
      </div>
    </section>
  );
}
