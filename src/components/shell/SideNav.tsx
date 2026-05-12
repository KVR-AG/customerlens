import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_BOTTOM } from '@/lib/constants'
import { usePersona } from '@/hooks/usePersona'
import { PERSONAS, type PersonaId } from '@/data/personas'

export function SideNav() {
  const location = useLocation()
  const { persona, setPersonaById } = usePersona()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-surface border-r border-outline flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-outline/40">
        <div className="text-[15px] font-bold tracking-tight text-on-surface">Customer Lens</div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-outline-strong mt-0.5">
          Enterprise Analytics
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                active
                  ? 'bg-surface-high text-primary font-semibold'
                  : 'text-secondary hover:bg-surface-low hover:text-on-surface'
              )}
            >
              <span className="text-[16px] w-5 flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {'badge' in item && item.badge ? (
                <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}

        <div className="mt-2 pt-2 border-t border-outline/40">
          {NAV_BOTTOM.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                  active
                    ? 'bg-surface-high text-primary font-semibold'
                    : 'text-secondary hover:bg-surface-low hover:text-on-surface'
                )}
              >
                <span className="text-[16px] w-5 flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer: persona + AI usage */}
      <div className="px-3 py-3 border-t border-outline/40 space-y-2">
        {/* Persona switcher */}
        <select
          value={persona.id}
          onChange={e => setPersonaById(e.target.value as PersonaId)}
          className="w-full text-[11px] bg-surface-low border border-outline rounded-md px-2 py-1 text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {PERSONAS.map(p => (
            <option key={p.id} value={p.id}>{p.role}</option>
          ))}
        </select>

        {/* User row */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {persona.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-on-surface truncate">{persona.name}</div>
            <div className="text-[10px] text-outline-strong truncate">{persona.role}</div>
          </div>
          <div
            className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-surface-high text-secondary"
            title="AI usage this month"
          >
            {persona.aiUsagePct}%
          </div>
        </div>
      </div>
    </aside>
  )
}
