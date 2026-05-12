import { NextRequest, NextResponse } from 'next/server'

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

function getKey(req: NextRequest, prefix: string): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  return `${prefix}:${ip}`
}

function cleanup() {
  const now = Date.now()
  for (const [key, win] of store.entries()) {
    if (win.resetAt < now) store.delete(key)
  }
}

export function rateLimit(
  req: NextRequest,
  prefix: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): NextResponse | null {
  cleanup()
  const key = getKey(req, prefix)
  const now = Date.now()
  const win = store.get(key)

  if (!win || win.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (win.count >= limit) {
    const retryAfter = Math.ceil((win.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  win.count++
  return null
}
