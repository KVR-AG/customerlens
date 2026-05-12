import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { KPITile } from '@/components/metrics/KPITile'
import { AlertCard } from '@/components/alerts/AlertCard'
import { InsightCard } from '@/components/alerts/InsightCard'
import { useLoyaltyMetrics, useRetailMetrics, useStoreLeague } from '@/hooks/useMetrics'
import { useAlerts, useAiInsights } from '@/hooks/useAlerts'
import { useCampaigns } from '@/hooks/useCampaigns'
import { usePersona } from '@/hooks/usePersona'
import { cn, formatAED, formatPct } from '@/lib/utils'
import { STATUS_LABELS, STATUS_COLORS } from '@/data/campaigns'

type Period = 'YTD' | 'MTD' | 'WTD'

export function HomePage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const navigate = useNavigate()
  const { persona } = usePersona()
  const { data: loyalty } = useLoyaltyMetrics()
  const { data: retail } = useRetailMetrics()
  const { data: alertsData } = useAlerts()
  const { data: insights } = useAiInsights()
  const { data: campaigns } = useCampaigns()
  const { data: stores } = useStoreLeague()

  // Persona-specific KPI sets
  const getKPIs = () => {
    if (!loyalty || !retail) return []
    switch (persona.id) {
      case 'ceo':
        return [retail.totalRevenue, loyalty.caRevenuePct, loyalty.activeRate, loyalty.pointsLiabilityAed, loyalty.caBase]
      case 'brand_head':
        return [retail.totalRevenue, retail.gmPct, loyalty.caConversion, loyalty.loyaltyAspc, loyalty.caBase]
      case 'country_head':
        return [retail.totalRevenue, retail.footfall, retail.conversionRate, loyalty.caRevenuePct, loyalty.activeRate]
      case 'clo':
        return [loyalty.caRevenue, loyalty.activeRate, loyalty.pointsLiabilityAed, loyalty.caBase, loyalty.redemptionRate]
      case 'operator':
        return [loyalty.caConversion, loyalty.activeRate, loyalty.newEnrolments, loyalty.caRevenue, loyalty.pointsLiabilityAed]
      default:
        return [loyalty.caRevenue, loyalty.caRevenuePct, loyalty.caConversion, loyalty.activeRate, loyalty.caBase]
    }
  }

  const kpis = getKPIs()
  const topAlerts = alertsData?.slice(0, 3) ?? []
  const topInsights = insights?.slice(0, 2) ?? []
  const pendingCampaigns = campaigns?.filter(c => ['submitted', 'under_review', 'approved'].includes(c.status)) ?? []
  const topStores = stores?.slice(0, 5) ?? []
  const bottomStores = stores?.slice(5) ?? []
  const showLeague = persona.id === 'ceo' || persona.id === 'country_head'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: '+ New Campaign', onClick: () => navigate('/campaigns') }}
        secondaryAction={{ label: 'Export PDF', onClick: () => {} }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPI Tiles */}
        <div className="grid grid-cols-5 gap-3">
          {kpis.map((m, i) => m && (
            <KPITile
              key={i}
              metric={m as any}
              onClick={() => navigate('/metrics')}
            />
          ))}
        </div>

        {/* Two-col: Alerts + AI Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface flex items-center gap-2">
                🔴 Alerts
                <span className="text-[11px] font-normal text-outline-strong">{topAlerts.length} active</span>
              </h3>
              <button onClick={() => navigate('/actions')} className="text-[11px] text-primary font-semibold hover:underline">
                View all →
              </button>
            </div>
            <div>
              {topAlerts.map(a => (
                <AlertCard key={a.id} alert={a} compact />
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface">✦ AI Insights</h3>
              <button className="text-[11px] text-outline-strong hover:text-on-surface">Refresh</button>
            </div>
            <div className="space-y-3">
              {topInsights.map(ins => (
                <InsightCard key={ins.id} insight={ins} />
              ))}
            </div>
          </div>
        </div>

        {/* Store League Table (CEO / Country Head) */}
        {showLeague && stores && (
          <div className="grid grid-cols-2 gap-4">
            <StoreTable title="Top Performers" stores={topStores} />
            <StoreTable title="Needs Attention" stores={bottomStores} />
          </div>
        )}

        {/* Campaign Status (Brand users) */}
        {(persona.id === 'brand_head' || persona.id === 'operator') && pendingCampaigns.length > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-on-surface">Campaign Requests</h3>
              <button onClick={() => navigate('/campaigns')} className="text-[11px] text-primary font-semibold hover:underline">
                View all →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pendingCampaigns.map(c => (
                <div
                  key={c.id}
                  onClick={() => navigate('/campaigns')}
                  className="flex items-center gap-2 bg-surface-low rounded-lg px-3 py-2 cursor-pointer hover:bg-surface-high transition-colors"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: c.brandColor }} />
                  <span className="text-[12px] font-medium text-on-surface">{c.name}</span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[c.status])}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CA Pending Approval (CLO view) */}
        {persona.id === 'clo' && pendingCampaigns.length > 0 && (
          <div
            className="flex items-center gap-3 rounded-xl px-5 py-4 text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: '#0058bc' }}
            onClick={() => navigate('/campaigns')}
          >
            <span className="text-xl">✦</span>
            <div>
              <div className="text-[13px] font-semibold">
                {pendingCampaigns.filter(c => c.status === 'submitted' || c.status === 'under_review').length} campaign requests pending your approval
              </div>
              <div className="text-[11px] opacity-70 mt-0.5">
                {pendingCampaigns.map(c => c.brand).join(' · ')} — avg SLA 38h
              </div>
            </div>
            <div className="ml-auto bg-white/20 rounded-lg px-4 py-1.5 text-[12px] font-semibold">
              View Queue →
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

function StoreTable({ title, stores }: { title: string; stores: any[] }) {
  return (
    <div className="card p-4">
      <h3 className="text-[13px] font-semibold text-on-surface mb-3">{title}</h3>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-outline/40">
            <th className="text-left text-outline-strong font-medium pb-2">Store</th>
            <th className="text-right text-outline-strong font-medium pb-2">Sales</th>
            <th className="text-right text-outline-strong font-medium pb-2">vs LY</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.store} className="border-b border-surface-low/60 last:border-0">
              <td className="py-2 text-on-surface-var truncate max-w-[180px]">{s.store}</td>
              <td className="py-2 text-right text-on-surface tabular-nums">{formatAED(s.salesAed, true)}</td>
              <td className={cn('py-2 text-right tabular-nums font-semibold', s.salesVsLy >= 0 ? 'delta-positive' : 'delta-negative')}>
                {s.salesVsLy >= 0 ? '+' : ''}{formatPct(s.salesVsLy)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
