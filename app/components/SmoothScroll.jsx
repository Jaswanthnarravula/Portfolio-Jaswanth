"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { useIntro } from "./IntroProvider";

/**
 * Buttery inertia scrolling via Lenis. Drives the native window scroll, so
 * framer-motion's useScroll / useTransform hooks keep working untouched.
 * Held still while the hello intro is on screen.
 */
export default function SmoothScroll({ children }) {
  const { stage } = useIntro();
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };
    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) {
      return;
    }

    if (stage === "done") {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [stage]);

  return children;
}
