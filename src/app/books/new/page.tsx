import Navigation from "@/components/Navigation";
import BookForm from "@/components/BookForm";

export default function NewBookPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Añadir nuevo libro
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <BookForm />
        </div>
      </main>
    </div>
  );
}
