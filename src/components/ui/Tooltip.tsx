import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  text: string
  className?: string
  /** Where the tooltip appears relative to the icon. Defaults to 'top'. */
  position?: 'top' | 'bottom'
}

export function Tooltip({ text, className, position = 'top' }: TooltipProps) {
  const isTop = position === 'top'

  return (
    <span className={cn('relative group inline-flex items-center flex-shrink-0', className)}>
      <Info
        size={11}
        className="text-outline-strong cursor-help opacity-60 group-hover:opacity-100 transition-opacity"
      />

      {/* Tooltip bubble */}
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 -translate-x-1/2 z-50',
          'w-60 px-3 py-2.5 rounded-xl',
          'bg-[#1a1f2e] text-white text-[11px] leading-relaxed font-normal normal-case tracking-normal',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-2xl',
          'text-left whitespace-normal',
          isTop ? 'bottom-full mb-2' : 'top-full mt-2'
        )}
      >
        {text}
        {/* Arrow */}
        <span
          className={cn(
            'absolute left-1/2 -translate-x-1/2 border-[5px] border-transparent',
            isTop
              ? 'top-full border-t-[#1a1f2e]'
              : 'bottom-full border-b-[#1a1f2e]'
          )}
        />
      </span>
    </span>
  )
}
