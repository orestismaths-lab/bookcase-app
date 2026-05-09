import Link from "next/link";
import { Book } from "@/types";
import { BookSpine } from "./BookSpine";

type SpineSize = "xs" | "sm" | "md" | "lg";

interface ShelfBookProps {
  book: Book;
  size?: SpineSize;
}

export function ShelfBook({ book, size = "sm" }: ShelfBookProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="group block text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523]"
      aria-label={`${book.title} by ${book.author}`}
    >
      <div className="mx-auto flex items-end justify-center overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <BookSpine book={book} size={size} />
      </div>
      <h3 className="mt-2 line-clamp-2 text-xs font-bold leading-tight text-[#321d12]">
        {book.title}
      </h3>
      <p className="mt-1 line-clamp-1 text-[11px] text-[#9b7656]">{book.author}</p>
    </Link>
  );
}
