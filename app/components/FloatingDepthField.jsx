"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function FloatingDepthField({ isMobile }) {
  const { scrollY } = useScroll();

  const nearY = useTransform(scrollY, [0, 2000], [0, isMobile ? 70 : 180]);
  const nearX = useTransform(scrollY, [0, 2000], [0, isMobile ? -16 : -68]);
  const midY = useTransform(scrollY, [0, 2000], [0, isMobile ? 42 : 110]);
  const midX = useTransform(scrollY, [0, 2000], [0, isMobile ? 12 : 44]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: isMobile ? 170 : 290,
          height: isMobile ? 170 : 290,
          borderRadius: "50%",
          top: isMobile ? "8%" : "12%",
          right: isMobile ? "-12%" : "6%",
          background:
            "radial-gradient(circle, rgba(0,113,227,0.18) 0%, rgba(0,113,227,0.02) 68%, rgba(0,113,227,0) 78%)",
          y: nearY,
          x: nearX,
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: isMobile ? 140 : 230,
          height: isMobile ? 140 : 230,
          borderRadius: "50%",
          top: isMobile ? "42%" : "46%",
          left: isMobile ? "-8%" : "8%",
          background:
            "radial-gradient(circle, rgba(94,92,230,0.16) 0%, rgba(94,92,230,0.01) 66%, rgba(94,92,230,0) 76%)",
          y: midY,
          x: midX,
        }}
      />
    </div>
  );
}
