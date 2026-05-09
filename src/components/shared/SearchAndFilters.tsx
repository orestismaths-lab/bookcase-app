"use client";

import { Icon } from "@/components/ui/Icon";
import { ReadingStatus } from "@/types";

const FILTERS: Array<ReadingStatus | "All" | "Favorites"> = [
  "All",
  "Read",
  "Currently Reading",
  "Want to Read",
  "Favorites",
];

interface SearchAndFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
}

export function SearchAndFilters({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a5a32]"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title, author, or genre…"
          className="h-11 w-full border border-[#9f7248] bg-[#f8e8ca] pl-11 pr-4 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => onFilterChange(item)}
            className={`border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
              filter === item
                ? "border-[#3b2317] bg-[#5c3523] text-[#f8e8ca]"
                : "border-[#a87b50] bg-[#e5c89f] text-[#5c3523] hover:bg-[#d9b982]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
