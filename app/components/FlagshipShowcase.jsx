"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import { flagshipProjects } from "../data/flagshipProjects";

/**
 * The signature scroll moment: the section pins for ~3 viewport heights while
 * the three production systems glide horizontally through a 3D stage. Panels
 * swing on rotateY as they enter and exit; the giant index numeral and the
 * copy column parallax at different rates inside each card.
 */

function MetricBlock({ metric, accent }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "14px 16px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "clamp(26px, 3vw, 38px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "#ffffff",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {metric.value}
        <span style={{ fontSize: "0.5em", color: accent, marginLeft: 3 }}>
          {metric.unit}
        </span>
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 12,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "rgba(226,232,240,0.72)",
        }}
      >
        {metric.label}
      </p>
    </div>
  );
}

function ShowcaseCard({ project, relative, isMobile }) {
  // relative: -1 (exited left) … 0 (centered) … 1 (waiting right).
  // Mobile renders statically, so fall back to a zeroed motion value there.
  const still = useMotionValue(0);
  const rel = relative ?? still;
  const rotateY = useTransform(rel, [-1, 0, 1], [12, 0, -12]);
  const scale = useTransform(rel, [-1, 0, 1], [0.9, 1, 0.9]);
  const cardOpacity = useTransform(rel, [-1, -0.55, 0, 0.55, 1], [0.35, 0.85, 1, 0.85, 0.35]);
  const numeralX = useTransform(rel, [-1, 1], [-120, 120]);
  const copyX = useTransform(rel, [-1, 1], [70, -70]);
  const glowX = useTransform(rel, [-1, 1], ["-30%", "30%"]);

  return (
    <motion.article
      style={{
        position: "relative",
        width: isMobile ? "100%" : "min(1160px, 86vw)",
        minHeight: isMobile ? "auto" : "min(620px, 74vh)",
        borderRadius: 30,
        overflow: "hidden",
        background: project.gradient,
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 40px 90px rgba(2,6,23,0.45)",
        rotateY: isMobile ? 0 : rotateY,
        scale: isMobile ? 1 : scale,
        opacity: isMobile ? 1 : cardOpacity,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Accent glow that drifts against the travel direction */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "-25%",
          right: "-12%",
          width: "58%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${project.accent}55 0%, transparent 68%)`,
          filter: "blur(48px)",
          x: isMobile ? 0 : glowX,
          pointerEvents: "none",
        }}
      />

      {/* Giant parallax numeral */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          right: isMobile ? -8 : 18,
          bottom: isMobile ? -18 : -34,
          fontSize: isMobile ? 150 : "clamp(220px, 26vw, 340px)",
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.16)",
          x: isMobile ? 0 : numeralX,
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "var(--font-display, inherit)",
        }}
      >
        {project.index}
      </motion.span>

      {/* Fine grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(120% 100% at 30% 20%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 100% at 30% 20%, #000 30%, transparent 78%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.25fr 0.75fr",
          gap: isMobile ? 22 : 40,
          padding: isMobile ? "26px 22px 32px" : "clamp(30px, 4vw, 52px)",
          x: isMobile ? 0 : copyX,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: `1px solid ${project.accent}66`,
              background: project.accentSoft,
              color: "#ffffff",
              padding: "7px 13px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: project.accent,
                boxShadow: `0 0 12px ${project.accent}`,
              }}
            />
            {project.kicker}
          </p>

          <h3
            style={{
              margin: "18px 0 0",
              fontSize: isMobile ? 42 : "clamp(48px, 6vw, 84px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              fontFamily: "var(--font-display, inherit)",
            }}
          >
            {project.name}
          </h3>

          <p
            style={{
              margin: "14px 0 0",
              color: "rgba(226,232,240,0.92)",
              fontSize: isMobile ? 16 : "clamp(16px, 1.6vw, 20px)",
              lineHeight: 1.55,
              maxWidth: 560,
              fontWeight: 500,
            }}
          >
            {project.tagline}
          </p>

          <p
            style={{
              margin: "12px 0 0",
              color: "rgba(203,213,225,0.78)",
              fontSize: 15,
              lineHeight: 1.66,
              maxWidth: 560,
            }}
          >
            {project.description}
          </p>

          <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
            {project.highlights.slice(0, isMobile ? 3 : 4).map((point) => (
              <p
                key={point}
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  color: "rgba(226,232,240,0.9)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: project.accent, flexShrink: 0, marginTop: 2 }}
                />
                {point}
              </p>
            ))}
          </div>

          <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.stack.map((tech) => (
              <span
                key={tech}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(241,245,249,0.94)",
                  padding: "6px 12px",
                  fontSize: 12.5,
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {project.metrics.map((metric) => (
            <MetricBlock key={metric.label} metric={metric} accent={project.accent} />
          ))}
          <Link
            href={project.href}
            data-cursor="hover"
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              minHeight: 48,
              borderRadius: 14,
              padding: "12px 16px",
              textDecoration: "none",
              background: "rgba(255,255,255,0.94)",
              color: "#0f172a",
              fontWeight: 600,
              fontSize: 14.5,
            }}
          >
            Explore the architecture
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}

function PinnedShowcase() {
  const sectionRef = useRef(null);
  const count = flagshipProjects.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(count - 1) * 100}vw`]);

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActiveIndex(Math.min(count - 1, Math.round(value * (count - 1))));
  });

  // Per-card relative position (-1 left … 0 centered … 1 right), derived once
  // here so hooks stay unconditional.
  const step = 1 / (count - 1);
  const relatives = flagshipProjects.map((_, index) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(
      scrollYProgress,
      [Math.max(0, index * step - step), index * step, Math.min(1, index * step + step)],
      [index === 0 ? 0 : 1, 0, index === count - 1 ? 0 : -1],
    ),
  );

  const railScale = useTransform(scrollYProgress, [0, 1], [1 / count, 1]);

  return (
    <div ref={sectionRef} style={{ position: "relative", height: `${(count - 1) * 130 + 100}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          perspective: "1400px",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            width: `${count * 100}vw`,
            x: trackX,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {flagshipProjects.map((project, index) => (
            <div
              key={project.id}
              style={{
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
              }}
            >
              <ShowcaseCard project={project} relative={relatives[index]} isMobile={false} />
            </div>
          ))}
        </motion.div>

        {/* Progress rail + counter */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(1160px, 86vw)",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--text-secondary)",
            }}
          >
            0{activeIndex + 1} / 0{count}
          </span>
          <div
            style={{
              flex: 1,
              height: 2,
              borderRadius: 2,
              background: "var(--border-light)",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                transformOrigin: "left",
                scaleX: railScale,
                background: "linear-gradient(90deg, #3b82f6, #14b8a6, #a78bfa)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FlagshipShowcase({ isMobile }) {
  if (isMobile) {
    return (
      <div style={{ display: "grid", gap: 22, padding: "0 16px 10px" }}>
        {flagshipProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 44, rotateX: -6 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
            style={{ perspective: "1200px" }}
          >
            <ShowcaseCard project={project} relative={null} isMobile />
          </motion.div>
        ))}
      </div>
    );
  }

  return <PinnedShowcase />;
}
