"use client";

import { useEffect, useRef } from "react";

const MAX_ACTIVE = 12;

export default function RippleCanvas({ fillParent = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ripples = [];
    let raf = 0;
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (fillParent) {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x, y, strength = 1) => {
      if (ripples.length >= MAX_ACTIVE) ripples.shift();
      ripples.push({
        x,
        y,
        age: 0,
        life: 2.6 + strength * 0.35,
        speed: 58 + strength * 22,
        intensity: 0.09 + strength * 0.03,
      });
    };

    const pointerToCanvas = (event) => {
      if (!fillParent) {
        return { x: event.clientX, y: event.clientY };
      }
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return null;
      }
      return { x, y };
    };

    const onPointerMove = (event) => {
      const pos = pointerToCanvas(event);
      if (!pos) return;

      const now = performance.now();
      const x = pos.x;
      const y = pos.y;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist2 = dx * dx + dy * dy;

      if (now - lastSpawn < 55 && dist2 < 900) return;

      lastSpawn = now;
      lastX = x;
      lastY = y;

      const strength = Math.min(1.25, Math.sqrt(dist2) / 220 + 0.35);
      spawn(x, y, strength);
    };

    const onPointerDown = (event) => {
      const pos = pointerToCanvas(event);
      if (!pos) return;
      spawn(pos.x, pos.y, 1.35);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        const dt = 1 / 60;
        ripple.age += dt;

        if (ripple.age > ripple.life) {
          ripples.splice(i, 1);
          continue;
        }

        const progress = ripple.age / ripple.life;
        const fade = 1 - progress;
        const radius = ripple.speed * ripple.age;

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(30, 58, 138, ${ripple.intensity * fade})`;

        for (let ring = 0; ring < 3; ring += 1) {
          const ringRadius = Math.max(0, radius - ring * 14);
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);

    let resizeObserver;
    if (fillParent && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      const target = canvas.parentElement;
      if (target) resizeObserver.observe(target);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    raf = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.cancelAnimationFrame(raf);
    };
  }, [fillParent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        fillParent
          ? "pointer-events-none absolute inset-0 z-[1] h-full w-full"
          : "pointer-events-none fixed inset-0 z-[1]"
      }
    />
  );
}
