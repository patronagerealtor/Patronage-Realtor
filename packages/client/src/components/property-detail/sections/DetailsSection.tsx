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

function formatValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") return String(value);
  return value;
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            {/* ROW 1 */}
            <div>
              <p className="text-sm text-muted-foreground">BHK Type</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.bhkType ?? bhkRange)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.beds)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carpet Area</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.sqft ?? carpetRange)}
              </p>
            </div>

            {/* ROW 2 */}
            <div>
              <p className="text-sm text-muted-foreground">Developer</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.developer)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.propertyType)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Construction Status</p>
              <p className="text-lg font-semibold text-foreground">
                {formatValue(data.status)}
              </p>
            </div>
          </div>

          {/* ROW 3: Possession By full width */}
          <div className="mt-10">
            <p className="text-sm text-muted-foreground">Possession By</p>
            <p className="text-lg font-semibold text-foreground">
              {data.possessionBy
                ? new Date(data.possessionBy).toLocaleDateString?.() || data.possessionBy
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
