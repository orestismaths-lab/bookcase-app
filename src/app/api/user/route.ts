import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ANON_USER_ID, DEFAULT_USER } from '@/lib/constants'

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

export async function GET() {
  const user = await getOrCreateUser()
  const totalBooks = await prisma.book.count({ where: { userId: ANON_USER_ID } })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    initials: user.initials,
    yearlyGoal: user.yearlyGoal,
    preferences: JSON.parse(user.preferences) as string[],
    savedRecIds: JSON.parse(user.savedRecIds) as string[],
    cafeReads: user.cafeReads,
    totalBooks,
  })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as {
    name?: string
    initials?: string
    yearlyGoal?: number
    preferences?: string[]
    savedRecIds?: string[]
    cafeReads?: number
  }

  await getOrCreateUser()

  const user = await prisma.user.update({
    where: { id: ANON_USER_ID },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.initials !== undefined && { initials: body.initials }),
      ...(body.yearlyGoal !== undefined && { yearlyGoal: body.yearlyGoal }),
      ...(body.preferences !== undefined && { preferences: JSON.stringify(body.preferences) }),
      ...(body.savedRecIds !== undefined && { savedRecIds: JSON.stringify(body.savedRecIds) }),
      ...(body.cafeReads !== undefined && { cafeReads: body.cafeReads }),
    },
  })

  const totalBooks = await prisma.book.count({ where: { userId: ANON_USER_ID } })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    initials: user.initials,
    yearlyGoal: user.yearlyGoal,
    preferences: JSON.parse(user.preferences) as string[],
    savedRecIds: JSON.parse(user.savedRecIds) as string[],
    cafeReads: user.cafeReads,
    totalBooks,
  })
}
