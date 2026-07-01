"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SnapshotGallery({ snapshots, isMobile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
        gap: 14,
      }}
    >
      {snapshots.map((snapshot, index) => (
        <div key={snapshot.src} style={{ perspective: "1000px" }}>
          <motion.figure
            initial={{ opacity: 0, rotateY: 25, scale: 0.8, z: -80 }}
            whileInView={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
            whileHover={{
              scale: 1.02,
              rotateY: isMobile ? 0 : (index % 2 === 0 ? -3 : 3),
              y: -6,
              boxShadow: "0 24px 46px rgba(0, 0, 0, 0.14)",
            }}
            style={{
              margin: 0,
              borderRadius: 18,
              border: "1px solid var(--border-light)",
              background: "var(--background-primary)",
              overflow: "hidden",
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={snapshot.src}
              alt={snapshot.title}
              width={1400}
              height={900}
              sizes={isMobile ? "100vw" : "(max-width: 1200px) 34vw, 25vw"}
              quality={70}
              style={{
                width: "100%",
                height: isMobile ? 220 : 200,
                objectFit: "cover",
                display: "block",
              }}
            />
            <figcaption style={{ padding: 14 }}>
              <p
                style={{
                  margin: "0 0 6px",
                  color: "var(--text-primary)",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {snapshot.title}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {snapshot.caption}
              </p>
            </figcaption>
          </motion.figure>
        </div>
      ))}
    </div>
  );
}
