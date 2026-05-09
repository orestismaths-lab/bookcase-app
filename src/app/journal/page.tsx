"use client";

import { useState } from "react";
import { Bookplate } from "@/components/ui/Bookplate";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Skeleton } from "@/components/shared/Skeleton";
import { useUser } from "@/hooks/useUser";
import { useStats } from "@/hooks/useStats";
import { useBooks } from "@/hooks/useBooks";

export default function JournalPage() {
  const { books } = useBooks();
  const { user, loading: userLoading, updateUser } = useUser();
  const { stats } = useStats();
  const [newTag, setNewTag] = useState("");

  const preferences = user?.preferences ?? [];
  const booksRead = stats?.booksThisYear ?? 0;
  const yearlyGoal = user?.yearlyGoal ?? 52;
  const goalPercent = Math.min(100, Math.round((booksRead / yearlyGoal) * 100));

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !preferences.includes(trimmed)) {
      updateUser({ preferences: [...preferences, trimmed] });
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    updateUser({ preferences: preferences.filter((p) => p !== tag) });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Profile card */}
      <Bookplate className="p-5 text-center">
        {userLoading ? (
          <div className="space-y-3">
            <Skeleton className="mx-auto h-20 w-20" />
            <Skeleton className="mx-auto h-6 w-32" />
            <Skeleton className="mx-auto h-4 w-24" />
          </div>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#3b2317] bg-[#5c3523] font-serif text-2xl font-bold text-[#f8e8ca]">
              {user!.initials}
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold text-[#321d12]">{user!.name}</h1>
            <p className="text-sm text-[#76563d]">
              curious reader &middot; {user!.totalBooks} books
            </p>
          </>
        )}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#9f7248]/70 to-transparent" />
        <div className="mt-4 space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm text-[#54341f]">
            <Icon name="book" size={14} className="text-[#70472d]" />
            <span>{booksRead} books finished this year</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#54341f]">
            <Icon name="bookmark" size={14} className="text-[#70472d]" />
            <span>{books.filter((b) => b.status === "Currently Reading").length} currently reading</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#54341f]">
            <Icon name="heart" size={14} className="text-[#70472d]" />
            <span>{books.filter((b) => b.status === "Want to Read").length} on the list</span>
          </div>
        </div>
      </Bookplate>

      <div className="space-y-4">
        {/* Reading goal */}
        <Bookplate className="p-5">
          <SectionTitle title="Reading ritual" />
          <div className="border-4 border-[#5a351f] bg-[#6b442b] p-5 text-[#f8e8ca]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-4xl font-bold">
                  {booksRead} / {yearlyGoal}
                </div>
                <div className="mt-1 text-sm opacity-75">books completed this year</div>
              </div>
              <Icon name="bookmark" size={32} />
            </div>
            <div className="mt-5 h-3 border border-[#d9bd8e]/50 bg-[#3b2317]/50">
              <div
                className="h-full bg-[#d9a85f] transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs opacity-60 uppercase tracking-[0.12em]">
              {goalPercent}% of yearly goal
            </p>
          </div>
        </Bookplate>

        {/* Reading preferences */}
        <Bookplate className="p-5">
          <SectionTitle title="Reading preferences" />
          <p className="text-sm text-[#76563d]">
            Tune the journal around the kind of atmosphere you want from a book.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {preferences.map((item) => (
              <button
                key={item}
                onClick={() => removeTag(item)}
                className="group flex min-h-[36px] items-center gap-1 border border-[#a87b50] bg-[#e5c89f] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5c3523] hover:border-[#3b2317] hover:bg-[#c9a87a] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c3523]"
                title="Click to remove"
              >
                {item}
                <Icon
                  name="x"
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition"
                />
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Add a preference tag…"
              className="h-9 flex-1 border border-[#9f7248] bg-[#f8e8ca] px-3 text-sm text-[#321d12] outline-none placeholder:text-[#8f6848] focus:ring-2 focus:ring-[#5c3523]"
            />
            <Button
              onClick={addTag}
              className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
              size="sm"
            >
              <Icon name="plus" size={14} className="mr-1" /> Add
            </Button>
          </div>
        </Bookplate>

        {/* Notes preview */}
        <Bookplate className="p-5">
          <SectionTitle title="Recent margin notes" />
          <div className="space-y-3">
            {books
              .filter((b) => b.notes.trim())
              .slice(0, 3)
              .map((b) => (
                <div key={b.id} className="border-l-4 border-[#8a5a32] bg-[#ead6b8]/65 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5c3523] mb-1">
                    {b.title}
                  </p>
                  <p className="text-sm italic leading-6 text-[#76563d] line-clamp-2">{b.notes}</p>
                </div>
              ))}
            {books.filter((b) => b.notes.trim()).length === 0 && (
              <p className="text-sm italic text-[#9b7656]">No margin notes yet. Add one from a book&apos;s detail page.</p>
            )}
          </div>
        </Bookplate>
      </div>
    </div>
  );
}
