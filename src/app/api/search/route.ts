import { NextRequest, NextResponse } from 'next/server'
import { searchGoogleBooks } from '@/lib/googleBooks'

// Simple in-memory cache to avoid hammering Google Books
const cache = new Map<string, { data: unknown; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const cacheKey = q.toLowerCase()
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  try {
    const results = await searchGoogleBooks(q)
    cache.set(cacheKey, { data: results, expiresAt: Date.now() + CACHE_TTL_MS })
    return NextResponse.json(results, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json(
      { error: 'Could not reach Google Books. Try again in a moment.' },
      { status: 502 }
    )
  }
}
