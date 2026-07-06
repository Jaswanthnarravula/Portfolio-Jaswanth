"use client";

import { useEffect, useRef } from "react";

const PALETTE = [
  { r: 59, g: 130, b: 246 }, // blue
  { r: 20, g: 184, b: 166 }, // teal
  { r: 167, g: 139, b: 250 }, // violet
];

/**
 * True-3D ambient particle field rendered on a fixed canvas behind the page.
 * Particles live in a perspective frustum: scroll moves the camera vertically
 * and the mouse pans it laterally, so every depth layer parallaxes at its own
 * rate. Nearby particles link with hairline constellation edges.
 */
export default function ParticleField({ isMobile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles = [];
    let frameId;

    const FOCAL = 420;
    const DEPTH = 900;

    const state = {
      mouseX: 0,
      mouseY: 0,
      camX: 0,
      camY: 0,
      scroll: window.scrollY,
      smoothScroll: window.scrollY,
      dark: document.documentElement.dataset.theme === "dark",
    };

    const spawn = () => {
      const count = Math.round(
        Math.min(120, (width * height) / (isMobile ? 26000 : 16000)),
      );
      particles = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * width * 1.6,
        y: (Math.random() - 0.5) * height * 1.8,
        z: Math.random() * DEPTH,
        drift: 0.08 + Math.random() * 0.22,
        wobble: Math.random() * Math.PI * 2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 0.9 + Math.random() * 1.9,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const project = (particle, time) => {
      // Depth-dependent parallax: near particles react to camera movement far
      // more than deep ones — this is what sells the 3D.
      const depthScale = FOCAL / (FOCAL + particle.z);
      const wobbleX = Math.sin(time * 0.00045 + particle.wobble) * 14;
      const px =
        width / 2 +
        (particle.x + wobbleX - state.camX * (1 - particle.z / DEPTH) * 90) *
          depthScale;
      const py =
        height / 2 +
        (particle.y -
          state.camY * (1 - particle.z / DEPTH) * 60 -
          state.smoothScroll * 0.22 * (1 - particle.z / DEPTH)) *
          depthScale;
      return { px, py, depthScale };
    };

    const render = (time) => {
      state.camX += (state.mouseX - state.camX) * 0.035;
      state.camY += (state.mouseY - state.camY) * 0.035;
      state.smoothScroll += (state.scroll - state.smoothScroll) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const baseAlpha = state.dark ? 0.75 : 0.5;
      const points = [];

      for (const particle of particles) {
        const { px, py, depthScale } = project(particle, time);

        // Wrap vertically so the field is endless while scrolling.
        const wrappedY = ((py % (height * 1.4)) + height * 1.4) % (height * 1.4) - height * 0.2;

        if (px < -40 || px > width + 40) {
          continue;
        }

        const alpha = baseAlpha * (0.25 + depthScale * 0.75);
        const radius = particle.size * depthScale * (state.dark ? 1.5 : 1.25);
        const { r, g, b } = particle.color;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.arc(px, wrappedY, radius, 0, Math.PI * 2);
        ctx.fill();

        if (depthScale > 0.62) {
          points.push({ px, py: wrappedY, depthScale, color: particle.color });
        }
      }

      // Constellation edges between close, near-camera particles only.
      const LINK = isMobile ? 90 : 130;
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = points[i].px - points[j].px;
          const dy = points[i].py - points[j].py;
          const distance = Math.hypot(dx, dy);
          if (distance < LINK) {
            const alpha =
              (1 - distance / LINK) * (state.dark ? 0.16 : 0.1) *
              Math.min(points[i].depthScale, points[j].depthScale);
            const { r, g, b } = points[i].color;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(points[i].px, points[i].py);
            ctx.lineTo(points[j].px, points[j].py);
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        for (const particle of particles) {
          particle.z -= particle.drift;
          if (particle.z < 0) {
            particle.z = DEPTH;
            particle.x = (Math.random() - 0.5) * width * 1.6;
            particle.y = (Math.random() - 0.5) * height * 1.8;
          }
        }
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handleMouse = (event) => {
      state.mouseX = (event.clientX / width - 0.5) * 2;
      state.mouseY = (event.clientY / height - 0.5) * 2;
    };
    const handleScroll = () => {
      state.scroll = window.scrollY;
    };

    const themeObserver = new MutationObserver(() => {
      state.dark = document.documentElement.dataset.theme === "dark";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
      themeObserver.disconnect();
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
