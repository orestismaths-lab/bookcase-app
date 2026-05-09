import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ANON_USER_ID } from '@/lib/constants'

const PatchBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
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
      where: { id, userId: ANON_USER_ID },
      data: parsed.data,
    })
    return NextResponse.json(book)
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
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
    const { id } = await params
    await prisma.book.delete({ where: { id, userId: ANON_USER_ID } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    console.error('[DELETE /api/books/:id]', err)
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
  }
}
