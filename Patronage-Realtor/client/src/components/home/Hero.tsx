import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Static data outside component
const TITLES = ["Home", "Sanctuary", "Space", "Haven", "Dream"];

const tagItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

type TagItemProps = {
  text: string;
  link: string;
  message: string;
};

function TagItem({ text, link, message }: TagItemProps) {
  return (
    <motion.div
      variants={tagItemVariants}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="relative group cursor-pointer"
    >
      <a
        href={link}
        className="text-xl md:text-2xl font-heading font-semibold text-foreground hover:text-primary transition-colors block py-2 md:py-0"
      >
        {text}
      </a>

      {/* Tooltip: Hidden on mobile (touch devices), visible on hover for desktop */}
      <div className="pointer-events-none absolute left-1/2 bottom-full mb-3 w-64 -translate-x-1/2 rounded-xl bg-background border border-border p-4 text-sm text-muted-foreground shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 hidden md:block">
        {message}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const [, setLocation] = useLocation();
  const [titleNumber, setTitleNumber] = useState<number>(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === TITLES.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber]);

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center min-h-[70vh]">
      <div className="absolute inset-0 z-0">
        <BackgroundPaths />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      <div className="container relative z-20 mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.15]">
              Find a place you will call{" "}
              <span className="group relative inline-flex items-center px-1 py-1">
                <span className="inline-block min-w-[9ch] text-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={titleNumber}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative z-10 text-muted-foreground inline-block"
                    >
                      {TITLES[titleNumber]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>

            <div className="mt-6 flex justify-center">
              <div className="h-px w-40 md:w-56 lg:w-72 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12 pt-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center md:items-end space-y-4"
            >
              <p className="text-2xl font-heading font-medium tracking-wide text-foreground/90">
                Let’s elevate your living
              </p>
              <Button
                size="lg"
                onClick={() => setLocation("/properties")}
                className="h-16 px-10 text-lg rounded-full shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105"
              >
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center md:items-start space-y-4"
            >
              <p className="text-2xl font-heading font-medium tracking-wide text-foreground/90">
                Calculate your dream
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/calculators")}
                className="h-16 px-10 text-lg rounded-full border-2 border-primary/20 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105 hover:bg-primary/5"
              >
                <Calculator className="mr-2 h-5 w-5" /> Calculate Now
              </Button>
            </motion.div>
          </div>

          {/* Tagline Section - Optimized for Mobile */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }, // Stagger hyperlinks
            }}
            // CHANGED: Flex-col on mobile, flex-row on md. Adjusted gaps.
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center"
          >
            <TagItem
              text="Dream it !"
              link="/properties"
              message="Visualize your perfect home with confidence and clarity."
            />
            {/* Separator hidden on mobile */}
            <span className="hidden md:inline text-muted-foreground">·</span>

            <TagItem
              text="Own it !"
              link="/ownership"
              message="Make informed decisions and turn your dream into reality."
            />
            {/* Separator hidden on mobile */}
            <span className="hidden md:inline text-muted-foreground">·</span>

            <TagItem
              text="Style it !"
              link="/interiors"
              message="Design your space to reflect your lifestyle and taste."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
