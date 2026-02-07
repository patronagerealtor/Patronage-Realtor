import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
  const [, setLocation] = useLocation();
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["Home", "Sanctuary", "Space", "Haven", "Dream"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) =>
        prev === titles.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  function TagItem({
    text,
    link,
    message,
  }: {
    text: string;
    link: string;
    message: string;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          type: "spring",
          stiffness: 350,
          damping: 18,
        }}
        className="relative group"
      >
        {/* Clickable Text */}
        <a
          href={link}
          className="text-xl md:text-2xl font-heading font-semibold
                     text-foreground hover:text-primary"
        >
          {text}
        </a>

        {/* Hover Message Card */}
        <div
          className="pointer-events-none absolute left-1/2 top-full mt-3
                     w-64 -translate-x-1/2 rounded-xl
                     bg-background border border-border
                     p-4 text-sm text-muted-foreground
                     shadow-xl
                     hidden group-hover:block"
        >
          {message}
        </div>
      </motion.div>
    );
  }




  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Background */}
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
              <button className="group relative inline-flex items-center px-1 py-1 rounded-full transition-transform duration-500 hover:scale-105">
                <span className="inline-block min-w-[9ch] text-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={titleNumber}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative z-10 text-gray-500 inline-block"
                    >
                      {titles[titleNumber]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </h1>

            {/* Divider */}
            <div className="mt-6 flex justify-center">
              <div className="h-px w-40 md:w-56 lg:w-72
                              bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </motion.div>

          {/* Buttons Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center md:items-end space-y-4"
            >
              <p className="text-2xl font-heading font-medium tracking-wide text-foreground/90">
                let’s Elevate your living
              </p>

              <Button
                size="lg"
                onClick={() => setLocation("/properties")}
                className="h-16 px-10 text-lg rounded-full shadow-xl
                           transition-all duration-300 ease-out
                           hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105
                           bg-primary text-primary-foreground"
              >
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />

            {/* Right */}
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
                className="h-16 px-10 text-lg rounded-full border-2 border-primary/20
                           transition-all duration-300 ease-out
                           hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105 hover:bg-primary/5"
              >
                <Calculator className="mr-2 h-5 w-5" /> Calculate Now
              </Button>
            </motion.div>
          </div>

          {/* ✅ TAGLINE — CENTERED BELOW BUTTONS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="mt-4 flex items-center justify-center gap-12 text-center"
          >
            <TagItem
              text="Dream it !"
              link="/properties"
              message="Visualize your perfect home with confidence and clarity."
            />
            <span className="text-muted-foreground">·</span>
            <TagItem
              text="Own it !"
              link="/ownership"
              message="Make informed decisions and turn your dream into reality."
            />
            <span className="text-muted-foreground">·</span>
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
