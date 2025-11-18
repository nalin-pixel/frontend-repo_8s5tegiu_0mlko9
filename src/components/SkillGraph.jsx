import { useEffect, useRef, useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'

const NODES = [
  { id: 'lead-qual', label: 'Kwalifikacja leadów', group: 'sales' },
  { id: 'email', label: 'E‑maile', group: 'sales' },
  { id: 'crm', label: 'CRM', group: 'sales' },
  { id: 'summarize', label: 'Streszczanie', group: 'support' },
  { id: 'classify', label: 'Klasyfikacja', group: 'support' },
  { id: 'routing', label: 'Routowanie', group: 'support' },
  { id: 'rpa', label: 'RPA', group: 'ops' },
  { id: 'scheduler', label: 'Harmonogram', group: 'ops' },
  { id: 'etl', label: 'ETL', group: 'ops' },
  { id: 'web-browse', label: 'Przeglądanie', group: 'research' },
  { id: 'extract', label: 'Ekstrakcja', group: 'research' },
  { id: 'cite', label: 'Cytowanie', group: 'research' },
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
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf
    const el = ref.current
    if (!el) return
    const ctx = el.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const positions = new Map()
    const velocities = new Map()

    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      el.width = Math.floor(width * dpr)
      el.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const center = () => ({ x: el.clientWidth / 2, y: el.clientHeight / 2 })
    const radius = () => Math.min(el.clientWidth, el.clientHeight) * 0.38

    NODES.forEach((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2
      const c = center()
      positions.set(n.id, { x: c.x + Math.cos(angle) * radius(), y: c.y + Math.sin(angle) * radius() })
      velocities.set(n.id, { vx: 0, vy: 0 })
    })

    const draw = () => {
      ctx.clearRect(0, 0, el.width, el.height)

      // animated halo
      const grd = ctx.createRadialGradient(el.clientWidth/2, el.clientHeight/2, 0, el.clientWidth/2, el.clientHeight/2, Math.max(el.clientWidth, el.clientHeight)/1.2)
      grd.addColorStop(0, 'rgba(99,102,241,0.05)')
      grd.addColorStop(1, 'rgba(99,102,241,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0,0,el.width,el.height)

      // links
      ctx.lineWidth = 1.2
      LINKS.forEach(([a, b]) => {
        const pa = positions.get(a)
        const pb = positions.get(b)
        const isActive = hover && (a===hover || b===hover)
        ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.6)' : 'rgba(148,163,184,0.35)'
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      })

      // nodes
      NODES.forEach(n => {
        const p = positions.get(n.id)
        const isHover = hover === n.id
        const baseR = 6
        const r = isHover ? 9 : baseR + Math.sin(t/600 + p.x*0.01 + p.y*0.01)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        gradient.addColorStop(0, 'rgba(129,140,248,0.9)')
        gradient.addColorStop(1, 'rgba(168,85,247,0.06)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'rgba(226,232,240,0.95)'
        ctx.font = '12px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, p.x, p.y - 12)
      })
    }

    const animate = (now) => {
      setT(now)
      draw()
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

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
        if (d < 12) found = n.id
      })
      setHover(found)
    }

    const handleLeave = () => setHover(null)
    const onResize = () => resize()

    window.addEventListener('resize', onResize)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(raf)
    }
  }, [t, hover])

  return (
    <section id="graph" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Interaktywny graf umiejętności</h2>
          <p className="text-slate-300 text-sm">Najedź kursorem, aby podświetlić powiązania</p>
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/5">
          <canvas ref={ref} className="w-full h-[420px]" />
        </div>
      </div>
    </section>
  )
}
