import Link from "next/link";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function MiCuentaPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login?next=/mi-cuenta");
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        mi cuenta
      </div>
      <h1 style={{ fontSize: "1.5rem", color: "#e8e0d0", marginBottom: "2rem", letterSpacing: "0.05em" }}>
        Mi Perfil
      </h1>

      <div style={{ background: "#111", border: "1px solid #222", padding: "2rem", marginBottom: "1.5rem" }}>
        <div className="section-label" style={{ marginBottom: "1rem" }}>datos de cuenta</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Email
            </span>
            <p style={{ color: "#e8e0d0", fontSize: "0.9rem", marginTop: "0.25rem" }}>{user.email}</p>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Miembro desde
            </span>
            <p style={{ color: "#e8e0d0", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              {new Date(user.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        <Link
          href="/mi-biblioteca"
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "1.5rem",
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c8a96e")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📚</div>
          <div style={{ fontSize: "0.85rem", color: "#c8a96e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Mi Biblioteca
          </div>
          <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
            Libros comprados
          </p>
        </Link>
        <Link
          href="/catalogo"
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "1.5rem",
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c8a96e")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🛒</div>
          <div style={{ fontSize: "0.85rem", color: "#c8a96e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Catálogo
          </div>
          <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
            Comprar más libros
          </p>
        </Link>
      </div>

      <SignOutButton />
    </div>
  );
}

function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button type="submit" className="btn-danger">
        Cerrar Sesión
      </button>
    </form>
  );
}
