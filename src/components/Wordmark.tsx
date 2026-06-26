"use client";

import { useVisitor } from "@/lib/personalization";

/* Wordmark con reveal de ensamblaje. Si el visitante dio su nombre,
   aparece un saludo personalizado encima ("X, esto es para ti"). */
export default function Wordmark() {
  const { name } = useVisitor();
  return (
    <header style={{ position: "relative", zIndex: 2 }}>
      {name && (
        <p
          className="blink"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "var(--money)",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          ▸ {name}, esto es para ti
        </p>
      )}
      <h1 className="wordmark assemble">NEEDMONEY4MUSIC.COM</h1>
    </header>
  );
}
