import Link from "next/link";
import Countdown from "@/components/Countdown";
import AuthButtons from "@/components/AuthButtons";

export const metadata = { title: "PRÓXIMO LANZAMIENTO — needmoney4music" };

export default function ProximoPage() {
  const presave = process.env.NEXT_PUBLIC_PRESAVE_URL;
  return (
    <>
      <main
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(20px,3vw,48px)",
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          textAlign: "center",
          minHeight: "calc(100vh - var(--nav-h))",
          justifyContent: "center",
        }}
      >
        <Link className="underline-link" href="/" style={{ alignSelf: "flex-start" }}>← volver</Link>

        <h1 className="wordmark" style={{ fontSize: "clamp(30px,6vw,72px)" }}>PRÓXIMO<br />LANZAMIENTO</h1>

        <Countdown />

        {presave ? (
          <a className="w95-button" href={presave} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 16, padding: "12px 18px", color: "#000" }}>
            ★ Haz PRE-SAVE ahora
          </a>
        ) : (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#666" }}>
            Define <code>NEXT_PUBLIC_PRESAVE_URL</code> para el botón de pre-save.
          </p>
        )}

        <div style={{ marginTop: 12, width: "100%", display: "grid", placeItems: "center" }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>O entra a la lista para que te avise primero:</p>
          <AuthButtons />
        </div>
      </main>
    </>
  );
}
