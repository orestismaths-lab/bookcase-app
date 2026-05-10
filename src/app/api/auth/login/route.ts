import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const { email, password } = parsed.data
  const validEmail = process.env.APP_EMAIL
  const validPassword = process.env.APP_PASSWORD

  if (!validEmail || !validPassword) {
    return NextResponse.json({ error: 'Server not configured.' }, { status: 500 })
  }

  if (email.toLowerCase() !== validEmail.toLowerCase() || password !== validPassword) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
