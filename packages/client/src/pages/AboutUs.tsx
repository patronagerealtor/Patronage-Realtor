import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Award, Users, Target, CheckCircle2, Plus, Minus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { fetchSiteStats, updateSiteStats, subscribeSiteStats, type SiteStatsRow } from "../lib/supabase";

function parseDataEntryAllowedEmails(): string[] {
  const raw = (typeof import.meta !== "undefined" && import.meta.env?.VITE_DATA_ENTRY_ALLOWED_EMAIL) || "";
  if (!raw.trim()) return [];
  return raw.split(",").map((e: string) => e.trim().toLowerCase()).filter(Boolean);
}

const easePremium = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const pageEntrance = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const heroStagger = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easePremium }
  }
};

export default function AboutUs() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const allowedEmails = parseDataEntryAllowedEmails();
  const userEmail = user?.email?.trim().toLowerCase() ?? "";
  const canEdit =
    allowedEmails.length > 0 &&
    userEmail.length > 0 &&
    allowedEmails.includes(userEmail);

  const [stats, setStats] = useState<SiteStatsRow>({
    happy_clients: 1000,
    properties_sold: 500,
    years_experience: 4,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    fetchSiteStats().then(setStats);
    const unsub = subscribeSiteStats(setStats);
    return unsub;
  }, []);

  const adjustStat = useCallback(
    (key: keyof SiteStatsRow, delta: number) => {
      const next = Math.max(0, stats[key] + delta);
      setStats((prev) => ({ ...prev, [key]: next }));
      updateSiteStats({ [key]: next }).catch((err) => {
        console.warn("Failed to update site stats:", err);
        fetchSiteStats().then(setStats);
      });
    },
    [stats]
  );

  const statsDisplay = [
    { label: "Happy Clients", value: String(stats.happy_clients), icon: Users, key: "happy_clients" as const },
    { label: "Trust", value: "100%", icon: CheckCircle2, key: null },
    { label: "Properties Sold", value: String(stats.properties_sold), icon: Target, key: "properties_sold" as const },
    { label: "Years Experience", value: String(stats.years_experience), icon: Award, key: "years_experience" as const },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <Header />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageEntrance}
        transition={{ duration: 0.7, ease: easePremium }}
        className="relative"
      >
        {/* Floating Ambient Shapes — fade in with page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.25, ease: easePremium }}
          className="absolute top-40 left-[-200px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: easePremium }}
          className="absolute bottom-0 right-[-250px] w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] pointer-events-none"
        />

        {/* HERO SECTION WITH IMAGE */}
        <section className="relative py-32 overflow-hidden text-center">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/Hero/AboutUS page Bg.jpg"
              alt="About Patronage Realtor"
              className="w-full h-full object-cover scale-105"
            />

            {/* Dark Luxury Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

            {/* Cinematic Radial Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
          </div>

          {/* Content — staggered entrance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
            className="relative container mx-auto px-6"
          >
            <motion.p
              variants={heroStagger}
              className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6"
            >
              About Patronage Realtor
            </motion.p>

            <motion.h1
              variants={heroStagger}
              className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight mb-10"
            >
              Crafted Around Vision.
              <br />
              <span className="text-white/80">Defined by Excellence.</span>
            </motion.h1>

            <motion.p
              variants={heroStagger}
              className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
            >
              Since 2021, we have redefined property advisory through integrity,
              discretion, and refined real estate strategy.
            </motion.p>
          </motion.div>
        </section>

      {/* STORY SECTION */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.85, ease: easePremium }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">
              Our Story
            </p>

            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-10">
              Built With Conviction
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Founded in 2021 by <strong>Samyak Gaikwad</strong>, Patronage
              Realtor emerged from a commitment to ethical advisory and
              transparent property guidance.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              With <strong>Prathmesh Mahidwar</strong> strengthening strategy
              and execution, we evolved into a trusted advisory platform —
              blending consulting, financial clarity, and interior expertise.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.85, delay: 0.15, ease: easePremium }}
            className="grid grid-cols-2 gap-8"
          >
            {statsDisplay.map((stat) => (
              <Card
                key={stat.label}
                className="p-10 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:bg-white/10 transition-all duration-500"
              >
                <stat.icon className="h-10 w-10 mx-auto mb-6 text-primary" />
                {stat.key && canEdit ? (
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full border-2 border-primary bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary-foreground"
                      onClick={() => adjustStat(stat.key!, -1)}
                      aria-label={`Decrease ${stat.label}`}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <p className="min-w-[4rem] text-4xl font-bold text-center tabular-nums" aria-live="polite">
                      {stat.value}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full border-2 border-primary bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary-foreground"
                      onClick={() => adjustStat(stat.key!, 1)}
                      aria-label={`Increase ${stat.label}`}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-4xl font-bold mb-2 tabular-nums" aria-live="polite">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PREMIUM CTA SECTION */}
      <section className="relative py-40 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Hero/AboutUS page Bg2.jpg"
            alt=""
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Dark overlay for readability and premium depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
          {/* Soft highlight at center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.9, ease: easePremium }}
          className="relative container mx-auto px-6"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-12">
            Experience Advisory Without Compromise
          </h2>

          <Button
            size="lg"
            className="
              group relative inline-flex items-center justify-center
              rounded-full px-16 h-14
              text-white font-semibold text-base
              border border-white/20
              backdrop-blur-md
              bg-white/10
              shadow-[0_8px_30px_rgba(0,0,0,0.4)]
              transition-all duration-300
              hover:bg-white/20 hover:border-white/40
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]
              [&>.absolute]:pointer-events-none
            "
            onClick={() => setLocation("/properties")}
          >
            <span className="relative z-10">Explore Exclusive Listings</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-t from-white/5 to-white/20 opacity-50" aria-hidden />
          </Button>

          <p className="mt-10 text-sm text-white/40">
            Private Viewings · Transparent Process · Strategic Investment Guidance
          </p>
        </motion.div>
      </section>

        <Footer />
      </motion.div>
    </div>
  );
}