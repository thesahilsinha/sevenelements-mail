'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/ui/Layout'
import { Plus, Send, Eye, Trash2, X, Users, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const BRAND = '#e13a30'

interface Contact { id: string; name: string; email: string; company?: string; tags: string }
interface Template { id: string; name: string; subject: string; htmlBody: string }
interface Campaign { id: string; name: string; subject: string; htmlBody: string; status: string; totalSent: number; totalOpened: number; createdAt: string; contacts: any[] }

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState<Campaign | null>(null)
  const [filterTag, setFilterTag] = useState('')
  const [searchContact, setSearchContact] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [form, setForm] = useState({ name: '', subject: '', htmlBody: '', templateId: '', scheduledAt: '' })
  const [contactsOpen, setContactsOpen] = useState(false)
  const [bodyTab, setBodyTab] = useState<'edit' | 'preview'>('edit')

  const load = async () => {
    const [c, co, t] = await Promise.all([fetch('/api/campaigns'), fetch('/api/contacts'), fetch('/api/templates')])
    setCampaigns(await c.json())
    setContacts(await co.json())
    setTemplates(await t.json())
  }
  useEffect(() => { load() }, [])

  const allTags = Array.from(new Set(contacts.flatMap(c => { try { return JSON.parse(c.tags) } catch { return [] } })))

  const filteredContacts = contacts.filter(c => {
    const matchTag = !filterTag || (() => { try { return JSON.parse(c.tags).includes(filterTag) } catch { return false } })()
    const matchSearch = !searchContact || c.name.toLowerCase().includes(searchContact.toLowerCase()) || c.email.toLowerCase().includes(searchContact.toLowerCase())
    return matchTag && matchSearch
  })

  const selectAllFiltered = () => {
    const s = new Set(selectedContacts)
    filteredContacts.forEach(c => s.add(c.id))
    setSelectedContacts(s)
  }

  const applyTemplate = (id: string) => {
    const t = templates.find(x => x.id === id)
    if (t) setForm({ ...form, templateId: id, subject: t.subject, htmlBody: t.htmlBody })
  }

  const save = async () => {
    if (!form.name || !form.subject || !form.htmlBody) return toast.error('Name, subject and body required')
    if (selectedContacts.size === 0) return toast.error('Select at least one contact')
    const r = await fetch('/api/campaigns', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, contactIds: Array.from(selectedContacts) })
    })
    if (r.ok) { toast.success('Campaign created!'); setShowModal(false); setForm({ name: '', subject: '', htmlBody: '', templateId: '', scheduledAt: '' }); setSelectedContacts(new Set()); load() }
    else toast.error('Failed to create')
  }

  const sendCampaign = async (id: string) => {
    if (!confirm('Send this campaign now?')) return
    setSending(id)
    const r = await fetch(`/api/campaigns/${id}/send`, { method: 'POST' })
    const data = await r.json()
    if (r.ok) toast.success(`Sent ${data.sent} emails!`)
    else toast.error(data.error || 'Send failed')
    setSending(null); load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete campaign?')) return
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-500 text-sm">{campaigns.length} total</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: BRAND }}>
            <Plus size={16} /> <span className="hidden sm:inline">New</span> Campaign
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          {campaigns.map(c => {
            const openRate = c.totalSent > 0 ? Math.round((c.totalOpened / c.totalSent) * 100) : 0
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        c.status === 'sent' ? 'bg-green-100 text-green-700' :
                        c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.subject}</p>
                    <div className="flex gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-400"><span className="font-semibold text-gray-700">{c.contacts?.length ?? 0}</span> recipients</span>
                      <span className="text-xs text-gray-400"><span className="font-semibold text-gray-700">{c.totalSent}</span> sent</span>
                      <span className="text-xs text-gray-400"><span className="font-semibold text-gray-700">{openRate}%</span> open rate</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setShowPreview(c)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition"><Eye size={16} /></button>
                    {c.status !== 'sent' && (
                      <button onClick={() => sendCampaign(c.id)} disabled={sending === c.id}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                        style={{ background: BRAND }}>
                        <Send size={14} />
                        {sending === c.id ? 'Sending...' : 'Send'}
                      </button>
                    )}
                    <button onClick={() => del(c.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            )
          })}
          {campaigns.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Send size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No campaigns yet</p>
              <p className="text-sm">Create your first campaign to get started</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-start justify-center z-50 p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl sm:my-8">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Create Campaign</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-4 md:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Campaign Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="e.g. October Outreach" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Use Template</label>
                  <select value={form.templateId} onChange={e => applyTemplate(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400">
                    <option value="">Select template...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Subject *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Subject line" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Email Body *</label>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setBodyTab('edit')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${bodyTab === 'edit' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>HTML</button>
                    <button onClick={() => setBodyTab('preview')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${bodyTab === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Preview</button>
                  </div>
                </div>
                {bodyTab === 'edit' ? (
                  <textarea value={form.htmlBody} onChange={e => setForm({ ...form, htmlBody: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-400 resize-none"
                    rows={12} placeholder="Paste your HTML email here..." />
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <iframe srcDoc={form.htmlBody} className="w-full" style={{ height: 350, border: 'none' }} title="Preview" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Schedule (optional)</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setContactsOpen(!contactsOpen)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700 text-sm">Select Recipients</span>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: BRAND }}>{selectedContacts.size} selected</span>
                  </div>
                  {contactsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {contactsOpen && (
                  <div className="p-3 md:p-4">
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input value={searchContact} onChange={e => setSearchContact(e.target.value)} placeholder="Search contacts..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-400" />
                      <div className="flex gap-2">
                        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400">
                          <option value="">All Tags</option>
                          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={selectAllFiltered} className="px-3 py-2 rounded-xl text-sm font-medium text-white whitespace-nowrap" style={{ background: BRAND }}>All</button>
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {filteredContacts.map(c => (
                        <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={selectedContacts.has(c.id)} onChange={() => {
                            const s = new Set(selectedContacts)
                            s.has(c.id) ? s.delete(c.id) : s.add(c.id)
                            setSelectedContacts(s)
                          }} className="rounded flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 truncate">{c.name}</span>
                          <span className="text-xs text-gray-400 truncate hidden sm:block">{c.email}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-4 md:p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: BRAND }}>Create Campaign</button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="min-w-0 flex-1 mr-3">
                <h2 className="font-semibold truncate">{showPreview.name}</h2>
                <p className="text-sm text-gray-500 truncate">{showPreview.subject}</p>
              </div>
              <button onClick={() => setShowPreview(null)} className="flex-shrink-0"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe srcDoc={showPreview.htmlBody} className="w-full min-h-[400px] border-0 rounded-xl" title="Preview" />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}