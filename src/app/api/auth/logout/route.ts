import { NextResponse } from 'next/server'
import { clearTokenCookie } from '@/lib/auth-server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  return clearTokenCookie(res)
}
