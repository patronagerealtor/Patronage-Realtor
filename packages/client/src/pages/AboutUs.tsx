import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Award, Users, Target, CheckCircle2, Plus, Minus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  fetchSiteStats,
  updateSiteStats,
  subscribeSiteStats,
  type SiteStatsRow,
} from "../lib/supabase";

import { env } from "../config/env";
function parseDataEntryAllowedEmails(): string[] {
  const raw = env.dataEntryAllowedEmail || "";
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

const easePremium = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const pageEntrance = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
      updateSiteStats({ [key]: next }).catch(() =>
        fetchSiteStats().then(setStats)
      );
    },
    [stats]
  );

  const statsDisplay = [
    {
      label: "Happy Clients",
      value: String(stats.happy_clients),
      icon: Users,
      key: "happy_clients" as const,
    },
    { label: "Trust", value: "100%", icon: CheckCircle2, key: null },
    {
      label: "Properties Sold",
      value: String(stats.properties_sold),
      icon: Target,
      key: "properties_sold" as const,
    },
    {
      label: "Years Experience",
      value: String(stats.years_experience),
      icon: Award,
      key: "years_experience" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <Header />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageEntrance}
        transition={{ duration: 0.7, ease: easePremium }}
      >
        {/* HERO SECTION */}
        <section className="relative py-32 text-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/Hero/AboutUS page Bg.jpg"
              alt="About Patronage Realtor"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          </div>

          <div className="relative container mx-auto px-6">
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
              About Patronage Realtor
            </p>

            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight mb-8">
              Crafted Around Vision.
              <br />
              <span className="text-white/80">Defined by Excellence.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Redefining real estate through clarity, trust, and professional
              guidance since 2021.
            </p>
          </div>
        </section>

        

        {/* STORY SECTION */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">
                Our Journey
              </p>

              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-10">
                From Vision to Value
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Patronage Realtor was founded in 2021 by <strong>Samyak Gaikwad</strong> during his college years as a self-funded entrepreneurial initiative driven by transparency and value-based advisory.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                With perseverance, industry learning, and strong collaborative support, the company evolved into a trusted real estate solutions platform.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong>Prathmesh Mahidwar</strong> later joined the organization, strengthening its strategic direction and shaping its mission of empowering individuals through clarity, education, and informed decision-making.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              {statsDisplay.map((stat) => (
                <Card
                  key={stat.label}
                  className="p-10 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <stat.icon className="h-10 w-10 mx-auto mb-6 text-primary" />

                  {stat.key && canEdit ? (
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Button
                        size="icon"
                        onClick={() => adjustStat(stat.key!, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <p className="text-4xl font-bold tabular-nums">
                        {stat.value}
                      </p>

                      <Button
                        size="icon"
                        onClick={() => adjustStat(stat.key!, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold tabular-nums">
                      {stat.value}
                    </p>
                  )}

                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-40 overflow-hidden">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={encodeURI("/Hero/Brand Philosophy.jpg")}
              alt=""
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
          </div>

          {/* Subtle Ambient Glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

          <div className="relative container mx-auto px-6 text-center max-w-4xl">

          {/* Micro Label */}
            <p className="text-xs tracking-[0.45em] uppercase text-white/40 mb-8">
              Brand Philosophy
            </p>

            {/* Main Statement */}
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Building Awareness.
              <br />
              <span className="text-white/80">Creating Confidence.</span>
            </h2>

            {/* Supporting Line */}
            <p className="text-lg md:text-l text-white/60 leading-relaxed -mt-1">
              Simplifying real estate through knowledge, transparency,
              and trusted guidance.
            </p>

            {/* Subtle Signature Line */}
            <div className="mt-16 border-t border-white/10 pt-8">
              <p className="text-sm tracking-[0.35em] uppercase text-white/30">
                Patronage Realtor
              </p>
            </div>

            <Button
              size="lg"
              className="mt-8 rounded-full px-10 h-14 text-white bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all"
              onClick={() => setLocation("/properties")}
            >
              Explore Exclusive Listings
            </Button>

          </div>
        </section>

        <Footer />
      </motion.div>
    </div>
  );
}