import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthUserId } from '@/lib/auth-server'

const PatchUserSchema = z.object({
  name: z.string().min(1).optional(),
  initials: z.string().min(1).max(3).optional(),
  yearlyGoal: z.number().int().min(1).max(365).optional(),
  preferences: z.array(z.string()).optional(),
  savedRecIds: z.array(z.string()).optional(),
  cafeReads: z.number().int().min(0).optional(),
})

function serializeUser(
  user: { id: string; name: string; initials: string; yearlyGoal: number; preferences: string; savedRecIds: string; cafeReads: number },
  totalBooks: number
) {
  return {
    id: user.id,
    name: user.name,
    initials: user.initials,
    yearlyGoal: user.yearlyGoal,
    preferences: JSON.parse(user.preferences) as string[],
    savedRecIds: JSON.parse(user.savedRecIds) as string[],
    cafeReads: user.cafeReads,
    totalBooks,
  }
}

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const totalBooks = await prisma.book.count({ where: { userId } })
    return NextResponse.json(serializeUser(user, totalBooks))
  } catch (err) {
    console.error('[GET /api/user]', err)
    return NextResponse.json({ error: 'Failed to load user' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const parsed = PatchUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { preferences, savedRecIds, ...rest } = parsed.data
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        ...(preferences !== undefined && { preferences: JSON.stringify(preferences) }),
        ...(savedRecIds !== undefined && { savedRecIds: JSON.stringify(savedRecIds) }),
      },
    })

    const totalBooks = await prisma.book.count({ where: { userId } })
    return NextResponse.json(serializeUser(user, totalBooks))
  } catch (err) {
    console.error('[PATCH /api/user]', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
