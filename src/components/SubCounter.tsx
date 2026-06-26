"use client";

/* Contador de seguidores hacia "el millón". Toma datos de /api/stats
   (Spotify) y anima el número. Si no hay API, muestra un teaser. */

import { useEffect, useRef, useState } from "react";

export default function SubCounter() {
  const [value, setValue] = useState<number | null>(null);
  const [goal, setGoal] = useState(1_000_000);
  const raf = useRef(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.goal) setGoal(d.goal);
        const target = typeof d.followers === "number" ? d.followers : 0;
        // animación de 0 -> target
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.floor(target * eased));
          if (t < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      })
      .catch(() => setValue(0));
    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const pct = value != null ? Math.min(100, (value / goal) * 100) : 0;

  return (
    <div style={{ width: "100%", maxWidth: 520, fontFamily: "var(--font-mono)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span>{value != null ? value.toLocaleString("es-MX") : "—"} seguidores</span>
        <span style={{ color: "var(--money)" }}>meta {goal.toLocaleString("es-MX")}</span>
      </div>
      <div className="bevel-in" style={{ height: 18, padding: 2 }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            minWidth: pct > 0 ? 4 : 0,
            background:
              "repeating-linear-gradient(90deg, var(--money) 0 8px, #15a043 8px 10px)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
