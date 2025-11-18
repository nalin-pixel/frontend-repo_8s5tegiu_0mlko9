import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AgentsGrid from './components/AgentsGrid'
import SkillGraph from './components/SkillGraph'
import ROICalculator from './components/ROICalculator'
import Footer from './components/Footer'
import Reveal from './components/Reveal'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="fixed inset-0 -z-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(99,102,241,0.25),transparent),radial-gradient(900px_400px_at_60%_20%,rgba(217,70,239,0.18),transparent),radial-gradient(600px_300px_at_40%_80%,rgba(249,115,22,0.15),transparent)]" />

      <Navbar />
      <main className="relative">
        <Hero />
        <Reveal>
          <AgentsGrid />
        </Reveal>
        <Reveal delay={100}>
          <SkillGraph />
        </Reveal>
        <Reveal delay={150}>
          <ROICalculator />
        </Reveal>
        <Footer />
      </main>
    </div>
  )
}

export default App
