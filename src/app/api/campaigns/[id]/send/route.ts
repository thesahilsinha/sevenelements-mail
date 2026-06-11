import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { transporter, canSend, incrementDailyCount, buildTrackedHtml } from '@/lib/mailer'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { contacts: { include: { contact: true }, where: { status: 'pending' } } }
    })
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const pending = campaign.contacts
    if (pending.length === 0) return NextResponse.json({ error: 'No pending recipients' }, { status: 400 })

    if (!await canSend(pending.length)) {
      return NextResponse.json({ error: `Daily limit of ${process.env.DAILY_LIMIT ?? 200} reached` }, { status: 429 })
    }

    let sent = 0
    for (const cc of pending) {
      try {
        const html = buildTrackedHtml(
          campaign.htmlBody
            .replace(/{{name}}/g, cc.contact.name)
            .replace(/{{company}}/g, cc.contact.company ?? '')
            .replace(/{{email}}/g, cc.contact.email),
          campaign.id, cc.contact.id
        )
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: cc.contact.email,
          subject: campaign.subject,
          html
        })
        await prisma.campaignContact.update({
          where: { id: cc.id },
          data: { status: 'sent', sentAt: new Date() }
        })
        await prisma.contact.update({
          where: { id: cc.contact.id },
          data: { sentCount: { increment: 1 }, lastSentAt: new Date() }
        })
        sent++
      } catch (e) {
        console.error('Send failed for', cc.contact.email, e)
        await prisma.campaignContact.update({ where: { id: cc.id }, data: { status: 'failed' } })
      }
    }

    await incrementDailyCount(sent)
    await prisma.campaign.update({
      where: { id },
      data: { status: 'sent', sentAt: new Date(), totalSent: { increment: sent } }
    })

    return NextResponse.json({ sent })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}