import BookCard from "@/components/BookCard";
import { BOOKS } from "@/lib/books";

export default function CatalogoPage() {
  const genres = Array.from(new Set(BOOKS.map((b) => b.genre)));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <div className="section-label" style={{ marginBottom: "0.5rem" }}>
        catálogo
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          color: "#e8e0d0",
          letterSpacing: "0.05em",
          marginBottom: "0.75rem",
        }}
      >
        Todos los Libros
      </h1>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
        Obras de Abel de Ferro. Ensayo histórico, psicología y pensamiento crítico.
        Cada libro disponible en lectura digital y audio.
      </p>

      {/* Genre filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {genres.map((g) => (
          <span
            key={g}
            style={{
              border: "1px solid #2a2a2a",
              padding: "0.3rem 0.75rem",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            {g}
          </span>
        ))}
      </div>

      {/* Books grid */}
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

      {/* Info */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          border: "1px solid #1a1a1a",
          background: "#0a0a0a",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.7 }}>
          Todos los libros incluyen acceso de lectura digital y audio sincronizado.
          Una compra = acceso de por vida. Si tienes un código de referido, introdúcelo
          en la página del libro para aplicar tu descuento.
        </p>
      </div>
    </div>
  );
}
