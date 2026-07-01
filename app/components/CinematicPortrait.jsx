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

const previewChips = [
  "MS Computer Science, UAB",
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

  // Keep the parallax strictly downward so the top of the portrait (the head/hair)
  // is never pulled above the frame. It eases down from a top-anchored start.
  const imageParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 22 : 80],
  );
  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [26, -42]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 0.58, 0.82]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.4 });

  const imageDriftX = useTransform(springX, [-0.5, 0.5], isMobile ? [0, 0] : [-16, 16]);
  const imageDriftY = useTransform(springY, [-0.5, 0.5], isMobile ? [0, 0] : [-10, 10]);
  const orbOneDrift = useTransform(springX, [-0.5, 0.5], isMobile ? [0, 0] : [-40, 40]);
  const orbTwoDrift = useTransform(springY, [-0.5, 0.5], isMobile ? [0, 0] : [30, -30]);
  const panelDriftX = useTransform(springX, [-0.5, 0.5], isMobile ? [0, 0] : [12, -12]);
  const panelDriftY = useTransform(springY, [-0.5, 0.5], isMobile ? [0, 0] : [8, -8]);

  const handlePointerMove = (event) => {
    if (isMobile) {
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
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "80vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        isolation: "isolate",
        background: "#05060d",
      }}
    >
      {/* Top fade so this panel eases in from the section above */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: isMobile ? 40 : 72,
          background: "linear-gradient(180deg, var(--page-background) 0%, transparent 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Portrait — TRUE full-bleed background across the whole hero (no panel, no
          seam). The darkening gradients below sit OVER this same continuous photo,
          so the text side blends in smoothly. Anchored high so hair isn't cropped. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: -40,
          bottom: -40,
          right: 0,
          width: isMobile ? "100%" : "52%",
          zIndex: 1,
          overflow: "hidden",
          transformOrigin: "top center",
          y: imageParallaxY,
          // Feather the beige edge into the dark scene so there's no hard line
          WebkitMaskImage: isMobile
            ? "linear-gradient(180deg, rgba(0,0,0,1) 58%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 32%)",
          maskImage: isMobile
            ? "linear-gradient(180deg, rgba(0,0,0,1) 58%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 32%)",
        }}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, transformOrigin: "center center" }}
        >
          <Image
            src="/profile/portrait.jpg"
            alt={`${profileIdentity.name} portrait`}
            fill
            priority
            quality={90}
            sizes={isMobile ? "100vw" : "55vw"}
            style={{ objectFit: "cover", objectPosition: isMobile ? "center 8%" : "center 16%" }}
          />
        </motion.div>
      </motion.div>

      {/* Cinematic scrim — darkens the LEFT (text) side and dissolves seamlessly
          into the photo on the right. One gradient over one photo = no edge. */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, rgba(3,5,12,0.58) 0%, rgba(3,5,12,0.32) 34%, rgba(3,5,12,0.92) 100%)"
            : "linear-gradient(90deg, rgba(3,5,12,0.95) 0%, rgba(3,5,12,0.88) 26%, rgba(3,5,12,0.55) 46%, rgba(3,5,12,0.16) 62%, transparent 80%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(135% 105% at 72% 34%, transparent 46%, rgba(2,4,10,0.5) 100%), linear-gradient(0deg, rgba(3,5,12,0.8) 0%, transparent 20%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Glowing color-wash orbs for depth and premium ambience */}
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { x: [-20, 30, -20], y: [0, -24, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-8%",
          width: isMobile ? 220 : 420,
          height: isMobile ? 220 : 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.55) 0%, transparent 70%)",
          filter: "blur(70px)",
          mixBlendMode: "screen",
          x: orbOneDrift,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { x: [10, -30, 10], y: [0, 26, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: "-14%",
          right: "-6%",
          width: isMobile ? 240 : 460,
          height: isMobile ? 240 : 460,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.45) 0%, transparent 70%)",
          filter: "blur(84px)",
          mixBlendMode: "screen",
          y: orbTwoDrift,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Film-grain texture for a cinematic finish */}
      <motion.div
        aria-hidden
        animate={prefersReducedMotion ? {} : { opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Bottom fade so this panel eases into the section below */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: isMobile ? 48 : 84,
          background: "linear-gradient(0deg, var(--page-background) 0%, transparent 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Foreground content */}
      <PageContainer wide style={{ position: "relative", zIndex: 3, paddingBlock: isMobile ? 40 : 56 }}>
        {/* Text — left ~25%, over the dark side of the scene */}
        <motion.div
          style={{ y: contentParallaxY, x: panelDriftX, maxWidth: isMobile ? "100%" : "52%" }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "8px 14px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={14} />
            Design Concept &middot; Cinematic Portrait Preview
          </motion.p>

          <motion.h2
            style={{ y: panelDriftY }}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span
              style={{
                display: "block",
                margin: "18px 0 0",
                fontSize: "clamp(38px, 8vw, 90px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                textShadow: "0 12px 40px rgba(0,0,0,0.45)",
              }}
            >
              {profileIdentity.name}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.2 }}
            style={{
              marginTop: 16,
              maxWidth: 720,
              color: "rgba(226,232,240,0.86)",
              fontSize: "clamp(15px, 1.9vw, 20px)",
              lineHeight: 1.65,
            }}
          >
            {profileIdentity.headline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.3 }}
            style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
          >
            <Link
              href="/projects"
              data-cursor="hover"
              style={{
                minHeight: 48,
                borderRadius: 999,
                padding: "11px 21px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                background: "var(--accent-blue)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 15,
                boxShadow: "0 14px 30px rgba(37,99,235,0.35)",
              }}
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
            <Link
              href={profileIdentity.githubUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              style={{
                minHeight: 48,
                borderRadius: 999,
                padding: "11px 21px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.32)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "#f8fafc",
                fontWeight: 500,
                fontSize: 15,
              }}
            >
              <Github size={16} />
              GitHub Profile
              <ExternalLink size={14} />
            </Link>
          </motion.div>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {previewChips.map((chip, index) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.4 + index * 0.06 },
                  y: prefersReducedMotion
                    ? { duration: 0.5, delay: 0.4 + index * 0.06 }
                    : { duration: 3.6 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 },
                }}
                whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.16)" }}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.24)",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "#e2e8f0",
                  padding: "7px 13px",
                  fontSize: 13,
                }}
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
