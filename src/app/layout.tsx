import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abel de Ferro — Libros",
  description:
    "Plataforma oficial de libros de Abel de Ferro. Ensayo, historia y psicología para lectores que buscan la verdad.",
  openGraph: {
    title: "Abel de Ferro",
    description: "Plataforma oficial de libros",
    images: ["/covers/abel-de-ferro.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        <main style={{ minHeight: "calc(100vh - 52px)" }}>{children}</main>
        <footer
          style={{
            background: "#0a0a0a",
            borderTop: "1px solid #1a1a1a",
            padding: "2rem 1rem",
            textAlign: "center",
            color: "#444",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          © {new Date().getFullYear()} Abel de Ferro — Todos los derechos reservados
        </footer>
      </body>
    </html>
  );
}
