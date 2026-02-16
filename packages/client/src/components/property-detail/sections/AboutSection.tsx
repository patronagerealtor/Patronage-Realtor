import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";

type AboutSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
};

const FALLBACK_DESCRIPTION =
  "This premium project offers thoughtfully designed homes with modern amenities. The development is strategically located with easy access to IT parks, schools, and healthcare. Each unit is crafted to maximize space and natural light, with high-quality finishes and sustainable building practices.";

const EXPANDED_SUFFIX =
  " The project includes a clubhouse, children's play area, and 24/7 security. Green building certification ensures sustainable living.";

export function AboutSection({ data, sectionRef }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const baseText = data.description?.trim() || FALLBACK_DESCRIPTION;
  const fullText = expanded ? baseText + EXPANDED_SUFFIX : baseText;

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
