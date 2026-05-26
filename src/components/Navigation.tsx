import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-amber-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/books" className="flex items-center gap-3 group">
            <span className="text-2xl">📚</span>
            <div>
              <span className="block font-bold text-lg leading-tight group-hover:text-amber-200 transition-colors">
                Abel de Ferro
              </span>
              <span className="block text-xs text-amber-300 leading-tight">
                Portal de libros
              </span>
            </div>
          </Link>
          <Link
            href="/books/new"
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Añadir libro
          </Link>
        </div>
      </div>
    </nav>
  );
}
