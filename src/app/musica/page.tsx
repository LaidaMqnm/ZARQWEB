import Link from "next/link";
import { TRACKS, uriToEmbedSrc } from "@/lib/tracks";

export const metadata = { title: "MÚSICA — needmoney4music" };

const ARTIST_URL = process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID
  ? `https://open.spotify.com/artist/${process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID}`
  : "https://open.spotify.com/";

export default function MusicaPage() {
  const real = TRACKS.filter((t) => !t.spotifyUri.includes("REEMPLAZA"));
  return (
    <>
      <main style={{ position: "relative", zIndex: 2, padding: "clamp(20px,3vw,48px)", maxWidth: 760, margin: "0 auto" }}>
        <Link className="underline-link" href="/">← volver</Link>
        <h1 className="wordmark" style={{ fontSize: "clamp(34px,7vw,80px)", margin: "16px 0 24px" }}>MÚSICA</h1>

        {real.length === 0 && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#555", marginBottom: 24 }}>
            Agrega tus URIs reales en <code>src/lib/tracks.ts</code> y aparecerán aquí como reproductores de Spotify.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(real.length ? real : TRACKS).map((t) => (
            <div key={t.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 13, marginBottom: 6 }}>
                <span>{t.title}</span>
                <span style={{ color: "#777" }}>{t.year}</span>
              </div>
              {!t.spotifyUri.includes("REEMPLAZA") ? (
                <iframe
                  title={t.title}
                  src={uriToEmbedSrc(t.spotifyUri)}
                  width="100%"
                  height="152"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 0, border: "2px solid var(--w95-dark)" }}
                />
              ) : (
                <div className="bevel-in" style={{ padding: 16, fontFamily: "var(--font-mono)", fontSize: 12, color: "#777" }}>
                  spotify:track pendiente
                </div>
              )}
            </div>
          ))}
        </div>

        <a className="w95-button" href={ARTIST_URL} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 28, fontWeight: 700, color: "#000" }}>
          ▶ Seguir en Spotify
        </a>
      </main>
    </>
  );
}
