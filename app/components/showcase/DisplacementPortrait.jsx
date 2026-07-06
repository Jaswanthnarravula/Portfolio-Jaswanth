"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Portrait rendered on a WebGL plane with a liquid displacement shader.
 * Hovering warps the image with flowing noise around the cursor and splits
 * the RGB channels (chromatic aberration) — the displacement decays back
 * with a spring-like lerp when the pointer leaves.
 */

const FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  varying vec2 vUv;

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

  void main() {
    // Cover-fit the image inside the plane regardless of aspect ratios.
    vec2 ratio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min(uImageAspect / uPlaneAspect, 1.0)
    );
    vec2 uv = (vUv - 0.5) * ratio + 0.5;

    float dist = distance(vUv, uMouse);
    float ripple = smoothstep(0.5, 0.0, dist);

    vec2 flow = vec2(
      noise(uv * 6.0 + uTime * 0.3),
      noise(uv * 6.0 - uTime * 0.24)
    ) - 0.5;

    // Gentle idle motion, strong liquid warp near the cursor on hover.
    vec2 displacement = flow * (0.006 + uHover * ripple * 0.055);
    float shift = uHover * ripple * 0.014;

    float r = texture2D(uTexture, uv + displacement + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, uv + displacement).g;
    float b = texture2D(uTexture, uv + displacement - vec2(shift, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function PortraitPlane({ src, pointer, frozen }) {
  const materialRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const { viewport } = useThree();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uImageAspect: { value: 1 },
      uPlaneAspect: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uTexture.value = texture;
    if (texture.image) {
      uniforms.uImageAspect.value = texture.image.width / texture.image.height;
    }
  }, [texture, uniforms]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    if (!frozen) {
      u.uTime.value += delta;
    }
    u.uPlaneAspect.value = viewport.width / viewport.height;
    u.uHover.value = THREE.MathUtils.lerp(
      u.uHover.value,
      pointer.current.active ? 1 : 0,
      0.07,
    );
    u.uMouse.value.x = THREE.MathUtils.lerp(u.uMouse.value.x, pointer.current.x, 0.09);
    u.uMouse.value.y = THREE.MathUtils.lerp(u.uMouse.value.y, pointer.current.y, 0.09);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function DisplacementPortrait({ src = "/profile/portrait.jpg", style = {} }) {
  const wrapperRef = useRef(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    setFrozen(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleMove = (event) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current.x = (event.clientX - rect.left) / rect.width;
    pointer.current.y = 1 - (event.clientY - rect.top) / rect.height;
    pointer.current.active = true;
  };

  return (
    <div
      ref={wrapperRef}
      data-cursor="hover"
      onPointerMove={handleMove}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <PortraitPlane src={src} pointer={pointer} frozen={frozen} />
        </Suspense>
      </Canvas>
    </div>
  );
}
