"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/**
 * A 3D particle galaxy that slowly spins and tilts toward the mouse.
 * Pure three.js — no extra wrappers.
 */
export default function ParticleHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // ── Galaxy ──────────────────────────────────────────────
    const isMobile = width < 700;
    const count = isMobile ? 9000 : 18000;
    const branches = 4;
    const radius = 6;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const inside = new THREE.Color(isDark ? "#e879f9" : "#db2777");
    const middle = new THREE.Color(isDark ? "#a78bfa" : "#7c3aed");
    const outside = new THREE.Color(isDark ? "#22d3ee" : "#0891b2");

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spin = r * 1.1;
      const rand = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * (r + 0.4);

      positions[i * 3] = Math.cos(branchAngle + spin) * r + rand();
      positions[i * 3 + 1] = rand() * 0.5;
      positions[i * 3 + 2] = Math.sin(branchAngle + spin) * r + rand();

      const t = r / radius;
      const c = t < 0.35 ? inside.clone().lerp(middle, t / 0.35) : middle.clone().lerp(outside, (t - 0.35) / 0.65);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // round, soft particle sprite
    const sprite = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.6)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.045,
      sizeAttenuation: true,
      vertexColors: true,
      map: sprite,
      transparent: true,
      depthWrite: false,
      opacity: isDark ? 0.95 : 0.8,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const galaxy = new THREE.Points(geometry, material);
    galaxy.rotation.x = 0.35;
    galaxy.position.y = isMobile ? -2.2 : -0.6;
    scene.add(galaxy);

    // ── Far star field ──────────────────────────────────────
    const starCount = isMobile ? 600 : 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 40;
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.035,
      color: isDark ? "#c7c9ff" : "#6d6f99",
      map: sprite,
      transparent: true,
      opacity: isDark ? 0.7 : 0.45,
      depthWrite: false,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // ── Interaction ─────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let frame = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(mount);

    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduced) {
        galaxy.rotation.y = t * 0.06;
        stars.rotation.y = t * 0.01;
      }
      // ease camera toward the mouse for a parallax tilt
      camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (3.2 - mouse.y * 1.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      sprite.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [isDark]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
