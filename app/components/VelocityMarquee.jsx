"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

function wrap(min, max, value) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * Infinite kinetic marquee that feeds off scroll velocity: scrolling faster
 * accelerates and skews the strip; scrolling up reverses its direction.
 */
export default function VelocityMarquee({ items, baseVelocity = 2.4, style = {} }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 46,
    stiffness: 380,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1400], [0, 4.6], {
    clamp: false,
  });
  const skewX = useTransform(smoothVelocity, [-1800, 1800], [10, -10]);

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) {
      directionFactor.current = -1;
    } else if (factor > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (value) => `${wrap(-25, 0, value)}%`);

  const strip = (
    <>
      {items.map((item) => (
        <span
          key={item}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.9em" }}
        >
          <span>{item}</span>
          <span aria-hidden style={{ fontSize: "0.5em", opacity: 0.55 }}>
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      aria-hidden
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        ...style,
      }}
    >
      <motion.div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.9em",
          x,
          skewX,
          fontFamily: "var(--font-display, inherit)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontSize: "clamp(26px, 4.6vw, 54px)",
          lineHeight: 1.4,
          color: "transparent",
          WebkitTextStroke: "1.2px var(--marquee-stroke, rgba(15,23,42,0.34))",
          willChange: "transform",
        }}
      >
        {strip}
        {strip}
        {strip}
        {strip}
      </motion.div>
    </div>
  );
}
