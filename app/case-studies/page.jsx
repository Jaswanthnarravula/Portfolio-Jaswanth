"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Accessibility,
  Compass,
  Layers,
  MousePointerClick,
  PenTool,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "../components/MagneticButton";
import PageContainer from "../components/PageContainer";
import RevealText from "../components/RevealText";
import { caseStudies } from "../data/caseStudies";

const EASE_OUT = [0.16, 1, 0.3, 1];

const disciplines = [
  { icon: Compass, label: "UX Research" },
  { icon: MousePointerClick, label: "Interaction Design" },
  { icon: Layers, label: "Design Systems" },
  { icon: Wand2, label: "Motion" },
  { icon: Accessibility, label: "Accessibility" },
];

const processSteps = [
  { step: "01", title: "Listen", detail: "Interviews, analytics, and friction maps before a single pixel." },
  { step: "02", title: "Architect", detail: "Flows and information hierarchy — the invisible 80% of UX." },
  { step: "03", title: "Design", detail: "Interfaces built on tokens, rhythm, and typographic restraint." },
  { step: "04", title: "Animate", detail: "Motion that explains state changes instead of decorating them." },
  { step: "05", title: "Validate", detail: "Usability tests and metrics close the loop on every decision." },
];

/* ------------------------------------------------------------------ */
/* 3D tilt stage: pointer-driven rotation with springs; inner layers   */
/* sit at different translateZ depths so the tilt parallaxes them.     */
/* ------------------------------------------------------------------ */
function TiltStage({ children, disabled, maxTilt = 9 }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 16, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 16, mass: 0.4 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);

  const handlePointerMove = (event) => {
    if (disabled) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: "1100px" }}
    >
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Small glass pill that floats at a given 3D depth inside a TiltStage. */
function FloatingChip({ children, depth = 70, top, left, right, bottom, delay = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        transform: `translateZ(${depth}px)`,
        transformStyle: "preserve-3d",
        zIndex: 4,
      }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.32)",
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 14px 34px rgba(2,6,23,0.35)",
          color: "#f8fafc",
          padding: "8px 14px",
          fontSize: 12.5,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Abstract product mock built from glass layers — no images needed. */
function DeviceMock({ study, disabled }) {
  const { mock, accent } = study;
  const isPhone = mock.kind === "phone";

  return (
    <TiltStage disabled={disabled}>
      <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
        {/* Backing glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-12%",
            background: `radial-gradient(circle at 50% 42%, ${accent}55 0%, transparent 66%)`,
            filter: "blur(34px)",
            transform: "translateZ(-40px)",
          }}
        />

        {/* Frame */}
        <div
          style={{
            position: "relative",
            width: isPhone ? "min(280px, 74vw)" : "min(420px, 84vw)",
            marginInline: "auto",
            borderRadius: isPhone ? 34 : 18,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            boxShadow: "0 40px 80px rgba(2,6,23,0.5), inset 0 1px 0 rgba(255,255,255,0.28)",
            padding: isPhone ? "16px 16px 22px" : "14px 16px 20px",
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Chrome: notch or browser bar */}
          {isPhone ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 86, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.28)" }} />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              {["#fb7185", "#fbbf24", "#34d399"].map((dot) => (
                <span key={dot} style={{ width: 9, height: 9, borderRadius: "50%", background: dot, opacity: 0.9 }} />
              ))}
              <div style={{ flex: 1, marginLeft: 8, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.16)" }} />
            </div>
          )}

          {/* Content layer */}
          <div style={{ transform: "translateZ(26px)", transformStyle: "preserve-3d" }}>
            <p style={{ margin: 0, color: "rgba(248,250,252,0.78)", fontSize: 12.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {mock.headline}
            </p>
            <p style={{ margin: "8px 0 2px", color: "#ffffff", fontSize: isPhone ? 34 : 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {mock.stat}
            </p>
            <p style={{ margin: 0, color: "rgba(226,232,240,0.7)", fontSize: 13 }}>{mock.statLabel}</p>

            {/* Bar chart */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: isPhone ? 84 : 104,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(2,6,23,0.28)",
                padding: "12px 12px 10px",
              }}
            >
              {mock.bars.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 + index * 0.07 }}
                  style={{
                    flex: 1,
                    height: `${value}%`,
                    transformOrigin: "bottom",
                    borderRadius: 6,
                    background:
                      index === mock.bars.indexOf(Math.max(...mock.bars))
                        ? accent
                        : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>

            {/* Skeleton rows */}
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              {[76, 58, 66].map((width, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 8, background: `${accent}44`, flexShrink: 0 }} />
                  <span style={{ width: `${width}%`, height: 9, borderRadius: 999, background: "rgba(255,255,255,0.22)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating annotations at higher depth */}
        <FloatingChip depth={86} top={isPhone ? "14%" : "18%"} right={isPhone ? "-8%" : "-6%"} delay={0.3}>
          <Sparkles size={13} style={{ color: accent }} />
          {study.tags[0]}
        </FloatingChip>
        <FloatingChip depth={64} bottom="12%" left={isPhone ? "-10%" : "-7%"} delay={1.1}>
          <PenTool size={13} style={{ color: accent }} />
          {study.tags[1]}
        </FloatingChip>
      </div>
    </TiltStage>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky deck card: pins full-screen, then recedes in 3D (scale down, */
/* tip back, dim) while the next study scrolls up over it.             */
/* ------------------------------------------------------------------ */
function DeckCard({ study, index, total, deckProgress, isMobile }) {
  const segment = 1 / (total - 1);
  const start = index * segment;
  const end = Math.min(1, start + segment);

  const scale = useTransform(deckProgress, [start, end], [1, 0.9]);
  const rotateX = useTransform(deckProgress, [start, end], [0, -7]);
  const y = useTransform(deckProgress, [start, end], [0, -34]);
  const dim = useTransform(deckProgress, [start, end], [0, 0.55]);

  const isLast = index === total - 1;

  const panel = (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: EASE_OUT }}
      whileHover="hover"
      style={{
        position: "relative",
        width: "min(1240px, 94vw)",
        borderRadius: 30,
        overflow: "hidden",
        background: study.gradient,
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 46px 110px rgba(2,6,23,0.5)",
        scale: isMobile || isLast ? 1 : scale,
        rotateX: isMobile || isLast ? 0 : rotateX,
        y: isMobile || isLast ? 0 : y,
        transformOrigin: "50% 18%",
        willChange: "transform",
      }}
    >
      {/* Dimmer that fades in as the card recedes */}
      {isMobile || isLast ? null : (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "#02040a",
            opacity: dim,
            zIndex: 6,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Shine sweep on hover */}
      <motion.div
        aria-hidden
        variants={{ hover: { x: "160%" } }}
        initial={{ x: "-160%" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "42%",
          background:
            "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.09) 46%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.09) 54%, transparent 100%)",
          transform: "skewX(-12deg)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Ambient texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(255,255,255,0.1) 0%, transparent 34%), radial-gradient(circle at 8% 90%, rgba(255,255,255,0.07) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: isMobile ? 6 : -12,
          right: isMobile ? 10 : 26,
          fontSize: isMobile ? 110 : "clamp(160px, 19vw, 250px)",
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: "1.4px rgba(255,255,255,0.14)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {study.index}
      </span>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
          gap: isMobile ? 30 : 44,
          alignItems: "center",
          padding: isMobile ? "28px 22px 34px" : "clamp(34px, 4.2vw, 58px)",
        }}
      >
        {/* Copy column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
            style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: `1px solid ${study.accent}66`,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "#ffffff",
                padding: "7px 13px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: study.accent, boxShadow: `0 0 10px ${study.accent}` }} />
              {study.category}
            </span>
            <span style={{ color: "rgba(226,232,240,0.66)", fontSize: 13, fontWeight: 600 }}>{study.year}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.14 }}
            style={{
              margin: "18px 0 0",
              color: "#ffffff",
              fontSize: isMobile ? 44 : "clamp(50px, 6vw, 82px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
            }}
          >
            {study.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
            style={{ margin: "14px 0 0", color: "rgba(248,250,252,0.94)", fontSize: isMobile ? 17 : "clamp(17px, 1.7vw, 22px)", lineHeight: 1.5, fontWeight: 500, maxWidth: 520 }}
          >
            {study.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.26 }}
            style={{ margin: "12px 0 0", color: "rgba(203,213,225,0.8)", fontSize: 15, lineHeight: 1.66, maxWidth: 540 }}
          >
            {study.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.32 }}
            style={{ marginTop: 18, display: "grid", gap: 9 }}
          >
            {study.approach.map((point) => (
              <p key={point} style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 9, color: "rgba(226,232,240,0.9)", fontSize: 14, lineHeight: 1.5 }}>
                <ArrowRight size={15} style={{ color: study.accent, flexShrink: 0, marginTop: 2 }} />
                {point}
              </p>
            ))}
          </motion.div>

          {/* Outcome stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.38 }}
            style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}
          >
            {study.outcomes.map((outcome) => (
              <div
                key={outcome.label}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  padding: "12px 12px",
                }}
              >
                <p style={{ margin: 0, color: "#ffffff", fontSize: isMobile ? 20 : 24, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                  {outcome.value}
                </p>
                <p style={{ margin: "5px 0 0", color: "rgba(203,213,225,0.72)", fontSize: 11.5, lineHeight: 1.4 }}>{outcome.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}
          >
            {study.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ y: -3, background: "rgba(255,255,255,0.16)" }}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(241,245,249,0.92)",
                  padding: "6px 12px",
                  fontSize: 12.5,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Mock column */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
          style={{ position: "relative", paddingBlock: isMobile ? 6 : 12 }}
        >
          <DeviceMock study={study} disabled={isMobile} />
        </motion.div>
      </div>

      {/* Role footer */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: isMobile ? "14px 22px" : "16px clamp(34px, 4.2vw, 58px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: 0, color: "rgba(203,213,225,0.75)", fontSize: 13.5 }}>{study.role}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#ffffff", fontSize: 13.5, fontWeight: 600 }}>
          Placeholder case study
          <ArrowUpRight size={15} style={{ color: study.accent }} />
        </span>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
        {panel}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1500px",
      }}
    >
      {panel}
    </div>
  );
}

export default function CaseStudiesPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 900;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  // Hero parallax: layered elements drift at different rates.
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 640], [0, 130]);
  const heroOpacity = useTransform(scrollY, [0, 460], [1, 0]);
  const orbNearY = useTransform(scrollY, [0, 900], [0, 220]);
  const orbFarY = useTransform(scrollY, [0, 900], [0, 90]);

  // Deck progress drives every card's recede choreography.
  const deckRef = useRef(null);
  const { scrollYProgress: deckProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* ------------------------------ Hero ------------------------------ */}
      <section
        style={{
          position: "relative",
          minHeight: isMobile ? "auto" : "78vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingBlock: isMobile ? 30 : 46,
        }}
      >
        {/* Depth orbs */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "4%",
            right: "6%",
            width: isMobile ? 200 : 380,
            height: isMobile ? 200 : 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 68%)",
            filter: "blur(30px)",
            y: orbNearY,
            pointerEvents: "none",
          }}
        />
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-6%",
            left: "-4%",
            width: isMobile ? 220 : 420,
            height: isMobile ? 220 : 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,132,252,0.18) 0%, transparent 68%)",
            filter: "blur(36px)",
            y: orbFarY,
            pointerEvents: "none",
          }}
        />

        <PageContainer style={{ position: "relative", paddingTop: isMobile ? 26 : 36 }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(37,99,235,0.28)",
                padding: "8px 14px",
                background: "rgba(37,99,235,0.08)",
                color: "var(--accent-blue)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={14} />
              UI/UX Case Studies
            </motion.p>

            <div style={{ marginTop: 18 }}>
              <RevealText
                text="Design, engineered."
                as="h1"
                delay={0.12}
                stagger={0.08}
                style={{
                  fontSize: "clamp(46px, 9.5vw, 104px)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.045em",
                  color: "var(--text-primary)",
                }}
              />
              <RevealText
                text="Interfaces that explain themselves."
                as="p"
                delay={0.3}
                stagger={0.05}
                style={{
                  marginTop: 6,
                  fontSize: "clamp(28px, 5vw, 56px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.035em",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.55 }}
              style={{ marginTop: 22, maxWidth: 760, color: "var(--text-secondary)", fontSize: "clamp(16px, 2vw, 21px)", lineHeight: 1.62 }}
            >
              Selected explorations in product design — research-led, motion-aware, and
              obsessive about the details users feel but never notice. Each study below is
              a placeholder ready to be swapped for shipped work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.7 }}
              style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 10 }}
            >
              {disciplines.map((discipline, index) => {
                const Icon = discipline.icon;
                return (
                  <motion.span
                    key={discipline.label}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.8 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
                    whileHover={{ scale: 1.06 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 999,
                      border: "1px solid var(--border-light)",
                      background: "var(--surface-pill)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      color: "var(--text-primary)",
                      padding: "9px 15px",
                      fontSize: 13.5,
                      fontWeight: 500,
                    }}
                  >
                    <Icon size={15} style={{ color: "var(--accent-blue)" }} />
                    {discipline.label}
                  </motion.span>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 13.5 }}
            >
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <ArrowDown size={16} />
              </motion.span>
              {caseStudies.length} studies · scroll to descend through the deck
            </motion.div>
          </motion.div>
        </PageContainer>
      </section>

      {/* --------------------------- Sticky deck --------------------------- */}
      <section ref={deckRef} style={{ position: "relative" }}>
        {caseStudies.map((study, index) => (
          <DeckCard
            key={study.id}
            study={study}
            index={index}
            total={caseStudies.length}
            deckProgress={deckProgress}
            isMobile={isMobile}
          />
        ))}
      </section>

      {/* --------------------------- Process strip ------------------------- */}
      <section style={{ paddingBlock: isMobile ? 56 : 96 }}>
        <PageContainer>
          <RevealText
            text="How the work gets this polished."
            as="h2"
            style={{
              fontSize: "clamp(32px, 5.6vw, 58px)",
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              color: "var(--text-primary)",
              marginBottom: 14,
            }}
          />
          <p style={{ margin: "0 0 36px", maxWidth: 640, color: "var(--text-secondary)", fontSize: "clamp(15px, 1.9vw, 19px)", lineHeight: 1.6 }}>
            Every study runs the same five-stage loop — the same rigor I bring to backend
            systems, pointed at pixels.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, ease: EASE_OUT, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                style={{
                  borderRadius: 18,
                  border: "1px solid var(--border-light)",
                  background: "var(--surface-gradient)",
                  padding: "18px 16px",
                  perspective: "800px",
                }}
              >
                <p style={{ margin: 0, color: "var(--accent-blue)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em" }}>{step.step}</p>
                <h3 style={{ margin: "10px 0 8px", fontSize: 21, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{step.title}</h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.55 }}>{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ------------------------------- CTA ------------------------------- */}
      <section style={{ paddingBlock: isMobile ? 30 : 50, paddingBottom: isMobile ? 60 : 90 }}>
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "linear-gradient(130deg, #0b1226 0%, #14306e 48%, #4c1d95 100%)",
              padding: isMobile ? "36px 24px" : "56px 54px",
              textAlign: "center",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 22% 18%, rgba(96,165,250,0.3) 0%, transparent 42%), radial-gradient(circle at 82% 86%, rgba(192,132,252,0.26) 0%, transparent 44%)",
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                position: "relative",
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(30px, 5.4vw, 54px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
              }}
            >
              Have a product that deserves this treatment?
            </h2>
            <p style={{ position: "relative", margin: "14px auto 0", maxWidth: 560, color: "rgba(226,232,240,0.82)", fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.6 }}>
              These placeholders show the bar. Swap in your product and let&apos;s raise it.
            </p>
            <div style={{ position: "relative", marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <MagneticButton>
                <Link
                  href="/contact"
                  data-cursor="hover"
                  style={{
                    minHeight: 50,
                    borderRadius: 999,
                    padding: "13px 26px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Start a conversation
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/projects"
                  data-cursor="hover"
                  style={{
                    minHeight: 50,
                    borderRadius: 999,
                    padding: "13px 26px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.34)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "#ffffff",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  See engineering projects
                  <ArrowUpRight size={16} />
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </>
  );
}
