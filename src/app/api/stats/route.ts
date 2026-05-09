import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ANON_USER_ID } from '@/lib/constants'

// Placeholder monthly pages until page-count tracking is added
const PLACEHOLDER_MONTHLY_PAGES = [42, 58, 35, 72, 64, 88, 54, 76, 92, 67, 80, 96]

// Placeholder streak until reading-session tracking is added
const PLACEHOLDER_STREAK = 8

export async function GET() {
  const currentYear = new Date().getFullYear().toString()

  const [total, currentlyReading, wantToRead, booksThisYear, user] = await Promise.all([
    prisma.book.count({ where: { userId: ANON_USER_ID } }),
    prisma.book.count({ where: { userId: ANON_USER_ID, status: 'Currently Reading' } }),
    prisma.book.count({ where: { userId: ANON_USER_ID, status: 'Want to Read' } }),
    prisma.book.count({
      where: {
        userId: ANON_USER_ID,
        status: 'Read',
        finishedAt: { startsWith: currentYear },
      },
    }),
    prisma.user.findUnique({ where: { id: ANON_USER_ID } }),
  ])

  const preferences: string[] = user ? JSON.parse(user.preferences) : []

  // Derive mood breakdown from preference tags
  const moodLabels = ['Reflective', 'Practical', 'Atmospheric', 'Historical', 'Creative']
  const moodBreakdown = moodLabels.map((label) => ({
    label,
    value: preferences.some((p) => p.toLowerCase().includes(label.toLowerCase()))
      ? Math.floor(Math.random() * 30 + 60)
      : Math.floor(Math.random() * 40 + 20),
  }))

  return NextResponse.json({
    booksThisYear,
    currentlyReading,
    wantToRead,
    totalBooks: total,
    cafeReads: user?.cafeReads ?? 0,
    dayStreak: PLACEHOLDER_STREAK,
    monthlyPages: PLACEHOLDER_MONTHLY_PAGES,
    moodBreakdown,
  })
}
