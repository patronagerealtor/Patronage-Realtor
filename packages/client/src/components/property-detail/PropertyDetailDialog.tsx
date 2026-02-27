import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Pencil, Share2 } from "lucide-react";
import type { PropertyRow } from "@/lib/supabase";
import { insertContactLead } from "@/lib/supabase";
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
import { FloorPlanRequestDialog } from "./sections/FloorPlanRequestDialog";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";


const EMPTY_SIMILAR_PROPERTIES: PropertyRow[] = [];

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
  /** When user clicks a similar property card, call with that property so parent can show it (e.g. update selected property). */
  onSimilarPropertySelect?: (property: PropertyRow | Property) => void;
};

export function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
  onEdit,
  similarProperties = EMPTY_SIMILAR_PROPERTIES,
  onSimilarPropertySelect,
}: PropertyDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const [floorPlanRequestOpen, setFloorPlanRequestOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const data = toPropertyDetailData(property);

  const shareUrl =
    typeof window !== "undefined" && property
      ? (() => {
          const base = window.location.origin;
          const slug = "slug" in property ? property.slug : undefined;
          if (slug?.trim()) return `${base}/properties/${encodeURIComponent(slug.trim())}`;
          return `${base}/properties?property=${encodeURIComponent(String(property.id))}`;
        })()
      : "";
  const shareTitle = data?.title ?? "Property";
  const shareText = [data?.price, data?.location].filter(Boolean).join(" · ") || shareTitle;

  const handleShare = async () => {
    if (!property) return;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({ title: "Shared", description: "Property link shared." });
      } else {
        await navigator.clipboard?.writeText(shareUrl);
        toast({ title: "Link copied", description: "Property link copied to clipboard." });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText(shareUrl);
        toast({ title: "Link copied", description: "Property link copied to clipboard." });
      } catch {
        toast({ title: "Share failed", description: "Could not share or copy link.", variant: "destructive" });
      }
    }
  };
 

  const similarList: SimilarPropertyItem[] = similarProperties.map((p) => ({
    id: p.id,
    title: p.title,
    developer: p.developer,
    location: p.location,
    price: p.price,
    price_value: p.price_value,
    price_min: p.price_min,
    price_max: p.price_max,
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

  const propertyId = property ? String(property.id) : "";
  const propertyTitle = (data?.title ?? (property && "title" in property ? (property as { title?: string }).title : "") ?? "").trim() || "Property";

  const handleContactSubmit = async (payload: { name: string; email: string; phone: string }) => {
    if (!property) return;
    const result = await insertContactLead({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      property_id: propertyId,
      property_title: propertyTitle,
    });
    if (result.success) {
      toast({ title: "Submitted", description: "We'll get back to you soon." });
    } else {
      toast({ title: "Failed to submit", description: result.error, variant: "destructive" });
    }
  };

  const handleFloorPlanRequest = async (payload: { name: string; email: string; whatsapp: string }) => {
    if (!property) return false;
    const result = await insertContactLead({
      name: payload.name,
      email: payload.email,
      phone: payload.whatsapp,
      property_id: propertyId,
      property_title: propertyTitle,
      lead_type: "floorplan_request",
    });
    if (result.success) {
      toast({ title: "Request sent", description: "We'll get back to you soon." });
      return true;
    }
    toast({ title: "Failed to send", description: result.error, variant: "destructive" });
    return false;
  };

  if (!open) return null;

  const content = (
    <>
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
        {property && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0 gap-2"
            onClick={handleShare}
            aria-label="Share property"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
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

      <div className="flex flex-1 min-h-0 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-w-0">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="flex gap-8 lg:gap-10">
                <main className="min-w-0 flex-1 space-y-12 pb-8 lg:max-w-[80rem]">
                  <OverviewSection data={data} sectionRef={setSectionRef("Overview")} />
                  <DetailsSection data={data} sectionRef={setSectionRef("Details")} />
                  <AboutSection data={data} sectionRef={setSectionRef("About")} />
                  <FloorPlanSection
                    data={data}
                    sectionRef={setSectionRef("Floor Plan")}
                    onRequestFloorPlan={() => setFloorPlanRequestOpen(true)}
                  />
                  <AmenitiesSection data={data} sectionRef={setSectionRef("Amenities")} />
                  <GallerySection data={data} sectionRef={setSectionRef("Gallery")} />
                </main>
                <aside className="hidden lg:block w-[22rem] shrink-0">
                  <div className="sticky top-1">
                    <ContactCard onSubmit={handleContactSubmit} />
                  </div>
                </aside>
              </div>
              <MapSection data={data} sectionRef={setSectionRef("Map")} />
              <SimilarSection
                data={data}
                sectionRef={setSectionRef("Similar Properties")}
                similarProperties={similarList}
                onCardClick={
                  onSimilarPropertySelect
                    ? (id) => {
                        const p = similarProperties.find((x) => String(x.id) === String(id));
                        if (p) onSimilarPropertySelect(p);
                      }
                    : undefined
                }
              />
            </div>
            <aside className="mt-8 lg:hidden">
              <ContactCard onSubmit={handleContactSubmit} />
            </aside>
          </div>
        </div>
      </div>
    </div>

    <FloorPlanRequestDialog
      open={floorPlanRequestOpen}
      onOpenChange={setFloorPlanRequestOpen}
      propertyId={property ? String(property.id) : ""}
      propertyTitle={data?.title ?? (property && "title" in property ? String((property as { title?: string }).title ?? "") : "") ?? "Property"}
    />
    </>
  );

  return createPortal(content, document.body);
}
