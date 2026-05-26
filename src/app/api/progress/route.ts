import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { bookId, pagina_actual, palabra_actual, porcentaje } = await req.json();

  const { error } = await supabase
    .from("af_reading_progress")
    .upsert(
      { usuario_id: user.id, libro_id: bookId, pagina_actual, palabra_actual, porcentaje, actualizado_en: new Date().toISOString() },
      { onConflict: "usuario_id,libro_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const bookId = new URL(req.url).searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId requerido" }, { status: 400 });

  const { data } = await supabase
    .from("af_reading_progress")
    .select("*")
    .eq("usuario_id", user.id)
    .eq("libro_id", bookId)
    .single();

  return NextResponse.json({ progress: data });
}
