"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookplate } from "@/components/ui/Bookplate";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SearchAndFilters } from "@/components/shared/SearchAndFilters";
import { ShelfBook } from "@/components/book/ShelfBook";
import { ShelfSkeleton } from "@/components/shared/Skeleton";
import { useBooks } from "@/hooks/useBooks";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function ShelfPage() {
  const { books, loading } = useBooks();
  const { savedRecBooks, loading: recsLoading } = useRecommendations();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(() => searchParams.get("filter") ?? "All");

  const filtered = useMemo(() => {
    const existingTitles = books.map((b) => b.title);
    let result = [...books, ...savedRecBooks(existingTitles)];

    if (filter === "Favorites") {
      result = result.filter((b) => b.rating !== null && b.rating >= 4);
    } else if (filter !== "All") {
      result = result.filter((b) => b.status === filter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    return result;
  }, [books, savedRecBooks, filter, query]);

  const isLoading = loading || recsLoading;

  return (
    <div className="space-y-6">
      <Bookplate className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[#321d12]">My bookshelf</h1>
            <p className="mt-1 text-sm text-[#76563d]">Browse your books like a small personal library.</p>
          </div>
          <p className="text-sm text-[#9b7656]">
            {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "book" : "books"}`}
          </p>
        </div>
        <div className="mt-4">
          <SearchAndFilters
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </Bookplate>

      {isLoading ? (
        <Bookplate className="p-5">
          <div className="overflow-hidden border-4 border-[#5a351f] bg-[#6b442b] p-4 shadow-inner">
            <ShelfSkeleton />
          </div>
        </Bookplate>
      ) : filtered.length > 0 ? (
        <Bookplate className="p-5">
          <div className="overflow-hidden border-4 border-[#5a351f] bg-[#6b442b] p-4 shadow-inner">
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5 lg:grid-cols-9">
              {filtered.map((book) => <ShelfBook key={book.id} book={book} size="sm" />)}
            </div>
          </div>
        </Bookplate>
      ) : (
        <Bookplate className="p-10 text-center">
          <Icon name="search" size={32} className="mx-auto text-[#9b7656] mb-4" />
          <SectionTitle title="Nothing here yet" />
          <p className="text-sm text-[#76563d]">
            {query
              ? `No books match "${query}". Try a different search.`
              : "No books in this section yet."}
          </p>
        </Bookplate>
      )}
    </div>
  );
}
