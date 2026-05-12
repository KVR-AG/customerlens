export type CampaignStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_revision'
  | 'approved'
  | 'live'
  | 'completed'
  | 'rejected'

export interface Campaign {
  id: string
  name: string
  brand: string
  brandColor: string
  objective: string
  channel: string[]
  audienceSize: number
  status: CampaignStatus
  submittedAt: string
  scheduledDate: string
  endDate?: string
  priority: 'high' | 'medium' | 'low'
  createdBy: string
  projectedLiability: number
}

export const campaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Ramadan Loyalty Booster',
    brand: 'Centrepoint',
    brandColor: '#e74c3c',
    objective: 'Increase CA Conversion',
    channel: ['Push', 'WhatsApp', 'Email'],
    audienceSize: 47_382,
    status: 'approved',
    submittedAt: '2026-05-08',
    scheduledDate: '2026-05-14',
    endDate: '2026-05-28',
    priority: 'high',
    createdBy: 'Sarah Johnson',
    projectedLiability: 28_400,
  },
  {
    id: 'c2',
    name: 'Silver Tier Reactivation',
    brand: 'Splash',
    brandColor: '#f39c12',
    objective: 'Re-engage Hibernating Members',
    channel: ['Email', 'Push'],
    audienceSize: 12_800,
    status: 'under_review',
    submittedAt: '2026-05-10',
    scheduledDate: '2026-05-18',
    priority: 'medium',
    createdBy: 'Marketing Team',
    projectedLiability: 9_600,
  },
  {
    id: 'c3',
    name: 'Black Member VIP Experience',
    brand: 'Centrepoint',
    brandColor: '#e74c3c',
    objective: 'Reward Top Members',
    channel: ['SMS', 'WhatsApp'],
    audienceSize: 4_200,
    status: 'submitted',
    submittedAt: '2026-05-11',
    scheduledDate: '2026-05-20',
    priority: 'high',
    createdBy: 'Sarah Johnson',
    projectedLiability: 12_600,
  },
  {
    id: 'c4',
    name: 'Kids Summer Campaign',
    brand: 'Babyshop',
    brandColor: '#9b59b6',
    objective: 'Increase Sales',
    channel: ['Email', 'Push'],
    audienceSize: 28_400,
    status: 'draft',
    submittedAt: '2026-05-12',
    scheduledDate: '2026-06-01',
    priority: 'medium',
    createdBy: 'Marketing Team',
    projectedLiability: 8_520,
  },
  {
    id: 'c5',
    name: 'At Risk Win-Back',
    brand: 'Shoemart',
    brandColor: '#1abc9c',
    objective: 'Prevent Churn',
    channel: ['Push', 'Email'],
    audienceSize: 8_600,
    status: 'needs_revision',
    submittedAt: '2026-05-07',
    scheduledDate: '2026-05-15',
    priority: 'high',
    createdBy: 'Marketing Team',
    projectedLiability: 6_450,
  },
  {
    id: 'c6',
    name: 'Gold Upgrade Incentive',
    brand: 'Aldo',
    brandColor: '#2c3e50',
    objective: 'Tier Upgrade',
    channel: ['Email', 'SMS'],
    audienceSize: 6_840,
    status: 'live',
    submittedAt: '2026-05-01',
    scheduledDate: '2026-05-05',
    endDate: '2026-05-19',
    priority: 'medium',
    createdBy: 'Marketing Team',
    projectedLiability: 5_130,
  },
]

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft:          'Draft',
  submitted:      'Submitted',
  under_review:   'Under Review',
  needs_revision: 'Needs Revision',
  approved:       'Approved',
  live:           'Live',
  completed:      'Completed',
  rejected:       'Rejected',
}

export const STATUS_COLORS: Record<CampaignStatus, string> = {
  draft:          'bg-surface-high text-secondary',
  submitted:      'bg-blue-50 text-blue-600 border border-blue-200',
  under_review:   'bg-amber-50 text-amber-700 border border-amber-200',
  needs_revision: 'bg-orange-50 text-orange-700 border border-orange-200',
  approved:       'bg-green-50 text-green-700 border border-green-200',
  live:           'bg-primary text-white',
  completed:      'bg-surface-high text-secondary',
  rejected:       'badge-critical',
}
