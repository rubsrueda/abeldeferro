import { getAllBooks, createBook } from "@/lib/store";
import { BookInput } from "@/lib/types";

export async function GET() {
  const books = getAllBooks();
  return Response.json(books);
}

export async function POST(request: Request) {
  const body = (await request.json()) as BookInput;

  if (!body.title || !body.genre || !body.year || !body.isbn) {
    return Response.json(
      { error: "title, genre, year e isbn son obligatorios" },
      { status: 400 }
    );
  }

  const book = createBook(body);
  return Response.json(book, { status: 201 });
}
