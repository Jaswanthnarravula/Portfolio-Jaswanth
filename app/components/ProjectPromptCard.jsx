"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import ThreeDTiltCard from "./ThreeDTiltCard";

export default function ProjectPromptCard({ project, index, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const reverse = !isMobile && index % 2 === 1;
  const flyInOffset = isMobile ? 0 : reverse ? 96 : -96;

  return (
    <div style={{ perspective: "1000px", marginBottom: 28 }}>
      <motion.div
        initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9, x: flyInOffset }}
        whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.08 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <ThreeDTiltCard
          isMobile={isMobile}
          hoverScale={1.02}
          hoverLift={-10}
          onHoverChange={(hoverState) => {
            setIsHovered(hoverState);
            setShowPrompt(hoverState);
          }}
          style={{
            borderRadius: 28,
            border: "1px solid var(--border-light)",
            background: "var(--background-primary)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.08fr 1fr",
              gap: 22,
              padding: isMobile ? 20 : 26,
            }}
          >
            <div style={{ order: reverse ? 2 : 1, perspective: "1000px" }}>
              <motion.div
                initial={{ opacity: 0, rotateY: 25, scale: 0.8, z: -80 }}
                whileInView={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 + 0.1 }}
                animate={{
                  scale: isHovered ? 1.04 : 1,
                  rotateY: isHovered ? -2 : 0,
                }}
                style={{
                  borderRadius: 22,
                  background: project.heroGradient,
                  minHeight: isMobile ? 250 : 300,
                  overflow: "hidden",
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.img
                  src={project.image}
                  alt={project.imageAlt}
                  initial={{ opacity: 0, rotateY: 25, scale: 0.8, z: -80 }}
                  whileInView={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 + 0.15 }}
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: isMobile ? 250 : 300,
                    objectFit: "cover",
                    display: "block",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.54) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily:
                      "'SF Mono', 'Monaco', 'Courier New', monospace",
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                  }}
                >
                  PROJECT {project.number}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 16,
                    color: "#ffffff",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      opacity: 0.9,
                    }}
                  >
                    Explore Build
                  </p>
                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontFamily:
                        "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontSize: "clamp(22px, 2.7vw, 30px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {project.shortTitle}
                  </h3>
                </div>
              </motion.div>
            </div>

            <div style={{ order: reverse ? 1 : 2 }}>
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  fontFamily:
                    "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: "clamp(26px, 3vw, 40px)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                {project.title}
              </h3>
              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: "clamp(15px, 1.9vw, 19px)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {project.subtitle}
              </p>
              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: "clamp(15px, 1.8vw, 17px)",
                  color: "var(--text-primary)",
                  lineHeight: 1.65,
                }}
              >
                {project.summary}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {project.techStack.slice(0, 6).map((tech) => (
                  <span
                    key={`${project.slug}-${tech}`}
                    style={{
                      border: "1px solid var(--border-light)",
                      borderRadius: 999,
                      padding: "6px 12px",
                      background: "var(--background-secondary)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href={`/projects/${project.slug}`}
                data-cursor="hover"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 44,
                  padding: "10px 18px",
                  borderRadius: 999,
                  textDecoration: "none",
                  color: "#ffffff",
                  background: "var(--accent-blue)",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Walk Me Through
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <motion.div
            animate={{
              opacity: showPrompt ? 1 : 0,
              pointerEvents: showPrompt ? "auto" : "none",
            }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              padding: isMobile ? 16 : 24,
              background: "linear-gradient(145deg, rgba(3,16,38,0.84), rgba(10,18,36,0.74))",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <Sparkles size={22} style={{ marginBottom: 10 }} />
              <p style={{ marginTop: 0, marginBottom: 14, fontSize: "clamp(18px, 2.5vw, 26px)", lineHeight: 1.35 }}>
                {project.hoverQuestion}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor="hover"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 44,
                    padding: "10px 18px",
                    borderRadius: 999,
                    textDecoration: "none",
                    color: "#ffffff",
                    background: "var(--accent-blue)",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Walk Me Through
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/gallery"
                  data-cursor="hover"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 44,
                    padding: "10px 18px",
                    borderRadius: 999,
                    textDecoration: "none",
                    color: "#ffffff",
                    border: "1px solid var(--surface-outline)",
                    background: "var(--surface-overlay)",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  Show Snapshots
                </Link>
              </div>
            </div>
          </motion.div>
        </ThreeDTiltCard>
      </motion.div>
    </div>
  );
}
