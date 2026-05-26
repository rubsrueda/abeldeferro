"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/mi-biblioteca";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "magic">("login");
  const [sent, setSent] = useState(false);

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) {
      setError("La autenticación no está configurada todavía.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
      });
      if (error) setError(error.message);
      else setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(next);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✉</div>
        <h2 style={{ color: "#c8a96e", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Revisa tu correo
        </h2>
        <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.7 }}>
          Te hemos enviado un enlace de acceso a <strong style={{ color: "#e8e0d0" }}>{email}</strong>.
          Haz clic en el enlace para iniciar sesión.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

      {mode === "login" && (
        <div>
          <label style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
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
        {loading ? "..." : mode === "magic" ? "Enviar enlace" : "Iniciar sesión"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "magic" : "login")}
        style={{
          background: "transparent",
          border: "none",
          color: "#666",
          fontSize: "0.8rem",
          cursor: "pointer",
          textDecoration: "underline",
          fontFamily: "Georgia, serif",
        }}
      >
        {mode === "login" ? "Iniciar sesión sin contraseña (link por email)" : "Iniciar sesión con contraseña"}
      </button>

      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1rem", textAlign: "center" }}>
        <span style={{ color: "#666", fontSize: "0.8rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href={`/auth/registro?next=${next}`} style={{ color: "#c8a96e", textDecoration: "none" }}>
            Regístrate
          </Link>
        </span>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "3rem auto",
        padding: "0 1.5rem",
      }}
    >
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        acceso
      </div>
      <h1 style={{ fontSize: "1.4rem", color: "#e8e0d0", marginBottom: "2rem", letterSpacing: "0.05em" }}>
        Iniciar Sesión
      </h1>
      <div style={{ background: "#111", border: "1px solid #222", padding: "2rem" }}>
        <Suspense fallback={<div style={{ color: "#888" }}>Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
