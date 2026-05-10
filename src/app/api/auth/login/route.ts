import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createToken, setTokenCookie } from '@/lib/auth-server'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in. Check your inbox.' },
        { status: 403 }
      )
    }

    const token = await createToken(user.id)
    const res = NextResponse.json({ ok: true, userId: user.id })
    return setTokenCookie(res, token)
  } catch (err) {
    console.error('[POST /api/auth/login]', err)
    return NextResponse.json({ error: 'Sign in failed. Try again.' }, { status: 500 })
  }
}
