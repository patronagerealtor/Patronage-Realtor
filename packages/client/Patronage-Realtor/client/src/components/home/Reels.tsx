import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const REELS = [
  {
    id: 1,
    topLine1: "3 BHK",
    topLine2: "1415 sqft",
    projectName: "The Canary",
    config: "2 to 4 BHK",
    price: "₹98.82 Lakh",
    location: "Balewadi, Pune",
    exclusive: false,
    videoSrc: "/Hero/webinar-bg.mp4",
  },
  {
    id: 2,
    topLine1: "3 BHK",
    topLine2: "1413 sqft",
    projectName: "Premium Residences",
    config: "3 BHK",
    price: "₹1.2 Cr",
    location: "Balewadi, Pune",
    exclusive: false,
    videoSrc: "/Hero/webinar-bg.mp4",
  },
  {
    id: 3,
    topLine1: "5 BHK",
    topLine2: "Luxury Tour",
    projectName: "The Canary, Pune",
    config: "2 to 4 BHK",
    price: "₹98.82 Lakh",
    location: "Balewadi, Pune",
    exclusive: false,
    videoSrc: "/Hero/webinar-bg.mp4",
  },
  {
    id: 4,
    topLine1: "4 BHK",
    topLine2: "1085 Sq. Ft.",
    projectName: "City View Apartments",
    config: "4 BHK",
    price: "₹2.75 Cr",
    location: "Balewadi, Pune",
    exclusive: false,
    videoSrc: "/Hero/webinar-bg.mp4",
  },
  {
    id: 5,
    topLine1: "4 BHK",
    topLine2: "Exclusive",
    projectName: "Signature Towers",
    config: "Starting at ₹2.73 Cr",
    price: "₹2.73 Cr",
    location: "Balewadi, Pune",
    exclusive: true,
    videoSrc: "/Hero/webinar-bg.mp4",
  },
];

const FEATURED_INDEX = 2;

function useDebounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fnRef.current(...args), ms);
    },
    [ms]
  ) as T;
}

export function Reels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [centeredIndex, setCenteredIndex] = useState(FEATURED_INDEX);

  const scrollToCenterIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetScroll = cardCenter - container.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
    setCenteredIndex(index);
  }, []);

  const snapToClosest = useCallback(() => {
    const container = containerRef.current;
    if (!container || cardRefs.current.length === 0) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    const card = cardRefs.current[closestIndex];
    if (!card) return;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetScroll = cardCenter - container.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
    setCenteredIndex(closestIndex);
  }, []);

  const debouncedSnap = useDebounce(snapToClosest, 120);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => debouncedSnap();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [debouncedSnap]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const id = setTimeout(() => scrollToCenterIndex(FEATURED_INDEX), 50);
    return () => clearTimeout(id);
  }, [scrollToCenterIndex]);

  const visibilityRef = useRef<number[]>([]);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (videos.length === 0) return;
    visibilityRef.current = new Array(videos.length).fill(0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = videoRefs.current.indexOf(
            entry.target as HTMLVideoElement
          );
          if (index >= 0)
            visibilityRef.current[index] = entry.intersectionRatio;
        });
        const ratios = visibilityRef.current;
        let bestIndex = -1;
        let bestRatio = 0.6;
        ratios.forEach((r, i) => {
          if (r >= bestRatio) {
            bestRatio = r;
            bestIndex = i;
          }
        });
        videos.forEach((v, i) => {
          if (!v) return;
          if (i === bestIndex) {
            v.play().catch(() => {});
          } else {
            v.pause();
            v.currentTime = 0;
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    videos.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-16 md:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
          See It to Believe It
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          See every detail, every view, and every space through our Instagram
          reels
        </p>
      </div>

      <div className="relative">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory flex justify-center gap-4 md:gap-6 px-4 py-6"
      >
        {REELS.map((reel, index) => {
          const isCenter = index === centeredIndex;
          const distance = Math.abs(index - centeredIndex);
          const scale =
            distance === 0 ? 1.05 : distance === 1 ? 0.92 : 0.82;
          const zIndex = 10 - distance;
          const wClass = isCenter
            ? "w-[260px] md:w-[320px]"
            : "w-[200px] md:w-[240px]";
          return (
            <div
              key={reel.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`flex-shrink-0 snap-center ${wClass} flex justify-center items-center`}
            >
              <div
                className="relative w-full aspect-[9/16] max-h-[400px] md:max-h-[460px] rounded-2xl overflow-hidden bg-muted border border-border shadow-lg transition-transform duration-300 ease-out origin-center"
                style={{
                  transform: `scale(${scale})`,
                  zIndex,
                }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={reel.videoSrc}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute top-0 left-0 right-0 p-4 text-white"
                  style={{
                    textShadow:
                      "0 1px 2px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,1)",
                  }}
                >
                  <p className="text-xl md:text-2xl font-heading font-bold leading-tight">
                    {reel.topLine1}
                  </p>
                  <p className="text-lg md:text-xl font-heading font-bold leading-tight">
                    {reel.topLine2}
                  </p>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  {reel.exclusive && (
                    <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      EXCLUSIVE
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
                  <p className="text-sm font-heading font-bold">{reel.projectName}</p>
                  <p className="text-xs text-white/90">{reel.config}</p>
                  <p className="text-sm font-semibold mt-1">{reel.price}</p>
                  <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>{reel.location}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <nav
        className="flex justify-center items-center gap-4 md:gap-6 mt-6 px-4"
        aria-label="Reels navigation"
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shrink-0"
          onClick={() =>
            scrollToCenterIndex((centeredIndex - 1 + REELS.length) % REELS.length)
          }
          aria-label="Previous reel"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 md:gap-3">
        {REELS.map((_, index) => {
          const distance = Math.abs(index - centeredIndex);
          const isCenter = index === centeredIndex;
          const widthClass = isCenter
            ? "w-8 md:w-10 h-2 md:h-2.5"
            : distance === 1
              ? "w-5 md:w-6 h-2"
              : "w-3 md:w-4 h-2";
          return (
            <button
              key={index}
              type="button"
              onClick={() => scrollToCenterIndex(index)}
              className={`rounded-full transition-all duration-300 ease-out flex-shrink-0 ${
                isCenter
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              } ${widthClass}`}
              aria-label={`Go to reel ${index + 1}`}
              aria-current={isCenter ? "true" : undefined}
            />
          );
        })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shrink-0"
          onClick={() =>
            scrollToCenterIndex((centeredIndex + 1) % REELS.length)
          }
          aria-label="Next reel"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
      </div>
    </section>
  );
}
