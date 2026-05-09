import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ANON_USER_ID, DEFAULT_USER } from '@/lib/constants'

const PatchUserSchema = z.object({
  name: z.string().min(1).optional(),
  initials: z.string().min(1).max(3).optional(),
  yearlyGoal: z.number().int().min(1).max(365).optional(),
  preferences: z.array(z.string()).optional(),
  savedRecIds: z.array(z.string()).optional(),
  cafeReads: z.number().int().min(0).optional(),
})

async function getOrCreateUser() {
  return prisma.user.upsert({
    where: { id: ANON_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER.id,
      name: DEFAULT_USER.name,
      initials: DEFAULT_USER.initials,
      yearlyGoal: DEFAULT_USER.yearlyGoal,
      preferences: JSON.stringify(DEFAULT_USER.preferences),
      savedRecIds: JSON.stringify(DEFAULT_USER.savedRecIds),
      cafeReads: DEFAULT_USER.cafeReads,
    },
  })
}

function serializeUser(user: Awaited<ReturnType<typeof getOrCreateUser>>, totalBooks: number) {
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
    const user = await getOrCreateUser()
    const totalBooks = await prisma.book.count({ where: { userId: ANON_USER_ID } })
    return NextResponse.json(serializeUser(user, totalBooks))
  } catch (err) {
    console.error('[GET /api/user]', err)
    return NextResponse.json({ error: 'Failed to load user' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const parsed = PatchUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    await getOrCreateUser()

    const { preferences, savedRecIds, ...rest } = parsed.data
    const user = await prisma.user.update({
      where: { id: ANON_USER_ID },
      data: {
        ...rest,
        ...(preferences !== undefined && { preferences: JSON.stringify(preferences) }),
        ...(savedRecIds !== undefined && { savedRecIds: JSON.stringify(savedRecIds) }),
      },
    })

    const totalBooks = await prisma.book.count({ where: { userId: ANON_USER_ID } })
    return NextResponse.json(serializeUser(user, totalBooks))
  } catch (err) {
    console.error('[PATCH /api/user]', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
