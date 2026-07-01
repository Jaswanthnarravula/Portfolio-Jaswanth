"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

export default function SectionTitle({
  title,
  subtitle,
  align = "left",
  marginBottom = 42,
}) {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: "-90px" });
  const titleLetters = useMemo(() => title.split(""), [title]);

  return (
    <div style={{ perspective: "1000px", marginBottom }}>
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, scale: 0.7, z: -150 }}
        animate={isInView ? { opacity: 1, scale: 1, z: 0 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ textAlign: align, transformStyle: "preserve-3d" }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "clamp(36px, 7vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            color: "var(--text-primary)",
          }}
        >
          {titleLetters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 18, rotateX: -25, z: -220 + (index % 4) * 26 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, rotateX: 0, z: 0 }
                  : { opacity: 0, y: 18 }
              }
              transition={{ delay: 0.1 + index * 0.04, duration: 0.75, ease: "easeOut" }}
              style={{ display: "inline-block", transformStyle: "preserve-3d" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </h2>
        {subtitle ? (
          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              maxWidth: align === "center" ? 820 : 670,
              marginInline: align === "center" ? "auto" : 0,
              color: "var(--text-secondary)",
              fontSize: "clamp(15px, 2vw, 21px)",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
