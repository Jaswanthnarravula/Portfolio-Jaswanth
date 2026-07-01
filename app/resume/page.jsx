"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, FileText, Mail, MapPin } from "lucide-react";
import PageContainer from "../components/PageContainer";
import SectionTitle from "../components/SectionTitle";
import {
  certifications,
  educationJourney,
  primaryTechStack,
  profileIdentity,
  resumeHighlights,
} from "../data/profile";

export default function ResumePage() {
  return (
    <section style={{ paddingBottom: 70 }}>
      <PageContainer>
        <SectionTitle
          title="Resume"
          subtitle="Web resume format with print-to-PDF support."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ borderRadius: 20, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 22, marginBottom: 14 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                {profileIdentity.name}
              </h2>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 16 }}>
                {profileIdentity.role} | {profileIdentity.location}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ minHeight: 42, borderRadius: 999, border: "1px solid var(--border-light)", background: "var(--background-secondary)", color: "var(--text-primary)", padding: "10px 15px", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                <Download size={15} />
                Print / Save PDF
              </button>
              <Link
                href={`mailto:${profileIdentity.email}?subject=Resume%20Request`}
                style={{ minHeight: 42, borderRadius: 999, background: "var(--accent-blue)", color: "#ffffff", textDecoration: "none", padding: "10px 15px", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600 }}
              >
                <Mail size={15} />
                Request Latest PDF
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
            {resumeHighlights.map((point) => (
              <p key={point} style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, lineHeight: 1.55 }}>
                <span style={{ marginTop: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--accent-blue)", flexShrink: 0 }} />
                {point}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {primaryTechStack.map((skill) => (
              <span key={skill} style={{ borderRadius: 999, border: "1px solid var(--border-light)", background: "var(--background-secondary)", padding: "6px 11px", fontSize: 13 }}>
                {skill}
              </span>
            ))}
          </div>

          <p style={{ margin: 0, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14 }}>
            <MapPin size={14} />
            {profileIdentity.location} | {profileIdentity.email}
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            style={{ borderRadius: 18, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 18 }}
          >
            <p style={{ margin: 0, color: "var(--accent-blue)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              <FileText size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Education
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {educationJourney.map((entry) => (
                <div key={`${entry.title}-${entry.period}`}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>{entry.title}</p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>
                    {entry.institution} | {entry.period}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{ borderRadius: 18, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 18 }}
          >
            <p style={{ margin: 0, color: "var(--accent-blue)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Certifications
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              {certifications.map((credential) => (
                <div key={credential.title}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>{credential.title}</p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>
                    {credential.issuer} | {credential.status}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
