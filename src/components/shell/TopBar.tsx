import { cn } from '@/lib/utils'
import { usePersona } from '@/hooks/usePersona'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title?: string
  period?: 'YTD' | 'MTD' | 'WTD'
  onPeriodChange?: (p: 'YTD' | 'MTD' | 'WTD') => void
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

const PERIODS = ['YTD', 'MTD', 'WTD'] as const

export function TopBar({
  title,
  period = 'YTD',
  onPeriodChange,
  primaryAction,
  secondaryAction,
}: TopBarProps) {
  const { persona } = usePersona()
  const navigate = useNavigate()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="h-[52px] bg-surface border-b border-outline flex items-center px-6 gap-3 flex-shrink-0">
      <div className="text-[15px] font-bold text-on-surface tracking-tight">
        {title ?? `${greeting()}, ${persona.name.split(' ')[0]}`}
      </div>

      <div className="flex-1" />

      {/* Period segmented control */}
      <div className="flex bg-surface-low rounded-lg p-0.5">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange?.(p)}
            className={cn(
              'px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors',
              period === p
                ? 'bg-surface text-on-surface font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="h-8 px-3.5 rounded-lg text-[12px] font-semibold border border-outline text-on-surface bg-surface hover:bg-surface-low transition-colors"
        >
          {secondaryAction.label}
        </button>
      )}

      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="h-8 px-3.5 rounded-lg text-[12px] font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          {primaryAction.label}
        </button>
      )}
    </header>
  )
}
