import { useParams, Link } from "wouter";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useInvestmentProperties } from "../hooks/useInvestmentProperties";
import type { CommercialItem, LandItem } from "../lib/investmentStorage";

const badgeColor: Record<string, string> = {
  Hot: "#E53E2F",
  New: "#1A8A5A",
  Prime: "#B8860B",
  Leased: "#4A5A7A",
};

const S: Record<string, React.CSSProperties> = {
  eyebrow: { fontSize: 11, letterSpacing: "0.25em", color: "#B8860B", textTransform: "uppercase", fontWeight: 500 },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.75rem, 3vw, 36px)", fontWeight: 400, color: "#111" },
  badge: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", padding: "6px 12px", borderRadius: 2 },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#666", textDecoration: "none", marginBottom: 24, transition: "color .2s" },
  ctaBtn: { background: "#111", color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 36px", cursor: "pointer", borderRadius: 2, transition: "background .2s, transform .2s" },
};

export default function InvestmentDetails() {
  const params = useParams<{ type: string; id: string }>();
  const { commercial, land } = useInvestmentProperties();
  const type = params?.type ?? "";
  const id = params?.id ? Number(params.id) : NaN;

  const commercialItem = type === "commercial" ? commercial.find((c) => c.id === id) : null;
  const landItem = type === "land" ? land.find((l) => l.id === id) : null;
  const item = commercialItem ?? landItem;
  const isCommercial = !!commercialItem;

  if (!params?.type || !params?.id || (!commercialItem && !landItem)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 max-w-2xl text-center">
          <p className="text-muted-foreground mb-6">Listing not found or invalid link.</p>
          <Link href="/investment" style={S.backBtn}>← Back to Investment</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Link href="/investment" style={S.backBtn} className="hover:text-foreground">
          ← Back to Investment
        </Link>

        <article className="bg-card border border-border rounded-lg overflow-hidden">
          <div style={{ position: "relative" }}>
            <img
              src={(item as CommercialItem | LandItem).img}
              alt={(item as CommercialItem | LandItem).title}
              style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
            />
            <span style={{ ...S.badge, background: badgeColor[(item as CommercialItem | LandItem).badge] ?? "#111", position: "absolute", top: 20, left: 20 }}>
              {(item as CommercialItem | LandItem).badge}
            </span>
            <span style={{ position: "absolute", bottom: 20, right: 20, background: "hsl(var(--card))", color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, padding: "8px 16px", borderRadius: 2 }}>
              {(item as CommercialItem | LandItem).price}
            </span>
          </div>
          <div style={{ padding: "32px 28px 40px" }}>
            <span style={S.eyebrow}>{isCommercial ? (item as CommercialItem).type : `🌿 ${(item as LandItem).zoning} Zone`}</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.75rem, 3vw, 36px)", fontWeight: 400, color: "#111", marginTop: 10, marginBottom: 12 }}>
              {(item as CommercialItem | LandItem).title}
            </h1>
            <p style={{ fontSize: 15, color: "#888", marginBottom: 24 }}>📍 {(item as CommercialItem | LandItem).location}</p>

            {isCommercial ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #EDEAE2" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Size</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{(item as CommercialItem).size}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>ROI</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{(item as CommercialItem).roi}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Status</div>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 2, background: (item as CommercialItem).status === "Available" ? "#E8F5EE" : "#E8EDF5", color: (item as CommercialItem).status === "Available" ? "#1A7A4A" : "#2A5A9A" }}>
                    {(item as CommercialItem).status}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #EDEAE2" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Acres</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{(item as LandItem).acres}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Zoning</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{(item as LandItem).zoning}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Potential</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{(item as LandItem).potential}</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <a href="https://forms.gle/6d9VTgV8EauLAQK18" target="_blank" rel="noopener noreferrer" className="inline-block no-underline" style={S.ctaBtn}>
                Schedule a Call
              </a>
              <Link href="/investment" className="inline-block no-underline" style={{ ...S.ctaBtn, background: "transparent", color: "#111", border: "1.5px solid #111" }}>
                View More Listings
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
