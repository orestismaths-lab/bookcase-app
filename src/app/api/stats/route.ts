import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserId } from '@/lib/auth-server'

const AVG_PAGES_PER_BOOK = 300

function calcStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const days = [...new Set(dates.map((d) => d.toISOString().slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  // Allow streak to start from today or yesterday (in case user hasn't updated yet today)
  if (days[0] !== today && days[0] !== new Date(Date.now() - 864e5).toISOString().slice(0, 10)) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diff = Math.round((prev.getTime() - curr.getTime()) / 864e5)
    if (diff === 1) streak++
    else break
  }
  return streak
}

const MOOD_KEYWORDS: Record<string, string[]> = {
  Reflective:   ['literary', 'fiction', 'reflective', 'quiet', 'classic'],
  Practical:    ['nonfiction', 'practical', 'self', 'business', 'science'],
  Atmospheric:  ['thriller', 'mystery', 'atmospheric', 'horror', 'fantasy'],
  Historical:   ['historical', 'biography', 'history', 'classic'],
  Creative:     ['art', 'poetry', 'creative', 'design', 'writing'],
}

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const currentYear = new Date().getFullYear().toString()

    const [total, currentlyReading, wantToRead, booksThisYear, user, allBooks, updatedDates, finishedThisYear] = await Promise.all([
      prisma.book.count({ where: { userId } }),
      prisma.book.count({ where: { userId, status: 'Currently Reading' } }),
      prisma.book.count({ where: { userId, status: 'Want to Read' } }),
      prisma.book.count({ where: { userId, status: 'Read', finishedAt: { startsWith: currentYear } } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.book.findMany({ where: { userId }, select: { genre: true, tag: true } }),
      prisma.book.findMany({ where: { userId }, select: { updatedAt: true } }),
      prisma.book.findMany({
        where: { userId, status: 'Read', finishedAt: { startsWith: currentYear } },
        select: { finishedAt: true },
      }),
    ])

    const moodBreakdown = Object.entries(MOOD_KEYWORDS).map(([label, keywords]) => {
      const matches = allBooks.filter((b) =>
        keywords.some((kw) => b.genre.toLowerCase().includes(kw) || b.tag.toLowerCase().includes(kw))
      ).length
      const value = total > 0 ? Math.max(10, Math.round((matches / total) * 100)) : 10
      return { label, value }
    })

    const preferences: string[] = user ? (JSON.parse(user.preferences) as string[]) : []
    const adjustedMoodBreakdown = moodBreakdown.map(({ label, value }) => {
      const keywords = MOOD_KEYWORDS[label] ?? []
      const prefBoost = preferences.some((p) => keywords.some((kw) => p.toLowerCase().includes(kw))) ? 15 : 0
      return { label, value: Math.min(100, value + prefBoost) }
    })

    return NextResponse.json({
      booksThisYear,
      currentlyReading,
      wantToRead,
      totalBooks: total,
      cafeReads: user?.cafeReads ?? 0,
      dayStreak: calcStreak(updatedDates.map((b) => b.updatedAt)),
      monthlyPages: Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, '0')
        const prefix = `${currentYear}-${month}`
        return finishedThisYear.filter((b) => b.finishedAt?.startsWith(prefix)).length * AVG_PAGES_PER_BOOK
      }),
      moodBreakdown: adjustedMoodBreakdown,
    })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
