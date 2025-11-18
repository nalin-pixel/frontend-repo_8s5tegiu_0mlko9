import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative min-h-[88vh] flex items-center" id="top">
      <div className="absolute inset-0">
        {mounted && (
          <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/90 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 py-24">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-white leading-tight">
            The best AI agents, skills and automations
          </h1>
          <p className="mt-6 text-lg text-slate-200/80 max-w-2xl">
            Curated, comparable, and measurable. Explore cutting‑edge agents, filter by skills, see what real problems they solve, and model ROI before you buy.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a href="#agents" className="px-5 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors">Browse Agents</a>
            <a href="#roi" className="px-5 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 text-white shadow-lg shadow-fuchsia-500/20">Estimate ROI</a>
          </div>
          <div className="mt-8 text-slate-400 text-sm">
            No boring UI. Smooth hover, scroll and depth.
          </div>
        </div>
        <div className="lg:col-span-5 lg:block hidden" />
      </div>
    </section>
  )
}
