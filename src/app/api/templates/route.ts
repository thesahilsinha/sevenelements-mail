import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(templates)
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const t = await prisma.template.create({
      data: { name: body.name, subject: body.subject, htmlBody: body.htmlBody, previewText: body.previewText ?? null }
    })
    return NextResponse.json(t)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}