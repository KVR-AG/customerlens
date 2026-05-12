import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

export function LoginPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const handleLogin = () => navigate('/home')

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-[#080c14] text-white scroll-smooth"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5">
        <motion.div className="h-full bg-gradient-to-r from-[#0058bc] via-[#4a9eff] to-[#7eb3ff]" style={{ width: progressWidth }} />
      </div>

      {/* Sticky top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0058bc] to-[#2b8cff] flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_20px_rgba(0,88,188,0.45)]">CL</div>
          <span className="text-[14px] font-semibold text-white/80">Customer Lens</span>
        </div>
        <motion.a
          href="#login"
          onClick={e => { e.preventDefault(); document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' }) }}
          whileHover={{ y: -1 }}
          className="text-[13px] font-semibold text-white/70 hover:text-white border border-white/20 bg-white/[0.03] px-4 py-1.5 rounded-full hover:border-white/40 transition-colors"
        >
          Sign In →
        </motion.a>
      </nav>

      {/* Section 1: Hero */}
      <ParallaxSection id="hero" index={0} scrollYProgress={scrollYProgress}>
        <HeroSection />
      </ParallaxSection>

      {/* Section 2: Metrics */}
      <ParallaxSection id="metrics-preview" index={1} scrollYProgress={scrollYProgress}>
        <MetricsSection />
      </ParallaxSection>

      {/* Section 3: Campaigns */}
      <ParallaxSection id="campaigns-preview" index={2} scrollYProgress={scrollYProgress}>
        <CampaignsSection />
      </ParallaxSection>

      {/* Section 4: AI Insights */}
      <ParallaxSection id="ai-preview" index={3} scrollYProgress={scrollYProgress}>
        <AISection />
      </ParallaxSection>

      {/* Section 5: Login */}
      <section
        id="login"
        className="h-screen relative overflow-hidden flex items-end justify-center pb-16"
        style={{ scrollSnapAlign: 'start' }}
      >
        <DashboardBg />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative z-10 w-full max-w-sm mx-4"
        >
          <LoginCard onLogin={handleLogin} />
        </motion.div>
      </section>
    </div>
  )
}

/* ── Parallax wrapper ── */
function ParallaxSection({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
  index: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  return (
    <section
      id={id}
      className="h-screen relative overflow-hidden flex items-center justify-center"
      style={{ scrollSnapAlign: 'start' }}
    >
      {children}
    </section>
  )
}

/* ── Hero Section ── */
function HeroSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#050d1f] via-[#0a1830] to-[#0d1e3a] overflow-hidden">
      {/* Aurora lights */}
      <motion.div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(0,112,235,0.7) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-28 right-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(94,92,230,0.7) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,88,188,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,88,188,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Subtle scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(transparent 95%, rgba(255,255,255,0.22) 100%)', backgroundSize: '100% 4px' }}
      />

      {/* Floating metric cards */}
      {[
        { label: 'CA Revenue', value: 'AED 139M', delta: '↑ 12.4%', pos: 'top-1/4 left-16' },
        { label: 'Active Rate', value: '42.1%', delta: '↓ 1.4pp', pos: 'top-1/3 right-20' },
        { label: 'CA Base', value: '1.24M', delta: '↑ 8.2%', pos: 'bottom-1/3 left-24' },
        { label: 'CA Conversion', value: '34.8%', delta: '↑ 1.2pp', pos: 'top-16 right-36' },
      ].map((card, i) => (
        <motion.div
          key={card.label}
          className={`absolute ${card.pos} bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ delay: i * 0.15, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-[18px] font-bold text-white tabular-nums">{card.value}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">{card.label}</div>
          <div className={`text-[11px] font-semibold mt-0.5 ${card.delta.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
            {card.delta}
          </div>
        </motion.div>
      ))}

      {/* Central content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#0058bc]/20 border border-[#0058bc]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7eb3ff]">Club Apparel Group</span>
          </div>
          <h1 className="text-[64px] font-black tracking-tight leading-none text-white mb-4">
            Customer<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9eff] to-[#8cc8ff]">Lens</span>
          </h1>
          <p className="text-[16px] text-white/50 max-w-sm mx-auto">
            One platform. Every insight. All brands.
          </p>
          <div className="mt-8 text-[12px] text-white/25 uppercase tracking-widest animate-bounce">
            ↓ scroll to explore
          </div>
        </motion.div>
      </div>

      {/* Scroll dots */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`rounded-full ${i === 0 ? 'w-1.5 h-4 bg-[#0058bc]' : 'w-1.5 h-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  )
}

/* ── Metrics Preview Section ── */
function MetricsSection() {
  const metrics = [
    { label: 'Apparel Revenue', value: 'AED 203M', delta: '+10.2%', pos: true },
    { label: 'CA Revenue %', value: '68.4%', delta: '+3.1pp', pos: true },
    { label: 'CA Base Members', value: '1.24M', delta: '+8.2%', pos: true },
    { label: 'Active Rate', value: '42.1%', delta: '-1.4pp', pos: false },
    { label: 'CA Conversion', value: '34.8%', delta: '+1.2pp', pos: true },
    { label: 'Points Liability', value: 'AED 2.84M', delta: '+5.3%', pos: false },
  ]

  return (
    <div className="relative w-full h-full bg-[#070b13] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">Metrics Explorer</div>
        <h2 className="text-[40px] font-black tracking-tight text-white leading-tight">
          See everything,<br />across every brand.
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full px-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/4 border border-white/8 rounded-xl p-4"
          >
            <div className="text-[20px] font-bold text-white tabular-nums">{m.value}</div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{m.label}</div>
            <div className={`text-[12px] font-semibold mt-1 ${m.pos ? 'text-green-400' : 'text-red-400'}`}>
              {m.delta} vs LY
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Campaigns Preview Section ── */
function CampaignsSection() {
  return (
    <div className="relative w-full h-full bg-[#060b14] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">Campaign Builder</div>
        <h2 className="text-[40px] font-black tracking-tight text-white leading-tight">
          From insight<br />to action in minutes.
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-md mx-4 bg-white/3 border border-white/8 rounded-2xl overflow-hidden"
      >
        <div className="bg-white/4 px-4 py-3 border-b border-white/6 flex items-center justify-between">
          <span className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Campaign Builder</span>
          <div className="flex gap-1.5">
            {['Basics ✓', 'Audience ✓', 'Channel', 'Offer', 'Creative'].map((s, i) => (
              <span
                key={s}
                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                  s.endsWith('✓')
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : i === 2
                      ? 'bg-[#0058bc]/25 text-[#7eb3ff] border border-[#0058bc]/35'
                      : 'bg-white/4 text-white/25 border border-white/8'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-9 bg-white/4 border border-white/8 rounded-lg flex items-center px-3 text-[11px] text-white/30">
            Push · WhatsApp · Email
          </div>
          <div className="bg-[#0058bc]/10 border border-[#0058bc]/20 rounded-xl p-3">
            <div className="text-[22px] font-bold text-white tabular-nums">47,382</div>
            <div className="text-[10px] text-white/35">Audience size · Gold + Black members</div>
            <div className="flex gap-1 mt-2">
              <div className="h-1.5 rounded w-[52%] bg-[#0058bc]" />
              <div className="h-1.5 rounded w-[28%] bg-green-400" />
              <div className="h-1.5 rounded w-[14%] bg-amber-400" />
              <div className="h-1.5 rounded flex-1 bg-red-400" />
            </div>
            <div className="text-[9px] text-white/25 mt-1">Push · WhatsApp · Email · Undeliverable</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── AI Insights Section ── */
function AISection() {
  const insights = [
    { type: 'critical', label: '🔴 Critical', text: 'CA Conversion dropped 4.2pp in Dubai Mall — below threshold for 3rd consecutive week.' },
    { type: 'ai', label: '✦ AI Insight', text: 'Footfall up 6% but conversion down 4pp — assortment issue, not pricing. Suggest targeted campaign.' },
    { type: 'warning', label: '🟠 Warning', text: 'Points Liability crossed AED 2.84M — up 5.3% vs last month. Ceiling breach expected in 18 days.' },
  ]

  return (
    <div className="relative w-full h-full bg-[#06090f] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0058bc] mb-2">AI Intelligence</div>
        <h2 className="text-[40px] font-black tracking-tight text-white leading-tight">
          Flags what matters,<br />before you ask.
        </h2>
      </div>

      <div className="space-y-3 max-w-lg w-full px-8">
        {insights.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/3 border border-white/8 rounded-xl p-4"
          >
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${
              ins.type === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
              ins.type === 'ai' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' :
              'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}>
              {ins.label}
            </div>
            <p className="text-[12px] text-white/55 leading-relaxed">{ins.text}</p>
            <div className="text-[11px] text-[#4a9eff] mt-2 font-semibold">→ View in Explorer</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Dashboard Background (Concept C) ── */
function DashboardBg() {
  return (
    <div className="absolute inset-0">
      {/* Ambient moving glow */}
      <motion.div
        className="absolute inset-0 opacity-35"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(0,88,188,0.6), transparent 40%)' }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(0,88,188,0.4) 0%, transparent 70%)' }}
      />

      {/* Blurred dashboard tiles */}
      <div className="absolute inset-0 opacity-20" style={{ filter: 'blur(2px)' }}>
        <div className="grid grid-cols-4 gap-3 p-8 pt-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/8 rounded-xl h-24" />
          ))}
        </div>
        <div className="mx-8 grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white/4 border border-white/6 rounded-xl h-36" />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#080c14] via-[#080c14]/80 to-transparent" />
    </div>
  )
}

/* ── Login Card ── */
function LoginCard({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl p-7 border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.52)]"
      style={{
        background: 'linear-gradient(160deg, rgba(20,24,38,0.95) 0%, rgba(12,15,26,0.96) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="relative mb-6">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl bg-[#0058bc]/35 pointer-events-none" />
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0058bc] to-[#2e8dff] flex items-center justify-center text-[15px] font-extrabold text-white shadow-[0_10px_26px_rgba(0,88,188,0.5)]">
            CL
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-[20px] font-bold text-white tracking-tight">Welcome to Customer Lens</h2>
        <p className="text-[12px] text-white/50 mt-1">Centralized analytics for Club Apparel</p>
      </div>

      <div className="mt-6 mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mb-4">
        <div className="text-[15px] font-semibold text-white">Sign in</div>
        <p className="text-[12px] text-white/45 mt-0.5">Use your organization account to continue</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        onClick={onLogin}
        className="w-full h-11 rounded-xl flex items-center justify-center gap-3 text-[13px] font-semibold text-white transition-all shadow-[0_10px_28px_rgba(0,88,188,0.5)]"
        style={{ background: 'linear-gradient(135deg, #0058bc, #0070eb)' }}
      >
        <MicrosoftIcon />
        Continue with Microsoft
      </motion.button>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <div className="flex items-center justify-between text-[11px] text-white/60">
          <span>Secure SSO</span>
          <span>Role-based access</span>
          <span>Audit logging</span>
        </div>
      </div>

      <p className="text-[10px] text-white/30 text-center mt-4 leading-relaxed">
        Access is managed by your organization.<br />
        Contact IT Admin for help.
      </p>
    </motion.div>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
      <rect width="10" height="10" fill="#f35426" />
      <rect x="11" width="10" height="10" fill="#7fba00" />
      <rect y="11" width="10" height="10" fill="#00a4ef" />
      <rect x="11" y="11" width="10" height="10" fill="#ffba00" />
    </svg>
  )
}
