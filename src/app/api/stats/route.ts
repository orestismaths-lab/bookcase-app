import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserId } from '@/lib/auth-server'

const PLACEHOLDER_MONTHLY_PAGES = [42, 58, 35, 72, 64, 88, 54, 76, 92, 67, 80, 96]
const PLACEHOLDER_STREAK = 8

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

    const [total, currentlyReading, wantToRead, booksThisYear, user, allBooks] = await Promise.all([
      prisma.book.count({ where: { userId } }),
      prisma.book.count({ where: { userId, status: 'Currently Reading' } }),
      prisma.book.count({ where: { userId, status: 'Want to Read' } }),
      prisma.book.count({ where: { userId, status: 'Read', finishedAt: { startsWith: currentYear } } }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.book.findMany({ where: { userId }, select: { genre: true, tag: true } }),
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
      dayStreak: PLACEHOLDER_STREAK,
      monthlyPages: PLACEHOLDER_MONTHLY_PAGES,
      moodBreakdown: adjustedMoodBreakdown,
    })
  } catch (err) {
    console.error('[GET /api/stats]', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
