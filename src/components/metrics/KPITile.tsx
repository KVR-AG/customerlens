import { cn, formatAED, formatNumber, formatPct, formatDelta, deltaClass } from '@/lib/utils'
import { SparkLine } from '@/components/charts/SparkLine'

interface KPITileProps {
  metric: {
    value: number
    label: string
    format: string
    invertedSentiment?: boolean
    sparkline?: number[]
    comparison: {
      lyLflDelta: number
      benchmarkDelta: number
      mallAvgDelta: number
      countryAvgDelta: number
      unit: string
    }
  }
  onClick?: () => void
  className?: string
}

export function KPITile({ metric, onClick, className }: KPITileProps) {
  const formatted = metric.format === 'aed'
    ? formatAED(metric.value, true)
    : metric.format === 'pct'
      ? formatPct(metric.value)
      : formatNumber(metric.value, true)

  const delta = metric.comparison.lyLflDelta
  const dc = deltaClass(delta, metric.invertedSentiment)

  return (
    <div
      onClick={onClick}
      className={cn(
        'card p-4 flex flex-col gap-1',
        onClick && 'card-hover cursor-pointer',
        className
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-outline-strong">
        {metric.label}
      </div>
      <div className="metric-value text-[22px] text-on-surface tabular-nums">
        {formatted}
      </div>
      <div className={cn('text-[12px] font-medium', dc)}>
        {formatDelta(delta, metric.comparison.unit as 'pct' | 'pp' | 'aed' | 'number')} vs LY LFL
      </div>
      {metric.sparkline && (
        <SparkLine data={metric.sparkline} positive={!metric.invertedSentiment ? delta >= 0 : delta < 0} className="mt-1" />
      )}
    </div>
  )
}
