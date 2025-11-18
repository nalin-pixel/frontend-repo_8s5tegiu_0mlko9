import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

// Lightweight theme toggle that flips a data attribute on <html> for future theming.
// Current UI is dark-first; this prepares for future light styles without breaking anything.
export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
      document.documentElement.dataset.theme = stored
    } else {
      document.documentElement.dataset.theme = 'dark'
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 h-9 w-9 transition-colors"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
