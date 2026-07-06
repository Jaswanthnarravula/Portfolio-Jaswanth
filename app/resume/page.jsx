"use client";

import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PageContainer from "../components/PageContainer";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import ThreeDTiltCard from "../components/ThreeDTiltCard";
import VelocityMarquee from "../components/VelocityMarquee";
import { experienceSummary, workExperiences } from "../data/experience";
import {
  certifications,
  educationJourney,
  primaryTechStack,
  profileIdentity,
  resumeHighlights,
} from "../data/profile";

const EASE_OUT = [0.16, 1, 0.3, 1];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth < 900);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return isMobile;
}

/** Section eyebrow: "02 — EXPERIENCE" in tracked mono caps with a hairline. */
function Eyebrow({ index, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: "var(--accent-blue)",
        }}
      >
        {index}
      </span>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
        style={{
          width: 52,
          height: 1,
          background: "var(--accent-blue)",
          transformOrigin: "left center",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/** Spring-driven count-up that starts when scrolled into view. */
function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 55, damping: 16 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      raw.set(value);
    }
  }, [inView, value, raw]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Wraps children in a scroll-linked vertical parallax drift. */
function Parallax({ from = 50, to = -50, style = {}, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div ref={ref} style={{ y, ...style }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function ResumeHero({ isMobile }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Content glides up and fades slightly faster than the scroll itself —
  // the classic cinematic hero exit.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = experienceSummary.map((entry) => ({
    ...entry,
    numeric: Number.parseInt(entry.value, 10) || 0,
  }));

  return (
    <div
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: isMobile ? "72vh" : "84vh",
        display: "flex",
        alignItems: "center",
        paddingBlock: 40,
      }}
    >
      {/* Ghost word: oversized outlined RESUME drifting on its own scroll rate. */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          top: isMobile ? "4%" : "-2%",
          left: "-2%",
          fontSize: "clamp(110px, 22vw, 320px)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1.5px var(--marquee-stroke)",
          opacity: ghostOpacity,
          y: ghostY,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        RESUME
      </motion.span>

      <motion.div
        style={{ position: "relative", y: contentY, opacity: contentOpacity, width: "100%" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            borderRadius: 999,
            border: "1px solid var(--border-light)",
            background: "var(--surface-pill)",
            backdropFilter: "blur(12px)",
            padding: "8px 16px",
            marginBottom: 26,
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.55, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 10px rgba(34,197,94,0.75)",
            }}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            Open to Software Engineering roles — 2026
          </span>
        </motion.div>

        <RevealText
          text={profileIdentity.name}
          as="h1"
          delay={0.15}
          stagger={0.09}
          style={{
            fontSize: "clamp(52px, 10vw, 124px)",
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            marginBottom: 8,
          }}
        />
        <RevealText
          text="Software Engineer."
          as="h2"
          delay={0.42}
          stagger={0.07}
          style={{
            fontSize: "clamp(34px, 6.4vw, 78px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            color: "transparent",
            WebkitTextStroke: "1.4px var(--marquee-stroke)",
            marginBottom: 26,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.7 }}
          style={{
            margin: "0 0 30px",
            maxWidth: 640,
            color: "var(--text-secondary)",
            fontSize: "clamp(15px, 2vw, 19px)",
            lineHeight: 1.65,
          }}
        >
          {profileIdentity.headline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.82 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 44 }}
        >
          <MagneticButton>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => window.print()}
              style={{
                minHeight: 50,
                borderRadius: 999,
                border: "none",
                background: "var(--accent-blue)",
                color: "#ffffff",
                padding: "13px 26px",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 14px 34px rgba(37, 99, 235, 0.32)",
              }}
            >
              <Download size={17} />
              Download Resume PDF
            </button>
          </MagneticButton>
          <MagneticButton>
            <Link
              href={`mailto:${profileIdentity.email}?subject=Resume%20Request`}
              data-cursor="hover"
              style={{
                minHeight: 50,
                borderRadius: 999,
                border: "1px solid var(--border-light)",
                background: "var(--surface-pill)",
                backdropFilter: "blur(12px)",
                color: "var(--text-primary)",
                textDecoration: "none",
                padding: "13px 26px",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              <Mail size={17} />
              Request Latest PDF
            </Link>
          </MagneticButton>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            <MapPin size={14} />
            {profileIdentity.location}
          </span>
        </motion.div>

        {/* Live stat counters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : `repeat(${stats.length}, 1fr)`,
            gap: 12,
            maxWidth: 780,
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.95 + index * 0.12 }}
              style={{
                borderRadius: 18,
                border: "1px solid var(--border-light)",
                background: "var(--surface-card)",
                backdropFilter: "blur(14px)",
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 4vw, 42px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: stat.accent,
                }}
              >
                <Counter value={stat.numeric} suffix="+" />
              </p>
              <p style={{ margin: "5px 0 0", fontSize: 13.5, fontWeight: 600 }}>{stat.label}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          x: "-50%",
          opacity: contentOpacity,
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--text-secondary)",
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-flex" }}
        >
          <ArrowDown size={15} />
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Signature impact — numbered editorial rows                          */
/* ------------------------------------------------------------------ */

function ImpactRow({ text, index, isMobile }) {
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -70 : 70 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.95, ease: EASE_OUT }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "64px 1fr" : "150px 1fr",
        alignItems: "center",
        gap: isMobile ? 16 : 34,
        borderTop: "1px solid var(--border-light)",
        paddingBlock: isMobile ? 26 : 38,
      }}
    >
      <Parallax from={26} to={-26}>
        <span
          aria-hidden
          style={{
            fontSize: isMobile ? 44 : 92,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1.3px var(--marquee-stroke)",
            userSelect: "none",
          }}
        >
          0{index + 1}
        </span>
      </Parallax>
      <p
        style={{
          margin: 0,
          fontSize: "clamp(16px, 2.4vw, 24px)",
          lineHeight: 1.5,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience timeline with scroll-drawing spine                       */
/* ------------------------------------------------------------------ */

function ExperienceTimeline({ isMobile }) {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const spineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  const spineLeft = isMobile ? 10 : 19;

  return (
    <div ref={trackRef} style={{ position: "relative" }}>
      {/* Static rail + animated gradient beam that draws with scroll. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 8,
          bottom: 8,
          left: spineLeft,
          width: 2,
          background: "var(--border-light)",
          borderRadius: 2,
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: 8,
          bottom: 8,
          left: spineLeft,
          width: 2,
          borderRadius: 2,
          background:
            "linear-gradient(180deg, var(--accent-blue) 0%, var(--accent-purple) 100%)",
          boxShadow: "0 0 14px rgba(37, 99, 235, 0.45)",
          scaleY: spineScale,
          transformOrigin: "top center",
        }}
      />

      <div style={{ display: "grid", gap: isMobile ? 26 : 40 }}>
        {workExperiences.map((job, index) => (
          <div
            key={job.role}
            style={{
              position: "relative",
              paddingLeft: isMobile ? 40 : 74,
            }}
          >
            {/* Node */}
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{ type: "spring", stiffness: 340, damping: 18, delay: 0.15 }}
              style={{
                position: "absolute",
                left: spineLeft - 7,
                top: 30,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--background-primary)",
                border: "3px solid var(--accent-blue)",
                boxShadow: "0 0 0 5px rgba(37, 99, 235, 0.14)",
                zIndex: 1,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.06 }}
              style={{ perspective: 1100 }}
            >
              <ThreeDTiltCard
                isMobile={isMobile}
                hoverScale={1.015}
                hoverLift={-5}
                style={{
                  borderRadius: 22,
                  border: "1px solid var(--border-light)",
                  background: "var(--surface-card)",
                  backdropFilter: "blur(16px)",
                  padding: isMobile ? 20 : 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--accent-blue)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Briefcase size={13} />
                      {job.domain}
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "clamp(21px, 3vw, 28px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {job.role}
                    </h3>
                    <p style={{ margin: "5px 0 0", color: "var(--text-secondary)", fontSize: 14.5 }}>
                      {job.organization} · {job.location}
                    </p>
                  </div>
                  <span
                    style={{
                      borderRadius: 999,
                      border: "1px solid var(--border-light)",
                      background: "var(--surface-pill)",
                      padding: "7px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {job.period}
                  </span>
                </div>

                <p
                  style={{
                    margin: "0 0 14px",
                    color: "var(--text-secondary)",
                    fontSize: 14.5,
                    lineHeight: 1.6,
                  }}
                >
                  {job.summary}
                </p>

                <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                  {job.highlights.map((highlight, hIndex) => (
                    <motion.p
                      key={highlight}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 + hIndex * 0.1 }}
                      style={{
                        margin: 0,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        fontSize: 14,
                        lineHeight: 1.55,
                      }}
                    >
                      <ArrowUpRight
                        size={15}
                        style={{ color: "var(--accent-blue)", flexShrink: 0, marginTop: 3 }}
                      />
                      {highlight}
                    </motion.p>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {job.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        background: "var(--surface-pill)",
                        padding: "5px 12px",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </ThreeDTiltCard>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

function SkillsCloud() {
  return (
    <div style={{ perspective: 900 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {primaryTechStack.map((skill, index) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, y: 30, rotateX: -55 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.05 }}
            whileHover={{
              y: -5,
              scale: 1.06,
              borderColor: "var(--accent-blue)",
              boxShadow: "0 12px 26px rgba(37, 99, 235, 0.22)",
            }}
            data-cursor="hover"
            style={{
              display: "inline-block",
              borderRadius: 999,
              border: "1px solid var(--border-light)",
              background: "var(--surface-card)",
              backdropFilter: "blur(12px)",
              padding: "11px 20px",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              transformStyle: "preserve-3d",
              cursor: "default",
            }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Education & certifications                                          */
/* ------------------------------------------------------------------ */

function EducationCerts({ isMobile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
        gap: 18,
        alignItems: "start",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 46 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        style={{ perspective: 1100 }}
      >
        <ThreeDTiltCard
          isMobile={isMobile}
          hoverScale={1.015}
          hoverLift={-5}
          style={{
            borderRadius: 22,
            border: "1px solid var(--border-light)",
            background: "var(--surface-card)",
            backdropFilter: "blur(16px)",
            padding: isMobile ? 20 : 28,
          }}
        >
          <p
            style={{
              margin: "0 0 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-blue)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <GraduationCap size={14} />
            Education
          </p>
          <div style={{ display: "grid", gap: 20 }}>
            {educationJourney.map((entry, index) => (
              <motion.div
                key={`${entry.title}-${entry.period}`}
                initial={{ opacity: 0, x: -22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.1 }}
                style={{
                  paddingLeft: 16,
                  borderLeft: "2px solid var(--border-light)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--accent-blue)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {entry.period}
                </p>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 17 }}>{entry.title}</p>
                <p style={{ margin: "0 0 6px", color: "var(--text-secondary)", fontSize: 13.5 }}>
                  {entry.institution}
                </p>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.55 }}>
                  {entry.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </ThreeDTiltCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 46 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.12 }}
        style={{ perspective: 1100 }}
      >
        <ThreeDTiltCard
          isMobile={isMobile}
          hoverScale={1.015}
          hoverLift={-5}
          style={{
            borderRadius: 22,
            border: "1px solid var(--border-light)",
            background: "var(--surface-card)",
            backdropFilter: "blur(16px)",
            padding: isMobile ? 20 : 28,
          }}
        >
          <p
            style={{
              margin: "0 0 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-blue)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Award size={14} />
            Certifications
          </p>
          <div style={{ display: "grid", gap: 18 }}>
            {certifications.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, x: 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.1 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15.5 }}>{credential.title}</p>
                  <span
                    style={{
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      color: credential.accent,
                      background: `${credential.accent}18`,
                      border: `1px solid ${credential.accent}44`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {credential.status}
                  </span>
                </div>
                <p style={{ margin: "0 0 8px", color: "var(--text-secondary)", fontSize: 13 }}>
                  {credential.issuer} · {credential.issued}
                </p>
                {/* In-progress meter that fills on scroll */}
                <div
                  aria-hidden
                  style={{
                    height: 4,
                    borderRadius: 4,
                    background: "var(--border-light)",
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 0.62 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.3 + index * 0.12 }}
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background: credential.accent,
                      transformOrigin: "left center",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {credential.focus.map((topic) => (
                    <span
                      key={topic}
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        padding: "3px 10px",
                        fontSize: 11.5,
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ThreeDTiltCard>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Print sheet — clean static resume emitted only by window.print()    */
/* ------------------------------------------------------------------ */

function PrintSheet() {
  return (
    <div className="resume-print-sheet">
      <h1>{profileIdentity.name}</h1>
      <p>
        {profileIdentity.role} · {profileIdentity.location} · {profileIdentity.email}
      </p>

      <h2>Highlights</h2>
      <ul>
        {resumeHighlights.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <h2>Experience</h2>
      {workExperiences.map((job) => (
        <div key={job.role} className="print-block">
          <h3>
            {job.role} — {job.organization}
          </h3>
          <p className="print-meta">
            {job.period} · {job.location}
          </p>
          <ul>
            {job.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Education</h2>
      {educationJourney.map((entry) => (
        <p key={`${entry.title}-${entry.period}`}>
          <strong>{entry.title}</strong> — {entry.institution} ({entry.period})
        </p>
      ))}

      <h2>Certifications</h2>
      {certifications.map((credential) => (
        <p key={credential.title}>
          <strong>{credential.title}</strong> — {credential.issuer} ({credential.status})
        </p>
      ))}

      <h2>Technical Skills</h2>
      <p>{primaryTechStack.join(" · ")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ResumePage() {
  const isMobile = useIsMobile();

  return (
    <section style={{ paddingBottom: 80, overflowX: "clip" }}>
      <div className="print-hidden">
        <PageContainer>
          <ResumeHero isMobile={isMobile} />
        </PageContainer>

        {/* Full-bleed kinetic skill strip driven by scroll velocity */}
        <Parallax from={20} to={-20} style={{ marginBlock: isMobile ? 40 : 70 }}>
          <VelocityMarquee items={primaryTechStack} baseVelocity={2} />
        </Parallax>

        <PageContainer>
          <div style={{ marginBottom: isMobile ? 70 : 120 }}>
            <Eyebrow index="01" label="Signature Impact" />
            <RevealText
              text="Engineering with measurable outcomes."
              as="h2"
              style={{
                fontSize: "clamp(30px, 5.4vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.04,
                marginBottom: 34,
                maxWidth: 820,
              }}
            />
            <div style={{ borderBottom: "1px solid var(--border-light)" }}>
              {resumeHighlights.map((point, index) => (
                <ImpactRow key={point} text={point} index={index} isMobile={isMobile} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: isMobile ? 70 : 120 }}>
            <Eyebrow index="02" label="Experience" />
            <RevealText
              text="Where the work happened."
              as="h2"
              style={{
                fontSize: "clamp(30px, 5.4vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.04,
                marginBottom: 40,
              }}
            />
            <ExperienceTimeline isMobile={isMobile} />
          </div>

          <div style={{ marginBottom: isMobile ? 70 : 120 }}>
            <Eyebrow index="03" label="Capabilities" />
            <RevealText
              text="Tools I ship with."
              as="h2"
              style={{
                fontSize: "clamp(30px, 5.4vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.04,
                marginBottom: 30,
              }}
            />
            <SkillsCloud />
          </div>

          <div style={{ marginBottom: isMobile ? 70 : 120 }}>
            <Eyebrow index="04" label="Education & Credentials" />
            <RevealText
              text="Always leveling up."
              as="h2"
              style={{
                fontSize: "clamp(30px, 5.4vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.04,
                marginBottom: 34,
              }}
            />
            <EducationCerts isMobile={isMobile} />
          </div>

          {/* Closing CTA */}
          <div style={{ textAlign: "center", paddingBlock: isMobile ? 30 : 60 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--accent-blue)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <Sparkles size={15} />
              Let&apos;s work together
            </motion.div>
            <RevealText
              text="Ready to build what's next."
              as="h2"
              style={{
                fontSize: "clamp(36px, 7vw, 84px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                marginBottom: 34,
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
              style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
            >
              <MagneticButton>
                <Link
                  href={`mailto:${profileIdentity.email}`}
                  data-cursor="hover"
                  style={{
                    minHeight: 54,
                    borderRadius: 999,
                    background: "var(--accent-blue)",
                    color: "#ffffff",
                    textDecoration: "none",
                    padding: "15px 30px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 16,
                    fontWeight: 600,
                    boxShadow: "0 16px 38px rgba(37, 99, 235, 0.34)",
                  }}
                >
                  <Mail size={18} />
                  {profileIdentity.email}
                </Link>
              </MagneticButton>
              <MagneticButton>
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => window.print()}
                  style={{
                    minHeight: 54,
                    borderRadius: 999,
                    border: "1px solid var(--border-light)",
                    background: "var(--surface-pill)",
                    backdropFilter: "blur(12px)",
                    color: "var(--text-primary)",
                    padding: "15px 30px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Download size={18} />
                  Save as PDF
                </button>
              </MagneticButton>
            </motion.div>
          </div>
        </PageContainer>
      </div>

      <PrintSheet />
    </section>
  );
}
