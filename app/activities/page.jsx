"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Camera,
  ChefHat,
  Code2,
  Compass,
  Dumbbell,
  Github,
  Mail,
  MoveHorizontal,
  Quote,
  Sparkles,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MagneticButton from "../components/MagneticButton";
import {
  activitiesHeroStats,
  activityChapters,
  fieldNotes,
  nowBoard,
  playbookCards,
  pursuitCards,
  rhythmWords,
  seasonTimeline,
  voicesQuotes,
} from "../data/activities";
import { profileIdentity } from "../data/profile";

const ActivitiesScene3D = dynamic(
  () => import("../components/activities/ActivitiesScene3D"),
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

const pursuitIconMap = {
  camera: Camera,
  dumbbell: Dumbbell,
  compass: Compass,
  chef: ChefHat,
};

/** Splits text into per-word groups of masked characters for GSAP reveals. */
function SplitChars({ text }) {
  return text.split(" ").map((word, wordIndex) => (
    <span className="ac-word" key={`${word}-${wordIndex}`}>
      {word.split("").map((char, charIndex) => (
        <span className="ac-char-mask" key={charIndex}>
          <span className="ac-char">{char}</span>
        </span>
      ))}
      {wordIndex < text.split(" ").length - 1 ? " " : null}
    </span>
  ));
}

function Eyebrow({ index, label }) {
  return (
    <div className="ac-eyebrow">
      <span className="ac-eyebrow-index">{index}</span>
      <span className="ac-eyebrow-line" />
      <span className="ac-eyebrow-label">{label}</span>
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

const nowIconMap = {
  code: Code2,
  book: BookOpen,
  activity: Activity,
};

const seasonEase = [0.22, 1, 0.36, 1];

/**
 * Scroll-linked vertical timeline: a spring-smoothed progress spine draws
 * itself as the section scrolls, entries slide in from alternating sides.
 */
function SeasonTimeline() {
  const listRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 60%"],
  });
  const spine = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <div className="ac-season-list" ref={listRef}>
      <span className="ac-season-rail" aria-hidden />
      <motion.span
        className="ac-season-spine"
        style={{ scaleY: shouldReduceMotion ? 1 : spine }}
        aria-hidden
      />
      {seasonTimeline.map((entry, index) => (
        <motion.article
          className={`ac-season-entry ${
            index % 2 === 1 ? "ac-season-entry--flip" : ""
          }`}
          key={entry.period}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, x: index % 2 === 1 ? 54 : -54 }
          }
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.75, ease: seasonEase }}
        >
          <span className="ac-season-dot" aria-hidden />
          <div className="ac-glass ac-season-card">
            <div className="ac-season-head">
              <p className="ac-season-period">{entry.period}</p>
              <span className="ac-season-tag">{entry.tag}</span>
            </div>
            <h3 className="ac-season-title">{entry.title}</h3>
            <p className="ac-season-detail">{entry.detail}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/**
 * Physics-based drag deck: the track is thrown with inertia (framer-motion
 * drag momentum) inside measured constraints; cards spring on hover.
 */
function PlaybookDeck() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [dragLimit, setDragLimit] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setDragLimit(Math.max(0, track.scrollWidth - viewport.offsetWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="ac-deck-viewport" ref={viewportRef}>
      <motion.div
        className="ac-deck-track"
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: -dragLimit, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ power: 0.3, timeConstant: 240 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {playbookCards.map((card, index) => (
          <motion.article
            className="ac-glass ac-deck-card"
            key={card.title}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              ease: seasonEase,
              delay: (index % 3) * 0.08,
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -10, rotate: index % 2 === 1 ? 1.4 : -1.4 }
            }
          >
            <span className="ac-deck-num" aria-hidden>
              0{index + 1}
            </span>
            <h3 className="ac-deck-title">{card.title}</h3>
            <p className="ac-deck-detail">{card.detail}</p>
          </motion.article>
        ))}
      </motion.div>
      <p className="ac-deck-hint" aria-hidden>
        <MoveHorizontal size={15} />
        Drag — it has momentum
      </p>
    </div>
  );
}

/** Auto-rotating quotes with blur-through crossfades and a layout-animated dot. */
function VoicesCarousel() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % voicesQuotes.length),
      5600,
    );
    return () => window.clearInterval(id);
  }, []);

  const voice = voicesQuotes[index];

  return (
    <div className="ac-voices-stage">
      <span className="ac-voices-mark" aria-hidden>
        <Quote size={26} />
      </span>
      <div className="ac-voices-window">
        <AnimatePresence mode="wait">
          <motion.blockquote
            className="ac-voices-quote"
            key={index}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 30, filter: "blur(7px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -24, filter: "blur(7px)" }
            }
            transition={{ duration: 0.55, ease: seasonEase }}
          >
            <p>&ldquo;{voice.quote}&rdquo;</p>
            <footer>
              {voice.name} · <span>{voice.role}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="ac-voices-dots" role="tablist" aria-label="Quotes">
        {voicesQuotes.map((entry, dotIndex) => (
          <button
            type="button"
            key={entry.name + entry.role}
            className="ac-voices-dot"
            data-cursor="hover"
            aria-label={`Quote ${dotIndex + 1}`}
            aria-selected={dotIndex === index}
            role="tab"
            onClick={() => setIndex(dotIndex)}
          >
            {dotIndex === index ? (
              <motion.span
                className="ac-voices-dot-fill"
                layoutId="ac-voice-dot"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

/** "Now" board: three live columns with staggered spring entrances. */
function NowBoard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="ac-now-grid"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {nowBoard.map((column) => {
        const Icon = nowIconMap[column.icon] ?? Sparkles;
        return (
          <motion.article
            className="ac-glass ac-now-card"
            key={column.label}
            variants={{
              hidden: { opacity: 0, y: 44, scale: 0.97 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 130, damping: 18 },
              },
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="ac-now-head">
              <span className="ac-now-icon">
                <Icon size={18} />
              </span>
              <h3 className="ac-now-label">{column.label}</h3>
              <span className="ac-now-live" aria-hidden />
            </div>
            <ul className="ac-now-items">
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

export default function ActivitiesPage() {
  const rootRef = useRef(null);
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
        gsap.set(".ac-intro", { display: "none" });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(".ac-intro-label .ac-char", {
          yPercent: 130,
          stagger: 0.035,
          duration: 0.75,
        })
        .to(
          ".ac-intro-label",
          { autoAlpha: 0, y: -26, duration: 0.4, ease: "power2.in" },
          "+=0.55",
        )
        .to(".ac-intro-panel--front", {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
        })
        .to(
          ".ac-intro-panel--back",
          { yPercent: -100, duration: 0.95, ease: "power4.inOut" },
          "-=0.75",
        )
        .set(".ac-intro", { display: "none" })
        .from(
          ".ac-hero-title .ac-char",
          { yPercent: 130, stagger: 0.035, duration: 1.05 },
          "-=0.55",
        )
        .from(
          ".ac-hero-fade",
          { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 },
          "-=0.7",
        );

      gsap.utils.toArray(".ac-stat-value").forEach((el) => {
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
      gsap.utils.toArray(".ac-reveal-heading").forEach((heading) => {
        gsap.from(heading.querySelectorAll(".ac-char"), {
          yPercent: 120,
          stagger: 0.018,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: heading, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray(".ac-fade-up").forEach((el) => {
        gsap.from(el, {
          y: 44,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Field-note rows tip in with perspective; ghost numbers parallax.
      gsap.utils.toArray(".ac-note-row").forEach((row) => {
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
        const num = row.querySelector(".ac-note-num");
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
      gsap.utils.toArray(".ac-ghost").forEach((ghost) => {
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

      /* ---------------- Kinetic marquee + scroll velocity ---------------- */
      const marqueeLoops = gsap.utils
        .toArray(".ac-marquee-inner")
        .map((row, index) => {
          const reversed = index % 2 === 1;
          gsap.set(row, { xPercent: reversed ? -50 : 0 });
          return gsap.to(row, {
            xPercent: reversed ? 0 : -50,
            duration: 28 + index * 8,
            ease: "none",
            repeat: -1,
          });
        });

      let settle = null;
      const skewSetter = gsap.quickTo(".ac-marquee-stage", "skewY", {
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
        // Hero exits with a cinematic scale/fade as the orbit scrolls away.
        gsap.to(".ac-hero-inner", {
          yPercent: -14,
          scale: 0.96,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".ac-hero",
            start: "top top",
            end: "bottom 35%",
            scrub: true,
          },
        });
        gsap.to(".ac-hero-ghost", {
          yPercent: 46,
          ease: "none",
          scrollTrigger: {
            trigger: ".ac-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Sticky chapter deck: each card settles, then scales back and dims
        // as the next chapter slides over it — a cinematic stack.
        const panels = gsap.utils.toArray(".ac-chapter-panel");
        panels.forEach((panel, index) => {
          const card = panel.querySelector(".ac-chapter-card");
          const next = panels[index + 1];
          if (!card || !next) return;
          gsap.to(card, {
            scale: 0.9,
            yPercent: -5,
            autoAlpha: 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });

        // Chapter art drifts on its own rate inside the card.
        gsap.utils.toArray(".ac-chapter-art").forEach((art) => {
          gsap.fromTo(
            art,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: art.closest(".ac-chapter-panel"),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Mouse parallax on the hero ghost word and copy.
        const ghostX = gsap.quickTo(".ac-hero-ghost", "x", {
          duration: 1.1,
          ease: "power3",
        });
        const heroY = gsap.quickTo(".ac-hero-copy", "y", {
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

        // Physics-flavored micro interactions: magnetic chips…
        const chipCleanups = gsap.utils
          .toArray(".ac-chip")
          .map((chip) => {
            const xTo = gsap.quickTo(chip, "x", {
              duration: 0.35,
              ease: "power3",
            });
            const yTo = gsap.quickTo(chip, "y", {
              duration: 0.35,
              ease: "power3",
            });
            const move = (event) => {
              const rect = chip.getBoundingClientRect();
              xTo((event.clientX - rect.left - rect.width / 2) * 0.34);
              yTo((event.clientY - rect.top - rect.height / 2) * 0.34);
            };
            const leave = () => {
              gsap.to(chip, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: "elastic.out(1, 0.32)",
                overwrite: true,
              });
            };
            chip.addEventListener("mousemove", move);
            chip.addEventListener("mouseleave", leave);
            return () => {
              chip.removeEventListener("mousemove", move);
              chip.removeEventListener("mouseleave", leave);
            };
          });

        // …and spring-tilt glass cards.
        const tiltCleanups = gsap.utils
          .toArray(".ac-tilt")
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
          chipCleanups.forEach((cleanup) => cleanup());
          tiltCleanups.forEach((cleanup) => cleanup());
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.utils.toArray(".ac-chapter-card").forEach((card) => {
          gsap.from(card, {
            y: 44,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
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
    <div className="ac-root" ref={rootRef}>
      <style>{ACTIVITIES_CSS}</style>

      {/* -------- Cinematic entrance curtain -------- */}
      <div className="ac-intro" aria-hidden>
        <div className="ac-intro-panel ac-intro-panel--back" />
        <div className="ac-intro-panel ac-intro-panel--front" />
        <p className="ac-intro-label">
          <SplitChars text="JASWANTH — ACTIVITIES" />
        </p>
      </div>

      {/* -------- Hero: orbital WebGL scene + kinetic typography -------- */}
      <section className="ac-hero">
        <ActivitiesScene3D isMobile={isMobile} />
        <span className="ac-hero-ghost" aria-hidden>
          ARENA
        </span>
        <div className="ac-container ac-hero-inner">
          <div className="ac-hero-copy">
            <div className="ac-hero-badge ac-hero-fade">
              <Sparkles size={13} />
              The work behind the work
            </div>
            <h1 className="ac-hero-title" aria-label="Beyond the desk">
              <span className="ac-hero-line">
                <SplitChars text="BEYOND" />
              </span>
              <span className="ac-hero-line ac-hero-line--ghost">
                <SplitChars text="THE DESK" />
              </span>
            </h1>
            <p className="ac-hero-sub ac-hero-fade">
              Hackathons, open source, mentorship, and the pursuits that keep
              the engineering sharp. Systems thinking doesn&apos;t clock out at
              the last commit — these are its other arenas.
            </p>
            <div className="ac-hero-cta ac-hero-fade">
              <MagneticButton>
                <a href="#arenas" data-cursor="hover" className="ac-btn ac-btn--primary">
                  <ArrowDown size={17} />
                  Enter the arenas
                </a>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href={`mailto:${profileIdentity.email}`}
                  data-cursor="hover"
                  className="ac-btn ac-btn--glass"
                >
                  <Mail size={17} />
                  Say hello
                </Link>
              </MagneticButton>
            </div>
            <div className="ac-hero-stats ac-hero-fade">
              {activitiesHeroStats.map((stat) => (
                <div className="ac-glass ac-stat" key={stat.label}>
                  <p className="ac-stat-number" style={{ color: stat.accent }}>
                    <span
                      className="ac-stat-value"
                      data-value={Number.parseInt(stat.value, 10) || 0}
                    >
                      {Number.parseInt(stat.value, 10) || 0}
                    </span>
                    {stat.suffix}
                  </p>
                  <p className="ac-stat-label">{stat.label}</p>
                  <p className="ac-stat-detail">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ac-scroll-cue ac-hero-fade" aria-hidden>
          <span>Scroll</span>
          <ArrowDown size={15} />
        </div>
      </section>

      {/* -------- 01 · Sticky chapter deck with displacement art -------- */}
      <section className="ac-chapters" id="arenas">
        <div className="ac-container ac-chapters-head">
          <Eyebrow index="01" label="The Arenas" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="Four places the craft gets tested." />
          </h2>
        </div>
        {activityChapters.map((chapter) => (
          <div className="ac-chapter-panel" key={chapter.id}>
            <article
              className="ac-glass ac-chapter-card"
              style={{ "--chapter-accent": chapter.accent }}
            >
              <div className="ac-chapter-copy">
                <p className="ac-chapter-kicker">{chapter.kicker}</p>
                <h3 className="ac-chapter-title ac-reveal-heading">
                  <SplitChars text={chapter.title} />
                </h3>
                <p className="ac-chapter-tagline">{chapter.tagline}</p>
                <p className="ac-chapter-desc">{chapter.description}</p>
                <div className="ac-chapter-points">
                  {chapter.points.map((point) => (
                    <p key={point}>
                      <ArrowUpRight size={14} />
                      {point}
                    </p>
                  ))}
                </div>
                <div className="ac-chapter-tags">
                  {chapter.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="ac-chapter-art">
                {isMobile ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={chapter.art} alt="" loading="lazy" />
                ) : (
                  <DisplacementPortrait src={chapter.art} />
                )}
                <div className="ac-chapter-art-edge" aria-hidden />
              </div>
            </article>
          </div>
        ))}
      </section>

      {/* -------- 02 · Field notes with perspective rows -------- */}
      <section className="ac-section ac-notes">
        <span className="ac-ghost" aria-hidden>
          NOTES
        </span>
        <div className="ac-container">
          <Eyebrow index="02" label="Field Notes" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="Moments that stuck." />
          </h2>
          <div className="ac-note-list">
            {fieldNotes.map((note, index) => (
              <div className="ac-note-row" key={note.title}>
                <span className="ac-note-num" aria-hidden>
                  0{index + 1}
                </span>
                <div>
                  <h3 className="ac-note-title">{note.title}</h3>
                  <p className="ac-note-detail">{note.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------- 03 · Velocity-reactive rhythm marquee -------- */}
      <section className="ac-section ac-rhythm">
        <div className="ac-container">
          <Eyebrow index="03" label="The Rhythm" />
        </div>
        <div className="ac-marquee-stage">
          <div className="ac-marquee" aria-hidden>
            <div className="ac-marquee-inner">
              {[...rhythmWords, ...rhythmWords, ...rhythmWords].map(
                (word, index) => (
                  <span className="ac-marquee-item" key={`a-${index}`}>
                    {word} <em>✦</em>
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="ac-marquee" aria-hidden>
            <div className="ac-marquee-inner">
              {[...rhythmWords, ...rhythmWords, ...rhythmWords]
                .reverse()
                .map((word, index) => (
                  <span
                    className="ac-marquee-item ac-marquee-item--ghost"
                    key={`b-${index}`}
                  >
                    {word} <em>✦</em>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------- 04 · Season timeline (framer-motion scroll spine) -------- */}
      <section className="ac-section ac-season">
        <span className="ac-ghost" aria-hidden>
          SEASONS
        </span>
        <div className="ac-container">
          <Eyebrow index="04" label="The Long Game" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="Season by season." />
          </h2>
          <SeasonTimeline />
        </div>
      </section>

      {/* -------- 05 · Playbook: physics drag deck -------- */}
      <section className="ac-section ac-playbook">
        <div className="ac-container">
          <Eyebrow index="05" label="The Playbook" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="Rules I show up with." />
          </h2>
        </div>
        <div className="ac-container ac-playbook-stage">
          <PlaybookDeck />
        </div>
      </section>

      {/* -------- 06 · Off-screen pursuits: tilt glass cards -------- */}
      <section className="ac-section ac-pursuits">
        <span className="ac-ghost" aria-hidden>
          PLAY
        </span>
        <div className="ac-container">
          <Eyebrow index="06" label="Off Screen" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="What recharges the engineer." />
          </h2>
          <div className="ac-pursuit-grid">
            {pursuitCards.map((pursuit) => {
              const Icon = pursuitIconMap[pursuit.icon] ?? Sparkles;
              return (
                <article
                  className="ac-glass ac-tilt ac-pursuit-card ac-fade-up"
                  key={pursuit.title}
                >
                  <span className="ac-pursuit-icon">
                    <Icon size={20} />
                  </span>
                  <h3 className="ac-pursuit-title">{pursuit.title}</h3>
                  <p className="ac-pursuit-detail">{pursuit.detail}</p>
                  <div className="ac-pursuit-chips">
                    {pursuit.chips.map((chip) => (
                      <span className="ac-chip" data-cursor="hover" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------- 07 · Voices: rotating quotes -------- */}
      <section className="ac-section ac-voices">
        <div className="ac-container">
          <Eyebrow index="07" label="Voices" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="What the rooms say." />
          </h2>
          <VoicesCarousel />
        </div>
      </section>

      {/* -------- 08 · Now: what's currently in motion -------- */}
      <section className="ac-section ac-now">
        <span className="ac-ghost" aria-hidden>
          NOW
        </span>
        <div className="ac-container">
          <Eyebrow index="08" label="This Season" />
          <h2 className="ac-heading ac-reveal-heading">
            <SplitChars text="In motion right now." />
          </h2>
          <NowBoard />
        </div>
      </section>

      {/* -------- 09 · CTA -------- */}
      <section className="ac-section ac-cta">
        <div className="ac-container">
          <Eyebrow index="09" label="Join In" />
          <h2 className="ac-cta-title ac-reveal-heading">
            <SplitChars text="Build something" />
            <br />
            <span className="ac-cta-ghostline">
              <SplitChars text="off the clock." />
            </span>
          </h2>
          <p className="ac-cta-sub ac-fade-up">
            Planning a hackathon team, starting a study group, or looking for a
            code-review partner? That&apos;s exactly the kind of email I answer
            first.
          </p>
          <div className="ac-cta-actions ac-fade-up">
            <MagneticButton>
              <Link
                href={`mailto:${profileIdentity.email}`}
                data-cursor="hover"
                className="ac-btn ac-btn--primary ac-btn--lg"
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
                className="ac-btn ac-btn--glass ac-btn--lg"
              >
                <Github size={18} />
                GitHub
              </Link>
            </MagneticButton>
          </div>
          <p className="ac-cta-footnote ac-fade-up">
            Built with React Three Fiber · custom GLSL · GSAP ScrollTrigger ·
            Lenis
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page-scoped styles (ac- prefix keeps this fully isolated)           */
/* ------------------------------------------------------------------ */

const ACTIVITIES_CSS = `
.ac-root {
  position: relative;
  overflow-x: clip;
}
.ac-container {
  width: min(1240px, 100% - 48px);
  margin-inline: auto;
  position: relative;
  z-index: 1;
}
.ac-section {
  position: relative;
  padding-block: clamp(80px, 13vh, 150px);
}

/* --- split text plumbing --- */
.ac-word { display: inline-block; white-space: nowrap; }
.ac-char-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.ac-char { display: inline-block; will-change: transform; }

/* --- intro curtain --- */
.ac-intro { position: fixed; inset: 0; z-index: 2000; }
.ac-intro-panel { position: absolute; inset: 0; }
.ac-intro-panel--back { background: linear-gradient(135deg, #7c5cf6 0%, #ec4899 100%); }
.ac-intro-panel--front { background: #0a0612; }
.ac-intro-label {
  position: absolute; inset: 0; margin: 0;
  display: flex; align-items: center; justify-content: center;
  color: #f8fafc; font-weight: 600;
  font-size: clamp(13px, 1.8vw, 18px);
  letter-spacing: 0.34em; text-transform: uppercase;
  text-align: center; padding-inline: 20px;
}

/* --- eyebrow --- */
.ac-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.ac-eyebrow-index, .ac-eyebrow-label {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 13px; font-weight: 600; letter-spacing: 0.22em;
}
.ac-eyebrow-index { color: #7c5cf6; }
.ac-eyebrow-label { color: var(--text-secondary); text-transform: uppercase; }
.ac-eyebrow-line { width: 52px; height: 1px; background: #7c5cf6; }

/* --- glass --- */
.ac-glass {
  border-radius: 22px;
  border: 1px solid var(--border-light);
  background: var(--surface-card);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
}

/* --- buttons --- */
.ac-btn {
  min-height: 50px; border-radius: 999px; padding: 13px 26px;
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer;
}
.ac-btn--primary {
  background: linear-gradient(120deg, #7c5cf6, #ec4899);
  color: #ffffff;
  box-shadow: 0 14px 34px rgba(124, 92, 246, 0.34);
}
.ac-btn--glass {
  border: 1px solid var(--border-light); background: var(--surface-pill);
  backdrop-filter: blur(12px); color: var(--text-primary);
}
.ac-btn--lg { min-height: 56px; padding: 16px 30px; font-size: 16px; }

/* --- hero --- */
.ac-hero {
  position: relative;
  min-height: calc(100svh - 110px);
  display: flex; align-items: center;
}
.ac-hero-inner { padding-block: 46px; }
.ac-hero-copy { position: relative; }
.ac-hero-ghost {
  position: absolute; top: -2%; right: -5%; z-index: 0;
  font-size: clamp(120px, 26vw, 380px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.5px var(--marquee-stroke);
  user-select: none; pointer-events: none; white-space: nowrap;
}
.ac-hero-badge {
  display: inline-flex; align-items: center; gap: 9px;
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); backdrop-filter: blur(12px);
  padding: 8px 16px; margin-bottom: 28px;
  font-size: 12.5px; font-weight: 600; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text-secondary);
}
.ac-hero-badge svg { color: #ec4899; }
.ac-hero-title {
  margin: 0 0 26px;
  font-size: clamp(52px, 10.5vw, 140px);
  font-weight: 800; letter-spacing: -0.045em; line-height: 0.96;
}
.ac-hero-line { display: block; }
.ac-hero-line--ghost .ac-char {
  color: transparent; -webkit-text-stroke: 1.6px var(--marquee-stroke);
}
.ac-hero-sub {
  margin: 0 0 32px; max-width: 620px;
  color: var(--text-secondary);
  font-size: clamp(15px, 2vw, 19px); line-height: 1.65;
}
.ac-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 46px; }
.ac-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 780px; }
.ac-stat { padding: 16px 18px; }
.ac-stat-number { margin: 0; font-size: clamp(30px, 4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.ac-stat-label { margin: 5px 0 0; font-size: 13.5px; font-weight: 600; }
.ac-stat-detail { margin: 3px 0 0; font-size: 12.5px; color: var(--text-secondary); }
.ac-scroll-cue {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--text-secondary); font-size: 11px;
  letter-spacing: 0.3em; text-transform: uppercase;
}
.ac-scroll-cue svg { animation: ac-bob 1.6s ease-in-out infinite; }
@keyframes ac-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

/* --- headings / ghost words --- */
.ac-heading {
  margin: 0 0 30px;
  font-size: clamp(30px, 5.4vw, 58px);
  font-weight: 800; letter-spacing: -0.035em; line-height: 1.05;
}
.ac-ghost {
  position: absolute; top: 6%; left: -2%; z-index: 0;
  font-size: clamp(90px, 18vw, 260px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.3px var(--marquee-stroke);
  opacity: 0.6; user-select: none; pointer-events: none; white-space: nowrap;
}

/* --- chapter deck --- */
.ac-chapters { position: relative; }
.ac-chapters-head { padding-block: clamp(60px, 10vh, 120px) 10px; }
.ac-chapter-panel {
  min-height: 100svh;
  display: flex; align-items: center;
  position: sticky; top: 0;
}
.ac-chapter-card {
  width: min(1240px, 100% - 48px);
  margin-inline: auto;
  display: grid; grid-template-columns: 1.15fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  padding: clamp(24px, 4vw, 52px);
  border-radius: 30px;
  box-shadow: 0 30px 80px rgba(4, 6, 20, 0.16);
  will-change: transform;
  border-top: 3px solid var(--chapter-accent, #7c5cf6);
}
.ac-chapter-kicker {
  margin: 0 0 14px;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 12.5px; font-weight: 700; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--chapter-accent, #7c5cf6);
}
.ac-chapter-title {
  margin: 0 0 8px;
  font-size: clamp(26px, 4.2vw, 46px);
  font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;
}
.ac-chapter-tagline {
  margin: 0 0 18px; font-size: clamp(15px, 2vw, 18px);
  font-weight: 600; color: var(--chapter-accent, #7c5cf6);
}
.ac-chapter-desc {
  margin: 0 0 20px; color: var(--text-secondary);
  font-size: clamp(14.5px, 1.9vw, 16.5px); line-height: 1.7; max-width: 560px;
}
.ac-chapter-points { display: grid; gap: 10px; margin-bottom: 22px; }
.ac-chapter-points p { margin: 0; display: flex; gap: 9px; align-items: flex-start; font-size: 14.5px; line-height: 1.55; }
.ac-chapter-points svg { color: var(--chapter-accent, #7c5cf6); flex-shrink: 0; margin-top: 3px; }
.ac-chapter-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-chapter-tags span {
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); padding: 6px 14px;
  font-size: 12.5px; font-weight: 600; color: var(--text-secondary);
}
.ac-chapter-art {
  position: relative; border-radius: 22px; overflow: hidden;
  aspect-ratio: 4 / 5; align-self: center;
  box-shadow: 0 24px 60px rgba(4, 6, 20, 0.28);
  will-change: transform;
}
.ac-chapter-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ac-chapter-art-edge {
  position: absolute; inset: 0; border-radius: 22px;
  border: 1px solid var(--surface-outline); pointer-events: none;
}

/* --- field notes --- */
.ac-note-list { margin-top: 40px; border-bottom: 1px solid var(--border-light); perspective: 1000px; }
.ac-note-row {
  display: grid; grid-template-columns: 130px 1fr; gap: 34px;
  align-items: center; border-top: 1px solid var(--border-light);
  padding-block: clamp(28px, 4vh, 44px);
  transform-style: preserve-3d;
}
.ac-note-num {
  font-size: clamp(44px, 7vw, 92px); font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.3px var(--marquee-stroke);
  user-select: none;
}
.ac-note-title { margin: 0 0 8px; font-size: clamp(19px, 2.6vw, 27px); font-weight: 700; letter-spacing: -0.02em; }
.ac-note-detail { margin: 0; color: var(--text-secondary); font-size: clamp(14px, 1.8vw, 16.5px); line-height: 1.6; max-width: 720px; }

/* --- rhythm marquee --- */
.ac-rhythm { padding-block: clamp(50px, 8vh, 90px); }
.ac-marquee-stage { margin-top: 26px; will-change: transform; }
.ac-marquee { overflow: hidden; padding-block: 8px; }
.ac-marquee-inner { display: flex; gap: 40px; width: max-content; align-items: baseline; }
.ac-marquee-item {
  font-size: clamp(40px, 7vw, 96px); font-weight: 800;
  letter-spacing: -0.03em; white-space: nowrap; line-height: 1.12;
}
.ac-marquee-item em { font-style: normal; color: #ec4899; font-size: 0.5em; vertical-align: middle; }
.ac-marquee-item--ghost { color: transparent; -webkit-text-stroke: 1.4px var(--marquee-stroke); }
.ac-marquee-item--ghost em { -webkit-text-stroke: 0; }

/* --- pursuits --- */
.ac-pursuit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 36px; }
.ac-pursuit-card { padding: clamp(22px, 3vw, 32px); transform-style: preserve-3d; }
.ac-pursuit-icon {
  width: 46px; height: 46px; border-radius: 14px;
  display: grid; place-items: center; margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(124, 92, 246, 0.16), rgba(236, 72, 153, 0.16));
  border: 1px solid var(--border-light); color: #7c5cf6;
}
.ac-pursuit-title { margin: 0 0 10px; font-size: clamp(19px, 2.4vw, 24px); font-weight: 700; letter-spacing: -0.02em; }
.ac-pursuit-detail { margin: 0 0 18px; color: var(--text-secondary); font-size: 14.5px; line-height: 1.65; }
.ac-pursuit-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-chip {
  display: inline-block; border-radius: 999px;
  border: 1px solid var(--border-light); background: var(--surface-pill);
  backdrop-filter: blur(10px); padding: 7px 15px;
  font-weight: 600; font-size: 12.5px; color: var(--text-secondary);
  will-change: transform;
}

/* --- season timeline --- */
.ac-season-list { position: relative; margin-top: 46px; padding-block: 10px; }
.ac-season-rail, .ac-season-spine {
  position: absolute; top: 0; bottom: 0; left: 50%;
  width: 2px; transform: translateX(-50%);
  border-radius: 2px;
}
.ac-season-rail { background: var(--border-light); }
.ac-season-spine {
  background: linear-gradient(180deg, #7c5cf6, #ec4899);
  transform-origin: top center;
}
.ac-season-entry {
  position: relative;
  width: calc(50% - 44px);
  margin-bottom: 34px;
}
.ac-season-entry--flip { margin-left: auto; }
.ac-season-entry:last-child { margin-bottom: 0; }
.ac-season-dot {
  position: absolute; top: 26px;
  width: 13px; height: 13px; border-radius: 50%;
  background: var(--background-primary);
  border: 3px solid #7c5cf6;
  box-shadow: 0 0 0 5px color-mix(in srgb, #7c5cf6 16%, transparent);
}
.ac-season-entry:not(.ac-season-entry--flip) .ac-season-dot { right: -51px; }
.ac-season-entry--flip .ac-season-dot { left: -51px; }
.ac-season-card { padding: clamp(18px, 2.4vw, 26px); }
.ac-season-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.ac-season-period {
  margin: 0;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 13px; font-weight: 700; letter-spacing: 0.18em;
  color: #7c5cf6;
}
.ac-season-tag {
  border-radius: 999px; border: 1px solid var(--border-light);
  background: var(--surface-pill); padding: 4px 11px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-secondary); white-space: nowrap;
}
.ac-season-title { margin: 0 0 8px; font-size: clamp(17px, 2.2vw, 21px); font-weight: 700; letter-spacing: -0.02em; }
.ac-season-detail { margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }

/* --- playbook drag deck --- */
.ac-playbook-stage { margin-top: 10px; }
.ac-deck-viewport { overflow: hidden; padding-block: 16px 6px; cursor: grab; }
.ac-deck-track { display: flex; gap: 18px; width: max-content; will-change: transform; }
.ac-deck-card {
  width: min(340px, 78vw); flex-shrink: 0;
  padding: clamp(22px, 2.6vw, 30px);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(4, 6, 20, 0.1);
  user-select: none;
}
.ac-deck-num {
  display: block; margin-bottom: 16px;
  font-size: clamp(34px, 4vw, 46px); font-weight: 800; line-height: 1;
  color: transparent; -webkit-text-stroke: 1.2px var(--marquee-stroke);
}
.ac-deck-title { margin: 0 0 10px; font-size: clamp(18px, 2.2vw, 22px); font-weight: 700; letter-spacing: -0.02em; }
.ac-deck-detail { margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.6; }
.ac-deck-hint {
  margin: 18px 0 0; display: flex; align-items: center; gap: 8px;
  color: var(--text-secondary); font-size: 12px;
  letter-spacing: 0.18em; text-transform: uppercase;
}

/* --- voices --- */
.ac-voices-stage { position: relative; max-width: 860px; margin-top: 26px; }
.ac-voices-mark {
  display: inline-grid; place-items: center;
  width: 52px; height: 52px; border-radius: 16px;
  background: linear-gradient(135deg, rgba(124, 92, 246, 0.16), rgba(236, 72, 153, 0.16));
  border: 1px solid var(--border-light); color: #ec4899;
  margin-bottom: 22px;
}
.ac-voices-window { min-height: 190px; }
.ac-voices-quote { margin: 0; }
.ac-voices-quote p {
  margin: 0 0 18px;
  font-size: clamp(20px, 3.2vw, 32px);
  font-weight: 600; letter-spacing: -0.02em; line-height: 1.35;
}
.ac-voices-quote footer { color: var(--text-secondary); font-size: 14px; font-weight: 600; }
.ac-voices-quote footer span { font-weight: 500; }
.ac-voices-dots { display: flex; gap: 10px; margin-top: 26px; }
.ac-voices-dot {
  position: relative; width: 34px; height: 6px; border-radius: 999px;
  border: none; padding: 0; cursor: pointer;
  background: var(--border-light);
}
.ac-voices-dot-fill {
  position: absolute; inset: 0; border-radius: 999px;
  background: linear-gradient(90deg, #7c5cf6, #ec4899);
}

/* --- now board --- */
.ac-now-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 36px; }
.ac-now-card { padding: clamp(20px, 2.6vw, 28px); }
.ac-now-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.ac-now-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: grid; place-items: center;
  background: linear-gradient(135deg, rgba(124, 92, 246, 0.16), rgba(37, 99, 235, 0.16));
  border: 1px solid var(--border-light); color: #7c5cf6;
}
.ac-now-label { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; flex: 1; }
.ac-now-live {
  width: 9px; height: 9px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.75);
  animation: ac-live 2.1s ease-in-out infinite;
}
@keyframes ac-live {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.45); opacity: 0.55; }
}
.ac-now-items { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.ac-now-items li {
  position: relative; padding-left: 18px;
  color: var(--text-secondary); font-size: 14px; line-height: 1.55;
}
.ac-now-items li::before {
  content: ""; position: absolute; left: 0; top: 8px;
  width: 7px; height: 7px; border-radius: 50%;
  background: linear-gradient(135deg, #7c5cf6, #ec4899);
}

/* --- CTA --- */
.ac-cta { text-align: center; }
.ac-cta .ac-eyebrow { justify-content: center; }
.ac-cta-title {
  margin: 0 0 24px;
  font-size: clamp(46px, 9.5vw, 140px);
  font-weight: 800; letter-spacing: -0.045em; line-height: 0.98;
}
.ac-cta-ghostline .ac-char { color: transparent; -webkit-text-stroke: 1.6px var(--marquee-stroke); }
.ac-cta-sub {
  margin: 0 auto 40px; max-width: 560px;
  color: var(--text-secondary); font-size: clamp(14.5px, 1.9vw, 17px); line-height: 1.7;
}
.ac-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.ac-cta-footnote {
  margin: 44px 0 0; color: var(--text-secondary);
  font-size: 12.5px; letter-spacing: 0.14em; text-transform: uppercase;
}

@media (max-width: 899px) {
  .ac-hero-stats { grid-template-columns: 1fr; }
  .ac-hero-ghost { top: 0; right: -14%; }
  .ac-scroll-cue { display: none; }
  .ac-chapter-panel { min-height: 0; position: static; padding-block: 14px; }
  .ac-chapter-card { grid-template-columns: 1fr; }
  .ac-chapter-art { aspect-ratio: 16 / 10; order: -1; }
  .ac-note-row { grid-template-columns: 70px 1fr; gap: 18px; }
  .ac-pursuit-grid { grid-template-columns: 1fr; }
  .ac-season-rail, .ac-season-spine { left: 7px; transform: none; }
  .ac-season-entry, .ac-season-entry--flip {
    width: auto; margin-left: 34px; margin-right: 0;
  }
  .ac-season-entry:not(.ac-season-entry--flip) .ac-season-dot,
  .ac-season-entry--flip .ac-season-dot { left: -33px; right: auto; }
  .ac-voices-window { min-height: 240px; }
  .ac-now-grid { grid-template-columns: 1fr; }
}
`;
