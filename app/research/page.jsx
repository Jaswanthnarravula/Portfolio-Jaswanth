"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import MagneticButton from "../components/MagneticButton";

/* ------------------------------------------------------------------ */
/* An editorial, cinema-grade motion lab. Dark canvas, oversized type, */
/* a WebGL nebula of glowing dust that disperses on scroll to reveal   */
/* the work beneath — volumetric glow, depth blur, camera drift,       */
/* spring physics, liquid morphs, a pinned depth tunnel, film grain.   */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1];
const SERIF = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";
const MONO =
  "'SF Mono', ui-monospace, 'Cascadia Mono', 'Roboto Mono', Consolas, monospace";
const INK = "#eceae4";
const FAINT = "rgba(236,234,228,0.62)";
const DIM = "#8a8a86";
const LINE = "rgba(236,234,228,0.14)";

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const experiments = [
  {
    id: "exp-001",
    index: "001",
    lead: "SPATIAL",
    tail: "interfaces",
    year: "2026",
    description:
      "Interfaces that borrow physical depth — glass panels hold their position in space while content glides between planes.",
    tags: ["Perspective", "Z-Layers", "Parallax"],
    accent: "#60a5fa",
    metric: { value: 120, suffix: "fps", label: "Sustained frame rate", decimals: 0 },
  },
  {
    id: "exp-002",
    index: "002",
    lead: "MOTION",
    tail: "grammar",
    year: "2026",
    description:
      "A vocabulary of springs and easings where every state change explains itself — nothing snaps, everything settles.",
    tags: ["Spring Physics", "Choreography", "Stagger"],
    accent: "#2dd4bf",
    metric: { value: 0.16, suffix: "s", label: "Signature spring settle", decimals: 2 },
  },
  {
    id: "exp-003",
    index: "003",
    lead: "LIQUID",
    tail: "light",
    year: "2025",
    description:
      "Volumetric glow that trails the cursor like liquid — soft radial passes blended in screen space over the canvas.",
    tags: ["Volumetrics", "Blend Modes", "Cursor"],
    accent: "#c084fc",
    metric: { value: 3, suffix: "×", label: "Layered glow passes", decimals: 0 },
  },
  {
    id: "exp-004",
    index: "004",
    lead: "FLUID",
    tail: "typography",
    year: "2025",
    description:
      "Type that behaves like material — masked line reveals, tracking morphs, and scroll-bound scale on oversized glyphs.",
    tags: ["Masked Reveals", "Kinetic Type", "Editorial"],
    accent: "#fbbf24",
    metric: { value: 60, suffix: "+", label: "Type states prototyped", decimals: 0 },
  },
];

const findings = [
  {
    num: "F.01",
    title: "Reveal Masks",
    year: "2026",
    caption: "Content should arrive, not appear.",
    angle: 118,
    accent: "#60a5fa",
    chip: "clip-path · inset",
  },
  {
    num: "F.02",
    title: "Depth Blur Fields",
    year: "2026",
    caption: "Focus is a design material.",
    angle: 62,
    accent: "#2dd4bf",
    chip: "backdrop · 18px",
  },
  {
    num: "F.03",
    title: "Magnetic Systems",
    year: "2025",
    caption: "Interfaces that lean toward intent.",
    angle: 141,
    accent: "#c084fc",
    chip: "spring · k180",
  },
  {
    num: "F.04",
    title: "Gradient Meshes",
    year: "2025",
    caption: "Color that breathes below the surface.",
    angle: 27,
    accent: "#fbbf24",
    chip: "radial · screen",
  },
];

/* Deterministic PRNG — the particle cloud is identical on every visit. */
function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLE_SEED = 20260702;

/* Torus-shaped nebula of glowing dust. Each particle carries its own
   dispersion direction, speed and phase, so on scroll the cloud breaks
   apart organically instead of fading. */
function buildTorusCloud(count, seed) {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const dirs = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  const RING = 1.5;

  for (let i = 0; i < count; i += 1) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 2;
    const halo = rand() < 0.14 ? 2.4 : 1;
    const tube = 0.5 * Math.sqrt(rand()) * halo * (0.55 + 0.45 * rand());
    const x = (RING + tube * Math.cos(v)) * Math.cos(u);
    const y = (RING + tube * Math.cos(v)) * Math.sin(u) * 0.92;
    const z = tube * Math.sin(v) * 0.85;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const pick = rand();
    let r;
    let g;
    let b;
    if (pick < 0.5) {
      r = 0.93; g = 0.92; b = 0.9;
    } else if (pick < 0.78) {
      r = 0.75; g = 0.52; b = 0.99;
    } else if (pick < 0.92) {
      r = 0.38; g = 0.65; b = 0.98;
    } else {
      r = 0.25; g = 0.85; b = 0.78;
    }
    const bright = 0.45 + 0.55 * rand();
    colors[i * 3] = r * bright;
    colors[i * 3 + 1] = g * bright;
    colors[i * 3 + 2] = b * bright;

    // Outward flight path with a bias toward the camera, so the burst
    // flies past the viewer instead of shrinking into the distance.
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const dx = x / len + (rand() - 0.5) * 0.7;
    const dy = y / len + (rand() - 0.5) * 0.7;
    const dz = z / len + 0.55 + rand() * 0.7;
    const dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    dirs[i * 3] = dx / dl;
    dirs[i * 3 + 1] = dy / dl;
    dirs[i * 3 + 2] = dz / dl;

    scales[i] = rand() < 0.02 ? 2.6 + rand() * 1.6 : 0.5 + rand() * 1.4;
    speeds[i] = 0.7 + rand() * 0.9;
    phases[i] = rand() * Math.PI * 2;
  }

  return { positions, colors, dirs, scales, speeds, phases };
}

/* Sparse background dust that survives the dispersion, keeping depth
   behind the revealed content. */
function buildDust(count, seed) {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const dirs = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2;
    const cosPhi = rand() * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const radius = 2.8 + rand() * 4.2;
    positions[i * 3] = radius * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = radius * sinPhi * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = radius * cosPhi * 0.6 - 1.4;

    const cool = rand();
    const bright = 0.2 + 0.3 * rand();
    colors[i * 3] = (cool < 0.75 ? 0.9 : 0.6) * bright;
    colors[i * 3 + 1] = (cool < 0.75 ? 0.9 : 0.68) * bright;
    colors[i * 3 + 2] = 0.95 * bright;

    scales[i] = 0.4 + rand() * 0.9;
    speeds[i] = 0.6 + rand() * 0.8;
    phases[i] = rand() * Math.PI * 2;
  }

  return { positions, colors, dirs, scales, speeds, phases };
}

const PARTICLE_VERTEX = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aPhase;
  uniform float uTime;
  uniform float uDisperse;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Organic idle drift — every particle breathes on its own rhythm.
    pos.x += 0.05 * sin(uTime * 0.55 * aSpeed + aPhase);
    pos.y += 0.05 * cos(uTime * 0.48 * aSpeed + aPhase * 1.7);
    pos.z += 0.04 * sin(uTime * 0.62 * aSpeed + aPhase * 2.3);

    // Scroll-driven dissolve: a spatial wave sweeps across the ring while
    // each particle keeps its own stagger; flight eases in smoothly and
    // drifts sideways so the field breaks up organically, never bursting.
    float wave = (position.x * 0.5 + position.y * 0.8) * 0.055;
    float raw = clamp(uDisperse * 1.55 - wave - fract(aPhase * 0.1591) * 0.24, 0.0, 1.0);
    float t = raw * raw * (3.0 - 2.0 * raw);
    pos += aDir * (t * t * (5.5 + aSpeed * 3.0));
    vec3 side = normalize(vec3(-aDir.y, aDir.x, 0.3 * sin(aPhase)));
    pos += side * sin(t * 3.14159) * (0.3 + 0.3 * fract(aPhase * 0.618));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + t * 1.1) * (4.5 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    float twinkle = 0.7 + 0.3 * sin(uTime * (0.8 + aSpeed) + aPhase * 3.0);
    vAlpha = twinkle * (1.0 - smoothstep(0.22, 0.92, t));
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.06, d);
    float halo = smoothstep(0.5, 0.0, d);
    float alpha = (core * 0.85 + halo * 0.3) * vAlpha;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * (0.7 + 0.5 * core), alpha);
  }
`;

/* ------------------------------- atoms ------------------------------ */

function MonoLabel({ children, style = {} }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: DIM,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* Masked line reveal — the reference file's signature move. */
function MaskedLine({ children, delay = 0, once = true, style = {} }) {
  return (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        paddingBottom: "0.09em",
        marginBottom: "-0.09em",
      }}
    >
      <motion.span
        initial={{ y: "112%", rotate: 2.5 }}
        whileInView={{ y: 0, rotate: 0 }}
        viewport={{ once, amount: 0.5 }}
        transition={{ duration: 1.15, ease: EASE, delay }}
        style={{
          display: "block",
          transformOrigin: "0% 100%",
          willChange: "transform",
          ...style,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Springy count-up metric. */
function Counter({ to, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 55, damping: 17 });
  const text = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (inView) {
      raw.set(to);
    }
  }, [inView, to, raw]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      <motion.span>{text}</motion.span>
      <span style={{ fontSize: "0.55em", marginLeft: 2 }}>{suffix}</span>
    </span>
  );
}

/* Film grain over the whole scene. */
function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
        opacity: 0.055,
        mixBlendMode: "overlay",
        backgroundImage: GRAIN_SVG,
        backgroundSize: "140px 140px",
      }}
    />
  );
}

/* Liquid light — two blurred glow blobs trail the cursor at different
   spring rates, so the light feels like it has viscosity. */
function LiquidLight() {
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const slowX = useSpring(mx, { stiffness: 40, damping: 16, mass: 0.9 });
  const slowY = useSpring(my, { stiffness: 40, damping: 16, mass: 0.9 });
  const lagX = useSpring(mx, { stiffness: 16, damping: 14, mass: 1.4 });
  const lagY = useSpring(my, { stiffness: 16, damping: 14, mass: 1.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }
    setEnabled(true);
    const move = (event) => {
      mx.set(event.clientX);
      my.set(event.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: -260,
          left: -260,
          width: 520,
          height: 520,
          x: slowX,
          y: slowY,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(96,165,250,0.16) 0%, rgba(45,212,191,0.07) 42%, transparent 70%)",
          filter: "blur(30px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: -140,
          left: -140,
          width: 280,
          height: 280,
          x: lagX,
          y: lagY,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,132,252,0.14) 0%, transparent 68%)",
          filter: "blur(24px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </>
  );
}

/* Animated gradient mesh — huge blurred blobs drifting on loops. */
function GradientMesh() {
  const blobs = [
    {
      size: "58vmax",
      top: "-22%",
      left: "-14%",
      color: "rgba(37,99,235,0.20)",
      x: [0, 70, 0],
      y: [0, 40, 0],
      dur: 26,
    },
    {
      size: "48vmax",
      top: "30%",
      left: "58%",
      color: "rgba(20,184,166,0.14)",
      x: [0, -60, 0],
      y: [0, -34, 0],
      dur: 31,
    },
    {
      size: "42vmax",
      top: "62%",
      left: "8%",
      color: "rgba(147,51,234,0.13)",
      x: [0, 50, 0],
      y: [0, -46, 0],
      dur: 36,
    },
  ];

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          animate={{ x: blob.x, y: blob.y, scale: [1, 1.08, 1] }}
          transition={{ duration: blob.dur, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 66%)`,
            filter: "blur(52px)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* Pointer-tilt stage with preserved 3D for inner translateZ layers. */
function Tilt({ children, disabled, max = 7 }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 130, damping: 15, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 130, damping: 15, mass: 0.4 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const handleMove = (event) => {
    if (disabled) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div onPointerMove={handleMove} onPointerLeave={handleLeave} style={{ perspective: 1100 }}>
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Split-text: per-character masked cascade with a slight roll. */
function SplitChars({ text, delay = 0, step = 0.045, style = {} }) {
  return (
    <span aria-label={text} style={{ display: "inline-block", ...style }}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          aria-hidden
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
          }}
        >
          <motion.span
            initial={{ y: "118%", rotate: 8, opacity: 0.001 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + index * step }}
            style={{ display: "inline-block", transformOrigin: "0% 100%", willChange: "transform" }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Cursor-reactive spotlight — a soft light cone sweeping the stage. */
function CursorSpotlight({ x, y, size = 640, strength = 0.09 }) {
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, rgba(255,255,255,${strength}) 0%, rgba(96,165,250,0.05) 32%, transparent 62%)`;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 6,
      }}
    />
  );
}

/* --------------------------- particle field -------------------------- */

function ParticleCloud({ progress, disperse, cursorX, cursorY, count }) {
  const groupRef = useRef(null);
  const data = useMemo(() => buildTorusCloud(count, PARTICLE_SEED), [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisperse: { value: 0 },
      uSize: { value: 2.3 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const p = progress.get();
    uniforms.uTime.value = time;
    uniforms.uDisperse.value = disperse.get();
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.03 + p * 0.5;
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.07;
      groupRef.current.scale.setScalar(1 + Math.sin(time * 0.4) * 0.012);
    }

    // Gentle camera language: the cursor steers, scroll dollies in.
    const targetX = cursorX.get() * 0.55;
    const targetY = -cursorY.get() * 0.4;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.position.z = 4.55 - p * 1.2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aDir" args={[data.dirs, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[data.scales, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={PARTICLE_VERTEX}
          fragmentShader={PARTICLE_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function DustField({ count }) {
  const groupRef = useRef(null);
  const data = useMemo(() => buildDust(count, PARTICLE_SEED + 7), [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisperse: { value: 0 },
      uSize: { value: 1.35 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aDir" args={[data.dirs, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[data.scales, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={PARTICLE_VERTEX}
          fragmentShader={PARTICLE_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ParticleScene({ progress, disperse, cursorX, cursorY, isMobile, active }) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
      camera={{ position: [0, 0, 4.5], fov: 50, near: 0.1, far: 40 }}
      style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}
    >
      <ParticleCloud
        progress={progress}
        disperse={disperse}
        cursorX={cursorX}
        cursorY={cursorY}
        count={isMobile ? 8000 : 26000}
      />
      <DustField count={isMobile ? 300 : 800} />
    </Canvas>
  );
}

/* ----------------------- floating image gallery ---------------------- */

/* Nine real frames on independent depth planes. z: 0 = far, 1 = near —
   sets glide speed, cursor parallax, scale and depth-of-field. `hold`
   keeps the final wave on stage for the handoff into the tunnel. */
const GALLERY_IMAGES = [
  {
    id: "img-01",
    src: "/snapshots/distributed-storage/snapshot-03.jpg",
    alt: "Server racks in a dark aisle",
    num: "SYS.01",
    label: "Distributed Storage",
    z: 0.85,
    left: "6%",
    top: "14%",
    width: "min(24vw, 360px)",
    ratio: "3 / 4",
    window: [0.18, 0.52],
    rot: [-5, 2],
  },
  {
    id: "img-02",
    src: "/snapshots/task-scheduler/snapshot-02.jpg",
    alt: "Sticky notes covering a laptop screen",
    num: "SYS.02",
    label: "Task Scheduler",
    z: 0.55,
    left: "67%",
    top: "12%",
    width: "min(21vw, 320px)",
    ratio: "4 / 3",
    window: [0.22, 0.56],
    rot: [4, -3],
  },
  {
    id: "img-03",
    src: "/snapshots/realtime-editor/snapshot-02.jpg",
    alt: "Realtime editor session",
    num: "SYS.03",
    label: "Realtime Editor",
    z: 0.2,
    left: "39%",
    top: "8%",
    width: "min(15vw, 230px)",
    ratio: "3 / 4",
    window: [0.26, 0.6],
    rot: [-2, 2],
  },
  {
    id: "img-04",
    src: "/snapshots/indoor-navigation/snapshot-02.jpg",
    alt: "Indoor navigation study",
    num: "SYS.04",
    label: "Indoor Navigation",
    z: 0.45,
    left: "10%",
    top: "54%",
    width: "min(19vw, 290px)",
    ratio: "4 / 5",
    window: [0.4, 0.72],
    rot: [3, -4],
  },
  {
    id: "img-05",
    src: "/snapshots/distributed-storage/snapshot-02.jpg",
    alt: "Storage infrastructure detail",
    num: "SYS.05",
    label: "Storage Fabric",
    z: 0.8,
    left: "70%",
    top: "56%",
    width: "min(23vw, 340px)",
    ratio: "4 / 3",
    window: [0.44, 0.76],
    rot: [-3, 5],
  },
  {
    id: "img-06",
    src: "/profile/portrait.jpg",
    alt: "Portrait of the researcher",
    num: "LAB.00",
    label: "The Researcher",
    z: 0.9,
    left: "29%",
    top: "17%",
    width: "min(20vw, 300px)",
    ratio: "3 / 4",
    window: [0.62, 1],
    hold: true,
    rot: [-4, -1],
  },
  {
    id: "img-07",
    src: "/snapshots/indoor-navigation/snapshot-03.jpg",
    alt: "Navigation field capture",
    num: "SYS.06",
    label: "Wayfinding",
    z: 0.6,
    left: "57%",
    top: "28%",
    width: "min(24vw, 370px)",
    ratio: "4 / 3",
    window: [0.67, 1],
    hold: true,
    rot: [3, 1],
  },
  {
    id: "img-08",
    src: "/snapshots/realtime-editor/snapshot-03.jpg",
    alt: "Editor collaboration detail",
    num: "SYS.07",
    label: "Live Sync",
    z: 0.3,
    left: "8%",
    top: "30%",
    width: "min(16vw, 250px)",
    ratio: "3 / 4",
    window: [0.71, 1],
    hold: true,
    rot: [-2, -3],
  },
  {
    id: "img-09",
    src: "/snapshots/task-scheduler/snapshot-03.jpg",
    alt: "Scheduling board",
    num: "SYS.08",
    label: "Orchestration",
    z: 0.5,
    left: "42%",
    top: "58%",
    width: "min(18vw, 280px)",
    ratio: "4 / 3",
    window: [0.74, 1],
    hold: true,
    rot: [2, 4],
  },
];

/* One frame gliding on its depth plane: long soft fades, blur-to-focus,
   a sprung glide, slow rotation, cursor parallax and an idle float. */
function FloatingImage({ image, progress, cursorX, cursorY }) {
  const [s, e] = image.window;
  const span = e - s;
  const depth = image.z;
  const travel = 26 + depth * 46;

  const rawY = useTransform(
    progress,
    [s, e],
    [travel, image.hold ? -3 : -travel * 1.1],
  );
  const springY = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.9 });
  const y = useMotionTemplate`${springY}vh`;
  const opacity = useTransform(
    progress,
    image.hold
      ? [s, s + span * 0.3, 1]
      : [s, s + span * 0.3, e - span * 0.22, e],
    image.hold ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const dof = (1 - depth) * 2.2;
  const blur = useTransform(
    progress,
    image.hold
      ? [s, s + span * 0.34, 1]
      : [s, s + span * 0.34, e - span * 0.2, e],
    image.hold ? [7 + dof, dof, dof] : [7 + dof, dof, dof, 8 + dof],
  );
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(progress, [s, e], [0.88, image.hold ? 1 : 1.05]);
  const rotate = useTransform(progress, [s, e], image.rot);
  const parallaxX = useTransform(cursorX, [-0.5, 0.5], [depth * -22, depth * 22]);
  const parallaxY = useTransform(cursorY, [-0.5, 0.5], [depth * -13, depth * 13]);
  const tz = (depth - 0.5) * 220;

  return (
    <div
      style={{
        position: "absolute",
        left: image.left,
        top: image.top,
        width: image.width,
        transform: `translateZ(${tz}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{ opacity, y, scale, rotate, filter, willChange: "transform, opacity, filter" }}
      >
        <motion.div style={{ x: parallaxX, y: parallaxY }}>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 6.5 + depth * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: depth * 1.7,
            }}
          >
            <motion.div
              data-cursor="hover"
              whileHover="hover"
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                aspectRatio: image.ratio,
                border: "1px solid rgba(236,234,228,0.09)",
                boxShadow: "0 34px 80px rgba(0,0,0,0.65)",
              }}
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                draggable={false}
                variants={{ hover: { scale: 1.06 } }}
                transition={{ duration: 1.1, ease: EASE }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Rests slightly dimmed; wakes to full light on hover */}
              <motion.div
                aria-hidden
                variants={{ hover: { opacity: 0 } }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.22)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  bottom: 10,
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "rgba(236,234,228,0.85)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                }}
              >
                [ {image.num} — {image.label.toUpperCase()} ]
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* --------------------- dust → gallery experience --------------------- */

const DUST_PHASES = ["01 — Orbital dust", "02 — Dispersion", "03 — Gallery in depth"];

function ParticleExperience({ isMobile }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Dispersion rides a soft spring so the field breaks with momentum
  // and settles — never snapping to the wheel.
  const disperseRaw = useTransform(scrollYProgress, [0.14, 0.52], [0, 1]);
  const disperse = useSpring(disperseRaw, { stiffness: 38, damping: 22, mass: 1 });

  // Cursor → camera, parallax and spotlight.
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 45, damping: 15, mass: 0.6 });
  const sy = useSpring(cy, { stiffness: 45, damping: 15, mass: 0.6 });
  const mx = useMotionValue(-800);
  const my = useMotionValue(-800);
  const smx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.5 });

  // Hero type: rests softly out of focus behind the dust, pulls sharp,
  // then defocuses away exactly as the field begins to break.
  const heroBlur = useTransform(scrollYProgress, [0, 0.07, 0.13, 0.24], [6, 0, 0, 12]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;
  const heroOpacity = useTransform(scrollYProgress, [0, 0.13, 0.24], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.24], [1.02, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.24], ["0vh", "-5vh"]);
  const wordX1 = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const wordX2 = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const wordY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  const introOpacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);

  // Gallery camera: the cursor steers, scroll leans the stage forward.
  const camRotY = useTransform(sx, [-0.5, 0.5], [-3.5, 3.5]);
  const camTiltCursor = useTransform(sy, [-0.5, 0.5], [2.5, -2.5]);
  const camTiltScroll = useTransform(scrollYProgress, [0.2, 1], [1.5, -1.5]);
  const camRotX = useTransform([camTiltCursor, camTiltScroll], ([a, b]) => a + b);
  const camScale = useTransform(scrollYProgress, [0.2, 1], [1.01, 1.05]);

  // Statement drifting through the middle of the composition.
  const stmtOpacity = useTransform(scrollYProgress, [0.5, 0.56, 0.68, 0.74], [0, 1, 1, 0]);
  const stmtY = useTransform(scrollYProgress, [0.5, 0.74], ["8vh", "-8vh"]);
  const stmtBlur = useTransform(scrollYProgress, [0.5, 0.56, 0.68, 0.74], [8, 0, 0, 8]);
  const stmtFilter = useMotionTemplate`blur(${stmtBlur}px)`;

  const bridgeOpacity = useTransform(scrollYProgress, [0.86, 0.96], [0, 1]);

  // Pause the WebGL loop whenever the stage is off screen.
  const [canvasActive, setCanvasActive] = useState(true);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const [phase, setPhase] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setPhase(value < 0.14 ? 0 : value < 0.42 ? 1 : 2);
  });

  const handleMove = (event) => {
    if (event.pointerType === "touch") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    cx.set((event.clientX - rect.left) / rect.width - 0.5);
    cy.set((event.clientY - rect.top) / rect.height - 0.5);
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  };

  const handleLeave = () => {
    cx.set(0);
    cy.set(0);
    mx.set(-800);
    my.set(-800);
  };

  return (
    <>
      <section
        ref={sectionRef}
        style={{ position: "relative", height: isMobile ? "240vh" : "520vh" }}
      >
        <div
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        >
          {/* Volumetric core glow behind everything */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(46% 42% at 50% 47%, rgba(147,51,234,0.16) 0%, rgba(37,99,235,0.07) 45%, transparent 72%)",
            }}
          />

          {/* Hero type — veiled by the particle field drifting above it */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              opacity: heroOpacity,
              filter: heroFilter,
              scale: heroScale,
              y: heroY,
              pointerEvents: "none",
            }}
          >
            <h1 style={{ margin: 0, color: INK }}>
              <motion.span
                style={{
                  position: "absolute",
                  left: "5vw",
                  top: isMobile ? "15vh" : "11vh",
                  x: isMobile ? 0 : wordX1,
                  y: isMobile ? 0 : wordY,
                  fontWeight: 300,
                  fontSize: "clamp(64px, 13vw, 200px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                }}
              >
                <SplitChars text="Motion" delay={0.3} step={0.06} />
              </motion.span>
              <motion.span
                style={{
                  position: "absolute",
                  right: "5vw",
                  bottom: isMobile ? "10vh" : "12vh",
                  x: isMobile ? 0 : wordX2,
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(54px, 11vw, 170px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.9,
                }}
              >
                <SplitChars text="research" delay={0.75} step={0.055} />
              </motion.span>
            </h1>
          </motion.div>

          {/* Multi-layer image gallery under the dust (desktop) */}
          {!isMobile && (
            <>
              <motion.div style={{ position: "absolute", inset: 0, perspective: 1300, zIndex: 3 }}>
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    rotateY: camRotY,
                    rotateX: camRotX,
                    scale: camScale,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  {GALLERY_IMAGES.map((image) => (
                    <FloatingImage
                      key={image.id}
                      image={image}
                      progress={scrollYProgress}
                      cursorX={sx}
                      cursorY={sy}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Statement passing through the composition */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  zIndex: 5,
                  opacity: stmtOpacity,
                  y: stmtY,
                  filter: stmtFilter,
                  pointerEvents: "none",
                }}
              >
                <div style={{ maxWidth: 900, padding: "0 6vw" }}>
                  <MonoLabel style={{ color: FAINT }}>Statement — 01</MonoLabel>
                  <h2
                    style={{
                      margin: "22px 0 0",
                      color: INK,
                      fontWeight: 300,
                      fontSize: "clamp(28px, 3.6vw, 56px)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      textShadow: "0 2px 30px rgba(0,0,0,0.9)",
                    }}
                  >
                    Motion is not decoration —{" "}
                    <span style={{ fontFamily: SERIF, fontStyle: "italic" }}>
                      it is how an interface explains itself.
                    </span>
                  </h2>
                </div>
              </motion.div>

              {/* Bridge into the tunnel below */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "10vh",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zIndex: 5,
                  opacity: bridgeOpacity,
                  pointerEvents: "none",
                }}
              >
                <MonoLabel style={{ color: FAINT }}>
                  The archive continues — experiments below
                </MonoLabel>
              </motion.div>
            </>
          )}

          {/* The particle nebula — pointer events pass straight through */}
          <ParticleScene
            progress={scrollYProgress}
            disperse={disperse}
            cursorX={sx}
            cursorY={sy}
            isMobile={isMobile}
            active={canvasActive}
          />

          {!isMobile && <CursorSpotlight x={smx} y={smy} size={700} strength={0.07} />}

          {/* HUD */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            style={{
              position: "absolute",
              top: 104,
              left: "6vw",
              right: "6vw",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              zIndex: 7,
              pointerEvents: "none",
            }}
          >
            <MonoLabel style={{ color: FAINT }}>Motion Research Lab</MonoLabel>
            <MonoLabel>File — MMXXVI</MonoLabel>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              left: "6vw",
              bottom: isMobile ? "24vh" : "16vh",
              maxWidth: isMobile ? "70vw" : 380,
              zIndex: 7,
              opacity: introOpacity,
              pointerEvents: "none",
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
              style={{ margin: 0, color: FAINT, fontSize: 15, lineHeight: 1.75 }}
            >
              A living field of stardust holds its shape while you watch —
              thousands of particles breathing in slow orbit.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
              style={{ margin: "14px 0 0", color: DIM, fontSize: 14, lineHeight: 1.7 }}
            >
              Scroll — the dust disperses, and the work it was hiding drifts
              into focus.
            </motion.p>
          </motion.div>

          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: "6vw",
              right: "6vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              zIndex: 7,
              pointerEvents: "none",
            }}
          >
            <MonoLabel>40.7128°N 74.0060°W</MonoLabel>
            <motion.div
              style={{
                opacity: introOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <MonoLabel>Scroll</MonoLabel>
              <div style={{ width: 1, height: 46, background: LINE, overflow: "hidden" }}>
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: "100%", height: "50%", background: INK }}
                />
              </div>
            </motion.div>
            <MonoLabel style={{ textAlign: "right" }}>
              {DUST_PHASES[phase]}
              <br />
              {isMobile ? "8K" : "26K"} particles
            </MonoLabel>
          </div>

          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              transformOrigin: "left",
              scaleX: scrollYProgress,
              background: "linear-gradient(90deg, #c084fc, #60a5fa)",
              zIndex: 7,
            }}
          />
        </div>
      </section>

      {/* On mobile the gallery lands as a column right after the field. */}
      {isMobile && (
        <section style={{ padding: "4vh 6vw 10vh", display: "grid", gap: 26 }}>
          <MonoLabel>Gallery — in depth</MonoLabel>
          {GALLERY_IMAGES.map((image, index) => (
            <div key={image.id} style={{ display: "grid", gap: 26 }}>
              <motion.div
                initial={{ opacity: 0, y: 56, rotate: index % 2 === 0 ? -2.5 : 2.5, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  aspectRatio: image.ratio,
                  border: "1px solid rgba(236,234,228,0.09)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    bottom: 10,
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: "rgba(236,234,228,0.85)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  [ {image.num} — {image.label.toUpperCase()} ]
                </span>
              </motion.div>
              {index === 4 && (
                <div style={{ padding: "5vh 0", textAlign: "center" }}>
                  <MonoLabel>Statement — 01</MonoLabel>
                  <h2
                    style={{
                      margin: "18px 0 0",
                      color: INK,
                      fontWeight: 300,
                      fontSize: "clamp(26px, 7vw, 40px)",
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Motion is not decoration —{" "}
                    <span style={{ fontFamily: SERIF, fontStyle: "italic" }}>
                      it is how an interface explains itself.
                    </span>
                  </h2>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
}

/* --------------------------- depth tunnel --------------------------- */

function TunnelCard({ experiment, index, count, progress, isMobile }) {
  const start = index / count;
  const end = (index + 1) / count;
  const p = useTransform(progress, [start, end], [0, 1]);

  const scale = useTransform(p, [0, 1], [0.52, 1.16]);
  const opacity = useTransform(
    p,
    [0, 0.14, 0.72, 1],
    [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const blur = useTransform(p, [0, 0.24, 0.74, 1], [10, 0, 0, 14]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const y = useTransform(p, [0, 1], [70, -130]);
  const even = index % 2 === 0;
  const x = useTransform(p, [0, 1], even ? [90, -46] : [-90, 46]);
  const rotateY = useTransform(p, [0, 1], even ? [9, -5] : [-9, 5]);

  const card = (
    <motion.div
      whileHover="hover"
      style={{
        position: "relative",
        width: isMobile ? "100%" : "min(760px, 86vw)",
        borderRadius: 26,
        overflow: "hidden",
        border: `1px solid ${LINE}`,
        background: "rgba(255,255,255,0.045)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: "0 48px 110px rgba(0,0,0,0.55)",
        padding: isMobile ? "26px 22px" : "clamp(30px, 3.6vw, 48px)",
      }}
    >
      {/* Accent glow inside the glass */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-38%",
          right: "-14%",
          width: "62%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${experiment.accent}44 0%, transparent 66%)`,
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />
      {/* Shine sweep */}
      <motion.div
        aria-hidden
        initial={{ x: "-170%" }}
        variants={{ hover: { x: "170%" } }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          background:
            "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.06) 55%, transparent 100%)",
          transform: "skewX(-12deg)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", transform: "translateZ(34px)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: experiment.accent,
                boxShadow: `0 0 12px ${experiment.accent}`,
              }}
            />
            <MonoLabel style={{ color: FAINT }}>Exp — {experiment.index}</MonoLabel>
          </span>
          <MonoLabel>{experiment.year}</MonoLabel>
        </div>

        <h3 style={{ margin: 0, color: INK, lineHeight: 0.98 }}>
          <span
            style={{
              display: "block",
              fontSize: isMobile ? 40 : "clamp(44px, 6.4vw, 86px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {experiment.lead}
          </span>
          <span
            style={{
              display: "block",
              fontSize: isMobile ? 40 : "clamp(44px, 6.4vw, 86px)",
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              color: experiment.accent,
            }}
          >
            {experiment.tail}
          </span>
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
            gap: isMobile ? 18 : 34,
            marginTop: 22,
            alignItems: "end",
          }}
        >
          <div>
            <p style={{ margin: 0, color: FAINT, fontSize: 15, lineHeight: 1.7 }}>
              {experiment.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {experiment.tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ y: -3, borderColor: `${experiment.accent}88` }}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${LINE}`,
                    padding: "6px 12px",
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: FAINT,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
          <div
            style={{
              borderLeft: isMobile ? "none" : `1px solid ${LINE}`,
              borderTop: isMobile ? `1px solid ${LINE}` : "none",
              paddingLeft: isMobile ? 0 : 24,
              paddingTop: isMobile ? 16 : 0,
            }}
          >
            <p
              style={{
                margin: 0,
                color: INK,
                fontSize: isMobile ? 34 : 44,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <Counter
                to={experiment.metric.value}
                decimals={experiment.metric.decimals}
                suffix={experiment.metric.suffix}
              />
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: DIM,
              }}
            >
              {experiment.metric.label}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {card}
      </motion.div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: "0 24px",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          y,
          x,
          rotateY,
          filter,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity, filter",
          pointerEvents: "auto",
        }}
      >
        <Tilt max={5}>{card}</Tilt>
      </motion.div>
    </div>
  );
}

function DepthTunnel({ isMobile }) {
  const count = experiments.length;
  const tunnelRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: tunnelRef,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(count - 1, Math.floor(value * count)));
  });

  const floorShift = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const railScale = useTransform(scrollYProgress, [0, 1], [1 / count, 1]);

  if (isMobile) {
    return (
      <section ref={tunnelRef} style={{ padding: "10vh 6vw", display: "grid", gap: 22 }}>
        <MonoLabel>Experiments — the depth tunnel</MonoLabel>
        {experiments.map((experiment, index) => (
          <TunnelCard
            key={experiment.id}
            experiment={experiment}
            index={index}
            count={count}
            progress={scrollYProgress}
            isMobile
          />
        ))}
      </section>
    );
  }

  return (
    <section ref={tunnelRef} style={{ position: "relative", height: `${count * 105}vh` }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          perspective: 1000,
        }}
      >
        {/* Vignette + depth floor */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(90% 70% at 50% 42%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-18%",
            right: "-18%",
            bottom: "-14%",
            height: "48%",
            transform: "perspective(650px) rotateX(72deg)",
            overflow: "hidden",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 45%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 45%)",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: "-60% 0",
              y: floorShift,
              backgroundImage:
                "linear-gradient(rgba(236,234,228,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(236,234,228,0.10) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* Header inside the pinned scene */}
        <div
          style={{
            position: "absolute",
            top: 110,
            left: "6vw",
            right: "6vw",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <MonoLabel style={{ color: FAINT }}>Experiments — scroll to travel</MonoLabel>
          <MonoLabel>Depth Series</MonoLabel>
        </div>

        {experiments.map((experiment, index) => (
          <TunnelCard
            key={experiment.id}
            experiment={experiment}
            index={index}
            count={count}
            progress={scrollYProgress}
            isMobile={false}
          />
        ))}

        {/* Progress rail */}
        <div
          style={{
            position: "absolute",
            bottom: 34,
            left: "6vw",
            right: "6vw",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.14em",
              color: FAINT,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0{active + 1} / 0{count}
          </span>
          <div style={{ flex: 1, height: 1, background: LINE, overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%",
                transformOrigin: "left",
                scaleX: railScale,
                background: `linear-gradient(90deg, ${experiments[0].accent}, ${experiments[2].accent})`,
              }}
            />
          </div>
          <MonoLabel>{experiments[active].lead}</MonoLabel>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- findings plates -------------------------- */

function PlateCard({ plate, height, delay = 0, isMobile }) {
  const plateRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: plateRef,
    offset: ["start end", "end start"],
  });
  const innerY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={plateRef}>
      <motion.div
        data-cursor="hover"
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.25, ease: EASE, delay }}
        whileHover="hover"
        style={{
          position: "relative",
          overflow: "hidden",
          height,
          borderRadius: 20,
          border: `1px solid ${LINE}`,
        }}
      >
        {/* Textured inner layer — parallaxes against the frame */}
        <motion.div
          variants={{ hover: { scale: 1.05 } }}
          transition={{ duration: 1, ease: EASE }}
          style={{
            position: "absolute",
            inset: "-10% 0",
            y: innerY,
            background: `repeating-linear-gradient(${plate.angle}deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 12px), linear-gradient(160deg, rgba(255,255,255,0.04), transparent 60%)`,
            willChange: "transform",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "16%",
              left: "22%",
              width: "56%",
              aspectRatio: "1",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${plate.accent}3d 0%, transparent 62%)`,
              filter: "blur(30px)",
            }}
          />
        </motion.div>

        {/* Shine sweep */}
        <motion.div
          aria-hidden
          initial={{ x: "-170%" }}
          variants={{ hover: { x: "170%" } }}
          transition={{ duration: 1.05, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "44%",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)",
            transform: "skewX(-12deg)",
            pointerEvents: "none",
          }}
        />

        {/* Floating glass chip */}
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay }}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            borderRadius: 999,
            border: `1px solid ${LINE}`,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "7px 13px",
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: FAINT,
          }}
        >
          {plate.chip}
        </motion.div>

        <span
          style={{
            position: "absolute",
            left: 18,
            bottom: 16,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: DIM,
          }}
        >
          [ {plate.num} — {plate.title.toUpperCase()} ]
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE, delay: delay + 0.15 }}
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span style={{ color: INK, fontSize: 15 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM, marginRight: 10 }}>
            {plate.num}
          </span>
          {plate.title}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: FAINT,
              marginLeft: 10,
              fontSize: 14,
            }}
          >
            {plate.caption}
          </span>
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>{plate.year}</span>
      </motion.div>
    </div>
  );
}

function Findings({ isMobile }) {
  const headStyle = {
    fontSize: "clamp(44px, 8.5vw, 128px)",
    lineHeight: 0.95,
    letterSpacing: "-0.03em",
    color: INK,
  };

  return (
    <section style={{ padding: isMobile ? "14vh 6vw" : "18vh 6vw" }}>
      <div style={{ marginBottom: "9vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 22 }}
        >
          <MonoLabel>Archive — 02</MonoLabel>
        </motion.div>
        <h2 style={{ margin: 0 }}>
          <MaskedLine style={{ ...headStyle, fontWeight: 800, textTransform: "uppercase" }}>
            Field
          </MaskedLine>
          <MaskedLine
            delay={0.1}
            style={{ ...headStyle, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500 }}
          >
            findings
          </MaskedLine>
        </h2>
      </div>

      {isMobile ? (
        <div style={{ display: "grid", gap: 40 }}>
          {findings.map((plate) => (
            <PlateCard key={plate.num} plate={plate} height="52vh" isMobile />
          ))}
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 30,
              alignItems: "start",
            }}
          >
            <div style={{ gridColumn: "1 / span 6" }}>
              <PlateCard plate={findings[0]} height="64vh" />
            </div>
            <div style={{ gridColumn: "8 / span 5", marginTop: "20vh" }}>
              <PlateCard plate={findings[1]} height="48vh" delay={0.08} />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 30,
              alignItems: "start",
              marginTop: "14vh",
            }}
          >
            <div style={{ gridColumn: "2 / span 4", marginTop: "10vh" }}>
              <PlateCard plate={findings[2]} height="52vh" />
            </div>
            <div style={{ gridColumn: "7 / span 5" }}>
              <PlateCard plate={findings[3]} height="66vh" delay={0.08} />
            </div>
          </div>
        </>
      )}

      {/* Animated metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
          marginTop: "14vh",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 44,
        }}
      >
        {[
          { value: 120, suffix: "fps", label: "Every layer GPU-composited", accent: "#60a5fa" },
          { value: 0.4, suffix: "s", decimals: 1, label: "Longest reveal a user waits", accent: "#2dd4bf" },
          { value: 34, suffix: "", label: "Springs tuned by hand", accent: "#c084fc" },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30, rotateX: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE, delay: index * 0.09 }}
            whileHover={{ y: -6, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
            style={{
              borderRadius: 18,
              border: `1px solid ${LINE}`,
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              padding: "22px 22px",
              perspective: 800,
            }}
          >
            <p
              style={{
                margin: 0,
                color: INK,
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <Counter to={metric.value} decimals={metric.decimals || 0} suffix={metric.suffix} />
            </p>
            <div
              style={{
                width: 34,
                height: 2,
                background: metric.accent,
                boxShadow: `0 0 12px ${metric.accent}`,
                margin: "14px 0",
              }}
            />
            <p
              style={{
                margin: 0,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: DIM,
                lineHeight: 1.7,
              }}
            >
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- finale -------------------------------- */

function Finale({ isMobile }) {
  const finaleRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: finaleRef,
    offset: ["start start", "end end"],
  });

  const wordScale = useTransform(scrollYProgress, [0, 0.6], [0.72, 1]);
  const trackingValue = useTransform(scrollYProgress, [0, 0.6], [0.3, -0.02]);
  const tracking = useMotionTemplate`${trackingValue}em`;
  const wordOpacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.45, 0.75], [34, 0]);

  return (
    <section ref={finaleRef} style={{ position: "relative", height: isMobile ? "160vh" : "220vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          overflow: "hidden",
          padding: "0 6vw",
        }}
      >
        <GradientMesh />

        <motion.h2
          style={{
            margin: 0,
            scale: wordScale,
            letterSpacing: tracking,
            opacity: wordOpacity,
            color: INK,
            textAlign: "center",
            fontSize: "clamp(44px, 10vw, 150px)",
            lineHeight: 1,
            fontWeight: 800,
            textTransform: "uppercase",
            willChange: "transform, letter-spacing",
          }}
        >
          Go{" "}
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, textTransform: "none" }}>
            deeper
          </span>
        </motion.h2>

        <motion.div
          style={{
            opacity: ctaOpacity,
            y: ctaY,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <MagneticButton>
            <Link
              href="/case-studies"
              data-cursor="hover"
              style={{
                minHeight: 50,
                borderRadius: 999,
                padding: "13px 26px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                background: INK,
                color: "#0b0c10",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              View Case Studies
              <ArrowRight size={16} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/contact"
              data-cursor="hover"
              style={{
                minHeight: 50,
                borderRadius: 999,
                padding: "13px 26px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                border: `1px solid ${LINE}`,
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: INK,
                fontWeight: 500,
                fontSize: 15,
              }}
            >
              Start a Conversation
              <ArrowUpRight size={16} />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Footer instrument row */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "6vw",
            right: "6vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <MonoLabel>© MMXXVI — Motion Research</MonoLabel>
          <MagneticButton strength={0.4}>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: FAINT,
                padding: 8,
              }}
            >
              ↑ Back to top
            </button>
          </MagneticButton>
          <MonoLabel>40.7128°N 74.0060°W</MonoLabel>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ page -------------------------------- */

export default function ResearchPage() {
  const [viewportWidth, setViewportWidth] = useState(1200);
  const isMobile = viewportWidth < 900;

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        marginTop: -96,
        marginBottom: -30,
        background: "#000000",
        color: INK,
        // Sticky sections live inside — no overflow clipping on this root.
      }}
    >
      <Grain />
      <LiquidLight />

      <ParticleExperience isMobile={isMobile} />
      <DepthTunnel isMobile={isMobile} />
      <Findings isMobile={isMobile} />
      <Finale isMobile={isMobile} />
    </div>
  );
}
