"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Curated, high-quality visuals for the cinematic coverflow.
 * Images are served responsive/optimized directly from Unsplash CDN so no
 * next.config remote-pattern setup is required (rendered via plain <img>).
 */
const showcaseSlides = [
  {
    id: "orchestration",
    tag: "Intelligent Systems",
    title: "Forecast-Aware Orchestration",
    caption: "Adaptive scheduling pipelines that plan around real-world signal.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    accent: "#2563eb",
  },
  {
    id: "distributed",
    tag: "Platform Reliability",
    title: "Fault-Tolerant Storage",
    caption: "Replication and recovery that stay available under node failure.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    accent: "#14b8a6",
  },
  {
    id: "realtime",
    tag: "Real-Time Collaboration",
    title: "Low-Latency Sync Engine",
    caption: "Conflict-free collaborative editing with secure execution.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    accent: "#6366f1",
  },
  {
    id: "ml",
    tag: "Machine Intelligence",
    title: "Model Lifecycle & Observability",
    caption: "Validation, deployment, and drift monitoring in one flow.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    accent: "#f97316",
  },
  {
    id: "cloud",
    tag: "Cloud Native",
    title: "Container Orchestration",
    caption: "Resilient, observable deployments built for scale.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    accent: "#0ea5e9",
  },
  {
    id: "navigation",
    tag: "Applied Engineering",
    title: "Indoor Navigation Systems",
    caption: "Spatial intelligence translated into usable product surfaces.",
    image:
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
    accent: "#8b5cf6",
  },
  {
    id: "product",
    tag: "Product Execution",
    title: "Measurable Outcomes",
    caption: "Deep engineering shipped with clarity, polish, and intent.",
    image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1200&q=80",
    accent: "#ec4899",
  },
];

const AUTOPLAY_MS = 3200;

/** Signed shortest circular distance from active, so the loop feels endless. */
function signedOffset(index, active, count) {
  let raw = ((index - active) % count + count) % count;
  if (raw > count / 2) {
    raw -= count;
  }
  return raw;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function PremiumShowcase({ isMobile = false }) {
  const count = showcaseSlides.length;
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayOn, setAutoplayOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const stageRef = useRef(null);
  const dragState = useRef({ pointerId: null, startX: 0, startActive: 0, moved: false });

  // Live pointer-follow spotlight that trails the cursor across the stage.
  const glowX = useMotionValue(0.5);
  const glowY = useMotionValue(0.5);
  const smoothGlowX = useSpring(glowX, { stiffness: 120, damping: 20, mass: 0.4 });
  const smoothGlowY = useSpring(glowY, { stiffness: 120, damping: 20, mass: 0.4 });
  const spotlight = useTransform(
    [smoothGlowX, smoothGlowY],
    ([x, y]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(37,99,235,0.16), transparent 62%)`,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback((next) => {
    setActive((current) => (typeof next === "function" ? next(current) : next));
  }, []);

  const step = useCallback((direction) => {
    setActive((current) => current + direction);
  }, []);

  // Cinematic auto-advance — a slow, continuous glide like a looping reel.
  useEffect(() => {
    if (!autoplayOn || isPaused || reducedMotion) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setActive((current) => current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayOn, isPaused, reducedMotion]);

  // Keyboard access for the focused stage.
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    },
    [step],
  );

  const dragStep = isMobile ? 68 : 108;

  const handlePointerDown = (event) => {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startActive: active,
      moved: false,
    };
    setIsPaused(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const state = dragState.current;
    if (state.pointerId !== event.pointerId) {
      // Only update the spotlight when not dragging.
      updateGlow(event);
      return;
    }
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 6) {
      state.moved = true;
    }
    const steps = Math.round(-delta / dragStep);
    goTo(state.startActive + steps);
    updateGlow(event);
  };

  const endDrag = (event) => {
    if (dragState.current.pointerId === event.pointerId) {
      dragState.current.pointerId = null;
      setIsPaused(false);
    }
  };

  const updateGlow = (event) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    glowX.set(clamp((event.clientX - rect.left) / rect.width, 0, 1));
    glowY.set(clamp((event.clientY - rect.top) / rect.height, 0, 1));
  };

  const activeIndex = ((active % count) + count) % count;
  const activeSlide = showcaseSlides[activeIndex];

  const stageHeight = isMobile ? 380 : 520;
  const cardWidth = isMobile ? 232 : 340;
  const cardHeight = isMobile ? 300 : 430;
  const spacing = isMobile ? 152 : 300;
  const visibleRange = isMobile ? 2 : 3;

  const transformFor = useMemo(
    () => (offset) => {
      const abs = Math.abs(offset);
      const bounded = clamp(offset, -visibleRange, visibleRange);
      return {
        x: bounded * spacing,
        z: reducedMotion ? 0 : -abs * 240,
        rotateY: reducedMotion ? 0 : bounded * -19,
        scale: clamp(1 - abs * 0.14, 0.62, 1),
        opacity: abs > visibleRange ? 0 : abs === 0 ? 1 : abs >= visibleRange ? 0.32 : 0.78,
        filter: abs === 0 ? "blur(0px)" : `blur(${Math.min(abs * 1.6, 5)}px)`,
        zIndex: 60 - abs,
      };
    },
    [reducedMotion, spacing, visibleRange],
  );

  return (
    <div
      style={{
        borderRadius: 30,
        border: "1px solid var(--border-light)",
        background: "var(--surface-gradient)",
        padding: isMobile ? "22px 12px 26px" : "34px 20px 30px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient animated aurora backdrop */}
      {!reducedMotion ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: "-20%",
              left: "8%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)",
            }}
            animate={{ x: [0, 40, 0], y: [0, 26, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: "-24%",
              right: "6%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(249,115,22,0) 70%)",
            }}
            animate={{ x: [0, -34, 0], y: [0, -22, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </motion.div>
      ) : null}

      {/* Header row */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: isMobile ? 12 : 8,
          paddingInline: isMobile ? 6 : 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            border: "1px solid rgba(37,99,235,0.28)",
            padding: "7px 13px",
            background: "rgba(37,99,235,0.08)",
            color: "var(--accent-blue)",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <Sparkles size={13} />
          Signature Showcase
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ControlButton
            label="Previous"
            onClick={() => step(-1)}
            isMobile={isMobile}
          >
            <ArrowLeft size={16} />
          </ControlButton>
          <ControlButton
            label={autoplayOn ? "Pause autoplay" : "Play autoplay"}
            onClick={() => setAutoplayOn((value) => !value)}
            isMobile={isMobile}
            active={autoplayOn}
          >
            {autoplayOn ? <Pause size={15} /> : <Play size={15} />}
          </ControlButton>
          <ControlButton label="Next" onClick={() => step(1)} isMobile={isMobile}>
            <ArrowRight size={16} />
          </ControlButton>
        </div>
      </div>

      {/* 3D coverflow stage */}
      <motion.div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Signature project showcase"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          endDrag(event);
          glowX.set(0.5);
          glowY.set(0.5);
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: "relative",
          zIndex: 1,
          height: stageHeight,
          perspective: isMobile ? 900 : 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "pan-y",
          cursor: "grab",
          outline: "none",
        }}
      >
        {/* Cursor-follow spotlight */}
        {!reducedMotion ? (
          <motion.div
            aria-hidden
            style={{ position: "absolute", inset: 0, background: spotlight, pointerEvents: "none", zIndex: 0 }}
          />
        ) : null}

        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {showcaseSlides.map((slide, index) => {
            const offset = signedOffset(index, active, count);
            const target = transformFor(offset);
            const isActive = offset === 0;

            return (
              <motion.figure
                key={slide.id}
                aria-hidden={!isActive}
                onClick={() => {
                  if (!dragState.current.moved) {
                    goTo(active + offset);
                  }
                }}
                initial={false}
                animate={target}
                transition={{ type: "spring", stiffness: 210, damping: 30, mass: 0.9 }}
                whileHover={isActive && !reducedMotion ? { scale: 1.04, y: -8 } : undefined}
                data-cursor="hover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: cardWidth,
                  height: cardHeight,
                  margin: 0,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  boxShadow: isActive
                    ? "0 40px 80px -24px rgba(15,23,42,0.5)"
                    : "0 20px 44px -26px rgba(15,23,42,0.4)",
                  transformStyle: "preserve-3d",
                  pointerEvents: target.opacity === 0 ? "none" : "auto",
                  willChange: "transform, opacity",
                  cursor: isActive ? "grab" : "pointer",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      userSelect: "none",
                    }}
                  />

                  {/* Accent ring highlight on the active card */}
                  <motion.div
                    aria-hidden
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 24,
                      boxShadow: `inset 0 0 0 2px ${slide.accent}`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Gradient scrim + caption, revealed on the active slide */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(2,6,23,0) 42%, rgba(2,6,23,0.32) 66%, rgba(2,6,23,0.86) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <AnimatePresence>
                    {isActive ? (
                      <motion.figcaption
                        key="caption"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          position: "absolute",
                          left: 18,
                          right: 18,
                          bottom: 18,
                          color: "#ffffff",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 11.5,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "5px 10px",
                            borderRadius: 999,
                            background: `${slide.accent}e6`,
                            marginBottom: 10,
                          }}
                        >
                          {slide.tag}
                        </span>
                        <h3
                          style={{
                            margin: "0 0 6px",
                            fontSize: isMobile ? 19 : 23,
                            lineHeight: 1.14,
                            letterSpacing: "-0.02em",
                            fontWeight: 700,
                          }}
                        >
                          {slide.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13.5,
                            lineHeight: 1.5,
                            color: "rgba(255,255,255,0.86)",
                          }}
                        >
                          {slide.caption}
                        </p>
                      </motion.figcaption>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.figure>
            );
          })}
        </div>
      </motion.div>

      {/* Progress dots */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          marginTop: isMobile ? 14 : 6,
        }}
      >
        {showcaseSlides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to ${slide.title}`}
              aria-current={isActive}
              data-cursor="hover"
              onClick={() => goTo(active + signedOffset(index, active, count))}
              style={{
                position: "relative",
                height: 9,
                width: isActive ? 30 : 9,
                borderRadius: 999,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: isActive ? activeSlide.accent : "var(--border-light)",
                transition: "width 320ms cubic-bezier(0.16,1,0.3,1), background 320ms ease",
              }}
            />
          );
        })}
      </div>

      <p
        style={{
          position: "relative",
          zIndex: 2,
          margin: "14px 0 0",
          textAlign: "center",
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        Drag, click a side panel, or use the arrows — the reel keeps gliding on its own.
      </p>
    </div>
  );
}

function ControlButton({ children, label, onClick, isMobile, active = false }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      data-cursor="hover"
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      style={{
        width: isMobile ? 38 : 42,
        height: isMobile ? 38 : 42,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        border: "1px solid var(--border-light)",
        background: active ? "var(--accent-blue)" : "var(--surface-card-strong)",
        color: active ? "#ffffff" : "var(--text-primary)",
        cursor: "pointer",
        boxShadow: "0 6px 18px -8px rgba(15,23,42,0.4)",
      }}
    >
      {children}
    </motion.button>
  );
}
