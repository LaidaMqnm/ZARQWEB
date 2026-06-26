"use client";

/* ------------------------------------------------------------
   Reproductor retro (Win98) que envuelve el EMBED OFICIAL de
   Spotify. Reproduce de verdad y cuenta como stream para todos
   (con o sin Premium). Los botones controlan el embed vía la
   IFrame API de Spotify. Recorre el catálogo de /lib/tracks.
------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import { TRACKS, DEFAULT_PLAYER_URI } from "@/lib/tracks";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
  }
}
type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: PlaybackData }) => void) => void;
};
type PlaybackData = { isPaused: boolean; isBuffering: boolean; position: number; duration: number };
type SpotifyIFrameApi = {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: SpotifyController) => void
  ) => void;
};

const HAS_REAL_TRACKS = TRACKS.some((t) => !t.spotifyUri.includes("REEMPLAZA"));

export default function RetroPlayer({ artistUrl }: { artistUrl?: string }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const [ready, setReady] = useState(false);

  const track = TRACKS[idx];
  const startUri = HAS_REAL_TRACKS ? track.spotifyUri : DEFAULT_PLAYER_URI;

  useEffect(() => {
    if (!HAS_REAL_TRACKS) return; // sin URIs reales, no cargamos el SDK
    // Inyecta el script de la IFrame API una sola vez
    const existing = document.getElementById("spotify-iframe-api");
    function init(api: SpotifyIFrameApi) {
      if (!embedRef.current) return;
      api.createController(
        embedRef.current,
        { uri: startUri, width: "100%", height: "80" },
        (controller) => {
          controllerRef.current = controller;
          setReady(true);
          controller.addListener("playback_update", (e) => {
            setPaused(e.data.isPaused);
          });
        }
      );
    }
    if (!existing) {
      window.onSpotifyIframeApiReady = init;
      const s = document.createElement("script");
      s.id = "spotify-iframe-api";
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).SpotifyIframeApi) {
      init((window as any).SpotifyIframeApi);
    } else {
      window.onSpotifyIframeApiReady = init;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go(next: number) {
    const n = (next + TRACKS.length) % TRACKS.length;
    setIdx(n);
    const c = controllerRef.current;
    if (c) {
      c.loadUri(TRACKS[n].spotifyUri);
      c.play();
    }
  }
  function toggle() {
    controllerRef.current?.togglePlay();
  }

  return (
    <div className="win" style={{ width: 280 }}>
      <div className="win__title">
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#1db954" }}>◉</span> Spotify
        </span>
        <span className="dots">
          <span className="win__btn">_</span>
          <span className="win__btn">▢</span>
          <span className="win__btn">✕</span>
        </span>
      </div>

      <div className="win__body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Pantalla / carátula -> aquí vive el embed real de Spotify */}
        <div className="bevel-in" style={{ minHeight: 150, padding: 4, position: "relative" }}>
          {HAS_REAL_TRACKS ? (
            <div ref={embedRef} style={{ width: "100%" }} />
          ) : (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: 10, color: "#333" }}>
              ♪ Conecta tus URIs de Spotify en <code>src/lib/tracks.ts</code> para que suene aquí.
            </div>
          )}
          {!ready && HAS_REAL_TRACKS && (
            <div style={{ position: "absolute", inset: 4, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
              cargando…
            </div>
          )}
        </div>

        {/* Now playing + corazón (guardar) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontFamily: "var(--font-mono)" }}>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
            {HAS_REAL_TRACKS ? `${idx + 1}. ${track.title}` : "—"}
          </span>
          <a href={artistUrl || "#"} target="_blank" rel="noreferrer" title="Guardar en Spotify" style={{ color: "#1db954" }}>
            ♥
          </a>
        </div>

        {/* Slider de progreso (decorativo) */}
        <div className="bevel-in" style={{ height: 10, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -1, width: 14, height: 12, background: "var(--w95-face)", border: "1px solid #000" }} />
        </div>

        {/* Transporte */}
        <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
          <button className="w95-button" title="Aleatorio" aria-label="Aleatorio" onClick={() => go(Math.floor(Math.random() * TRACKS.length))}>⤨</button>
          <button className="w95-button" title="Anterior" aria-label="Anterior" onClick={() => go(idx - 1)}>⏮</button>
          <button className="w95-button" title={paused ? "Reproducir" : "Pausa"} aria-label="Reproducir/Pausa" onClick={toggle} style={{ minWidth: 44 }}>
            {paused ? "▶" : "⏸"}
          </button>
          <button className="w95-button" title="Siguiente" aria-label="Siguiente" onClick={() => go(idx + 1)}>⏭</button>
          <button className="w95-button" title="Repetir" aria-label="Repetir" onClick={() => go(idx)}>⟳</button>
        </div>
      </div>
    </div>
  );
}
