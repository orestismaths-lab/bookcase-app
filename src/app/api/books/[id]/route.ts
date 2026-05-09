import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  try {
    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.genre !== undefined && { genre: body.genre }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.progress !== undefined && { progress: body.progress }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.finishedAt !== undefined && { finishedAt: body.finishedAt }),
      },
    })
    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.book.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }
}
