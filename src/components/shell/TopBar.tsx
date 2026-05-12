import { cn } from '@/lib/utils'
import { usePersona } from '@/hooks/usePersona'
import { useOutletContext } from 'react-router-dom'

interface TopBarProps {
  title?: string
  period?: 'YTD' | 'MTD' | 'WTD'
  onPeriodChange?: (p: 'YTD' | 'MTD' | 'WTD') => void
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
}

interface OutletCtx {
  onMobileNavOpen?: () => void
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
  const ctx = useOutletContext<OutletCtx>()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="h-[52px] bg-surface border-b border-outline flex items-center px-4 gap-2 flex-shrink-0 overflow-hidden">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={() => ctx?.onMobileNavOpen?.()}
        className="focus-ring lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-secondary hover:text-on-surface hover:bg-surface-low transition-colors text-[18px]"
        aria-label="Open navigation"
      >
        ☰
      </button>

      <div className="text-[15px] font-bold text-on-surface tracking-tight font-display truncate min-w-0 flex-shrink">
        {title ?? `${greeting()}, ${persona.name.split(' ')[0]}`}
      </div>

      {/* Scrollable right-side controls */}
      <div className="ml-auto flex items-center gap-2 overflow-x-auto flex-shrink-0 max-w-[calc(100%-120px)]">
        {/* Period segmented control */}
        <div className="flex bg-surface-low rounded-lg p-0.5 flex-shrink-0" role="group" aria-label="Reporting period">
          {PERIODS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange?.(p)}
              aria-pressed={period === p}
              className={cn(
                'focus-ring px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap',
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
            type="button"
            onClick={secondaryAction.onClick}
            className="focus-ring flex-shrink-0 h-8 px-3 rounded-lg text-[12px] font-semibold border border-outline text-on-surface bg-surface hover:bg-surface-low transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">{secondaryAction.label}</span>
            <span className="sm:hidden">↻</span>
          </button>
        )}

        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="focus-ring flex-shrink-0 h-8 px-3 rounded-lg text-[12px] font-semibold bg-primary text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">{primaryAction.label}</span>
            <span className="sm:hidden">+</span>
          </button>
        )}
      </div>
    </header>
  )
}
