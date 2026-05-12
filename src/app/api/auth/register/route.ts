import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const initials = name
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('')

    // If this is the first real user, migrate anon books to them
    const anonUser = await prisma.user.findFirst({ where: { id: 'anon' } })

    const newUser = await prisma.user.create({
      data: {
        name,
        initials,
        email,
        passwordHash,
        emailVerified: true,
        // Inherit anon user's reading data if this is the first registration
        ...(anonUser
          ? {
              yearlyGoal: anonUser.yearlyGoal,
              preferences: anonUser.preferences,
              savedRecIds: anonUser.savedRecIds,
              cafeReads: anonUser.cafeReads,
            }
          : {}),
      },
    })

    // Migrate anon books to this new user
    if (anonUser) {
      await prisma.book.updateMany({
        where: { userId: 'anon' },
        data: { userId: newUser.id },
      })
      // Neutralise the anon user so future registrations don't re-migrate
      await prisma.user.update({
        where: { id: 'anon' },
        data: { email: `anon-migrated@internal`, passwordHash: '' },
      })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Registration failed. Try again.' }, { status: 500 })
  }
}
