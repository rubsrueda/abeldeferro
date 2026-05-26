import Link from "next/link";
import Image from "next/image";
import BookCard from "@/components/BookCard";
import { BOOKS } from "@/lib/books";

export default function HomePage() {
  return (
    <div style={{ background: "#0f0f0f" }}>
      {/* Hero */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "4rem 1.5rem 3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Left: Author */}
        <div>
          <div className="section-label" style={{ marginBottom: "1.5rem" }}>
            escritor · pensador · historiador
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#c8a96e",
              letterSpacing: "0.05em",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Abel de Ferro
          </h1>
          <p
            style={{
              color: "#aaa",
              lineHeight: 1.8,
              marginBottom: "2rem",
              fontSize: "0.95rem",
              maxWidth: "440px",
            }}
          >
            Obras que desafían la narrativa oficial. Ensayo histórico, psicología
            aplicada y pensamiento crítico para quienes se atreven a mirar la
            realidad sin filtros.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalogo" className="btn-primary">
              Ver Libros
            </Link>
            <Link href="/autor" className="btn-secondary">
              El Autor
            </Link>
          </div>
        </div>

        {/* Right: Author photo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "260px",
              height: "320px",
              position: "relative",
              border: "1px solid #2a2a2a",
              overflow: "hidden",
            }}
          >
            <Image
              src="/covers/abel-de-ferro.png"
              alt="Abel de Ferro"
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Separator */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      />

      {/* Books Section */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <div className="section-label" style={{ marginBottom: "0.5rem" }}>
          catálogo
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            color: "#e8e0d0",
            letterSpacing: "0.05em",
            marginBottom: "2rem",
          }}
        >
          Obras Publicadas
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/catalogo" className="btn-secondary">
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      {/* Why section */}
      <section
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center", marginBottom: "2rem" }}>
            por qué leer a Abel de Ferro
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "📚",
                title: "Rigor Documental",
                text: "Cada afirmación respaldada por fuentes primarias y archivo histórico contrastado.",
              },
              {
                icon: "🔍",
                title: "Pensamiento Propio",
                text: "Sin dogmas ni ideologías. Solo análisis crítico al servicio de la verdad.",
              },
              {
                icon: "📖",
                title: "Lectura + Audio",
                text: "Accede a tus libros para leer o escuchar desde cualquier dispositivo, en cualquier momento.",
              },
              {
                icon: "🔐",
                title: "Acceso Permanente",
                text: "Una compra, acceso de por vida. Tu biblioteca viaja contigo.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #1e1e1e",
                  background: "#0f0f0f",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                  {item.icon}
                </div>
                <h3
                  style={{
                    color: "#c8a96e",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#666",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          comienza tu lectura hoy
        </p>
        <h2
          style={{
            color: "#e8e0d0",
            fontSize: "1.5rem",
            marginBottom: "2rem",
            maxWidth: "500px",
            margin: "0 auto 2rem",
            lineHeight: 1.4,
          }}
        >
          Dos obras que cambian la manera en que entiendes el mundo
        </h2>
        <Link href="/catalogo" className="btn-primary" style={{ fontSize: "0.85rem" }}>
          Explorar el Catálogo →
        </Link>
      </section>

      {/* Mobile optimization */}
      <style>{`
        @media (max-width: 620px) {
          section:first-of-type {
            grid-template-columns: 1fr !important;
            padding: 2rem 1rem 1.5rem !important;
          }
          section:first-of-type > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
