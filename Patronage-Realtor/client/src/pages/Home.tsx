import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { PropertySearch } from "@/components/home/PropertySearch";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Interiors } from "@/components/home/Interiors";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Chatbot } from "@/components/shared/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedProperties />
        <PropertySearch />
        <Interiors />
        <WhyChooseUs />
        <AboutPreview />
        <ContactCTA />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
