import { useEffect, useState } from 'react'

export default function AuthModal({ open, onClose, onAuthed }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setError('')
      setLoading(false)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
            <button onClick={() => setTab('login')} className={`px-3 py-1.5 text-sm rounded-md ${tab==='login'?'bg-white/10 text-white':'text-slate-300'}`}>Logowanie</button>
            <button onClick={() => setTab('register')} className={`px-3 py-1.5 text-sm rounded-md ${tab==='register'?'bg-white/10 text-white':'text-slate-300'}`}>Rejestracja</button>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        {tab === 'login' ? <LoginForm loading={loading} setLoading={setLoading} error={error} setError={setError} onAuthed={onAuthed} /> : <RegisterForm loading={loading} setLoading={setLoading} error={error} setError={setError} onAuthed={onAuthed} />}
      </div>
    </div>
  )
}

function LoginForm({ loading, setLoading, error, setError, onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || ''
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password })
      })
      if (!res.ok) throw new Error('Błędne dane logowania')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      onAuthed && onAuthed()
    } catch (e) {
      setError(e.message || 'Nie udało się zalogować')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Email</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Hasło</div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
      </label>
      {error && <div className="text-amber-300 text-sm">{error}</div>}
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white disabled:opacity-60">
        {loading? 'Logowanie…' : 'Zaloguj się'}
      </button>
    </form>
  )
}

function RegisterForm({ loading, setLoading, error, setError, onAuthed }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || ''
      const res = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      if (!res.ok) throw new Error('Nie udało się utworzyć konta')
      // Autologin
      const res2 = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password })
      })
      const data = await res2.json()
      localStorage.setItem('token', data.access_token)
      onAuthed && onAuthed()
    } catch (e) {
      setError(e.message || 'Błąd rejestracji')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Imię i nazwisko</div>
        <input value={name} onChange={e=>setName(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Email</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Hasło</div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-300 mb-1">Rola</div>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none">
          <option value="client">Klient</option>
          <option value="employee">Pracownik</option>
          <option value="admin">Administrator</option>
        </select>
      </label>
      {error && <div className="text-amber-300 text-sm">{error}</div>}
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white disabled:opacity-60">
        {loading? 'Rejestracja…' : 'Utwórz konto'}
      </button>
    </form>
  )
}
