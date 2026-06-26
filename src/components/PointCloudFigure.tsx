"use client";

/* ------------------------------------------------------------
   Figura "point-cloud": muestrea una foto recortada (PNG con
   fondo transparente) en partículas que respiran y se dispersan
   al acercar el cursor, reformándose al alejarlo.
   Coloca tu imagen en /public/assets/figure.png
------------------------------------------------------------ */

import { useEffect, useRef } from "react";

type P = {
  hx: number; hy: number;   // posición "home" (donde forma la figura)
  x: number; y: number;     // posición actual
  vx: number; vy: number;
  color: string;
  size: number;
};

export default function PointCloudFigure({
  src = "/assets/figure.png",
  width = 340,
  height = 560,
}: {
  src?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    let particles: P[] = [];
    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => sample();
    img.onerror = () => fallback();
    img.src = src;

    function sample() {
      // Dibuja la imagen en un canvas oculto y muestrea píxeles -> partículas
      const off = document.createElement("canvas");
      const STEP = 4; // densidad (menor = más puntos)
      const scale = Math.min(width / img.width, height / img.height);
      const w = Math.floor(img.width * scale);
      const h = Math.floor(img.height * scale);
      off.width = w; off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return fallback();
      octx.drawImage(img, 0, 0, w, h);
      const data = octx.getImageData(0, 0, w, h).data;
      const ox = (width - w) / 2;
      const oy = (height - h) / 2;

      particles = [];
      for (let y = 0; y < h; y += STEP) {
        for (let x = 0; x < w; x += STEP) {
          const i = (y * w + x) * 4;
          const a = data[i + 3];
          if (a < 60) continue; // transparente -> sin punto
          const r = data[i], g = data[i + 1], b = data[i + 2];
          particles.push({
            hx: ox + x, hy: oy + y,
            x: ox + x + (Math.random() - 0.5) * 60,
            y: oy + y + (Math.random() - 0.5) * 60,
            vx: 0, vy: 0,
            color: `rgb(${r},${g},${b})`,
            size: 1.4,
          });
        }
      }
      loop();
    }

    function fallback() {
      // Silueta procedural si aún no hay foto
      particles = [];
      for (let i = 0; i < 1600; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.random();
        const hx = width / 2 + Math.cos(a) * 70 * rr;
        const hy = height / 2 + Math.sin(a) * 200 * rr;
        particles.push({
          hx, hy, x: hx, y: hy, vx: 0, vy: 0,
          color: "#1a1a1a", size: 1.4,
        });
      }
      loop();
    }

    function loop() {
      if (!ctx) return;
      t += 0.02;
      ctx.clearRect(0, 0, width, height);
      const breathe = reduced ? 0 : Math.sin(t) * 0.6;

      for (let k = 0; k < particles.length; k++) {
        const p = particles[k];
        // respiración + retorno a home
        const tx = p.hx + breathe;
        const ty = p.hy + breathe;
        let ax = (tx - p.x) * 0.06;
        let ay = (ty - p.y) * 0.06;

        // repulsión del mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6400) {
          const f = (6400 - d2) / 6400;
          const d = Math.sqrt(d2) || 1;
          ax += (dx / d) * f * 6;
          ay += (dy / d) * f * 6;
        }

        p.vx = (p.vx + ax) * 0.82;
        p.vy = (p.vy + ay) * 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999; mouse.y = -9999;
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [src, width, height]);

  return <canvas ref={ref} aria-label="Retrato del artista" style={{ display: "block" }} />;
}
