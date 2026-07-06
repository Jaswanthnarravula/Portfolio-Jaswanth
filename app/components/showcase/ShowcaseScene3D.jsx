"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Real-time WebGL scene behind the /showcase hero:
 *  - GPU particle system (custom GLSL vertex/fragment shaders, depth-scaled
 *    mouse parallax, scroll drift, soft sprite rendering)
 *  - "Liquid glass" backdrop plane (domain-warped fbm noise shader)
 * Theme-aware (light/dark via data-theme) and reduced-motion aware.
 * Pointer events stay disabled so the page underneath remains interactive.
 */

const PALETTES = {
  light: { a: "#2563eb", b: "#0e9488", c: "#7c5cf6" },
  dark: { a: "#60a5fa", b: "#2dd4bf", c: "#c4b5fd" },
};

const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }
`;

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  attribute vec3 aRandom;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 pos = position;
    float t = uTime * 0.14 * aSpeed;

    // Organic drift — layered sinusoids stand in for curl noise on the GPU.
    pos.x += sin(t + aRandom.x * 6.2831) * (0.55 + aRandom.y * 0.9);
    pos.y += cos(t * 0.8 + aRandom.y * 6.2831) * (0.45 + aRandom.z * 0.8);
    pos.z += sin(t * 0.6 + aRandom.z * 6.2831) * 0.7;

    // Scroll pushes deep particles up slower than near ones.
    pos.y += uScroll * (1.6 + aRandom.x * 5.5);

    // Depth-scaled mouse parallax — the closer a particle, the more it reacts.
    float depth = clamp((pos.z + 6.0) / 12.0, 0.0, 1.0);
    pos.x += uMouse.x * depth * 1.8;
    pos.y -= uMouse.y * depth * 1.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (34.0 / -mvPosition.z);

    vAlpha = smoothstep(-16.0, -3.0, mvPosition.z) * (0.3 + aRandom.y * 0.7);
    vMix = aRandom.x;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.08, dist) * vAlpha * uOpacity;
    if (alpha < 0.003) discard;
    vec3 color = vMix < 0.34
      ? uColorA
      : (vMix < 0.67 ? uColorB : uColorC);
    gl_FragColor = vec4(color, alpha);
  }
`;

const LIQUID_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIsDark;
  varying vec2 vUv;

  ${""}
  __NOISE__

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.045;

    // Domain warping — the "liquid" look.
    vec2 q = vec2(fbm(uv * 2.3 + t), fbm(uv * 2.3 - t * 1.2));
    float n = fbm(uv * 1.9 + q * 1.7 + uMouse * 0.4);

    vec3 color = mix(uColorA, uColorB, smoothstep(0.28, 0.86, n));
    float body = smoothstep(0.2, 0.8, n);
    float glow = smoothstep(0.74, 1.0, n);
    float alpha = mix(0.1, 0.24, uIsDark) * body + glow * 0.1;

    gl_FragColor = vec4(color, alpha);
  }
`.replace("__NOISE__", NOISE_GLSL);

function Particles({ count, dark, mouse, frozen }) {
  const materialRef = useRef(null);
  const targetA = useRef(new THREE.Color(PALETTES.light.a));
  const targetB = useRef(new THREE.Color(PALETTES.light.b));
  const targetC = useRef(new THREE.Color(PALETTES.light.c));

  useEffect(() => {
    const palette = dark ? PALETTES.dark : PALETTES.light;
    targetA.current.set(palette.a);
    targetB.current.set(palette.b);
    targetC.current.set(palette.c);
  }, [dark]);

  const { positions, scales, speeds, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
      scales[i] = 0.5 + Math.random() * 1.8;
      speeds[i] = 0.4 + Math.random() * 1.5;
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    return { positions, scales, speeds, randoms };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTES.light.a) },
      uColorB: { value: new THREE.Color(PALETTES.light.b) },
      uColorC: { value: new THREE.Color(PALETTES.light.c) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    if (!frozen) {
      u.uTime.value += delta;
    }
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, 1, 0.02);
    u.uMouse.value.x = THREE.MathUtils.lerp(u.uMouse.value.x, mouse.current.x, 0.045);
    u.uMouse.value.y = THREE.MathUtils.lerp(u.uMouse.value.y, mouse.current.y, 0.045);

    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = window.scrollY / maxScroll;
    u.uScroll.value = THREE.MathUtils.lerp(u.uScroll.value, progress, 0.06);

    u.uColorA.value.lerp(targetA.current, 0.04);
    u.uColorB.value.lerp(targetB.current, 0.04);
    u.uColorC.value.lerp(targetC.current, 0.04);
  });

  return (
    <points key={count} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function LiquidBackdrop({ dark, mouse, frozen }) {
  const materialRef = useRef(null);
  const { viewport } = useThree();
  const targetA = useRef(new THREE.Color(PALETTES.light.a));
  const targetB = useRef(new THREE.Color(PALETTES.light.c));

  useEffect(() => {
    const palette = dark ? PALETTES.dark : PALETTES.light;
    targetA.current.set(palette.a);
    targetB.current.set(palette.c);
  }, [dark]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIsDark: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTES.light.a) },
      uColorB: { value: new THREE.Color(PALETTES.light.c) },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    if (!frozen) {
      u.uTime.value += delta;
    }
    u.uMouse.value.x = THREE.MathUtils.lerp(u.uMouse.value.x, mouse.current.x, 0.03);
    u.uMouse.value.y = THREE.MathUtils.lerp(u.uMouse.value.y, mouse.current.y, 0.03);
    u.uIsDark.value = THREE.MathUtils.lerp(u.uIsDark.value, dark ? 1 : 0, 0.05);
    u.uColorA.value.lerp(targetA.current, 0.04);
    u.uColorB.value.lerp(targetB.current, 0.04);
  });

  return (
    <mesh position={[0, 0, -5]} scale={[viewport.width * 2.4, viewport.height * 2.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={
          /* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `
        }
        fragmentShader={LIQUID_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function CameraRig({ mouse }) {
  useFrame((state) => {
    const camera = state.camera;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.7, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.current.y * 0.45, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ShowcaseScene3D({ isMobile = false }) {
  const mouse = useRef({ x: 0, y: 0 });
  const [dark, setDark] = useState(false);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    setFrozen(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const observer = new MutationObserver(() => {
      setDark(document.documentElement.dataset.theme === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handlePointer = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <CameraRig mouse={mouse} />
        <LiquidBackdrop dark={dark} mouse={mouse} frozen={frozen} />
        <Particles
          count={isMobile ? 1500 : 4200}
          dark={dark}
          mouse={mouse}
          frozen={frozen}
        />
      </Canvas>
    </div>
  );
}
