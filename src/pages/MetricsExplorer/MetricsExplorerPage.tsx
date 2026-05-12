import { useState } from 'react'
import { TopBar } from '@/components/shell/TopBar'
import { ComparisonFrame } from '@/components/metrics/ComparisonFrame'
import { SparkLine } from '@/components/charts/SparkLine'
import { useLoyaltyMetrics, useRetailMetrics, useRfmSegments, useDemographics, useCxMetrics } from '@/hooks/useMetrics'
import { cn, formatAED, formatNumber, formatPct } from '@/lib/utils'
import { METRIC_DOMAINS } from '@/lib/constants'
import { RFM_SEGMENT_COLORS } from '@/lib/constants'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

type Period = 'YTD' | 'MTD' | 'WTD'
type Domain = typeof METRIC_DOMAINS[number]

export function MetricsExplorerPage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [activeTab, setActiveTab] = useState<Domain>(METRIC_DOMAINS[0])
  const [view, setView] = useState<'summary' | 'deep-dive'>('summary')
  const [notice, setNotice] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const loyaltyQuery = useLoyaltyMetrics()
  const retailQuery = useRetailMetrics()
  const rfmQuery = useRfmSegments()
  const demoQuery = useDemographics()
  const cxQuery = useCxMetrics()
  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 1500)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Metrics Explorer"
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: '+ New Filter', onClick: () => showNotice('Saved filter composer opens in full workspace mode') }}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile filter backdrop */}
        {filterOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setFilterOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left filter panel — desktop always visible, mobile slide-in drawer */}
        <aside className={cn(
          'flex-shrink-0 bg-surface border-r border-outline overflow-y-auto p-4 space-y-5 transition-transform duration-200',
          'fixed inset-y-0 left-0 z-40 w-[260px] lg:static lg:translate-x-0',
          filterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="flex items-center justify-between lg:hidden mb-2">
            <span className="text-[13px] font-bold text-on-surface">Filters</span>
            <button type="button" onClick={() => setFilterOpen(false)} className="focus-ring text-secondary text-[18px] w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-low">✕</button>
          </div>
          <FilterPanel />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Domain sub-tabs */}
          <div className="border-b border-outline bg-surface overflow-x-auto flex-shrink-0">
            <div className="flex gap-0 min-w-max px-4">
              {METRIC_DOMAINS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveTab(d)}
                  className={cn(
                    'focus-ring px-4 py-3 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors',
                    activeTab === d
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-secondary hover:text-on-surface'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-outline/40 bg-surface-low/50 flex-shrink-0">
            {/* Mobile Filters button */}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="focus-ring lg:hidden h-7 px-3 rounded-lg text-[11px] font-semibold border border-outline text-on-surface bg-surface hover:bg-surface-low transition-colors"
            >
              ⚙ Filters
            </button>
            <span className="text-[11px] text-outline-strong">View:</span>
            {(['summary', 'deep-dive'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  'focus-ring text-[11px] font-semibold px-3 py-1 rounded-md transition-colors',
                  view === v ? 'bg-primary text-white' : 'text-secondary hover:text-on-surface'
                )}
              >
                {v === 'summary' ? 'Summary' : 'Deep Dive'}
              </button>
            ))}
            <div className="ml-auto text-[11px] text-primary min-h-4">{notice}</div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-5">
            <DomainContent
              tab={activeTab}
              view={view}
              loyalty={loyaltyQuery.data}
              retail={retailQuery.data}
              rfm={rfmQuery.data}
              demo={demoQuery.data}
              cx={cxQuery.data}
              loadingByDomain={{
                'Sales & Conversion': retailQuery.isLoading,
                'Loyalty Membership': loyaltyQuery.isLoading,
                Engagement: loyaltyQuery.isLoading,
                'Points Economics': loyaltyQuery.isLoading,
                'Customer Economics': loyaltyQuery.isLoading,
                'Margin & Pricing': retailQuery.isLoading,
                'Stock Health': retailQuery.isLoading,
                'RFM & Segments': rfmQuery.isLoading,
                Demographics: demoQuery.isLoading,
                CX: cxQuery.isLoading,
              }}
              errorByDomain={{
                'Sales & Conversion': retailQuery.isError,
                'Loyalty Membership': loyaltyQuery.isError,
                Engagement: loyaltyQuery.isError,
                'Points Economics': loyaltyQuery.isError,
                'Customer Economics': loyaltyQuery.isError,
                'Margin & Pricing': retailQuery.isError,
                'Stock Health': retailQuery.isError,
                'RFM & Segments': rfmQuery.isError,
                Demographics: demoQuery.isError,
                CX: cxQuery.isError,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterPanel() {
  const [notice, setNotice] = useState('')

  return (
    <>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-2">Granularity</div>
        <div className="flex flex-wrap gap-1.5">
          {['Group', 'Brand', 'Country', 'City', 'Mall', 'Store'].map((g, i) => (
            <button
              key={g}
              type="button"
              className={cn(
                'focus-ring text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors',
                i === 0 ? 'bg-primary text-white' : 'bg-surface-low text-secondary hover:bg-surface-high'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-2">Brand</div>
        {['All Brands', 'Centrepoint', 'Splash', 'Babyshop', 'Shoemart', 'Aldo'].map((b, i) => (
          <label key={b} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" defaultChecked={i === 0} className="accent-primary w-3.5 h-3.5" />
            <span className="text-[12px] text-on-surface-var">{b}</span>
          </label>
        ))}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-2">Tier</div>
        {['All Tiers', 'Silver', 'Gold', 'Black'].map((t, i) => (
          <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" defaultChecked={i === 0} className="accent-primary w-3.5 h-3.5" />
            <span className="text-[12px] text-on-surface-var">{t}</span>
          </label>
        ))}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-2">Geography</div>
        {['All Markets', 'UAE', 'KSA', 'Kuwait', 'Bahrain', 'Qatar'].map((c, i) => (
          <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" defaultChecked={i === 0} className="accent-primary w-3.5 h-3.5" />
            <span className="text-[12px] text-on-surface-var">{c}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setNotice('Current filter snapshot saved for demo')
          window.setTimeout(() => setNotice(''), 1400)
        }}
        className="focus-ring w-full text-[12px] font-semibold text-primary border border-primary rounded-lg py-2 hover:bg-primary hover:text-white transition-colors"
      >
        + Save Current Filters
      </button>
      {notice && <p className="text-[11px] text-primary">{notice}</p>}
    </>
  )
}

function DomainContent({ tab, view, loyalty, retail, rfm, demo, cx, loadingByDomain, errorByDomain }: any) {
  if (loadingByDomain?.[tab]) {
    return (
      <div className="flex items-center justify-center h-40 text-outline-strong text-[13px]">
        Loading {tab.toLowerCase()} metrics…
      </div>
    )
  }

  if (errorByDomain?.[tab]) {
    return (
      <div className="flex items-center justify-center h-40 text-[13px] text-negative">
        Could not load metrics for this domain. Please retry in a moment.
      </div>
    )
  }

  if (tab === 'Sales & Conversion' && retail) {
    const metrics = [
      retail.totalRevenue,
      retail.footfall,
      retail.conversionRate,
      retail.aov,
      retail.asp,
      retail.upt,
    ]
    return <MetricGrid metrics={metrics} view={view} />
  }

  if (tab === 'Loyalty Membership' && loyalty) {
    return <MetricGrid metrics={[
      loyalty.caBase, loyalty.caSilver, loyalty.caGold, loyalty.caBlack,
      loyalty.caRevenue, loyalty.caRevenuePct, loyalty.caConversion, loyalty.newEnrolments,
    ]} view={view} />
  }

  if (tab === 'Engagement' && loyalty) {
    return <MetricGrid metrics={[loyalty.activeRate, loyalty.memberFreq, loyalty.brandsPerMember]} view={view} />
  }

  if (tab === 'Points Economics' && loyalty) {
    return <MetricGrid metrics={[
      loyalty.issuedPoints, loyalty.redeemedPoints, loyalty.liabilityPoints,
      loyalty.pointsLiabilityAed, loyalty.redemptionRate, loyalty.breakageRate,
    ]} view={view} />
  }

  if (tab === 'Customer Economics' && loyalty) {
    return <MetricGrid metrics={[
      loyalty.loyaltyAspc, loyalty.loyaltyActf, loyalty.loyaltyAtv,
      loyalty.repeatRevenue, loyalty.newRevenue,
    ]} view={view} />
  }

  if (tab === 'Margin & Pricing' && retail) {
    return <MetricGrid metrics={[retail.gm, retail.gmPct, retail.amdPct, retail.fullPriceSalePct]} view={view} />
  }

  if (tab === 'Stock Health' && retail) {
    return <MetricGrid metrics={[retail.weekCover, retail.sellThroughRate, retail.agedStockPct]} view={view} />
  }

  if (tab === 'RFM & Segments' && rfm) {
    return <RFMTab rfm={rfm} />
  }

  if (tab === 'Demographics' && demo) {
    return <DemographicsTab demo={demo} />
  }

  if (tab === 'CX' && cx) {
    return <CXTab cx={cx} />
  }

  return (
    <div className="flex items-center justify-center h-40 text-outline-strong text-[13px]">
      No metrics available for this selection yet.
    </div>
  )
}

function MetricGrid({ metrics, view }: { metrics: any[]; view: string }) {
  if (view === 'summary') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.filter(Boolean).map((m, i) => (
          <MetricCard key={i} metric={m} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {metrics.filter(Boolean).map((m, i) => (
        <MetricDeepDive key={i} metric={m} />
      ))}
    </div>
  )
}

function MetricCard({ metric }: { metric: any }) {
  const formatted = metric.format === 'aed'
    ? formatAED(metric.value, true)
    : metric.format === 'pct'
      ? formatPct(metric.value)
      : formatNumber(metric.value, true)

  const delta = metric.comparison.lyLflDelta
  const isPos = metric.invertedSentiment ? delta < 0 : delta >= 0

  return (
    <div className="card p-4 space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-outline-strong">{metric.label}</div>
      <div className="metric-value text-[20px] md:text-[24px] text-on-surface">{formatted}</div>
      <div className={cn('text-[12px] font-medium', isPos ? 'delta-positive' : 'delta-negative')}>
        {delta >= 0 ? '+' : ''}{delta.toFixed(1)}{metric.comparison.unit === 'pp' ? 'pp' : '%'} vs LY LFL
      </div>
      <ComparisonFrame comparison={metric.comparison} />
      <SparkLine data={metric.sparkline} positive={isPos} className="mt-1" />
    </div>
  )
}

function MetricDeepDive({ metric }: { metric: any }) {
  const formatted = metric.format === 'aed'
    ? formatAED(metric.value, true)
    : metric.format === 'pct'
      ? formatPct(metric.value)
      : formatNumber(metric.value, true)

  const chartData = metric.sparkline?.map((v: number, i: number) => ({
    week: `W${i + 1}`,
    value: v,
  })) ?? []

  const isPos = metric.comparison.lyLflDelta >= 0

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4 mb-4">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-wider text-outline-strong mb-1">{metric.label}</div>
          <div className="metric-value text-[24px] md:text-[32px] text-on-surface">{formatted}</div>
          <div className={cn('text-[13px] font-medium mt-1', isPos ? 'delta-positive' : 'delta-negative')}>
            {metric.comparison.lyLflDelta >= 0 ? '+' : ''}{metric.comparison.lyLflDelta.toFixed(1)}
            {metric.comparison.unit === 'pp' ? 'pp' : '%'} vs LY LFL
          </div>
        </div>
        <div className="flex-1">
          <ComparisonFrame comparison={metric.comparison} />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={40} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #c1c6d7' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPos ? '#1e7a3c' : '#ba1a1a'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function RFMTab({ rfm }: { rfm: any[] }) {
  return (
    <div className="space-y-5">
      <div className="card p-4">
        <h3 className="text-[13px] font-semibold text-on-surface mb-3">Segment Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rfm.map(seg => (
            <div key={seg.name} className="bg-surface-low rounded-xl p-3 text-center">
              <div className="text-[20px] font-bold tabular-nums" style={{ color: RFM_SEGMENT_COLORS[seg.name] }}>
                {formatNumber(seg.count, true)}
              </div>
              <div className="text-[11px] text-on-surface-var mt-0.5">{seg.name}</div>
              <div className={cn('text-[11px] font-semibold mt-1', seg.trend >= 0 ? 'delta-positive' : 'delta-negative')}>
                {seg.trend >= 0 ? '+' : ''}{seg.trend.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-[13px] font-semibold text-on-surface mb-3">Segment Share</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rfm} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v.toFixed(0)}%`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(1)}%`, 'Share']}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
              {rfm.map(seg => (
                <Cell key={seg.name} fill={RFM_SEGMENT_COLORS[seg.name] ?? '#0058bc'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DemographicsTab({ demo }: { demo: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="card p-4">
        <h3 className="text-[13px] font-semibold mb-3">Gender Split</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={demo.genderSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`}>
              {demo.genderSplit.map((_: any, i: number) => (
                <Cell key={i} fill={i === 0 ? '#0058bc' : '#e74c3c'} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4">
        <h3 className="text-[13px] font-semibold mb-3">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={demo.ageSlab}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="value" fill="#0058bc" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4 col-span-1 sm:col-span-2">
        <h3 className="text-[13px] font-semibold mb-3">Top Nationalities</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={demo.topNationalities} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="value" fill="#0058bc" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CXTab({ cx }: { cx: any }) {
  const npsData = cx.nps.trend.map((v: number, i: number) => ({ month: `M${i + 1}`, nps: v }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="card p-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-1">NPS Score</div>
        <div className="text-[32px] md:text-[48px] font-black tabular-nums text-on-surface">{cx.nps.value}</div>
        <div className="text-[12px] text-outline-strong">Net Promoter Score</div>
        <div className="mt-2 text-[12px] font-semibold delta-positive">+4 vs LY</div>
      </div>
      <div className="card p-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-1">CSAT</div>
        <div className="text-[32px] md:text-[48px] font-black tabular-nums text-on-surface">{cx.csat.value}<span className="text-[20px] md:text-[24px] text-outline-strong">/5</span></div>
        <div className="text-[12px] text-outline-strong">Customer Satisfaction</div>
        <div className="mt-2 text-[12px] font-semibold delta-positive">+0.2 vs LY</div>
      </div>
      <div className="card p-5 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-outline-strong mb-1">CES</div>
        <div className="text-[32px] md:text-[48px] font-black tabular-nums text-on-surface">{cx.ces.value}<span className="text-[20px] md:text-[24px] text-outline-strong">/5</span></div>
        <div className="text-[12px] text-outline-strong">Customer Effort Score</div>
        <div className="mt-2 text-[12px] font-semibold delta-positive">+0.1 vs LY</div>
      </div>

      <div className="card p-4 col-span-1 sm:col-span-2">
        <h3 className="text-[13px] font-semibold mb-3">NPS Trend (12 months)</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={npsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} domain={[30, 55]} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Line type="monotone" dataKey="nps" stroke="#0058bc" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5">
        <div className="text-[13px] font-semibold mb-3">Social Sentiment</div>
        <div className="space-y-3">
          {[
            { label: 'Positive', value: cx.socialSentiment.positive, color: '#1e7a3c' },
            { label: 'Neutral',  value: cx.socialSentiment.neutral,  color: '#717786' },
            { label: 'Negative', value: cx.socialSentiment.negative, color: '#ba1a1a' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-on-surface-var">{s.label}</span>
                <span className="font-semibold tabular-nums" style={{ color: s.color }}>{s.value}%</span>
              </div>
              <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
