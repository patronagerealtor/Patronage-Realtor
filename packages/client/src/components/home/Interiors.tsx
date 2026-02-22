import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

// ─────────────────────────────────────────────────────────────────────────────
// Fonts: add to your global CSS or index.html:
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes imageDrift {
    from { transform: scale(1.07) translateY(6px); }
    to   { transform: scale(1) translateY(0); }
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  .int-root {
    --parchment: #F1F3E0;
    --sage-light: #A1BC98;
    --sage-dark: #778873;
    --sage-ink: #3d4a3a;
    --parchment-dim: rgba(241,243,224,0.55);
    --sage-border: rgba(119,136,115,0.25);
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;

    position: relative;
    overflow: hidden;
    background: var(--parchment);
    font-family: var(--sans);
    color: var(--sage-ink);
  }

  /* Subtle botanical dot-grid background */
  .int-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(119,136,115,0.18) 1px, transparent 1px);
    background-size: 28px 28px;
    z-index: 0;
    pointer-events: none;
  }

  /* Top soft wash */
  .int-root::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(180deg, rgba(161,188,152,0.12) 0%, transparent 100%);
    z-index: 0;
    pointer-events: none;
  }

  .int-inner {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 640px;
  }

  /* ─── LEFT: TEXT ─── */
  .int-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 88px 56px 88px 72px;
    animation: fadeUp 1s cubic-bezier(.22,.68,0,1.1) 0.1s both;
  }

  .int-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--sage-dark);
    margin-bottom: 26px;
    animation: fadeUp 0.8s ease 0.2s both;
  }
  .int-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sage-light);
    flex-shrink: 0;
  }

  .int-heading {
    font-family: var(--serif);
    font-size: clamp(2.5rem, 4vw, 3.6rem);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.015em;
    color: var(--sage-ink);
    margin: 0 0 8px;
    animation: fadeUp 0.95s ease 0.3s both;
  }
  .int-heading em {
    font-style: italic;
    color: var(--sage-dark);
    font-weight: 400;
  }

  .int-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 22px 0;
    animation: fadeUp 0.8s ease 0.4s both;
  }
  .int-divider-line {
    height: 1px;
    width: 44px;
    background: var(--sage-light);
    transform-origin: left;
    animation: lineGrow 0.7s ease 0.55s both;
  }
  .int-divider-leaf {
    font-size: 14px;
    opacity: 0.6;
    color: var(--sage-dark);
  }

  .int-body {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.85;
    color: rgba(61,74,58,0.65);
    max-width: 340px;
    margin-bottom: 36px;
    animation: fadeUp 0.95s ease 0.45s both;
  }

  .int-features {
    list-style: none;
    padding: 0;
    margin: 0 0 44px;
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: fadeUp 0.95s ease 0.55s both;
  }
  .int-feat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    border-bottom: 1px solid var(--sage-border);
    cursor: default;
    transition: padding-left 0.25s ease;
  }
  .int-feat:first-child { border-top: 1px solid var(--sage-border); }
  .int-feat:hover { padding-left: 6px; }
  .int-feat-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .int-feat-num {
    font-family: var(--serif);
    font-size: 11px;
    font-style: italic;
    color: var(--sage-light);
    min-width: 18px;
  }
  .int-feat-name {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sage-ink);
  }
  .int-feat-arrow {
    opacity: 0;
    color: var(--sage-dark);
    transition: opacity 0.2s;
  }
  .int-feat:hover .int-feat-arrow { opacity: 1; }

  /* CTA */
  .int-cta {
    display: inline-flex;
    align-items: center;
    gap: 13px;
    background: var(--sage-dark);
    color: var(--parchment);
    border: none;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 17px 32px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease;
    align-self: flex-start;
    animation: fadeUp 0.95s ease 0.65s both;
  }
  .int-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--sage-ink);
    transform: translateX(-101%);
    transition: transform 0.35s cubic-bezier(.4,0,.2,1);
  }
  .int-cta:hover::before { transform: translateX(0); }
  .int-cta span, .int-cta svg {
    position: relative;
    z-index: 1;
  }

  /* ─── RIGHT: IMAGE ─── */
  .int-image-panel {
    position: relative;
    overflow: hidden;
    animation: fadeIn 1.3s ease 0s both;
  }

  /* Soft left-edge fade into parchment */
  .int-image-panel::before {
    content: '';
    position: absolute;
    top: 0; left: -2px; bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, var(--parchment) 0%, transparent 100%);
    z-index: 3;
    pointer-events: none;
  }

  .int-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    min-height: 580px;
    animation: imageDrift 1.6s cubic-bezier(.25,.46,.45,.94) 0s both;
    transition: transform 0.9s cubic-bezier(.25,.46,.45,.94);
  }
  .int-image-panel:hover .int-img {
    transform: scale(1.04);
  }

  /* Floating badge */
  .int-badge {
    position: absolute;
    top: 36px;
    right: 36px;
    z-index: 4;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: var(--parchment);
    border: 1px solid var(--sage-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(61,74,58,0.12);
    animation: floatBadge 4s ease-in-out 1.2s infinite;
  }
  .int-badge-num {
    font-family: var(--serif);
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--sage-dark);
    line-height: 1;
  }
  .int-badge-label {
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sage-ink);
    opacity: 0.6;
    margin-top: 2px;
  }

  /* Bottom caption strip */
  .int-caption-strip {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 4;
    padding: 20px 28px;
    background: linear-gradient(0deg, rgba(241,243,224,0.92) 0%, transparent 100%);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    animation: fadeUp 0.9s ease 1s both;
  }
  .int-caption-text {
    font-family: var(--serif);
    font-size: 13px;
    font-style: italic;
    color: var(--sage-dark);
  }
  .int-caption-stats {
    display: flex;
    gap: 24px;
  }
  .int-stat {
    text-align: right;
  }
  .int-stat-val {
    display: block;
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--sage-ink);
    line-height: 1;
  }
  .int-stat-lbl {
    display: block;
    font-size: 8.5px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sage-dark);
    opacity: 0.7;
    margin-top: 3px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 820px) {
    .int-inner {
      grid-template-columns: 1fr;
    }
    .int-image-panel {
      order: -1;
      height: 340px;
    }
    .int-image-panel::before { display: none; }
    .int-img { min-height: 340px; }
    .int-text {
      padding: 52px 28px 60px;
    }
    .int-badge {
      width: 72px; height: 72px;
      top: 20px; right: 20px;
    }
    .int-badge-num { font-size: 1.2rem; }
  }
`;

export function Interiors() {
  const [, setLocation] = useLocation();

  return (
    <>
      <style>{styles}</style>
      <section className="int-root">
        <div className="int-inner">

          {/* ── TEXT PANEL ── */}
          <div className="int-text">
            <p className="int-eyebrow">
              <span className="int-eyebrow-dot" />
              Interior Studio
            </p>

            <h2 className="int-heading">
              Rooms that hold<br />
              <em>quiet</em> beauty<br />
              within them
            </h2>

            <div className="int-divider">
              <div className="int-divider-line" />
              <span className="int-divider-leaf">✦</span>
            </div>

            <p className="int-body">
              Our partner designers craft environments where every surface, every shadow, and every proportion works together — spaces that feel inevitable, not decorated.
            </p>

            <ul className="int-features">
              {[
                ["i", "Custom Furniture Design"],
                ["ii", "Lighting & Ambience Planning"],
                ["iii", "Space Optimization Consulting"],
              ].map(([num, label]) => (
                <li className="int-feat" key={num}>
                  <div className="int-feat-left">
                    <span className="int-feat-num">{num}</span>
                    <span className="int-feat-name">{label}</span>
                  </div>
                  <ArrowRight size={12} strokeWidth={1.5} className="int-feat-arrow" />
                </li>
              ))}
            </ul>

            <button className="int-cta" onClick={() => setLocation("/interiors")}>
              <span>Explore Interiors</span>
              <ArrowRight size={13} strokeWidth={1.5} />
            </button>
          </div>

          {/* ── IMAGE PANEL ── */}
          <div className="int-image-panel">
            <img
              src="/interiors/interior-hero.png"
              alt="Interior Design Showcase"
              className="int-img"
            />

            <div className="int-badge">
              <span className="int-badge-num">200+</span>
              <span className="int-badge-label">Projects</span>
            </div>

            <div className="int-caption-strip">
              <span className="int-caption-text">Curated living spaces</span>
              <div className="int-caption-stats">
                <div className="int-stat">
                  <span className="int-stat-val">98%</span>
                  <span className="int-stat-lbl">Satisfaction</span>
                </div>
                <div className="int-stat">
                  <span className="int-stat-val">12yr</span>
                  <span className="int-stat-lbl">Experience</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}