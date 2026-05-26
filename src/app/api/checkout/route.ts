import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase-server";
import { BOOKS } from "@/lib/books";

export async function POST(req: NextRequest) {
  try {
    const { priceId, bookId, bookTitle, referralCode } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "priceId requerido" }, { status: 400 });
    }

    const book = BOOKS.find((b) => b.id === bookId);
    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/mi-biblioteca?success=1&book=${bookId}`,
      cancel_url: `${origin}/libros/${book.slug}?cancelled=1`,
      customer_email: user?.email,
      metadata: {
        bookId,
        bookTitle,
        userId: user?.id || "",
        referralCode: referralCode || "",
      },
      allow_promotion_codes: true,
    });

    // Log the attempt
    if (user) {
      await supabase.from("af_logs").insert({
        usuario_id: user.id,
        email: user.email,
        accion: "checkout_iniciado",
        detalles: { bookId, bookTitle, referralCode },
      });
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
