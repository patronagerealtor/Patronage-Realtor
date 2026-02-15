import { useEffect } from "react";
<<<<<<< HEAD:Patronage-Realtor/client/src/pages/Home.tsx
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
=======
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/home/Hero";
import { Reels } from "../components/home/Reels";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { FeaturedProperties } from "../components/home/FeaturedProperties";
import { PropertySearch } from "../components/home/PropertySearch";
import { Interiors } from "../components/home/Interiors";
import { AboutPreview } from "../components/home/AboutPreview";
import { ContactCTA } from "../components/home/ContactCTA";
import { Chatbot } from "../components/shared/Chatbot";
>>>>>>> cursor/project-run-configuration-d59a:packages/client/src/pages/Home.tsx

export default function Home() {
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
        <PropertySearch />
        <Interiors />
        <AboutPreview />
        <ContactCTA />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
