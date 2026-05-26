import Link from "next/link";
import Navigation from "@/components/Navigation";
import BookCard from "@/components/BookCard";
import { getAllBooks } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Biblioteca</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {books.length} {books.length === 1 ? "libro" : "libros"}
            </p>
          </div>
          <Link
            href="/books/new"
            className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Añadir libro
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📚</p>
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              No hay libros todavía
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Comienza añadiendo el primer libro de Abel de Ferro.
            </p>
            <Link
              href="/books/new"
              className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Añadir primer libro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
