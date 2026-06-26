"use client";

/* ------------------------------------------------------------
   Botones de registro OAuth (Google / Spotify / Apple) vía Supabase.
   Cierran el embudo: convierten al visitante en fan registrado.
   Configura los proveedores en Supabase -> Authentication -> Providers
   y agrega <SITE_URL>/auth/callback como Redirect URL.
------------------------------------------------------------ */

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useVisitor } from "@/lib/personalization";

type Provider = "google" | "spotify" | "apple";

const LABELS: Record<Provider, string> = {
  google: "Google",
  spotify: "Spotify",
  apple: "Apple Music",
};

export default function AuthButtons() {
  const { name } = useVisitor();
  const [busy, setBusy] = useState<Provider | null>(null);

  async function signIn(provider: Provider) {
    setBusy(provider);
    try {
      const supabase = createClient();
      const site =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      // Spotify: pedimos scopes útiles para seguir/guardar.
      const scopes =
        provider === "spotify"
          ? "user-read-email user-follow-modify user-library-modify"
          : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${site}/auth/callback?next=/?welcome=1`,
          scopes,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      setBusy(null);
      alert("No se pudo iniciar sesión. ¿Configuraste el proveedor en Supabase?");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 360 }}>
      {(["spotify", "google", "apple"] as Provider[]).map((p) => (
        <button
          key={p}
          className="w95-button"
          onClick={() => signIn(p)}
          disabled={!!busy}
          style={{ padding: "12px 14px", fontWeight: 700, fontSize: 15, textAlign: "left" }}
        >
          {busy === p ? "Conectando…" : `Regístrate con ${LABELS[p]}`}
        </button>
      ))}
      <p style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)" }}>
        {name ? `${name}, ` : ""}un clic y entras a la lista. Cero spam, solo drops.
      </p>
    </div>
  );
}
