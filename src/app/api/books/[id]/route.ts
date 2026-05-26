import { getBookById, updateBook, deleteBook } from "@/lib/store";
import { BookInput } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) {
    return Response.json({ error: "Libro no encontrado" }, { status: 404 });
  }
  return Response.json(book);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<BookInput>;
  const book = updateBook(id, body);
  if (!book) {
    return Response.json({ error: "Libro no encontrado" }, { status: 404 });
  }
  return Response.json(book);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = deleteBook(id);
  if (!ok) {
    return Response.json({ error: "Libro no encontrado" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
