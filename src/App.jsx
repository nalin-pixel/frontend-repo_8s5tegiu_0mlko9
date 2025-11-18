import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AgentsGrid from './components/AgentsGrid'
import SkillGraph from './components/SkillGraph'
import ROICalculator from './components/ROICalculator'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import Compare from './components/Compare'
import AuthModal from './components/AuthModal'
import { useState } from 'react'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="fixed inset-0 -z-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(99,102,241,0.25),transparent),radial-gradient(900px_400px_at_60%_20%,rgba(217,70,239,0.18),transparent),radial-gradient(600px_300px_at_40%_80%,rgba(249,115,22,0.15),transparent)]" />

      <Navbar />
      <main className="relative">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-end">
          <button onClick={()=>setAuthOpen(true)} className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white">Zaloguj / Zarejestruj</button>
        </div>
        <Reveal>
          <AgentsGrid />
        </Reveal>
        <Reveal delay={100}>
          <SkillGraph />
        </Reveal>
        <Reveal delay={120}>
          <Compare />
        </Reveal>
        <Reveal delay={150}>
          <ROICalculator />
        </Reveal>
        <Footer />
      </main>

      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthed={()=>setAuthOpen(false)} />
    </div>
  )
}

export default App
