import NameGate from "@/components/NameGate";
import Wordmark from "@/components/Wordmark";
import NavTag from "@/components/NavTag";
import AsciiArt from "@/components/AsciiArt";
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
      <NameGate />

      <main style={{ position: "relative", zIndex: 2 }}>
        {/* ============ HERO ============ */}
        <section
          style={{
            minHeight: "calc(100vh - var(--nav-h))",
            padding: "clamp(28px, 5vw, 64px) clamp(16px, 5vw, 48px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "clamp(18px, 2.6vw, 30px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1080,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(18px, 2.6vw, 30px)",
            }}
          >
            {/* Wordmark centrado */}
            <div style={{ width: "100%" }}>
              <Wordmark />
            </div>

            {/* Redes */}
            <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }} aria-label="Redes">
              {SOCIAL.map((s) => (
                <a key={s.label} className="underline-link" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </nav>

            {/* Arte ASCII anclado: pieza central de la pantalla */}
            <div className="ascii-col" style={{ display: "grid", placeItems: "center", width: "100%" }}>
              <AsciiArt />
            </div>

            {/* Intro */}
            <p style={{ fontSize: "clamp(14px, 1.5vw, 17px)", lineHeight: 1.55, maxWidth: 560 }}>
              Hola, soy <strong>David Eduardo Ramos Manríquez</strong>, un artista creativo y
              músico independiente. Me inspiro en las vivencias pero mi arte es de libre
              interpretación. Trabajo con proyectos de dirección creativa que busquen
              trascender conmigo.
            </p>

            <a className="underline-link" href="mailto:zarq@needmoney4music.com" style={{ fontSize: 15 }}>
              zarq@needmoney4music.com
            </a>

            {/* Navegación destacada */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <NavTag label="[PRÓXIMO LANZAMIENTO]" href="/proximo-lanzamiento" />
              <NavTag label="[GALERÍA]" href="/galeria" />
              <NavTag label="[MÚSICA]" href="/musica" />
            </div>

            {/* Reproductor */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <RetroPlayer artistUrl={ARTIST_URL} />
            </div>

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
            padding: "clamp(28px, 5vw, 72px) clamp(20px, 5vw, 80px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 860, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
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
          </div>
        </section>
      </main>
    </>
  );
}
