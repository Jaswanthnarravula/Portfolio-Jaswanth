"use client";

import { motion } from "framer-motion";
import { Brain, Cloud, Code2, Database, Layers, Network } from "lucide-react";
import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import SectionTitle from "../components/SectionTitle";
import ThreeDTiltCard from "../components/ThreeDTiltCard";

const subjectCards = [
  {
    title: "Data Structures & Algorithms",
    color: "#0071e3",
    icon: Code2,
    description: "Optimization strategy, asymptotic analysis, and robust algorithm design.",
  },
  {
    title: "Database Management",
    color: "#5e5ce6",
    icon: Database,
    description: "Schema design, query tuning, indexing strategy, and data lifecycle control.",
  },
  {
    title: "AI & Machine Learning",
    color: "#ff9500",
    icon: Brain,
    description: "Forecasting, classification, evaluation workflows, and production inference patterns.",
  },
  {
    title: "Cloud Computing",
    color: "#34c759",
    icon: Cloud,
    description: "Distributed deployment, autoscaling strategy, and resilient service design.",
  },
  {
    title: "Software Engineering",
    color: "#ff2d55",
    icon: Layers,
    description: "Architecture decomposition, test strategy, release quality, and maintainability.",
  },
  {
    title: "Distributed Systems",
    color: "#00c7be",
    icon: Network,
    description: "Consistency models, replication semantics, recovery patterns, and fault handling.",
  },
];

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "SQL",
  "React.js",
  "Node.js",
  "Django",
  "Flask",
  "TensorFlow",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST APIs",
  "Git",
];

export default function AboutPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return (
    <section style={{ paddingBottom: 74 }}>
      <PageContainer>
        <SectionTitle
          title="About"
          subtitle="Master of Science in Computer Science at UAB, focused on building intelligent and dependable software systems."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr",
            gap: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ display: "grid", gap: 14 }}
          >
            <div style={{ perspective: "1000px" }}>
              <ThreeDTiltCard
                isMobile={isMobile}
                style={{
                  borderRadius: 22,
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  padding: 24,
                }}
              >
                <div
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(0,113,227,1) 0%, rgba(94,92,230,0.94) 100%)",
                    color: "#ffffff",
                    fontSize: 36,
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  JN
                </div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "clamp(24px, 3vw, 34px)",
                    lineHeight: 1.14,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Jaswanth Narravula
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontSize: 16,
                  }}
                >
                  Software Engineer
                  <br />
                  Birmingham, AL
                </p>
              </ThreeDTiltCard>
            </div>

            <div style={{ perspective: "1000px" }}>
              <ThreeDTiltCard
                isMobile={isMobile}
                style={{
                  borderRadius: 22,
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  padding: 22,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--accent-blue)",
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  Education
                </p>
                <h3
                  style={{
                    margin: "8px 0 6px",
                    fontSize: "clamp(21px, 3vw, 29px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  University of Alabama at Birmingham
                </h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Master of Science in Computer Science
                </p>
              </ThreeDTiltCard>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p
              style={{
                marginTop: 0,
                marginBottom: 12,
                color: "var(--text-primary)",
                fontSize: "clamp(16px, 2vw, 21px)",
                lineHeight: 1.68,
              }}
            >
              My work sits at the intersection of machine intelligence, backend
              reliability, and interface clarity. I focus on systems that are
              measurable, explainable, and dependable when constraints change.
            </p>
            <p
              style={{
                marginTop: 0,
                marginBottom: 22,
                color: "var(--text-secondary)",
                fontSize: "clamp(15px, 1.9vw, 17px)",
                lineHeight: 1.68,
              }}
            >
              This portfolio is structured to show not only final outputs, but
              also decision making, tradeoffs, and delivery execution across
              each project lifecycle.
            </p>

            <h3
              style={{
                marginTop: 0,
                marginBottom: 14,
                fontSize: "clamp(27px, 3.2vw, 38px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Core CS Subjects
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {subjectCards.map((subject, index) => {
                const Icon = subject.icon;

                return (
                  <div key={subject.title} style={{ perspective: "1000px" }}>
                    <motion.div
                      initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9 }}
                      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                      style={{
                        borderRadius: 16,
                        border: "1px solid var(--border-light)",
                        background: "var(--background-primary)",
                        padding: "14px 14px 16px",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: `${subject.color}1A`,
                          color: subject.color,
                          display: "grid",
                          placeItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h4 style={{ margin: "0 0 8px", fontSize: 16, lineHeight: 1.3 }}>
                        {subject.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-secondary)",
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        {subject.description}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: "clamp(27px, 3.2vw, 38px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Technical Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map((skill, index) => {
                const depthOffset = ((index % 6) - 3) * (isMobile ? 4 : 8);

                return (
                  <div key={skill} style={{ perspective: "1000px" }}>
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: 20, z: -50 - Math.abs(depthOffset) }}
                      whileInView={{ opacity: 1, scale: 1, y: 0, z: depthOffset }}
                      whileHover={{ y: -4, z: depthOffset + 14 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        delay: 0.7 + index * 0.03,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        background: "var(--background-primary)",
                        color: "var(--text-primary)",
                        padding: "8px 13px",
                        fontSize: 14,
                        lineHeight: 1,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {skill}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
