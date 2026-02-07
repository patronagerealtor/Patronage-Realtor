import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { motion } from "framer-motion";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Animated Background Paths */}
      <div className="absolute inset-0 z-0">
        <BackgroundPaths />
        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Hero Content */}
      <div className="container relative z-20 mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-16">
          {/* Main Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-[1.15]">
              Find a place you will call{" "}

              <button
                className="group relative inline-flex items-center
                           px-4 py-1 rounded-full
                           transition-transform duration-500 hover:scale-105"
              >
                {/* TEXT */}
                <span
                  className="relative z-10 text-gray-500
                             transition-all duration-500
                             group-hover:tracking-wider"
                >
                  Home
                </span>

                {/* HOVER TEXT (NO SHADOW, JUST MOTION) */}
                
              </button>
            </h1>



          </motion.div>

          {/* Partitioned Content */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12">
            
            {/* Left Side - Properties */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center md:items-end space-y-4"
            >
              <p className="text-lg text-muted-foreground font-medium italic">
                Discover your perfect sanctuary today.
              </p>
              <Button
                size="lg"
                onClick={() => setLocation("/properties")}
                className="h-16 px-10 text-lg rounded-full shadow-xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105
                  active:translate-y-0.5 bg-primary text-primary-foreground"
              >
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Middle Partition */}
            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="md:hidden w-32 h-px mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Right Side - Calculator */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center md:items-start space-y-4"
            >
              <p className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                Calculate your dream
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/calculators")}
                className="h-16 px-10 text-lg rounded-full border-2 border-primary/20
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105 hover:bg-primary/5
                  active:translate-y-0.5"
              >
                <Calculator className="mr-2 h-5 w-5" /> Calculate Now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
