import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/* ------------------------------------------------------------
   POST /api/subscribe
   Captura el lead de la "puerta de nombre" (nombre + email opcional).
   Usa la SERVICE ROLE en el server, así el cliente nunca toca la BD.
------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const name = (body.name || "").trim().slice(0, 40);
  const email = (body.email || "").trim().toLowerCase().slice(0, 120) || null;
  const source = (body.source || "name_gate").slice(0, 40);

  if (!name && !email) {
    return NextResponse.json({ ok: false, error: "Falta nombre o email" }, { status: 400 });
  }

  // Si Supabase no está configurado todavía, no rompemos la experiencia.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, stored: false, note: "Supabase no configurado" });
  }

  try {
    const supabase = createAdminClient();
    const payload: Record<string, unknown> = { name, source, provider: "name_gate" };
    if (email) payload.email = email;

    const query = email
      ? supabase.from("fans").upsert(payload, { onConflict: "email" })
      : supabase.from("fans").insert(payload);

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, stored: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
