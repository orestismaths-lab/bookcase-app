"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookplate } from "@/components/ui/Bookplate";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Divider } from "@/components/ui/Divider";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StarRating } from "@/components/shared/StarRating";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { Skeleton } from "@/components/shared/Skeleton";
import { ShelfBook } from "@/components/book/ShelfBook";
import { BookSpine } from "@/components/book/BookSpine";
import { useBooks } from "@/hooks/useBooks";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Book, ReadingStatus } from "@/types";

const STATUSES: ReadingStatus[] = ["Want to Read", "Currently Reading", "Read"];

const LABEL =
  "border border-[#a87b50] bg-[#e5c89f] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5c3523]";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { books, loading, updateBook } = useBooks();
  const { recommendations } = useRecommendations();

  function recToBook(recId: string): Book | null {
    const raw = recId.startsWith("rec-") ? recId.slice(4) : recId;
    const rec = recommendations.find((r) => r.id === raw);
    if (!rec) return null;
    return {
      id: `rec-${rec.id}`,
      userId: "anon",
      title: rec.title,
      author: rec.author,
      genre: "Recommendation",
      status: "Want to Read",
      rating: null,
      progress: 0,
      spine: rec.spine,
      tag: "Saved",
      notes: "",
      addedAt: new Date().toISOString().split("T")[0],
      finishedAt: null,
    };
  }

  const book = books.find((b) => b.id === id) ?? recToBook(id);
  const isLibraryBook = books.some((b) => b.id === id);

  const [progressInput, setProgressInput] = useState<string>(
    book ? String(book.progress) : "0"
  );
  const [editingNotes, setEditingNotes] = useState(false);

  const similarBooks = useMemo(() => {
    if (!book) return [];
    return books
      .filter((b) => b.id !== book.id && (b.genre === book.genre || b.tag === book.tag))
      .slice(0, 4);
  }, [book, books]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-28 rounded-sm" />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-72 rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-sm" />
            <Skeleton className="h-32 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="space-y-6">
        <Bookplate className="p-10 text-center">
          <Icon name="book" size={32} className="mx-auto mb-4 text-[#9b7656]" />
          <h1 className="font-serif text-2xl font-bold text-[#321d12]">Book not found</h1>
          <p className="mt-2 text-sm text-[#76563d]">This book doesn&apos;t exist in your shelf.</p>
          <Link href="/shelf" className="mt-4 inline-block">
            <Button className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]">
              Back to shelf
            </Button>
          </Link>
        </Bookplate>
      </div>
    );
  }

  const handleStatusChange = (status: ReadingStatus) => {
    const patch: Partial<Book> = { status };
    if (status === "Read") {
      patch.progress = 100;
      patch.finishedAt = new Date().toISOString().split("T")[0];
      setProgressInput("100");
    } else if (status === "Want to Read") {
      patch.progress = 0;
      patch.finishedAt = null;
      setProgressInput("0");
    }
    updateBook(id, patch);
  };

  const handleProgressSave = () => {
    const val = Math.min(100, Math.max(0, parseInt(progressInput) || 0));
    updateBook(id, { progress: val });
    setProgressInput(String(val));
  };

  return (
    <div className="space-y-6">
      <Link href="/shelf" className="inline-flex items-center gap-2 text-sm font-bold text-[#6b442b] hover:underline">
        <Icon name="chevron-left" size={16} />
        Back to shelf
      </Link>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Spine panel */}
        <div className="space-y-4">
          <div className="flex justify-center overflow-hidden border-4 border-[#5a351f] bg-[#6b442b] p-6 shadow-inner">
            <BookSpine book={book} size="lg" />
          </div>
          <Bookplate className="p-4 text-center">
            <span className={LABEL}>{book.tag}</span>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#76563d]">{book.genre}</p>
            {book.finishedAt && (
              <p className="mt-1 text-xs text-[#9b7656]">Finished {book.finishedAt}</p>
            )}
            <Divider />
            <Button
              onClick={() => router.push("/shelf")}
              className="w-full border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
              size="sm"
            >
              <Icon name="library" size={14} className="mr-1" /> View shelf
            </Button>
          </Bookplate>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          <Bookplate className="p-5">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#321d12]">{book.title}</h1>
            <p className="mt-1 text-lg text-[#76563d]">by {book.author}</p>
            <Divider />

            {/* Rating */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35]">Your rating</p>
              <StarRating
                value={book.rating}
                onRate={isLibraryBook ? (r) => updateBook(id, { rating: r }) : undefined}
                readonly={!isLibraryBook}
                size={22}
              />
              {!isLibraryBook && (
                <p className="mt-1 text-xs italic text-[#9b7656]">Add this book to your shelf to rate it.</p>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35]">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={!isLibraryBook}
                    className={`min-h-[44px] border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523] disabled:opacity-50 ${
                      book.status === s
                        ? "border-[#3b2317] bg-[#5c3523] text-[#f8e8ca]"
                        : "border-[#a87b50] bg-[#e5c89f] text-[#5c3523] hover:bg-[#d9b982] disabled:hover:bg-[#e5c89f]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            {book.status === "Currently Reading" && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8d5b35]">Progress</p>
                <ReadingProgress progress={book.progress} />
                {isLibraryBook && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={progressInput}
                      onChange={(e) => setProgressInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleProgressSave()}
                      className="h-9 w-20 border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none focus:ring-2 focus:ring-[#5c3523]"
                    />
                    <span className="text-sm text-[#76563d]">%</span>
                    <Button
                      size="sm"
                      onClick={handleProgressSave}
                      className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Bookplate>

          {/* Notes */}
          <Bookplate className="p-5">
            <SectionTitle
              title="Margin notes"
              action={
                isLibraryBook && !editingNotes ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingNotes(true)}>
                    <Icon name="edit" size={13} className="mr-1" />
                    {book.notes ? "Edit" : "Add note"}
                  </Button>
                ) : undefined
              }
            />
            {editingNotes ? (
              <NoteEditor
                initial={book.notes}
                onSave={(notes) => { updateBook(id, { notes }); setEditingNotes(false); }}
                onCancel={() => setEditingNotes(false)}
              />
            ) : book.notes ? (
              <div className="border-l-4 border-[#8a5a32] bg-[#ead6b8]/65 p-4">
                <p className="text-sm italic leading-7 text-[#76563d]">{book.notes}</p>
              </div>
            ) : (
              <p className="text-sm italic text-[#9b7656]">
                {isLibraryBook
                  ? "No notes yet. Add your thoughts, quotes, or impressions."
                  : "Save this book to your shelf to add notes."}
              </p>
            )}
          </Bookplate>

          {similarBooks.length > 0 && (
            <Bookplate className="p-5">
              <SectionTitle eyebrow="from your shelf" title="Similar books" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {similarBooks.map((b) => <ShelfBook key={b.id} book={b} />)}
              </div>
            </Bookplate>
          )}
        </div>
      </div>
    </div>
  );
}

function NoteEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="space-y-3">
      <textarea
        className="w-full resize-none border border-[#9f7248] bg-[#f8e8ca] p-3 text-sm italic leading-7 text-[#76563d] outline-none focus:ring-2 focus:ring-[#5c3523]"
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your thoughts, quotes, or impressions…"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          onClick={() => onSave(value)}
          className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
          size="sm"
        >
          Save note
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
