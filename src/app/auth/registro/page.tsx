"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/mi-biblioteca";
  const ref = searchParams.get("ref") || "";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) {
      setError("La autenticación no está configurada todavía.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, referral_code: ref },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });

    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✉</div>
        <h2 style={{ color: "#c8a96e", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          ¡Casi listo!
        </h2>
        <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.7 }}>
          Hemos enviado un enlace de verificación a{" "}
          <strong style={{ color: "#e8e0d0" }}>{email}</strong>.
          Confirma tu correo para completar el registro.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input"
          placeholder="Tu nombre"
          required
        />
      </div>
      <div>
        <label style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="tu@email.com"
          required
        />
      </div>
      <div>
        <label style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
        />
      </div>

      {ref && (
        <div style={{ fontSize: "0.75rem", color: "#7ab87a", padding: "0.5rem 0.75rem", border: "1px solid #1a3a1a", background: "#0a1a0a" }}>
          ✓ Código de referido: <strong>{ref}</strong>
        </div>
      )}

      {error && (
        <p style={{ color: "#c87070", fontSize: "0.8rem" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ opacity: loading ? 0.6 : 1, marginTop: "0.5rem" }}
      >
        {loading ? "..." : "Crear cuenta"}
      </button>

      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1rem", textAlign: "center" }}>
        <span style={{ color: "#666", fontSize: "0.8rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href={`/auth/login?next=${next}`} style={{ color: "#c8a96e", textDecoration: "none" }}>
            Iniciar sesión
          </Link>
        </span>
      </div>
    </form>
  );
}

export default function RegistroPage() {
  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "0 1.5rem" }}>
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        registro
      </div>
      <h1 style={{ fontSize: "1.4rem", color: "#e8e0d0", marginBottom: "2rem", letterSpacing: "0.05em" }}>
        Crear Cuenta
      </h1>
      <div style={{ background: "#111", border: "1px solid #222", padding: "2rem" }}>
        <Suspense fallback={<div style={{ color: "#888" }}>Cargando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
