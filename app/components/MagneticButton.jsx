"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

/**
 * Magnetic hover wrapper: the child gravitates toward the cursor while it is
 * inside the hit area, then springs back on leave. Wrap any Link or button.
 */
export default function MagneticButton({ children, strength = 0.32, style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.32 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.32 });

  const handleMouseMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", x: springX, y: springY, ...style }}
    >
      {children}
    </motion.div>
  );
}
