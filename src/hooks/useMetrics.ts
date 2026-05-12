import { useQuery } from '@tanstack/react-query'
import { loyaltyMetrics, rfmSegments, segmentMovement, demographics, cxMetrics } from '@/data/loyalty'
import { retailMetrics, revenueTrend, storeLeague } from '@/data/retail'

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const useLoyaltyMetrics = () =>
  useQuery({
    queryKey: ['loyalty-metrics'],
    queryFn: async () => { await delay(); return loyaltyMetrics },
    staleTime: Infinity,
  })

export const useRetailMetrics = () =>
  useQuery({
    queryKey: ['retail-metrics'],
    queryFn: async () => { await delay(); return retailMetrics },
    staleTime: Infinity,
  })

export const useRevenueTrend = () =>
  useQuery({
    queryKey: ['revenue-trend'],
    queryFn: async () => { await delay(); return revenueTrend },
    staleTime: Infinity,
  })

export const useStoreLeague = () =>
  useQuery({
    queryKey: ['store-league'],
    queryFn: async () => { await delay(); return storeLeague },
    staleTime: Infinity,
  })

export const useRfmSegments = () =>
  useQuery({
    queryKey: ['rfm-segments'],
    queryFn: async () => { await delay(); return rfmSegments },
    staleTime: Infinity,
  })

export const useSegmentMovement = () =>
  useQuery({
    queryKey: ['segment-movement'],
    queryFn: async () => { await delay(); return segmentMovement },
    staleTime: Infinity,
  })

export const useDemographics = () =>
  useQuery({
    queryKey: ['demographics'],
    queryFn: async () => { await delay(); return demographics },
    staleTime: Infinity,
  })

export const useCxMetrics = () =>
  useQuery({
    queryKey: ['cx-metrics'],
    queryFn: async () => { await delay(); return cxMetrics },
    staleTime: Infinity,
  })
