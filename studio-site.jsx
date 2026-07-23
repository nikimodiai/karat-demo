import React, { useState, useEffect, useRef } from "react";

// ─── Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

// ─── Palette (shared with the WhatsApp site) ────────────────────────────
const C = {
  teal: "#0C3A38",
  tealDeep: "#082A29",
  tealDark: "#061F1E",
  tealSoft: "#114B47",
  tealLine: "rgba(216,189,126,0.22)",
  sand: "#E4CFA0",
  sandDeep: "#D8BD7E",
  sandWarm: "#EBDBB5",
  cream: "#F5EFE2",
  creamSoft: "rgba(245,239,226,0.74)",
  creamMute: "rgba(245,239,226,0.5)",
  gold: "#C8956C",
  goldBright: "#DFB48A",
  goldDeep: "#A0643C",
  ink: "#13322F",
  inkSoft: "#2C4A46",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Jost', system-ui, sans-serif";
const goldGrad = "linear-gradient(135deg,#DFB48A 0%,#C8956C 45%,#A0643C 100%)";

const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

const LOGO_LIGHT = "/swarnix-logo.png";

// Studio login → the standalone studio-web on studio.swarnixai.in.
// Uses its OWN env var so it never collides with the WhatsApp site's
// VITE_APP_URL / VITE_FULL_APP_URL. The fallback is the real Studio URL, so
// the login works correctly even if no env var is set in the host.
const STUDIO_APP_URL = import.meta.env.VITE_STUDIO_APP_URL || "https://studio.swarnixai.in";
// Discreet link to the full Inventory + WhatsApp suite marketing page.
const FULL_SUITE_URL = "#/whatsapp";

const LogoLight = ({ h = 50 }) => <img src={LOGO_LIGHT} alt="Swarnix Studio" style={{ height: h, width: "auto", display: "block" }} />;

// ─── Scroll reveal ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}
const Reveal = ({ children, delay = 0, as: Tag = "div", style = {}, ...rest }) => {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(28px)", transition: `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 1.1s cubic-bezier(.2,.7,.2,1) ${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
};

// ─── Decorative ─────────────────────────────────────────────────────────
const Orbit = ({ size = 520, color = C.gold, op = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 520 520" aria-hidden="true" style={{ position: "absolute", opacity: op }}>
    <circle cx="260" cy="260" r="250" fill="none" stroke={color} strokeWidth="0.7" strokeDasharray="2 7" opacity="0.6" />
    <circle cx="260" cy="260" r="200" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
    <circle cx="260" cy="260" r="150" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1 9" opacity="0.45" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={260 + 250 * Math.cos(a)} cy={260 + 250 * Math.sin(a)} r="1.6" fill={color} opacity="0.7" />;
    })}
  </svg>
);
const Sparkle = ({ s = 14, style = {} }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={style}>
    <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill={C.gold} opacity="0.85" />
  </svg>
);
const Hairline = ({ w = 70, m = "0 auto", c = goldGrad }) => <div style={{ width: w, height: 1, background: c, margin: m }} />;
const Label = ({ children, style = {} }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: sans, fontSize: 13, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, ...style }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold }} />
    {children}
  </div>
);

// ─── The six Studio features (copy + media from swarnix-studio-web) ──────
const FEATURES = [
  { label: "Studio Photo", desc: "Turn a plain counter photo into a clean, studio-lit product shot — no lightbox, no photographer.", media: { type: "image", src: "/previews/studio-photo.jpg" } },
  { label: "Metal Swap", desc: "Recolour a piece into yellow, white or rose gold instantly — show every variant without re-shooting.", media: { type: "image", src: "/previews/metal-swap.jpg" } },
  { label: "AI Model", desc: "Put your jewellery on a photorealistic model, ready to post — no shoot, no model booking.", media: { type: "image", src: "/previews/ai-models.jpg" } },
  { label: "Jewellery Design", desc: "Describe a piece or upload a reference and generate a photorealistic render before you make it.", media: { type: "image", src: "/previews/design.jpg" } },
  { label: "Generate Reels", desc: "Turn your photos into a short, shareable video with motion and music — Instagram-ready in a tap.", media: { type: "video", src: "/previews/swarnix-reel.mp4" } },
  { label: "Library", desc: "Every photo and video you've generated, saved privately in one place — download or reshare anytime.", media: { type: "image", src: "/previews/library.png" } },
];

function FeatureMedia({ media }) {
  // Show the whole image/video — no cropping. `contain` on a 4:3 stage keeps
  // every tile the same height while displaying the full asset (letterboxed on
  // a soft teal backdrop when the aspect ratio differs).
  const stage = { width: "100%", aspectRatio: "4 / 3", background: `linear-gradient(160deg, ${C.tealDeep} 0%, ${C.tealDark} 100%)`, display: "block" };
  const fit = { width: "100%", height: "100%", objectFit: "contain", display: "block" };
  if (media?.type === "video") {
    return <div style={stage}><video src={media.src} autoPlay loop muted playsInline style={fit} /></div>;
  }
  return <div style={stage}><img src={media.src} alt="" style={fit} /></div>;
}

const NAV = [["Features", "features"], ["Refer & Earn", "refer"], ["How It Works", "how"], ["Pricing", "pricing"]];

export default function StudioSite() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const goldBtn = {
    fontFamily: sans, fontSize: 14.5, fontWeight: 500, letterSpacing: "0.1em", color: C.tealDark,
    background: goldGrad, border: "none", borderRadius: 2, padding: "13px 28px", cursor: "pointer",
    textTransform: "uppercase", boxShadow: "0 10px 30px rgba(216,189,126,0.25)", transition: "transform .25s, box-shadow .25s",
    textDecoration: "none", display: "inline-flex", alignItems: "center",
  };
  const ghostBtn = {
    fontFamily: sans, fontSize: 14.5, fontWeight: 400, letterSpacing: "0.1em", color: C.cream,
    background: "transparent", border: `1px solid ${C.gold}`, borderRadius: 2, padding: "13px 28px",
    cursor: "pointer", textTransform: "uppercase", transition: "background .25s,color .25s",
    textDecoration: "none", display: "inline-flex", alignItems: "center",
  };
  const h2 = { fontFamily: serif, fontWeight: 500, color: C.cream, lineHeight: 1.06, fontSize: "clamp(34px,4.8vw,58px)", letterSpacing: "-0.01em" };
  const body = { fontFamily: sans, fontWeight: 300, color: C.creamSoft, lineHeight: 1.85, fontSize: 18 };
  const wrap = { maxWidth: 1180, margin: "0 auto", padding: "0 28px" };

  return (
    <div style={{ background: C.teal, color: C.cream, fontFamily: sans, WebkitFontSmoothing: "antialiased", overflowX: "clip", position: "relative" }}>
      <FontLoader />
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: grain, backgroundSize: "180px 180px", pointerEvents: "none", zIndex: 1, opacity: 0.6 }} />

      {/* NAV */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(8,42,41,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.tealLine}` : "1px solid transparent", transition: "all .4s ease"
      }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 118 }}>
          <button onClick={() => go("top")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <LogoLight h={104} />
            <span style={{ fontFamily: serif, fontSize: 27.5, fontWeight: 500, color: C.gold, fontStyle: "italic", letterSpacing: "0.01em" }}>Studio</span>
          </button>
          <nav className="k-desk" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {NAV.map(([t, id]) => (
              <button key={id} onClick={() => go(id)} style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 400, letterSpacing: "0.06em", color: C.creamSoft, background: "none", border: "none", cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = C.creamSoft}>{t}</button>
            ))}
            <a href={STUDIO_APP_URL} className="k-gold-btn" style={goldBtn} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>Login &amp; Start Free</a>
          </nav>
          <button className="k-burger" onClick={() => setOpen(!open)} aria-label="Menu" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 24, height: 1.5, background: C.cream, display: "block" }} />)}
          </button>
        </div>
        {open && (
          <div className="k-mobile" style={{ background: C.tealDeep, borderTop: `1px solid ${C.tealLine}`, padding: "18px 28px 26px" }}>
            {NAV.map(([t, id]) => (<button key={id} onClick={() => go(id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "13px 0", fontFamily: sans, fontSize: 17.5, color: C.cream, background: "none", border: "none", borderBottom: `1px solid ${C.tealLine}`, cursor: "pointer" }}>{t}</button>))}
            <a href={STUDIO_APP_URL} className="k-gold-btn" style={{ ...goldBtn, width: "100%", marginTop: 18, justifyContent: "center" }}>Login &amp; Start Free</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" style={{
        position: "relative", paddingTop: 150, paddingBottom: 56, overflow: "hidden",
        background: `radial-gradient(120% 80% at 80% 0%, ${C.tealSoft} 0%, ${C.teal} 45%, ${C.tealDeep} 100%)`
      }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 120, left: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,189,126,0.16) 0%, transparent 65%)", filter: "blur(20px)", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 80, right: -160, zIndex: 0 }}><Orbit size={620} op={0.55} /></div>
        <Sparkle s={16} style={{ position: "absolute", top: 200, right: 120 }} />
        <Sparkle s={10} style={{ position: "absolute", top: 360, left: 80 }} />
        <div style={{ ...wrap, position: "relative", zIndex: 2 }}>
          <div className="k-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 52, alignItems: "center" }}>
            <div>
              <Reveal><Label>Swarnix Studio — AI Studio Suite for Jewellers</Label></Reveal>
              <Reveal delay={120}>
                <h1 style={{ fontFamily: serif, fontWeight: 500, color: C.cream, lineHeight: 1.02, letterSpacing: "-0.02em", fontSize: "clamp(42px,6.2vw,80px)", margin: "24px 0 0" }}>
                  Studio-quality jewellery photos &amp; reels, <span className="k-shimmer-text" style={{ fontStyle: "italic", fontWeight: 500 }}>in seconds.</span>
                </h1>
              </Reveal>
              <Reveal delay={240}><p style={{ ...body, fontSize: 20, maxWidth: 520, marginTop: 22 }}>Turn plain counter photos into clean studio shots, AI-model campaigns, metal swaps, reels and fresh designs. No lightbox, no photographer, no studio.</p></Reveal>
              <Reveal delay={320}>
                <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "8px 14px", marginTop: 20, padding: "10px 16px", borderRadius: 4, background: "rgba(216,189,126,0.12)", border: `1px solid ${C.tealLine}` }}>
                  <span style={{ fontFamily: serif, fontSize: 21.5, fontWeight: 700, color: C.goldBright }}>₹10<span style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 400, color: C.creamSoft }}> / studio image</span></span>
                  <span style={{ color: C.gold }}>◆</span>
                  <span style={{ fontFamily: serif, fontSize: 21.5, fontWeight: 700, color: C.goldBright }}>Reels from ₹20</span>
                </div>
              </Reveal>
              <Reveal delay={360}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 36 }}>
                  <a href={STUDIO_APP_URL} className="k-gold-btn" style={goldBtn} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>Login &amp; Start with 3 Free Credits</a>
                  <button onClick={() => go("features")} style={ghostBtn} onMouseEnter={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.tealDark; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.cream; }}>See What It Does</button>
                </div>
              </Reveal>
              <Reveal delay={460}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px", marginTop: 40, fontFamily: sans, fontSize: 13, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.creamMute }}>
                  <span>Sign in with Google</span><span style={{ color: C.gold }}>◆</span>
                  <span>No Approval</span><span style={{ color: C.gold }}>◆</span>
                  <span>Pay Per Credit</span>
                </div>
              </Reveal>
            </div>
            <Reveal delay={220}>
              <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.tealLine}`, boxShadow: "0 30px 70px rgba(0,0,0,0.5)", background: `linear-gradient(160deg, ${C.tealDeep} 0%, ${C.tealDark} 100%)` }}>
                <video src="/previews/swarnix-reel.mp4" autoPlay loop muted playsInline style={{ width: "100%", display: "block", maxHeight: 560, objectFit: "contain" }} />
                <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(6,31,30,0.72)", backdropFilter: "blur(6px)", border: `1px solid ${C.tealLine}`, borderRadius: 3, padding: "6px 12px", fontFamily: sans, fontSize: 12.5, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold }}>Made with Swarnix Studio</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICE HIGHLIGHT — right under the hero */}
      <section style={{ padding: "0 0 8px", background: `linear-gradient(180deg, ${C.tealDeep} 0%, ${C.tealDeep} 100%)`, position: "relative", zIndex: 3 }}>
        <div style={{ ...wrap, marginTop: -28 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.sandWarm} 0%, ${C.sand} 55%, ${C.sandDeep} 100%)`, borderRadius: 12, padding: "clamp(22px,3vw,30px) clamp(24px,4vw,44px)", boxShadow: "0 26px 60px rgba(0,0,0,0.45)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", top: 16, right: 22 }}><Sparkle s={18} /></div>
            <div className="k-priceband" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 28, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldDeep, marginBottom: 8 }}>Studio Image</div>
                <div style={{ fontFamily: serif, fontWeight: 700, color: C.ink, lineHeight: 1, fontSize: "clamp(34px,5vw,52px)" }}>₹10 <span style={{ fontSize: "0.42em", fontWeight: 500, color: C.inkSoft, letterSpacing: "0.02em" }}>per image</span></div>
                <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 400, color: C.inkSoft, marginTop: 8, lineHeight: 1.5 }}>The cost of a single colour printout — for a studio-quality photo.</div>
              </div>
              <div aria-hidden="true" className="k-priceband-div" style={{ width: 1, height: 78, background: "rgba(19,50,47,0.25)", justifySelf: "center" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldDeep, marginBottom: 8 }}>Reels</div>
                <div style={{ fontFamily: serif, fontWeight: 700, color: C.ink, lineHeight: 1, fontSize: "clamp(34px,5vw,52px)" }}>from ₹20</div>
                <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 400, color: C.inkSoft, marginTop: 8, lineHeight: 1.5 }}>A short, shareable reel with motion and music — Instagram-ready.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "56px 0", background: C.tealDeep, position: "relative" }}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
            <Label>The Cost of Great Photos</Label>
            <h2 style={{ ...h2, margin: "18px 0 16px" }}>Beautiful jewellery, <span style={{ fontStyle: "italic", color: C.gold }}>ordinary photos.</span></h2>
            <p style={{ ...body, maxWidth: 620, margin: "0 auto" }}>Your pieces deserve better than a counter snapshot — but a photographer, a model shoot and a lightbox cost time and money you'd rather spend selling.</p>
          </Reveal>
          <div className="k-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {[["Shoots are slow and costly", "Every new piece means lighting, a photographer and edits before it can go online."],
            ["Models cost even more", "A model campaign for a festival collection can run into tens of thousands — per shoot."],
            ["Content never keeps up", "Instagram and WhatsApp want fresh photos and reels constantly. Manual shoots can't match the pace."]].map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div style={{ background: `linear-gradient(160deg, ${C.tealSoft} 0%, ${C.tealDeep} 100%)`, border: `1px solid ${C.tealLine}`, borderRadius: 6, padding: "30px 26px", height: "100%", boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>
                  <div style={{ width: 32, height: 1.5, background: goldGrad, marginBottom: 18 }} />
                  <h3 style={{ fontFamily: serif, fontSize: 25.5, fontWeight: 600, color: C.cream, margin: "0 0 12px", lineHeight: 1.2 }}>{t}</h3>
                  <p style={{ ...body, fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "56px 0", background: C.teal, position: "relative" }}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center", maxWidth: 770, margin: "0 auto 40px" }}>
            <Label>The Studio Suite</Label>
            <h2 style={{ ...h2, margin: "18px 0 18px" }}>Six tools, <span style={{ fontStyle: "italic", color: C.gold }}>one login.</span></h2>
            <p style={{ ...body, maxWidth: 660, margin: "0 auto" }}>Every tool is built for jewellery — it understands metal, stones and the way a piece needs to catch the light. Upload a photo, and get back something you can post today.</p>
          </Reveal>
          <div className="k-features" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {FEATURES.map((ft, i) => (
              <Reveal key={ft.label} delay={(i % 3) * 90}>
                <div style={{ background: `linear-gradient(165deg, ${C.tealSoft} 0%, ${C.tealDeep} 100%)`, border: `1px solid ${C.tealLine}`, borderRadius: 8, overflow: "hidden", height: "100%", boxShadow: "0 20px 46px rgba(0,0,0,0.26)", display: "flex", flexDirection: "column" }}>
                  <FeatureMedia media={ft.media} />
                  <div style={{ padding: "22px 24px 26px" }}>
                    <h3 style={{ fontFamily: serif, fontSize: 26.5, fontWeight: 600, color: C.gold, margin: "0 0 10px" }}>{ft.label}</h3>
                    <p style={{ ...body, fontSize: 16, lineHeight: 1.65, margin: 0 }}>{ft.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REFER & EARN — prominent growth band */}
      <section id="refer" style={{ padding: "56px 0", background: C.tealDeep, position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -140, right: -140, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,189,126,0.14) 0%, transparent 65%)", filter: "blur(10px)", zIndex: 0 }} />
        <div style={{ ...wrap, position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ background: `linear-gradient(135deg, ${C.sandWarm} 0%, ${C.sand} 55%, ${C.sandDeep} 100%)`, borderRadius: 12, padding: "clamp(30px,5vw,52px)", boxShadow: "0 30px 70px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", top: 20, right: 26 }}><Sparkle s={22} /></div>
              <div className="k-refer" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.goldDeep, marginBottom: 16 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.goldDeep }} />Refer &amp; Earn
                  </div>
                  <h2 style={{ fontFamily: serif, fontWeight: 600, color: C.ink, lineHeight: 1.05, fontSize: "clamp(30px,4.4vw,52px)", letterSpacing: "-0.01em", margin: "0 0 14px" }}>Invite a jeweller — <span style={{ fontStyle: "italic", color: C.goldDeep }}>you both get 10 free credits.</span></h2>
                  <p style={{ fontFamily: sans, fontWeight: 300, color: C.inkSoft, lineHeight: 1.75, fontSize: 18, margin: "0 0 26px", maxWidth: 520 }}>Share your referral link with a fellow jeweller. When they make their first purchase, ten credits land in each of your accounts — enough for a full set of studio photos or a reel, on the house.</p>
                  <a href={STUDIO_APP_URL} className="k-gold-btn" style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 600, letterSpacing: "0.1em", color: C.cream, background: "linear-gradient(135deg,#13322F,#082A29)", border: "none", borderRadius: 3, padding: "15px 34px", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 12px 30px rgba(6,31,30,0.35)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Get Your Referral Link</a>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {[["You", "+10"], ["Them", "+10"]].map(([who, amt], i) => (
                      <React.Fragment key={who}>
                        {i === 1 && <div style={{ fontFamily: serif, fontSize: 35.5, color: C.goldDeep, padding: "0 6px" }}>+</div>}
                        <div style={{ width: 128, height: 128, borderRadius: "50%", background: C.tealDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(6,31,30,0.4)", border: `2px solid ${C.goldBright}` }}>
                          <div style={{ fontFamily: serif, fontSize: 41.5, fontWeight: 700, color: C.goldBright, lineHeight: 1 }}>{amt}</div>
                          <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.creamMute, marginTop: 6 }}>{who}</div>
                          <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.creamMute, marginTop: 2 }}>Credits</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "56px 0", background: C.teal }}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
            <Label>How It Works</Label>
            <h2 style={{ ...h2, margin: "18px 0 14px" }}>From counter photo to campaign, <span style={{ fontStyle: "italic", color: C.gold }}>in three steps.</span></h2>
            <p style={{ ...body, margin: 0 }}>No onboarding, no setup call, no team visit. Sign in and you're working in under a minute.</p>
          </Reveal>
          <div className="k-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {[["1", "Sign in with Google", "One click, no approval and no waiting. Your account comes with 3 free credits to try any tool."],
            ["2", "Upload & generate", "Drop in a product photo, pick a tool, and Studio returns a polished shot, model image or reel."],
            ["3", "Download & post", "Save it to your Library, download it, and share straight to Instagram or WhatsApp."]].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 120}>
                <div style={{ position: "relative", padding: "44px 28px 30px", background: `linear-gradient(165deg, ${C.tealSoft} 0%, ${C.tealDeep} 100%)`, border: `1px solid ${C.tealLine}`, borderRadius: 6, height: "100%", boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>
                  <div style={{ position: "absolute", top: -26, left: 28, width: 52, height: 52, borderRadius: "50%", background: goldGrad, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 25.5, fontWeight: 600, color: C.tealDark, boxShadow: "0 10px 26px rgba(216,189,126,0.35)" }}>{n}</div>
                  <h3 style={{ fontFamily: serif, fontSize: 27.5, fontWeight: 600, color: C.cream, margin: "8px 0 12px" }}>{t}</h3>
                  <p style={{ ...body, fontSize: 17, margin: 0 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "56px 0", background: C.teal, position: "relative" }}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 44px" }}>
            <Label>Pricing</Label>
            <h2 style={{ ...h2, margin: "18px 0 14px" }}>Pay only for <span style={{ fontStyle: "italic", color: C.gold }}>what you create.</span></h2>
            <p style={{ ...body, maxWidth: 560, margin: "0 auto" }}>No monthly commitment. Start free, then top up credits whenever you need them — one credit is one generation.</p>
          </Reveal>
          <div className="k-price2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 820, margin: "0 auto" }}>
            <Reveal>
              <div style={{ background: `linear-gradient(165deg, ${C.tealSoft} 0%, ${C.tealDeep} 100%)`, border: `1px solid ${C.tealLine}`, borderRadius: 8, padding: "36px 30px", height: "100%", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,0.22)" }}>
                <h3 style={{ fontFamily: serif, fontSize: 29.5, fontWeight: 600, color: C.cream, margin: "0 0 6px" }}>Start Free</h3>
                <div style={{ fontFamily: serif, fontSize: 47.5, fontWeight: 600, color: C.gold, lineHeight: 1.1, margin: "10px 0 4px" }}>3 credits</div>
                <p style={{ ...body, fontSize: 15.5, margin: "0 0 24px", color: C.creamMute }}>free on sign-up · no card needed</p>
                <a href={STUDIO_APP_URL} className="k-gold-btn" style={{ ...goldBtn, width: "100%", justifyContent: "center" }}>Sign in with Google</a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ background: `linear-gradient(165deg, ${C.sandWarm} 0%, ${C.sand} 100%)`, borderRadius: 8, padding: "36px 30px", height: "100%", textAlign: "center", boxShadow: "0 28px 64px rgba(0,0,0,0.4)" }}>
                <h3 style={{ fontFamily: serif, fontSize: 29.5, fontWeight: 600, color: C.ink, margin: "0 0 6px" }}>Top Up Anytime</h3>
                <div style={{ fontFamily: serif, fontSize: 47.5, fontWeight: 600, color: C.goldDeep, lineHeight: 1.1, margin: "10px 0 4px" }}>Buy credits</div>
                <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 15.5, margin: "0 0 24px", color: C.inkSoft }}>secure Razorpay checkout · credit packs</p>
                <a href={STUDIO_APP_URL} className="k-gold-btn" style={{ ...goldBtn, width: "100%", justifyContent: "center", background: "linear-gradient(135deg,#13322F,#082A29)", color: C.cream }}>Go to Studio</a>
              </div>
            </Reveal>
          </div>
          <Reveal style={{ marginTop: 26 }}><p style={{ ...body, fontSize: 15.5, textAlign: "center", maxWidth: 620, margin: "0 auto", color: C.creamMute }}>One credit = one generated image. Reels use a few credits each. Credits never expire — use them across all six tools.</p></Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "64px 0", background: `radial-gradient(80% 120% at 50% 0%, ${C.tealSoft} 0%, ${C.tealDeep} 55%, ${C.tealDark} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)" }}><Orbit size={680} op={0.4} /></div>
        <div style={{ ...wrap, textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Sparkle s={28} style={{ marginBottom: 4 }} />
            <h2 style={{ fontFamily: serif, fontWeight: 500, color: C.cream, fontSize: "clamp(36px,5.2vw,60px)", lineHeight: 1.06, margin: "18px 0 16px" }}>Your next campaign is <span style={{ fontStyle: "italic", color: C.gold }}>one login away.</span></h2>
            <p style={{ fontFamily: sans, fontWeight: 300, color: C.creamSoft, fontSize: 18, letterSpacing: "0.02em", marginBottom: 38 }}>Sign in with Google • 3 free credits • Start creating in under a minute.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              <a href={STUDIO_APP_URL} className="k-gold-btn" style={{ ...goldBtn, padding: "16px 42px", fontSize: 14 }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>Login &amp; Start Free</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MORE IN THE FULL SUITE — WhatsApp catalog, posters, gold rate */}
      <section style={{ padding: "56px 0", background: C.tealDeep, position: "relative" }}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 36px" }}>
            <Label>Beyond Studio — The Full Swarnix Suite</Label>
            <h2 style={{ ...h2, margin: "18px 0 14px" }}>Run the whole shop, <span style={{ fontStyle: "italic", color: C.gold }}>not just the photos.</span></h2>
            <p style={{ ...body, maxWidth: 620, margin: "0 auto" }}>Studio is one part of Swarnix. The complete suite adds a WhatsApp AI sales agent, live inventory and everyday marketing your shop can send in a tap.</p>
          </Reveal>
          <div className="k-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {[["WhatsApp Catalog", "Your live stock — with weights, purity and prices — sent to customers on WhatsApp, always up to date with the metal rate."],
            ["Festival Posters", "Ready-made, on-brand posters for every festival and occasion — personalised with your shop name and pieces, ready to post."],
            ["Daily Gold Rate Sharing", "Share the day's gold and silver rates with your customers automatically, in a clean branded card — no manual updates."]].map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div style={{ background: `linear-gradient(160deg, ${C.tealSoft} 0%, ${C.tealDeep} 100%)`, border: `1px solid ${C.tealLine}`, borderRadius: 6, padding: "30px 26px", height: "100%", boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>
                  <div style={{ width: 32, height: 1.5, background: goldGrad, marginBottom: 18 }} />
                  <h3 style={{ fontFamily: serif, fontSize: 25.5, fontWeight: 600, color: C.cream, margin: "0 0 12px", lineHeight: 1.2 }}>{t}</h3>
                  <p style={{ ...body, fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: "center", marginTop: 34 }}>
            <a href={FULL_SUITE_URL} style={{ fontFamily: sans, fontSize: 15.5, fontWeight: 500, letterSpacing: "0.06em", color: C.gold, textDecoration: "none", border: `1px solid ${C.gold}`, borderRadius: 2, padding: "13px 30px", display: "inline-flex", alignItems: "center", textTransform: "uppercase" }} onMouseEnter={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.tealDark; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gold; }}>Explore the full Swarnix Inventory + WhatsApp suite →</a>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.tealDark, padding: "50px 0 42px", borderTop: `1px solid ${C.tealLine}` }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <Hairline w={72} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "26px 0 14px" }}>
            <LogoLight h={70} />
            <span style={{ fontFamily: serif, fontSize: 21.5, fontWeight: 500, color: C.gold, fontStyle: "italic" }}>Studio</span>
          </div>
          <p style={{ fontFamily: sans, fontSize: 16, fontWeight: 300, color: C.creamMute, lineHeight: 1.9, margin: 0 }}>
            Nelishka AI Solutions &nbsp;•&nbsp; Mumbai, India<br />
            <a href="https://www.nelishkaai.in" target="_blank" rel="noopener noreferrer" style={{ color: C.creamMute, textDecoration: "none" }}>www.nelishkaai.in</a>
          </p>
          <p style={{ fontFamily: sans, fontSize: 12.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, marginTop: 22 }}>Swarnix Studio</p>
        </div>
      </footer>

      <style>{`
        *{box-sizing:border-box;margin:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:${C.gold};color:${C.tealDark};}

        .k-gold-btn{position:relative;overflow:hidden;}
        .k-gold-btn::after{
          content:"";position:absolute;top:0;left:-150%;width:60%;height:100%;
          background:linear-gradient(100deg,transparent 0%,rgba(255,250,235,0.55) 50%,transparent 100%);
          transform:skewX(-18deg);
          animation:kshine 5.5s ease-in-out infinite;
        }
        .k-gold-btn:hover::after{animation:kshine 0.9s ease-in-out;}
        @keyframes kshine{0%{left:-150%;}18%{left:150%;}100%{left:150%;}}

        .k-shimmer-text{
          background:linear-gradient(100deg,#A0643C 0%,#C8956C 30%,#F0C9A0 48%,#C8956C 66%,#A0643C 100%);
          background-size:200% 100%;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;color:transparent;
          animation:ksweep 3.4s ease-out 0.4s 1 both;
        }
        @keyframes ksweep{0%{background-position:120% 0;}100%{background-position:-20% 0;}}
        @media(prefers-reduced-motion:reduce){
          .k-gold-btn::after,.k-shimmer-text{animation:none!important;}
          .k-shimmer-text{background-position:50% 0;}
        }

        @media(max-width:920px){
          .k-desk{display:none!important;}
          .k-burger{display:flex!important;}
          .k-hero-grid{grid-template-columns:1fr!important;gap:40px!important;}
          .k-features{grid-template-columns:1fr 1fr!important;}
          .k-grid-3{grid-template-columns:1fr!important;}
          .k-refer{grid-template-columns:1fr!important;gap:32px!important;text-align:center;}
          .k-refer > div:first-child p{margin-left:auto!important;margin-right:auto!important;}
        }
        @media(max-width:600px){
          .k-features{grid-template-columns:1fr!important;}
          .k-price2{grid-template-columns:1fr!important;}
          .k-priceband{grid-template-columns:1fr!important;gap:20px!important;text-align:center!important;}
          .k-priceband > div{text-align:center!important;}
          .k-priceband-div{width:64px!important;height:1px!important;}
        }
      `}</style>
    </div>
  );
}
