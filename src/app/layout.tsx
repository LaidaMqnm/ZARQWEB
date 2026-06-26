import type { Metadata, Viewport } from "next";
import "./globals.css";
import { VisitorProvider } from "@/lib/personalization";

export const metadata: Metadata = {
  title: "NEEDMONEY4MUSIC.COM",
  description:
    "David Eduardo Ramos Manríquez — artista creativo y músico independiente. Mi arte es de libre interpretación.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "NEEDMONEY4MUSIC.COM",
    description: "A por el millón. Escucha, regístrate, trasciende conmigo.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <VisitorProvider>{children}</VisitorProvider>
      </body>
    </html>
  );
}
