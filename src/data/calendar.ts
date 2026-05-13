export interface CalendarEvent {
  id: string
  campaignId: string
  name: string
  brand: string
  brandColor: string
  channel: string[]
  status: string
  audienceSize: number
  startDate: string
  endDate: string
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'ce1',
    campaignId: 'c1',
    name: 'Ramadan Loyalty Booster',
    brand: 'R&B Fashion',
    brandColor: '#e74c3c',
    channel: ['Push', 'WhatsApp', 'Email'],
    status: 'approved',
    audienceSize: 47_382,
    startDate: '2026-05-14',
    endDate: '2026-05-28',
  },
  {
    id: 'ce2',
    campaignId: 'c2',
    name: 'Silver Tier Reactivation',
    brand: 'LC Waikiki',
    brandColor: '#f39c12',
    channel: ['Email', 'Push'],
    status: 'under_review',
    audienceSize: 12_800,
    startDate: '2026-05-18',
    endDate: '2026-05-25',
  },
  {
    id: 'ce3',
    campaignId: 'c6',
    name: 'Gold Upgrade Incentive',
    brand: 'ALDO',
    brandColor: '#2c3e50',
    channel: ['Email', 'SMS'],
    status: 'live',
    audienceSize: 6_840,
    startDate: '2026-05-05',
    endDate: '2026-05-19',
  },
  {
    id: 'ce4',
    campaignId: 'c3',
    name: 'Black Member VIP Experience',
    brand: 'R&B Fashion',
    brandColor: '#e74c3c',
    channel: ['SMS', 'WhatsApp'],
    status: 'submitted',
    audienceSize: 4_200,
    startDate: '2026-05-20',
    endDate: '2026-05-27',
  },
  {
    id: 'ce5',
    campaignId: 'c4',
    name: 'Kids Summer Campaign',
    brand: "The Children's Place",
    brandColor: '#9b59b6',
    channel: ['Email', 'Push'],
    status: 'draft',
    audienceSize: 28_400,
    startDate: '2026-06-01',
    endDate: '2026-06-15',
  },
]

export const CHANNEL_LOAD: Record<string, number> = {
  '2026-05-14': 124_000,
  '2026-05-15': 89_000,
  '2026-05-16': 52_000,
  '2026-05-17': 61_000,
  '2026-05-18': 148_000,
  '2026-05-19': 98_000,
  '2026-05-20': 72_000,
}
