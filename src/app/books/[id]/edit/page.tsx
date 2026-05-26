import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import BookForm from "@/components/BookForm";
import { getBookById } from "@/lib/store";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Editar libro
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <BookForm book={book} />
        </div>
      </main>
    </div>
  );
}
