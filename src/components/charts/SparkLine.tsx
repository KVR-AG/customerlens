import { cn } from '@/lib/utils'

interface SparkLineProps {
  data: number[]
  positive?: boolean
  height?: number
  className?: string
}

export function SparkLine({ data, positive = true, height = 28, className }: SparkLineProps) {
  if (!data?.length) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 60
  const h = height
  const pad = 2

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + ((1 - (v - min) / range) * (h - pad * 2))
    return `${x},${y}`
  })

  const color = positive ? 'var(--color-positive)' : 'var(--color-negative)'

  return (
    <div className={cn('flex items-end gap-0.5', className)}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
