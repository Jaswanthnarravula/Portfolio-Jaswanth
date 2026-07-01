"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/PageContainer";
import SectionTitle from "../components/SectionTitle";
import ThreeDTiltCard from "../components/ThreeDTiltCard";
import { profileIdentity } from "../data/profile";

function buildWhatsappUrl(value) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function displayUrl(value) {
  if (!value) {
    return "";
  }

  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function ContactPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const whatsappUrl = buildWhatsappUrl(profileIdentity.whatsapp);

  const channels = useMemo(
    () => [
      {
        key: "gmail",
        label: "Gmail",
        icon: Mail,
        accent: "#ea4335",
        description: "Best for hiring outreach, interview scheduling, and formal collaboration.",
        value: profileIdentity.email,
        href: `mailto:${profileIdentity.email}`,
        action: "Send Email",
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        icon: Linkedin,
        accent: "#0a66c2",
        description: "Professional profile, networking, and career-focused communication.",
        value: profileIdentity.linkedinUrl
          ? displayUrl(profileIdentity.linkedinUrl)
          : "Add LinkedIn URL in profile data",
        href: profileIdentity.linkedinUrl,
        action: "Open LinkedIn",
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        icon: MessageCircle,
        accent: "#25d366",
        description: "Quick updates and short real-time communication windows.",
        value: profileIdentity.whatsapp || "Add WhatsApp number or link in profile data",
        href: whatsappUrl,
        action: "Open WhatsApp",
      },
      {
        key: "instagram",
        label: "Instagram",
        icon: Instagram,
        accent: "#e4405f",
        description: "Social presence and direct messaging for lightweight communication.",
        value: profileIdentity.instagramUrl
          ? displayUrl(profileIdentity.instagramUrl)
          : "Add Instagram URL in profile data",
        href: profileIdentity.instagramUrl,
        action: "Open Instagram",
      },
    ],
    [whatsappUrl],
  );

  return (
    <section style={{ paddingBottom: 90 }}>
      <PageContainer>
        <SectionTitle
          title="Contact"
          align="center"
          subtitle="Open to software engineering opportunities, technical collaboration, and product architecture discussions."
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.68, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.12fr 0.88fr",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={{ perspective: "1000px" }}>
            <ThreeDTiltCard
              isMobile={isMobile}
              style={{
                borderRadius: 20,
                border: "1px solid var(--border-light)",
                background: "var(--background-primary)",
                padding: isMobile ? 18 : 22,
                minHeight: 210,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--accent-blue)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Professional Contact
              </p>
              <h3
                style={{
                  margin: "8px 0 10px",
                  fontSize: "clamp(30px, 4vw, 46px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                }}
              >
                Let&apos;s Connect
              </h3>
              <p
                style={{
                  margin: "0 0 14px",
                  color: "var(--text-secondary)",
                  fontSize: "clamp(15px, 1.9vw, 18px)",
                  lineHeight: 1.62,
                }}
              >
                I am available for software engineering roles, platform architecture work, and
                intelligent product collaborations.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <span
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--border-light)",
                    padding: "7px 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <MapPin size={14} />
                  {profileIdentity.location}
                </span>
                <span
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--border-light)",
                    padding: "7px 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <Clock3 size={14} />
                  Reply window: within 24 hours
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`mailto:${profileIdentity.email}`}
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
                  <Send size={15} />
                  Email Me
                </Link>
                <Link
                  href={profileIdentity.resumePath}
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
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: 14,
                    background: "var(--background-secondary)",
                  }}
                >
                  View Resume
                </Link>
              </div>
            </ThreeDTiltCard>
          </div>

          <div style={{ perspective: "1000px" }}>
            <ThreeDTiltCard
              isMobile={isMobile}
              style={{
                borderRadius: 20,
                border: "1px solid var(--border-light)",
                background: "var(--background-primary)",
                padding: isMobile ? 18 : 22,
                minHeight: 210,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 24 }}>Communication Preferences</h4>
              <p
                style={{
                  margin: "0 0 14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.62,
                  fontSize: 15,
                }}
              >
                For role-specific discussions, email and LinkedIn are preferred. WhatsApp and
                Instagram are available for quick conversation.
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                <div
                  style={{
                    borderRadius: 12,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-secondary)",
                    padding: "10px 12px",
                  }}
                >
                  <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: 14 }}>Primary</p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>
                    Gmail and LinkedIn
                  </p>
                </div>
                <div
                  style={{
                    borderRadius: 12,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-secondary)",
                    padding: "10px 12px",
                  }}
                >
                  <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: 14 }}>Secondary</p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>
                    WhatsApp and Instagram
                  </p>
                </div>
              </div>
            </ThreeDTiltCard>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            const isActive = Boolean(channel.href);

            return (
              <motion.div
                key={channel.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.56, delay: index * 0.07 }}
                style={{ perspective: "1000px" }}
              >
                <ThreeDTiltCard
                  isMobile={isMobile}
                  style={{
                    borderRadius: 18,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-primary)",
                    padding: 18,
                    minHeight: 198,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        color: channel.accent,
                        background: `${channel.accent}1A`,
                        border: `1px solid ${channel.accent}3D`,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--border-light)",
                        padding: "5px 10px",
                        fontSize: 12,
                        color: isActive ? "#166534" : "#7c2d12",
                        background: isActive ? "rgba(34,197,94,0.12)" : "rgba(251,146,60,0.14)",
                      }}
                    >
                      {isActive ? "Available" : "Setup Needed"}
                    </span>
                  </div>

                  <h4 style={{ margin: "0 0 6px", fontSize: 24, lineHeight: 1.18 }}>
                    {channel.label}
                  </h4>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: "var(--text-secondary)",
                      fontSize: 14,
                      lineHeight: 1.58,
                    }}
                  >
                    {channel.description}
                  </p>
                  <p
                    style={{
                      margin: "0 0 12px",
                      color: "var(--text-primary)",
                      fontSize: 14,
                      fontWeight: 500,
                      wordBreak: "break-word",
                    }}
                  >
                    {channel.value}
                  </p>

                  {isActive ? (
                    <Link
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                      data-cursor="hover"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        textDecoration: "none",
                        color: "var(--accent-blue)",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {channel.action}
                      <ArrowUpRight size={15} />
                    </Link>
                  ) : (
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>
                      Update this link in `app/data/profile.js`
                    </p>
                  )}
                </ThreeDTiltCard>
              </motion.div>
            );
          })}
        </div>

        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "clamp(12px, 1.4vw, 14px)",
          }}
        >
          Designed and Built by {profileIdentity.name} (c) {new Date().getFullYear()}
        </p>
      </PageContainer>
    </section>
  );
}
