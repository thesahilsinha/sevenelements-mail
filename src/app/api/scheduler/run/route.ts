import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { transporter, canSend, incrementDailyCount, buildTrackedHtml } from '@/lib/mailer'

export async function GET() {
  try {
    const schedulers = await prisma.scheduler.findMany({ where: { active: true } })
    const now = new Date()
    let totalSent = 0

    for (const s of schedulers) {
      try {
        const tags: string[] = (() => { try { return JSON.parse(s.tags) } catch { return [] } })()

        let contacts = await prisma.contact.findMany()
        if (tags.length > 0) {
          contacts = contacts.filter(c => {
            try { const ct = JSON.parse(c.tags); return tags.some(t => ct.includes(t)) } catch { return false }
          })
        }

        if (contacts.length === 0) continue
        if (!await canSend(contacts.length)) continue

        const campaign = await prisma.campaign.create({
          data: {
            name: `[Auto] ${s.name} - ${now.toLocaleDateString()}`,
            subject: s.subject,
            htmlBody: s.htmlBody ?? '',
            status: 'sending'
          }
        })

        let sent = 0
        for (const c of contacts) {
          try {
            const html = buildTrackedHtml(
              (s.htmlBody ?? '')
                .replace(/{{name}}/g, c.name)
                .replace(/{{company}}/g, c.company ?? '')
                .replace(/{{email}}/g, c.email),
              campaign.id, c.id
            )
            await transporter.sendMail({ from: process.env.SMTP_FROM, to: c.email, subject: s.subject, html })
            sent++
          } catch {}
        }

        await incrementDailyCount(sent)
        await prisma.campaign.update({ where: { id: campaign.id }, data: { status: 'sent', sentAt: now, totalSent: sent } })
        await prisma.scheduler.update({ where: { id: s.id }, data: { lastRunAt: now } })
        totalSent += sent
      } catch (e) {
        console.error('Scheduler error for', s.name, e)
      }
    }

    return NextResponse.json({ ok: true, totalSent })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}