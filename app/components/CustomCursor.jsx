"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function CustomCursor({ disabled }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [touchDetected, setTouchDetected] = useState(false);

  const shouldRenderCursor = useMemo(
    () => !disabled && !prefersReducedMotion && !touchDetected,
    [disabled, prefersReducedMotion, touchDetected],
  );

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduceMotionChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    handleReduceMotionChange();
    mediaQuery.addEventListener("change", handleReduceMotionChange);

    const handleFirstTouch = () => {
      setTouchDetected(true);
    };
    window.addEventListener("touchstart", handleFirstTouch, { once: true });

    return () => {
      mediaQuery.removeEventListener("change", handleReduceMotionChange);
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, [disabled]);

  useEffect(() => {
    if (!shouldRenderCursor) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseOver = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const interactiveElement = event.target.closest(
        "a, button, [data-cursor='hover'], input, textarea, select",
      );
      setIsHovering(Boolean(interactiveElement));
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [shouldRenderCursor]);

  if (!shouldRenderCursor) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid var(--accent-blue)",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      <motion.div
        aria-hidden
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent-blue)",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
        }}
      />
    </>
  );
}
