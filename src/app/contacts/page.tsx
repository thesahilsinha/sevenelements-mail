'use client'
import { useEffect, useState, useRef } from 'react'
import AppLayout from '@/components/ui/Layout'
import { Plus, Upload, Trash2, Edit2, Search, X, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

const BRAND = '#e13a30'

interface Contact {
  id: string; name: string; company?: string; email: string; phone?: string;
  tags: string; sentCount: number; lastSentAt?: string; createdAt: string
}

const emptyForm = { name: '', company: '', email: '', phone: '', tags: [] as string[] }

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const params = new URLSearchParams()
    if (filterTag) params.set('tag', filterTag)
    if (search) params.set('search', search)
    const r = await fetch('/api/contacts?' + params)
    setContacts(await r.json())
  }

  useEffect(() => { load() }, [search, filterTag])

  const allTags = Array.from(new Set(contacts.flatMap(c => { try { return JSON.parse(c.tags) } catch { return [] } })))

  const save = async () => {
    if (!form.name || !form.email) return toast.error('Name and email required')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/contacts/${editId}` : '/api/contacts'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { toast.success(editId ? 'Updated' : 'Added'); setShowModal(false); setForm({ ...emptyForm }); setEditId(null); load() }
    else toast.error('Failed to save')
  }

  const del = async (id: string) => {
    if (!confirm('Delete this contact?')) return
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const edit = (c: Contact) => {
    setForm({ name: c.name, company: c.company ?? '', email: c.email, phone: c.phone ?? '', tags: (() => { try { return JSON.parse(c.tags) } catch { return [] } })() })
    setEditId(c.id); setShowModal(true)
  }

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[]
        const contacts = rows.map(r => ({
          name: r.name || r.Name || '',
          email: r.email || r.Email || '',
          company: r.company || r.Company || '',
          phone: r.phone || r.Phone || '',
          tags: r.tags ? r.tags.split(';').map((t: string) => t.trim()) : []
        })).filter(c => c.name && c.email)
        const res = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contacts) })
        const data = await res.json()
        toast.success(`Imported ${data.imported} contacts`); load()
      }
    })
    e.target.value = ''
  }

  const exportCSV = () => {
    const data = contacts.map(c => ({ name: c.name, email: c.email, company: c.company, phone: c.phone, tags: (() => { try { return JSON.parse(c.tags).join(';') } catch { return '' } })(), sentCount: c.sentCount }))
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'contacts.csv'; a.click()
  }

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] })
      setTagInput('')
    }
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-500 text-sm">{contacts.length} total contacts</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">
              <Download size={15} /> Export
            </button>
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">
              <Upload size={15} /> Import
            </button>
            <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
            <button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowModal(true) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: BRAND }}>
              <Plus size={15} /> Add
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400" />
          </div>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400">
            <option value="">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {contacts.map(c => {
            const tags: string[] = (() => { try { return JSON.parse(c.tags) } catch { return [] } })()
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.email}</p>
                    {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => edit(c)} className="p-1.5 rounded-lg hover:bg-red-50 transition" style={{ color: BRAND }}><Edit2 size={14} /></button>
                    <button onClick={() => del(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1 flex-wrap">
                    {tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: BRAND }}>{t}</span>)}
                  </div>
                  <span className="text-xs text-gray-400">{c.sentCount} sent</span>
                </div>
              </div>
            )
          })}
          {contacts.length === 0 && <p className="text-center py-12 text-gray-400">No contacts found</p>}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Company', 'Email', 'Phone', 'Tags', 'Sent', 'Last Sent', 'Actions'].map(h => (
                    <th key={h} className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => {
                  const tags: string[] = (() => { try { return JSON.parse(c.tags) } catch { return [] } })()
                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-red-50/20 transition">
                      <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{c.name}</td>
                      <td className="p-4 text-gray-500 text-sm">{c.company || '—'}</td>
                      <td className="p-4 text-gray-600 text-sm">{c.email}</td>
                      <td className="p-4 text-gray-500 text-sm whitespace-nowrap">{c.phone || '—'}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: BRAND }}>{t}</span>)}
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold text-gray-800">{c.sentCount}</td>
                      <td className="p-4 text-gray-400 text-xs whitespace-nowrap">{c.lastSentAt ? new Date(c.lastSentAt).toLocaleDateString() : '—'}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => edit(c)} className="p-1.5 rounded-lg hover:bg-red-50 transition" style={{ color: BRAND }}><Edit2 size={15} /></button>
                          <button onClick={() => del(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {contacts.length === 0 && (
                  <tr><td colSpan={8} className="p-12 text-center text-gray-400">No contacts found. Import a CSV or add manually.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Contact' : 'New Contact'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {['name', 'company', 'email', 'phone'].map(field => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 capitalize">{field}{(field === 'name' || field === 'email') ? ' *' : ''}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={(form as any)[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2 mt-1">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
                  <button onClick={addTag} className="px-4 py-2 rounded-xl text-white text-sm" style={{ background: BRAND }}>Add</button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white" style={{ background: BRAND }}>
                      {t} <button onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: BRAND }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}