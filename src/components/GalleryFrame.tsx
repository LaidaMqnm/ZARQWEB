"use client";

/* Panel azul Klein enmarcado como obra de galería. Sirve de
   contenedor para un video/visualizer. Pásale una URL de video
   (mp4) o un src de embed; si no, queda el monocromo azul con CRT. */

export default function GalleryFrame({
  videoSrc,
  poster,
  height = 420,
}: {
  videoSrc?: string;
  poster?: string;
  height?: number;
}) {
  return (
    <figure
      style={{
        background: "#f4f4f2",
        padding: "clamp(18px, 4vw, 48px)",
        boxShadow: "0 30px 60px -30px rgba(0,0,0,0.35)",
        border: "1px solid #e2e2de",
        maxWidth: 560,
        width: "100%",
      }}
    >
      <div
        className="crt"
        style={{
          height,
          display: "grid",
          placeItems: "center",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            [ visualizer ]
          </span>
        )}
      </div>
    </figure>
  );
}
