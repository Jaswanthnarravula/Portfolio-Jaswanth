"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import SectionTitle from "../components/SectionTitle";
import SnapshotGallery from "../components/SnapshotGallery";
import { projects } from "../data/projects";

export default function GalleryPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return (
    <section style={{ paddingBottom: 84 }}>
      <PageContainer>
        <SectionTitle
          title="Gallery"
          subtitle="Snapshots, result visuals, and interface captures for each project journey."
        />
        {projects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: index * 0.05 }}
            style={{ marginBottom: 40 }}
          >
            <div
              style={{
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Project {project.number}
                </p>
                <h3
                  style={{
                    margin: "6px 0 0",
                    fontSize: "clamp(26px, 4vw, 42px)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {project.title}
                </h3>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                data-cursor="hover"
                style={{
                  minHeight: 44,
                  padding: "10px 18px",
                  borderRadius: 999,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#ffffff",
                  background: "var(--accent-blue)",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Walk Me Through
                <ArrowRight size={16} />
              </Link>
            </div>
            <SnapshotGallery snapshots={project.snapshots} isMobile={isMobile} />
          </motion.div>
        ))}
      </PageContainer>
    </section>
  );
}
