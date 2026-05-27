import { Link } from 'react-router-dom'
import { Zap, TrendingDown, Shield, BarChart3, ChevronRight, Cpu } from 'lucide-react'

const FEATURES = [
  {
    icon: Cpu,
    title: 'Random Forest AI',
    desc: 'Trained on 5,000+ Indian household consumption patterns with 99.3% accuracy.',
    color: 'text-volt-400',
    glow: 'rgba(34,197,94,0.15)',
  },
  {
    icon: TrendingDown,
    title: 'Cost Optimizer',
    desc: 'Understand which appliances drain the most. Cut bills by up to 30%.',
    color: 'text-plasma-400',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT-protected accounts. Your data stays yours, always encrypted.',
    color: 'text-amber-400',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: BarChart3,
    title: 'Prediction History',
    desc: 'Track monthly estimates over time. Spot trends across all seasons.',
    color: 'text-blue-400',
    glow: 'rgba(96,165,250,0.15)',
  },
]

const STATS = [
  { value: '99.3%', label: 'Model Accuracy' },
  { value: '₹0', label: 'Cost to Use' },
  { value: '7', label: 'Appliances Tracked' },
  { value: '<1s', label: 'Prediction Time' },
]

export default function Landing() {
  return (
    <div className="bg-mesh min-h-screen">
      {/* Background orbs */}
      <div className="orb w-96 h-96 top-20 -left-20 bg-volt-500/10" />
      <div className="orb w-64 h-64 top-40 right-10 bg-plasma-500/10" />
      <div className="orb w-80 h-80 bottom-0 left-1/2 bg-amber-500/5" />

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-volt-400 font-mono mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-volt-400 animate-pulse" />
          AI-powered · Fast · Accurate 
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-800 leading-tight text-white mb-6 animate-slide-up">
          Know your bill<br />
          <span className="gradient-text">before it arrives.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Enter your appliance usage, and our AI instantly predicts your monthly electricity
          bill — tailored to Indian tariff slabs and seasonal demand patterns.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
          <Link to="/signup"
            className="btn-volt inline-flex items-center gap-2 px-8 py-4 text-base rounded-2xl">
            <Zap size={20} />
            Predict My Bill Free
          </Link>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-base rounded-2xl glass text-slate-300 hover:text-white hover:border-white/15 transition-all">
            Already have an account
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 animate-fade-in">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass p-5 text-center glass-hover">
              <div className="stat-badge gradient-text text-3xl sm:text-4xl">{value}</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
            Everything you need to
            <span className="gradient-text"> save more</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Built for Indian households. Tuned for accuracy across all seasons and climates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, glow }) => (
            <div key={title}
              className="glass glass-hover p-6 relative overflow-hidden group cursor-default">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                style={{ background: glow }}>
                <Icon size={20} />
              </div>
              <h3 className="font-display font-700 text-white text-lg mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="glass p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #22c55e, transparent 60%)' }} />
          <h2 className="font-display text-3xl font-700 text-white mb-3 relative z-10">
            Start predicting today.
          </h2>
          <p className="text-slate-400 mb-6 relative z-10">
            Predict your bills in seconds.
          </p>
          <Link to="/signup"
            className="btn-volt inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base relative z-10">
            <Zap size={18} /> Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm">
        <span className="font-display">© 2026 PowerPredict</span> · All rights reserved.
        <span className="text-volt-600 ml-1">⚡</span>
      </footer>
    </div>
  )
}
