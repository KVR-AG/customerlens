import { cn, formatAED, formatNumber, formatPct, formatDelta, deltaClass } from '@/lib/utils'
import { SparkLine } from '@/components/charts/SparkLine'
import { Tooltip } from '@/components/ui/Tooltip'

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
  description?: string
  onClick?: () => void
  className?: string
}

export function KPITile({ metric, description, onClick, className }: KPITileProps) {
  const formatted = metric.format === 'aed'
    ? formatAED(metric.value, true)
    : metric.format === 'pct'
      ? formatPct(metric.value)
      : formatNumber(metric.value, true)

  const delta = metric.comparison.lyLflDelta
  const dc = deltaClass(delta, metric.invertedSentiment)
  const baseClassName = cn(
    'card p-4 flex flex-col gap-1 text-left',
    onClick && 'card-hover cursor-pointer focus-ring',
    className
  )

  const content = (
    <>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-outline-strong">
        {metric.label}
        {description && <Tooltip text={description} position="bottom" />}
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
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClassName}>
        {content}
      </button>
    )
  }

  return <div className={baseClassName}>{content}</div>
}
