"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onRate?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ value, onRate, readonly = false, size = 18 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const active = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(null)}
            className={`transition ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`Rate ${star} out of 5`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#7a4f2d" : "none"}
              stroke={filled ? "#7a4f2d" : "#9b7656"}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z" />
            </svg>
          </button>
        );
      })}
      {value !== null && value !== undefined && (
        <span className="ml-1 text-xs text-[#7c5a3e]">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
