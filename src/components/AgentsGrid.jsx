import { useMemo, useState } from 'react'
import { Sparkles, Bot, Zap, Star, Filter } from 'lucide-react'

const SAMPLE_AGENTS = [
  { id: 'a1', name: 'Sales Copilot', price: 99, rating: 4.8, skills: ['lead-qual', 'email', 'crm'], problems: ['low-leads', 'slow-outreach'] },
  { id: 'a2', name: 'Support AutoPilot', price: 149, rating: 4.6, skills: ['summarize', 'classify', 'routing'], problems: ['ticket-backlog'] },
  { id: 'a3', name: 'Ops Orchestrator', price: 249, rating: 4.9, skills: ['rpa', 'scheduler', 'etl'], problems: ['manual-tasks'] },
  { id: 'a4', name: 'Research Scout', price: 79, rating: 4.5, skills: ['web-browse', 'extract', 'cite'], problems: ['slow-research'] },
]

function AgentCard({ agent }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-orange-400/10" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400" />
            <h3 className="text-white font-medium">{agent.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm">{agent.rating}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {agent.skills.map(s => (
            <span key={s} className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-200">{s}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-slate-300 text-sm">From ${agent.price}/mo</span>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10">Compare</button>
        </div>
      </div>
    </div>
  )
}

export default function AgentsGrid() {
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('')

  const filtered = useMemo(() => {
    return SAMPLE_AGENTS.filter(a =>
      (!query || a.name.toLowerCase().includes(query.toLowerCase())) &&
      (!skill || a.skills.includes(skill))
    )
  }, [query, skill])

  const skillPool = useMemo(() => Array.from(new Set(SAMPLE_AGENTS.flatMap(a => a.skills))), [])

  return (
    <section id="agents" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Bot className="h-5 w-5" /> Featured Agents</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agents..." className="pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none" />
              <Sparkles className="h-4 w-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <Filter className="h-4 w-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <select value={skill} onChange={e => setSkill(e.target.value)} className="appearance-none pl-8 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none">
                <option value="">All skills</option>
                {skillPool.map(s => (
                  <option value={s} key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => <AgentCard key={a.id} agent={a} />)}
        </div>
      </div>
    </section>
  )
}
