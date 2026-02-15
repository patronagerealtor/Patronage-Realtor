import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  Building2,
  Car,
  Dumbbell,
  Radio,
  Waves,
  TreePine,
  Flower2,
  Activity,
  Droplets,
  ArrowLeft,
  ChevronDown,
  LayoutGrid,
  Pencil,
} from "lucide-react";
import type { PropertyRow } from "@/lib/supabase";
import type { Property } from "@/lib/propertyStore";

const TABS = [
  "Overview",
  "Details",
  "About",
  "Floor Plan",
  "Amenities",
  "Gallery",
  "Map",
  "Similar Properties",
] as const;

const AMENITIES = [
  { label: "Car Parking", icon: Car },
  { label: "Gym", icon: Dumbbell },
  { label: "Basketball Court", icon: Activity },
  { label: "Intercom", icon: Radio },
  { label: "Swimming Pool", icon: Waves },
  { label: "Amphitheater", icon: Waves },
  { label: "Meditation Space", icon: Flower2 },
  { label: "Landscaped Garden", icon: TreePine },
  { label: "Jogging Track", icon: Activity },
  { label: "Rainwater Harvesting", icon: Droplets },
];

const FLOOR_PLANS = [
  { bhk: "1 BHK", carpet: "450", price: "₹42 Lac" },
  { bhk: "2 BHK", carpet: "720", price: "₹65 Lac" },
  { bhk: "3 BHK", carpet: "1,100", price: "₹98 Lac" },
];

type PropertyDetailDialogProps = {
  property: PropertyRow | Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (id: string) => void;
  similarProperties?: PropertyRow[];
};

export function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
  onEdit,
  similarProperties = [],
}: PropertyDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [floorPlanTab, setFloorPlanTab] = useState(0);
  const [mapToggle, setMapToggle] = useState<"map" | "satellite">("map");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const data = property
    ? {
        title: property.title,
        developer: property.developer ?? "Developer",
        location: property.location || "Location",
        price: property.price,
        bhk: `${property.beds} BHK`,
        carpet: property.sqft,
        status: property.status,
        propertyType: property.property_type ?? "Apartment",
        possessionBy: "Dec 2026",
        imageList:
          property.images && property.images.length > 0
            ? property.images
            : property.image_url
              ? [property.image_url]
              : [],
      }
    : {
        title: "Sunrise Residency",
        developer: "ABC Developers",
        location: "Hinjewadi, Pune",
        price: "Price on request",
        bhk: "2 BHK",
        carpet: "850",
        status: "Under Construction",
        propertyType: "Apartment",
        possessionBy: "Dec 2026",
        imageList: [] as string[],
      };

  const aboutText =
    "This premium project offers thoughtfully designed homes with modern amenities. The development is strategically located with easy access to IT parks, schools, and healthcare. Each unit is crafted to maximize space and natural light, with high-quality finishes and sustainable building practices.";

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    const el = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("data-section");
          if (id && TABS.includes(id as (typeof TABS)[number]))
            setActiveTab(id as (typeof TABS)[number]);
        });
      },
      { root: el, rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    TABS.forEach((t) => {
      const node = sectionRefs.current[t];
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [open]);

  const scrollToSection = (tab: (typeof TABS)[number]) => {
    setActiveTab(tab);
    sectionRefs.current[tab]?.scrollIntoView({ behavior: "smooth" });
  };

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
          aria-label="Close"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {onEdit && property && (
          <button
            type="button"
            onClick={() => onEdit(String(property.id))}
            className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => scrollToSection(tab)}
              className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <div ref={scrollRef} className="flex flex-1 overflow-y-auto">
        <div className="flex-1 px-4 py-6 md:px-6 lg:flex lg:gap-8">
          <main className="min-w-0 flex-1 space-y-12 pb-8">
            <section
              ref={(r) => {
                sectionRefs.current["Overview"] = r;
              }}
              data-section="Overview"
              className="scroll-mt-24"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border md:col-span-2">
                  {data.imageList[0] ? (
                    <img
                      src={data.imageList[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <LayoutGrid className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 rounded border border-border bg-background/90 px-2 py-1 text-xs text-foreground">
                    Artist&apos;s impression
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {[1, 2].map((i) =>
                    data.imageList[i] ? (
                      <div
                        key={i}
                        className="relative aspect-video overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={data.imageList[i]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="flex aspect-video items-center justify-center rounded-lg border border-border bg-muted"
                      >
                        <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  {data.title}
                </h1>
                {data.developer && (
                  <p className="text-sm text-muted-foreground">{data.developer}</p>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{data.location}</span>
                </div>
                <p className="font-semibold text-primary">{data.price}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                    Configurations
                  </span>
                  <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                    Carpet Area
                  </span>
                  <span className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                    Avg Price
                  </span>
                </div>
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Details"] = r;
              }}
              data-section="Details"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">Details</h2>
              <div className="mt-4 grid gap-0 border border-border rounded-lg overflow-hidden sm:grid-cols-2">
                {[
                  { label: "BHK Type", value: data.bhk },
                  { label: "Carpet Area", value: `${data.carpet} sq.ft` },
                  { label: "Developer", value: data.developer },
                  { label: "Property Type", value: data.propertyType },
                  { label: "Construction Status", value: data.status },
                  { label: "Possession By", value: data.possessionBy },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex justify-between border-border px-4 py-3 ${
                      i % 2 === 1 ? "border-l sm:border-l" : ""
                    } ${i >= 2 ? "border-t" : ""}`}
                  >
                    <span className="text-sm text-muted-foreground">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["About"] = r;
              }}
              data-section="About"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">About</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {aboutText}
                {aboutExpanded &&
                  " The project includes a clubhouse, children's play area, and 24/7 security. Green building certification ensures sustainable living."}
              </p>
              <button
                type="button"
                onClick={() => setAboutExpanded(!aboutExpanded)}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary"
              >
                {aboutExpanded ? "See Less" : "See More"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${aboutExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Floor Plan"] = r;
              }}
              data-section="Floor Plan"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">Floor Plan</h2>
              <div className="mt-4 flex gap-2 border-b border-border">
                {FLOOR_PLANS.map((fp, i) => (
                  <button
                    key={fp.bhk}
                    type="button"
                    onClick={() => setFloorPlanTab(i)}
                    className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                      floorPlanTab === i
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {fp.bhk}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-lg border border-border bg-muted">
                <LayoutGrid className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="mt-4 rounded-lg border border-border p-4">
                <div className="flex flex-wrap justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">BHK Type</span>
                  <span className="font-medium">
                    {FLOOR_PLANS[floorPlanTab].bhk}
                  </span>
                  <span className="text-muted-foreground">Carpet Area</span>
                  <span className="font-medium">
                    {FLOOR_PLANS[floorPlanTab].carpet} sq.ft
                  </span>
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">
                    {FLOOR_PLANS[floorPlanTab].price}
                  </span>
                </div>
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Amenities"] = r;
              }}
              data-section="Amenities"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {AMENITIES.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border p-4"
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                    <span className="text-center text-xs text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Gallery"] = r;
              }}
              data-section="Gallery"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-border bg-muted"
                  >
                    {data.imageList[i - 1] ? (
                      <img
                        src={data.imageList[i - 1]}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Map"] = r;
              }}
              data-section="Map"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">
                Map & Neighborhood
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.location}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMapToggle("map")}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                    mapToggle === "map"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapToggle("satellite")}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                    mapToggle === "satellite"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Satellite
                </button>
              </div>
              <div className="mt-4 aspect-video rounded-lg border border-border bg-muted flex items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
            </section>

            <section
              ref={(r) => {
                sectionRefs.current["Similar Properties"] = r;
              }}
              data-section="Similar Properties"
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl font-semibold">
                Similar Properties
              </h2>
              <div className="mt-4 space-y-3">
                {(similarProperties.length > 0
                  ? similarProperties.slice(0, 4)
                  : []
                ).map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.developer ?? p.location}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {p.price}
                      </p>
                    </div>
                  </div>
                ))}
                {similarProperties.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No similar properties to show.
                  </p>
                )}
              </div>
            </section>
          </main>

          <aside className="mt-8 lg:mt-0 lg:w-80 lg:shrink-0">
            <div className="sticky top-24 rounded-lg border border-border bg-background p-6">
              <h3 className="font-heading text-lg font-semibold">
                Contact Us
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get in touch for site visits and pricing details.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-mobile"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Mobile
                  </label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    placeholder="Your number"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md border border-primary bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Submit
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
