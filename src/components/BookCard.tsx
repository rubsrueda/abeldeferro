"use client";

import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  referralCode?: string;
}

export default function BookCard({ book, referralCode }: BookCardProps) {
  const href = referralCode
    ? `/libros/${book.slug}?ref=${referralCode}`
    : `/libros/${book.slug}`;

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#141414",
        border: "1px solid #2a2a2a",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c8a96e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
    >
      {/* Cover */}
      <div style={{ position: "relative", aspectRatio: "2/3", background: "#0a0a0a" }}>
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 620px) 50vw, 300px"
        />
      </div>

      {/* Info */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#666" }}>
          {book.genre}
        </div>
        <h3 style={{ fontSize: "0.95rem", color: "#e8e0d0", lineHeight: 1.3 }}>
          {book.title}
        </h3>
        {book.subtitle && (
          <p style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.4, fontStyle: "italic" }}>
            {book.subtitle}
          </p>
        )}
        {book.rating && (
          <StarRating rating={book.rating} count={book.reviewCount} size="sm" />
        )}
        <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "1.1rem", color: "#c8a96e" }}>
            {book.price.toFixed(2)} €
          </span>
          <span style={{ fontSize: "0.7rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Ver libro →
          </span>
        </div>
      </div>
    </Link>
  );
}
