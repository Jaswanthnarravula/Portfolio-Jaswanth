"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ExternalLink, Github, Sparkles } from "lucide-react";
import { useRef } from "react";
import PageContainer from "./PageContainer";
import { primaryTechStack, profileIdentity } from "../data/profile";

const PORTRAIT_SRC = "/profile/portrait.jpg";

const previewChips = [
  "MS Computer Science · UAB",
  "Open to Software Engineering roles",
  ...primaryTechStack.slice(0, 3),
];

export default function CinematicPortrait({ isMobile }) {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven parallax — each layer moves at its own rate for real depth.
  const ambientY = useTransform(scrollYProgress, [0, 1], [isMobile ? -20 : -60, isMobile ? 20 : 90]);
  const echoY = useTransform(scrollYProgress, [0, 1], [isMobile ? 40 : 120, isMobile ? -40 : -120]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [isMobile ? 26 : 70, isMobile ? -26 : -80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -48]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.62, 0.5, 0.82]);

  // Pointer-driven parallax — springy follow for silky, weighted motion.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.5 });

  const r = isMobile ? 0 : 1;
  const portraitTX = useTransform(sx, [-0.5, 0.5], [-18 * r, 18 * r]);
  const portraitTY = useTransform(sy, [-0.5, 0.5], [-12 * r, 12 * r]);
  const portraitRotY = useTransform(sx, [-0.5, 0.5], [8 * r, -8 * r]);
  const portraitRotX = useTransform(sy, [-0.5, 0.5], [-6 * r, 6 * r]);
  const echoTX = useTransform(sx, [-0.5, 0.5], [40 * r, -40 * r]);
  const echoTY = useTransform(sy, [-0.5, 0.5], [26 * r, -26 * r]);
  const orbOneX = useTransform(sx, [-0.5, 0.5], [-60 * r, 60 * r]);
  const orbOneY = useTransform(sy, [-0.5, 0.5], [-40 * r, 40 * r]);
  const orbTwoX = useTransform(sx, [-0.5, 0.5], [50 * r, -50 * r]);
  const orbTwoY = useTransform(sy, [-0.5, 0.5], [36 * r, -36 * r]);
  const contentTX = useTransform(sx, [-0.5, 0.5], [10 * r, -10 * r]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["30%", "70%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["30%", "70%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(60% 50% at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 70%)`,
  );

  const handlePointerMove = (event) => {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  });

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        isolation: "isolate",
        background:
          "radial-gradient(120% 120% at 78% 18%, #0a1226 0%, #05060d 52%, #030409 100%)",
        paddingBlock: isMobile ? 72 : 0,
      }}
    >
      {/* Layer 0 — slowly rotating gradient mesh for living ambience */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          className="cine-mesh"
          style={{
            position: "absolute",
            inset: "-40%",
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(37,99,235,0.22), rgba(20,184,166,0.16), rgba(139,92,246,0.2), rgba(37,99,235,0.22))",
            filter: "blur(90px)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Layer 1 — blurred full-bleed ambient wash of the portrait (color only) */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", inset: -80, zIndex: 0, y: ambientY, pointerEvents: "none" }}
      >
        <div className="cine-breathe" style={{ position: "absolute", inset: 0 }}>
          <Image
            src={PORTRAIT_SRC}
            alt=""
            fill
            aria-hidden
            quality={40}
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "blur(46px) brightness(0.42) saturate(1.25)",
              transform: "scale(1.15)",
            }}
          />
        </div>
      </motion.div>

      {/* Layer 2 — glowing drifting orbs */}
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { x: [-24, 34, -24], y: [0, -26, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", zIndex: 1, top: "-8%", left: isMobile ? "-20%" : "2%",
          width: isMobile ? 260 : 480, height: isMobile ? 260 : 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)",
          filter: "blur(60px)", mixBlendMode: "screen", x: orbOneX, y: orbOneY, pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { x: [10, -34, 10], y: [0, 28, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        style={{
          position: "absolute", zIndex: 1, bottom: "-14%", right: isMobile ? "-24%" : "4%",
          width: isMobile ? 280 : 520, height: isMobile ? 280 : 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.42) 0%, transparent 70%)",
          filter: "blur(74px)", mixBlendMode: "screen", x: orbTwoX, y: orbTwoY, pointerEvents: "none",
        }}
      />

      {/* Vignette for cinematic focus */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(130% 100% at 50% 40%, transparent 45%, rgba(2,3,8,0.7) 100%)",
        }}
      />

      {/* Main composition */}
      <PageContainer wide style={{ position: "relative", zIndex: 3 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.02fr 0.98fr",
            alignItems: "center",
            gap: isMobile ? 40 : 36,
          }}
        >
          {/* ------- Text column ------- */}
          <motion.div
            style={{ y: contentY, x: contentTX, order: isMobile ? 2 : 1 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              {...reveal(0)}
              style={{
                margin: 0, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.28)", padding: "8px 14px",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                color: "#dbe4ff", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
              }}
            >
              <Sparkles size={14} />
              Design Concept · Cinematic Portrait Preview
            </motion.p>

            <motion.h2 {...reveal(0.08)} style={{ margin: "20px 0 0" }}>
              <span
                style={{
                  display: "block", fontSize: "clamp(40px, 7.6vw, 84px)", lineHeight: 0.98,
                  letterSpacing: "-0.045em", fontWeight: 700, color: "#ffffff",
                  textShadow: "0 14px 44px rgba(0,0,0,0.5)",
                }}
              >
                {profileIdentity.name}
              </span>
            </motion.h2>

            <motion.p
              {...reveal(0.16)}
              style={{
                marginTop: 18, maxWidth: 560, color: "rgba(226,232,240,0.85)",
                fontSize: "clamp(15px, 1.9vw, 19px)", lineHeight: 1.65,
              }}
            >
              {profileIdentity.headline}
            </motion.p>

            <motion.div
              {...reveal(0.24)}
              style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
            >
              <Link
                href="/projects" data-cursor="hover"
                style={{
                  minHeight: 48, borderRadius: 999, padding: "12px 22px", display: "inline-flex",
                  alignItems: "center", gap: 8, textDecoration: "none", background: "var(--accent-blue)",
                  color: "#fff", fontWeight: 600, fontSize: 15, boxShadow: "0 16px 34px rgba(37,99,235,0.4)",
                }}
              >
                Explore Projects
                <ArrowRight size={16} />
              </Link>
              <Link
                href={profileIdentity.githubUrl} target="_blank" rel="noreferrer" data-cursor="hover"
                style={{
                  minHeight: 48, borderRadius: 999, padding: "12px 22px", display: "inline-flex",
                  alignItems: "center", gap: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  color: "#f8fafc", fontWeight: 500, fontSize: 15,
                }}
              >
                <Github size={16} />
                GitHub
                <ExternalLink size={14} />
              </Link>
            </motion.div>

            <motion.div {...reveal(0.32)} style={{ marginTop: 26, display: "flex", flexWrap: "wrap", gap: 10 }}>
              {previewChips.map((chip, index) => (
                <motion.span
                  key={chip}
                  animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 3.6 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  whileHover={{ scale: 1.07, backgroundColor: "rgba(255,255,255,0.18)" }}
                  style={{
                    borderRadius: 999, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#e2e8f0",
                    padding: "7px 13px", fontSize: 12.5,
                  }}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ------- Portrait column ------- */}
          <div
            style={{
              order: isMobile ? 1 : 2,
              perspective: 1400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <motion.div
              style={{ position: "relative", y: portraitY, width: isMobile ? "min(340px, 82vw)" : "min(460px, 100%)" }}
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Depth echo — blurred, tinted copy floating behind for 3D separation */}
              <motion.div
                aria-hidden
                style={{
                  position: "absolute", inset: "-6% -8%", zIndex: 0, borderRadius: 32,
                  x: echoTX, y: echoTY, overflow: "hidden", opacity: 0.4, filter: "blur(14px)",
                  transform: "scale(1.06)",
                }}
              >
                <Image
                  src={PORTRAIT_SRC} alt="" fill aria-hidden quality={40} sizes="480px"
                  style={{ objectFit: "cover", objectPosition: "center top", filter: "saturate(1.4) hue-rotate(-8deg)" }}
                />
              </motion.div>

              {/* Pulsing glow ring behind the frame */}
              <div
                aria-hidden className="cine-ring"
                style={{
                  position: "absolute", inset: "-14px", zIndex: 0, borderRadius: 36,
                  background: "linear-gradient(140deg, rgba(37,99,235,0.55), rgba(20,184,166,0.4) 60%, rgba(139,92,246,0.5))",
                  filter: "blur(22px)",
                }}
              />

              {/* The sharp framed portrait — 4/5 frame guarantees full head + hair */}
              <motion.div
                style={{
                  position: "relative", zIndex: 1, borderRadius: 26, overflow: "hidden",
                  aspectRatio: "4 / 5", transformStyle: "preserve-3d",
                  rotateX: portraitRotX, rotateY: portraitRotY, x: portraitTX, y: portraitTY,
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
                }}
              >
                <div className="cine-breathe" style={{ position: "absolute", inset: 0 }}>
                  <Image
                    src={PORTRAIT_SRC}
                    alt={`${profileIdentity.name} portrait`}
                    fill priority quality={90} sizes={isMobile ? "82vw" : "460px"}
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>

                {/* Cinematic color grade over the photo */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "soft-light",
                    background: "linear-gradient(150deg, rgba(37,99,235,0.5) 0%, transparent 45%, rgba(20,184,166,0.4) 100%)",
                  }}
                />
                {/* Bottom gradient so the frame melts toward the dark scene */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(180deg, transparent 55%, rgba(3,5,12,0.6) 100%)",
                  }}
                />
                {/* Pointer-tracked specular glare */}
                <motion.div
                  aria-hidden
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
                    background: glareBg,
                  }}
                />
                {/* Animated diagonal sheen sweeping across the frame */}
                <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                  <div
                    className="cine-sheen"
                    style={{
                      position: "absolute", top: "-30%", bottom: "-30%", width: "45%", left: 0,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                      filter: "blur(6px)",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageContainer>

      {/* Film grain overlay */}
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Scroll-reactive base scrim */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", inset: "auto 0 0 0", height: "40%", zIndex: 2, opacity: scrimOpacity, pointerEvents: "none",
          background: "linear-gradient(0deg, #030409 0%, transparent 100%)",
        }}
      />

      {/* Top & bottom fades so the panel blends with the page */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: "0 0 auto 0", height: isMobile ? 60 : 110, zIndex: 5, pointerEvents: "none",
          background: "linear-gradient(180deg, var(--page-background) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", inset: "auto 0 0 0", height: isMobile ? 70 : 130, zIndex: 5, pointerEvents: "none",
          background: "linear-gradient(0deg, var(--page-background) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
