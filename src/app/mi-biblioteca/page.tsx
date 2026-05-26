import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/lib/supabase-server";
import { BOOKS } from "@/lib/books";

export default async function MiBibliotecaPage() {
  const user = await getUser();

  // If Supabase not configured, show demo state
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        mi biblioteca
      </div>
      <h1 style={{ fontSize: "1.5rem", color: "#e8e0d0", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
        Mis Libros
      </h1>
      {user && (
        <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "2rem" }}>
          {user.email}
        </p>
      )}

      {!supabaseConfigured ? (
        <div style={{ background: "#0a0a0a", border: "1px solid #2a2a1a", padding: "2rem", marginBottom: "2rem" }}>
          <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.7 }}>
            La autenticación con Supabase no está configurada.{" "}
            <Link href="https://supabase.com" style={{ color: "#c8a96e" }} target="_blank">
              Configura tu proyecto Supabase
            </Link>{" "}
            y añade las variables de entorno para activar esta función.
          </p>
        </div>
      ) : null}

      {/* Library list */}
      <LibraryList userId={user?.id} />
    </div>
  );
}

async function LibraryList({ userId }: { userId?: string }) {
  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Inicia sesión para ver tus libros comprados.
        </p>
        <Link href="/auth/login?next=/mi-biblioteca" className="btn-primary">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  // In production, query Supabase for entitlements
  // For now, show empty state with CTA
  return (
    <div>
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          padding: "3rem",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📚</div>
        <h2 style={{ color: "#e8e0d0", fontSize: "1rem", marginBottom: "0.75rem" }}>
          Tu biblioteca está vacía
        </h2>
        <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Cuando compres un libro, aparecerá aquí con acceso permanente a lectura y audio.
        </p>
        <Link href="/catalogo" className="btn-primary">
          Ver Catálogo
        </Link>
      </div>

      {/* Preview of available books */}
      <div className="section-label" style={{ marginBottom: "1rem" }}>
        disponibles en el catálogo
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {BOOKS.map((book) => (
          <Link
            key={book.id}
            href={`/libros/${book.slug}`}
            style={{
              display: "flex",
              gap: "1rem",
              background: "#111",
              border: "1px solid #1e1e1e",
              padding: "0.75rem",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.2s",
              alignItems: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c8a96e")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
          >
            <div style={{ position: "relative", width: "50px", height: "70px", flexShrink: 0, overflow: "hidden" }}>
              <Image src={book.coverUrl} alt={book.title} fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "#e8e0d0", marginBottom: "0.25rem" }}>{book.title}</div>
              <div style={{ fontSize: "0.75rem", color: "#c8a96e" }}>{book.price.toFixed(2)} €</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
