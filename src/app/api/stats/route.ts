import { NextResponse } from "next/server";

/* ------------------------------------------------------------
   GET /api/stats
   Devuelve seguidores de Spotify del artista (Client Credentials)
   y el total de fans registrados. Cacheado 5 min.
------------------------------------------------------------ */

export const revalidate = 300;

async function getSpotifyFollowers(): Promise<number | null> {
  const id = process.env.NEXT_PUBLIC_SPOTIFY_ARTIST_ID;
  const cid = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !cid || !secret) return null;

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${cid}:${secret}`).toString("base64"),
      },
      body: "grant_type=client_credentials",
      next: { revalidate: 300 },
    });
    const token = (await tokenRes.json())?.access_token;
    if (!token) return null;

    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    const data = await artistRes.json();
    return data?.followers?.total ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const followers = await getSpotifyFollowers();
  return NextResponse.json({
    followers,
    goal: 1_000_000,
  });
}
