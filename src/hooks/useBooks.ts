"use client";

import { useCallback, useEffect, useState } from "react";
import { Book } from "@/types";

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, "id" | "userId">) => Promise<Book>;
  updateBook: (id: string, patch: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

function toBook(raw: Record<string, unknown>): Book {
  return {
    id: raw.id as string,
    userId: (raw.userId as string) ?? "anon",
    title: raw.title as string,
    author: raw.author as string,
    genre: raw.genre as string,
    status: raw.status as Book["status"],
    rating: raw.rating as number | null,
    progress: raw.progress as number,
    spine: raw.spine as string,
    tag: raw.tag as string,
    notes: raw.notes as string,
    addedAt: raw.addedAt as string,
    finishedAt: raw.finishedAt as string | null,
  };
}

export function useBooks(): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => setBooks(data.map(toBook)))
      .catch(() => {/* keep empty state on network error */})
      .finally(() => setLoading(false));
  }, []);

  const addBook = useCallback(async (book: Omit<Book, "id" | "userId">) => {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    const created = toBook(await res.json());
    setBooks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateBook = useCallback(async (id: string, patch: Partial<Book>) => {
    // Optimistic update so UI feels instant
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/books/${id}`, { method: "DELETE" });
  }, []);

  return { books, loading, addBook, updateBook, deleteBook };
}
