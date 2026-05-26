import fs from "fs";
import path from "path";
import { Book, BookInput } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "books.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial: Book[] = [
      {
        id: "1",
        title: "El último enigma",
        genre: "Thriller",
        year: 2019,
        description:
          "Una novela de suspense ambientada en la España contemporánea, donde un detective retirado se ve envuelto en un misterio que lo llevará a descubrir oscuros secretos del pasado.",
        isbn: "978-84-123456-0-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Sombras del amanecer",
        genre: "Novela negra",
        year: 2021,
        description:
          "Un relato oscuro e hipnótico que sigue a una periodista de investigación mientras destapa una red de corrupción en una pequeña ciudad costera.",
        isbn: "978-84-123456-1-8",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "La herencia del silencio",
        genre: "Drama",
        year: 2023,
        description:
          "Una emotiva historia familiar que abarca tres generaciones y explora los secretos que se transmiten de padres a hijos, y el peso del silencio como legado.",
        isbn: "978-84-123456-2-5",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

function readBooks(): Book[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Book[];
}

function writeBooks(books: Book[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), "utf-8");
}

export function getAllBooks(): Book[] {
  return readBooks();
}

export function getBookById(id: string): Book | undefined {
  return readBooks().find((b) => b.id === id);
}

export function createBook(input: BookInput): Book {
  const books = readBooks();
  const now = new Date().toISOString();
  const book: Book = {
    ...input,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  books.push(book);
  writeBooks(books);
  return book;
}

export function updateBook(id: string, input: Partial<BookInput>): Book | null {
  const books = readBooks();
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  books[idx] = {
    ...books[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  writeBooks(books);
  return books[idx];
}

export function deleteBook(id: string): boolean {
  const books = readBooks();
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  books.splice(idx, 1);
  writeBooks(books);
  return true;
}
