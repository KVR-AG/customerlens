export type AlertSeverity = 'critical' | 'warning' | 'watch'

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  metric: string
  scope: string
  timestamp: string
  isNew: boolean
}

export interface AIInsight {
  id: string
  text: string
  relatedMetric?: string
  action?: string
  actionPath?: string
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'CA Conversion dropped 4.2pp in Dubai Mall',
    description: 'Below threshold for 3rd consecutive week. Footfall is up 6% but conversion is declining — possible assortment issue.',
    metric: 'CA Conversion',
    scope: 'Dubai Mall · All Brands',
    timestamp: 'Today, 9:14 AM',
    isNew: true,
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Active Rate below 40% for Silver tier members',
    description: 'Silver tier active rate at 38.2%, down 2.4pp vs LY. Silver members represent 31% of CA base.',
    metric: 'Active Rate',
    scope: 'Silver Tier · All Brands',
    timestamp: 'Yesterday, 2:30 PM',
    isNew: true,
  },
  {
    id: 'a3',
    severity: 'critical',
    title: 'Points Liability approaching AED 3M ceiling',
    description: 'Liability at AED 2.84M (+5.3% vs LM). At current issuance rate, ceiling breach expected within 18 days.',
    metric: 'Points Liability',
    scope: 'Group · All Brands',
    timestamp: '2 days ago',
    isNew: false,
  },
  {
    id: 'a4',
    severity: 'warning',
    title: 'Full Price Sale % declining in R&B Fashion',
    description: 'Full price sale at 58.2%, down 4.2pp vs LY. Markdown pressure increasing in Kids and Footwear categories.',
    metric: 'Full Price Sale %',
    scope: 'R&B Fashion · UAE',
    timestamp: '3 days ago',
    isNew: false,
  },
  {
    id: 'a5',
    severity: 'watch',
    title: 'Aged stock % rising in Skechers KSA',
    description: 'Aged stock at 16.4%, up 3.1pp in 8 weeks. Footwear Season 2024 clearance pace below plan.',
    metric: 'Aged Stock %',
    scope: 'Skechers · KSA',
    timestamp: '4 days ago',
    isNew: false,
  },
]

export const aiInsights: AIInsight[] = [
  {
    id: 'i1',
    text: 'Footfall up 6% but conversion down 4pp in Dubai Mall — basket size holding steady, suggesting an assortment gap rather than a pricing issue. Recommending targeted SMS campaign for At Risk members in that catchment.',
    relatedMetric: 'CA Conversion',
    action: 'Create Campaign',
    actionPath: '/campaigns',
  },
  {
    id: 'i2',
    text: 'Gold members show 2.3× higher ASPC vs Silver (AED 1,241 vs AED 534). A tier-upgrade campaign targeting top-spending Silver members could drive meaningful ASPC and revenue lift.',
    relatedMetric: 'Loyalty ASPC',
    action: 'Build Audience',
    actionPath: '/campaigns',
  },
  {
    id: 'i3',
    text: '12,400 "Hibernating" members last purchased in Q3 FY24 have email and push reachability. Re-engagement via a bonus points offer historically yields 14% reactivation rate for this cohort.',
    relatedMetric: 'Active Rate',
    action: 'View Segment',
    actionPath: '/metrics?tab=rfm',
  },
]
