import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ANON_USER_ID } from '@/lib/constants'
import { SEED_BOOKS } from '@/data/books'

async function ensureUser() {
  await prisma.user.upsert({
    where: { id: ANON_USER_ID },
    update: {},
    create: {
      id: ANON_USER_ID,
      name: 'Orestis',
      initials: 'OF',
      yearlyGoal: 58,
      preferences: JSON.stringify(['cozy fiction', 'literary', 'old library', 'café read']),
      savedRecIds: JSON.stringify([]),
      cafeReads: 12,
    },
  })
}

export async function GET() {
  await ensureUser()

  const books = await prisma.book.findMany({
    where: { userId: ANON_USER_ID },
    orderBy: { createdAt: 'desc' },
  })

  if (books.length === 0) {
    await prisma.book.createMany({
      data: SEED_BOOKS.map((b) => ({
        id: b.id,
        userId: ANON_USER_ID,
        title: b.title,
        author: b.author,
        genre: b.genre,
        status: b.status,
        rating: b.rating ?? null,
        progress: b.progress,
        spine: b.spine,
        tag: b.tag,
        notes: b.notes,
        addedAt: b.addedAt,
        finishedAt: b.finishedAt ?? null,
      })),
    })
    const seeded = await prisma.book.findMany({
      where: { userId: ANON_USER_ID },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(seeded)
  }

  return NextResponse.json(books)
}

export async function POST(req: NextRequest) {
  await ensureUser()

  const body = await req.json()
  const book = await prisma.book.create({
    data: {
      userId: ANON_USER_ID,
      title: body.title,
      author: body.author,
      genre: body.genre ?? 'General',
      status: body.status ?? 'Want to Read',
      rating: body.rating ?? null,
      progress: body.progress ?? 0,
      spine: body.spine,
      tag: body.tag ?? 'Interesting',
      notes: body.notes ?? '',
      addedAt: body.addedAt ?? new Date().toISOString().split('T')[0],
      finishedAt: body.finishedAt ?? null,
    },
  })
  return NextResponse.json(book, { status: 201 })
}
