# NEEDMONEY4MUSIC.COM

Sitio-embudo para convertir oyentes en streams y fans registrados, con estética
Y2K / Win98 / ASCII. Next.js (App Router, TypeScript) + Supabase + Spotify.

> Diseño y funcionalidad listos. Tú lo subes a Vercel, conectas Supabase y pones
> tus claves de Spotify. No necesito tus llaves para entregarte el código.

---

## Cómo corre el embudo

1. **Puerta de nombre** (`NameGate`): al entrar, el visitante deja su nombre. Aparece
   al instante en el sitio (Wordmark personalizado) y se guarda como *lead* en Supabase
   vía `POST /api/subscribe`. Esta es la conexión emocional ("tu nombre vive aquí").
2. **Hero**: wordmark gigante, figura point-cloud (tu foto), reproductor retro con el
   **embed oficial de Spotify** (reproduce y cuenta como stream para todos), y etiquetas
   de navegación.
3. **A por el millón**: contador de seguidores (API de Spotify), panel azul tipo galería
   y **registro OAuth** (Google / Spotify / Apple) que cierra el embudo y crea el fan en
   Supabase mediante un trigger.
4. **Subpáginas**: `/musica`, `/galeria`, `/proximo-lanzamiento` (countdown + pre-save).

---

## Puesta en marcha (local)

```bash
npm install
cp .env.example .env.local   # rellena tus claves
npm run dev                  # http://localhost:3000
```

## Variables de entorno

Ver `.env.example`. Resumen:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase (auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Inserts del embudo (solo server) |
| `NEXT_PUBLIC_SITE_URL` | Redirects de OAuth |
| `NEXT_PUBLIC_SPOTIFY_ARTIST_ID` | Perfil + contador de seguidores |
| `NEXT_PUBLIC_SPOTIFY_PLAYER_URI` | Qué suena en el reproductor |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Conteo de seguidores (server) |
| `NEXT_PUBLIC_NEXT_RELEASE_AT` | Fecha del countdown |
| `NEXT_PUBLIC_PRESAVE_URL` | Botón de pre-save |

## Supabase

1. Crea el proyecto y copia URL + anon key + service role key al `.env.local`.
2. SQL Editor → pega y ejecuta `supabase/schema.sql` (crea `fans`, RLS, vista de conteo
   y el trigger que enlaza el usuario OAuth con su fila de fan).
3. Authentication → Providers → activa **Google**, **Spotify** y **Apple**.
4. Authentication → URL Configuration → agrega como Redirect URL:
   `https://TU-DOMINIO/auth/callback` (y `http://localhost:3000/auth/callback` para local).

## Spotify

- **Reproductor**: pon los URIs reales de tus canciones en `src/lib/tracks.ts`
  (clic derecho en la canción → Compartir → Copiar URI). El reproductor usa el embed
  oficial, así que cuenta como reproducción real para cualquiera.
- **Login con Spotify**: en tu app del Spotify Developer Dashboard agrega como Redirect URI
  la de Supabase (`https://TU-PROYECTO.supabase.co/auth/v1/callback`) y mete el Client ID/Secret
  en el provider de Supabase.
- **Apple Music**: el botón usa "Sign in with Apple" (identidad). Reproducir/streamear desde
  Apple Music requiere MusicKit aparte; por ahora sirve para captar el registro.

## Deploy a Vercel

```bash
npm i -g vercel
vercel            # primera vez: enlaza el proyecto
vercel --prod
```
En Vercel → Project → Settings → Environment Variables: pega las mismas del `.env.local`.
Actualiza `NEXT_PUBLIC_SITE_URL` y los Redirect URLs a tu dominio de producción.

---

## Tus assets

Pon tus archivos en `public/assets/` (ver `PONER-AQUI-TUS-ARCHIVOS.txt`):
`figure.png` (foto recortada), piezas de galería y, si quieres, `release.mp4` para el panel azul.

## Mapa de archivos

```
src/
  app/
    page.tsx                  Home (hero + "A por el millón")
    musica/ galeria/ proximo-lanzamiento/   Subpáginas
    api/subscribe/route.ts    Captura de leads (puerta de nombre)
    api/stats/route.ts        Seguidores de Spotify
    auth/callback/route.ts    Callback OAuth
    globals.css               Sistema de diseño (Win98 + glitch + CRT)
  components/                 AsciiBackground, PointCloudFigure, RetroPlayer,
                              NameGate, AuthButtons, SubCounter, GalleryFrame, ...
  lib/                        supabase/, tracks.ts, ascii.ts, personalization.tsx
supabase/schema.sql          Tabla fans + RLS + trigger
```

## Notas de animación (ya implementadas)

- Fondo ASCII vivo con flicker + parallax del mouse (`AsciiBackground`).
- Figura en partículas que respira y se dispersa al acercar el cursor (`PointCloudFigure`).
- Wordmark con reveal de ensamblaje; etiquetas con inversión + glitch RGB en hover.
- Panel azul con scanlines CRT; contador y countdown animados.
- Todo respeta `prefers-reduced-motion`.
