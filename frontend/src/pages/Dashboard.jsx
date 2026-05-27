import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PredictionForm from '../components/PredictionForm'
import { ResultCard, HistoryChart } from '../components/PredictionChart'
import api from '../api/axios'
import {
  Zap, TrendingUp, Clock, Award, RefreshCw,
  ChevronRight, IndianRupee, Activity
} from 'lucide-react'

function HistoryTable({ history }) {
  if (!history.length) return (
    <div className="glass p-8 text-center text-slate-500">
      <Zap size={32} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm">No predictions yet. Run your first prediction!</p>
    </div>
  )

  return (
    <div className="glass overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-display font-600 text-white text-sm">Recent Predictions</h3>
        <span className="text-xs text-slate-500">{history.length} records</span>
      </div>
      <div className="divide-y divide-white/5">
        {history.slice(0, 8).map((h, i) => (
          <div key={h.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/2 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-volt-500/10 flex items-center justify-center text-volt-400">
                <Zap size={13} />
              </div>
              <div>
                <p className="text-sm text-white capitalize">{h.season} · {h.num_people} people</p>
                <p className="text-xs text-slate-500">
                  {new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-volt-400 font-medium">₹{h.predicted_bill.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-slate-500">{h.predicted_units.toFixed(0)} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history')
      setHistory(res.data)
    } catch {
      // handled by interceptor
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const handleResult = (data) => {
    setResult(data)
    setHistory(prev => [data, ...prev.filter(h => h.id !== data.id)])
  }

  // Summary stats
  const avgBill = history.length
    ? (history.reduce((s, h) => s + h.predicted_bill, 0) / history.length).toFixed(0)
    : null
  const maxBill = history.length
    ? Math.max(...history.map(h => h.predicted_bill)).toFixed(0)
    : null
  const avgUnits = history.length
    ? (history.reduce((s, h) => s + h.predicted_units, 0) / history.length).toFixed(0)
    : null

  return (
    <div className="bg-mesh min-h-screen pt-28 pb-16 px-4">
      <div className="orb w-80 h-80 top-0 left-0 bg-volt-500/6" />
      <div className="orb w-60 h-60 bottom-20 right-0 bg-plasma-500/6" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-slate-400 text-sm font-mono mb-1">Good day ⚡</p>
            <h1 className="font-display text-3xl sm:text-4xl font-700 text-white">
              {user?.name?.split(' ')[0]}'s Dashboard
            </h1>
          </div>
          <button onClick={fetchHistory}
            className="glass glass-hover p-2.5 rounded-xl text-slate-400 hover:text-volt-400 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
            {[
              { label: 'Avg Bill', value: `₹${Number(avgBill).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-volt-400' },
              { label: 'Peak Bill', value: `₹${Number(maxBill).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-amber-400' },
              { label: 'Avg Units', value: `${avgUnits} kWh`, icon: Activity, color: 'text-plasma-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass p-4 text-center glass-hover">
                <Icon size={16} className={`${color} mx-auto mb-2`} />
                <div className={`font-mono font-medium text-lg ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — form */}
          <div className="space-y-4 animate-slide-up">
            <PredictionForm onResult={handleResult} />
          </div>

          {/* Right — result + charts */}
          <div className="space-y-4 animate-slide-up">
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="glass p-10 text-center flex flex-col items-center justify-center min-h-64">
                <div className="w-16 h-16 rounded-full bg-volt-500/10 flex items-center justify-center mb-4 animate-pulse-slow">
                  <Zap size={28} className="text-volt-400" />
                </div>
                <h3 className="font-display text-lg font-600 text-white mb-2">Ready to predict</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  Set your appliance hours on the left, then hit <span className="text-volt-400">Predict My Bill</span>.
                </p>
              </div>
            )}

            {/* History chart */}
            {history.length >= 2 && <HistoryChart history={history} />}
          </div>
        </div>

        {/* History table */}
        <div className="mt-6 animate-fade-in">
          {loadingHistory ? (
            <div className="glass p-8 text-center">
              <div className="w-5 h-5 border-2 border-volt-500/30 border-t-volt-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <HistoryTable history={history} />
          )}
        </div>
      </div>
    </div>
  )
}
