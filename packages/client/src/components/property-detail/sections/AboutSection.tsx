import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type AboutSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

export function AboutSection({ data, sectionRef }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const baseText = data.description?.trim() || "No description provided.";
  const fullText = baseText;

  return (
    <section
      ref={sectionRef}
      data-section="About"
      className="scroll-mt-24"
    >
      <h2 className="font-heading text-xl font-semibold">About</h2>
      <p className="mt-4 text-sm text-muted-foreground">
        {fullText}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-sm font-medium text-primary"
      >
        {expanded ? "See Less" : "See More"}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </section>
  );
}
