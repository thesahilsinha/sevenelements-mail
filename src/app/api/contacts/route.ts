import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    let contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })

    if (tag) {
      contacts = contacts.filter(c => {
        try { return JSON.parse(c.tags).includes(tag) } catch { return false }
      })
    }
    if (search) {
      const s = search.toLowerCase()
      contacts = contacts.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (c.company ?? '').toLowerCase().includes(s)
      )
    }
    return NextResponse.json(contacts)
  } catch (e) {
    console.error(e)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()

    if (Array.isArray(body)) {
      let imported = 0
      for (const c of body) {
        try {
          await prisma.contact.upsert({
            where: { email: c.email },
            update: { name: c.name, company: c.company, phone: c.phone, tags: JSON.stringify(c.tags ?? []) },
            create: { name: c.name, email: c.email, company: c.company, phone: c.phone, tags: JSON.stringify(c.tags ?? []) }
          })
          imported++
        } catch {}
      }
      return NextResponse.json({ imported })
    }

    const contact = await prisma.contact.create({
      data: {
        name: body.name, email: body.email,
        company: body.company ?? null, phone: body.phone ?? null,
        tags: JSON.stringify(body.tags ?? [])
      }
    })
    return NextResponse.json(contact)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}