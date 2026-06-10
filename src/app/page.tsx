'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (data.ok) {
      toast.success('Welcome to Seven Elements Mailer!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid access code')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md text-center">
        <img
          src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png"
          alt="Seven Elements"
          className="h-16 md:h-20 mx-auto mb-6"
        />
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Seven Elements Mailer</h1>
        <p className="text-gray-500 mb-8 text-sm">Enter your access code to continue</p>
        <input
          type="password"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="• • • • • •"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono mb-4 focus:outline-none transition"
          style={{ borderColor: code.length === 6 ? '#e13a30' : '' }}
          maxLength={6}
        />
        <button
          onClick={handleLogin}
          disabled={loading || code.length !== 6}
          className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-40"
          style={{ background: '#e13a30' }}
        >
          {loading ? 'Verifying...' : 'Access Dashboard →'}
        </button>
      </div>
    </div>
  )
}