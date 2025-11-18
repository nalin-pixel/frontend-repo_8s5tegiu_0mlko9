import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'

const NODES = [
  { id: 'lead-qual', label: 'Lead Qual', group: 'sales' },
  { id: 'email', label: 'Email', group: 'sales' },
  { id: 'crm', label: 'CRM', group: 'sales' },
  { id: 'summarize', label: 'Summarize', group: 'support' },
  { id: 'classify', label: 'Classify', group: 'support' },
  { id: 'routing', label: 'Routing', group: 'support' },
  { id: 'rpa', label: 'RPA', group: 'ops' },
  { id: 'scheduler', label: 'Scheduler', group: 'ops' },
  { id: 'etl', label: 'ETL', group: 'ops' },
  { id: 'web-browse', label: 'Browse', group: 'research' },
  { id: 'extract', label: 'Extract', group: 'research' },
  { id: 'cite', label: 'Cite', group: 'research' },
]

const LINKS = [
  ['lead-qual', 'email'],
  ['email', 'crm'],
  ['summarize', 'classify'],
  ['classify', 'routing'],
  ['rpa', 'scheduler'],
  ['scheduler', 'etl'],
  ['web-browse', 'extract'],
  ['extract', 'cite'],
  ['crm', 'routing'],
  ['etl', 'extract'],
]

export default function SkillGraph() {
  const ref = useRef(null)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = el.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      el.width = Math.floor(width * dpr)
      el.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onResize = () => { resize(); draw() }
    resize()

    const positions = new Map()
    const center = { x: el.clientWidth / 2, y: el.clientHeight / 2 }
    const radius = Math.min(center.x, center.y) - 20

    NODES.forEach((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2
      positions.set(n.id, { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius })
    })

    function draw() {
      ctx.clearRect(0, 0, el.width, el.height)

      // links
      ctx.strokeStyle = 'rgba(148,163,184,0.35)'
      ctx.lineWidth = 1.2
      LINKS.forEach(([a, b]) => {
        const pa = positions.get(a)
        const pb = positions.get(b)
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      })

      // nodes
      NODES.forEach(n => {
        const p = positions.get(n.id)
        const isHover = hover === n.id
        const r = isHover ? 8 : 6
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        gradient.addColorStop(0, 'rgba(129,140,248,0.9)')
        gradient.addColorStop(1, 'rgba(168,85,247,0.05)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'rgba(226,232,240,0.9)'
        ctx.font = '12px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, p.x, p.y - 12)
      })
    }

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      let found = null
      NODES.forEach(n => {
        const p = positions.get(n.id)
        const dx = p.x - x
        const dy = p.y - y
        const d = Math.sqrt(dx*dx + dy*dy)
        if (d < 10) found = n.id
      })
      setHover(found)
      draw()
    }

    const handleLeave = () => { setHover(null); draw() }

    window.addEventListener('resize', onResize)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [hover])

  return (
    <section id="graph" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Interactive Skill Graph</h2>
          <p className="text-slate-300 text-sm">Hover nodes to highlight relationships</p>
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/5">
          <canvas ref={ref} className="w-full h-[380px]" />
        </div>
      </div>
    </section>
  )
}
