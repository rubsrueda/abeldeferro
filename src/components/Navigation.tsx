"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
    // supabaseConfigured is derived from env vars and never changes at runtime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1rem",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#c8a96e",
            fontFamily: "Georgia, serif",
            fontSize: "1rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Abel de Ferro
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {[
            { href: "/catalogo", label: "Libros" },
            { href: "/autor", label: "El Autor" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                color: isActive(href) ? "#c8a96e" : "#888",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
            >
              {label}
            </Link>
          ))}

          {supabaseConfigured ? (
            user ? (
              <>
                <Link
                  href="/mi-biblioteca"
                  style={{
                    textDecoration: "none",
                    color: isActive("/mi-biblioteca") ? "#c8a96e" : "#888",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Mi Biblioteca
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "transparent",
                    border: "1px solid #333",
                    color: "#888",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.75rem" }}>
                Entrar
              </Link>
            )
          ) : null}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "#c8a96e",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
          className="mobile-menu-btn"
          aria-label="Menú"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "#0a0a0a",
            borderTop: "1px solid #1a1a1a",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            { href: "/catalogo", label: "Libros" },
            { href: "/autor", label: "El Autor" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: isActive(href) ? "#c8a96e" : "#888",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </Link>
          ))}
          {supabaseConfigured && (
            user ? (
              <>
                <Link href="/mi-biblioteca" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#888", fontSize: "0.9rem" }}>
                  Mi Biblioteca
                </Link>
                <button onClick={handleSignOut} style={{ background: "transparent", border: "none", color: "#888", textAlign: "left", cursor: "pointer", fontSize: "0.9rem", fontFamily: "Georgia, serif" }}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#c8a96e", fontSize: "0.9rem" }}>
                Iniciar sesión
              </Link>
            )
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 620px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
