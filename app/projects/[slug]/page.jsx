"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MetricGrid from "../../components/MetricGrid";
import PageContainer from "../../components/PageContainer";
import SectionTitle from "../../components/SectionTitle";
import SnapshotGallery from "../../components/SnapshotGallery";
import ThreeDTiltCard from "../../components/ThreeDTiltCard";
import WalkthroughTimeline from "../../components/WalkthroughTimeline";
import { projectsBySlug } from "../../data/projects";
import { projectKnowledgeBase } from "../../data/projectKnowledgeBase";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const project = slug ? projectsBySlug[slug] : undefined;
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [visibleKnowledgeCount, setVisibleKnowledgeCount] = useState(12);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const knowledgeEntries = useMemo(() => {
    if (!project) {
      return [];
    }

    return projectKnowledgeBase[project.slug] ?? [];
  }, [project]);

  if (!project) {
    return (
      <PageContainer style={{ paddingBottom: 80 }}>
        <SectionTitle
          title="Project Not Found"
          subtitle="The requested project route is unavailable. Return to the projects page and select a listed walkthrough."
        />
        <Link
          href="/projects"
          data-cursor="hover"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 44,
            borderRadius: 999,
            padding: "10px 18px",
            textDecoration: "none",
            background: "var(--accent-blue)",
            color: "#ffffff",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          Back To Projects
        </Link>
      </PageContainer>
    );
  }

  return (
    <section style={{ paddingBottom: 84 }}>
      <PageContainer>
        <Link
          href="/projects"
          data-cursor="hover"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            borderRadius: 999,
            padding: "8px 14px",
            textDecoration: "none",
            border: "1px solid var(--border-light)",
            background: "var(--background-primary)",
            color: "var(--text-primary)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={15} />
          Back To Projects
        </Link>

        <div style={{ perspective: "1000px", marginBottom: 24 }}>
          <motion.div
            initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              borderRadius: 26,
              border: "1px solid var(--border-light)",
              background: "var(--background-primary)",
              overflow: "hidden",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.02fr 1fr",
                gap: 18,
                padding: isMobile ? 18 : 24,
              }}
            >
              <div style={{ perspective: "1000px" }}>
                <motion.div
                  initial={{ opacity: 0, rotateY: 25, scale: 0.8, z: -80 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    background: project.heroGradient,
                    minHeight: isMobile ? 260 : 320,
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: isMobile ? 260 : 320,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 14,
                      color: "#ffffff",
                      fontSize: 13,
                      fontFamily:
                        "'SF Mono', 'Monaco', 'Courier New', monospace",
                      letterSpacing: "0.07em",
                    }}
                  >
                    PROJECT {project.number}
                  </div>
                </motion.div>
              </div>

              <div>
                <h1
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    fontSize: "clamp(34px, 5vw, 58px)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.035em",
                    fontFamily:
                      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {project.title}
                </h1>
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    color: "var(--text-secondary)",
                    fontSize: "clamp(16px, 2vw, 20px)",
                    lineHeight: 1.55,
                  }}
                >
                  {project.subtitle}
                </p>
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: 16,
                    color: "var(--text-primary)",
                    fontSize: "clamp(15px, 1.8vw, 17px)",
                    lineHeight: 1.65,
                  }}
                >
                  {project.intro}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {project.techStack.map((tech) => (
                    <span
                      key={`${project.slug}-${tech}`}
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        background: "var(--background-secondary)",
                        color: "var(--text-primary)",
                        padding: "6px 12px",
                        fontSize: 13,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href="/gallery"
                  data-cursor="hover"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 44,
                    borderRadius: 999,
                    padding: "10px 18px",
                    textDecoration: "none",
                    background: "var(--accent-blue)",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  View Full Snapshot Gallery
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <SectionTitle
          title="Impact Metrics"
          subtitle="Measured outcomes from implementation, rollout, and real usage behavior."
          marginBottom={18}
        />
        <MetricGrid metrics={project.metrics} />

        <div style={{ marginTop: 44 }}>
          <SectionTitle
            title="Overview"
            subtitle="From problem framing through architecture decisions, this walkthrough captures how the system was engineered and validated."
            marginBottom={18}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ perspective: "1000px" }}>
              <ThreeDTiltCard
                isMobile={isMobile}
                style={{
                  borderRadius: 18,
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  padding: 18,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 23 }}>Project Overview</h3>
                {project.overview.map((paragraph) => (
                  <p
                    key={paragraph}
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </ThreeDTiltCard>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ perspective: "1000px" }}>
                <ThreeDTiltCard
                  isMobile={isMobile}
                  style={{
                    borderRadius: 18,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-primary)",
                    padding: 18,
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>Key Challenges</h3>
                  <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                    {project.challenges.map((item) => (
                      <li key={item} style={{ marginBottom: 8, lineHeight: 1.6 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </ThreeDTiltCard>
              </div>
              <div style={{ perspective: "1000px" }}>
                <ThreeDTiltCard
                  isMobile={isMobile}
                  style={{
                    borderRadius: 18,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-primary)",
                    padding: 18,
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>Resolution Strategy</h3>
                  <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                    {project.resolution.map((item) => (
                      <li key={item} style={{ marginBottom: 8, lineHeight: 1.6 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </ThreeDTiltCard>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionTitle
            title="Walkthrough"
            subtitle="Click each chapter for a step by step explanation of decisions, implementation details, and outcomes."
            marginBottom={18}
          />
          <WalkthroughTimeline chapters={project.walkthrough} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionTitle
            title="Result Snapshots"
            subtitle="Visual checkpoints from dashboards, runbooks, and validation views."
            marginBottom={18}
          />
          <SnapshotGallery snapshots={project.snapshots} isMobile={isMobile} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionTitle
            title="Question Library"
            subtitle="A large bank of project specific Q and A prompts prepared for demos, interviews, and deep technical discussions."
            marginBottom={18}
          />
          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {knowledgeEntries.slice(0, visibleKnowledgeCount).map((entry) => (
              <div key={entry.id} style={{ perspective: "1000px" }}>
                <motion.article
                  initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    borderRadius: 14,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-primary)",
                    padding: "14px 16px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 8,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Prompt {entry.id}
                  </p>
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 8,
                      fontSize: 16,
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {entry.question}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {entry.answer}
                  </p>
                </motion.article>
              </div>
            ))}
          </div>
          {visibleKnowledgeCount < knowledgeEntries.length ? (
            <button
              type="button"
              data-cursor="hover"
              onClick={() =>
                setVisibleKnowledgeCount((previous) =>
                  Math.min(previous + 12, knowledgeEntries.length),
                )
              }
              style={{
                marginTop: 14,
                border: "none",
                borderRadius: 999,
                minHeight: 46,
                padding: "10px 20px",
                background: "var(--accent-blue)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Load More Questions
              <ArrowRight size={16} />
            </button>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
