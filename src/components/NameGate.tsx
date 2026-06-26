"use client";

/* ------------------------------------------------------------
   Puerta de nombre: ventana retro que pide el nombre del visitante.
   Al enviarlo: (1) lo guarda para personalizar el sitio al instante
   y (2) lo manda a /api/subscribe como lead en Supabase.
   Aparece una sola vez (mientras no haya nombre).
------------------------------------------------------------ */

import { useEffect, useState } from "react";
import { useVisitor } from "@/lib/personalization";

export default function NameGate() {
  const { hasName, setName } = useVisitor();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (hasName) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [hasName]);

  if (!open || hasName) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = value.trim();
    if (!clean) return;
    setSending(true);
    setName(clean);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean, source: "name_gate" }),
      });
    } catch {
      // No bloqueamos la experiencia si falla la red.
    }
    setSending(false);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="¿Cómo te llamas?"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        backdropFilter: "blur(1px)",
      }}
    >
      <div className="win" style={{ width: 360, maxWidth: "92vw" }}>
        <div className="win__title">
          <span>needmoney4music.exe</span>
          <span className="dots">
            <button
              className="win__btn"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer" }}
            >
              ✕
            </button>
          </span>
        </div>
        <form className="win__body" onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, lineHeight: 1.4 }}>
            Antes de entrar… <strong>¿cómo te llamas?</strong>
            <br />
            <span style={{ fontSize: 12, color: "#444" }}>
              Para que esto sea tuyo. Tu nombre va a vivir aquí.
            </span>
          </p>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="tu nombre"
            maxLength={40}
            className="bevel-in"
            style={{
              padding: "8px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="w95-button" onClick={() => setOpen(false)}>
              Ahora no
            </button>
            <button type="submit" className="w95-button" disabled={sending} style={{ fontWeight: 700 }}>
              {sending ? "…" : "Entrar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
