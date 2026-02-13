import { Home, Shield, Users, Clock } from "lucide-react";
import { motion, Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Home,
    title: "Verified Properties Only",
    description:
      "Every listing is legally verified and site-checked so you don’t waste time on misleading options.",
  },
  {
    icon: Shield,
    title: "Transparent & Safe Deals",
    description:
      "Clear pricing, no hidden charges, and guidance at every step to protect your interests.",
  },
  {
    icon: Users,
    title: "Buyer-First Expert Guidance",
    description:
      "Our advisors help you choose what’s right for you, not what sells faster.",
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description:
      "From property search to loan, legal paperwork, and possession, we handle it all.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function WhyChooseUs() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-muted/50 bg-[linear-gradient(to_bottom,hsl(var(--muted)/0.6),hsl(var(--background)/0.85))]"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Buyers Trust Us
          </h2>
          <p className="text-muted-foreground">
            We help you make confident property decisions through transparency,
            expertise, and end-to-end support.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="
                group relative bg-card border border-border
                p-6 md:p-8 rounded-lg text-center
                transition-all duration-300
                hover:border-primary/40
                hover:bg-muted/30
                hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.08),0_8px_24px_-12px_hsl(var(--primary)/0.35)]
              "
            >
              {/* Icon */}
              <motion.div
                whileHover={{ y: -3, rotate: 6 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="
                  w-14 h-14 mx-auto mb-6
                  rounded-full bg-secondary
                  flex items-center justify-center
                  text-primary
                  transition-colors duration-300
                  group-hover:bg-primary
                  group-hover:text-primary-foreground
                "
              >
                <feature.icon className="h-7 w-7" aria-hidden />
              </motion.div>

              <h3 className="text-lg font-bold mb-2 font-heading">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
