"use client";

import { useEffect, useState } from "react";

/* Cuenta regresiva al próximo lanzamiento (fecha desde .env). */
export default function Countdown({ target }: { target?: string }) {
  const iso = target || process.env.NEXT_PUBLIC_NEXT_RELEASE_AT || "";
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!iso) return;
    const end = new Date(iso).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);

  if (!iso) {
    return (
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#666" }}>
        Define <code>NEXT_PUBLIC_NEXT_RELEASE_AT</code> para activar la cuenta regresiva.
      </p>
    );
  }

  const s = Math.floor((left ?? 0) / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const cell = (n: number, l: string) => (
    <div style={{ textAlign: "center" }}>
      <div className="bevel-in" style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(28px,6vw,56px)", padding: "8px 14px", minWidth: 80 }}>
        {String(n).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 11, marginTop: 4, letterSpacing: "0.1em" }}>{l}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      {cell(d, "DÍAS")}
      {cell(h, "HRS")}
      {cell(m, "MIN")}
      {cell(sec, "SEG")}
    </div>
  );
}
