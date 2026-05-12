import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_BOTTOM } from '@/lib/constants'
import { usePersona } from '@/hooks/usePersona'
import { PERSONAS, type PersonaId } from '@/data/personas'

interface SideNavProps {
  collapsed: boolean
  onToggle: () => void
}

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const location = useLocation()
  const { persona, setPersonaById } = usePersona()

  return (
    <aside
      className={cn(
        'flex-shrink-0 bg-surface border-r border-outline flex flex-col h-full transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px]' : 'w-[220px]'
      )}
    >
      {/* Brand */}
      <div className={cn('relative py-3 border-b border-outline/40', collapsed ? 'px-2' : 'px-4')}>
        <div className={cn('flex items-center', collapsed ? 'justify-between' : 'justify-between')}>
          {!collapsed && (
            <div>
              <div className="text-[15px] font-bold tracking-tight text-on-surface font-display">Customer Lens</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-outline-strong mt-0.5">
                Enterprise Analytics
              </div>
            </div>
          ) }

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'focus-ring rounded-md border border-outline text-secondary hover:text-on-surface hover:bg-surface-low transition-colors',
              collapsed ? 'w-6 h-6 bg-surface ml-4' : 'w-7 h-7'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
      </div>

      {/* Nav items */}
      <nav className={cn('flex-1 overflow-y-auto py-3 flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-2.5')}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              title={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'focus-ring relative flex items-center rounded-lg text-[13px] font-medium transition-colors',
                collapsed ? 'justify-center px-1.5 py-2' : 'gap-2.5 px-2.5 py-1.5',
                active
                  ? 'bg-surface-high text-primary font-semibold'
                  : 'text-secondary hover:bg-surface-low hover:text-on-surface'
              )}
            >
              <span className="text-[16px] w-5 flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {'badge' in item && item.badge ? (
                !collapsed ? (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )
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
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring flex items-center rounded-lg text-[13px] font-medium transition-colors',
                  collapsed ? 'justify-center px-1.5 py-2' : 'gap-2.5 px-2.5 py-1.5',
                  active
                    ? 'bg-surface-high text-primary font-semibold'
                    : 'text-secondary hover:bg-surface-low hover:text-on-surface'
                )}
              >
                <span className="text-[16px] w-5 flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer: persona + AI usage */}
      <div className={cn('relative py-3 border-t border-outline/40 space-y-2', collapsed ? 'px-2' : 'px-3')}>
        {/* Persona switcher */}
        {!collapsed ? (
          <select
            value={persona.id}
            onChange={e => setPersonaById(e.target.value as PersonaId)}
            aria-label="Demo persona"
            className="focus-ring w-full text-[11px] bg-surface-low border border-outline rounded-md px-2 py-1 text-secondary"
          >
            {PERSONAS.map(p => (
              <option key={p.id} value={p.id}>{p.role}</option>
            ))}
          </select>
        ) : (
          <select
            value={persona.id}
            onChange={e => setPersonaById(e.target.value as PersonaId)}
            aria-label="Demo persona"
            className="focus-ring w-full text-[10px] bg-surface-low border border-outline rounded-md px-1.5 py-1 text-secondary"
            title="Switch persona"
          >
            {PERSONAS.map(p => (
              <option key={p.id} value={p.id}>{p.avatar}</option>
            ))}
          </select>
        )}

        {/* User row */}
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-2')}>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {persona.avatar}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-on-surface truncate">{persona.name}</div>
              <div className="text-[10px] text-outline-strong truncate">{persona.role}</div>
            </div>
          )}
          <div
            className={cn(
              'flex-shrink-0 text-[10px] font-semibold rounded-full bg-surface-high text-secondary',
              collapsed ? 'px-1.5 py-0.5 absolute bottom-2 right-2' : 'px-1.5 py-0.5'
            )}
            title="AI usage this month"
          >
            {persona.aiUsagePct}%
          </div>
        </div>
      </div>
    </aside>
  )
}
