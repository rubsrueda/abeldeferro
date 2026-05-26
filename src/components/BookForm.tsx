"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, BookInput } from "@/lib/types";

interface BookFormProps {
  book?: Book;
}

const GENRES = [
  "Thriller",
  "Novela negra",
  "Drama",
  "Romance",
  "Ciencia ficción",
  "Fantasía",
  "Histórica",
  "Terror",
  "Aventura",
  "Poesía",
  "Ensayo",
  "Autobiografía",
  "Otro",
];

export default function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const isEditing = !!book;

  const [form, setForm] = useState<BookInput>({
    title: book?.title ?? "",
    genre: book?.genre ?? "",
    year: book?.year ?? new Date().getFullYear(),
    description: book?.description ?? "",
    isbn: book?.isbn ?? "",
    coverUrl: book?.coverUrl ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!form.genre.trim()) {
      setError("El género es obligatorio");
      return;
    }
    if (!form.isbn.trim()) {
      setError("El ISBN es obligatorio");
      return;
    }
    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear() + 5) {
      setError("El año no es válido");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/books/${book.id}` : "/api/books";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al guardar");
      }

      router.push("/books");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Título del libro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género <span className="text-red-500">*</span>
          </label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Selecciona un género</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año de publicación <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="2024"
            min={1900}
            max={new Date().getFullYear() + 5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="978-84-000000-0-0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de portada
          </label>
          <input
            type="url"
            name="coverUrl"
            value={form.coverUrl ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
            placeholder="Sinopsis del libro..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Añadir libro"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
