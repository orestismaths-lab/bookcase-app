interface SpineBook {
  title: string;
  spine: string;
}

type SpineSize = "xs" | "sm" | "md" | "lg";

interface BookSpineProps {
  book: SpineBook;
  size?: SpineSize;
  horizontal?: boolean;
}

// All widths/heights are standard Tailwind values
const sizes: Record<SpineSize, string> = {
  xs: "h-20 w-8",
  sm: "h-28 w-10",
  md: "h-36 w-12",
  lg: "h-44 w-14",
};

export function BookSpine({ book, size = "md", horizontal = false }: BookSpineProps) {
  if (horizontal) {
    return (
      <div className="relative h-12 w-full overflow-hidden border border-[#3b2317]/50 bg-[#d8b57d] shadow-[0_4px_8px_rgba(50,29,18,0.18)]">
        <div className={`absolute inset-y-0 left-0 right-8 bg-gradient-to-r ${book.spine}`} />
        <div className="absolute inset-y-0 right-0 w-8 bg-[#e8c894] shadow-[-6px_0_12px_rgba(43,25,15,0.20)_inset]" />
        <div className="absolute left-3 right-11 top-2 h-px bg-[#fff1cf]/40" />
        <div className="absolute bottom-2 left-3 right-11 h-px bg-[#2a180e]/30" />
        <div className="absolute left-4 right-12 top-1/2 -translate-y-1/2">
          <p className="truncate font-serif text-xs font-bold text-[#fff1cf] drop-shadow">
            {book.title}
          </p>
        </div>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#6b442b]/60" aria-hidden="true">
          ✦
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-[#24150d]/55 bg-gradient-to-b ${book.spine} ${sizes[size]} shadow-[0_8px_16px_rgba(50,29,18,0.24)]`}
    >
      {/* Light/shadow sheen */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,232,190,0.22),transparent_18%,rgba(0,0,0,0.14)_82%,rgba(255,232,190,0.08)_100%)]" aria-hidden="true" />
      {/* Edge lines */}
      <div className="absolute inset-y-0 left-0.5 w-px bg-[#fff1cf]/30" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0.5 w-px bg-[#2a180e]/30" aria-hidden="true" />
      {/* Decorative ornaments */}
      <div className="absolute left-1/2 top-2.5 -translate-x-1/2 text-[8px] text-[#f8e8ca]/70" aria-hidden="true">✦</div>
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] text-[#f8e8ca]/70" aria-hidden="true">✦</div>
      {/* Inner frame */}
      <div className="absolute bottom-8 left-1/2 top-8 w-[65%] -translate-x-1/2 border-y border-[#f8e8ca]/25" aria-hidden="true" />
      {/* Rotated title */}
      <p
        className="absolute bottom-6 left-1/2 w-24 origin-bottom-left -rotate-90 truncate font-serif text-[9px] font-bold tracking-wide text-[#fff1cf] drop-shadow"
        title={book.title}
      >
        {book.title}
      </p>
    </div>
  );
}
