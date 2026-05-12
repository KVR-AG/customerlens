import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

export function LoginPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const handleLogin = () => {
    if (isSigningIn) return
    setIsSigningIn(true)
    window.setTimeout(() => navigate('/home'), 380)
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto scroll-smooth bg-[#f1f5fb] text-[#0f223b]"
      aria-busy={isSigningIn}
      style={{ scrollSnapType: 'y mandatory' }}
    >
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[80] pointer-events-none"
        initial={{ opacity: 0 }}
        style={{
          background:
            'radial-gradient(120% 120% at 50% 0%, rgba(0,88,188,0.3) 0%, rgba(236,242,250,0.95) 58%, rgba(249,249,249,1) 100%)',
        }}
        animate={{ opacity: isSigningIn ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />



      <ParallaxSection id="hero">
        <HeroSection />
      </ParallaxSection>

      <ParallaxSection id="metrics-preview">
        <MetricsSection />
      </ParallaxSection>

      <ParallaxSection id="campaigns-preview">
        <CampaignsSection />
      </ParallaxSection>

      <ParallaxSection id="ai-preview">
        <AISection />
      </ParallaxSection>

      <section id="login" className="h-screen relative overflow-hidden flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
        <DashboardBg />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative z-10 w-full max-w-sm mx-4"
        >
          <LoginCard onLogin={handleLogin} />
        </motion.div>
      </section>
    </div>
  )
}

function ParallaxSection({ children, id }: { children: ReactNode; id: string }) {
  return (
    <section id={id} className="h-screen relative overflow-hidden flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
      {children}
    </section>
  )
}

function HeroSection() {
  const floatingCards = [
    { label: 'CA Revenue',    value: 'AED 139M', delta: '↑ 12.4%', pos: 'top-1/4 left-16',      up: true  },
    { label: 'Active Rate',   value: '42.1%',    delta: '↓ 1.4pp', pos: 'top-1/3 right-20',     up: false },
    { label: 'CA Base',       value: '1.24M',    delta: '↑ 8.2%',  pos: 'bottom-1/3 left-24',   up: true  },
    { label: 'CA Conversion', value: '34.8%',    delta: '↑ 1.2pp', pos: 'top-16 right-36',      up: true  },
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style={{ background: '#ffffff' }}>
      <motion.div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(0,112,235,0.5) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-28 right-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(94,92,230,0.38) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,112,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,235,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {floatingCards.map((card, i) => (
        <motion.div
          key={card.label}
          className={`hidden md:block absolute ${card.pos} bg-white/80 backdrop-blur-sm border border-[#c3d5eb] rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(18,41,70,0.14)]`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ delay: i * 0.15, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-[18px] font-bold text-[#0f223b] tabular-nums">{card.value}</div>
          <div className="text-[10px] text-[#4a6080] uppercase tracking-wider">{card.label}</div>
          <div className="text-[11px] font-semibold mt-0.5" style={{ color: card.up ? '#16a34a' : '#ef4444' }}>
            {card.delta}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 text-center">
        {/* Brand mark inline on hero */}
        {/* <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0058bc] to-[#2b8cff] flex items-center justify-center text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(0,88,188,0.35)]">
            CL
          </div>
          <span className="text-[15px] font-bold text-[#0f223b]">Customer Lens</span>
        </div> */}
        <h1 className="text-[40px] md:text-[64px] font-black tracking-tight leading-none text-[#0f223b] mb-4">
          Customer
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058bc] to-[#2f7fdd]">Lens</span>
        </h1>
        <p className="text-[16px] text-[#233b5a]/80 max-w-sm mx-auto">
          One platform. Every insight. All brands.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <motion.a
            href="#login"
            onClick={e => {
              e.preventDefault()
              document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #0052b0 0%, #0074e8 100%)', boxShadow: '0 8px 24px rgba(0,88,188,0.30)' }}
          >
            Sign In →
          </motion.a>
          <div className="text-[11px] text-[#233b5a]/40 uppercase tracking-widest animate-bounce">
            scroll to explore
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricsSection() {
  const metrics = [
    { label: 'Apparel Revenue', value: 'AED 203M', delta: '+10.2%', up: true  },
    { label: 'CA Revenue %',    value: '68.4%',     delta: '+3.1pp', up: true  },
    { label: 'CA Base Members', value: '1.24M',     delta: '+8.2%',  up: true  },
    { label: 'Active Rate',     value: '42.1%',     delta: '-1.4pp', up: false },
    { label: 'CA Conversion',   value: '34.8%',     delta: '+1.2pp', up: true  },
    { label: 'Points Liability',value: 'AED 2.84M', delta: '+5.3%',  up: true  },
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-y-auto" style={{ background: '#ffffff' }}>
      <div className="text-center pt-10 pb-6 px-8 sticky top-0 z-10 w-full" style={{ background: '#ffffff' }}>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">Metrics Explorer</div>
        <h2 className="text-[28px] md:text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
          See everything,
          <br />
          across every brand.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full px-8 pb-10">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            viewport={{ once: true }}
            className="bg-white/82 border border-[#cdd9ea] rounded-xl p-4 backdrop-blur-[2px]"
          >
            <div className="text-[20px] font-bold text-[#0f223b] tabular-nums">{m.value}</div>
            <div className="text-[10px] text-[#3f536f] uppercase tracking-wider mt-0.5">{m.label}</div>
            <div className="text-[12px] font-semibold mt-1" style={{ color: m.up ? '#16a34a' : '#ef4444' }}>
              {m.delta} vs LY
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CampaignsSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pt-16" style={{ background: '#ffffff' }}>
      <motion.div
        className="absolute -top-16 left-[12%] w-56 h-56 rounded-full blur-3xl bg-[#7a45d3]/20"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 right-[12%] w-56 h-56 rounded-full blur-3xl bg-[#00a3a3]/20"
        animate={{ y: [0, -16, 0], x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">Campaign Builder</div>
        <h2 className="text-[28px] md:text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
          From insight
          <br />
          to action in minutes.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
        className="w-full max-w-lg mx-4 bg-white/90 border border-[#cdd9ea] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,58,140,0.14)] backdrop-blur-sm"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f0f6ff] to-[#f5f9ff] px-5 pb-3 border-b border-[#d6e0ef]" style={{ paddingTop: '20px' }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb- 3">Campaign Builder</div>
            <div className="text-[11px] font-semibold text-[#0f223b] mb-3">Dubai Gold + Black — Re-engagement</div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              { label: 'Basics',   done: true },
              { label: 'Audience', done: true },
              { label: 'Channel',  active: true },
              { label: 'Offer',    done: false },
              { label: 'Creative', done: false },
            ].map((s) => (
              <span
                key={s.label}
                className="text-[9px] px-2.5 py-1 rounded-full font-semibold border flex-1 text-center whitespace-nowrap"
                style={{
                  background:  s.done ? '#dff6f1' : s.active ? '#e8f1ff' : '#f4f6fa',
                  color:       s.done ? '#137a60' : s.active ? '#204c72' : '#6b7a94',
                  borderColor: s.done ? '#b8ebe0' : s.active ? '#c5daf8' : '#d6e0ef',
                }}
              >
                {s.done ? '✓ ' : ''}{s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Channels */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6b7a94] mb-2">Channels</div>
            <div className="flex gap-2">
              {[
                { name: 'Push',      color: '#0058bc', bg: '#e8f1ff' },
                { name: 'WhatsApp',  color: '#16a34a', bg: '#dcfce7' },
                { name: 'Email',     color: '#7a45d3', bg: '#f2edff' },
              ].map(ch => (
                <div key={ch.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold" style={{ background: ch.bg, color: ch.color, borderColor: ch.color + '33' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ch.color }} />
                  {ch.name}
                </div>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="bg-[#f7faff] border border-[#d6e0ef] rounded-xl p-4">
            <div className="flex items-end justify-between mb-1">
              <div>
                <div className="text-[28px] font-black text-[#0f223b] tabular-nums leading-none">47,382</div>
                <div className="text-[10px] text-[#3f536f] font-medium mt-0.5">Audience · Gold + Black members</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold" style={{ color: '#16a34a' }}>~31,240</div>
                <div className="text-[9px] text-[#3f536f]">est. opens</div>
              </div>
            </div>
            <div className="flex rounded-full overflow-hidden h-2 mt-3 gap-px">
              <motion.div className="h-full rounded-l-full" style={{ background: '#0058bc' }} initial={{ width: 0 }} whileInView={{ width: '52%' }} transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }} />
              <motion.div className="h-full" style={{ background: '#7a45d3' }} initial={{ width: 0 }} whileInView={{ width: '28%' }} transition={{ duration: 0.7, delay: 0.18 }} viewport={{ once: true }} />
              <motion.div className="h-full" style={{ background: '#db7a00' }} initial={{ width: 0 }} whileInView={{ width: '14%' }} transition={{ duration: 0.7, delay: 0.26 }} viewport={{ once: true }} />
              <motion.div className="h-full rounded-r-full flex-1" style={{ background: '#d1d9e6' }} initial={{ width: 0 }} whileInView={{ width: '6%' }} transition={{ duration: 0.7, delay: 0.34 }} viewport={{ once: true }} />
            </div>
            <div className="flex gap-3 mt-2">
              {[['#0058bc','Push 52%'],['#7a45d3','WA 28%'],['#db7a00','Email 14%'],['#d1d9e6','Undeliv. 6%']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1 text-[9px] text-[#3f536f]">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>

          {/* Impact row */}
          <div className="flex gap-3">
            {[
              { label: 'Offer',       value: '15% off', sub: 'Loyalty reward' },
              { label: 'Send date',   value: 'Today',   sub: 'Optimal window' },
              { label: 'Exp. revenue',value: 'AED 2.1M',sub: '+4.4% lift' },
            ].map(item => (
              <div key={item.label} className="flex-1 bg-[#f7faff] border border-[#d6e0ef] rounded-lg px-3 py-2.5 text-center">
                <div className="text-[13px] font-bold text-[#0f223b]">{item.value}</div>
                <div className="text-[9px] text-[#3f536f] mt-0.5">{item.label}</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: '#16a34a' }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Launch button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0058bc, #0070eb)', boxShadow: '0 8px 24px rgba(0,88,188,0.28)' }}
          >
            <span>🚀</span> Launch Campaign
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function AISection() {
  const insights = [
    {
      label: 'Critical',
      icon: '⚠',
      metric: '−4.2pp',
      metricLabel: 'CA Conversion · Dubai Mall',
      text: 'Below threshold for 3rd consecutive week. Immediate action recommended.',
      time: '2 min ago',
      accentColor: '#e05400',
      bgColor: '#fff8f3',
      borderColor: '#ffd0a8',
      iconBg: '#fff0e0',
      pulse: true,
    },
    {
      label: 'AI Insight',
      icon: '✦',
      metric: '+6% / −4pp',
      metricLabel: 'Footfall up · Conversion down',
      text: 'Assortment gap detected — not a pricing issue. Targeted campaign suggested.',
      time: '8 min ago',
      accentColor: '#7a45d3',
      bgColor: '#f7f3ff',
      borderColor: '#ddd2ff',
      iconBg: '#ede8ff',
      pulse: false,
    },
    {
      label: 'Watchlist',
      icon: '◉',
      metric: 'AED 2.84M',
      metricLabel: 'Points Liability · +5.3% MoM',
      text: 'Ceiling breach expected in 18 days. Review redemption strategy.',
      time: '15 min ago',
      accentColor: '#008a79',
      bgColor: '#f0faf8',
      borderColor: '#b8ebe0',
      iconBg: '#dff6f1',
      pulse: false,
    },
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pt-12" style={{ background: '#ffffff' }}>
      <div className="text-center mb-7">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1f3957] mb-2">AI Intelligence</div>
        <h2 className="text-[28px] md:text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
          Flags what matters,
          <br />
          before you ask.
        </h2>
      </div>

      {/* Live summary bar */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 bg-white/70 border border-[#cdd9ea] rounded-full px-4 py-1.5 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0f223b]">
          <span className="w-2 h-2 rounded-full bg-[#e05400] inline-block" style={{ boxShadow: '0 0 0 3px rgba(224,84,0,0.2)' }} />
          3 active alerts
        </span>
        <span className="w-px h-3 bg-[#cdd9ea]" />
        <span className="text-[11px] text-[#3f536f]">2 need action</span>
        <span className="w-px h-3 bg-[#cdd9ea]" />
        <span className="text-[11px] text-[#3f536f]">Updated just now</span>
      </div>

      <div className="space-y-3 max-w-lg w-full px-8">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.label}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(18,41,70,0.10)] flex"
            style={{ background: ins.bgColor, border: `1px solid ${ins.borderColor}` }}
          >
            {/* Left accent stripe */}
            <div className="w-1 flex-shrink-0" style={{ background: ins.accentColor }} />

            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Icon */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
                    style={{ background: ins.iconBg, color: ins.accentColor }}>
                    {ins.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold" style={{ color: ins.accentColor }}>{ins.label}</span>
                      {ins.pulse && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: ins.accentColor }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: ins.accentColor }} />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#6b7a94] mt-0.5">{ins.time}</div>
                  </div>
                </div>
                {/* Metric callout */}
                <div className="text-right flex-shrink-0">
                  <div className="text-[15px] font-black tabular-nums" style={{ color: ins.accentColor }}>{ins.metric}</div>
                  <div className="text-[9px] text-[#6b7a94] leading-tight">{ins.metricLabel}</div>
                </div>
              </div>

              <p className="text-[12px] text-[#2d405c] leading-relaxed mt-2.5">{ins.text}</p>

              <div className="mt-2.5 flex items-center justify-between">
                <div className="text-[11px] font-semibold" style={{ color: ins.accentColor }}>
                  → View in Explorer
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DashboardBg() {
  return (
    <div className="absolute inset-0" style={{ background: '#ffffff' }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,88,188,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,88,188,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

function LoginCard({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl border shadow-[0_32px_80px_rgba(8,28,52,0.18)]"
      style={{
        background: 'linear-gradient(170deg, rgba(255,255,255,0.97) 0%, rgba(245,250,255,0.99) 100%)',
        borderColor: '#dce6f5',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Top brand band */}
      <div className="px-8 pt-9 pb-7 text-center border-b" style={{ borderColor: '#eaf0f9' }}>
        <div className="relative inline-flex mb-4">
          <div className="absolute -inset-2 rounded-2xl blur-xl opacity-30" style={{ background: '#0058bc' }} />
          {/* <div
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-[17px] font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, #0058bc 0%, #2e8dff 100%)', boxShadow: '0 12px 28px rgba(0,88,188,0.38)' }}
          >
            CL
          </div> */}
        </div>
        <h2 className="text-[22px] font-extrabold tracking-tight" style={{ color: '#0a1f3b' }}>
          Customer Lens
        </h2>
        <p className="text-[12px] mt-1.5 font-medium" style={{ color: '#5a7496' }}>
          Club Apparel Group · Unified Intelligence Platform
        </p>
        {/* <div className="flex items-center justify-center gap-2 mt-4">
          {['#0058bc','#7a45d3','#008a79','#db7a00','#c2478a'].map((c, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.65 }} />
          ))}
        </div> */}
      </div>

      {/* Sign-in body */}
      <div className="px-8 pt-6 pb-6" style={{ paddingTop: '20px' }}>
        <p className="text-[12px] mb-5 text-center" style={{ color: '#5a7496' }}>
          Use your organization account to continue
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={onLogin}
          className="focus-ring w-full rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #0052b0 0%, #0074e8 100%)', boxShadow: '0 10px 28px rgba(0,88,188,0.32)', height: '50px' }}
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </motion.button>

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: '🔒', label: 'Secure SSO' },
            { icon: '👤', label: 'Role-based' },
            { icon: '📋', label: 'Audit logs' },
          ].map(b => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1.5 rounded-xl border text-center"
              style={{ background: '#f6f9ff', borderColor: '#dce6f5', paddingTop: '10px', paddingBottom: '10px' }}
            >
              <span style={{ fontSize: '15px' }}>{b.icon}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#5a7496' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="px-8 pb-6 text-center">
        <p className="text-[10px] leading-relaxed" style={{ color: '#8fa4be' }}>
          Access is managed by your IT organization.{' '}
          <span className="font-semibold" style={{ color: '#5a7496' }}>Contact IT Admin</span> for help.
        </p>
      </div> */}
    </motion.div>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <rect width="10" height="10" fill="#f35426" />
      <rect x="11" width="10" height="10" fill="#7fba00" />
      <rect y="11" width="10" height="10" fill="#00a4ef" />
      <rect x="11" y="11" width="10" height="10" fill="#ffba00" />
    </svg>
  )
}
