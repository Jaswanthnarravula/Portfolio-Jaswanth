"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Briefcase,
  FileText,
  Github,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MagneticButton from "../components/MagneticButton";
import { experienceSummary, workExperiences } from "../data/experience";
import {
  certifications,
  educationJourney,
  primaryTechStack,
  profileIdentity,
} from "../data/profile";

const ShowcaseScene3D = dynamic(
  () => import("../components/showcase/ShowcaseScene3D"),
  { ssr: false },
);
const DisplacementPortrait = dynamic(
  () => import("../components/showcase/DisplacementPortrait"),
  { ssr: false },
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MANIFESTO =
  "I build intelligent systems, distributed platforms, and product experiences where engineering rigor meets cinematic craft — resilient by design, measured by outcomes, made to ship.";

const IMPACT_STATEMENTS = [
  {
    title: "Forecast-aware orchestration",
    detail:
      "Designed intelligent scheduling workflows where predictions drive execution — policy-safe, observable, and production-shaped.",
  },
  {
    title: "Storage that survives failure",
    detail:
      "Distributed replication and recovery patterns engineered for node churn, partial failure, and fast, graceful degradation.",
  },
  {
    title: "Real-time, low-latency collaboration",
    detail:
      "Live multi-user engineering experiences with secure execution sandboxes and synchronization measured in milliseconds.",
  },
  {
    title: "Architecture translated into product",
    detail:
      "Complex system behavior turned into interfaces people can actually read, trust, and operate under pressure.",
  },
];

/** Splits text into per-word groups of masked characters for GSAP reveals. */
function SplitChars({ text }) {
  return text.split(" ").map((word, wordIndex) => (
    <span className="sc-word" key={`${word}-${wordIndex}`}>
      {word.split("").map((char, charIndex) => (
        <span className="sc-char-mask" key={charIndex}>
          <span className="sc-char">{char}</span>
        </span>
      ))}
      {wordIndex < text.split(" ").length - 1 ? " " : null}
    </span>
  ));
}

function Eyebrow({ index, label }) {
  return (
    <div className="sc-eyebrow">
      <span className="sc-eyebrow-index">{index}</span>
      <span className="sc-eyebrow-line" />
      <span className="sc-eyebrow-label">{label}</span>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth < 900);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return isMobile;
}

export default function ShowcasePage() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const isMobile = useIsMobile();

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = rootRef.current;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------------- Cinematic entrance ---------------- */
      if (reduceMotion) {
        gsap.set(".sc-intro", { display: "none" });
        gsap.set(".sc-manifesto-word", { opacity: 1 });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".sc-intro-label .sc-char", {
          yPercent: 130,
          stagger: 0.035,
          duration: 0.75,
        })
        .to(
          ".sc-intro-label",
          { autoAlpha: 0, y: -26, duration: 0.4, ease: "power2.in" },
          "+=0.55",
        )
        .to(".sc-intro-panel--front", {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
        })
        .to(
          ".sc-intro-panel--back",
          { yPercent: -100, duration: 0.95, ease: "power4.inOut" },
          "-=0.75",
        )
        .set(".sc-intro", { display: "none" })
        .from(
          ".sc-hero-title .sc-char",
          { yPercent: 130, stagger: 0.035, duration: 1.05 },
          "-=0.55",
        )
        .from(
          ".sc-hero-fade",
          { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 },
          "-=0.7",
        );

      gsap.utils.toArray(".sc-stat-value").forEach((el) => {
        intro.from(
          el,
          {
            innerText: 0,
            duration: 1.4,
            ease: "power2.out",
            snap: { innerText: 1 },
          },
          "-=1.2",
        );
      });

      /* ---------------- Shared scroll reveals ---------------- */
      gsap.utils.toArray(".sc-reveal-heading").forEach((heading) => {
        gsap.from(heading.querySelectorAll(".sc-char"), {
          yPercent: 120,
          stagger: 0.018,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: heading, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray(".sc-fade-up").forEach((el) => {
        gsap.from(el, {
          y: 44,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Numbered impact rows tip in with perspective, ghost numbers parallax.
      gsap.utils.toArray(".sc-impact-row").forEach((row) => {
        gsap.from(row, {
          rotateX: -16,
          y: 70,
          autoAlpha: 0,
          transformPerspective: 900,
          transformOrigin: "50% 0%",
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 84%", once: true },
        });
        const num = row.querySelector(".sc-impact-num");
        if (num) {
          gsap.fromTo(
            num,
            { yPercent: 24 },
            {
              yPercent: -24,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      // Oversized outlined ghost words drift on their own scroll rate.
      gsap.utils.toArray(".sc-ghost").forEach((ghost) => {
        gsap.fromTo(
          ghost,
          { yPercent: -16 },
          {
            yPercent: 16,
            ease: "none",
            scrollTrigger: {
              trigger: ghost.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      /* ---------------- Kinetic marquees + scroll velocity ---------------- */
      const marqueeLoops = gsap.utils
        .toArray(".sc-marquee-inner")
        .map((row, index) => {
          const reversed = index % 2 === 1;
          gsap.set(row, { xPercent: reversed ? -50 : 0 });
          return gsap.to(row, {
            xPercent: reversed ? 0 : -50,
            duration: 30 + index * 8,
            ease: "none",
            repeat: -1,
          });
        });

      let settle = null;
      const skewSetter = gsap.quickTo(".sc-marquee-stage", "skewY", {
        duration: 0.5,
        ease: "power3",
      });
      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const boost = gsap.utils.clamp(1, 4, Math.abs(velocity) / 350);
          marqueeLoops.forEach((loop) => loop.timeScale(boost));
          skewSetter(gsap.utils.clamp(-4, 4, velocity / -400));
          settle?.kill();
          settle = gsap.delayedCall(0.25, () => {
            marqueeLoops.forEach((loop) =>
              gsap.to(loop, { timeScale: 1, duration: 1, ease: "power2.out" }),
            );
            skewSetter(0);
          });
        },
      });

      /* ---------------- Breakpoint-specific choreography ---------------- */
      mm.add("(min-width: 900px)", () => {
        // Hero exits with a cinematic scale/fade as the scene scrolls away.
        gsap.to(".sc-hero-inner", {
          yPercent: -14,
          scale: 0.96,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-hero",
            start: "top top",
            end: "bottom 35%",
            scrub: true,
          },
        });
        gsap.to(".sc-hero-ghost", {
          yPercent: 46,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Pinned manifesto — words illuminate one by one while the section holds.
        gsap.to(".sc-manifesto-word", {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-manifesto",
            start: "top top",
            end: "+=150%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Pinned horizontal experience rail.
        const track = trackRef.current;
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-exp",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(".sc-exp-card").forEach((card) => {
          gsap.from(card, {
            rotateY: 9,
            scale: 0.94,
            autoAlpha: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 95%",
              end: "left 55%",
              scrub: true,
            },
          });
        });
        gsap.to(".sc-exp-progress-bar", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-exp",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });

        // Portrait parallax drift.
        gsap.to(".sc-portrait-frame", {
          yPercent: -9,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-portrait",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Mouse parallax on the hero ghost word.
        const ghostX = gsap.quickTo(".sc-hero-ghost", "x", {
          duration: 1.1,
          ease: "power3",
        });
        const heroY = gsap.quickTo(".sc-hero-copy", "y", {
          duration: 0.9,
          ease: "power3",
        });
        const onPointerMove = (event) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          ghostX(nx * -46);
          heroY(ny * -14);
        };
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });

        // Physics-flavored micro interactions: magnetic skill pills…
        const pillCleanups = gsap.utils
          .toArray(".sc-pill")
          .map((pill) => {
            const xTo = gsap.quickTo(pill, "x", {
              duration: 0.35,
              ease: "power3",
            });
            const yTo = gsap.quickTo(pill, "y", {
              duration: 0.35,
              ease: "power3",
            });
            const move = (event) => {
              const rect = pill.getBoundingClientRect();
              xTo((event.clientX - rect.left - rect.width / 2) * 0.34);
              yTo((event.clientY - rect.top - rect.height / 2) * 0.34);
            };
            const leave = () => {
              gsap.to(pill, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: "elastic.out(1, 0.32)",
                overwrite: true,
              });
            };
            pill.addEventListener("mousemove", move);
            pill.addEventListener("mouseleave", leave);
            return () => {
              pill.removeEventListener("mousemove", move);
              pill.removeEventListener("mouseleave", leave);
            };
          });

        // …and spring-tilt glass cards.
        const tiltCleanups = gsap.utils
          .toArray(".sc-tilt")
          .map((card) => {
            gsap.set(card, { transformPerspective: 950 });
            const rxTo = gsap.quickTo(card, "rotationX", {
              duration: 0.6,
              ease: "power3",
            });
            const ryTo = gsap.quickTo(card, "rotationY", {
              duration: 0.6,
              ease: "power3",
            });
            const move = (event) => {
              const rect = card.getBoundingClientRect();
              const px = (event.clientX - rect.left) / rect.width - 0.5;
              const py = (event.clientY - rect.top) / rect.height - 0.5;
              rxTo(-py * 7);
              ryTo(px * 9);
            };
            const leave = () => {
              rxTo(0);
              ryTo(0);
            };
            card.addEventListener("mousemove", move);
            card.addEventListener("mouseleave", leave);
            return () => {
              card.removeEventListener("mousemove", move);
              card.removeEventListener("mouseleave", leave);
            };
          });

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          pillCleanups.forEach((cleanup) => cleanup());
          tiltCleanups.forEach((cleanup) => cleanup());
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.to(".sc-manifesto-word", {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: ".sc-manifesto-text",
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.4,
          },
        });
        gsap.utils
          .toArray(".sc-exp-card, .sc-exp-lead")
          .forEach((el) => {
            gsap.from(el, {
              y: 44,
              autoAlpha: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div className="sc-root" ref={rootRef}>
      <style>{SHOWCASE_CSS}</style>

      {/* -------- Cinematic entrance curtain -------- */}
      <div className="sc-intro" aria-hidden>
        <div className="sc-intro-panel sc-intro-panel--back" />
        <div className="sc-intro-panel sc-intro-panel--front" />
        <p className="sc-intro-label">
          <SplitChars text="JASWANTH — SHOWCASE 2026" />
        </p>
      </div>

      {/* -------- Hero: WebGL scene + kinetic typography -------- */}
      <section className="sc-hero">
        <ShowcaseScene3D isMobile={isMobile} />
        <span className="sc-hero-ghost" aria-hidden>
          FOLIO
        </span>
        <div className="sc-container sc-hero-inner">
          <div className="sc-hero-copy">
            <div className="sc-hero-badge sc-hero-fade">
              <span className="sc-pulse" />
              Open to Software Engineering roles — 2026
            </div>
            <h1
              className="sc-hero-title"
              aria-label={`${profileIdentity.name} — Software Engineer`}
            >
              <span className="sc-hero-line">
                <SplitChars text="JASWANTH" />
              </span>
              <span className="sc-hero-line sc-hero-line--ghost">
                <SplitChars text="NARRAVULA" />
              </span>
            </h1>
            <p className="sc-hero-sub sc-hero-fade">
              {profileIdentity.headline}
            </p>
            <div className="sc-hero-cta sc-hero-fade">
              <MagneticButton>
                <Link
                  href={`mailto:${profileIdentity.email}`}
                  data-cursor="hover"
                  className="sc-btn sc-btn--primary"
                >
                  <Mail size={17} />
                  Start a conversation
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/resume"
                  data-cursor="hover"
                  className="sc-btn sc-btn--glass"
                >
                  <FileText size={17} />
                  View resume
                </Link>
              </MagneticButton>
              <span className="sc-hero-loc">
                <MapPin size={14} />
                {profileIdentity.location}
              </span>
            </div>
            <div className="sc-hero-stats sc-hero-fade">
              {experienceSummary.map((stat) => (
                <div className="sc-glass sc-stat" key={stat.label}>
                  <p className="sc-stat-number" style={{ color: stat.accent }}>
                    <span
                      className="sc-stat-value"
                      data-value={Number.parseInt(stat.value, 10) || 0}
                    >
                      {Number.parseInt(stat.value, 10) || 0}
                    </span>
                    +
                  </p>
                  <p className="sc-stat-label">{stat.label}</p>
                  <p className="sc-stat-detail">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sc-scroll-cue sc-hero-fade" aria-hidden>
          <span>Scroll</span>
          <ArrowDown size={15} />
        </div>
      </section>

      {/* -------- 01 · Pinned manifesto -------- */}
      <section className="sc-manifesto">
        <div className="sc-container">
          <Eyebrow index="01" label="Manifesto" />
          <p className="sc-manifesto-text">
            {MANIFESTO.split(" ").map((word, index) => (
              <span className="sc-manifesto-word" key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* -------- 02 · Portrait with GLSL displacement hover -------- */}
      <section className="sc-section sc-portrait">
        <span className="sc-ghost" aria-hidden>
          PROFILE
        </span>
        <div className="sc-container sc-portrait-grid">
          <div className="sc-portrait-frame sc-fade-up">
            <DisplacementPortrait src="/profile/portrait.jpg" />
            <div className="sc-portrait-edge" aria-hidden />
          </div>
          <div className="sc-portrait-copy">
            <Eyebrow index="02" label="Profile" />
            <h2 className="sc-heading sc-reveal-heading">
              <SplitChars text="Engineer of systems that hold." />
            </h2>
            <p className="sc-body sc-fade-up">
              MS in Computer Science at UAB. I move between machine
              intelligence, distributed backends, and interface craft — and I
              care as much about how a system fails as how it demos. Hover the
              portrait: even this page treats pixels as a physics problem.
            </p>
            <div className="sc-portrait-meta sc-fade-up">
              <span className="sc-meta-chip">Birmingham, AL</span>
              <span className="sc-meta-chip">MS CS · UAB</span>
              <span className="sc-meta-chip">Systems + ML + Product</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------- 03 · Impact rows with perspective -------- */}
      <section className="sc-section">
        <div className="sc-container">
          <Eyebrow index="03" label="Signature Impact" />
          <h2 className="sc-heading sc-reveal-heading">
            <SplitChars text="Work that leaves a mark." />
          </h2>
          <div className="sc-impact-list">
            {IMPACT_STATEMENTS.map((impact, index) => (
              <div className="sc-impact-row" key={impact.title}>
                <span className="sc-impact-num" aria-hidden>
                  0{index + 1}
                </span>
                <div>
                  <h3 className="sc-impact-title">{impact.title}</h3>
                  <p className="sc-impact-detail">{impact.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------- 04 · Horizontal pinned experience rail -------- */}
      <section className="sc-exp">
        <div className="sc-exp-track" ref={trackRef}>
          <div className="sc-exp-lead">
            <Eyebrow index="04" label="Experience" />
            <h2 className="sc-heading sc-reveal-heading">
              <SplitChars text="Where the work happened." />
            </h2>
            <p className="sc-body">
              Three engineering streams, one standard: production-shaped
              systems with measurable outcomes. Keep scrolling — the rail moves
              sideways.
            </p>
          </div>
          {workExperiences.map((job, index) => (
            <article className="sc-glass sc-exp-card" key={job.role}>
              <span className="sc-exp-index" aria-hidden>
                0{index + 1}
              </span>
              <p className="sc-card-kicker">
                <Briefcase size={13} />
                {job.domain}
              </p>
              <h3 className="sc-card-title">{job.role}</h3>
              <p className="sc-card-meta">
                {job.organization} · {job.location} · {job.period}
              </p>
              <p className="sc-card-summary">{job.summary}</p>
              <div className="sc-card-highlights">
                {job.highlights.map((highlight) => (
                  <p key={highlight}>
                    <ArrowUpRight size={14} />
                    {highlight}
                  </p>
                ))}
              </div>
              <div className="sc-card-stack">
                {job.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="sc-exp-progress" aria-hidden>
          <div className="sc-exp-progress-bar" />
        </div>
      </section>

      {/* -------- 05 · Kinetic skill marquees + magnetic pills -------- */}
      <section className="sc-section sc-skills">
        <div className="sc-container">
          <Eyebrow index="05" label="Arsenal" />
          <h2 className="sc-heading sc-reveal-heading">
            <SplitChars text="Tools I ship with." />
          </h2>
        </div>
        <div className="sc-marquee-stage">
          <div className="sc-marquee" aria-hidden>
            <div className="sc-marquee-inner">
              {[...primaryTechStack, ...primaryTechStack].map(
                (skill, index) => (
                  <span className="sc-marquee-item" key={`a-${index}`}>
                    {skill} <em>✦</em>
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="sc-marquee" aria-hidden>
            <div className="sc-marquee-inner">
              {[...primaryTechStack, ...primaryTechStack]
                .reverse()
                .map((skill, index) => (
                  <span
                    className="sc-marquee-item sc-marquee-item--ghost"
                    key={`b-${index}`}
                  >
                    {skill} <em>✦</em>
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="sc-container sc-fade-up">
          <div className="sc-pills">
            {primaryTechStack.map((skill) => (
              <span className="sc-pill" data-cursor="hover" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------- 06 · Education & credentials -------- */}
      <section className="sc-section sc-foundation">
        <span className="sc-ghost" aria-hidden>
          ROOTS
        </span>
        <div className="sc-container">
          <Eyebrow index="06" label="Foundation" />
          <h2 className="sc-heading sc-reveal-heading">
            <SplitChars text="Always leveling up." />
          </h2>
          <div className="sc-foundation-grid">
            <div className="sc-glass sc-tilt sc-edu-card sc-fade-up">
              <p className="sc-card-kicker">
                <GraduationCap size={14} />
                Education
              </p>
              {educationJourney.map((entry) => (
                <div
                  className="sc-edu-entry"
                  key={`${entry.title}-${entry.period}`}
                >
                  <p className="sc-edu-period">{entry.period}</p>
                  <p className="sc-edu-title">{entry.title}</p>
                  <p className="sc-edu-inst">{entry.institution}</p>
                  <p className="sc-edu-detail">{entry.detail}</p>
                </div>
              ))}
            </div>
            <div className="sc-glass sc-tilt sc-edu-card sc-fade-up">
              <p className="sc-card-kicker">
                <Award size={14} />
                Certifications
              </p>
              {certifications.map((credential) => (
                <div className="sc-edu-entry" key={credential.title}>
                  <div className="sc-cert-head">
                    <p className="sc-edu-title">{credential.title}</p>
                    <span
                      className="sc-cert-status"
                      style={{
                        color: credential.accent,
                        background: `${credential.accent}18`,
                        borderColor: `${credential.accent}44`,
                      }}
                    >
                      {credential.status}
                    </span>
                  </div>
                  <p className="sc-edu-inst">
                    {credential.issuer} · {credential.issued}
                  </p>
                  <div className="sc-cert-focus">
                    {credential.focus.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------- 07 · Contact -------- */}
      <section className="sc-section sc-cta">
        <div className="sc-container">
          <Eyebrow index="07" label="Contact" />
          <h2 className="sc-cta-title sc-reveal-heading">
            <SplitChars text="Let's build" />
            <br />
            <span className="sc-cta-ghostline">
              <SplitChars text="what's next." />
            </span>
          </h2>
          <div className="sc-cta-actions sc-fade-up">
            <MagneticButton>
              <Link
                href={`mailto:${profileIdentity.email}`}
                data-cursor="hover"
                className="sc-btn sc-btn--primary sc-btn--lg"
              >
                <Mail size={18} />
                {profileIdentity.email}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href={profileIdentity.githubUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="sc-btn sc-btn--glass sc-btn--lg"
              >
                <Github size={18} />
                GitHub
              </Link>
            </MagneticButton>
          </div>
          <p className="sc-cta-footnote sc-fade-up">
            Built with React Three Fiber · custom GLSL · GSAP ScrollTrigger ·
            Lenis
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page-scoped styles (sc- prefix keeps this fully isolated)           */
/* ------------------------------------------------------------------ */

const SHOWCASE_CSS = `
.sc-root {
  position: relative;
  overflow-x: clip;
}
.sc-container {
  width: min(1240px, 100% - 48px);
  margin-inline: auto;
  position: relative;
  z-index: 1;
}
.sc-section {
  position: relative;
  padding-block: clamp(80px, 13vh, 150px);
}

/* --- split text plumbing --- */
.sc-word { display: inline-block; white-space: nowrap; }
.sc-char-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.sc-char { display: inline-block; will-change: transform; }

/* --- intro curtain --- */
.sc-intro { position: fixed; inset: 0; z-index: 2000; }
.sc-intro-panel { position: absolute; inset: 0; }
.sc-intro-panel--back { background: linear-gradient(135deg, #2563eb 0%, #7c5cf6 100%); }
.sc-intro-panel--front { background: #05060d; }
.sc-intro-label {
  position: absolute; inset: 0; margin: 0;
  display: flex; align-items: center; justify-content: center;
  color: #f8fafc; font-weight: 600;
  font-size: clamp(13px, 1.8vw, 18px);
  letter-spacing: 0.34em; text-transform: uppercase;
  text-align: center; padding-inline: 20px;
}

/* --- eyebrow --- */
.sc-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.sc-eyebrow-index, .sc-eyebrow-label {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 13px; font-weight: 600; letter-spacing: 0.22em;
}
.sc-eyebrow-index { color: var(--accent-blue); }
.sc-eyebrow-label { color: var(--text-secondary); text-transform: uppercase; }
.sc-eyebrow-line { width: 52px; height: 1px; background: var(--accent-blue); }

/* --- glass --- */
.sc-glass {
  border-radius: 22px;
  border: 1px solid var(--border-light);
  background: var(--surface-card);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
}

/* --- buttons --- */
.sc-btn {
  min-height: 50px; border-radius: 999px; padding: 13px 26px;
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer;
}
.sc-btn--primary {
  background: var(--accent-blue); color: #ffffff;
  box-shadow: 0 14px 34px rgba(37, 99, 235, 0.32);
}
.sc-btn--glass {
  border: 1px solid var(--border-light); background: var(--surface-pill);
  backdrop-filter: blur(12px); color: var(--text-primary);
}
.sc-btn--lg { min-height: 56px; padding: 16px 30px; font-size: 16px; }

/* --- hero --- */
.sc-hero {
  position: relative;
  min-height: calc(100svh - 110px);
  display: flex; align-items: center;
}
.sc-hero-inner { padding-block: 46px; }
.sc-hero-copy { position: relative; }
.sc-hero-ghost {
  position: absolute; top: -3%; right: -4%; z-index: 0;
  font-size: clamp(120px, 25vw, 360px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.5px var(--marquee-stroke);
  user-select: none; pointer-events: none; white-space: nowrap;
}
.sc-hero-badge {
  display: inline-flex; align-items: center; gap: 9px;
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); backdrop-filter: blur(12px);
  padding: 8px 16px; margin-bottom: 28px;
  font-size: 12.5px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text-secondary);
}
.sc-pulse {
  width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.75);
  animation: sc-pulse 2.1s ease-in-out infinite;
}
@keyframes sc-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.55; }
}
.sc-hero-title {
  margin: 0 0 26px;
  font-size: clamp(52px, 10.5vw, 140px);
  font-weight: 800; letter-spacing: -0.045em; line-height: 0.96;
}
.sc-hero-line { display: block; }
.sc-hero-line--ghost .sc-char {
  color: transparent; -webkit-text-stroke: 1.6px var(--marquee-stroke);
}
.sc-hero-sub {
  margin: 0 0 32px; max-width: 620px;
  color: var(--text-secondary);
  font-size: clamp(15px, 2vw, 19px); line-height: 1.65;
}
.sc-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 46px; }
.sc-hero-loc { display: inline-flex; align-items: center; gap: 7px; color: var(--text-secondary); font-size: 14px; }
.sc-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 780px; }
.sc-stat { padding: 16px 18px; }
.sc-stat-number { margin: 0; font-size: clamp(30px, 4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.sc-stat-label { margin: 5px 0 0; font-size: 13.5px; font-weight: 600; }
.sc-stat-detail { margin: 3px 0 0; font-size: 12.5px; color: var(--text-secondary); }
.sc-scroll-cue {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--text-secondary); font-size: 11px;
  letter-spacing: 0.3em; text-transform: uppercase;
}
.sc-scroll-cue svg { animation: sc-bob 1.6s ease-in-out infinite; }
@keyframes sc-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

/* --- manifesto --- */
.sc-manifesto { min-height: 100svh; display: flex; align-items: center; }
.sc-manifesto-text {
  margin: 0; max-width: 1100px;
  font-size: clamp(27px, 4.6vw, 62px);
  font-weight: 700; letter-spacing: -0.03em; line-height: 1.2;
}
.sc-manifesto-word { display: inline-block; margin-right: 0.28em; opacity: 0.13; }

/* --- headings / body --- */
.sc-heading {
  margin: 0 0 30px;
  font-size: clamp(30px, 5.4vw, 58px);
  font-weight: 800; letter-spacing: -0.035em; line-height: 1.05;
}
.sc-body { margin: 0; max-width: 560px; color: var(--text-secondary); font-size: clamp(14.5px, 1.9vw, 17px); line-height: 1.7; }

/* --- ghost words --- */
.sc-ghost {
  position: absolute; top: 6%; left: -2%; z-index: 0;
  font-size: clamp(90px, 18vw, 260px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.3px var(--marquee-stroke);
  opacity: 0.6; user-select: none; pointer-events: none; white-space: nowrap;
}

/* --- portrait --- */
.sc-portrait-grid {
  display: grid; grid-template-columns: 1fr 1.15fr;
  gap: clamp(28px, 5vw, 72px); align-items: center;
}
.sc-portrait-frame {
  position: relative; aspect-ratio: 4 / 5; border-radius: 26px;
  overflow: hidden; box-shadow: 0 30px 80px rgba(2, 6, 23, 0.22);
}
.sc-portrait-edge {
  position: absolute; inset: 0; border-radius: 26px;
  border: 1px solid var(--surface-outline); pointer-events: none;
}
.sc-portrait-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.sc-meta-chip {
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); backdrop-filter: blur(10px);
  padding: 7px 14px; font-size: 12.5px; font-weight: 600;
  color: var(--text-secondary);
}
.sc-portrait-copy .sc-body { margin-bottom: 0; }

/* --- impact --- */
.sc-impact-list { margin-top: 40px; border-bottom: 1px solid var(--border-light); perspective: 1000px; }
.sc-impact-row {
  display: grid; grid-template-columns: 130px 1fr; gap: 34px;
  align-items: center; border-top: 1px solid var(--border-light);
  padding-block: clamp(28px, 4vh, 44px);
  transform-style: preserve-3d;
}
.sc-impact-num {
  font-size: clamp(44px, 7vw, 92px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.3px var(--marquee-stroke);
  user-select: none;
}
.sc-impact-title { margin: 0 0 8px; font-size: clamp(19px, 2.6vw, 27px); font-weight: 700; letter-spacing: -0.02em; }
.sc-impact-detail { margin: 0; color: var(--text-secondary); font-size: clamp(14px, 1.8vw, 16.5px); line-height: 1.6; max-width: 720px; }

/* --- experience rail --- */
.sc-exp { position: relative; }
.sc-exp-lead { flex-shrink: 0; }
.sc-exp-card { position: relative; padding: clamp(22px, 3vw, 32px); }
.sc-exp-index {
  position: absolute; top: 14px; right: 22px;
  font-size: clamp(40px, 5vw, 64px); font-weight: 800; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.2px var(--marquee-stroke);
  user-select: none;
}
.sc-card-kicker {
  margin: 0 0 14px; display: inline-flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent-blue);
}
.sc-card-title { margin: 0; font-size: clamp(21px, 3vw, 28px); font-weight: 700; letter-spacing: -0.02em; }
.sc-card-meta { margin: 6px 0 14px; color: var(--text-secondary); font-size: 14px; }
.sc-card-summary { margin: 0 0 16px; color: var(--text-secondary); font-size: 14.5px; line-height: 1.6; }
.sc-card-highlights { display: grid; gap: 9px; margin-bottom: 18px; }
.sc-card-highlights p { margin: 0; display: flex; gap: 9px; align-items: flex-start; font-size: 14px; line-height: 1.55; }
.sc-card-highlights svg { color: var(--accent-blue); flex-shrink: 0; margin-top: 3px; }
.sc-card-stack { display: flex; flex-wrap: wrap; gap: 7px; }
.sc-card-stack span {
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); padding: 5px 12px;
  font-size: 12.5px; font-weight: 600; color: var(--text-secondary);
}
.sc-exp-progress {
  position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%);
  width: min(320px, 44vw); height: 2px; border-radius: 2px;
  background: var(--border-light); overflow: hidden; display: none;
}
.sc-exp-progress-bar {
  height: 100%; width: 100%; transform: scaleX(0); transform-origin: left center;
  background: linear-gradient(90deg, var(--accent-blue), #7c5cf6);
}
@media (min-width: 900px) {
  .sc-exp { height: 100svh; overflow: hidden; }
  .sc-exp-track {
    display: flex; align-items: center; height: 100%; width: max-content;
    gap: clamp(22px, 3vw, 46px);
    padding-inline: max(24px, calc(50vw - 620px));
    will-change: transform;
  }
  .sc-exp-lead { width: min(480px, 40vw); }
  .sc-exp-card { width: min(560px, 44vw); flex-shrink: 0; }
  .sc-exp-progress { display: block; }
}
@media (max-width: 899px) {
  .sc-exp { padding-block: 80px 40px; }
  .sc-exp-track {
    display: flex; flex-direction: column; gap: 22px;
    width: min(1240px, 100% - 48px); margin-inline: auto;
  }
}

/* --- skills --- */
.sc-marquee-stage { margin-block: 30px 44px; will-change: transform; }
.sc-marquee { overflow: hidden; padding-block: 8px; }
.sc-marquee-inner { display: flex; gap: 40px; width: max-content; align-items: baseline; }
.sc-marquee-item {
  font-size: clamp(34px, 6vw, 80px); font-weight: 800;
  letter-spacing: -0.03em; white-space: nowrap; line-height: 1.15;
}
.sc-marquee-item em { font-style: normal; color: var(--accent-blue); font-size: 0.5em; vertical-align: middle; }
.sc-marquee-item--ghost { color: transparent; -webkit-text-stroke: 1.4px var(--marquee-stroke); }
.sc-marquee-item--ghost em { -webkit-text-stroke: 0; }
.sc-pills { display: flex; flex-wrap: wrap; gap: 12px; }
.sc-pill {
  display: inline-block; border-radius: 999px;
  border: 1px solid var(--border-light); background: var(--surface-card);
  backdrop-filter: blur(12px); padding: 12px 22px;
  font-weight: 600; font-size: clamp(14px, 1.8vw, 17px);
  letter-spacing: -0.01em; will-change: transform;
}

/* --- foundation --- */
.sc-foundation-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 20px; align-items: start; margin-top: 36px; }
.sc-edu-card { padding: clamp(22px, 3vw, 30px); transform-style: preserve-3d; }
.sc-edu-entry { padding-left: 16px; border-left: 2px solid var(--border-light); margin-bottom: 22px; }
.sc-edu-entry:last-child { margin-bottom: 0; }
.sc-edu-period { margin: 0 0 4px; font-size: 12.5px; font-weight: 700; color: var(--accent-blue); letter-spacing: 0.06em; }
.sc-edu-title { margin: 0 0 4px; font-weight: 700; font-size: 16.5px; }
.sc-edu-inst { margin: 0 0 6px; color: var(--text-secondary); font-size: 13.5px; }
.sc-edu-detail { margin: 0; color: var(--text-secondary); font-size: 13.5px; line-height: 1.55; }
.sc-cert-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 4px; }
.sc-cert-status {
  border-radius: 999px; border: 1px solid; padding: 4px 10px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; white-space: nowrap;
}
.sc-cert-focus { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.sc-cert-focus span {
  border-radius: 999px; border: 1px solid var(--border-light);
  padding: 3px 10px; font-size: 11.5px; font-weight: 600;
  color: var(--text-secondary);
}

/* --- CTA --- */
.sc-cta { text-align: center; }
.sc-cta .sc-eyebrow { justify-content: center; }
.sc-cta-title {
  margin: 0 0 40px;
  font-size: clamp(46px, 9.5vw, 140px);
  font-weight: 800; letter-spacing: -0.045em; line-height: 0.98;
}
.sc-cta-ghostline .sc-char { color: transparent; -webkit-text-stroke: 1.6px var(--marquee-stroke); }
.sc-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.sc-cta-footnote {
  margin: 44px 0 0; color: var(--text-secondary);
  font-size: 12.5px; letter-spacing: 0.14em; text-transform: uppercase;
}

@media (max-width: 899px) {
  .sc-hero-stats { grid-template-columns: 1fr; }
  .sc-portrait-grid { grid-template-columns: 1fr; }
  .sc-foundation-grid { grid-template-columns: 1fr; }
  .sc-impact-row { grid-template-columns: 70px 1fr; gap: 18px; }
  .sc-hero-ghost { top: 0; right: -12%; }
  .sc-scroll-cue { display: none; }
  .sc-manifesto { min-height: 0; padding-block: 90px; }
}
`;
