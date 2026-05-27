import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart, Legend
} from 'recharts'

const SEASON_COLORS = {
  summer: '#f59e0b',
  winter: '#60a5fa',
  monsoon: '#34d399',
  spring: '#a78bfa',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-3 py-2 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-mono">
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ResultCard({ result }) {
  if (!result) return null

  const breakdown = [
    { name: 'AC', units: (result.ac_hours * 1.5 * 30).toFixed(1) },
    { name: 'Heater', units: (result.heater_hours * 1.2 * 30).toFixed(1) },
    { name: 'Fridge', units: (result.fridge_hours * 0.15 * 30).toFixed(1) },
    { name: 'W.Machine', units: (result.washing_machine_hours * 0.5 * 30).toFixed(1) },
    { name: 'Fan', units: (result.fan_hours * 0.075 * 30).toFixed(1) },
    { name: 'TV', units: (result.tv_hours * 0.1 * 30).toFixed(1) },
    { name: 'Lights', units: (result.lights_count * 0.01 * 6 * 30).toFixed(1) },
  ].sort((a, b) => b.units - a.units)

  const seasonColor = SEASON_COLORS[result.season] || '#22c55e'

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Big result */}
      <div className="glass p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(circle at 50% 50%, ${seasonColor}, transparent 70%)` }} />
        <p className="text-sm text-slate-400 mb-1 uppercase tracking-widest font-mono">Monthly Estimate</p>
        <div className="stat-badge gradient-text text-5xl mb-1">
          ₹{result.predicted_bill.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
        <p className="text-slate-400 text-sm">
          <span className="text-volt-400 font-mono font-medium">{result.predicted_units.toFixed(1)}</span> units consumed
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
          style={{ background: `${seasonColor}20`, color: seasonColor, border: `1px solid ${seasonColor}40` }}>
          <span className="capitalize">{result.season} season</span>
          <span>·</span>
          <span>{result.num_people} people</span>
          <span>·</span>
          <span>{result.lights_count} lights</span>
        </div>
      </div>

      {/* Appliance breakdown chart */}
      <div className="glass p-5">
        <h3 className="font-display text-sm font-600 text-white mb-4">Appliance Breakdown</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={breakdown} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="units" fill="#22c55e" radius={[4, 4, 0, 0]}
              label={false}
              opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 text-center mt-1">Units (kWh) per appliance per month</p>
      </div>
    </div>
  )
}

export function HistoryChart({ history }) {
  if (!history || history.length === 0) return null

  const data = [...history].reverse().map((h, i) => ({
    name: `#${i + 1}`,
    units: parseFloat(h.predicted_units.toFixed(1)),
    bill: parseFloat(h.predicted_bill.toFixed(0)),
    season: h.season,
  }))

  return (
    <div className="glass p-5">
      <h3 className="font-display text-sm font-600 text-white mb-4">Prediction History</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="billGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="bill" name="Bill (₹)"
            stroke="#22c55e" strokeWidth={2}
            fill="url(#billGrad)" dot={{ fill: '#22c55e', r: 4 }}
          />
          <Line
            type="monotone" dataKey="units" name="Units (kWh)"
            stroke="#a78bfa" strokeWidth={1.5} dot={false} strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 text-center mt-1">Last {data.length} predictions</p>
    </div>
  )
}
