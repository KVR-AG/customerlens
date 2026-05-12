import { useNavigate } from 'react-router-dom'
import type { AIInsight } from '@/data/alerts'

interface InsightCardProps {
  insight: AIInsight
}

export function InsightCard({ insight }: InsightCardProps) {
  const navigate = useNavigate()

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full badge-ai">✦ AI Insight</span>
        {insight.relatedMetric && (
          <span className="text-[11px] text-outline-strong">{insight.relatedMetric}</span>
        )}
      </div>
      <p className="text-[12px] text-on-surface-var leading-relaxed">{insight.text}</p>
      {insight.action && insight.actionPath && (
        <button
          onClick={() => navigate(insight.actionPath!)}
          className="self-start text-[11px] font-semibold text-primary hover:underline"
        >
          {insight.action} →
        </button>
      )}
    </div>
  )
}
