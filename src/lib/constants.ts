import {
  LayoutDashboard,
  BarChart2,
  Megaphone,
  ListChecks,
  Calendar,
  BrainCircuit,
  Settings2,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  path: string
  badge?: number
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home',      label: 'Home',              icon: LayoutDashboard, path: '/home' },
  { id: 'metrics',   label: 'Metrics Explorer',  icon: BarChart2,       path: '/metrics' },
  { id: 'campaigns', label: 'Campaign Builder',  icon: Megaphone,       path: '/campaigns' },
  { id: 'actions',   label: 'Action Queue',      icon: ListChecks,      path: '/actions', badge: 4 },
  { id: 'calendar',  label: 'Calendar',          icon: Calendar,        path: '/calendar' },
  { id: 'chat',      label: 'Talk to your Data', icon: BrainCircuit,    path: '/chat' },
]

export const NAV_BOTTOM: NavItem[] = [
  { id: 'admin', label: 'Admin', icon: Settings2, path: '/admin' },
]

export const METRIC_DOMAINS = [
  'Sales & Conversion',
  'Customer Economics',
  'Margin & Pricing',
  'Stock Health',
  'Loyalty Membership',
  'Engagement',
  'Points Economics',
  'RFM & Segments',
  'Demographics',
  'CX',
] as const

export const BRANDS = [
  { id: 'all',  label: 'All Brands',           color: '#0058bc' },
  { id: 'rb',   label: 'R&B Fashion',           color: '#e74c3c' },
  { id: 'lcw',  label: 'LC Waikiki',            color: '#f39c12' },
  { id: 'tcp',  label: "The Children's Place",  color: '#9b59b6' },
  { id: 'sk',   label: 'Skechers',              color: '#1abc9c' },
  { id: 'al',   label: 'ALDO',                  color: '#2c3e50' },
  { id: 'adi',  label: 'Adidas',                color: '#27ae60' },
  { id: '6st',  label: '6thStreet.com',         color: '#e67e22' },
] as const

export const TIER_COLORS = {
  Silver: '#94a3b8',
  Gold:   '#f59e0b',
  Black:  '#1e293b',
} as const

export const RFM_SEGMENT_COLORS: Record<string, string> = {
  Champions:       '#1e7a3c',
  'Loyal Customers': '#0058bc',
  'Potential Loyalists': '#7c3aed',
  'Promising':     '#0891b2',
  'At Risk':       '#c64f00',
  Hibernating:     '#ba1a1a',
  'Lost Customers': '#6b7280',
  'New Customers': '#34c759',
}
