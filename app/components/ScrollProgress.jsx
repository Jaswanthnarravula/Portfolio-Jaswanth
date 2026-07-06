"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline gradient progress bar pinned to the very top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 2000,
        transformOrigin: "0% 50%",
        scaleX,
        background:
          "linear-gradient(90deg, #3b82f6 0%, #14b8a6 55%, #a78bfa 100%)",
        pointerEvents: "none",
      }}
    />
  );
}
