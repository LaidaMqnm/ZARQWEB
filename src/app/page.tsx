import AsciiBackground from "@/components/AsciiBackground";
import NameGate from "@/components/NameGate";
import Wordmark from "@/components/Wordmark";
import NavTag from "@/components/NavTag";
import PointCloudFigure from "@/components/PointCloudFigure";
import RetroPlayer from "@/components/RetroPlayer";
import SubCounter from "@/components/SubCounter";
import GalleryFrame from "@/components/GalleryFrame";
import AuthButtons from "@/components/AuthButtons";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

const ARTIST_URL = process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID
  ? `https://open.spotify.com/artist/${process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID}`
  : "https://open.spotify.com/";

export default function Home() {
  return (
    <>
      <AsciiBackground />
      <NameGate />

      <main style={{ position: "relative", zIndex: 2 }}>
        {/* ============ HERO ============ */}
        <section
          style={{
            minHeight: "100vh",
            padding: "clamp(20px, 3vw, 48px)",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
        >
          <Wordmark />

          {/* Fila redes */}
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }} aria-label="Redes">
            {SOCIAL.map((s) => (
              <a key={s.label} className="underline-link" href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </nav>

          {/* Cuerpo del hero: intro | figura | reproductor */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(240px, 1fr) minmax(260px, 1.1fr) auto",
              gap: 24,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            {/* Columna izquierda: intro + tags */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 380 }}>
              <p style={{ fontSize: 16, lineHeight: 1.4, maxWidth: 360 }}>
                Hola, soy <strong>David Eduardo Ramos Manríquez</strong>, un artista creativo y
                músico independiente. Me inspiro en las vivencias pero mi arte es de libre
                interpretación. Trabajo con proyectos de dirección creativa que busquen
                trascender conmigo.
              </p>
              <a className="underline-link" href="mailto:zarq@needmoney4music.com" style={{ fontSize: 15, width: "fit-content" }}>
                zarq@needmoney4music.com
              </a>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <NavTag label="[PRÓXIMO LANZAMIENTO]" href="/proximo-lanzamiento" />
                <NavTag label="[GALERÍA]" href="/galeria" />
                <NavTag label="[MÚSICA]" href="/musica" />
              </div>
            </div>

            {/* Columna central: figura point-cloud */}
            <div style={{ display: "grid", placeItems: "center" }}>
              <PointCloudFigure />
            </div>

            {/* Columna derecha: reproductor retro */}
            <div style={{ justifySelf: "end" }}>
              <RetroPlayer artistUrl={ARTIST_URL} />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a href="#millon" className="blink" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
              ▼ baja para entrar al millón ▼
            </a>
          </div>
        </section>

        {/* ============ A POR EL MILLÓN ============ */}
        <section
          id="millon"
          style={{
            minHeight: "100vh",
            background: "rgba(255,255,255,0.92)",
            padding: "clamp(28px, 5vw, 72px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "clamp(34px, 7vw, 92px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95 }}>
            A POR EL <span style={{ fontStyle: "italic" }}>MILLÓN</span> DE SUBS
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 700, letterSpacing: "-0.01em" }}>
            ¡REGÍSTRATE CON GOOGLE, SPOTIFY O APPLE MUSIC!
          </p>

          <SubCounter />
          <GalleryFrame />
          <AuthButtons />

          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#666", maxWidth: 420 }}>
            Cuando entras a la lista, tu nombre se queda en el proyecto. Eres parte del millón.
          </p>
        </section>
      </main>
    </>
  );
}
