import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

// A high-contrast, animated "AI Automation Network" showcasing flowing data and orbiting skills
// Canvas-based for performance; graceful on hover + subtle parallax on scroll

const GROUPS = {
  sales: { colorA: '#6366F1', colorB: '#22D3EE', ring: 110, speed: 0.00035 },
  support: { colorA: '#A78BFA', colorB: '#F472B6', ring: 170, speed: 0.00028 },
  ops: { colorA: '#F59E0B', colorB: '#F43F5E', ring: 230, speed: 0.00022 },
  research: { colorA: '#34D399', colorB: '#10B981', ring: 290, speed: 0.00018 },
}

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
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [scrollY, setScrollY] = useState(0)

  const nodeMap = useMemo(() => new Map(NODES.map(n => [n.id, n])), [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    let raf = 0
    let start = performance.now()

    const resize = () => {
      const rect = el.getBoundingClientRect()
      el.width = Math.max(1, Math.floor(rect.width * dpr))
      el.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = new Array(90).fill(0).map((_, i) => ({
      angle: Math.random() * Math.PI * 2,
      radius: 40 + Math.random() * 300,
      speed: 0.0003 + Math.random() * 0.0008,
      size: 1 + Math.random() * 1.5,
      hue: 250 + Math.random() * 100,
    }))

    const nodeAngles = new Map()
    NODES.forEach((n, i) => {
      const base = (i / NODES.length) * Math.PI * 2
      nodeAngles.set(n.id, base)
    })

    const getCenter = () => {
      const rect = el.getBoundingClientRect()
      return { x: rect.width / 2, y: rect.height / 2 }
    }

    const getNodePos = (id, t) => {
      const n = nodeMap.get(id)
      const g = GROUPS[n.group]
      const base = nodeAngles.get(id)
      const angle = base + t * g.speed * 2 * Math.PI
      const cx = getCenter().x
      const cy = getCenter().y + Math.sin(t * 0.0005) * 10 // subtle float
      return {
        x: cx + Math.cos(angle) * g.ring,
        y: cy + Math.sin(angle) * g.ring,
      }
    }

    const drawGlowCircle = (x, y, r, colorA, colorB) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6)
      g.addColorStop(0, `${colorA}AA`)
      g.addColorStop(1, `${colorB}00`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r * 1.6, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (now) => {
      const t = now - start
      const rect = el.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // background vignette
      const vg = ctx.createRadialGradient(rect.width/2, rect.height/2, 0, rect.width/2, rect.height/2, Math.max(rect.width, rect.height))
      vg.addColorStop(0, 'rgba(15,23,42,0)')
      vg.addColorStop(1, 'rgba(15,23,42,0.35)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, rect.width, rect.height)

      const c = getCenter()

      // animated core with rings
      for (let i = 0; i < 3; i++) {
        const r = 28 + i * 16 + Math.sin(t * 0.002 + i) * 2
        ctx.strokeStyle = `rgba(148,163,184,${0.2 - i*0.04})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      drawGlowCircle(c.x, c.y, 26 + Math.sin(t * 0.003) * 2, '#8B5CF6', '#22D3EE')
      ctx.fillStyle = '#E5E7EB'
      ctx.font = '600 14px Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Rdzeń AI', c.x, c.y - 38)

      // flowing particles to core
      particles.forEach(p => {
        p.angle += p.speed
        const px = c.x + Math.cos(p.angle) * p.radius
        const py = c.y + Math.sin(p.angle) * p.radius
        ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, 0.7)`
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // links with animated dashes
      ctx.lineWidth = 1.2
      LINKS.forEach(([a, b], idx) => {
        const pa = getNodePos(a, t)
        const pb = getNodePos(b, t)
        const mid = { x: (pa.x + pb.x)/2 + Math.sin(t*0.001 + idx) * 20, y: (pa.y + pb.y)/2 + Math.cos(t*0.0012 + idx) * 20 }
        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y)
        grad.addColorStop(0, 'rgba(99,102,241,0.65)')
        grad.addColorStop(1, 'rgba(236,72,153,0.65)')
        ctx.strokeStyle = grad
        ctx.setLineDash([6, 10])
        ctx.lineDashOffset = (t * 0.06) % 16
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.quadraticCurveTo(mid.x, mid.y, pb.x, pb.y)
        ctx.stroke()
        ctx.setLineDash([])
      })

      // nodes
      NODES.forEach(n => {
        const g = GROUPS[n.group]
        const p = getNodePos(n.id, t)
        // glow + dot
        drawGlowCircle(p.x, p.y, 8, g.colorA, g.colorB)
        const r = hover === n.id ? 8 : 6 + Math.sin(t*0.003 + p.x*0.03) * 1.2
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24)
        grad.addColorStop(0, g.colorA + 'FF')
        grad.addColorStop(1, g.colorB + '30')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()

        // label
        ctx.fillStyle = 'rgba(241,245,249,0.95)'
        ctx.font = '500 12px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, p.x, p.y - 16)
      })

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMouse({ x, y })
      // hit test against dynamic positions
      const now = performance.now()
      const t = now - start
      let found = null
      NODES.forEach(n => {
        const p = (function(){
          const g = GROUPS[n.group]
          const base = (NODES.indexOf(n) / NODES.length) * Math.PI * 2
          const angle = base + t * g.speed * 2 * Math.PI
          const cx = rect.width / 2
          const cy = rect.height / 2 + Math.sin(t * 0.0005) * 10
          return { x: cx + Math.cos(angle) * g.ring, y: cy + Math.sin(angle) * g.ring }
        })()
        const dx = p.x - x
        const dy = p.y - y
        if (Math.sqrt(dx*dx + dy*dy) < 14) {
          found = n.id
        }
      })
      setHover(found)
    }

    const onLeave = () => setHover(null)
    const onResize = () => resize()

    window.addEventListener('resize', onResize)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [nodeMap])

  // Parallax on scroll (small translate to increase depth)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="graph" className="relative py-24">
      {/* animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-25 animate-pulse"
             style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.65), transparent)' }} />
        <div className="absolute top-1/3 -right-16 h-96 w-96 rounded-full blur-3xl opacity-25 animate-[pulse_6s_ease-in-out_infinite]"
             style={{ background: 'radial-gradient(closest-side, rgba(236,72,153,0.55), transparent)' }} />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-25 animate-[pulse_7s_ease-in-out_infinite]"
             style={{ background: 'radial-gradient(closest-side, rgba(249,115,22,0.55), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Sieć automatyzacji AI
          </h2>
          <p className="text-slate-300 text-sm">Ruch danych, orbitujące umiejętności, żywe połączenia</p>
        </div>

        <div ref={wrapRef} className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {/* glossy top-line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          {/* shimmering diagonal */}
          <div className="absolute -inset-y-10 -left-10 w-1/2 rotate-12 opacity-10 bg-gradient-to-b from-white/20 to-transparent" />

          <div
            className="relative"
            style={{ transform: `translateY(${Math.min(1, scrollY/600) * -6}px)`, transition: 'transform 120ms linear' }}
          >
            <canvas ref={canvasRef} className="w-full h-[520px]" />
          </div>

          {/* hover tooltip */}
          {hover && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-6 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-900 bg-white shadow-lg shadow-fuchsia-500/10 border border-white/80"
              style={{ left: mouse.x, top: mouse.y }}
            >
              {NODES.find(n => n.id === hover)?.label}
            </div>
          )}

          {/* bottom gradient edge */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
