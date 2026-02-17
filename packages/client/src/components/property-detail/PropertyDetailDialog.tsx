import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import type { PropertyRow } from "@/lib/supabase";
import type { Property } from "@/lib/propertyStore";
import { toPropertyDetailData } from "./propertyDetailUtils";
import { OverviewSection } from "./sections/OverviewSection";
import { DetailsSection } from "./sections/DetailsSection";
import { AboutSection } from "./sections/AboutSection";
import { FloorPlanSection } from "./sections/FloorPlanSection";
import { AmenitiesSection } from "./sections/AmenitiesSection";
import { GallerySection } from "./sections/GallerySection";
import { MapSection } from "./sections/MapSection";
import { SimilarSection, type SimilarPropertyItem } from "./sections/SimilarSection";
import { ContactCard } from "./sections/ContactCard";
import { supabase } from "@/lib/supabase";


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

export type PropertyDetailDialogProps = {
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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const data = toPropertyDetailData(property);
 

  const similarList: SimilarPropertyItem[] = similarProperties.map((p) => ({
    id: p.id,
    title: p.title,
    developer: p.developer,
    location: p.location,
    price: p.price,
    image_url: p.image_url,
  }));

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

  const setSectionRef = (key: (typeof TABS)[number]) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
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
            <OverviewSection data={data} sectionRef={setSectionRef("Overview")} />
            <DetailsSection data={data} sectionRef={setSectionRef("Details")} />
            <AboutSection data={data} sectionRef={setSectionRef("About")} />
            <FloorPlanSection data={data} sectionRef={setSectionRef("Floor Plan")} />
            <AmenitiesSection data={data} sectionRef={setSectionRef("Amenities")} />
            <GallerySection data={data} sectionRef={setSectionRef("Gallery")} />
            <MapSection data={data} sectionRef={setSectionRef("Map")} />
            <SimilarSection
              data={data}
              sectionRef={setSectionRef("Similar Properties")}
              similarProperties={similarList}
            />
          </main>

          <aside className="mt-8 lg:mt-0 lg:w-80 lg:shrink-0">
            <ContactCard />
          </aside>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
