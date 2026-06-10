import nodemailer from 'nodemailer'
import { prisma } from './db'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function getDailyCount(): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const log = await prisma.dailySendLog.findFirst({ where: { date: today } })
    return log?.count ?? 0
  } catch {
    return 0
  }
}

export async function incrementDailyCount(by: number) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const log = await prisma.dailySendLog.findFirst({ where: { date: today } })
    if (log) {
      await prisma.dailySendLog.update({ where: { id: log.id }, data: { count: log.count + by } })
    } else {
      await prisma.dailySendLog.create({ data: { date: today, count: by } })
    }
  } catch {}
}

export async function canSend(count: number): Promise<boolean> {
  const current = await getDailyCount()
  return current + count <= Number(process.env.DAILY_LIMIT ?? 200)
}

export function buildTrackedHtml(html: string, campaignId: string, contactId: string): string {
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000'
  const trackingPixel = `<img src="${appUrl}/api/track/open?cid=${campaignId}&uid=${contactId}" width="1" height="1" style="display:none" />`
  return html + trackingPixel
}