import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAuthUserId } from '@/lib/auth-server'

const PatchBookSchema = z.object({
  title: z.string().trim().min(1).optional(),
  author: z.string().trim().min(1).optional(),
  genre: z.string().optional(),
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']).optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  notes: z.string().optional(),
  finishedAt: z.string().nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const parsed = PatchBookSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const book = await prisma.book.update({
      where: { id, userId },
      data: parsed.data,
    })
    return NextResponse.json(book)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    console.error('[PATCH /api/books/:id]', err)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.book.delete({ where: { id, userId } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    console.error('[DELETE /api/books/:id]', err)
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
  }
}
