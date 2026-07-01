"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Compass } from "lucide-react";
import { useState } from "react";

export default function WalkthroughTimeline({ chapters }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  const toggleChapter = (chapterId) => {
    setActiveId((previous) => (previous === chapterId ? "" : chapterId));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {chapters.map((chapter, index) => {
        const open = activeId === chapter.id;

        return (
          <div key={chapter.id} style={{ perspective: "1000px" }}>
            <motion.article
              initial={{ opacity: 0, rotateX: -15, rotateY: 10, z: -100, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.06 }}
              style={{
                borderRadius: 18,
                border: "1px solid var(--border-light)",
                background: "var(--background-primary)",
                overflow: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <button
                type="button"
                data-cursor="hover"
                onClick={() => toggleChapter(chapter.id)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  minHeight: 62,
                  padding: "14px 18px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(0,113,227,0.11)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--accent-blue)",
                    }}
                  >
                    <Compass size={15} />
                  </span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-secondary)",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {chapter.step}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "var(--text-primary)",
                        fontSize: "clamp(16px, 2vw, 19px)",
                        fontWeight: 600,
                      }}
                    >
                      {chapter.question}
                    </p>
                  </div>
                </div>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.24 }}>
                  <ChevronDown size={18} color="var(--text-secondary)" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        borderTop: "1px solid var(--border-light)",
                        padding: "14px 18px 18px",
                      }}
                    >
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 12,
                          color: "var(--text-primary)",
                          fontSize: 15,
                          lineHeight: 1.7,
                        }}
                      >
                        {chapter.narrative}
                      </p>
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 8,
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Key Decisions
                      </p>
                      <ul style={{ marginTop: 0, marginBottom: 12, paddingLeft: 20 }}>
                        {chapter.decisions.map((decision) => (
                          <li
                            key={decision}
                            style={{
                              color: "var(--text-primary)",
                              fontSize: 15,
                              lineHeight: 1.6,
                              marginBottom: 6,
                            }}
                          >
                            {decision}
                          </li>
                        ))}
                      </ul>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 15,
                          color: "var(--text-primary)",
                          lineHeight: 1.65,
                        }}
                      >
                        <strong>Outcome:</strong> {chapter.outcome}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          </div>
        );
      })}
    </div>
  );
}
