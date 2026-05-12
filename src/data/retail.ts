import type { MetricDef } from './loyalty'

function spark(base: number, trend: 'up' | 'down' | 'flat' = 'up'): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    const noise = (Math.sin(i * 1.8 + base * 0.001) * 0.03 + 0.02) * base
    const trendFactor = trend === 'up' ? i * base * 0.005 : trend === 'down' ? -i * base * 0.005 : 0
    return Math.max(0, base * 0.88 + trendFactor + noise)
  })
}

export const retailMetrics: Record<string, MetricDef> = {
  // Sales & Conversion
  totalRevenue:     { value: 203_000_000, label: 'Apparel Revenue',   format: 'aed', comparison: { current: 203_000_000, lyLflDelta: 10.2, benchmarkDelta: 4.1, mallAvgDelta: 6.8, countryAvgDelta: 8.4, unit: 'aed' }, sparkline: spark(178_000_000, 'up') },
  footfall:         { value: 4_820_000,   label: 'Footfall',          format: 'number', comparison: { current: 4_820_000,   lyLflDelta: 6.1, benchmarkDelta: 2.4, mallAvgDelta: 4.2, countryAvgDelta: 5.1, unit: 'pct' }, sparkline: spark(4_400_000, 'up') },
  conversionRate:   { value: 28.4,        label: 'Conversion Rate',   format: 'pct', comparison: { current: 28.4,         lyLflDelta: -1.2, benchmarkDelta: -0.8, mallAvgDelta: -1.0, countryAvgDelta: -0.6, unit: 'pp' }, sparkline: spark(30.1, 'down') },
  aov:              { value: 218,         label: 'AOV',               format: 'aed', comparison: { current: 218,          lyLflDelta: 3.8, benchmarkDelta: 1.2, mallAvgDelta: 2.4, countryAvgDelta: 3.1, unit: 'aed' }, sparkline: spark(208, 'up') },
  asp:              { value: 124,         label: 'ASP',               format: 'aed', comparison: { current: 124,          lyLflDelta: 2.1, benchmarkDelta: 0.8, mallAvgDelta: 1.4, countryAvgDelta: 1.9, unit: 'aed' }, sparkline: spark(121, 'up') },
  upt:              { value: 1.76,        label: 'UPT',               format: 'number', comparison: { current: 1.76,       lyLflDelta: 0.4, benchmarkDelta: -0.2, mallAvgDelta: 0.1, countryAvgDelta: 0.2, unit: 'number' }, sparkline: spark(1.68, 'up') },

  // Margin & Pricing
  gm:               { value: 54_200_000, label: 'Gross Margin',       format: 'aed', comparison: { current: 54_200_000, lyLflDelta: 8.4, benchmarkDelta: 3.2, mallAvgDelta: 5.8, countryAvgDelta: 7.1, unit: 'aed' }, sparkline: spark(48_000_000, 'up') },
  gmPct:            { value: 26.7,       label: 'GM%',                format: 'pct', comparison: { current: 26.7,        lyLflDelta: -0.8, benchmarkDelta: -1.2, mallAvgDelta: -0.6, countryAvgDelta: -0.4, unit: 'pp' }, sparkline: spark(27.8, 'down') },
  amdPct:           { value: 14.2,       label: 'AMD%',               format: 'pct', comparison: { current: 14.2,        lyLflDelta: 1.4, benchmarkDelta: 0.6, mallAvgDelta: 0.8, countryAvgDelta: 1.1, unit: 'pp' }, sparkline: spark(13.1, 'up') },
  fullPriceSalePct: { value: 62.4,       label: 'Full Price Sale %',  format: 'pct', comparison: { current: 62.4,        lyLflDelta: -2.1, benchmarkDelta: -1.4, mallAvgDelta: -1.8, countryAvgDelta: -1.2, unit: 'pp' }, sparkline: spark(65.8, 'down') },

  // Stock Health
  weekCover:        { value: 18.4, label: 'Week Cover',        format: 'number', comparison: { current: 18.4, lyLflDelta: -1.2, benchmarkDelta: 2.1, mallAvgDelta: 0.4, countryAvgDelta: -0.8, unit: 'number' }, sparkline: spark(19.8, 'down') },
  sellThroughRate:  { value: 68.4, label: 'Sell-Through Rate', format: 'pct',    comparison: { current: 68.4, lyLflDelta: 3.2,  benchmarkDelta: 1.8, mallAvgDelta: 2.4, countryAvgDelta: 3.0,  unit: 'pp' },  sparkline: spark(64.2, 'up') },
  agedStockPct:     { value: 12.1, label: 'Aged Stock %',      format: 'pct',    comparison: { current: 12.1, lyLflDelta: 2.4,  benchmarkDelta: 1.1, mallAvgDelta: 1.8, countryAvgDelta: 2.1,  unit: 'pp' },  sparkline: spark(10.2, 'up'), invertedSentiment: true },
}

// Monthly revenue trend
export const revenueTrend = [
  { month: 'May',  thisYear: 14_200_000, lastYear: 12_800_000 },
  { month: 'Jun',  thisYear: 15_400_000, lastYear: 13_900_000 },
  { month: 'Jul',  thisYear: 16_800_000, lastYear: 15_200_000 },
  { month: 'Aug',  thisYear: 17_200_000, lastYear: 15_800_000 },
  { month: 'Sep',  thisYear: 18_400_000, lastYear: 16_400_000 },
  { month: 'Oct',  thisYear: 19_200_000, lastYear: 17_200_000 },
  { month: 'Nov',  thisYear: 21_400_000, lastYear: 19_100_000 },
  { month: 'Dec',  thisYear: 24_800_000, lastYear: 22_400_000 },
  { month: 'Jan',  thisYear: 16_400_000, lastYear: 14_800_000 },
  { month: 'Feb',  thisYear: 15_200_000, lastYear: 13_600_000 },
  { month: 'Mar',  thisYear: 17_800_000, lastYear: 15_900_000 },
  { month: 'Apr',  thisYear: 18_200_000, lastYear: 16_400_000 },
]

// Store league table
export const storeLeague = [
  { store: 'Dubai Mall - Centrepoint',         salesVsLy: 18.4, salesAed: 12_400_000 },
  { store: 'Mall of Emirates - Centrepoint',   salesVsLy: 14.2, salesAed: 10_800_000 },
  { store: 'Yas Mall - Splash',                salesVsLy: 12.8, salesAed: 6_200_000  },
  { store: 'City Centre Deira - Babyshop',     salesVsLy: 11.4, salesAed: 4_800_000  },
  { store: 'Mall of Arabia - Shoemart',        salesVsLy: 9.6,  salesAed: 3_400_000  },
  { store: 'Dubai Festival City - Aldo',       salesVsLy: -4.2, salesAed: 2_100_000  },
  { store: 'Ibn Battuta - Gymshark',           salesVsLy: -6.8, salesAed: 1_800_000  },
  { store: 'Mirdif City Centre - Home Centre', salesVsLy: -8.4, salesAed: 1_600_000  },
]
