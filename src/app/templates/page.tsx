'use client'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/ui/Layout'
import { Plus, Trash2, Edit2, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Template { id: string; name: string; subject: string; htmlBody: string; previewText?: string; createdAt: string }

const emptyForm = { name: '', subject: '', htmlBody: '', previewText: '' }

const STARTER_TEMPLATES = [
  {
    name: 'Brand Outreach',
    subject: 'Elevate Your Brand with Seven Elements Design',
    previewText: 'Professional branding services tailored for you',
    htmlBody: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#1a1a1a;padding:30px;text-align:center;">
    <img src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png" style="height:60px;" />
  </div>
  <div style="padding:40px 30px;">
    <h1 style="color:#1a1a1a;font-size:26px;font-weight:700;margin-bottom:16px;">Hi {{name}},</h1>
    <p style="color:#555;line-height:1.7;margin-bottom:20px;">We noticed {{company}} has been growing — congratulations! At <strong>Seven Elements Design</strong>, we help brands like yours stand out with strategic design that actually converts.</p>
    <p style="color:#555;line-height:1.7;margin-bottom:30px;">From logo design and brand identity to packaging, UI/UX, and social media — we handle the full brand experience.</p>
    <a href="https://sevenelementsdesign.in/contact/" style="background:#e13a30;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Book a Free Brand Audit →</a>
  </div>
  <div style="background:#f5f5f5;padding:20px 30px;text-align:center;font-size:12px;color:#999;">
    <p>Seven Elements Design | Nagpur, India</p>
    <p><a href="https://sevenelementsdesign.in" style="color:#e13a30;">sevenelementsdesign.in</a></p>
  </div>
</div>`
  },
  {
    name: 'Newsletter',
    subject: 'Seven Elements Design — Monthly Brand Insights',
    previewText: 'Tips and insights to grow your brand',
    htmlBody: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:linear-gradient(135deg,#1a1a1a,#333);padding:30px;text-align:center;">
    <img src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png" style="height:50px;margin-bottom:10px;" />
    <p style="color:#e13a30;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0;">Monthly Newsletter</p>
  </div>
  <div style="padding:40px 30px;">
    <h1 style="color:#1a1a1a;font-size:22px;">Hello {{name}} 👋</h1>
    <p style="color:#555;line-height:1.7;">Welcome to this month's brand insights from Seven Elements Design!</p>
    <div style="border-left:4px solid #e13a30;padding:16px;background:#fff8f3;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#1a1a1a;font-weight:600;margin:0 0 8px;">💡 Brand Tip of the Month</p>
      <p style="color:#555;margin:0;font-size:14px;">Consistency is the cornerstone of a strong brand. Ensure your logo, colors, and messaging align across every touchpoint.</p>
    </div>
    <a href="https://sevenelementsdesign.in/contact/" style="background:#e13a30;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:16px;">Talk to Us →</a>
  </div>
  <div style="background:#1a1a1a;padding:20px;text-align:center;font-size:12px;color:#666;">
    <p style="margin:0;color:#e13a30;">Seven Elements Design</p>
    <p style="margin:4px 0 0;"><a href="https://sevenelementsdesign.in" style="color:#999;">sevenelementsdesign.in</a></p>
  </div>
</div>`
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState<Template | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<string | null>(null)
  const [tab, setTab] = useState<'visual' | 'html'>('html')

  const load = async () => {
    const r = await fetch('/api/templates')
    setTemplates(await r.json())
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name || !form.subject || !form.htmlBody) return toast.error('Name, subject and body required')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/templates/${editId}` : '/api/templates'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { toast.success('Template saved'); setShowModal(false); setForm({ ...emptyForm }); setEditId(null); load() }
    else toast.error('Failed to save')
  }

  const del = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const useStarter = (s: typeof STARTER_TEMPLATES[0]) => {
    setForm({ name: s.name, subject: s.subject, htmlBody: s.htmlBody, previewText: s.previewText })
    setEditId(null); setShowModal(true)
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-500 text-sm">Design reusable email templates</p>
          </div>
          <button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: '#e13a30' }}>
            <Plus size={16} /> New Template
          </button>
        </div>

        {templates.length === 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-gray-700 mb-3">🚀 Start with a template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STARTER_TEMPLATES.map(s => (
                <div key={s.name} className="bg-white border-2 border-dashed border-orange-200 rounded-2xl p-6 hover:border-orange-400 cursor-pointer transition" onClick={() => useStarter(s)}>
                  <h3 className="font-semibold text-gray-800">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.subject}</p>
                  <span className="text-xs text-orange-600 font-medium mt-3 block">Click to use →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-gray-400 ml-2 truncate">{t.subject}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 mb-1">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-4 truncate">{t.previewText || 'No preview text'}</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowPreview(t)} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"><Eye size={14} /> Preview</button>
                  <button onClick={() => { setForm({ name: t.name, subject: t.subject, htmlBody: t.htmlBody, previewText: t.previewText ?? '' }); setEditId(t.id); setShowModal(true) }} className="p-2 rounded-xl hover:bg-orange-50 text-orange-500 transition"><Edit2 size={14} /></button>
                  <button onClick={() => del(t.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Template' : 'New Template'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Template Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="e.g. Brand Outreach" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Subject *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Email subject line" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preview Text</label>
                <input value={form.previewText} onChange={e => setForm({ ...form, previewText: e.target.value })} className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Short preview shown in inbox" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Email Body * <span className="text-gray-400 font-normal">(use {`{{name}}`}, {`{{company}}`}, {`{{email}}`})</span></label>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setTab('html')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${tab === 'html' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>HTML</button>
                    <button onClick={() => setTab('visual')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${tab === 'visual' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Preview</button>
                  </div>
                </div>
                {tab === 'html' ? (
                  <textarea
                    value={form.htmlBody}
                    onChange={e => setForm({ ...form, htmlBody: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-orange-400 resize-none"
                    rows={16}
                    placeholder="Paste your HTML email here..."
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
                    <iframe srcDoc={form.htmlBody} className="w-full" style={{ height: 400, border: 'none' }} title="Preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#e13a30' }}>Save Template</button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold">{showPreview.name}</h2>
                <p className="text-sm text-gray-500">Subject: {showPreview.subject}</p>
              </div>
              <button onClick={() => setShowPreview(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe srcDoc={showPreview.htmlBody} className="w-full h-full min-h-[500px] border-0 rounded-xl" title="Email Preview" />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}