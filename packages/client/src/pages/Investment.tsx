import { useState, useRef, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const tabs = ["Overview", "Commercial", "Land Acquisition"];
const stats = [
  { label: "Assets Under Management", value: "$2.4B+" },
  { label: "Active Projects", value: "140+" },
  { label: "Avg. Annual ROI", value: "18.6%" },
  { label: "Years of Experience", value: "25+" },
];

const commercialProperties = [
  {
    id: 1,
    title: "Metro Business Tower",
    location: "Downtown Chicago, IL",
    type: "Grade A Office",
    size: "85,000 sq ft",
    roi: "14.2%",
    status: "Available",
    price: "$42M",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    badge: "Hot",
  },
  {
    id: 2,
    title: "Westfield Retail Hub",
    location: "Austin, TX",
    type: "Retail Complex",
    size: "120,000 sq ft",
    roi: "11.8%",
    status: "Leased",
    price: "$67M",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    badge: "Leased",
  },
  {
    id: 3,
    title: "Harbor Industrial Park",
    location: "Miami, FL",
    type: "Industrial / Warehouse",
    size: "200,000 sq ft",
    roi: "16.5%",
    status: "Available",
    price: "$89M",
    img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    badge: "New",
  },
];

const landListings = [
  {
    id: 1,
    title: "Sunset Valley Parcel",
    location: "Phoenix, AZ",
    acres: "48 Acres",
    zoning: "Mixed-Use",
    potential: "Residential + Retail",
    price: "$8.4M",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
    badge: "Prime",
  },
  {
    id: 2,
    title: "Greenfield Industrial Zone",
    location: "Columbus, OH",
    acres: "120 Acres",
    zoning: "Industrial",
    potential: "Manufacturing Hub",
    price: "$14.2M",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    badge: "Hot",
  },
  {
    id: 3,
    title: "Coastal Corridor Land",
    location: "Jacksonville, FL",
    acres: "22 Acres",
    zoning: "Commercial",
    potential: "Hospitality / Resort",
    price: "$19.7M",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    badge: "New",
  },
];

const whyUs = [
  { icon: "◈", title: "Data-Driven Analysis", desc: "Every acquisition is backed by rigorous market research, demographic analysis, and financial modeling." },
  { icon: "◉", title: "End-to-End Management", desc: "From due diligence to asset management, we handle every stage of your investment lifecycle." },
  { icon: "◇", title: "Transparent Reporting", desc: "Real-time dashboards and quarterly reports keep you fully informed on performance." },
  { icon: "◆", title: "Legal & Compliance", desc: "In-house legal team ensures all transactions are secure, compliant, and risk-mitigated." },
];

const reels = [
  { id: 1, title: "Inside Metro Business Tower", location: "Chicago, IL", duration: "0:58", tag: "Commercial Tour", thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", views: "24K" },
  { id: 2, title: "Sunset Valley Land Walk", location: "Phoenix, AZ", duration: "1:12", tag: "Land Acquisition", thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80", views: "18K" },
  { id: 3, title: "Harbor Industrial – Full Tour", location: "Miami, FL", duration: "2:04", tag: "Industrial", thumb: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80", views: "31K" },
  { id: 4, title: "Greenfield Zone Flyover", location: "Columbus, OH", duration: "0:45", tag: "Aerial Survey", thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", views: "12K" },
  { id: 5, title: "Westfield Retail Hub Preview", location: "Austin, TX", duration: "1:30", tag: "Retail Tour", thumb: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80", views: "20K" },
];

const badgeColor: Record<string, string> = {
  Hot: "#E53E2F",
  New: "#1A8A5A",
  Prime: "#B8860B",
  Leased: "#4A5A7A",
};

const tagBg: Record<string, string> = {
  "Commercial Tour": "#1a1a1a",
  "Land Acquisition": "#2D4A2D",
  "Industrial": "#2A3040",
  "Aerial Survey": "#402A2A",
  "Retail Tour": "#3A2A40",
};

export default function InvestmentPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const reelScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const scrollReels = (dir: "left" | "right") => {
    if (reelScrollRef.current) {
      reelScrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;}

        .tab-btn{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:10px 28px;border-radius:2px;transition:all .22s ease;color:#888;}
        .tab-btn.active{background:#111111;color:#fff;}
        .tab-btn:not(.active):hover{color:#111;}

        .cta-btn{background:#111;color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:14px 36px;cursor:pointer;border-radius:2px;transition:background .2s,transform .2s;}
        .cta-btn:hover{background:#333;transform:translateY(-1px);}

        .outline-btn{background:transparent;color:#111;border:1.5px solid #111;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:14px 36px;cursor:pointer;border-radius:2px;transition:all .2s;}
        .outline-btn:hover{background:#11111108;}

        .prop-card{background:#fff;border:1px solid #E8E4DC;border-radius:4px;overflow:hidden;transition:transform .3s,box-shadow .3s;}
        .prop-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.1);}

        .why-card{background:#fff;border:1px solid #EDEAE2;border-radius:4px;padding:36px 28px;transition:box-shadow .3s,transform .3s;}
        .why-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-3px);}

        .overview-card{background:#fff;cursor:pointer;overflow:hidden;border-radius:4px;border:1px solid #EDEAE2;transition:box-shadow .3s;}
        .overview-card:hover{box-shadow:0 12px 36px rgba(0,0,0,.1);}

        .reel-card{flex:0 0 260px;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #EDEAE2;cursor:pointer;transition:transform .3s,box-shadow .3s;}
        .reel-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.12);}
        .reel-card:hover .play-btn{opacity:1!important;transform:translate(-50%,-50%) scale(1)!important;}
        .reel-card:hover .reel-thumb{transform:scale(1.04);}

        .play-btn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.85);opacity:0;transition:all .25s;width:52px;height:52px;background:rgba(255,255,255,.95);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;color:#111;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;}

        .reel-thumb{transition:transform .4s;}

        .reels-track{display:flex;gap:20px;overflow-x:auto;scroll-behavior:smooth;padding-bottom:12px;scrollbar-width:none;}
        .reels-track::-webkit-scrollbar{display:none;}

        .scroll-btn{background:#111;color:#fff;border:none;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;}
        .scroll-btn:hover{background:#444;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .6s ease forwards;}
        .fade-up-2{animation:fadeUp .6s .15s ease both;}
        .fade-up-3{animation:fadeUp .6s .3s ease both;}
      `}</style>

      {/* HERO */}
      <header style={S.hero} className="bg-secondary/20 border-b border-border">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 40%, hsl(var(--primary) / 0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container mx-auto px-4 relative z-10">
        <div style={{ maxWidth: 680 }}>
          <p className="fade-up" style={S.eyebrowHero}>— INVESTMENT DIVISION</p>
          <h1 className="fade-up-2" style={S.heroTitle}>
            Build Lasting<br />Wealth Through<br />
            <em style={{ color: "#B8860B", fontStyle: "italic" }}>Real Estate</em>
          </h1>
          <p className="fade-up-3" style={{ fontSize: 16, lineHeight: 1.7, color: "#666", marginTop: 20, maxWidth: 520 }}>
            Strategic commercial assets and land acquisitions curated for maximum returns and long-term portfolio growth.
          </p>
          <div className="fade-up-3" style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
            <a href="#what-we-offer" className="cta-btn inline-block no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("what-we-offer")?.scrollIntoView({ behavior: "smooth" }); }}>Explore Opportunities</a>
            <button className="outline-btn">Download Prospectus</button>
          </div>
        </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-0">
        <div style={{ display: "flex", gap: 1, marginTop: 48, borderTop: "1px solid hsl(var(--border))" }} className="rounded-b-lg overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="bg-muted/50" style={{ flex: 1, padding: "24px 20px", minWidth: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 36px)", fontWeight: 600, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div className="text-muted-foreground text-[11px] uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex gap-1 py-3">
          {tabs.map((t) => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-grow container mx-auto px-4 py-0 md:py-8 max-w-6xl">

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <div>
            {/* Two pillars */}
            <section id="what-we-offer" className="py-12 md:py-20 scroll-mt-20">
              <div className="mb-12 text-center">
                <span style={S.eyebrow}>WHAT WE OFFER</span>
                <h2 style={S.sectionTitle}>Two Pillars of Investment</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { num: "CATEGORY 01", title: "Commercial Real Estate", desc: "Office towers, retail complexes, industrial parks, and mixed-use developments — income-generating assets with stable, long-term leases.", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80", tab: "Commercial" },
                  { num: "CATEGORY 02", title: "Land Acquisition", desc: "Strategic land parcels in high-growth corridors, zoned for development — the foundation of tomorrow's high-value assets.", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80", tab: "Land Acquisition" },
                ].map((card) => (
                  <div key={card.tab} className="overview-card" onClick={() => setActiveTab(card.tab)}>
                    <img src={card.img} alt={card.title} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "36px 40px" }}>
                      <span style={S.eyebrow}>{card.num}</span>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: "#111", marginTop: 10 }}>{card.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#666", marginTop: 12 }}>{card.desc}</p>
                      <button className="outline-btn" style={{ marginTop: 24 }}>Explore {card.tab === "Commercial" ? "Commercial" : "Land"} →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Meridian */}
            <section className="py-16 md:py-20 border-t border-border">
              <div className="mb-12 text-center">
                <span style={S.eyebrow}>WHY MERIDIAN</span>
                <h2 style={S.sectionTitle}>Our Investment Edge</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {whyUs.map((w) => (
                  <div key={w.title} className="why-card">
                    <div style={{ fontSize: 28, color: "#B8860B", marginBottom: 20 }}>{w.icon}</div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#111", marginBottom: 10 }}>{w.title}</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "#888" }}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* REELS */}
            <section className="py-16 md:py-20 border-t border-border">
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
                <div>
                  <span style={S.eyebrow}>PROPERTY REELS</span>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 400, color: "#111", marginTop: 10, lineHeight: 1.1 }}>See It Before You Buy It</h2>
                  <p style={{ fontSize: 14, color: "#888", marginTop: 8, maxWidth: 420 }}>
                    Short-form video tours of our latest listings — shot on location, unfiltered.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="scroll-btn" onClick={() => scrollReels("left")}>←</button>
                  <button className="scroll-btn" onClick={() => scrollReels("right")}>→</button>
                </div>
              </div>
              <div className="reels-track" ref={reelScrollRef}>
                {reels.map((reel) => (
                  <div key={reel.id} className="reel-card">
                    <div style={{ position: "relative", height: 380, overflow: "hidden", background: "#111" }}>
                      <img className="reel-thumb" src={reel.thumb} alt={reel.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.88 }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)" }} />
                      <div style={{ position: "absolute", top: 14, left: 14, background: tagBg[reel.tag] || "#111", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 2 }}>{reel.tag}</div>
                      <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, padding: "4px 8px", borderRadius: 2, fontWeight: 600 }}>{reel.duration}</div>
                      <div className="play-btn">▶</div>
                      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{reel.title}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>📍 {reel.location}</p>
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#999" }}>👁 {reel.views} views</span>
                      <button className="cta-btn" style={{ padding: "8px 16px", fontSize: 11 }}>Watch Reel</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* COMMERCIAL */}
        {activeTab === "Commercial" && (
          <div>
            <section className="py-16 md:py-20">
              <div className="mb-12 text-center">
                <span style={S.eyebrow}>COMMERCIAL PORTFOLIO</span>
                <h2 style={S.sectionTitle}>Income-Generating Assets</h2>
                <p style={{ fontSize: 15, color: "#888", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>Diversify with office, retail, and industrial properties — professionally managed for optimal yield.</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
                {["All", "Office", "Retail", "Industrial", "Mixed-Use"].map((f, i) => (
                  <button key={f} className={`tab-btn ${i === 0 ? "active" : ""}`} style={{ fontSize: 12, padding: "8px 20px" }}>{f}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {commercialProperties.map((p) => (
                  <div key={p.id} className="prop-card">
                    <div style={{ position: "relative" }}>
                      <img src={p.img} alt={p.title} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                      <span style={{ ...S.badge, background: badgeColor[p.badge] }}>{p.badge}</span>
                      <span style={S.priceTag}>{p.price}</span>
                    </div>
                    <div style={{ padding: 24 }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#B8860B", textTransform: "uppercase", marginBottom: 8 }}>{p.type}</div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#111", marginBottom: 6 }}>{p.title}</h3>
                      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>📍 {p.location}</p>
                      <div style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #EDEAE2" }}>
                        <span style={{ fontSize: 12, color: "#888" }}>⬛ {p.size}</span>
                        <span style={{ fontSize: 12, color: "#888" }}>📈 ROI {p.roi}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 2, background: p.status === "Available" ? "#E8F5EE" : "#E8EDF5", color: p.status === "Available" ? "#1A7A4A" : "#2A5A9A" }}>{p.status}</span>
                        <button className="cta-btn" style={{ padding: "10px 20px", fontSize: 12 }}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-16 md:py-20 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div>
                  <span style={S.eyebrow}>COMMERCIAL INSIGHTS</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "#111", marginTop: 12, marginBottom: 16 }}>Why Commercial Property?</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.85, color: "#666" }}>Commercial real estate offers superior risk-adjusted returns compared to residential assets. With multi-year lease structures, institutional tenants, and value-add potential, commercial properties provide stable cash flows and inflation-protected capital appreciation.</p>
                  <div style={{ display: "flex", marginTop: 36, borderTop: "1px solid #E8E4DC", paddingTop: 36 }}>
                    {[{ v: "8–16%", l: "Expected ROI Range" }, { v: "5–15yr", l: "Average Lease Term" }, { v: "92%", l: "Portfolio Occupancy" }].map((s, i) => (
                      <div key={s.l} style={{ flex: 1, ...(i < 2 ? { borderRight: "1px solid #EDEAE2", paddingRight: 24, marginRight: 24 } : {}) }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#111", fontWeight: 600 }}>{s.v}</div>
                        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80" alt="Commercial" style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 4 }} />
              </div>
            </section>
          </div>
        )}

        {/* LAND ACQUISITION */}
        {activeTab === "Land Acquisition" && (
          <div>
            <section className="py-16 md:py-20">
              <div className="mb-12 text-center">
                <span style={S.eyebrow}>LAND PORTFOLIO</span>
                <h2 style={S.sectionTitle}>Strategic Land Parcels</h2>
                <p style={{ fontSize: 15, color: "#888", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>Raw land in high-growth corridors — acquire today, develop tomorrow.</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
                {["All Zones", "Residential", "Commercial", "Industrial", "Mixed-Use"].map((f, i) => (
                  <button key={f} className={`tab-btn ${i === 0 ? "active" : ""}`} style={{ fontSize: 12, padding: "8px 20px" }}>{f}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {landListings.map((p) => (
                  <div key={p.id} className="prop-card">
                    <div style={{ position: "relative" }}>
                      <img src={p.img} alt={p.title} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                      <span style={{ ...S.badge, background: badgeColor[p.badge] }}>{p.badge}</span>
                      <span style={S.priceTag}>{p.price}</span>
                    </div>
                    <div style={{ padding: 24 }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#B8860B", textTransform: "uppercase", marginBottom: 8 }}>🌿 {p.zoning} Zone</div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#111", marginBottom: 6 }}>{p.title}</h3>
                      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>📍 {p.location}</p>
                      <div style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #EDEAE2" }}>
                        <span style={{ fontSize: 12, color: "#888" }}>📐 {p.acres}</span>
                        <span style={{ fontSize: 12, color: "#888" }}>🏗 {p.potential}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 2, background: "#E8F5EE", color: "#1A7A4A" }}>Available</span>
                        <button className="cta-btn" style={{ padding: "10px 20px", fontSize: 12 }}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-16 md:py-20 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" alt="Land" className="w-full h-[360px] object-cover rounded" />
                <div>
                  <span style={S.eyebrow}>LAND INSIGHTS</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "#111", marginTop: 12, marginBottom: 16 }}>The Case for Land Investment</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.85, color: "#666" }}>Land is the scarcest and most appreciating asset class in real estate. With zero depreciation, minimal maintenance costs, and the flexibility to develop according to future market demands, strategic land parcels represent exceptional long-term wealth-building vehicles.</p>
                  <div style={{ display: "flex", marginTop: 36, borderTop: "1px solid #E8E4DC", paddingTop: 36 }}>
                    {[{ v: "22%+", l: "Avg. 5yr Appreciation" }, { v: "Zero", l: "Depreciation" }, { v: "100%", l: "Dev. Flexibility" }].map((s, i) => (
                      <div key={s.l} style={{ flex: 1, ...(i < 2 ? { borderRight: "1px solid #EDEAE2", paddingRight: 24, marginRight: 24 } : {}) }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#111", fontWeight: 600 }}>{s.v}</div>
                        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 32 }}>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#111", marginBottom: 14 }}>Due Diligence Checklist</h4>
                    {["Zoning & land use regulations verified", "Environmental & soil assessment completed", "Infrastructure availability confirmed", "Title search & encumbrance review", "Market comparable analysis performed"].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <span style={{ color: "#1A7A4A", fontWeight: 700, fontSize: 14 }}>✓</span>
                        <span style={{ fontSize: 13, color: "#666" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CTA */}
        <section className="bg-foreground text-background rounded-xl my-12 md:my-16 py-16 md:py-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <span style={{ ...S.eyebrow, color: "#B8860B" }}>READY TO INVEST?</span>
            <h2 className="font-heading text-3xl md:text-4xl font-normal mt-3 mb-4">Speak with an Investment Advisor</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">Schedule a free 30-minute consultation to explore how we can build your real estate portfolio.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="cta-btn">Schedule a Call</button>
              <button className="outline-btn bg-white text-foreground">Download Brochure</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  hero: { position: "relative", minHeight: 480, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 1rem 0" },
  eyebrowHero: { fontSize: 11, letterSpacing: "0.25em", color: "#B8860B", textTransform: "uppercase", marginBottom: 20, fontWeight: 500 },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 72px)", fontWeight: 300, lineHeight: 1.05, color: "inherit" },
  eyebrow: { fontSize: 11, letterSpacing: "0.25em", color: "#B8860B", textTransform: "uppercase", fontWeight: 500 },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 48px)", fontWeight: 400, color: "inherit", marginTop: 12, lineHeight: 1.1 },
  badge: { position: "absolute", top: 16, left: 16, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", padding: "5px 10px", borderRadius: 2 },
  priceTag: { position: "absolute", bottom: 16, right: 16, background: "hsl(var(--card))", color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, padding: "4px 12px", borderRadius: 2 },
};
