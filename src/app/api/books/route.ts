import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUserId } from '@/lib/auth-server'
import { SEED_BOOKS } from '@/data/books'

const CreateBookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().min(1, 'Author is required'),
  genre: z.string().default('General'),
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']).default('Want to Read'),
  rating: z.number().min(1).max(5).nullable().default(null),
  progress: z.number().int().min(0).max(100).default(0),
  spine: z.string().min(1, 'Spine is required'),
  tag: z.string().default('Interesting'),
  notes: z.string().default(''),
  addedAt: z.string().default(() => new Date().toISOString().split('T')[0]),
  finishedAt: z.string().nullable().default(null),
})

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const books = await prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    if (books.length === 0) {
      await prisma.book.createMany({
        data: SEED_BOOKS.map((b) => ({
          id: b.id,
          userId,
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
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(seeded)
    }

    return NextResponse.json(books)
  } catch (err) {
    console.error('[GET /api/books]', err)
    return NextResponse.json({ error: 'Failed to load books' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const parsed = CreateBookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: { userId, ...parsed.data },
    })
    return NextResponse.json(book, { status: 201 })
  } catch (err) {
    console.error('[POST /api/books]', err)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
