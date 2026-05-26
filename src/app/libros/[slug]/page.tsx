import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { getBookBySlug, BOOKS } from "@/lib/books";
import BookPurchaseSection from "@/components/BookPurchaseSection";

export async function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export default async function LibroPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const book = getBookBySlug(slug);

  if (!book) notFound();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "2rem", letterSpacing: "0.1em" }}>
        <Link href="/catalogo" style={{ color: "#555", textDecoration: "none" }}>
          Catálogo
        </Link>
        {" / "}
        <span style={{ color: "#888" }}>{book.title}</span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "3rem",
          marginBottom: "3rem",
        }}
      >
        {/* Cover */}
        <div>
          <div
            style={{
              position: "relative",
              width: "260px",
              aspectRatio: "2/3",
              border: "1px solid #2a2a2a",
              overflow: "hidden",
            }}
          >
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        {/* Book details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="section-label">{book.genre}</div>
          <h1
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
              color: "#e8e0d0",
              lineHeight: 1.2,
            }}
          >
            {book.title}
          </h1>
          {book.subtitle && (
            <p style={{ color: "#888", fontSize: "0.9rem", fontStyle: "italic", lineHeight: 1.5 }}>
              {book.subtitle}
            </p>
          )}

          <div style={{ color: "#666", fontSize: "0.8rem" }}>
            por{" "}
            <Link href="/autor" style={{ color: "#c8a96e", textDecoration: "none" }}>
              {book.author}
            </Link>{" "}
            · {book.year}
          </div>

          {book.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <StarRating rating={book.rating} count={book.reviewCount} size="md" />
              <span style={{ fontSize: "0.8rem", color: "#c8a96e" }}>{book.rating}</span>
            </div>
          )}

          <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "540px" }}>
            {book.description}
          </p>

          {/* Purchase section */}
          <BookPurchaseSection book={book} referralCode={ref} />
        </div>
      </div>

      {/* Synopsis */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "2.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div className="section-label" style={{ marginBottom: "1rem" }}>
          sinopsis
        </div>
        <div style={{ maxWidth: "700px" }}>
          {book.synopsis.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                color: i === 0 ? "#c8a96e" : "#aaa",
                lineHeight: 1.9,
                fontSize: "0.9rem",
                marginBottom: "1rem",
                fontStyle: i === 0 ? "italic" : "normal",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Preview CTA */}
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          padding: "2rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: "0.5rem" }}>
            vista previa gratuita
          </div>
          <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.6 }}>
            Lee el {book.previewPercent}% inicial del libro sin necesidad de registrarte.
          </p>
        </div>
        <Link
          href={`/lector/${book.id}?preview=true`}
          className="btn-secondary"
        >
          Leer Vista Previa →
        </Link>
      </div>

      {/* Book details table */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "1rem" }}>
          detalles del libro
        </div>
        <table style={{ width: "100%", maxWidth: "400px", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Autor", book.author],
              ["Año", book.year.toString()],
              ["Género", book.genre],
              ["ISBN", book.isbn],
              ["Formato", "Digital (lectura + audio)"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td
                  style={{
                    padding: "0.6rem 1rem 0.6rem 0",
                    fontSize: "0.8rem",
                    color: "#555",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    width: "35%",
                    borderBottom: "1px solid #141414",
                  }}
                >
                  {label}
                </td>
                <td
                  style={{
                    padding: "0.6rem 0",
                    fontSize: "0.85rem",
                    color: "#aaa",
                    borderBottom: "1px solid #141414",
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 620px) {
          div[style*="grid-template-columns: 260px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 260px 1fr"] > div:first-child {
            width: 100% !important;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
