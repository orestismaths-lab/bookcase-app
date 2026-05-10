import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid-token', req.url))
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=expired-token', req.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    return NextResponse.redirect(new URL('/login?verified=1', req.url))
  } catch (err) {
    console.error('[GET /api/auth/verify-email]', err)
    return NextResponse.redirect(new URL('/login?error=server', req.url))
  }
}
