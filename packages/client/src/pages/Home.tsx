import { useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Reels } from "@/components/home/Reels";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { PropertySearch } from "@/components/home/PropertySearch";
import { Interiors } from "@/components/home/Interiors";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Chatbot } from "@/components/shared/Chatbot";
import { useProperties } from "@/hooks/use-properties";
import type { PropertyRow } from "@/lib/supabase";

function deriveFilterOptions(properties: PropertyRow[]) {
  const statuses = [...new Set(properties.map((p) => p.status).filter(Boolean))].sort();
  const locations = [...new Set(properties.map((p) => (p.location ?? "").trim()).filter(Boolean))].sort();
  const bhkTypes = [...new Set(properties.map((p) => p.bhk_type).filter((v): v is string => v != null && v !== ""))].sort();
  const propertyTypes = [...new Set(properties.map((p) => p.property_type).filter((v): v is string => v != null && v !== ""))].sort();
  return { statuses, locations, bhkTypes, propertyTypes };
}

export default function Home() {
  const { properties } = useProperties();
  const filterOptions = useMemo(() => deriveFilterOptions(properties), [properties]);

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to the element
    if (window.location.hash === "#featured-properties") {
      const element = document.getElementById("featured-properties");
      if (element) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        <Hero />
        <Reels />
        <WhyChooseUs />
        <FeaturedProperties />
        <PropertySearch filterOptions={filterOptions} />
        <Interiors />
        <AboutPreview />
        <ContactCTA />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
