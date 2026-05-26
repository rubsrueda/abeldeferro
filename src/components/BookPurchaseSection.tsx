"use client";

import { useState } from "react";
import Link from "next/link";
import { Book } from "@/lib/types";

interface Props {
  book: Book;
  referralCode?: string;
}

export default function BookPurchaseSection({ book, referralCode }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripeConfigured =
    !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !!book.stripePriceId;

  const handleBuy = async () => {
    if (!stripeConfigured) {
      setError("El sistema de pagos no está configurado todavía.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: book.stripePriceId,
          bookId: book.id,
          bookTitle: book.title,
          referralCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear sesión de pago");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ fontSize: "2rem", color: "#c8a96e", fontFamily: "Georgia, serif" }}>
          {book.price.toFixed(2)} €
        </span>
        <span style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em" }}>
          IVA incluido · acceso permanente
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="btn-primary"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Procesando..." : `Comprar — ${book.price.toFixed(2)} €`}
        </button>
        <Link
          href={`/lector/${book.id}?preview=true`}
          className="btn-secondary"
        >
          Vista Previa
        </Link>
      </div>

      {/* Referral code display */}
      {referralCode && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#7ab87a",
            padding: "0.5rem 0.75rem",
            border: "1px solid #1a3a1a",
            background: "#0a1a0a",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ✓ Código de referido aplicado: <strong>{referralCode}</strong>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: "#c87070", fontSize: "0.8rem" }}>{error}</p>
      )}

      {/* Includes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.25rem" }}>
        {[
          "📖 Lectura digital completa",
          "🎧 Audio sincronizado",
          "📱 Acceso móvil optimizado",
          "🔖 Progreso guardado automáticamente",
          "♾️ Acceso de por vida",
        ].map((item) => (
          <span key={item} style={{ fontSize: "0.8rem", color: "#666" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
