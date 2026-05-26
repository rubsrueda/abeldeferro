import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abel de Ferro – Portal de libros",
  description: "Portal para la gestión de los libros del alias Abel de Ferro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
