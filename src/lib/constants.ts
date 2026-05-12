export const NAV_ITEMS = [
  { id: 'home',      label: 'Home',              icon: '⌂',  path: '/home' },
  { id: 'metrics',   label: 'Metrics Explorer',  icon: '◈',  path: '/metrics' },
  { id: 'campaigns', label: 'Campaign Builder',  icon: '✦',  path: '/campaigns' },
  { id: 'actions',   label: 'Action Queue',      icon: '☑',  path: '/actions', badge: 4 },
  { id: 'calendar',  label: 'Calendar',          icon: '◻',  path: '/calendar' },
  { id: 'chat',      label: 'Talk to your Data', icon: '✧',  path: '/chat' },
] as const

export const NAV_BOTTOM = [
  { id: 'admin', label: 'Admin', icon: '⚙', path: '/admin' },
] as const

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
  { id: 'all', label: 'All Brands', color: '#0058bc' },
  { id: 'centrepoint', label: 'Centrepoint', color: '#e74c3c' },
  { id: 'splash', label: 'Splash', color: '#f39c12' },
  { id: 'babyshop', label: 'Babyshop', color: '#9b59b6' },
  { id: 'shoemart', label: 'Shoemart', color: '#1abc9c' },
  { id: 'aldo', label: 'Aldo', color: '#2c3e50' },
  { id: 'gymshark', label: 'Gymshark', color: '#27ae60' },
  { id: 'homecentre', label: 'Home Centre', color: '#e67e22' },
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
