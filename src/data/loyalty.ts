export interface ComparisonFrame {
  current: number
  lyLflDelta: number
  benchmarkDelta: number
  mallAvgDelta: number
  countryAvgDelta: number
  unit: string
}

export interface MetricDef {
  value: number
  comparison: ComparisonFrame
  sparkline: number[]
  label: string
  format: 'aed' | 'pct' | 'number'
  invertedSentiment?: boolean
}

function spark(base: number, trend: 'up' | 'down' | 'flat' = 'up'): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    const noise = (Math.sin(i * 2.4 + base) * 0.03 + 0.02) * base
    const trendFactor = trend === 'up' ? i * base * 0.005 : trend === 'down' ? -i * base * 0.005 : 0
    return Math.max(0, base * 0.88 + trendFactor + noise)
  })
}

export const loyaltyMetrics: Record<string, MetricDef> = {
  // Loyalty Membership
  caBase:        { value: 1_240_000, comparison: { current: 1_240_000, lyLflDelta: 8.2,  benchmarkDelta: 3.1,  mallAvgDelta: 5.4,  countryAvgDelta: 6.2,  unit: 'pct' }, sparkline: spark(1_100_000, 'up'),  label: 'CA Base Members',  format: 'number' },
  caSilver:      { value: 380_000,   comparison: { current: 380_000,   lyLflDelta: 4.1,  benchmarkDelta: -1.2, mallAvgDelta: 2.1,  countryAvgDelta: 3.4,  unit: 'pct' }, sparkline: spark(350_000, 'up'),    label: 'CA Silver',        format: 'number' },
  caGold:        { value: 95_000,    comparison: { current: 95_000,    lyLflDelta: 12.4, benchmarkDelta: 7.2,  mallAvgDelta: 9.1,  countryAvgDelta: 10.3, unit: 'pct' }, sparkline: spark(82_000, 'up'),     label: 'CA Gold',          format: 'number' },
  caBlack:       { value: 12_000,    comparison: { current: 12_000,    lyLflDelta: 18.1, benchmarkDelta: 12.4, mallAvgDelta: 14.2, countryAvgDelta: 16.1, unit: 'pct' }, sparkline: spark(9_800, 'up'),      label: 'CA Black',         format: 'number' },
  newEnrolments: { value: 42_800,    comparison: { current: 42_800,    lyLflDelta: 6.3,  benchmarkDelta: 2.4,  mallAvgDelta: 4.1,  countryAvgDelta: 5.2,  unit: 'pct' }, sparkline: spark(38_000, 'up'),     label: 'New Enrolments',   format: 'number' },

  // Revenue
  caRevenue:     { value: 138_800_000, comparison: { current: 138_800_000, lyLflDelta: 12.4, benchmarkDelta: 5.1, mallAvgDelta: 8.2, countryAvgDelta: 9.4, unit: 'aed' }, sparkline: spark(118_000_000, 'up'), label: 'CA Revenue',     format: 'aed' },
  caRevenuePct:  { value: 68.4,        comparison: { current: 68.4,        lyLflDelta: 3.1,  benchmarkDelta: 1.4, mallAvgDelta: 2.1, countryAvgDelta: 2.8, unit: 'pp'  }, sparkline: spark(64.2, 'up'),        label: 'CA Revenue %',   format: 'pct' },
  caConversion:  { value: 34.8,        comparison: { current: 34.8,        lyLflDelta: 1.2,  benchmarkDelta: 0.8, mallAvgDelta: 1.1, countryAvgDelta: 0.9, unit: 'pp'  }, sparkline: spark(33.2, 'up'),        label: 'CA Conversion',  format: 'pct' },

  // Engagement
  activeRate:    { value: 42.1, comparison: { current: 42.1, lyLflDelta: -1.4, benchmarkDelta: -2.1, mallAvgDelta: -1.8, countryAvgDelta: -1.2, unit: 'pp' }, sparkline: spark(44.2, 'down'), label: 'Active Rate',      format: 'pct' },
  memberFreq:    { value: 2.4,  comparison: { current: 2.4,  lyLflDelta: 0.2,  benchmarkDelta: -0.1, mallAvgDelta: 0.1,  countryAvgDelta: 0.3,  unit: 'number' }, sparkline: spark(2.2, 'up'), label: 'Member Frequency', format: 'number' },
  brandsPerMember: { value: 1.8, comparison: { current: 1.8, lyLflDelta: 0.1, benchmarkDelta: 0.2, mallAvgDelta: 0.1, countryAvgDelta: 0.2, unit: 'number' }, sparkline: spark(1.7, 'up'), label: 'Brands Per Member', format: 'number' },

  // Economics
  loyaltyAspc:  { value: 847,   comparison: { current: 847,   lyLflDelta: -2.1, benchmarkDelta: 4.2,  mallAvgDelta: 1.1, countryAvgDelta: 3.2, unit: 'aed' }, sparkline: spark(864, 'down'),  label: 'Loyalty ASPC', format: 'aed' },
  loyaltyActf:  { value: 2.4,   comparison: { current: 2.4,   lyLflDelta: 0.1,  benchmarkDelta: -0.2, mallAvgDelta: 0.0, countryAvgDelta: 0.1, unit: 'number' }, sparkline: spark(2.3, 'flat'), label: 'Loyalty ACTF', format: 'number' },
  loyaltyAtv:   { value: 354,   comparison: { current: 354,   lyLflDelta: -1.2, benchmarkDelta: 2.1,  mallAvgDelta: 0.8, countryAvgDelta: 1.6, unit: 'aed' }, sparkline: spark(358, 'down'),  label: 'Loyalty ATV',  format: 'aed' },
  repeatRevenue: { value: 94_400_000, comparison: { current: 94_400_000, lyLflDelta: 14.2, benchmarkDelta: 6.1, mallAvgDelta: 9.4, countryAvgDelta: 11.2, unit: 'aed' }, sparkline: spark(82_000_000, 'up'), label: 'Repeat Revenue', format: 'aed' },
  newRevenue:    { value: 44_400_000, comparison: { current: 44_400_000, lyLflDelta: 8.4,  benchmarkDelta: 3.2, mallAvgDelta: 5.1, countryAvgDelta: 6.8,  unit: 'aed' }, sparkline: spark(40_000_000, 'up'), label: 'New Revenue',    format: 'aed' },

  // Points Economics
  issuedPoints:        { value: 142_000_000, comparison: { current: 142_000_000, lyLflDelta: 9.2,  benchmarkDelta: 4.1, mallAvgDelta: 6.2,  countryAvgDelta: 7.4,  unit: 'pct' }, sparkline: spark(128_000_000, 'up'),  label: 'Issued Points',    format: 'number' },
  redeemedPoints:      { value: 48_600_000,  comparison: { current: 48_600_000,  lyLflDelta: 14.1, benchmarkDelta: 8.2, mallAvgDelta: 11.1, countryAvgDelta: 12.4, unit: 'pct' }, sparkline: spark(42_000_000, 'up'),   label: 'Redeemed Points',  format: 'number' },
  liabilityPoints:     { value: 284_000_000, comparison: { current: 284_000_000, lyLflDelta: 5.3,  benchmarkDelta: 2.1, mallAvgDelta: 3.4,  countryAvgDelta: 4.1,  unit: 'pct' }, sparkline: spark(264_000_000, 'up'),  label: 'Liability Points', format: 'number' },
  pointsLiabilityAed:  { value: 2_840_000,   comparison: { current: 2_840_000,   lyLflDelta: 5.3,  benchmarkDelta: 2.1, mallAvgDelta: 3.4,  countryAvgDelta: 4.1,  unit: 'aed' }, sparkline: spark(2_600_000, 'up'),   label: 'Points Liability', format: 'aed', invertedSentiment: true },
  redemptionRate:      { value: 34.2, comparison: { current: 34.2, lyLflDelta: 2.1,  benchmarkDelta: 1.4, mallAvgDelta: 1.8, countryAvgDelta: 2.0, unit: 'pp' }, sparkline: spark(32.1, 'up'),   label: 'Redemption Rate', format: 'pct' },
  breakageRate:        { value: 18.7, comparison: { current: 18.7, lyLflDelta: -1.2, benchmarkDelta: 0.8, mallAvgDelta: -0.4, countryAvgDelta: 0.2, unit: 'pp' }, sparkline: spark(19.8, 'down'), label: 'Breakage Rate',   format: 'pct' },
}

// RFM Segments
export const rfmSegments = [
  { name: 'Champions',           count: 87_400,  pct: 7.1,  trend: 2.1  },
  { name: 'Loyal Customers',     count: 198_200, pct: 16.0, trend: 1.4  },
  { name: 'Potential Loyalists', count: 224_800, pct: 18.1, trend: 3.2  },
  { name: 'Promising',           count: 112_400, pct: 9.1,  trend: -0.8 },
  { name: 'At Risk',             count: 156_800, pct: 12.6, trend: -2.4 },
  { name: 'Hibernating',         count: 284_200, pct: 22.9, trend: 0.6  },
  { name: 'Lost Customers',      count: 124_800, pct: 10.1, trend: -1.8 },
  { name: 'New Customers',       count: 51_400,  pct: 4.1,  trend: 8.2  },
]

// Segment movement
export const segmentMovement = [
  { from: 'Champions',           to: 'Loyal Customers',     value: 4_200 },
  { from: 'Champions',           to: 'At Risk',             value: 1_800 },
  { from: 'Loyal Customers',     to: 'Champions',           value: 3_600 },
  { from: 'Loyal Customers',     to: 'Potential Loyalists', value: 8_400 },
  { from: 'Potential Loyalists', to: 'Loyal Customers',     value: 6_200 },
  { from: 'At Risk',             to: 'Hibernating',         value: 9_200 },
  { from: 'Hibernating',         to: 'Lost Customers',      value: 7_400 },
  { from: 'New Customers',       to: 'Potential Loyalists', value: 6_800 },
]

// Demographics
export const demographics = {
  genderSplit:  [{ name: 'Male', value: 58.4 }, { name: 'Female', value: 41.6 }],
  ageSlab: [
    { name: '18-24', value: 12.1 },
    { name: '25-34', value: 28.4 },
    { name: '35-44', value: 24.2 },
    { name: '45-54', value: 18.6 },
    { name: '55+',   value: 16.7 },
  ],
  under35Share: 40.5,
  topNationalities: [
    { name: 'Emirati',    value: 22.4 },
    { name: 'Indian',     value: 18.6 },
    { name: 'Pakistani',  value: 9.2  },
    { name: 'Egyptian',   value: 6.4  },
    { name: 'Filipino',   value: 5.8  },
    { name: 'Other Arab', value: 14.2 },
    { name: 'Other',      value: 23.4 },
  ],
  arabCountriesShare: 43.2,
}

// CX
export const cxMetrics = {
  nps:  { value: 42,  trend: [38, 40, 39, 41, 42, 43, 42, 44, 43, 42, 44, 42] },
  csat: { value: 4.1, trend: [3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.1, 4.1, 4.2, 4.1, 4.2, 4.1] },
  ces:  { value: 3.8, trend: [3.6, 3.7, 3.7, 3.8, 3.7, 3.8, 3.9, 3.8, 3.8, 3.9, 3.8, 3.8] },
  socialSentiment: { positive: 64.2, neutral: 24.1, negative: 11.7 },
}
