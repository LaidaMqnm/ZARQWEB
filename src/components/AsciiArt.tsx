/* ------------------------------------------------------------
   Arte ASCII "$" del artista (MONEY_ART). Pieza central anclada:
   se queda fija en su lugar, a tamaño mediano, y solo cobra
   movimiento cuando el cursor pasa por encima (animación CSS).
   La animación respeta prefers-reduced-motion (ver globals.css).
------------------------------------------------------------ */

import { MONEY_ART } from "@/lib/ascii";

// Quita el salto de línea inicial sin tocar la sangría del arte.
const ART = MONEY_ART.replace(/^\n/, "").replace(/\s+$/, "");

export default function AsciiArt() {
  return (
    <pre className="ascii-art" role="img" aria-label="Arte ASCII de needmoney4music">
      {ART}
    </pre>
  );
}
