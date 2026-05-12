import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { useCalendarEvents } from '@/hooks/useCampaigns'
import { cn, formatNumber } from '@/lib/utils'
import { STATUS_COLORS, STATUS_LABELS } from '@/data/campaigns'

type Period = 'YTD' | 'MTD' | 'WTD'
type View = 'month' | 'week'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function CalendarPage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [view, setView] = useState<View>('month')
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(4) // 0-indexed, May = 4
  const [activeFilter, setActiveFilter] = useState('All Channels')
  const [notice, setNotice] = useState<string | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const navigate = useNavigate()
  const { data: events } = useCalendarEvents()
  const today = new Date()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events?.filter(e => e.startDate <= dateStr && e.endDate >= dateStr) ?? []
  }
  const handleDemoFilter = (chip: string) => {
    setActiveFilter(chip)
    setNotice(`${chip} pinned for demo snapshot`)
    window.setTimeout(() => setNotice(null), 1600)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Campaign Calendar"
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={{ label: '+ New Campaign', onClick: () => navigate('/campaigns') }}
      />

      {/* Controls */}
      <div className="border-b border-outline bg-surface px-4 py-2.5 flex flex-wrap items-center gap-2 flex-shrink-0">
        <button type="button" onClick={() => setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1)} className="focus-ring text-[18px] text-secondary hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low">‹</button>
        <div className="text-[14px] font-semibold text-on-surface min-w-[120px] text-center">
          {MONTHS[month]} {year}
        </div>
        <button type="button" onClick={() => setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1)} className="focus-ring text-[18px] text-secondary hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low">›</button>
        {notice && <span className="text-[11px] text-primary font-medium">{notice}</span>}

        {/* Filter chips — scrollable on mobile */}
        <div className="flex gap-1.5 overflow-x-auto ml-auto">
          {['All Channels', 'All Brands', 'All Statuses'].map(f => (
            <button
              type="button"
              key={f}
              onClick={() => handleDemoFilter(f)}
              className={cn(
                'focus-ring text-[11px] px-3 py-1 rounded-full border transition-colors whitespace-nowrap flex-shrink-0',
                activeFilter === f
                  ? 'bg-primary text-white border-primary'
                  : 'border-outline text-secondary hover:bg-surface-low'
              )}
            >
              {f} ▾
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="overflow-x-auto">
        <div style={{ minWidth: '560px' }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-outline-strong py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-outline/30 rounded-xl overflow-hidden border border-outline/30">
          {/* Empty cells for first week */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-surface-low min-h-[64px] md:min-h-[100px]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

            return (
              <div
                key={day}
                className="bg-surface min-h-[64px] md:min-h-[100px] p-1.5 relative hover:bg-surface-low/50 transition-colors"
              >
                <div className={cn(
                  'text-[12px] font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1',
                  isToday ? 'bg-primary text-white' : 'text-on-surface-var'
                )}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <button
                      type="button"
                      key={ev.id}
                      className="focus-ring w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white"
                      style={{ background: ev.brandColor }}
                      onMouseEnter={() => setHoveredEvent(ev.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => navigate('/campaigns')}
                      title={`${ev.name} · ${ev.brand} · ${formatNumber(ev.audienceSize)} recipients`}
                    >
                      {ev.name}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-outline-strong px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        </div>{/* end min-width wrapper */}
        </div>{/* end overflow-x-auto */}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {events?.map(ev => (
            <div key={ev.id} className="flex items-center gap-1.5 text-[11px] text-on-surface-var">
              <div className="w-3 h-3 rounded" style={{ background: ev.brandColor }} />
              {ev.brand} — {ev.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
