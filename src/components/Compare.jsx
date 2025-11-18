import { useEffect, useMemo, useState } from 'react'
import { Scale, X } from 'lucide-react'

export default function Compare() {
  const [agents, setAgents] = useState([])
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || ''
        const res = await fetch(`${base}/api/agents`)
        const data = await res.json()
        setAgents(data)
      } catch (e) {
        setError('Nie udało się pobrać agentów')
      }
    }
    load()
  }, [])

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id].slice(-3))
  }

  const columns = useMemo(() => agents.filter(a => selected.includes(a.id)), [agents, selected])

  return (
    <section id="compare" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Scale className="h-5 w-5" /> Porównaj agentów</h2>
          <p className="text-slate-300 text-sm">Zaznacz do 3 agentów do porównania</p>
        </div>

        {error && <div className="text-amber-300 mb-4 text-sm">{error}</div>}

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {agents.map(a => (
            <button key={a.id} onClick={() => toggle(a.id)} className={`text-left rounded-xl border p-4 ${selected.includes(a.id)?'border-fuchsia-400 bg-fuchsia-500/10':'border-white/10 bg-white/5'}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">{a.name}</div>
                {selected.includes(a.id) && <X className="h-4 w-4" />}
              </div>
              <div className="text-sm text-slate-300">${a.price}/m • {a.rating}★</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(a.skills||[]).slice(0,5).map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">{s}</span>)}
              </div>
            </button>
          ))}
        </div>

        {columns.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-x-4 border-spacing-y-2">
              <thead>
                <tr>
                  {columns.map(c => (
                    <th key={c.id} className="text-left text-slate-300 text-sm font-normal">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white font-medium">{c.name}</div>
                        <div className="text-slate-400 text-sm">${c.price}/m • {c.rating}★</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-200 text-sm">
                <tr>
                  {columns.map(c => (
                    <td key={c.id} className="align-top">
                      <div className="p-3 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                        <div className="font-medium mb-1">Opis</div>
                        <div className="text-slate-300">{c.description || '—'}</div>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  {columns.map(c => (
                    <td key={c.id} className="align-top">
                      <div className="p-3 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                        <div className="font-medium mb-1">Umiejętności</div>
                        <div className="flex flex-wrap gap-1">
                          {(c.skills||[]).map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10">{s}</span>)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  {columns.map(c => (
                    <td key={c.id} className="align-top">
                      <div className="p-3 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                        <div className="font-medium mb-1">Rozwiązywane problemy</div>
                        <div className="flex flex-wrap gap-1">
                          {(c.problems||[]).map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/10">{s}</span>)}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
