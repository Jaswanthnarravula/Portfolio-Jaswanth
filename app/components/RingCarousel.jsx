"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A true 3D cylinder carousel (ported from the reference markup).
 *
 * Every card is placed on the wall of a cylinder with:
 *   rotateY(i*step + rotation) translateZ(radius) rotateX(tilt)
 * so the whole ring wraps around — side and back cards stay visible as the
 * cylinder spins. Radius is derived from the card width (radius/width = 2.21),
 * which reproduces the exact gaps of the original.
 *
 * Swap the `items` below for the site owner's own assets.
 */
const items = [
  { seed: "bread-bowl", alt: "Bread Bowl" },
  { seed: "handmade-cup", alt: "Cup" },
  { seed: "luffy-holder", alt: "Luffy Key Chain Holder" },
  { seed: "mini-bowl", alt: "Japanese mini bowl" },
  { seed: "glasses-holder", alt: "Glasses holder" },
  { seed: "jewelry-tray", alt: "Jewelry tray" },
  { seed: "spidey-beanie", alt: "Spidey Beanie" },
  { seed: "we-bear-bears", alt: "We Bear Bears" },
  { seed: "teddy-pair", alt: "Mr. & Mrs. Teddy" },
];

const AUTO_SPEED = 9; // degrees per second (~0.15deg per 60fps frame)
const DRAG_SENSITIVITY = 0.4; // degrees of rotation per px dragged
const FRICTION = 0.94; // inertia decay per 60fps frame
const STOP_THRESHOLD = 4; // deg/s below which inertia yields to autoplay
const RATIO = 2.21; // radius / cardWidth, measured from the reference
const TILT_X = -7; // slight backward bend of the ring

export default function RingCarousel({ isMobile = false }) {
  const count = items.length;
  const angleStep = 360 / count;

  const cardWidth = isMobile ? 150 : 200;
  const cardHeight = isMobile ? 134 : 178;
  const radius = Math.round(cardWidth * RATIO);
  const perspective = isMobile ? 900 : 1057;
  const stageHeight = isMobile ? 340 : 440;

  const [angle, setAngle] = useState(0); // ring rotation in degrees
  const [autoOn, setAutoOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0); // deg/s, drives inertial flick
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastMoveTRef = useRef(0);
  const lastFrameTRef = useRef(0);
  const rafRef = useRef(0);
  const autoOnRef = useRef(true);
  const reducedRef = useRef(false);

  useEffect(() => {
    autoOnRef.current = autoOn;
  }, [autoOn]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = query.matches;
      setReducedMotion(query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Single rAF loop: autoplay, inertia, and drag all reconcile here.
  useEffect(() => {
    lastFrameTRef.current = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastFrameTRef.current) / 1000, 0.05);
      lastFrameTRef.current = now;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > STOP_THRESHOLD) {
          rotationRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(FRICTION, dt * 60);
        } else if (autoOnRef.current && !reducedRef.current) {
          velocityRef.current = 0;
          rotationRef.current += AUTO_SPEED * dt;
        }
        setAngle(rotationRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = useCallback((event) => {
    draggingRef.current = true;
    velocityRef.current = 0;
    lastXRef.current = event.clientX;
    lastMoveTRef.current = performance.now();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event) => {
    if (!draggingRef.current) {
      return;
    }
    const now = performance.now();
    const delta = event.clientX - lastXRef.current;
    const dt = Math.max((now - lastMoveTRef.current) / 1000, 0.001);

    const deltaAngle = delta * DRAG_SENSITIVITY;
    rotationRef.current += deltaAngle;
    velocityRef.current = deltaAngle / dt; // carried into inertia on release

    lastXRef.current = event.clientX;
    lastMoveTRef.current = now;
    setAngle(rotationRef.current);
  }, []);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const onKeyDown = useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      velocityRef.current -= 150; // flick impulse
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      velocityRef.current += 150;
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setAutoOn((value) => !value);
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 30,
        border: "1px solid var(--border-light)",
        background: "var(--surface-gradient)",
        padding: isMobile ? "18px 8px 20px" : "26px 16px 22px",
        overflow: "hidden",
      }}
    >
      {/* Perspective stage */}
      <div
        role="region"
        aria-label="Creative works carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        style={{
          position: "relative",
          width: "100%",
          height: stageHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          touchAction: "pan-y",
          cursor: draggingRef.current ? "grabbing" : "grab",
          perspective: `${perspective}px`,
          outline: "none",
        }}
      >
        {/* The rotating cylinder (sized to one card; every card shares this box) */}
        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {items.map((item, index) => {
            const cardAngle = index * angleStep + angle;
            return (
              <div
                key={item.alt}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                  // Ride the wall of the cylinder.
                  transform: `rotateY(${cardAngle.toFixed(3)}deg) translateZ(${radius}px) rotateX(${TILT_X}deg)`,
                }}
              >
                <img
                  src={`https://picsum.photos/seed/${item.seed}/400/356`}
                  alt={item.alt}
                  draggable={false}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption + play/pause control */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: isMobile ? 6 : 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid var(--border-light)",
            background: "var(--surface-pill)",
          }}
        >
          Drag to rotate • Flick to spin • ← / → to nudge
        </span>
        <button
          type="button"
          data-cursor="hover"
          onClick={() => setAutoOn((value) => !value)}
          aria-pressed={autoOn}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: autoOn ? "#ffffff" : "var(--text-primary)",
            background: autoOn ? "var(--accent-blue)" : "var(--surface-card-strong)",
            padding: "6px 16px",
            borderRadius: 999,
            border: "1px solid var(--border-light)",
            cursor: "pointer",
          }}
        >
          {autoOn ? "Auto-spinning" : "Paused"}
        </button>
      </div>
    </div>
  );
}
