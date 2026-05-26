"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${book.title}"? Esta acción no se puede deshacer.`))
      return;
    await fetch(`/api/books/${book.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="bg-amber-50 border-b border-amber-100 px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-gray-900 text-base leading-snug">
              {book.title}
            </h2>
            <p className="text-xs text-amber-700 mt-0.5">{book.genre}</p>
          </div>
          <span className="shrink-0 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">
            {book.year}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        {book.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}
        <p className="text-xs text-gray-400 font-mono mt-auto">
          ISBN: {book.isbn}
        </p>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex gap-2">
        <Link
          href={`/books/${book.id}/edit`}
          className="flex-1 text-center bg-white border border-gray-300 hover:border-amber-400 hover:text-amber-700 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          className="flex-1 bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
