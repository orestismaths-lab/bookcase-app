"use client";

import Link from "next/link";
import { Bookplate } from "@/components/ui/Bookplate";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { MiniEntry } from "@/components/shared/MiniEntry";
import { PressedFlower } from "@/components/shared/PressedFlower";
import { MoodSelector } from "@/components/shared/MoodSelector";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { BookSpine } from "@/components/book/BookSpine";
import { StackedBook } from "@/components/book/StackedBook";
import { RecommendationCard } from "@/components/book/RecommendationCard";
import { useBooks } from "@/hooks/useBooks";
import { useStats } from "@/hooks/useStats";
import { useUser } from "@/hooks/useUser";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const LABEL =
  "border border-[#a87b50] bg-[#e5c89f] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5c3523]";

export default function HomePage() {
  const { books } = useBooks();
  const { stats } = useStats();
  const { user } = useUser();
  const { recommendations, savedRecIds, hiddenRecIds, save, hide, lessLike } = useRecommendations();
  const [marginNote, setMarginNote] = useLocalStorage<string>(
    "bookcase_margin_note",
    "“Something thoughtful, warm, not too heavy, with beautiful writing.”"
  );
  const [editingNote, setEditingNote] = useLocalStorage<boolean>("bookcase_editing_note", false);

  const currentlyReading = books.find((b) => b.status === "Currently Reading");
  const recentBooks = books.slice(0, 5);
  const visibleRecs = recommendations
    .filter((r) => !hiddenRecIds.includes(r.id))
    .slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Hero */}
        <Bookplate className="overflow-hidden p-6">
          <PressedFlower className="right-6 top-6" />
          <div className="absolute inset-3 border border-[#b88d5d]/55" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_280px] md:items-center">
            <div>
              <div className={LABEL}>Evening entry &middot; {user?.name ?? "Reader"}</div>
              <h1 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.05] text-[#321d12] md:text-5xl">
                Find a book for tonight&apos;s mood.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#76563d]">
                A private reading ledger for books, notes, quiet recommendations and the feeling of
                an old caf&eacute; table covered with paperbacks.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(user?.preferences ?? ["cozy fiction", "old library", "café read"]).slice(0, 3).map((item) => (
                  <span key={item} className={LABEL}>{item}</span>
                ))}
              </div>
            </div>
            <div className="hidden overflow-hidden border-4 border-[#5a351f] bg-[#4a2b1b] p-4 shadow-inner md:block">
              <div className="flex h-44 items-end justify-center gap-2 overflow-hidden border border-[#a47748]/45 bg-[#6b442b] px-4 pb-3 shadow-inner">
                {books.slice(0, 6).map((book, i) => (
                  <BookSpine key={book.id} book={book} size={i === 2 ? "lg" : "md"} />
                ))}
              </div>
            </div>
          </div>
        </Bookplate>

        {/* Currently reading */}
        {currentlyReading && (
          <section>
            <SectionTitle
              eyebrow="open volume"
              title="Continue reading"
              action={<Link href="/shelf"><Button variant="ghost">View shelf</Button></Link>}
            />
            <Bookplate className="p-4">
              <div className="grid gap-4 md:grid-cols-[190px_1fr_100px] md:items-center">
                <div className="flex h-40 justify-center gap-2 overflow-hidden border-4 border-[#5a351f] bg-[#6b442b] p-3 shadow-inner">
                  <BookSpine book={currentlyReading} size="md" />
                  {books[3] && <BookSpine book={books[3]} size="sm" />}
                </div>
                <div>
                  <span className={LABEL}>Currently reading</span>
                  <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#321d12]">
                    {currentlyReading.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#76563d]">by {currentlyReading.author}</p>
                  <div className="mt-4">
                    <ReadingProgress progress={currentlyReading.progress} />
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <Link href={`/books/${currentlyReading.id}`}>
                    <Button className="border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819] w-full">
                      Update
                    </Button>
                  </Link>
                  <Link href={`/books/${currentlyReading.id}`}>
                    <Button variant="outline" className="w-full">
                      <Icon name="note" size={14} className="mr-1" /> Notes
                    </Button>
                  </Link>
                </div>
              </div>
            </Bookplate>
          </section>
        )}

        {/* Recommendations */}
        {visibleRecs.length > 0 && (
          <section>
            <SectionTitle
              eyebrow="for your mood"
              title="Suggested from the stacks"
              action={<Link href="/discover"><Button variant="ghost">See all</Button></Link>}
            />
            <div className="grid gap-3 md:grid-cols-3">
              {visibleRecs.map((rec) => (
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
          </section>
        )}

        {/* Recent pile */}
        {recentBooks.length > 0 && (
          <section>
            <SectionTitle eyebrow="recently saved" title="A small pile on the table" />
            <Bookplate className="p-4">
              <div className="space-y-2">
                {recentBooks.map((book) => <StackedBook key={book.id} book={book} />)}
              </div>
            </Bookplate>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <Bookplate className="relative overflow-hidden p-5">
          <PressedFlower className="right-4 top-4 rotate-45" />
          <SectionTitle title="Tonight's mood" />
          <MoodSelector />
        </Bookplate>

        <Bookplate className="p-5">
          <SectionTitle title="Reading ledger" />
          <div className="space-y-3">
            <MiniEntry icon="book" value={stats?.booksThisYear ?? "–"} label="books this year" />
            <MiniEntry icon="flame" value={stats?.dayStreak ?? "–"} label="days in a row" />
            <MiniEntry icon="coffee" value={stats?.cafeReads ?? "–"} label="café reads" />
          </div>
        </Bookplate>

        <Bookplate className="p-5">
          <SectionTitle title="Margin note" />
          <div className="border-l-4 border-[#8a5a32] bg-[#ead6b8]/65 p-4">
            {editingNote ? (
              <textarea
                className="w-full bg-transparent text-sm italic leading-7 text-[#76563d] outline-none resize-none"
                rows={3}
                value={marginNote}
                onChange={(e) => setMarginNote(e.target.value)}
                onBlur={() => setEditingNote(false)}
                autoFocus
              />
            ) : (
              <p className="text-sm italic leading-7 text-[#76563d]">{marginNote}</p>
            )}
          </div>
          <Button
            className="mt-3 w-full border-[#3b2317] bg-[#5c3523] text-[#f8e8ca] hover:bg-[#482819]"
            onClick={() => setEditingNote(true)}
          >
            <Icon name="note" size={15} className="mr-2" /> Edit note
          </Button>
        </Bookplate>
      </aside>
    </div>
  );
}
