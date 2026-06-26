import Link from "next/link";
import AsciiBackground from "@/components/AsciiBackground";
import GalleryFrame from "@/components/GalleryFrame";

export const metadata = { title: "GALERÍA — needmoney4music" };

// Reemplaza por tus piezas reales (pon imágenes en /public/assets/work/).
const WORKS = [
  { id: 1, title: "Dirección creativa 01" },
  { id: 2, title: "Identidad de marca" },
  { id: 3, title: "Visual / live set" },
  { id: 4, title: "Portada / single" },
];

export default function GaleriaPage() {
  return (
    <>
      <AsciiBackground />
      <main style={{ position: "relative", zIndex: 2, padding: "clamp(20px,3vw,48px)", maxWidth: 1000, margin: "0 auto" }}>
        <Link className="underline-link" href="/">← volver</Link>
        <h1 className="wordmark" style={{ fontSize: "clamp(34px,7vw,80px)", margin: "16px 0 8px" }}>GALERÍA</h1>
        <p style={{ maxWidth: 480, marginBottom: 28 }}>
          Proyectos de dirección creativa que buscan trascender. El azul es el lienzo: lo que pongas
          aquí es la obra.
        </p>

        <div style={{ display: "grid", gap: 24, justifyItems: "center", marginBottom: 40 }}>
          <GalleryFrame height={460} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
          {WORKS.map((w) => (
            <figure key={w.id} className="win" style={{ overflow: "hidden" }}>
              <div className="win__title"><span>{w.title}</span></div>
              <div
                style={{
                  aspectRatio: "4/3",
                  background:
                    "repeating-linear-gradient(45deg, #ededed 0 10px, #f7f7f7 10px 20px)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "#999",
                }}
              >
                /assets/work/{w.id}.jpg
              </div>
            </figure>
          ))}
        </div>
      </main>
    </>
  );
}
