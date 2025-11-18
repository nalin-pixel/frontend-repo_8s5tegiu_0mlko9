export default function Footer(){
  return (
    <footer className="relative py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} AgentVerse. Built for explorers of applied AI.</p>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-white">Back to top</a>
            <a href="#agents" className="hover:text-white">Agents</a>
            <a href="#roi" className="hover:text-white">ROI</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
