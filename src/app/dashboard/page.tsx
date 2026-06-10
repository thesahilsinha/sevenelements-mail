'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/ui/Layout'
import { Users, FileText, Eye, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BRAND = '#e13a30'

interface DashboardData {
  contacts: number
  templates: number
  totalSent: number
  totalOpened: number
  dailySent: number
  dailyLimit: number
  recentCampaigns: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/dashboard')
      .then(async r => {
        if (r.status === 401) { router.push('/'); return null }
        const text = await r.text()
        if (!text) throw new Error('Empty response')
        return JSON.parse(text)
      })
      .then(d => { if (d) setData(d) })
      .catch(() => setError(true))
  }, [])

  if (error) return (
    <AppLayout>
      <div className="flex items-center justify-center h-screen flex-col gap-4 p-4">
        <p className="text-red-500 font-medium text-center">Failed to load dashboard</p>
        <button onClick={() => { setError(false); window.location.reload() }} className="px-4 py-2 rounded-xl text-white text-sm" style={{ background: BRAND }}>Retry</button>
      </div>
    </AppLayout>
  )

  if (!data) return (
    <AppLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: BRAND, borderTopColor: 'transparent' }} />
      </div>
    </AppLayout>
  )

  const openRate = data.totalSent > 0 ? Math.round((data.totalOpened / data.totalSent) * 100) : 0
  const dailyPct = Math.round((data.dailySent / data.dailyLimit) * 100)

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Good morning! 👋</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Here's your Seven Elements Mailer overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {[
            { label: 'Total Contacts', value: data.contacts, icon: Users, color: BRAND },
            { label: 'Emails Sent', value: data.totalSent, icon: Send, color: '#3b82f6' },
            { label: 'Open Rate', value: `${openRate}%`, icon: Eye, color: '#10b981' },
            { label: 'Templates', value: data.templates, icon: FileText, color: '#8b5cf6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="p-2 md:p-3 rounded-xl w-fit mb-3 md:mb-4" style={{ background: color + '20' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Daily Send Quota</h2>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl md:text-4xl font-bold" style={{ color: BRAND }}>{data.dailySent}</span>
              <span className="text-gray-400 mb-1 text-sm">/ {data.dailyLimit} today</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 md:h-4">
              <div className="h-3 md:h-4 rounded-full transition-all" style={{ width: `${Math.min(dailyPct, 100)}%`, background: dailyPct > 90 ? '#ef4444' : BRAND }} />
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">{data.dailyLimit - data.dailySent} emails remaining today</p>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Campaigns</h2>
            {data.recentCampaigns.length === 0 ? (
              <p className="text-gray-400 text-sm">No campaigns yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {data.recentCampaigns.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-gray-800 text-sm truncate">{c.name}</p>
                      <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 md:px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      c.status === 'sent' ? 'bg-green-100 text-green-700' :
                      c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}