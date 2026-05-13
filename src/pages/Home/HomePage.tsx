import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { KPITile } from '@/components/metrics/KPITile'
import { AlertCard } from '@/components/alerts/AlertCard'
import { InsightCard } from '@/components/alerts/InsightCard'
import { Tooltip } from '@/components/ui/Tooltip'
import { useLoyaltyMetrics, useRfmSegments } from '@/hooks/useMetrics'
import { useAlerts, useAiInsights } from '@/hooks/useAlerts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { usePersona } from '@/hooks/usePersona'
import { cn, formatNumber } from '@/lib/utils'
import { STATUS_LABELS, STATUS_COLORS } from '@/data/campaigns'

type Period = 'YTD' | 'MTD' | 'WTD'

// ─── Segment bucketing config ────────────────────────────────────────────────
const SEGMENT_BUCKETS = [
  {
    key: 'healthy',
    label: 'Healthy Core',
    sublabel: 'Champions · Loyal Customers',
    segments: ['Champions', 'Loyal Customers'],
    tooltip: 'Your most valuable customers — frequent buyers who spent recently. Champions are your top RFM scorers (highest recency, frequency & spend). Loyal Customers buy regularly but slightly less so. Losing one here costs far more than acquiring ten new Silver members. Focus: rewards, VIP access, early launches.',
    colorClass: 'text-[#1e7a3c]',
    bgClass: 'bg-[#f0faf4] border-[#a7d9b8]',
    dotColor: '#1e7a3c',
    action: 'Retain & reward',
    actionPath: '/metrics?tab=rfm',
  },
  {
    key: 'pipeline',
    label: 'Growth Pipeline',
    sublabel: 'Potential Loyalists · Promising · New',
    segments: ['Potential Loyalists', 'Promising', 'New Customers'],
    tooltip: 'Customers who show loyalty intent but haven\'t fully committed yet. New Customers just enrolled. Promising ones have visited a couple of times. Potential Loyalists are one or two purchases away from being regulars. A well-timed nudge — tier upgrade incentive, bonus points, cross-brand offer — can convert this group into your Healthy Core.',
    colorClass: 'text-[#0058bc]',
    bgClass: 'bg-[#f0f4ff] border-[#a7bfed]',
    dotColor: '#0058bc',
    action: 'Nurture to loyal',
    actionPath: '/campaigns',
  },
  {
    key: 'atrisk',
    label: 'Needs Intervention',
    sublabel: 'At Risk · Hibernating · Lost',
    segments: ['At Risk', 'Hibernating', 'Lost Customers'],
    tooltip: 'At Risk: were once active but are lapsing now — act fast. Hibernating: no purchase in many months, still reachable. Lost: likely churned. Every day without action reduces win-back probability. A targeted re-engagement offer (bonus points, personalised discount) now is cheaper than re-acquiring them cold later.',
    colorClass: 'text-[#ba1a1a]',
    bgClass: 'bg-[#fff4f4] border-[#f5aaaa]',
    dotColor: '#ba1a1a',
    action: 'Win-back campaign',
    actionPath: '/actions',
  },
] as const

// ─── Tier config ─────────────────────────────────────────────────────────────
const TIER_CONFIG = [
  {
    label: 'Silver',
    key: 'caSilver',
    color: '#94a3b8',
    tooltip: 'Entry-level loyalty tier — the largest segment by volume. Watch Active Rate and tier-upgrade pace here. High Silver count with low upgrade rate signals the programme isn\'t driving deeper engagement.',
  },
  {
    label: 'Gold',
    key: 'caGold',
    color: '#f59e0b',
    tooltip: 'Mid-tier loyalty members with meaningful spend. Strong Gold growth signals that Silver tier-nudge campaigns are working. Gold members typically spend 2–3× more per visit than Silver.',
  },
  {
    label: 'Black',
    key: 'caBlack',
    color: '#1e293b',
    tooltip: 'Top-tier members — highest ASPC, strongest brand advocacy, and lowest churn risk. A growing Black tier is one of the best leading indicators of loyalty programme health. Treat them as VIPs: they drive disproportionate revenue.',
  },
] as const

// ─── Page ────────────────────────────────────────────────────────────────────
export function HomePage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [refreshCursor, setRefreshCursor] = useState(0)
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false)
  const navigate = useNavigate()
  const { persona } = usePersona()
  const { data: loyalty } = useLoyaltyMetrics()
  const { data: rfm } = useRfmSegments()
  const { data: alertsData } = useAlerts()
  const { data: insights } = useAiInsights()
  const { data: campaigns } = useCampaigns()

  // Customer-centric KPIs — same for every persona, always about the customer
  const kpis = loyalty
    ? [
        { metric: loyalty.caBase,        description: "Total registered loyalty members across all brands. Watch this alongside Active Rate — a growing base with a falling active rate means you're filling a leaky bucket." },
        { metric: loyalty.activeRate,     description: "% of CA members who made at least one purchase this period. The single most important engagement health signal. A declining rate means members are drifting — act before they become At Risk." },
        { metric: loyalty.newEnrolments,  description: "New members who joined the programme this period. If enrolments are high but total base isn't growing, you have a retention problem — people are joining and leaving at the same pace." },
        { metric: loyalty.caConversion,   description: "% of CA members who visited a store AND purchased. Higher than overall store conversion proves loyalty ROI. A drop here often signals an assortment gap in a specific brand or market." },
        { metric: loyalty.loyaltyAspc,    description: "Average Spend Per Customer among loyalty members (CA Revenue ÷ Active Members). Compare this against non-member ASPC — the gap is your programme's monetary justification." },
        { metric: loyalty.redemptionRate, description: "% of issued points that members have redeemed. Too low means members don't find the programme rewarding. Too high pressures your points liability ceiling." },
      ]
    : []

  const topAlerts = alertsData?.slice(0, 3) ?? []
  const rotatedInsights = insights?.length
    ? [...insights.slice(refreshCursor % insights.length), ...insights.slice(0, refreshCursor % insights.length)]
    : []
  const topInsights = rotatedInsights.slice(0, 2)
  const pendingCampaigns = campaigns?.filter(c => ['submitted', 'under_review', 'approved'].includes(c.status)) ?? []

  const handleRefreshInsights = () => {
    if (!insights?.length || isRefreshingInsights) return
    setIsRefreshingInsights(true)
    setTimeout(() => { setRefreshCursor(c => c + 1); setIsRefreshingInsights(false) }, 350)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: '+ New Campaign', onClick: () => navigate('/campaigns') }}
        secondaryAction={{ label: 'Export PDF', onClick: () => window.print() }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ── Section label ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-outline-strong">
            Customer Health Overview
          </span>
          <span className="text-[10px] text-outline-strong bg-surface-low border border-outline rounded-full px-2 py-0.5">
            {period}
          </span>
        </div>

        {/* ── 6 Customer KPI Tiles ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map(({ metric, description }, i) => metric && (
            <KPITile
              key={i}
              metric={metric as any}
              description={description}
              onClick={() => navigate('/metrics')}
            />
          ))}
        </div>

        {/* ── Customer Segments Snapshot ─────────────────────────────────── */}
        {rfm && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline-strong">
                Customer Segment Health
              </span>
              <button
                type="button"
                onClick={() => navigate('/metrics')}
                className="focus-ring text-[11px] text-primary font-semibold hover:underline"
              >
                Full RFM View →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SEGMENT_BUCKETS.map(bucket => {
                const bucketSegs = rfm.filter(s => bucket.segments.includes(s.name as any))
                const totalCount = bucketSegs.reduce((a, s) => a + s.count, 0)
                const totalBase = rfm.reduce((a, s) => a + s.count, 0)
                const pct = ((totalCount / totalBase) * 100).toFixed(1)
                const avgTrend = bucketSegs.reduce((a, s) => a + s.trend, 0) / bucketSegs.length
                const isPos = avgTrend >= 0

                return (
                  <button
                    key={bucket.key}
                    type="button"
                    onClick={() => navigate(bucket.actionPath)}
                    className={cn(
                      'focus-ring text-left card p-4 border rounded-xl card-hover',
                      bucket.bgClass
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bucket.dotColor }} />
                          <span className={cn('text-[12px] font-bold', bucket.colorClass)}>
                            {bucket.label}
                          </span>
                          <Tooltip text={bucket.tooltip} position="bottom" />
                        </div>
                        <div className="text-[10px] text-outline-strong pl-3.5">{bucket.sublabel}</div>
                      </div>
                      <div className={cn(
                        'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                        isPos ? 'bg-positive-bg text-positive delta-positive' : 'bg-negative-bg text-negative delta-negative'
                      )}>
                        {isPos ? '+' : ''}{avgTrend.toFixed(1)}%
                      </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-[20px] font-bold tabular-nums text-on-surface">
                          {formatNumber(totalCount, true)}
                        </div>
                        <div className="text-[11px] text-outline-strong">{pct}% of CA base</div>
                      </div>
                      <div className={cn(
                        'text-[11px] font-semibold rounded-lg px-2.5 py-1',
                        bucket.colorClass,
                        'bg-white/60'
                      )}>
                        {bucket.action} →
                      </div>
                    </div>

                    {/* Mini bar showing individual segment sizes */}
                    <div className="mt-3 flex gap-0.5 h-1.5 rounded-full overflow-hidden">
                      {bucketSegs.map(s => (
                        <div
                          key={s.name}
                          className="h-full rounded-full"
                          style={{
                            width: `${(s.count / totalCount) * 100}%`,
                            background: bucket.dotColor,
                            opacity: 0.4 + (bucketSegs.indexOf(s) / bucketSegs.length) * 0.6,
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5 flex gap-2 flex-wrap">
                      {bucketSegs.map(s => (
                        <span key={s.name} className="text-[10px] text-outline-strong">
                          {s.name}: {formatNumber(s.count, true)}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Tier Momentum ─────────────────────────────────────────────── */}
        {loyalty && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-outline-strong mb-3">
              Tier Momentum
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TIER_CONFIG.map((tier) => {
                const { label, key, color, tooltip } = tier
                const m = loyalty[key] as any
                if (!m) return null
                const delta = m.comparison.lyLflDelta
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigate('/metrics')}
                    className="focus-ring card p-3 text-left card-hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
                        {label}
                      </span>
                      <Tooltip text={tooltip} />
                    </div>
                    <div className="text-[18px] font-bold tabular-nums text-on-surface">
                      {formatNumber(m.value, true)}
                    </div>
                    <div className={cn('text-[11px] font-semibold mt-0.5', delta >= 0 ? 'delta-positive' : 'delta-negative')}>
                      {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs LY LFL
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Alerts + AI Insights ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-negative" aria-hidden="true" />
                Alerts
                <span className="text-[11px] font-normal text-outline-strong">{topAlerts.length} active</span>
              </h3>
              <button type="button" onClick={() => navigate('/actions')} className="focus-ring text-[11px] text-primary font-semibold hover:underline">
                View all →
              </button>
            </div>
            <div>
              {topAlerts.length > 0 ? (
                topAlerts.map(a => <AlertCard key={a.id} alert={a} compact />)
              ) : (
                <div className="rounded-lg border border-dashed border-outline px-3 py-4 text-[12px] text-outline-strong">
                  No active alerts right now. You are in a healthy operating window.
                </div>
              )}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface">AI Insights</h3>
              <button
                type="button"
                onClick={handleRefreshInsights}
                disabled={!insights?.length || isRefreshingInsights}
                className="focus-ring text-[11px] text-outline-strong hover:text-on-surface disabled:opacity-60"
              >
                {isRefreshingInsights ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            <div className="space-y-3">
              {topInsights.length > 0 ? (
                topInsights.map(ins => <InsightCard key={ins.id} insight={ins} />)
              ) : (
                <div className="rounded-lg border border-dashed border-outline px-3 py-4 text-[12px] text-outline-strong">
                  No AI insights available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Campaign Requests (Brand / Operator) ──────────────────────── */}
        {(persona.id === 'brand_head' || persona.id === 'operator') && pendingCampaigns.length > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface">Campaign Requests</h3>
              <button type="button" onClick={() => navigate('/campaigns')} className="focus-ring text-[11px] text-primary font-semibold hover:underline">
                View all →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pendingCampaigns.map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => navigate('/campaigns')}
                  className="focus-ring flex items-center gap-2 bg-surface-low rounded-lg px-3 py-2 cursor-pointer hover:bg-surface-high transition-colors"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: c.brandColor }} />
                  <span className="text-[12px] font-medium text-on-surface">{c.name}</span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[c.status])}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Pending Approval Banner (CLO) ─────────────────────────────── */}
        {persona.id === 'clo' && pendingCampaigns.length > 0 && (
          <button
            type="button"
            className="focus-ring w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl px-5 py-4 text-white cursor-pointer hover:opacity-90 transition-opacity text-left bg-primary"
            onClick={() => navigate('/campaigns')}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/80" aria-hidden="true" />
            <div>
              <div className="text-[13px] font-semibold">
                {pendingCampaigns.filter(c => c.status === 'submitted' || c.status === 'under_review').length} campaign requests pending your approval
              </div>
              <div className="text-[11px] opacity-70 mt-0.5">
                {pendingCampaigns.map(c => c.brand).join(' · ')} — avg SLA 38h
              </div>
            </div>
            <div className="sm:ml-auto bg-white/20 rounded-lg px-4 py-1.5 text-[12px] font-semibold">
              View Queue →
            </div>
          </button>
        )}

      </main>
    </div>
  )
}
