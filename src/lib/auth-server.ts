import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret')
const TOKEN_COOKIE = 'bookcase_token'
const MAX_AGE = 365 * 24 * 60 * 60 // 1 year

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('365d')
    .sign(SECRET)
}

export async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, SECRET)
    return (payload.userId as string) ?? null
  } catch {
    return null
  }
}

export function setTokenCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    path: '/',
    maxAge: MAX_AGE,
    sameSite: 'lax',
  })
  return res
}

export function clearTokenCookie(res: NextResponse): NextResponse {
  res.cookies.set(TOKEN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
