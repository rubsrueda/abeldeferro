export interface Book {
  id: string;
  title: string;
  genre: string;
  year: number;
  description: string;
  isbn: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, "id" | "createdAt" | "updatedAt">;
