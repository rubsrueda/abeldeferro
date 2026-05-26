import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        panel de administración
      </div>
      <h1 style={{ fontSize: "1.5rem", color: "#e8e0d0", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
        Dashboard
      </h1>
      <p style={{ color: "#666", fontSize: "0.8rem", marginBottom: "2.5rem" }}>
        {user.email}
      </p>

      {!supabaseConfigured && (
        <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", padding: "1rem 1.5rem", marginBottom: "2rem", fontSize: "0.85rem", color: "#c87070" }}>
          Supabase no está configurado. Las métricas en tiempo real no están disponibles.
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {[
          { label: "Usuarios registrados", value: "—", icon: "👤", desc: "Total acumulado" },
          { label: "Ventas totales", value: "—", icon: "💳", desc: "Este mes" },
          { label: "Lectores activos", value: "—", icon: "📖", desc: "Últimos 7 días" },
          { label: "Valoración media", value: "—", icon: "⭐", desc: "Todos los libros" },
          { label: "Referencias activas", value: "—", icon: "🔗", desc: "Con compra" },
          { label: "Ingresos brutos", value: "— €", icon: "📈", desc: "Este mes" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              padding: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {kpi.label}
              </span>
              <span style={{ fontSize: "1.1rem" }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: "1.75rem", color: "#c8a96e", marginBottom: "0.25rem" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#444" }}>{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Tables section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent sales */}
        <div style={{ background: "#111", border: "1px solid #1e1e1e", padding: "1.5rem" }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>
            últimas compras
          </div>
          <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
            {supabaseConfigured
              ? "No hay compras aún"
              : "Requiere configuración de Supabase"}
          </div>
        </div>

        {/* Top referrers */}
        <div style={{ background: "#111", border: "1px solid #1e1e1e", padding: "1.5rem" }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>
            top referencias
          </div>
          <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
            {supabaseConfigured
              ? "No hay referencias aún"
              : "Requiere configuración de Supabase"}
          </div>
        </div>
      </div>

      {/* Referral tool */}
      <div style={{ marginTop: "2rem", background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "1.5rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>
          generar enlace de referido
        </div>
        <GenerateReferralLink />
      </div>
    </div>
  );
}

function GenerateReferralLink() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <code
        style={{
          background: "#111",
          border: "1px solid #222",
          padding: "0.5rem 1rem",
          fontSize: "0.8rem",
          color: "#c8a96e",
          fontFamily: "monospace",
        }}
      >
        {process.env.NEXT_PUBLIC_SITE_URL || "https://abeldeferro.com"}/catalogo?ref=TU_CODIGO
      </code>
      <Link href="/admin/referidos" className="btn-secondary" style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
        Gestionar Referidos →
      </Link>
    </div>
  );
}
