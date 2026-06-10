import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { getDailyCount } from '@/lib/mailer'

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contacts = await prisma.contact.count()
    const templates = await prisma.template.count()
    const recentCampaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    let totalSent = 0
    let totalOpened = 0
    try {
      const sentAgg = await prisma.campaign.aggregate({ _sum: { totalSent: true } })
      const openedAgg = await prisma.campaign.aggregate({ _sum: { totalOpened: true } })
      totalSent = sentAgg._sum.totalSent ?? 0
      totalOpened = openedAgg._sum.totalOpened ?? 0
    } catch {}

    const dailySent = await getDailyCount()

    return NextResponse.json({
      contacts,
      templates,
      totalSent,
      totalOpened,
      dailySent,
      dailyLimit: Number(process.env.DAILY_LIMIT ?? 200),
      recentCampaigns
    })
  } catch (e) {
    console.error('Dashboard error:', e)
    return NextResponse.json({
      contacts: 0,
      templates: 0,
      totalSent: 0,
      totalOpened: 0,
      dailySent: 0,
      dailyLimit: 200,
      recentCampaigns: []
    })
  }
}