import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* ------------------------------------------------------------
   GET /auth/callback?code=...
   Intercambia el código OAuth (Google / Spotify / Apple) por una
   sesión. El trigger handle_new_user() en Supabase crea/enlaza la
   fila en `fans`. Luego redirige a la home con ?welcome=1.
------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/?welcome=1";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
