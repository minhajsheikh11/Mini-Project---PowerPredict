import { useState } from 'react'
import { Zap, Wind, Flame, RefrigeratorIcon, Tv, Sun, Users, Calendar } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const SEASONS = ['summer', 'winter', 'monsoon', 'spring']

const APPLIANCES = [
  { key: 'ac_hours', label: 'Air Conditioner', icon: Wind, unit: 'hrs/day', min: 0, max: 24, step: 0.5, color: 'text-blue-400', hint: '1.5 kW' },
  { key: 'fan_hours', label: 'Fans', icon: Sun, unit: 'hrs/day', min: 0, max: 24, step: 0.5, color: 'text-sky-400', hint: '0.075 kW' },
  { key: 'heater_hours', label: 'Water Heater', icon: Flame, unit: 'hrs/day', min: 0, max: 12, step: 0.5, color: 'text-orange-400', hint: '1.2 kW' },
  { key: 'fridge_hours', label: 'Refrigerator', icon: RefrigeratorIcon, unit: 'hrs/day', min: 0, max: 24, step: 1, color: 'text-cyan-400', hint: '0.15 kW' },
  { key: 'washing_machine_hours', label: 'Washing Machine', icon: Zap, unit: 'hrs/day', min: 0, max: 6, step: 0.5, color: 'text-purple-400', hint: '0.5 kW' },
  { key: 'tv_hours', label: 'Television', icon: Tv, unit: 'hrs/day', min: 0, max: 16, step: 0.5, color: 'text-pink-400', hint: '0.1 kW' },
]

const defaultValues = {
  ac_hours: 6,
  ac_count:1,
  fan_hours: 8,
  fan_count:1,
  heater_hours:1,
  heater_count:1,
  fridge_hours: 24,
  fridge_count:1,
  washing_machine_hours: 1,
  wm_count:1,
  tv_hours: 4,
  tv_count:1,
  lights_count: 6,
  num_people: 3,
  season: 'summer',
}

export default function PredictionForm({ onResult }) {
  const [form, setForm] = useState(defaultValues)
  const [loading, setLoading] = useState(false)

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: Number(value) || value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload={
        ...form,
        ac_count:form.ac_count||1,
        fan_count:form.fan_count||1,
        heater_count:form.heater_count||1,
        fridge_count:form.fridge_count||1,
        wm_count:form.wm_count||1,

      }
      const res = await api.post('/predict', form)
      onResult(res.data)
      toast.success('Prediction ready! ⚡', { duration: 3000 })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-6 space-y-6">
      <div>
        <h2 className="font-display text-xl font-700 text-white mb-1">Appliance Usage</h2>
        <p className="text-sm text-slate-400">Drag sliders to set daily usage hours</p>
      </div>

      {/* Appliance sliders */}
      <div className="space-y-4">
        {APPLIANCES.map(({ key, label, icon: Icon, unit, min, max, step, color, hint }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                 <Icon size={14} className={color} />
                 <span className="text-slate-300">{label}</span>
                 <span className="text-slate-600 text-xs">{hint}</span>
               </div>

  {/* RIGHT SIDE: COUNT + HOURS */}
              <div className="flex items-center gap-3">

    {/* COUNT INPUT */}
                <input
                  type="number"
                  min="0"
                  value={form[key.replace('_hours', '_count')] || 1}
                  onChange={(e) =>
                   handleChange(
                   key.replace('_hours', '_count'),
                   Number(e.target.value)
                  )
      }
                 className="w-12 px-1 py-0.5 rounded bg-gray-800 text-white text-xs"
    />

    {/* HOURS DISPLAY */}
               <span className="font-mono text-volt-400 font-medium text-sm">
               {form[key]}
                <span className="text-slate-500 text-xs ml-1">{unit}</span>
              </span>

            </div>
</div>

{/* SLIDER */}
<input
  type="range"
  min={min}
  max={max}
  step={step}
  value={form[key]}
  onChange={(e) => handleChange(key, e.target.value)}
  className="w-full"
/>
          </div>
        ))}
      </div>

      {/* Bottom row — lights, people, season */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sun size={12} className="text-amber-400" /> Lights
          </label>
          <input
            type="number" min={1} max={30} value={form.lights_count}
            onChange={e => handleChange('lights_count', e.target.value)}
            className="input-dark w-full px-3 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={12} className="text-plasma-400" /> People
          </label>
          <input
            type="number" min={1} max={20} value={form.num_people}
            onChange={e => handleChange('num_people', e.target.value)}
            className="input-dark w-full px-3 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={12} className="text-volt-400" /> Season
          </label>
          <select
            value={form.season}
            onChange={e => handleChange('season', e.target.value)}
            className="input-dark w-full px-3 py-2.5 text-sm capitalize appearance-none cursor-pointer"
          >
            {SEASONS.map(s => (
              <option key={s} value={s} className="bg-gray-900 capitalize">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-volt w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Zap size={18} />
            Predict My Bill
          </>
        )}
      </button>
    </div>
  )
}
