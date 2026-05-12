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

      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[#0f223b]/10">
        <motion.div className="h-full bg-gradient-to-r from-[#0058bc] via-[#4a9eff] to-[#9dc8ff]" style={{ width: progressWidth }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/70 border-b border-[#c7d2e3]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0058bc] to-[#2b8cff] flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_20px_rgba(0,88,188,0.35)]">
            CL
          </div>
          <span className="text-[14px] font-semibold text-[#0f223b]">Customer Lens</span>
        </div>
        <motion.a
          href="#login"
          onClick={e => {
            e.preventDefault()
            document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })
          }}
          whileHover={{ y: -1 }}
          className="focus-ring text-[13px] font-semibold text-[#0f223b]/85 hover:text-[#0f223b] border border-[#c1c6d7] bg-white px-4 py-1.5 rounded-full hover:border-[#717786] transition-colors"
        >
          Sign In →
        </motion.a>
      </nav>

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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f4f8fd] via-[#e8f0fa] to-[#d9e6f6] overflow-hidden">
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
          className={`absolute ${card.pos} bg-white/80 backdrop-blur-sm border border-[#c3d5eb] rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(18,41,70,0.14)]`}
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
        <div className="inline-flex items-center gap-2 bg-[#0058bc]/10 border border-[#0058bc]/25 rounded-full px-4 py-1.5 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc]">Club Apparel Group</span>
        </div>
        <h1 className="text-[64px] font-black tracking-tight leading-none text-[#0f223b] mb-4">
          Customer
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058bc] to-[#2f7fdd]">Lens</span>
        </h1>
        <p className="text-[16px] text-[#233b5a]/80 max-w-sm mx-auto">
          One platform. Every insight. All brands.
        </p>
        <div className="mt-8 text-[12px] text-[#233b5a]/45 uppercase tracking-widest animate-bounce">
          scroll to explore
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
    <div className="relative w-full h-full bg-gradient-to-br from-[#edf4fc] via-[#deebf8] to-[#d1e1f2] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">Metrics Explorer</div>
        <h2 className="text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
          See everything,
          <br />
          across every brand.
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full px-8">
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
    <div className="relative w-full h-full bg-gradient-to-br from-[#e8f1fb] via-[#dae8f7] to-[#ccddef] flex flex-col items-center justify-center overflow-hidden">
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
        <h2 className="text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
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
        className="w-full max-w-md mx-4 bg-white/85 border border-[#cdd9ea] rounded-2xl overflow-hidden backdrop-blur-sm"
      >
        <div className="bg-[#f5f9ff] px-4 py-3 border-b border-[#d6e0ef] flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#1a3656] uppercase tracking-wider">Campaign Builder</span>
          <div className="flex gap-1.5">
            {['Basics', 'Audience', 'Channel', 'Offer', 'Creative'].map((s, i) => (
              <span
                key={s}
                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                  i <= 1
                    ? 'bg-[#dff6f1] text-[#1f4a56] border border-[#b8ebe0]'
                    : i === 2
                      ? 'bg-[#e8f1ff] text-[#204c72] border border-[#c5daf8]'
                      : 'bg-white text-[#3f536f] border border-[#d6e0ef]'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-9 bg-white border border-[#d6e0ef] rounded-lg flex items-center px-3 text-[11px] text-[#3f536f]">
            Push · WhatsApp · Email
          </div>
          <div className="bg-white border border-[#d6e0ef] rounded-xl p-3">
            <div className="text-[22px] font-bold text-[#0f223b] tabular-nums">47,382</div>
            <div className="text-[10px] text-[#3f536f] font-medium">Audience size · Gold + Black members</div>
            <div className="flex gap-1 mt-2">
              <motion.div className="h-1.5 rounded bg-[#0058bc]" initial={{ width: 0 }} whileInView={{ width: '52%' }} transition={{ duration: 0.6, delay: 0.05 }} viewport={{ once: true }} />
              <motion.div className="h-1.5 rounded bg-[#7a45d3]" initial={{ width: 0 }} whileInView={{ width: '28%' }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} />
              <motion.div className="h-1.5 rounded bg-[#db7a00]" initial={{ width: 0 }} whileInView={{ width: '14%' }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }} />
              <motion.div className="h-1.5 rounded flex-1 bg-[#00a3a3]" initial={{ width: 0 }} whileInView={{ width: '6%' }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} />
            </div>
            <div className="text-[9px] text-[#3f536f] mt-1">Push · WhatsApp · Email · Undeliverable</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AISection() {
  const insights = [
    { type: 'critical', label: 'Critical', text: 'CA Conversion dropped 4.2pp in Dubai Mall — below threshold for 3rd consecutive week.', tone: 'bg-[#fff0e8] border-[#ffd7bf]', badge: 'bg-[#db7a00]/12 text-[#db7a00] border-[#db7a00]/20' },
    { type: 'ai', label: 'AI Insight', text: 'Footfall up 6% but conversion down 4pp — assortment issue, not pricing. Suggest targeted campaign.', tone: 'bg-[#f2edff] border-[#ddd2ff]', badge: 'bg-[#7a45d3]/12 text-[#7a45d3] border-[#7a45d3]/20' },
    { type: 'warning', label: 'Watchlist', text: 'Points Liability crossed AED 2.84M — up 5.3% vs last month. Ceiling breach expected in 18 days.', tone: 'bg-[#e8faf8] border-[#c7f0eb]', badge: 'bg-[#00a3a3]/12 text-[#008a79] border-[#00a3a3]/20' },
  ]

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#d9e8f7] via-[#c8ddf1] to-[#bad4ec] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1f3957] mb-2">AI Intelligence</div>
        <h2 className="text-[40px] font-black tracking-tight text-[#0f223b] leading-tight">
          Flags what matters,
          <br />
          before you ask.
        </h2>
      </div>

      <div className="space-y-3 max-w-lg w-full px-8">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            viewport={{ once: true }}
            className={`border rounded-xl p-4 shadow-[0_14px_30px_rgba(18,41,70,0.10)] ${ins.tone}`}
          >
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2 border ${ins.badge}`}>
              {ins.label}
            </div>
            <p className="text-[13px] font-medium text-[#2d405c] leading-relaxed">{ins.text}</p>
            <div className="text-[11px] text-[#0058bc] mt-2 font-semibold">→ View in Explorer</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DashboardBg() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#bed0e3] via-[#eaf1f9] to-[var(--color-background)]" />

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(0,88,188,0.25), transparent 40%)' }}
        animate={{ opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 opacity-65 flex justify-center pt-20">
        <div className="grid grid-cols-4 gap-3 w-full max-w-[760px] px-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/75 border border-[#d2d9e4] rounded-xl h-24 shadow-[0_2px_8px_rgba(22,42,66,0.05)]" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/90 to-transparent" />
    </div>
  )
}

function LoginCard({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl p-7 border border-outline shadow-[0_24px_70px_rgba(8,28,52,0.15)] bg-[var(--color-surface)]"
      style={{
        background: 'linear-gradient(170deg, rgba(255,255,255,0.96) 0%, rgba(247,250,255,0.98) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="relative mb-6">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl bg-[#0058bc]/25 pointer-events-none" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0058bc] to-[#2e8dff] flex items-center justify-center text-[15px] font-extrabold text-white shadow-[0_10px_26px_rgba(0,88,188,0.35)]">
            CL
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-[20px] font-bold text-on-surface tracking-tight">Welcome to Customer Lens</h2>
        <p className="text-[12px] text-outline-strong mt-1">Centralized analytics for Club Apparel</p>
      </div>

      <div className="mt-6 mb-5 h-px bg-gradient-to-r from-transparent via-outline to-transparent" />

      <div className="mb-4">
        <div className="text-[15px] font-semibold text-on-surface">Sign in</div>
        <p className="text-[12px] text-outline-strong mt-0.5">Use your organization account to continue</p>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        onClick={onLogin}
        className="focus-ring w-full h-11 rounded-xl flex items-center justify-center gap-3 text-[13px] font-semibold text-white transition-all shadow-[0_10px_28px_rgba(0,88,188,0.32)]"
        style={{ background: 'linear-gradient(135deg, #0058bc, #0070eb)' }}
      >
        <MicrosoftIcon />
        Continue with Microsoft
      </motion.button>

      <div className="mt-4 rounded-xl border border-outline bg-surface-low px-3 py-2.5">
        <div className="flex items-center justify-between text-[11px] text-outline-strong">
          <span>Secure SSO</span>
          <span>Role-based access</span>
          <span>Audit logging</span>
        </div>
      </div>

      <p className="text-[10px] text-outline-strong text-center mt-4 leading-relaxed">
        Access is managed by your organization.
        <br />
        Contact IT Admin for help.
      </p>
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
