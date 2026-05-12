import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'forgot', { limit: 5, windowMs: 60 * 60 * 1000 })
  if (limited) return limited

  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/auth/forgot-password]', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
