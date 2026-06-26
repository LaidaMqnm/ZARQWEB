/* ------------------------------------------------------------
   Catálogo de música. Reemplaza los `spotifyUri` por los de tus
   canciones reales (en Spotify: clic derecho en la canción ->
   Compartir -> Copiar URI de la canción => spotify:track:XXXX).
   El reproductor retro recorre esta lista con prev/next.
------------------------------------------------------------ */

export type Track = {
  id: string;
  title: string;
  spotifyUri: string;   // spotify:track:XXXXXXXXXXXXXXXXXXXXXX
  cover?: string;       // opcional: URL de carátula propia
  year?: string;
};

export const TRACKS: Track[] = [
  {
    id: "t1",
    title: "Vivencias",
    spotifyUri: "spotify:track:REEMPLAZA_1",
    year: "2026",
  },
  {
    id: "t2",
    title: "Libre Interpretación",
    spotifyUri: "spotify:track:REEMPLAZA_2",
    year: "2026",
  },
  {
    id: "t3",
    title: "Trascender",
    spotifyUri: "spotify:track:REEMPLAZA_3",
    year: "2025",
  },
];

// Playlist/álbum por defecto para el reproductor (si la defines en .env tiene prioridad).
export const DEFAULT_PLAYER_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_PLAYER_URI || TRACKS[0].spotifyUri;

/** Convierte un URI de Spotify (spotify:track:ID) a la URL del embed. */
export function uriToEmbedSrc(uri: string): string {
  const parts = uri.replace("spotify:", "").split(":"); // ["track","ID"]
  const type = parts[0] || "track";
  const id = parts[1] || "";
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=needmoney4music&theme=0`;
}
