import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contacts: { include: { contact: true } } }
    })
    return NextResponse.json(campaigns)
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        subject: body.subject,
        htmlBody: body.htmlBody,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        templateId: body.templateId || null,
        status: body.scheduledAt ? 'scheduled' : 'draft'
      }
    })
    if (body.contactIds?.length) {
      await prisma.campaignContact.createMany({
        data: body.contactIds.map((cid: string) => ({ campaignId: campaign.id, contactId: cid }))
      })
    }
    return NextResponse.json(campaign)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}