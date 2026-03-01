import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";

const HERO_BG_IMAGE = "/interiors/Interior Background.png";
const HERO_BG_IMAGE_URL = encodeURI(HERO_BG_IMAGE);
const HERO_SCROLL_MAX = 700;
const SCROLL_THROTTLE_STEP = 16; // ~60fps

export type InteriorsHeroProps = {
  onScrollToSection: (sectionId: string) => void;
};

export function InteriorsHero({ onScrollToSection }: InteriorsHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setTimeout(() => setContentReady(true), 180);
    return () => window.clearTimeout(id);
  }, [mounted]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 text-white"
      aria-label="Hero"
    >
      {/* Background image: full-width, cover, center, scale-105 for cinematic feel */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <img
          src={HERO_BG_IMAGE_URL}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center transition-opacity duration-700 ease-out"
          style={{ opacity: mounted ? 1 : 0 }}
          fetchPriority="high"
        />
      </div>

      {/* Dark gradient overlay: top 65% → bottom 45% black, subtle backdrop blur */}
      <div
        className="absolute inset-0 z-[1] backdrop-blur-[2px] transition-opacity duration-700 ease-out"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.45))",
          opacity: mounted ? 1 : 0,
        }}
        aria-hidden
      />

      {/* Content: relative container, smooth fade-in on load, high contrast for readability */}
      <div
        className="relative z-10 container mx-auto px-4 text-center transition-opacity duration-500 ease-out"
        style={{
          ...heroStyle,
          opacity: contentReady ? heroStyle.opacity : 0,
        }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-heading tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          Design Your Dream
          <br />
          <span className="text-amber-300">Interior</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/95 mb-4 max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          <a href="https://www.instagram.com/patronage_realtor?utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-300/50 hover:decoration-amber-300">Patronage</a>
          {" × "}
          <a href="https://www.instagram.com/soul_and_space_interiorstudio?igsh=MTl5djAwNjRpNWNxcQ==" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-300/50 hover:decoration-amber-300">Soul&Space</a>
        </p>
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          Where creativity meets functionality. Let us bring your vision to
          life with stunning interior designs.
        </p>
        <Button
          size="lg"
          className="rounded-full text-lg px-8 py-4 backdrop-blur-md bg-white/15 border border-white/25 text-white shadow-lg hover:bg-white/25 hover:border-white/35"
          onClick={() => onScrollToSection("packages")}
        >
          Explore Interiors
        </Button>
      </div>
    </section>
  );
}
