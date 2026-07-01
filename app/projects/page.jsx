"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import ProjectPromptCard from "../components/ProjectPromptCard";
import SectionTitle from "../components/SectionTitle";
import { projects } from "../data/projects";

export default function ProjectsPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return (
    <section style={{ paddingBottom: 80 }}>
      <PageContainer wide>
        <SectionTitle
          title="Projects"
          subtitle="Each project card invites a direct deep dive. Hover to get the motion prompt, then click Walk Me Through for full architecture, outcomes, and snapshots."
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          style={{
            marginTop: 0,
            marginBottom: 22,
            maxWidth: 920,
            color: "var(--text-secondary)",
            fontSize: "clamp(15px, 2vw, 19px)",
            lineHeight: 1.65,
          }}
        >
          Instead of flattening project stories into short cards, this site now
          uses a route based system: overview on this page, and complete
          technical walkthroughs in dedicated project pages.
        </motion.p>

        {projects.map((project, index) => (
          <ProjectPromptCard
            key={project.slug}
            project={project}
            index={index}
            isMobile={isMobile}
          />
        ))}
      </PageContainer>
    </section>
  );
}
