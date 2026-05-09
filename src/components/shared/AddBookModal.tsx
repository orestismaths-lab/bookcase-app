"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Divider } from "@/components/ui/Divider";
import { searchGoogleBooks, GoogleBookResult } from "@/lib/googleBooks";
import { spineForTitle } from "@/lib/spineColors";
import { Book, ReadingStatus } from "@/types";

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (book: Book) => void;
}

const STATUS_OPTIONS: ReadingStatus[] = ["Want to Read", "Currently Reading", "Read"];

function generateId(): string {
  return `book-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function tagFromGenre(genre: string): string {
  const g = genre.toLowerCase();
  if (g.includes("fiction")) return "Fiction";
  if (g.includes("history")) return "Historical";
  if (g.includes("science")) return "Scientific";
  if (g.includes("self")) return "Practical";
  if (g.includes("fantasy")) return "Fantastical";
  if (g.includes("mystery")) return "Mysterious";
  if (g.includes("biography")) return "True Story";
  return "Interesting";
}

export function AddBookModal({ onClose, onAdd }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GoogleBookResult | null>(null);
  const [status, setStatus] = useState<ReadingStatus>("Want to Read");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    try {
      const items = await searchGoogleBooks(query);
      setResults(items);
      if (items.length === 0) setError("No books found. Try a different title or author.");
    } catch {
      setError("Could not reach Google Books. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") onClose();
  };

  const handleAdd = () => {
    if (!selected) return;
    const book: Book = {
      id: generateId(),
      userId: "anon",
      title: selected.title,
      author: selected.author,
      genre: selected.genre,
      status,
      rating: null,
      progress: status === "Read" ? 100 : 0,
      spine: spineForTitle(selected.title),
      tag: tagFromGenre(selected.genre),
      notes: "",
      addedAt: new Date().toISOString().split("T")[0],
      finishedAt: status === "Read" ? new Date().toISOString().split("T")[0] : null,
    };
    onAdd(book);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#2a180e]/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a book"
        className="fixed inset-x-4 top-[8vh] z-50 mx-auto max-w-xl border-2 border-[#7b4d2e] bg-[#f1ddbd] shadow-[0_24px_64px_rgba(50,29,18,0.40)] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#9f7248] bg-[#5a351f] px-5 py-3">
          <div className="flex items-center gap-2 text-[#f8e8ca]">
            <Icon name="plus" size={18} />
            <span className="font-serif text-lg font-bold tracking-tight">Add a book</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#d9bd8e] hover:text-[#f8e8ca] transition"
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a5a32]"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by title, author, or ISBN…"
                autoFocus
                className="h-10 w-full border border-[#9f7248] bg-[#f8e8ca] pl-9 pr-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
            >
              {loading ? "Searching…" : "Search"}
            </Button>
          </div>

          <p className="mt-2 text-xs text-[#9b7656] italic">
            Powered by Google Books — searches millions of titles.
          </p>

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm text-[#8a3a2a] italic">{error}</p>
          )}

          {/* Results */}
          {results.length > 0 && !selected && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8d5b35]">
                {results.length} results — click one to select
              </p>
              {results.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelected(book)}
                  className="w-full border border-[#b88d5d] bg-[#efd8b5] p-3 text-left transition hover:bg-[#e5c89f] hover:border-[#7b4d2e]"
                >
                  <div className="flex gap-3">
                    {book.thumbnail ? (
                      <Image
                        src={book.thumbnail}
                        alt={book.title}
                        width={44}
                        height={64}
                        className="shrink-0 border border-[#9f7248] object-cover"
                      />
                    ) : (
                      <div
                        className={`h-16 w-11 shrink-0 bg-gradient-to-b ${spineForTitle(book.title)} border border-[#24150d]/55`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-serif font-bold leading-tight text-[#321d12] line-clamp-2">
                        {book.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#76563d]">{book.author}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[#9b7656]">
                        {book.genre}
                        {book.publishedDate && ` · ${book.publishedDate.slice(0, 4)}`}
                        {book.pageCount && ` · ${book.pageCount} pages`}
                      </p>
                      {book.description && (
                        <p className="mt-1 text-xs italic leading-5 text-[#76563d] line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected book — confirm & status picker */}
          {selected && (
            <div className="mt-4 space-y-4">
              <Divider />
              <div className="flex gap-3 border border-[#9f7248] bg-[#e5c89f] p-3">
                {selected.thumbnail ? (
                  <Image
                    src={selected.thumbnail}
                    alt={selected.title}
                    width={56}
                    height={80}
                    className="shrink-0 border border-[#9f7248] object-cover"
                  />
                ) : (
                  <div
                    className={`h-20 w-14 shrink-0 bg-gradient-to-b ${spineForTitle(selected.title)} border border-[#24150d]/55`}
                  />
                )}
                <div>
                  <p className="font-serif text-lg font-bold leading-tight text-[#321d12]">
                    {selected.title}
                  </p>
                  <p className="text-sm text-[#76563d]">{selected.author}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-[#9b7656]">
                    {selected.genre}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8d5b35]">
                  Add to shelf as
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                        status === s
                          ? "border-[#3b2317] bg-[#5c3523] text-[#f8e8ca]"
                          : "border-[#a87b50] bg-[#e5c89f] text-[#5c3523] hover:bg-[#d9b982]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
                >
                  <Icon name="plus" size={15} className="mr-1" />
                  Add to my shelf
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back to results
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
