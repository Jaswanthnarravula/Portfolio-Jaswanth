"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  MapPin,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
  experienceSummary,
  internships,
  workExperiences,
  workshops,
} from "../data/experience";
import { certifications, profileIdentity } from "../data/profile";

const riseIn = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggered = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

function WordRevealHeading({ text, as = "h2", style = {}, delay = 0, once = true }) {
  const words = useMemo(() => text.split(" "), [text]);
  const Tag = as;

  return (
    <Tag style={style}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: index === words.length - 1 ? 0 : "0.24em",
            verticalAlign: "bottom",
            paddingBottom: "0.02em",
          }}
        >
          <motion.span
            initial={{ y: "112%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once, amount: 0.86 }}
            transition={{
              duration: 0.56,
              delay: delay + index * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function MetaText({ icon: Icon, text }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--text-secondary)",
        fontSize: 13,
      }}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}

function SectionKicker({ icon: Icon, text }) {
  return (
    <p
      style={{
        margin: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: "var(--accent-blue)",
      }}
    >
      <Icon size={14} />
      {text}
    </p>
  );
}

export default function ExperiencePage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 920;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return (
    <>
      <section
        style={{
          paddingBlock: isMobile ? 34 : 66,
          borderBottom: "1px solid var(--border-light)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(239,246,255,0.42) 100%)",
        }}
      >
        <PageContainer wide>
          <motion.div variants={staggered} initial="hidden" animate="show" style={{ maxWidth: 980 }}>
            <motion.p variants={riseIn} style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              Experience Navigation
            </motion.p>

            <WordRevealHeading
              as="h1"
              text="Professional Experience"
              style={{
                margin: "12px 0 10px",
                fontSize: "clamp(42px, 8vw, 84px)",
                lineHeight: 0.94,
                letterSpacing: "-0.05em",
              }}
            />

            <motion.p
              variants={riseIn}
              style={{
                margin: 0,
                maxWidth: 860,
                color: "var(--text-secondary)",
                fontSize: "clamp(16px, 1.9vw, 22px)",
                lineHeight: 1.65,
              }}
            >
              Work experience, internships, workshops, and certifications in a single, text-first
              narrative with restrained professional motion.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggered}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {experienceSummary.map((item) => (
              <motion.div
                key={item.label}
                variants={riseIn}
                style={{
                  borderRadius: 14,
                  border: "1px solid var(--border-light)",
                  background: "var(--surface-card)",
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: item.accent,
                  }}
                >
                  {item.label}
                </p>
                <p style={{ margin: "8px 0 4px", fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
                  {item.value}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 34 : 58 }}>
        <PageContainer wide>
          <SectionKicker icon={BriefcaseBusiness} text="Work Experience" />
          <WordRevealHeading
            text="Engineering Roles and Impact"
            style={{
              margin: "10px 0 18px",
              fontSize: "clamp(30px, 4.8vw, 56px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
            }}
          />

          <div
            style={{
              position: "relative",
              paddingLeft: isMobile ? 0 : 26,
              borderLeft: isMobile ? "none" : "1px solid var(--border-light)",
            }}
          >
            <motion.div variants={staggered} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} style={{ display: "grid", gap: 18 }}>
              {workExperiences.map((experience) => (
                <motion.article
                  key={`${experience.role}-${experience.period}`}
                  variants={riseIn}
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--border-light)",
                    background: "var(--surface-card)",
                    padding: isMobile ? 16 : 18,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <WordRevealHeading
                      as="h3"
                      text={experience.role}
                      style={{
                        margin: 0,
                        fontSize: "clamp(24px, 3.2vw, 36px)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}
                      delay={0.04}
                    />
                    <span
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        background: "var(--background-secondary)",
                      }}
                    >
                      {experience.domain}
                    </span>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.72 }}
                    transition={{ duration: 0.54, delay: 0.06 }}
                    style={{
                      margin: "6px 0 0",
                      fontSize: 15,
                      color: "var(--text-secondary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Building2 size={15} />
                    {experience.organization}
                  </motion.p>

                  <motion.div
                    variants={staggered}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}
                  >
                    <motion.div variants={riseIn}>
                      <MetaText icon={CalendarClock} text={experience.period} />
                    </motion.div>
                    <motion.div variants={riseIn}>
                      <MetaText icon={MapPin} text={experience.location} />
                    </motion.div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.65 }}
                    transition={{ duration: 0.56, delay: 0.12 }}
                    style={{
                      margin: "12px 0 0",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {experience.summary}
                  </motion.p>

                  <motion.ul
                    variants={staggered}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.55 }}
                    style={{ margin: "12px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}
                  >
                    {experience.highlights.map((point) => (
                      <motion.li key={point} variants={riseIn} style={{ color: "var(--text-primary)", lineHeight: 1.52, fontSize: 14 }}>
                        {point}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.85 }}
                    transition={{ duration: 0.56, delay: 0.16 }}
                    style={{ margin: "12px 0 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}
                  >
                    Stack: {experience.stack.join(", ")}
                  </motion.p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 30 : 54 }}>
        <PageContainer wide>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <div>
              <SectionKicker icon={UsersRound} text="Internships" />
              <WordRevealHeading
                text="Internship Progress"
                style={{ margin: "10px 0 14px", fontSize: "clamp(28px, 4.2vw, 46px)", letterSpacing: "-0.03em", lineHeight: 1.08 }}
              />

              <motion.div variants={staggered} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} style={{ display: "grid", gap: 12 }}>
                {internships.map((entry) => (
                  <motion.article
                    key={`${entry.role}-${entry.period}`}
                    variants={riseIn}
                    style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--surface-card)", padding: 14 }}
                  >
                    <WordRevealHeading as="h3" text={entry.role} style={{ margin: 0, fontSize: "clamp(22px, 2.5vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }} />
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>{entry.organization}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
                      {entry.period} | {entry.location} | {entry.status}
                    </p>
                    <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.58 }}>{entry.summary}</p>
                    <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                      {entry.bullets.map((point) => (
                        <li key={point} style={{ fontSize: 13, lineHeight: 1.48 }}>{point}</li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </motion.div>
            </div>

            <div>
              <SectionKicker icon={GraduationCap} text="Workshops" />
              <WordRevealHeading
                text="Workshop Contributions"
                style={{ margin: "10px 0 14px", fontSize: "clamp(28px, 4.2vw, 46px)", letterSpacing: "-0.03em", lineHeight: 1.08 }}
              />

              <motion.div variants={staggered} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} style={{ display: "grid", gap: 12 }}>
                {workshops.map((workshop) => (
                  <motion.article
                    key={workshop.title}
                    variants={riseIn}
                    style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--surface-card)", padding: 14 }}
                  >
                    <WordRevealHeading as="h3" text={workshop.title} style={{ margin: 0, fontSize: "clamp(22px, 2.5vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em" }} />
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>{workshop.host}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
                      {workshop.period} | {workshop.format}
                    </p>
                    <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                      {workshop.outcomes.map((outcome) => (
                        <li key={outcome} style={{ fontSize: 13, lineHeight: 1.48 }}>{outcome}</li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 30 : 56 }}>
        <PageContainer wide>
          <SectionKicker icon={Award} text="Certifications" />
          <WordRevealHeading
            text="Credential Path"
            style={{
              margin: "10px 0 16px",
              fontSize: "clamp(30px, 4.6vw, 52px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          />

          <div style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--surface-card)", overflow: "hidden" }}>
            {certifications.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.56, delay: index * 0.06 }}
                style={{
                  padding: isMobile ? "14px 14px" : "14px 16px",
                  borderTop: index === 0 ? "none" : "1px solid var(--border-light)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <WordRevealHeading
                    as="h3"
                    text={credential.title}
                    style={{ margin: 0, fontSize: "clamp(21px, 2.4vw, 30px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
                    delay={0.02}
                  />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{credential.issued}</span>
                </div>

                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
                  {credential.issuer} | {credential.status}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {credential.credentialId}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  Focus: {credential.focus.join(", ")}
                </p>
                <Link
                  href={credential.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--accent-blue)",
                  }}
                >
                  Verification Portal
                  <ExternalLink size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 34 : 58 }}>
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 14,
              border: "1px solid var(--border-light)",
              background: "var(--surface-card)",
              padding: isMobile ? 16 : 20,
            }}
          >
            <WordRevealHeading
              as="h3"
              text="Open to Software Engineering Roles and Internships"
              style={{ margin: 0, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.52, delay: 0.08 }}
              style={{ margin: "10px 0 0", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.62 }}
            >
              {profileIdentity.name} is available for internships and full-time opportunities focused
              on intelligent systems, reliability engineering, and product-focused software delivery.
            </motion.p>

            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/contact"
                data-cursor="hover"
                style={{
                  minHeight: 44,
                  borderRadius: 999,
                  padding: "10px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  background: "var(--accent-blue)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Contact
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/resume"
                data-cursor="hover"
                style={{
                  minHeight: 44,
                  borderRadius: 999,
                  padding: "10px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Resume
              </Link>
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </>
  );
}
