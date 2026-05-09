import Link from "next/link";
import { Book } from "@/types";
import { BookSpine } from "./BookSpine";

interface StackedBookProps {
  book: Book;
}

export function StackedBook({ book }: StackedBookProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="block hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523]"
      aria-label={`${book.title} by ${book.author} — ${book.status}`}
    >
      <BookSpine book={book} horizontal />
      <div className="flex min-w-0 items-center justify-between px-1 pt-1.5 text-xs">
        <span className="truncate font-bold text-[#54341f]">{book.author}</span>
        <span className="ml-2 shrink-0 text-[#9b7656]">{book.status}</span>
      </div>
    </Link>
  );
}
