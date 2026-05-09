"use client";

import { Recommendation } from "@/types";
import { BookSpine } from "./BookSpine";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

interface RecommendationCardProps {
  rec: Recommendation;
  isSaved: boolean;
  isHidden: boolean;
  onSave: () => void;
  onHide: () => void;
  onLessLike: () => void;
}

export function RecommendationCard({
  rec,
  isSaved,
  isHidden,
  onSave,
  onHide,
  onLessLike,
}: RecommendationCardProps) {
  if (isHidden) return null;

  return (
    <div className="border border-[#b88d5d] bg-[#efd8b5] shadow-[0_7px_22px_rgba(50,29,18,0.12)] p-3">
      <div className="flex gap-3">
        <div className="border-2 border-[#5a351f] bg-[#6b442b] p-2 shrink-0">
          <BookSpine book={rec} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 inline-block border border-[#8a5a32] bg-[#d9d1a3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#3e4a2e]">
            {rec.match} match
          </div>
          <h3 className="font-serif text-base font-bold leading-tight text-[#321d12]">{rec.title}</h3>
          <p className="mt-1 text-xs text-[#76563d]">{rec.author}</p>
          <p className="mt-2 text-xs italic leading-5 text-[#76563d]">{rec.reason}</p>
        </div>
      </div>
      <Divider />
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={isSaved ? "outline" : "default"}
          onClick={onSave}
        >
          {isSaved ? "Saved ✓" : "Save to shelf"}
        </Button>
        <Button size="sm" variant="outline" onClick={onLessLike}>
          Less like this
        </Button>
        <Button size="sm" variant="ghost" onClick={onHide}>
          Not interested
        </Button>
      </div>
    </div>
  );
}
