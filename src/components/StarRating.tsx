interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, count, size = "md" }: StarRatingProps) {
  const fontSize = size === "sm" ? "0.85rem" : size === "lg" ? "1.25rem" : "1rem";
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
      {stars.map((s, i) => (
        <span key={i} style={{ fontSize, color: s.filled || s.half ? "#c8a96e" : "#333" }}>
          {s.filled ? "★" : s.half ? "⯨" : "☆"}
        </span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize: "0.8rem", color: "#888", marginLeft: "0.25rem" }}>
          ({count})
        </span>
      )}
    </span>
  );
}
