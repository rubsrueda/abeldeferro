import { notFound, redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import BookReader from "@/components/BookReader";
import { getBookBySlug, BOOKS } from "@/lib/books";
import { getUser } from "@/lib/supabase-server";
import Link from "next/link";

export async function generateStaticParams() {
  return BOOKS.map((b) => ({ bookId: b.id }));
}

export default async function LectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { bookId } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  const book = getBookBySlug(bookId);
  if (!book) notFound();

  const user = await getUser();

  // If not preview and not authenticated, redirect to login
  if (!isPreview && !user) {
    redirect(`/auth/login?next=/lector/${bookId}`);
  }

  // Read book content from file
  let rawContent = "";
  try {
    const contentPath = path.join(process.cwd(), "content", book.contentFile);
    rawContent = fs.readFileSync(contentPath, "utf-8");
  } catch {
    rawContent = "No se pudo cargar el contenido del libro.";
  }

  // Clean markdown formatting for reader
  const cleanContent = rawContent
    .replace(/#{1,6}\s+/g, "") // Remove headings
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
    .replace(/^[-*+]\s+/gm, "") // Remove list markers
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n") // Normalize whitespace
    .trim();

  // For preview, limit to previewPercent of content
  let displayContent = cleanContent;
  if (isPreview) {
    const words = cleanContent.split(/\s+/);
    const previewWords = Math.floor(words.length * (book.previewPercent / 100));
    displayContent = words.slice(0, previewWords).join(" ");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d12" }}>
      {/* Reader header */}
      <div
        style={{
          background: "#0a0a0a",
          borderBottom: "1px solid #1a1a1a",
          padding: "0.5rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: "52px",
          zIndex: 50,
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", color: "#888", letterSpacing: "0.1em" }}>
            {isPreview ? "VISTA PREVIA — " : ""}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#c8a96e" }}>{book.title}</span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {isPreview && (
            <Link href={`/libros/${book.slug}`} className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem" }}>
              Comprar libro completo
            </Link>
          )}
          <Link
            href={`/libros/${book.slug}`}
            style={{ color: "#666", fontSize: "0.75rem", textDecoration: "none", letterSpacing: "0.1em" }}
          >
            ✕ Cerrar
          </Link>
        </div>
      </div>

      <BookReader
        content={displayContent}
        bookId={bookId}
        bookTitle={book.title}
        isPreview={isPreview}
        userId={user?.id}
      />
    </div>
  );
}
