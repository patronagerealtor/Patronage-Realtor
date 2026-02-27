import { useEffect, useMemo, useRef, useState } from "react";
import { Scene } from "../ui/hero-section";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

const HERO_SCROLL_MAX = 700;
const SCROLL_THROTTLE_STEP = 16; // ~60fps

export type InteriorsHeroProps = {
  onScrollToSection: (sectionId: string) => void;
};

export function InteriorsHero({ onScrollToSection }: InteriorsHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = Math.min(HERO_SCROLL_MAX, window.scrollY);
        const rounded = Math.floor(y / SCROLL_THROTTLE_STEP) * SCROLL_THROTTLE_STEP;
        if (rounded !== lastScrollRef.current) {
          lastScrollRef.current = rounded;
          setScrollY(rounded);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const heroStyle = useMemo(
    () => ({
      transform: `translateY(${scrollY * 0.3}px)`,
      opacity: Math.max(0, 1 - scrollY / 500),
      willChange: scrollY < 500 ? "transform, opacity" : "auto",
    }),
    [scrollY]
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-[#000] to-[#1A2428] text-white"
    >
      <div className="absolute inset-0">
        <Scene />
      </div>
      <div
        className="relative z-10 container mx-auto px-4 text-center"
        style={heroStyle}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">
          Design Your Dream
          <br />
          <span className="text-amber-300">Interior</span>
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-white/95 mb-4 max-w-2xl mx-auto">
          <a href="#" className="hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-300/50 hover:decoration-amber-300">Patronage</a>
          {" × "}
          <a href="#" className="hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-300/50 hover:decoration-amber-300">SoulSpace</a>
        </p>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Where creativity meets functionality. Let us bring your vision to
          life with stunning interior designs.
        </p>
        <Button
          size="lg"
          className="group text-lg px-8 py-6"
          onClick={() => onScrollToSection("packages")}
        >
          Explore Interiors
          <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}
