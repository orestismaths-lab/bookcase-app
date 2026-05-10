"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bookplate } from "@/components/ui/Bookplate";
import { Icon, IconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { PressedFlower } from "@/components/shared/PressedFlower";
import { RecommendationCard } from "@/components/book/RecommendationCard";
import { useUser } from "@/hooks/useUser";
import { useRecommendations } from "@/hooks/useRecommendations";

// Maps preference keywords → recommendation ids they signal
const PREF_SIGNALS: Record<string, string[]> = {
  fiction:       ["r1", "r3", "r5", "r6"],
  reflective:    ["r1", "r6"],
  prose:         ["r1", "r5", "r6"],
  "old library": ["r5", "r6"],
  "café":        ["r1", "r3"],
  practical:     ["r2"],
  nonfiction:    ["r2"],
  "self":        ["r2"],
  "sci-fi":      ["r3"],
  literary:      ["r1", "r3", "r5", "r6"],
  atmospheric:   ["r3", "r5"],
  dark:          ["r5"],
  quiet:         ["r1", "r6"],
  character:     ["r1", "r4", "r5", "r6"],
  funny:         ["r4"],
  light:         ["r4"],
  classic:       ["r6"],
  sad:           ["r6"],
};

function scoreRecs(signals: string[]): Map<string, number> {
  const scores = new Map<string, number>();
  for (const [keyword, ids] of Object.entries(PREF_SIGNALS)) {
    if (signals.some((s) => s.toLowerCase().includes(keyword))) {
      for (const id of ids) scores.set(id, (scores.get(id) ?? 0) + 1);
    }
  }
  return scores;
}

const MOOD_SHELVES: Array<{ title: string; description: string; icon: IconName; filter: string }> = [
  { title: "Hidden Gems", description: "A little shelf for overlooked classics and quiet favourites.", icon: "sparkles", filter: "Favorites" },
  { title: "Café Reads", description: "Books that suit a corner table and a warm cup.", icon: "coffee", filter: "All" },
  { title: "Old Library", description: "Long, slow, serious — the kind you carry for weeks.", icon: "book", filter: "Read" },
  { title: "Flower Notes", description: "Delicate, lyrical, beautiful in a pressed-petal way.", icon: "flower", filter: "Want to Read" },
];

export default function DiscoverPage() {
  const { user } = useUser();
  const { recommendations, savedRecIds, hiddenRecIds, lessLikeRecIds, save, hide, lessLike } =
    useRecommendations();

  const preferences = useMemo(() => user?.preferences ?? [], [user?.preferences]);

  const rankedRecs = useMemo(() => {
    const scores = preferences.length > 0 ? scoreRecs(preferences) : new Map<string, number>();
    return recommendations
      .filter((r) => !hiddenRecIds.includes(r.id) && !lessLikeRecIds.includes(r.id))
      .map((r) => ({ ...r, score: scores.get(r.id) ?? 0 }))
      .sort((a, b) => b.score - a.score);
  }, [recommendations, preferences, hiddenRecIds, lessLikeRecIds]);

  const hasPreferences = preferences.length > 0;
  const topMatch = rankedRecs[0];

  return (
    <div className="space-y-6">
      <Bookplate className="relative overflow-hidden p-5">
        <PressedFlower className="right-5 top-5 rotate-12" />
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#321d12]">
          Find something for the moment
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#76563d]">
          Soft recommendations arranged like shelves in a second-hand bookshop.
        </p>

        {hasPreferences && topMatch && (
          <div className="mt-4 inline-flex items-center gap-2 border border-[#8a5a32] bg-[#d9d1a3] px-3 py-1.5">
            <Icon name="sparkles" size={13} className="text-[#3e4a2e]" />
            <span className="text-xs font-bold text-[#3e4a2e]">
              Ranked by your preferences
            </span>
          </div>
        )}

        {lessLikeRecIds.length > 0 && (
          <p className="mt-2 text-xs italic text-[#9b7656]">
            {lessLikeRecIds.length} suggestion{lessLikeRecIds.length > 1 ? "s" : ""} set aside — your taste is being noted.
          </p>
        )}
      </Bookplate>

      {rankedRecs.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {rankedRecs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              isSaved={savedRecIds.includes(rec.id)}
              isHidden={hiddenRecIds.includes(rec.id)}
              onSave={() => save(rec.id)}
              onHide={() => hide(rec.id)}
              onLessLike={() => lessLike(rec.id)}
            />
          ))}
        </div>
      ) : (
        <Bookplate className="p-10 text-center">
          <Icon name="sparkles" size={32} className="mx-auto mb-4 text-[#9b7656]" />
          <SectionTitle title="All cleared for now" />
          <p className="text-sm text-[#76563d]">
            You&apos;ve acted on every recommendation. More are on their way.
          </p>
        </Bookplate>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MOOD_SHELVES.map(({ title, description, icon, filter }) => (
          <Link
            key={title}
            href={`/shelf?filter=${encodeURIComponent(filter)}`}
            className="group block border border-[#b88d5d] bg-[#efd8b5] shadow-[0_7px_22px_rgba(50,29,18,0.12)] p-4 transition hover:border-[#7b4d2e] hover:bg-[#e5c89f]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center border border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] transition group-hover:bg-[#482819]">
              <Icon name={icon} size={18} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#321d12]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#76563d]">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
