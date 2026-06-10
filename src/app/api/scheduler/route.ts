import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const schedulers = await prisma.scheduler.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(schedulers)
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const s = await prisma.scheduler.create({
      data: {
        name: body.name,
        subject: body.subject,
        htmlBody: body.htmlBody ?? null,
        cronExpr: body.cronExpr,
        active: body.active ?? true,
        tags: JSON.stringify(body.tags ?? [])
      }
    })
    return NextResponse.json(s)
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}