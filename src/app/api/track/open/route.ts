import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cid = searchParams.get('cid')
    const uid = searchParams.get('uid')

    if (cid && uid) {
      await prisma.campaignContact.updateMany({
        where: { campaignId: cid, contactId: uid, openedAt: null },
        data: { openedAt: new Date(), status: 'opened' }
      })
      await prisma.campaign.update({
        where: { id: cid },
        data: { totalOpened: { increment: 1 } }
      })
    }
  } catch {}

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  return new NextResponse(pixel, {
    headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-cache, no-store' }
  })
}