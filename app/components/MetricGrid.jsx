"use client";

import { motion } from "framer-motion";

export default function MetricGrid({ metrics }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
      }}
    >
      {metrics.map((metric, index) => (
        <div key={metric.label} style={{ perspective: "1000px" }}>
          <motion.div
            initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9 }}
            whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.08 }}
            style={{
              borderRadius: 18,
              border: "1px solid var(--border-light)",
              background: "var(--background-primary)",
              padding: "18px 16px",
              transformStyle: "preserve-3d",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {metric.label}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: "var(--text-primary)",
                fontSize: "clamp(24px, 4vw, 34px)",
                fontFamily:
                  "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                letterSpacing: "-0.03em",
                fontWeight: 700,
              }}
            >
              {metric.value}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
