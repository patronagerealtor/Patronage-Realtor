import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, PlayCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// 1. Static Data
type Webinar = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  role: string;
  category: "Upcoming" | "On-Demand" | "Live Now";
  image: string;
};

const WEBINAR: Webinar[] = [
  {
    id: "1",
    title: "The Future of Urban Sanctuaries",
    description:
      "Discover how modern architecture is adapting to create peaceful havens within bustling city landscapes.",
    date: "Oct 24, 2025",
    time: "2:00 PM EST",
    speaker: "Elena Vore",
    role: "Lead Architect",
    category: "Live Now",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "2",
    title: "Investment Strategies for 2026",
    description:
      "A deep dive into real estate market trends and how to maximize your portfolio value in the coming year.",
    date: "Nov 02, 2025",
    time: "10:00 AM EST",
    speaker: "Marcus Chen",
    role: "Financial Analyst",
    category: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "3",
    title: "Minimalist Interiors: Less is More",
    description:
      "Learn the principles of minimalist design to declutter your space and your mind.",
    date: "Sep 15, 2025",
    time: "Recorded",
    speaker: "Sarah Jenkins",
    role: "Interior Designer",
    category: "On-Demand",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
  },
];

// 2. Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// 3. Sub-component
function WebinarCard({ webinar }: { webinar: Webinar }) {
  const isLive = webinar.category === "Live Now";

  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/10" />
        <img
          src={webinar.image}
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-20">
          <Badge
            className={`${
              isLive
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : webinar.category === "Upcoming"
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {webinar.category}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>{webinar.date}</span>
          <span className="mx-1">·</span>
          <Clock className="h-4 w-4" />
          <span>{webinar.time}</span>
        </div>

        <h3 className="text-xl font-heading font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
          {webinar.title}
        </h3>

        <p className="text-muted-foreground line-clamp-2 mb-6 flex-1">
          {webinar.description}
        </p>

        {/* Footer / Speaker Info */}
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                {webinar.speaker}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {webinar.role}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full group-hover:bg-primary/10 group-hover:text-primary"
          >
            {webinar.category === "On-Demand" ? (
              <PlayCircle className="h-5 w-5" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function Webinar() {
  return (
    // Wrapper div handles layout to keep Footer at the bottom
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative w-full py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
            >
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
                  Expert Insights & <br />
                  <span className="text-primary">Masterclasses</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join industry leaders as we explore the future of design,
                  ownership, and sustainable living.
                </p>
              </div>
              <Button size="lg" className="hidden md:flex rounded-full">
                View All Events
              </Button>
            </motion.div>

            {/* Grid Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {WEBINAR.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </motion.div>

            {/* Mobile View All Button */}
            <div className="mt-12 flex md:hidden justify-center">
              <Button size="lg" className="w-full rounded-full">
                View All Events
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
