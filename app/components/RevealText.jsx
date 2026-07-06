"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

const WORD_EASE = [0.16, 1, 0.3, 1];

/**
 * Masked kinetic type: every word rises out of its own overflow-hidden clip
 * with a slight 3D swing — the reveal used across the site's headings.
 *
 * Visibility is tracked on the container, not the word spans: a span sitting
 * fully below its overflow-hidden clip has an intersection ratio of 0, so
 * whileInView on the span itself would never fire.
 *
 * Renders as the given tag (h1/h2/p/...) so heading semantics are preserved.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.045,
  duration = 0.85,
  once = true,
  style = {},
}) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once, amount: 0.4 });
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <Tag ref={containerRef} style={{ margin: 0, ...style }}>
      <span style={{ display: "inline" }} aria-label={text} role="text">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} aria-hidden>
            <span
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "bottom",
                paddingBottom: "0.08em",
                marginBottom: "-0.08em",
                perspective: 600,
              }}
            >
              <motion.span
                initial={{ y: "112%", rotateX: -38, opacity: 0.6 }}
                animate={
                  inView
                    ? { y: 0, rotateX: 0, opacity: 1 }
                    : { y: "112%", rotateX: -38, opacity: 0.6 }
                }
                transition={{
                  duration,
                  ease: WORD_EASE,
                  delay: delay + index * stagger,
                }}
                style={{
                  display: "inline-block",
                  transformOrigin: "50% 100%",
                  willChange: "transform",
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* Separator lives outside the clip: trailing whitespace inside an
                inline-block collapses, which would glue the words together. */}
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
