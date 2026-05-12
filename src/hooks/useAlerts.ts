import { useQuery } from '@tanstack/react-query'
import { alerts, aiInsights } from '@/data/alerts'

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const useAlerts = () =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: async () => { await delay(); return alerts },
    staleTime: Infinity,
  })

export const useAiInsights = () =>
  useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => { await delay(); return aiInsights },
    staleTime: Infinity,
  })
