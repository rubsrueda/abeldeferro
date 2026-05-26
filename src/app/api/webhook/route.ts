import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { bookId, userId, referralCode } = session.metadata ?? {};

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      }
    );

    // Register purchase
    await supabase.from("af_compras").insert({
      usuario_id: userId || null,
      email: session.customer_email || "",
      producto: bookId,
      stripe_payment_id: session.payment_intent as string,
      monto: (session.amount_total ?? 0) / 100,
      moneda: session.currency?.toUpperCase() || "EUR",
      exito: true,
      metadata: { referralCode, session_id: session.id },
    });

    // Grant entitlement
    if (userId) {
      await supabase.from("af_entitlements").upsert(
        { usuario_id: userId, producto: bookId, activo: true },
        { onConflict: "usuario_id,producto" }
      );

      // Log referral conversion
      if (referralCode) {
        await supabase.from("af_logs").insert({
          usuario_id: userId,
          accion: "referral_convertido",
          detalles: { referralCode, bookId },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
