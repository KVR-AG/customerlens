import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_BOTTOM } from '@/lib/constants'
import { usePersona } from '@/hooks/usePersona'
import { PERSONAS, type PersonaId } from '@/data/personas'

export function TopNav() {
  const location = useLocation()
  const { persona, setPersonaById } = usePersona()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const allItems = [...NAV_ITEMS, ...NAV_BOTTOM]

  return (
    <div className="relative flex-shrink-0 z-30">
      <header className="h-[56px] bg-surface border-b border-outline flex items-center px-4 gap-3">
        {/* Brand */}
        <div className="flex-shrink-0 mr-1">
          <div className="text-[15px] font-bold tracking-tight text-on-surface font-display leading-none">
            Customer Lens
          </div>
          <div className="text-[9px] font-semibold uppercase tracking-widest text-outline-strong mt-0.5">
            Enterprise Analytics
          </div>
        </div>

        <div className="hidden lg:block w-px h-6 bg-outline/60 flex-shrink-0" />

        {/* Nav items — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto" aria-label="Main navigation">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0',
                  active
                    ? 'bg-surface-high text-primary font-semibold'
                    : 'text-secondary hover:bg-surface-low hover:text-on-surface'
                )}
              >
                <item.icon size={15} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        {/* Right side — desktop */}
        <div className="hidden lg:flex items-center gap-2 ml-auto flex-shrink-0">
          {NAV_BOTTOM.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                  active
                    ? 'bg-surface-high text-primary font-semibold'
                    : 'text-secondary hover:bg-surface-low hover:text-on-surface'
                )}
              >
                <item.icon size={15} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <div className="w-px h-6 bg-outline/60" />

          <select
            value={persona.id}
            onChange={e => setPersonaById(e.target.value as PersonaId)}
            aria-label="Demo persona"
            className="focus-ring text-[11px] bg-surface-low border border-outline rounded-md px-2 py-1 text-secondary"
          >
            {PERSONAS.map(p => (
              <option key={p.id} value={p.id}>{p.role}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              {persona.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-on-surface leading-none">
                {persona.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-outline-strong leading-none mt-0.5">
                {persona.aiUsagePct}% AI
              </div>
            </div>
          </div>
        </div>

        {/* Mobile right: avatar + hamburger */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {persona.avatar}
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            className="focus-ring w-8 h-8 flex items-center justify-center rounded-md text-secondary hover:text-on-surface hover:bg-surface-low transition-colors text-[18px]"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="lg:hidden absolute top-full left-0 right-0 z-30 bg-surface border-b border-outline shadow-lg py-2 px-3 flex flex-col gap-0.5"
            aria-label="Mobile navigation"
          >
            {allItems.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-ring flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-surface-high text-primary font-semibold'
                      : 'text-secondary hover:bg-surface-low hover:text-on-surface'
                  )}
                >
                  <item.icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}

            <div className="mt-2 pt-2 border-t border-outline/40">
              <select
                value={persona.id}
                onChange={e => setPersonaById(e.target.value as PersonaId)}
                aria-label="Demo persona"
                className="focus-ring w-full text-[11px] bg-surface-low border border-outline rounded-md px-2 py-1.5 text-secondary"
              >
                {PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>{p.role}</option>
                ))}
              </select>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
