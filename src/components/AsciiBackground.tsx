"use client";

/* ------------------------------------------------------------
   Fondo ASCII vivo: terreno de glifos que parpadea y se mueve
   con parallax del mouse, más el bloque de "$" del artista a la
   derecha. Canvas 2D, ligero y con prefers-reduced-motion.
------------------------------------------------------------ */

import { useEffect, useRef } from "react";
import { MONEY_ART, RAMP } from "@/lib/ascii";

type Cell = { x: number; y: number; ch: string; base: string; alpha: number; depth: number };

const TERRAIN_GLYPHS = "$+|/\\.:;'-".split("");

export default function AsciiBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CELL = 16;
    let cells: Cell[] = [];
    let cols = 0, rows = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;

    const moneyLines = MONEY_ART.split("\n").filter((l) => l.length);

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(innerWidth * dpr);
      canvas!.height = Math.floor(innerHeight * dpr);
      canvas!.style.width = innerWidth + "px";
      canvas!.style.height = innerHeight + "px";
      cols = Math.ceil(innerWidth / CELL);
      rows = Math.ceil(innerHeight / CELL);
      cells = [];

      // Terreno procedural disperso (ondas tipo malla)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n =
            Math.sin(x * 0.18 + y * 0.05) * Math.cos(y * 0.16 - x * 0.04) +
            Math.sin((x + y) * 0.07);
          if (n > 0.55 && Math.random() > 0.55) {
            const ch = TERRAIN_GLYPHS[(Math.random() * TERRAIN_GLYPHS.length) | 0];
            cells.push({
              x, y, ch, base: ch,
              alpha: 0.12 + Math.random() * 0.18,
              depth: 0.3 + Math.random() * 0.7,
            });
          }
        }
      }

      // Bloque "$" del artista, anclado arriba-derecha
      const offX = Math.floor(cols * 0.58);
      const offY = Math.floor(rows * 0.18);
      moneyLines.forEach((line, j) => {
        for (let i = 0; i < line.length; i++) {
          if (line[i] === "$") {
            cells.push({
              x: offX + i, y: offY + j, ch: "$", base: "$",
              alpha: 0.55, depth: 0.15,
            });
          }
        }
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = `${CELL * dpr}px ${getMono()}`;
      ctx.textBaseline = "top";

      // suavizado del parallax
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      for (let k = 0; k < cells.length; k++) {
        const c = cells[k];
        // flicker: pequeño porcentaje de glifos cambian por frame
        if (!reduced && Math.random() < 0.012) {
          c.ch = c.alpha > 0.4
            ? "$"
            : TERRAIN_GLYPHS[(Math.random() * TERRAIN_GLYPHS.length) | 0];
        }
        const px = (c.x * CELL + mouse.x * c.depth * 22) * dpr;
        const py = (c.y * CELL + mouse.y * c.depth * 22) * dpr;
        ctx.fillStyle = `rgba(20,20,20,${c.alpha})`;
        ctx.fillText(c.ch, px, py);
      }
      raf = requestAnimationFrame(draw);
    }

    function getMono() {
      return "'Courier New', monospace";
    }

    function onMove(e: MouseEvent) {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    }
    function onResize() {
      build();
    }

    build();
    draw();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="ascii-canvas" aria-hidden="true" />;
}
