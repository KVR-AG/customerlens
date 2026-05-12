import { useQuery } from '@tanstack/react-query'
import { campaigns } from '@/data/campaigns'
import { calendarEvents } from '@/data/calendar'

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const useCampaigns = () =>
  useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => { await delay(); return campaigns },
    staleTime: Infinity,
  })

export const useCalendarEvents = () =>
  useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => { await delay(); return calendarEvents },
    staleTime: Infinity,
  })
