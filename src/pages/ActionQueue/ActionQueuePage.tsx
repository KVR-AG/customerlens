import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { useAlerts } from '@/hooks/useAlerts'
import { cn } from '@/lib/utils'
import type { Alert, AlertSeverity } from '@/data/alerts'

type Period = 'YTD' | 'MTD' | 'WTD'

const MOCK_TASKS = [
  { id: 't1', title: 'Investigate CA Conversion drop in Dubai Mall', severity: 'critical' as AlertSeverity, scope: 'Dubai Mall · All Brands', status: 'open', priority: 'high', created: '2026-05-12', due: '2026-05-14', assignee: 'Sarah J.' },
  { id: 't2', title: 'Review Silver tier Active Rate decline', severity: 'warning' as AlertSeverity, scope: 'Silver Tier · All Brands', status: 'in_progress', priority: 'medium', created: '2026-05-11', due: '2026-05-15', assignee: 'David C.' },
  { id: 't3', title: 'Assess Points Liability ceiling risk', severity: 'critical' as AlertSeverity, scope: 'Group · All Brands', status: 'open', priority: 'high', created: '2026-05-10', due: '2026-05-13', assignee: 'David C.' },
  { id: 't4', title: 'Address Full Price Sale % decline in R&B Fashion', severity: 'warning' as AlertSeverity, scope: 'R&B Fashion · UAE', status: 'open', priority: 'medium', created: '2026-05-09', due: '2026-05-16', assignee: 'Sarah J.' },
  { id: 't5', title: 'Clear Skechers KSA aged stock', severity: 'watch' as AlertSeverity, scope: 'Skechers · KSA', status: 'done', priority: 'low', created: '2026-05-08', due: '2026-05-17', assignee: 'Marketing' },
]

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  critical: 'badge-critical',
  warning: 'badge-warning',
  watch: 'bg-warning-bg text-warning border border-warning/20',
}

const STATUS_BADGE: Record<string, string> = {
  open:        'bg-ai-bg text-ai-accent border border-ai-accent/20',
  in_progress: 'bg-surface-high text-on-surface-var border border-outline',
  done:        'badge-positive',
}

export function ActionQueuePage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const navigate = useNavigate()

  const filtered = filter === 'all' ? MOCK_TASKS : MOCK_TASKS.filter(t => t.status === filter)
  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 1600)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Action Queue" period={period} onPeriodChange={setPeriod} />

      {/* Filter bar */}
      <div className="border-b border-outline bg-surface px-4 py-2.5 flex flex-wrap items-center gap-2 flex-shrink-0">
        {[['all', 'All'], ['open', 'Open'], ['in_progress', 'In Progress'], ['done', 'Done']].map(([v, l]) => (
          <button
            type="button"
            key={v}
            onClick={() => setFilter(v)}
            className={cn(
              'focus-ring text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors',
              filter === v ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-low'
            )}
          >
            {l}
          </button>
        ))}
        <div className="flex-1" />
        {notice && <span className="text-[11px] text-primary font-medium">{notice}</span>}
        <span className="text-[12px] text-outline-strong">{filtered.length} tasks</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {filtered.map(task => (
          <div key={task.id} className="card overflow-hidden">
            {/* Task header */}
            <button
              type="button"
              className="focus-ring w-full text-left p-4 flex items-start gap-3 cursor-pointer hover:bg-surface-low/50 transition-colors"
              onClick={() => setExpanded(expanded === task.id ? null : task.id)}
            >
              <div className="flex flex-col gap-1.5 flex-shrink-0 mt-0.5">
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', SEVERITY_BADGE[task.severity])}>
                  {task.severity.charAt(0).toUpperCase() + task.severity.slice(1)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-on-surface">{task.title}</div>
                <div className="text-[11px] text-outline-strong mt-0.5">{task.scope}</div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[task.status])}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-outline-strong">Due {task.due}</span>
                  <span className="text-[11px] text-outline-strong">→ {task.assignee}</span>
                </div>
              </div>
              <div className="text-outline-strong">{expanded === task.id ? '↑' : '↓'}</div>
            </button>

            {/* Expanded detail */}
            {expanded === task.id && (
              <div className="border-t border-surface-low px-4 py-4 bg-surface-low/30 space-y-4">
                <div className="text-[12px] text-on-surface-var">
                  <span className="font-semibold text-on-surface">Triggered by:</span> Alert auto-generated from metric threshold breach. Review the Metrics Explorer for full context.
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-on-surface mb-2">AI Recommended Actions</div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => navigate('/metrics')}
                      className="focus-ring text-[12px] font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                    >
                      Investigate in Explorer
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/campaigns')}
                      className="focus-ring text-[12px] font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                    >
                      Create Campaign
                    </button>
                    <button
                      type="button"
                      onClick={() => showNotice(`Marked "${task.title}" as done in demo mode`)}
                      className="focus-ring text-[12px] font-semibold text-on-surface-var border border-outline px-3 py-1.5 rounded-lg hover:bg-surface-low"
                    >
                      ✓ Mark Done
                    </button>
                    <button
                      type="button"
                      onClick={() => showNotice(`Reassign flow for "${task.title}" opens in full app`)}
                      className="focus-ring text-[12px] font-semibold text-on-surface-var border border-outline px-3 py-1.5 rounded-lg hover:bg-surface-low"
                    >
                      👤 Reassign
                    </button>
                  </div>
                </div>

                {/* Comment thread mock */}
                <div>
                  <div className="text-[12px] font-semibold text-on-surface mb-2">Comments</div>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-[12px]">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">DC</div>
                      <div className="bg-surface rounded-lg px-3 py-2 border border-outline/40 flex-1">
                        <span className="font-semibold text-on-surface">David Chen</span>
                        <span className="text-outline-strong ml-2 text-[10px]">2h ago</span>
                        <p className="text-on-surface-var mt-0.5">Raised with R&B Fashion team. Will review assortment plan by EOD.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input placeholder="Add a comment..." className="flex-1 h-9 border border-outline rounded-lg px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button
                      type="button"
                      onClick={() => showNotice('Comment saved in demo mode')}
                      className="focus-ring px-3 h-9 text-[12px] font-semibold bg-primary text-white rounded-lg"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
