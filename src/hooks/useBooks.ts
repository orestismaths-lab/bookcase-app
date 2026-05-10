"use client";

import { useCallback, useEffect, useState } from "react";
import { Book } from "@/types";

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load books (${r.status})`);
        return r.json();
      })
      .then((data: Record<string, unknown>[]) => setBooks(data.map(toBook)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addBook = useCallback(async (book: Omit<Book, "id" | "userId">) => {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error ?? `Failed to add book (${res.status})`);
    }
    const created = toBook(await res.json());
    setBooks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateBook = useCallback(async (id: string, patch: Partial<Book>) => {
    let original: Book | undefined;
    setBooks((prev) => {
      original = prev.find((b) => b.id === id);
      return prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
    });
    const res = await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      if (original) {
        const snap = original;
        setBooks((prev) => prev.map((b) => (b.id === id ? snap : b)));
      }
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error ?? `Failed to update book (${res.status})`);
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    const previous = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (!res.ok && previous) {
      // Rollback
      setBooks((prev) => [...prev, previous].sort((a, b) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      ));
    }
  }, [books]);

  return { books, loading, error, addBook, updateBook, deleteBook };
}
