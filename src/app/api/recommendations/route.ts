import { NextResponse } from 'next/server'
import { SEED_RECOMMENDATIONS } from '@/data/recommendations'
import { getAuthUserId } from '@/lib/auth-server'

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json(SEED_RECOMMENDATIONS)
  } catch (err) {
    console.error('[GET /api/recommendations]', err)
    return NextResponse.json({ error: 'Failed to load recommendations' }, { status: 500 })
  }
}
