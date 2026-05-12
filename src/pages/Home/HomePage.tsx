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
  const [refreshCursor, setRefreshCursor] = useState(0)
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false)
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
  const rotatedInsights = insights?.length
    ? [
      ...insights.slice(refreshCursor % insights.length),
      ...insights.slice(0, refreshCursor % insights.length),
    ]
    : []
  const topInsights = rotatedInsights.slice(0, 2)
  const pendingCampaigns = campaigns?.filter(c => ['submitted', 'under_review', 'approved'].includes(c.status)) ?? []
  const topStores = stores?.slice(0, 5) ?? []
  const bottomStores = stores?.slice(5) ?? []
  const showLeague = persona.id === 'ceo' || persona.id === 'country_head'
  const handleExportPdf = () => window.print()
  const handleRefreshInsights = () => {
    if (!insights?.length || isRefreshingInsights) return
    setIsRefreshingInsights(true)
    setTimeout(() => {
      setRefreshCursor(c => c + 1)
      setIsRefreshingInsights(false)
    }, 350)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: '+ New Campaign', onClick: () => navigate('/campaigns') }}
        secondaryAction={{ label: 'Export PDF', onClick: handleExportPdf }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {kpis.map((m, i) => m && (
            <KPITile
              key={i}
              metric={m as any}
              onClick={() => navigate('/metrics')}
            />
          ))}
        </div>

        {/* Two-col: Alerts + AI Insights */}
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
                topAlerts.map(a => (
                  <AlertCard key={a.id} alert={a} compact />
                ))
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
                topInsights.map(ins => (
                  <InsightCard key={ins.id} insight={ins} />
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-outline px-3 py-4 text-[12px] text-outline-strong">
                  No AI insights available yet. Refresh after new data snapshots land.
                </div>
              )}
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

        {/* CA Pending Approval (CLO view) */}
        {persona.id === 'clo' && pendingCampaigns.length > 0 && (
          <button
            type="button"
            className="focus-ring w-full flex items-center gap-3 rounded-xl px-5 py-4 text-white cursor-pointer hover:opacity-90 transition-opacity text-left bg-primary"
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
            <div className="ml-auto bg-white/20 rounded-lg px-4 py-1.5 text-[12px] font-semibold">
              View Queue →
            </div>
          </button>
        )}

      </main>
    </div>
  )
}

function StoreTable({ title, stores }: { title: string; stores: any[] }) {
  return (
    <div className="card p-4">
      <h3 className="text-[13px] font-semibold text-on-surface mb-3">{title}</h3>
      <div className="table-surface">
      <table className="data-table w-full">
        <thead>
          <tr>
            <th>Store</th>
            <th className="text-right">Sales</th>
            <th className="text-right">vs LY</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.store}>
              <td className="truncate max-w-[180px]">{s.store}</td>
              <td className="text-right num">{formatAED(s.salesAed, true)}</td>
              <td className={cn('text-right num', s.salesVsLy >= 0 ? 'delta-positive' : 'delta-negative')}>
                {s.salesVsLy >= 0 ? '+' : ''}{formatPct(s.salesVsLy)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
