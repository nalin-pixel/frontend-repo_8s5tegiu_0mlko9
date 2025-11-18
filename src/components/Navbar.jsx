import { useEffect, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

function NavLink({ label, href }) {
  return (
    <a href={href} className="text-slate-200/90 hover:text-white transition-colors px-3 py-2 text-sm">
      {label}
    </a>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [elevated, setElevated] = useState(false)

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-white/10 transition-shadow ${elevated ? 'shadow-[0_8px_24px_rgba(0,0,0,0.25)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 group-hover:scale-105 transition-transform shadow-[0_0_24px_rgba(168,85,247,.45)]" />
          <span className="font-semibold tracking-tight text-white">AgentVerse</span>
        </a>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink label="Agents" href="#agents" />
          <NavLink label="Skills" href="#skills" />
          <NavLink label="Graph" href="#graph" />
          <NavLink label="Compare" href="#compare" />
          <NavLink label="ROI" href="#roi" />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input placeholder="Search agents..." className="pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <ThemeToggle />
          <a href="#roi" className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 transition-shadow">Try ROI</a>
        </div>

        <button aria-label="Open menu" onClick={() => setOpen(v => !v)} className="md:hidden text-white p-2">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/80">
          <div className="px-4 py-3 space-y-2">
            {[
              { label: 'Agents', href: '#agents' },
              { label: 'Skills', href: '#skills' },
              { label: 'Graph', href: '#graph' },
              { label: 'Compare', href: '#compare' },
              { label: 'ROI', href: '#roi' },
            ].map(i => (
              <a key={i.href} href={i.href} className="block text-slate-200/90 hover:text-white">
                {i.label}
              </a>
            ))}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
