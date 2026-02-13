import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlaceholderImage } from "@/components/shared/PlaceholderImage"
import { Link } from "wouter"

export function AboutPreview() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-16 md:py-24 border-t border-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            About Our Company
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
            We are redefining the <br /> real estate experience
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2015, Estate.co has grown from a small local agency to a nationwide platform.
            We believe that finding a home should be an exciting journey, not a stressful task.
          </p>

          <div className="pt-4">
            <Link href="/about-us">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="border-2 transition-transform">
                  Read More About Us
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT IMAGES */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mt-8"
          >
            <PlaceholderImage height="h-64" text="Team" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PlaceholderImage height="h-64" text="Office" />
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  )
}
