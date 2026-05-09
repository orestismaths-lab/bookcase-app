import { NextResponse } from 'next/server'
import { SEED_RECOMMENDATIONS } from '@/data/recommendations'

// Today this returns static seed data.
// Future: replace with a call to a recommendation engine
// (e.g. POST /engine/recommend with userId + preferences + recent books)
export async function GET() {
  try {
    return NextResponse.json(SEED_RECOMMENDATIONS)
  } catch (err) {
    console.error('[GET /api/recommendations]', err)
    return NextResponse.json({ error: 'Failed to load recommendations' }, { status: 500 })
  }
}
