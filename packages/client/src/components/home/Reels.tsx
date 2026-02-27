"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Play,
  Pause,
  VolumeX,
  Volume2,
} from "lucide-react";
import { getReelPublicUrl } from "@/lib/supabase";

/** File path in Supabase Storage bucket `reels` (e.g. canary.mp4). */
const REELS = [
  {
    id: 1,
    projectName: "Ram Smruti",
    config: "4 BHK",
    location: "Aundh, Pune",
    instagramUrl: "https://www.instagram.com/reel/DUiOYhEjJYv/?igsh=MTgxZjVzcWwzZmZzMA==",
    videoPath: "canary.mp4" as const,
  },
  {
    id: 2,
    projectName: "Premium Residences",
    config: "3 BHK",
    price: "₹1.2 Cr",
    location: "Baner, Pune",
    instagramUrl: "https://www.instagram.com/reel/DC9bKzZPkdq/",
    videoPath: "premium.mp4" as const,
  },
  {
    id: 3,
    projectName: "Luxury Tour",
    config: "5 BHK",
    price: "₹3.5 Cr",
    location: "Koregaon Park",
    instagramUrl: "https://www.instagram.com/reel/DC9bKzZPkdq/",
    videoPath: "luxury.mp4" as const,
  },
] as const;

const AUTO_ROTATE_MS = 5000;
const INITIAL_INDEX = 1;
const CARD_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 30 };

function shouldLoad(index: number, active: number) {
  return Math.abs(index - active) <= 1;
}

const DRAG_THRESHOLD_PX = 5;

export function Reels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const didDragRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState<number[]>([]);
  const [showIcon, setShowIcon] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  /* init arrays */
  useEffect(() => {
    setProgress(new Array(REELS.length).fill(0));
    setIsPlaying(new Array(REELS.length).fill(false));
  }, []);

  /* center active card */
  useEffect(() => {
    const container = containerRef.current;
    const target = itemsRef.current[activeIndex];
    if (!container || !target) return;

    container.scrollTo({
      left:
        target.offsetLeft -
        container.offsetWidth / 2 +
        target.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  /* autoplay rotation */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % REELS.length),
      AUTO_ROTATE_MS
    );
    return () => clearInterval(id);
  }, [paused]);

  /* pause non-active reels when switching; active reel stays paused until user taps play */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i !== activeIndex) {
        video.pause();
        setIsPlaying((s) => {
          const n = [...s];
          n[i] = false;
          return n;
        });
      }
    });
  }, [activeIndex]);

  const handleTimeUpdate = (index: number) => {
    const video = videoRefs.current[index];
    if (!video || !video.duration) return;

    setProgress((p) => {
      const next = [...p];
      next[index] = (video.currentTime / video.duration) * 100;
      return next;
    });
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((s) => {
        const n = [...s];
        n[index] = true;
        return n;
      });
    } else {
      video.pause();
      setIsPlaying((s) => {
        const n = [...s];
        n[index] = false;
        return n;
      });
    }

    setShowIcon(index);
    setTimeout(() => setShowIcon(null), 600);
  };

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % REELS.length),
    []
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i === 0 ? REELS.length - 1 : i - 1)),
    []
  );

  /* drag: compute active index from current scroll position */
  const syncActiveIndexFromScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      const itemCenter = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(center - itemCenter);
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  const getClientX = (e: MouseEvent | TouchEvent) =>
    "touches" in e ? e.touches[0].clientX : e.clientX;

  const handlePointerDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      dragStartX.current = x;
      dragStartScrollLeft.current = container.scrollLeft;
      didDragRef.current = false;
      setIsDragging(true);

      const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const cx = getClientX(moveEvent);
        const dx = dragStartX.current - cx;
        container.scrollLeft = dragStartScrollLeft.current + dx;
      };

      const onUp = (upEvent: MouseEvent | TouchEvent) => {
        const cx = getClientX(upEvent);
        const moved = Math.abs(cx - dragStartX.current);
        if (moved >= DRAG_THRESHOLD_PX) {
          didDragRef.current = true;
          syncActiveIndexFromScroll();
        }
        setIsDragging(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onUp);
      };

      const onTouchMove = (moveEvent: TouchEvent) => {
        moveEvent.preventDefault();
        onMove(moveEvent);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onUp);
    },
    [syncActiveIndexFromScroll]
  );

  const handleCardClick = useCallback((index: number) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    setActiveIndex(index);
  }, []);

  return (
    <section
      className="w-full py-16 bg-background overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="shrink-0 border-0 shadow-md hover:shadow-lg h-[533px] md:h-[604px] w-12 rounded-xl bg-background"
          aria-label="Previous reel"
        >
          <ChevronLeft className="size-6" />
        </Button>
       
        <Button
         variant="ghost"
         size="icon"
         onClick={next}
         aria-label="Next reel"
         className=" absolute right-0 top-1/2 -translate-y-1/2 shrink-0 border-0 shadow-md hover:shadow-lg h-[533px] md:h-[604px] w-12 rounded-l-xl bg-background"
        >
           <ChevronRight className="size-6" />
        </Button>

        <div
          ref={containerRef}
          className="flex flex-1 min-w-0 gap-6 px-[50%] overflow-x-hidden py-10 select-none"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          {REELS.map((reel, index) => {
            const isCenter = index === activeIndex;
            const distance = Math.abs(activeIndex - index);
            const loadVideo = shouldLoad(index, activeIndex);
            const videoSrc = getReelPublicUrl(reel.videoPath);
            const hasVideo = Boolean(loadVideo && videoSrc);

            return (
              <motion.div
                key={reel.id}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                onClick={() => handleCardClick(index)}
                className="relative shrink-0 w-[300px] md:w-[340px] aspect-[9/16] rounded-3xl bg-black overflow-hidden shadow-2xl cursor-pointer"
                animate={{
                  scale: isCenter ? 1.05 : distance === 1 ? 0.9 : 0.8,
                  opacity: isCenter ? 1 : 0.6,
                  zIndex: 10 - distance,
                }}
                transition={CARD_TRANSITION}
              >
                {hasVideo ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={videoSrc}
                    preload="metadata"
                    playsInline
                    controls
                    controlsList="nofullscreen"
                    muted={muted}
                    loop
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(index);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTimeUpdate={() => handleTimeUpdate(index)}
                    className="w-full h-full object-cover"
                  />
                ) : loadVideo ? (
                  <div
                    className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm"
                    aria-hidden
                  >
                    Video unavailable
                  </div>
                ) : null}

                {/* Animated Play / Pause Icon */}

                <AnimatePresence>
                  {showIcon === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-black/60 p-4 rounded-full">
                        {isPlaying[index] ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${progress[index] || 0}%` }}
                  />
                </div>

                {/* Mute Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                  }}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Instagram Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(reel.instagramUrl, "_blank");
                  }}
                  className="absolute top-4 left-4 bg-black/50 p-2 rounded-full"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </button>

                <div className="absolute bottom-0 p-6 text-white">
                  <h3
                    className="text-lg font-bold tracking-tight"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
                    }}
                  >
                    {reel.projectName}
                  </h3>
                  <p
                    className="text-sm text-gray-200/95"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)",
                    }}
                  >
                    {reel.config}
                  </p>
                  <div
                    className="flex items-center gap-2 text-xs text-gray-200/90"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.6)",
                    }}
                  >
                    <MapPin className="w-3 h-3" style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />
                    {reel.location}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="shrink-0 border-0 shadow-md hover:shadow-lg h-[533px] md:h-[604px] w-12 rounded-xl bg-background"
          aria-label="Next reel"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </section>
  );
}
