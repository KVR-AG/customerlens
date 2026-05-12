import { cn } from '@/lib/utils'
import type { Alert, AlertSeverity } from '@/data/alerts'
import { useNavigate } from 'react-router-dom'

const SEVERITY_STYLES: Record<AlertSeverity, { dot: string; badge: string; label: string }> = {
  critical: { dot: 'bg-negative', badge: 'badge-critical', label: '🔴 Critical' },
  warning:  { dot: 'bg-warning',  badge: 'badge-warning',  label: '🟠 Warning'  },
  watch:    { dot: 'bg-watch',    badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: '🟡 Watch' },
}

interface AlertCardProps {
  alert: Alert
  compact?: boolean
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const navigate = useNavigate()
  const s = SEVERITY_STYLES[alert.severity]

  if (compact) {
    return (
      <div className="flex items-start gap-2 py-2.5 border-b border-surface-low last:border-0">
        <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', s.dot)} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-on-surface-var leading-snug">{alert.title}</div>
          <div className="text-[10px] text-outline-strong mt-0.5">{alert.timestamp} · {alert.scope}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', s.badge)}>
          {s.label}
        </span>
        {alert.isNew && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-white">
            New
          </span>
        )}
        <span className="ml-auto text-[11px] text-outline-strong">{alert.timestamp}</span>
      </div>
      <div className="text-[13px] font-semibold text-on-surface">{alert.title}</div>
      <div className="text-[12px] text-on-surface-var leading-relaxed">{alert.description}</div>
      <div className="text-[11px] text-outline-strong">Scope: {alert.scope}</div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => navigate('/metrics')}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          Investigate →
        </button>
        <button
          onClick={() => navigate('/actions')}
          className="text-[11px] font-semibold text-on-surface-var hover:text-on-surface"
        >
          Create Task
        </button>
        <button
          onClick={() => navigate('/campaigns')}
          className="text-[11px] font-semibold text-on-surface-var hover:text-on-surface"
        >
          Suggest Campaign
        </button>
      </div>
    </div>
  )
}
