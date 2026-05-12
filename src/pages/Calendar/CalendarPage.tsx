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
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const navigate = useNavigate()
  const { data: events } = useCalendarEvents()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events?.filter(e => e.startDate <= dateStr && e.endDate >= dateStr) ?? []
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
      <div className="border-b border-outline bg-surface px-6 py-2.5 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1)} className="text-[18px] text-secondary hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low">‹</button>
        <div className="text-[14px] font-semibold text-on-surface min-w-[140px] text-center">
          {MONTHS[month]} {year}
        </div>
        <button onClick={() => setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1)} className="text-[18px] text-secondary hover:text-on-surface w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low">›</button>
        <div className="flex-1" />

        {/* Filter chips */}
        <div className="flex gap-1.5">
          {['All Channels', 'All Brands', 'All Statuses'].map(f => (
            <button key={f} className="text-[11px] px-3 py-1 rounded-full border border-outline text-secondary hover:bg-surface-low">
              {f} ▾
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
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
            <div key={`empty-${i}`} className="bg-surface-low min-h-[100px]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const isToday = day === 12 && month === 4 && year === 2026

            return (
              <div
                key={day}
                className="bg-surface min-h-[100px] p-1.5 relative hover:bg-surface-low/50 transition-colors cursor-pointer"
              >
                <div className={cn(
                  'text-[12px] font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1',
                  isToday ? 'bg-primary text-white' : 'text-on-surface-var'
                )}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white"
                      style={{ background: ev.brandColor }}
                      onMouseEnter={() => setHoveredEvent(ev.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => navigate('/campaigns')}
                      title={`${ev.name} · ${ev.brand} · ${formatNumber(ev.audienceSize)} recipients`}
                    >
                      {ev.name}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-outline-strong px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

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
