"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import CinematicPortrait from "./components/CinematicPortrait";
import PageContainer from "./components/PageContainer";
import PremiumShowcase from "./components/PremiumShowcase";
import RingCarousel from "./components/RingCarousel";
import ProjectPromptCard from "./components/ProjectPromptCard";
import SectionTitle from "./components/SectionTitle";
import ThreeDTiltCard from "./components/ThreeDTiltCard";
import {
  certifications,
  educationJourney,
  primaryTechStack,
  profileIdentity,
  resumeHighlights,
} from "./data/profile";
import { projects } from "./data/projects";

const capabilityCards = [
  {
    icon: Zap,
    title: "Intelligent Systems",
    description: "Forecast-aware orchestration and ML workflows built for production constraints.",
  },
  {
    icon: Layers,
    title: "Platform Reliability",
    description: "Distributed architecture with observability, resilience, and incident-ready controls.",
  },
  {
    icon: Sparkles,
    title: "Product Execution",
    description: "Shipping deep engineering systems with measurable outcomes and clear UX.",
  },
];

function formatCount(value) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

function formatActivityDate(value) {
  if (!value) {
    return "No recent public activity";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deriveActivityMetrics(events = []) {
  return events.reduce(
    (metrics, event) => {
      const eventDate = Date.parse(event.created_at);
      const repoName = event.repo?.name;

      if (repoName) {
        metrics.repositories.add(repoName);
      }

      if (Number.isFinite(eventDate) && eventDate > metrics.lastActiveUnix) {
        metrics.lastActiveUnix = eventDate;
      }

      if (event.type === "PushEvent") {
        metrics.pushCommits += event.payload?.size ?? 0;
      }

      if (event.type === "PullRequestEvent" && event.payload?.action === "opened") {
        metrics.pullRequests += 1;
      }

      if (event.type === "IssuesEvent" && event.payload?.action === "opened") {
        metrics.issues += 1;
      }

      return metrics;
    },
    {
      pushCommits: 0,
      pullRequests: 0,
      issues: 0,
      repositories: new Set(),
      lastActiveUnix: 0,
    },
  );
}

export default function HomePage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [typedName, setTypedName] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [githubState, setGithubState] = useState({
    loading: true,
    error: "",
    profile: null,
    repositories: [],
    metrics: {
      pushCommits: 0,
      pullRequests: 0,
      issues: 0,
      repositoryTouches: 0,
      lastActive: "",
    },
  });
  const { scrollY } = useScroll();
  const heroName = profileIdentity.name.toUpperCase();
  const pauseIndex =
    heroName.indexOf(" ") > -1 ? heroName.indexOf(" ") + 1 : Math.ceil(heroName.length / 2);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    let timeoutId;
    let cancelled = false;
    let index = 0;

    setTypedName("");

    const typeNext = (delay) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        index += 1;
        setTypedName(heroName.slice(0, index));

        if (index >= heroName.length) {
          return;
        }

        const nextDelay = index === pauseIndex ? 1000 : 105;
        typeNext(nextDelay);
      }, delay);
    };

    typeNext(240);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [heroName, pauseIndex]);

  useEffect(() => {
    const blinkInterval = window.setInterval(() => {
      setCursorVisible((previous) => !previous);
    }, 540);

    return () => {
      window.clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadGitHubProfile() {
      try {
        setGithubState((previous) => ({ ...previous, loading: true, error: "" }));
        const githubUsername = profileIdentity.githubUsername;
        const [profileResponse, repositoriesResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}`, {
            signal: abortController.signal,
          }),
          fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6&type=owner`,
            { signal: abortController.signal },
          ),
          fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=100`, {
            signal: abortController.signal,
          }),
        ]);

        if (!profileResponse.ok) {
          throw new Error("Unable to load GitHub profile.");
        }

        const profile = await profileResponse.json();
        const repositories = repositoriesResponse.ok
          ? await repositoriesResponse.json()
          : [];
        const events = eventsResponse.ok ? await eventsResponse.json() : [];
        const metrics = deriveActivityMetrics(events);

        setGithubState({
          loading: false,
          error: "",
          profile,
          repositories: Array.isArray(repositories) ? repositories : [],
          metrics: {
            pushCommits: metrics.pushCommits,
            pullRequests: metrics.pullRequests,
            issues: metrics.issues,
            repositoryTouches: metrics.repositories.size,
            lastActive:
              metrics.lastActiveUnix > 0
                ? new Date(metrics.lastActiveUnix).toISOString()
                : "",
          },
        });
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setGithubState((previous) => ({
          ...previous,
          loading: false,
          error: "GitHub data is temporarily unavailable.",
        }));
      }
    }

    loadGitHubProfile();
    return () => abortController.abort();
  }, []);

  const heroY = useTransform(scrollY, [0, 700], [0, isMobile ? 80 : 180]);
  const heroOpacity = useTransform(scrollY, [0, 340], [1, 0]);
  const contributionChart = `https://ghchart.rshah.org/2563eb/${profileIdentity.githubUsername}`;

  return (
    <>
      <section
        style={{
          position: "relative",
          minHeight: isMobile ? "auto" : "72vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingBlock: isMobile ? 24 : 44,
        }}
      >
        <PageContainer style={{ paddingTop: isMobile ? 30 : 42 }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(37,99,235,0.28)",
                padding: "8px 14px",
                background: "rgba(37,99,235,0.08)",
                color: "var(--accent-blue)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={14} />
              Portfolio Experience Platform
            </motion.p>
            <h1
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(46px, 10vw, 94px)",
                lineHeight: 0.93,
                letterSpacing: "-0.05em",
              }}
            >
              <span style={{ whiteSpace: "pre-wrap" }}>{typedName}</span>
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 3,
                  height: "0.88em",
                  marginLeft: 6,
                  background: "var(--text-primary)",
                  verticalAlign: "baseline",
                  opacity: cursorVisible ? 1 : 0,
                  transition: "opacity 150ms ease",
                }}
              />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.3 }}
              style={{ marginTop: 20, maxWidth: 900, color: "var(--text-secondary)", fontSize: "clamp(17px, 2.1vw, 24px)", lineHeight: 1.62 }}
            >
              {profileIdentity.headline} Explore live GitHub details, contributions, certifications,
              education journey, and resume highlights in one flow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.44 }}
              style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="/projects" data-cursor="hover" style={{ minHeight: 48, borderRadius: 999, padding: "11px 21px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", background: "var(--accent-blue)", color: "#ffffff", fontWeight: 600, fontSize: 15 }}>
                Explore Projects
                <ArrowRight size={16} />
              </Link>
              <Link href={profileIdentity.resumePath} data-cursor="hover" style={{ minHeight: 48, borderRadius: 999, padding: "11px 21px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", border: "1px solid var(--border-light)", background: "var(--surface-pill)", color: "var(--text-primary)", fontWeight: 600, fontSize: 15 }}>
                Open Resume
                <FileText size={16} />
              </Link>
              <Link href={profileIdentity.githubUrl} target="_blank" rel="noreferrer" data-cursor="hover" style={{ minHeight: 48, borderRadius: 999, padding: "11px 21px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", border: "1px solid var(--border-light)", background: "var(--surface-pill)", color: "var(--text-primary)", fontWeight: 500, fontSize: 15 }}>
                GitHub Profile
                <ExternalLink size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.56 }}
              style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 9 }}
            >
              {primaryTechStack.map((skill) => (
                <span key={skill} style={{ borderRadius: 999, border: "1px solid rgba(15,23,42,0.1)", background: "var(--surface-pill)", padding: "7px 12px", fontSize: 13 }}>
                  {skill}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </PageContainer>
      </section>

      <CinematicPortrait isMobile={isMobile} />

      <section style={{ paddingBlock: isMobile ? 46 : 68 }}>
        <PageContainer wide>
          <SectionTitle
            title="Signature Showcase"
            subtitle="A cinematic, video-style reel — drag to spin, click a panel to focus, and watch it glide with premium motion."
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <PremiumShowcase isMobile={isMobile} />
          </motion.div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 46 : 68 }}>
        <PageContainer wide>
          <SectionTitle
            title="Creative Works"
            subtitle="A rotating 3D ring — drag to spin, flick for momentum, and let it glide. Back panels dim and recede for real depth."
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <RingCarousel isMobile={isMobile} />
          </motion.div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 42 : 62 }}>
        <PageContainer>
          <SectionTitle
            title="Core Strengths"
            subtitle="Architecture depth paired with practical delivery focus."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {capabilityCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, rotateX: -14, y: 24 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.26 }}
                  transition={{ duration: 0.72, ease: "easeOut", delay: index * 0.08 }}
                  style={{ perspective: "1000px" }}
                >
                  <ThreeDTiltCard
                    isMobile={isMobile}
                    style={{
                      borderRadius: 20,
                      border: "1px solid var(--border-light)",
                      background: "var(--surface-gradient)",
                      padding: 20,
                      minHeight: 222,
                    }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)", color: "var(--accent-blue)", marginBottom: 14 }}>
                      <Icon size={18} />
                    </div>
                    <h3 style={{ margin: "0 0 10px", fontSize: "clamp(22px, 2.9vw, 31px)", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.62 }}>
                      {card.description}
                    </p>
                  </ThreeDTiltCard>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 48 : 70, scrollMarginTop: 100 }}>
        <PageContainer wide>
          <SectionTitle
            title="GitHub Pulse"
            subtitle="Live profile details, recent public activity, and contribution visibility."
          />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr", gap: 16, marginBottom: 18 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62 }}
            >
              <ThreeDTiltCard
                isMobile={isMobile}
                style={{
                  borderRadius: 22,
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  padding: 22,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 54, height: 54, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(15,23,42,0.14)", background: "rgba(37,99,235,0.08)" }}>
                      {githubState.profile?.avatar_url ? (
                        <img
                          src={githubState.profile.avatar_url}
                          alt={`${profileIdentity.name} GitHub avatar`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontWeight: 700, color: "var(--accent-blue)" }}>
                          JN
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 18, lineHeight: 1.25 }}>
                        {githubState.profile?.name || profileIdentity.name}
                      </p>
                      <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: 14 }}>
                        @{profileIdentity.githubUsername}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={profileIdentity.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    style={{ minHeight: 40, borderRadius: 999, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", border: "1px solid var(--border-light)", color: "var(--text-primary)", background: "var(--background-secondary)", fontSize: 14, fontWeight: 600 }}
                  >
                    <Github size={15} />
                    Open Profile
                  </Link>
                </div>

                <p style={{ marginTop: 0, marginBottom: 16, color: "var(--text-secondary)", lineHeight: 1.62 }}>
                  {githubState.profile?.bio ||
                    "Live data connected through GitHub API. Profile cards refresh when public activity changes."}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
                  <div style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--background-secondary)", padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Public Repositories</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{formatCount(githubState.profile?.public_repos)}</p>
                  </div>
                  <div style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--background-secondary)", padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Followers</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{formatCount(githubState.profile?.followers)}</p>
                  </div>
                  <div style={{ borderRadius: 14, border: "1px solid var(--border-light)", background: "var(--background-secondary)", padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent Public Commits</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{formatCount(githubState.metrics.pushCommits)}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14 }}>
                    <MapPin size={14} />
                    {githubState.profile?.location || profileIdentity.location}
                  </p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>
                    Last public activity: {formatActivityDate(githubState.metrics.lastActive)}
                  </p>
                </div>
              </ThreeDTiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.62, delay: 0.1 }}
              style={{ borderRadius: 22, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 22 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 14, color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Contributions
                </p>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>Last 12 Months</p>
              </div>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-light)", background: "#ffffff", marginBottom: 12 }}>
                <img
                  src={contributionChart}
                  alt={`${profileIdentity.githubUsername} contribution heatmap`}
                  loading="lazy"
                  style={{ width: "100%", display: "block", minHeight: isMobile ? 90 : 120, objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                <div style={{ borderRadius: 12, border: "1px solid var(--border-light)", padding: "10px 8px", textAlign: "center", background: "var(--background-secondary)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{githubState.metrics.pullRequests}</p>
                  <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>PRs Opened</p>
                </div>
                <div style={{ borderRadius: 12, border: "1px solid var(--border-light)", padding: "10px 8px", textAlign: "center", background: "var(--background-secondary)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{githubState.metrics.issues}</p>
                  <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>Issues Opened</p>
                </div>
                <div style={{ borderRadius: 12, border: "1px solid var(--border-light)", padding: "10px 8px", textAlign: "center", background: "var(--background-secondary)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{githubState.metrics.repositoryTouches}</p>
                  <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>Repos Touched</p>
                </div>
              </div>
            </motion.div>
          </div>

          {githubState.error ? <p style={{ margin: "8px 0 0", color: "var(--text-secondary)" }}>{githubState.error}</p> : null}

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {(githubState.loading ? [] : githubState.repositories.slice(0, 6)).map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.56, delay: index * 0.06 }}
                style={{ borderRadius: 18, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 16 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word" }}>{repo.name}</p>
                  <Link href={repo.html_url} target="_blank" rel="noreferrer" data-cursor="hover" style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--border-light)", display: "grid", placeItems: "center", color: "var(--text-primary)", textDecoration: "none", background: "var(--background-secondary)", flexShrink: 0 }}>
                    <ExternalLink size={14} />
                  </Link>
                </div>
                <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55, minHeight: 44 }}>
                  {repo.description || "Repository details will appear as projects are published."}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                    <Star size={13} />
                    {repo.stargazers_count}
                  </span>
                  {repo.language ? <span style={{ fontSize: 12, borderRadius: 999, border: "1px solid var(--border-light)", padding: "4px 10px", background: "var(--background-secondary)" }}>{repo.language}</span> : null}
                </div>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 44 : 66 }}>
        <PageContainer>
          <SectionTitle
            title="Certifications"
            subtitle="Credential roadmap and verification-friendly showcase cards."
          />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 14 }}>
            {certifications.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 24, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.26 }}
                transition={{ duration: 0.66, ease: "easeOut", delay: index * 0.08 }}
                style={{ perspective: "1000px" }}
              >
                <ThreeDTiltCard
                  isMobile={isMobile}
                  style={{ borderRadius: 18, border: "1px solid var(--border-light)", background: "var(--background-primary)", padding: 18, minHeight: 232 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 600, color: credential.accent, border: `1px solid ${credential.accent}44`, background: `${credential.accent}14` }}>
                      <Award size={13} />
                      {credential.status}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{credential.issued}</span>
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 2.4vw, 27px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                    {credential.title}
                  </h3>
                  <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", fontSize: 14 }}>{credential.issuer}</p>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {credential.credentialId}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
                    {credential.focus.map((topic) => (
                      <span key={topic} style={{ borderRadius: 999, border: "1px solid var(--border-light)", padding: "5px 10px", background: "var(--background-secondary)", fontSize: 12 }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                  <Link href={credential.verificationUrl} target="_blank" rel="noreferrer" data-cursor="hover" style={{ display: "inline-flex", alignItems: "center", gap: 7, textDecoration: "none", color: "var(--accent-blue)", fontSize: 14, fontWeight: 600 }}>
                    Verification Portal
                    <ExternalLink size={14} />
                  </Link>
                </ThreeDTiltCard>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 48 : 70 }}>
        <PageContainer>
          <SectionTitle
            title="Educational Journey"
            subtitle="From graduate coursework to applied engineering delivery."
          />
          <div
            style={{
              borderRadius: 22,
              border: "1px solid var(--border-light)",
              background: "var(--background-primary)",
              padding: isMobile ? 16 : 22,
            }}
          >
            {educationJourney.map((entry, index) => {
              const isLast = index === educationJourney.length - 1;

              return (
                <motion.div
                  key={`${entry.title}-${entry.period}`}
                  initial={{ opacity: 0, x: isMobile ? 0 : index % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.26 }}
                  transition={{ duration: 0.65, delay: index * 0.07 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "94px 26px 1fr" : "170px 34px 1fr",
                    columnGap: isMobile ? 8 : 14,
                    alignItems: "stretch",
                  }}
                >
                  <div style={{ paddingTop: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--accent-blue)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {entry.period}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <GraduationCap size={14} />
                      Stage
                    </p>
                  </div>

                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 8,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--accent-blue)",
                        border: "2px solid #ffffff",
                        boxShadow: "0 0 0 1px rgba(37,99,235,0.35)",
                      }}
                    />
                    {!isLast ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 24,
                          bottom: -10,
                          transform: "translateX(-50%)",
                          borderLeft: "2px dashed rgba(37,99,235,0.36)",
                        }}
                      />
                    ) : null}
                  </div>

                  <div
                    style={{
                      paddingBottom: isLast ? 0 : 16,
                      marginBottom: isLast ? 0 : 16,
                      borderBottom: isLast ? "none" : "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 4px",
                        fontSize: "clamp(22px, 2.9vw, 30px)",
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {entry.title}
                    </h3>
                    <p style={{ margin: "0 0 8px", color: "var(--text-secondary)", fontSize: 15 }}>
                      {entry.institution}
                    </p>
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "var(--text-secondary)",
                        fontSize: 14,
                        lineHeight: 1.62,
                      }}
                    >
                      {entry.detail}
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {entry.highlights.map((point) => (
                        <p
                          key={point}
                          style={{
                            margin: 0,
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            color: "var(--text-primary)",
                            fontSize: 14,
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              marginTop: 7,
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--accent-blue)",
                              flexShrink: 0,
                            }}
                          />
                          {point}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 48 : 74 }}>
        <PageContainer>
          <SectionTitle
            title="Resume Snapshot"
            subtitle="High-impact engineering work focused on measurable system outcomes."
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.72, ease: "easeOut" }}
          >
            <ThreeDTiltCard
              isMobile={isMobile}
              hoverScale={1.01}
              hoverLift={-8}
              style={{ borderRadius: 24, border: "1px solid rgba(37,99,235,0.28)", background: "var(--surface-highlight-gradient)", padding: isMobile ? 20 : 28 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.08fr 0.92fr", gap: 20, alignItems: "start" }}>
                <div>
                  <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 8, color: "var(--accent-blue)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                    <FileText size={14} />
                    Resume Highlights
                  </p>
                  <h3 style={{ margin: "10px 0 12px", fontSize: "clamp(30px, 4.4vw, 46px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                    Software Engineer
                    <br />
                    Intelligent Systems and Scalable Platforms
                  </h3>
                  <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", fontSize: "clamp(15px, 1.9vw, 18px)", lineHeight: 1.62 }}>
                    {profileIdentity.name} | {profileIdentity.location}
                  </p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {resumeHighlights.map((point) => (
                      <p key={point} style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, lineHeight: 1.55 }}>
                        <span style={{ marginTop: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--accent-blue)", flexShrink: 0 }} />
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
                <div style={{ borderRadius: 18, border: "1px solid var(--border-light)", background: "var(--surface-card)", padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>
                    Quick Access
                  </p>
                  <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
                    <Link href={profileIdentity.resumePath} data-cursor="hover" style={{ minHeight: 44, borderRadius: 12, padding: "10px 14px", display: "inline-flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", background: "var(--accent-blue)", color: "#ffffff", fontSize: 14, fontWeight: 600 }}>
                      View Full Resume
                      <ArrowRight size={15} />
                    </Link>
                    <Link href={`mailto:${profileIdentity.email}?subject=Resume%20Request`} data-cursor="hover" style={{ minHeight: 44, borderRadius: 12, padding: "10px 14px", display: "inline-flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", border: "1px solid var(--border-light)", background: "var(--background-secondary)", color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
                      Request PDF Resume
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </ThreeDTiltCard>
          </motion.div>
        </PageContainer>
      </section>

      <section style={{ paddingBlock: isMobile ? 54 : 74 }}>
        <PageContainer wide>
          <SectionTitle
            title="Featured Project Entry Points"
            subtitle="Architecture walkthrough cards with deep-dive prompts and implementation narratives."
          />
          {projects.slice(0, 2).map((project, index) => (
            <ProjectPromptCard
              key={project.slug}
              project={project}
              index={index}
              isMobile={isMobile}
            />
          ))}
          <div style={{ marginTop: 16 }}>
            <Link
              href="/projects"
              data-cursor="hover"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 46, borderRadius: 999, padding: "11px 20px", background: "var(--accent-blue)", color: "#ffffff", textDecoration: "none", fontWeight: 600 }}
            >
              View All Project Walkthroughs
              <ArrowRight size={16} />
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
