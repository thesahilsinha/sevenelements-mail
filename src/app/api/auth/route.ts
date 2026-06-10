import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (code === process.env.ACCESS_CODE) {
      const cookieStore = await cookies()
      cookieStore.set('se_auth', code, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, message: 'Invalid code' }, { status: 401 })
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('se_auth')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}