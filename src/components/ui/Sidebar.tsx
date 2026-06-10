'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Send, FileText, Clock, LogOut, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

const BRAND = '#e13a30'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/contacts', icon: Users, label: 'Contacts' },
  { href: '/templates', icon: FileText, label: 'Templates' },
  { href: '/campaigns', icon: Send, label: 'Campaigns' },
  { href: '/scheduler', icon: Clock, label: 'Scheduler' },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    toast.success('Logged out')
    router.push('/')
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div>
          <img src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png" alt="Logo" className="h-10 mb-1" />
          <p className="text-gray-400 text-xs">Mailer Dashboard</p>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              path === href ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            style={path === href ? { background: BRAND } : {}}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <img src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png" alt="Logo" className="h-8" />
        <button onClick={() => setOpen(true)} className="text-white p-2 rounded-lg hover:bg-gray-800">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-72 flex flex-col z-50" style={{ background: '#1a1a1a' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen flex-col flex-shrink-0" style={{ background: '#1a1a1a' }}>
        <SidebarContent />
      </aside>
    </>
  )
}