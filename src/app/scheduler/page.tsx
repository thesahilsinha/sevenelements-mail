'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/ui/Layout'
import { Plus, Trash2, Edit2, X, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Scheduler { id: string; name: string; subject: string; htmlBody?: string; cronExpr: string; active: boolean; tags: string; lastRunAt?: string; createdAt: string }

const BRAND = '#e13a30'

const CRON_PRESETS = [
  { label: 'Every Monday 9 AM', value: '0 9 * * 1' },
  { label: 'Every day 10 AM', value: '0 10 * * *' },
  { label: '1st of every month', value: '0 9 1 * *' },
  { label: 'Every Friday 5 PM', value: '0 17 * * 5' },
  { label: 'Mon & Thu 9 AM', value: '0 9 * * 1,4' },
]

const emptyForm = { name: '', subject: '', htmlBody: '', cronExpr: '0 9 * * 1', active: true, tags: [] as string[] }

export default function SchedulerPage() {
  const [schedulers, setSchedulers] = useState<Scheduler[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [bodyTab, setBodyTab] = useState<'html' | 'preview'>('html')

  const load = async () => {
    const r = await fetch('/api/scheduler')
    setSchedulers(await r.json())
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name || !form.subject || !form.htmlBody) return toast.error('Name, subject and body required')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/scheduler/${editId}` : '/api/scheduler'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { toast.success('Scheduler saved'); setShowModal(false); setForm({ ...emptyForm }); setEditId(null); load() }
    else toast.error('Failed')
  }

  const del = async (id: string) => {
    if (!confirm('Delete this scheduler?')) return
    await fetch(`/api/scheduler/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const toggle = async (s: Scheduler) => {
    await fetch(`/api/scheduler/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, active: !s.active, tags: (() => { try { return JSON.parse(s.tags) } catch { return [] } })() })
    })
    load()
  }

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] })
      setTagInput('')
    }
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Scheduler</h1>
            <p className="text-gray-500 text-sm">Auto-send newsletters on a recurring schedule</p>
          </div>
          <button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: BRAND }}>
            <Plus size={16} /> New Scheduler
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-amber-800 text-sm">⚠️ <strong>Note:</strong> For scheduled sends to run automatically, call <code className="bg-amber-100 px-1 rounded">/api/scheduler/run</code> via a cron job or Vercel Cron.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {schedulers.map(s => {
            const tags: string[] = (() => { try { return JSON.parse(s.tags) } catch { return [] } })()
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${s.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Clock size={20} className={s.active ? 'text-green-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{s.name}</h3>
                      <p className="text-sm text-gray-500">{s.subject}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{s.cronExpr}</code>
                        {tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: BRAND }}>{t}</span>)}
                        {s.lastRunAt && <span className="text-xs text-gray-400">Last run: {new Date(s.lastRunAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggle(s)}>
                      {s.active ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-400" />}
                    </button>
                    <button onClick={() => {
                      const tags = (() => { try { return JSON.parse(s.tags) } catch { return [] } })()
                      setForm({ name: s.name, subject: s.subject, htmlBody: s.htmlBody ?? '', cronExpr: s.cronExpr, active: s.active, tags })
                      setEditId(s.id); setShowModal(true)
                    }} className="p-2 rounded-xl hover:bg-red-50 transition" style={{ color: BRAND }}><Edit2 size={16} /></button>
                    <button onClick={() => del(s.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            )
          })}
          {schedulers.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Clock size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No schedulers yet</p>
              <p className="text-sm">Set up auto newsletters to stay in touch with leads</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Scheduler' : 'New Newsletter Scheduler'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Scheduler Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Weekly Newsletter" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Subject *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Subject line" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Schedule</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CRON_PRESETS.map(p => (
                    <button key={p.value} onClick={() => setForm({ ...form, cronExpr: p.value })}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${form.cronExpr === p.value ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 hover:border-red-300'}`}
                      style={form.cronExpr === p.value ? { background: BRAND, borderColor: BRAND } : {}}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <input value={form.cronExpr} onChange={e => setForm({ ...form, cronExpr: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-red-400" placeholder="0 9 * * 1" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Send to contacts with tags <span className="text-gray-400 font-normal">(empty = all contacts)</span></label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag filter..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
                  <button onClick={addTag} className="px-4 py-2 rounded-xl text-white text-sm" style={{ background: BRAND }}>Add</button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white" style={{ background: BRAND }}>
                      {t} <button onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Email Body *</label>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setBodyTab('html')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${bodyTab === 'html' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>HTML</button>
                    <button onClick={() => setBodyTab('preview')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${bodyTab === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Preview</button>
                  </div>
                </div>
                {bodyTab === 'html' ? (
                  <textarea value={form.htmlBody} onChange={e => setForm({ ...form, htmlBody: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-red-400 resize-none"
                    rows={14} placeholder="Paste your HTML email here..." />
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <iframe srcDoc={form.htmlBody} className="w-full" style={{ height: 400, border: 'none' }} title="Preview" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button onClick={() => setForm({ ...form, active: !form.active })}>
                  {form.active ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: BRAND }}>Save Scheduler</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}