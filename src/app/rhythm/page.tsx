"use client";

import { Bookplate } from "@/components/ui/Bookplate";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { MiniEntry } from "@/components/shared/MiniEntry";
import { Skeleton } from "@/components/shared/Skeleton";
import { useStats } from "@/hooks/useStats";
import { MONTHS } from "@/data/readingStats";

export default function RhythmPage() {
  const { stats, loading, error } = useStats();

  const maxPages = stats ? Math.max(...stats.monthlyPages) : 1;

  if (error) {
    return (
      <Bookplate className="p-10 text-center">
        <Icon name="book" size={32} className="mx-auto mb-4 text-[#9b7656]" />
        <p className="font-serif text-lg font-bold text-[#321d12]">Couldn&apos;t load your stats</p>
        <p className="mt-1 text-sm text-[#76563d]">{error}</p>
      </Bookplate>
    );
  }

  return (
    <div className="space-y-6">
      <Bookplate className="p-5">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#321d12]">
          Reading rhythm
        </h1>
        <p className="mt-1 text-sm text-[#76563d]">Soft progress, like notes in the margin.</p>
      </Bookplate>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Bookplate className="p-4">
          {loading ? <Skeleton className="h-10 w-24" /> : (
            <MiniEntry icon="calendar" value={stats?.booksThisYear ?? 0} label="books this year" />
          )}
        </Bookplate>
        <Bookplate className="p-4">
          {loading ? <Skeleton className="h-10 w-24" /> : (
            <MiniEntry icon="flame" value={stats?.dayStreak ?? 0} label="day streak" />
          )}
        </Bookplate>
        <Bookplate className="p-4">
          {loading ? <Skeleton className="h-10 w-24" /> : (
            <MiniEntry icon="coffee" value={stats?.cafeReads ?? 0} label="café reads" />
          )}
        </Bookplate>
        <Bookplate className="p-4">
          {loading ? <Skeleton className="h-10 w-24" /> : (
            <MiniEntry icon="book" value={stats?.totalBooks ?? 0} label="total books" />
          )}
        </Bookplate>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Monthly bar chart */}
        <Bookplate className="p-5">
          <SectionTitle title="Monthly pages" />
          {loading ? (
            <Skeleton className="mt-5 h-52 w-full" />
          ) : (
            <div className="mt-5 flex h-52 items-end gap-2">
              {(stats?.monthlyPages ?? []).map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#7a4a2d] transition-all"
                    style={{ height: `${Math.round((h / maxPages) * 100)}%` }}
                    title={`${MONTHS[i]}: ${h} pages`}
                    aria-label={`${MONTHS[i]}: ${h} pages`}
                  />
                  <span className="text-[10px] text-[#7c5a3e]">{MONTHS[i].slice(0, 1)}</span>
                </div>
              ))}
            </div>
          )}
        </Bookplate>

        {/* Mood breakdown */}
        <Bookplate className="p-5">
          <SectionTitle title="Favourite moods" />
          {loading ? (
            <div className="mt-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {(stats?.moodBreakdown ?? []).map(({ label, value }) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm text-[#6f513a]">
                    <span>{label}</span>
                    <span className="font-semibold">{value}%</span>
                  </div>
                  <div className="h-3 border border-[#9f7248] bg-[#dec099]">
                    <div
                      className="h-full bg-[#5d6a43] transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Bookplate>
      </div>
    </div>
  );
}
