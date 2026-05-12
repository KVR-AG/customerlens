import { cn, formatDelta, deltaClass } from '@/lib/utils'
import type { ComparisonFrame as CF } from '@/data/loyalty'

interface ComparisonFrameProps {
  comparison: CF
  className?: string
}

const chips = [
  { label: 'LY LFL', key: 'lyLflDelta' as const },
  { label: 'Benchmark', key: 'benchmarkDelta' as const },
  { label: 'Mall Avg', key: 'mallAvgDelta' as const },
  { label: 'Country Avg', key: 'countryAvgDelta' as const },
]

export function ComparisonFrame({ comparison, className }: ComparisonFrameProps) {
  return (
    <div className={cn('flex gap-1.5 flex-wrap', className)}>
      {chips.map(chip => {
        const val = comparison[chip.key]
        return (
          <div key={chip.label} className="bg-surface-low rounded-md px-2 py-1 text-[11px]">
            <span className="text-outline-strong">{chip.label} </span>
            <span className={cn('font-semibold', deltaClass(val))}>
              {formatDelta(val, comparison.unit as 'pct' | 'pp' | 'aed' | 'number')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
