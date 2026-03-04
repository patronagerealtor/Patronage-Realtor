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
import { reelsService } from "@/services/reels";
import type { ReelRow } from "@/services/reels";

const AUTO_ROTATE_MS = 5000;
const INITIAL_INDEX = 1;
const CARD_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 30 };

function shouldLoad(index: number, active: number) {
  return Math.abs(index - active) <= 1;
}

export function Reels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState<number[]>([]);
  const [showIcon, setShowIcon] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [reelsList, setReelsList] = useState<ReelRow[]>([]);
  const [failedVideoIndices, setFailedVideoIndices] = useState<Set<number>>(new Set());

  const list = reelsList;

  const markVideoFailed = useCallback((index: number) => {
    setFailedVideoIndices((prev) => new Set(prev).add(index));
  }, []);

  useEffect(() => {
    let cancelled = false;
    reelsService.fetchReels().then((data) => {
      if (!cancelled) setReelsList(Array.isArray(data) ? data : []);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setProgress(new Array(list.length).fill(0));
    setIsPlaying(new Array(list.length).fill(false));
    setFailedVideoIndices(new Set());
  }, [list.length]);

  useEffect(() => {
    const n = list.length;
    if (n > 0 && activeIndex >= n) setActiveIndex(n - 1);
  }, [list.length, activeIndex]);

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

  useEffect(() => {
    if (paused) return;
    const n = list.length;
    if (n === 0) return;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % n),
      AUTO_ROTATE_MS
    );
    return () => clearInterval(id);
  }, [paused, list.length]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i !== activeIndex) {
        video.pause();
        setIsPlaying((s) => {
          const next = [...s];
          next[i] = false;
          return next;
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
    () => setActiveIndex((i) => (i + 1) % list.length),
    [list.length]
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i === 0 ? list.length - 1 : i - 1)),
    [list.length]
  );

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

  const handleScroll = useCallback(() => {
    syncActiveIndexFromScroll();
  }, [syncActiveIndexFromScroll]);

  const handleCardClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (list.length === 0) return null;

  return (
    <section
      className="w-full py-8 md:py-16 bg-background overflow-hidden touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full max-w-[100vw]">
        {/* Nav: compact on mobile, larger on desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 shrink-0 h-9 w-9 md:h-12 md:w-12 rounded-full shadow-lg bg-background/95 hover:bg-background border-0"
          aria-label="Previous reel"
        >
          <ChevronLeft className="size-5 md:size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 shrink-0 h-9 w-9 md:h-12 md:w-12 rounded-full shadow-lg bg-background/95 hover:bg-background border-0"
          aria-label="Next reel"
        >
          <ChevronRight className="size-5 md:size-6" />
        </Button>

        {/* Scroll area: horizontal touch = reels scroll; vertical touch = page scroll (touch-action). */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto overflow-y-hidden gap-4 md:gap-6 px-14 md:px-16 py-6 md:py-10 min-h-0 scroll-smooth select-none touch-pan-x snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          onScroll={handleScroll}
        >
          {list.map((reel, index) => {
            const isCenter = index === activeIndex;
            const distance = Math.abs(activeIndex - index);
            const loadVideo = shouldLoad(index, activeIndex);
            const videoSrc = reelsService.getReelPublicUrl(
              reel.videoPath,
              reel.cloudinaryVersion
            );
            const hasVideo = Boolean(loadVideo && videoSrc);
            const showVideo = hasVideo && !failedVideoIndices.has(index);

            return (
              <motion.div
                key={reel.id}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                onClick={() => handleCardClick(index)}
                className="relative shrink-0 w-[280px] max-w-[calc(100vw-5rem)] md:w-[340px] md:max-w-none rounded-2xl md:rounded-3xl bg-black overflow-hidden shadow-xl cursor-pointer aspect-[9/16] snap-center touch-pan-x"
                style={{ scrollSnapStop: "always" }}
                animate={{
                  scale: isCenter ? 1.02 : distance === 1 ? 0.92 : 0.85,
                  opacity: isCenter ? 1 : 0.7,
                  zIndex: 10 - distance,
                }}
                transition={CARD_TRANSITION}
              >
                {showVideo ? (
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
                    onError={() => markVideoFailed(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(index);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTimeUpdate={() => handleTimeUpdate(index)}
                    className="w-full h-full object-cover touch-pan-x"
                  />
                ) : loadVideo ? (
                  <div
                    className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm"
                    aria-hidden
                  >
                    Video unavailable
                  </div>
                ) : null}

                <AnimatePresence>
                  {showIcon === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-black/60 p-3 md:p-4 rounded-full">
                        {isPlaying[index] ? (
                          <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        ) : (
                          <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-2 left-2 right-2 h-0.5 md:h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress[index] || 0}%` }}
                  />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                  }}
                  className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 p-1.5 md:p-2 rounded-full"
                >
                  {muted ? (
                    <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(reel.instagramUrl, "_blank");
                  }}
                  className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/50 p-1.5 md:p-2 rounded-full"
                >
                  <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3
                    className="text-base md:text-lg font-bold tracking-tight line-clamp-1"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
                    }}
                  >
                    {reel.projectName}
                  </h3>
                  <p
                    className="text-xs md:text-sm text-gray-200/95 line-clamp-2"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)",
                    }}
                  >
                    {reel.config}
                  </p>
                  <div
                    className="flex items-center gap-2 text-xs text-gray-200/90 mt-1"
                    style={{
                      textShadow:
                        "0 0 1px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.6)",
                    }}
                  >
                    <MapPin
                      className="w-3 h-3 shrink-0"
                      style={{
                        filter:
                          "drop-shadow(0 0 1px rgba(0,0,0,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
                      }}
                    />
                    <span className="truncate">{reel.location}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
