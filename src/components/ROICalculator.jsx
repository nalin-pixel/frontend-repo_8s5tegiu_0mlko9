import { useMemo, useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'

function format(n) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

export default function ROICalculator() {
  const [monthlyCost, setMonthlyCost] = useState(149)
  const [hoursSaved, setHoursSaved] = useState(40)
  const [hourlyRate, setHourlyRate] = useState(45)
  const [conversionLift, setConversionLift] = useState(8)
  const [monthlyRevenue, setMonthlyRevenue] = useState(20000)

  const result = useMemo(() => {
    const productivity = hoursSaved * hourlyRate
    const uplift = (conversionLift / 100) * monthlyRevenue
    const benefit = productivity + uplift
    const roi = benefit - monthlyCost
    const ratio = monthlyCost > 0 ? (benefit / monthlyCost) : 0
    return { productivity, uplift, benefit, roi, ratio }
  }, [monthlyCost, hoursSaved, hourlyRate, conversionLift, monthlyRevenue])

  return (
    <section id="roi" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Calculator className="h-5 w-5" /> ROI Calculator</h2>
          <p className="text-slate-300 text-sm">Estimate monthly ROI of an AI agent</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm text-slate-300 mb-1">Agent monthly cost ($)</div>
                <input type="number" value={monthlyCost} onChange={e => setMonthlyCost(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-sm text-slate-300 mb-1">Hours saved / month</div>
                <input type="number" value={hoursSaved} onChange={e => setHoursSaved(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-sm text-slate-300 mb-1">Avg hourly rate ($)</div>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
              </label>
              <label className="block">
                <div className="text-sm text-slate-300 mb-1">Conversion lift (%)</div>
                <input type="number" value={conversionLift} onChange={e => setConversionLift(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
              </label>
              <label className="block col-span-2">
                <div className="text-sm text-slate-300 mb-1">Monthly revenue impacted ($)</div>
                <input type="number" value={monthlyRevenue} onChange={e => setMonthlyRevenue(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 focus:outline-none" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid grid-cols-2 gap-4 text-slate-200">
              <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                <div className="text-sm text-slate-300">Productivity</div>
                <div className="text-2xl font-semibold">${format(result.productivity)}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                <div className="text-sm text-slate-300">Revenue uplift</div>
                <div className="text-2xl font-semibold">${format(result.uplift)}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                <div className="text-sm text-slate-300">Total benefit</div>
                <div className="text-2xl font-semibold">${format(result.benefit)}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                <div className="text-sm text-slate-300">Net ROI</div>
                <div className="text-2xl font-semibold">${format(result.roi)}</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 p-4 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-orange-400/10">
              <div className="text-slate-200">
                <div className="text-sm">Benefit / Cost</div>
                <div className="text-2xl font-semibold">{result.ratio.toFixed(2)}x</div>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
