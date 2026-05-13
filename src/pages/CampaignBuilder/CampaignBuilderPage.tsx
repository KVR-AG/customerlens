import { useState } from 'react'
import { TopBar } from '@/components/shell/TopBar'
import { useCampaigns } from '@/hooks/useCampaigns'
import { usePersona } from '@/hooks/usePersona'
import { cn, formatNumber, formatAED } from '@/lib/utils'
import { STATUS_LABELS, STATUS_COLORS, type Campaign } from '@/data/campaigns'

type Period = 'YTD' | 'MTD' | 'WTD'

const WIZARD_STEPS = [
  'Basics',
  'Audience',
  'Channel & Timing',
  'Offer & Mechanic',
  'Creative Brief',
  'Review & Submit',
]

export function CampaignBuilderPage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [activeTab, setActiveTab] = useState<'new' | 'drafts' | 'requests' | 'queue'>('requests')
  const [showWizard, setShowWizard] = useState(false)
  const { data: campaigns } = useCampaigns()
  const { persona } = usePersona()

  const isCentral = persona.id === 'clo'

  const tabs = isCentral
    ? [
        { id: 'queue',    label: 'Approval Queue' },
        { id: 'new',      label: '+ New Global Campaign' },
      ]
    : [
        { id: 'new',      label: '+ New Campaign' },
        { id: 'drafts',   label: 'My Drafts' },
        { id: 'requests', label: 'My Requests' },
      ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Campaign Builder"
        period={period}
        onPeriodChange={setPeriod}
        primaryAction={
          activeTab !== 'new'
            ? { label: '+ New Campaign', onClick: () => { setActiveTab('new'); setShowWizard(true) } }
            : undefined
        }
      />

      {/* Sub-tabs */}
      <div className="border-b border-outline bg-surface flex-shrink-0">
        <div className="flex px-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id as any); if (t.id === 'new') setShowWizard(true); else setShowWizard(false) }}
              className={cn(
                'px-5 py-3 text-[13px] font-medium border-b-2 transition-colors',
                activeTab === t.id
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-secondary hover:text-on-surface'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'new' && (
          <CampaignWizard onCancel={() => setActiveTab(isCentral ? 'queue' : 'requests')} />
        )}
        {activeTab === 'requests' && (
          <CampaignList
            campaigns={campaigns?.filter(c => c.createdBy === 'Sarah Johnson') ?? []}
            title="My Campaign Requests"
          />
        )}
        {activeTab === 'drafts' && (
          <CampaignList
            campaigns={campaigns?.filter(c => c.status === 'draft') ?? []}
            title="Draft Campaigns"
          />
        )}
        {activeTab === 'queue' && (
          <ApprovalQueue campaigns={campaigns ?? []} />
        )}
      </div>
    </div>
  )
}

function CampaignWizard({ onCancel }: { onCancel: () => void }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    objective: '',
    brand: 'R&B Fashion',
    justification: '',
    priority: 'medium',
    audienceSize: 47_382,
    channels: ['Push', 'WhatsApp'],
    offerType: 'Points Multiplier',
    offerDepth: '2x',
  })

  return (
    <div className="max-w-2xl">
      {/* Step indicators */}
      <div className="overflow-x-auto mb-8">
      <div className="flex items-center gap-0 min-w-max">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex items-center gap-2 text-[12px] font-medium',
                i === step ? 'text-primary' : i < step ? 'text-positive cursor-pointer' : 'text-outline-strong'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                i === step ? 'bg-primary text-white' :
                i < step  ? 'bg-positive text-white' :
                'bg-surface-high text-secondary'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={cn('h-px w-6 mx-1', i < step ? 'bg-positive' : 'bg-outline')} />
            )}
          </div>
        ))}
      </div>
      </div>

      {/* Step content */}
      <div className="card p-6 space-y-5">
        <h3 className="text-[16px] font-semibold text-on-surface">
          Step {step + 1}: {WIZARD_STEPS[step]}
        </h3>

        {step === 0 && <StepBasics form={form} setForm={setForm} />}
        {step === 1 && <StepAudience form={form} />}
        {step === 2 && <StepChannel form={form} setForm={setForm} />}
        {step === 3 && <StepOffer form={form} setForm={setForm} />}
        {step === 4 && <StepCreative />}
        {step === 5 && <StepReview form={form} />}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] border border-outline rounded-lg text-secondary hover:bg-surface-low"
          >
            Cancel
          </button>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-[13px] border border-outline rounded-lg text-on-surface hover:bg-surface-low"
            >
              ← Back
            </button>
          )}
          <div className="flex-1" />
          {step < WIZARD_STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 text-[13px] font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-5 py-2 text-[13px] font-semibold bg-positive text-white rounded-lg hover:opacity-90"
            >
              ✓ Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepBasics({ form, setForm }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Campaign Name *</label>
        <input
          value={form.name}
          onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Ramadan Loyalty Booster"
          className="w-full h-10 border border-outline rounded-lg px-3 text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Campaign Objective *</label>
        <select className="w-full h-10 border border-outline rounded-lg px-3 text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option>Increase CA Conversion</option>
          <option>Re-engage Hibernating Members</option>
          <option>Tier Upgrade</option>
          <option>New Enrolment Drive</option>
          <option>Increase Active Rate</option>
          <option>Points Redemption</option>
          <option>Brand Affinity Drive</option>
        </select>
      </div>
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Priority</label>
        <div className="flex gap-2">
          {(['high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setForm((f: any) => ({ ...f, priority: p }))}
              className={cn(
                'px-4 py-2 rounded-lg text-[12px] font-medium capitalize border transition-colors',
                form.priority === p ? 'bg-primary text-white border-primary' : 'border-outline text-secondary hover:bg-surface-low'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Business Justification</label>
        <textarea
          rows={3}
          placeholder="Explain the business case..."
          className="w-full border border-outline rounded-lg px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>
    </div>
  )
}

function StepAudience({ form }: any) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['Build Audience', 'Load Saved', 'Copy from Campaign'].map((o, i) => (
          <button key={o} className={cn('text-[12px] px-3 py-1.5 rounded-lg border font-medium', i === 0 ? 'bg-primary text-white border-primary' : 'border-outline text-secondary')}>
            {o}
          </button>
        ))}
      </div>

      {/* Audience builder */}
      <div className="border border-outline rounded-xl p-4 space-y-3">
        <div className="text-[12px] font-semibold text-on-surface">Audience Filters</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-outline-strong block mb-1">Tier</label>
            <select className="w-full h-9 border border-outline rounded-lg px-2.5 text-[12px]">
              <option>Gold + Black</option><option>Silver only</option><option>All Tiers</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-outline-strong block mb-1">RFM Segment</label>
            <select className="w-full h-9 border border-outline rounded-lg px-2.5 text-[12px]">
              <option>All Segments</option><option>Champions</option><option>At Risk</option><option>Hibernating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audience Quality Scorecard */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="text-[12px] font-bold text-on-surface mb-3">Audience Quality Scorecard</div>
        <div className="text-[32px] font-black tabular-nums text-on-surface">{formatNumber(form.audienceSize)}</div>
        <div className="text-[12px] text-outline-strong mb-3">estimated audience size</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            { label: 'Reachability', value: '84.2%' },
            { label: 'Recent Contact %', value: '18.4%' },
            { label: 'Proj. Liability', value: 'AED 28.4K' },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-lg p-2.5">
              <div className="text-[14px] font-bold tabular-nums">{s.value}</div>
              <div className="text-[10px] text-outline-strong">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Channel reachability bars */}
        <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden">
          <div className="bg-primary" style={{ width: '52%' }} title="Push" />
          <div className="bg-green-400" style={{ width: '28%' }} title="WhatsApp" />
          <div className="bg-amber-400" style={{ width: '14%' }} title="Email" />
          <div className="bg-red-300" style={{ width: '6%' }} title="Undeliverable" />
        </div>
        <div className="flex gap-3 text-[10px] text-outline-strong mt-1">
          {[['Push', '52%'], ['WhatsApp', '28%'], ['Email', '14%'], ['Unreachable', '6%']].map(([l, v]) => (
            <span key={l}>{l} {v}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepChannel({ form, setForm }: any) {
  const channels = ['Push', 'WhatsApp', 'Email', 'SMS', 'In-App']
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-2">Channels (in priority order)</label>
        <div className="flex flex-wrap gap-2">
          {channels.map(ch => (
            <button
              key={ch}
              onClick={() => setForm((f: any) => ({
                ...f,
                channels: f.channels.includes(ch) ? f.channels.filter((c: string) => c !== ch) : [...f.channels, ch],
              }))}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors',
                form.channels.includes(ch) ? 'bg-primary text-white border-primary' : 'border-outline text-secondary'
              )}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Send Window</label>
          <select className="w-full h-10 border border-outline rounded-lg px-3 text-[13px]">
            <option>Morning (8am–11am)</option><option>Afternoon (12pm–4pm)</option><option>Evening (6pm–9pm)</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Start Date</label>
          <input type="date" className="w-full h-10 border border-outline rounded-lg px-3 text-[13px]" />
        </div>
      </div>
    </div>
  )
}

function StepOffer({ form, setForm }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Offer Type</label>
          <select className="w-full h-10 border border-outline rounded-lg px-3 text-[13px]">
            <option>Points Multiplier</option><option>Bonus Points</option><option>Discount Voucher</option><option>Cashback</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Depth / Value</label>
          <input defaultValue="2x" className="w-full h-10 border border-outline rounded-lg px-3 text-[13px]" />
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="text-[12px] font-bold text-amber-800 mb-1">Projected Points Liability</div>
        <div className="text-[24px] font-bold tabular-nums text-amber-900">AED 28,400</div>
        <div className="text-[11px] text-amber-700 mt-1">Based on 47,382 audience × 2x multiplier × avg spend AED 354</div>
      </div>
    </div>
  )
}

function StepCreative() {
  return (
    <div className="space-y-4">
      {[
        { label: 'Headline Intent', placeholder: 'e.g. Double your points this Ramadan' },
        { label: 'Key Message', placeholder: 'e.g. Exclusive bonus for Gold and Black members' },
        { label: 'Call to Action', placeholder: 'e.g. Shop now and earn double' },
      ].map(f => (
        <div key={f.label}>
          <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">{f.label}</label>
          <input
            placeholder={f.placeholder}
            className="w-full h-10 border border-outline rounded-lg px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      ))}
      <div>
        <label className="text-[12px] font-semibold text-on-surface-var block mb-1.5">Tone Notes</label>
        <textarea rows={2} placeholder="e.g. Warm, celebratory, exclusive" className="w-full border border-outline rounded-lg px-3 py-2 text-[13px] resize-none" />
      </div>
    </div>
  )
}

function StepReview({ form }: any) {
  const items = [
    ['Campaign Name', form.name || '—'],
    ['Brand', form.brand],
    ['Priority', form.priority],
    ['Audience Size', formatNumber(form.audienceSize)],
    ['Channels', form.channels.join(', ')],
    ['Offer Type', form.offerType],
    ['Offer Depth', form.offerDepth],
    ['Projected Liability', 'AED 28,400'],
  ]
  return (
    <div className="space-y-3">
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800 font-medium">
        ✓ Ready to submit. The Central CRM team will review within 48 hours.
      </div>
      <div className="table-surface">
      <table className="data-table w-full">
        <tbody>
          {items.map(([k, v]) => (
            <tr key={k}>
              <td className="text-outline-strong font-medium w-40">{k}</td>
              <td className="text-on-surface">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function CampaignList({ campaigns, title }: { campaigns: Campaign[]; title: string }) {
  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">{title}</h2>
      <div className="space-y-3">
        {campaigns.map(c => (
          <div key={c.id} className="card p-4 flex items-center gap-4 card-hover cursor-pointer">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.brandColor }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-on-surface">{c.name}</div>
              <div className="text-[11px] text-outline-strong mt-0.5">{c.brand} · {c.channel.join(', ')} · {formatNumber(c.audienceSize)} recipients</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', STATUS_COLORS[c.status])}>
                {STATUS_LABELS[c.status]}
              </div>
              <div className="text-[10px] text-outline-strong mt-1">{c.scheduledDate}</div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="text-center py-12 text-outline-strong text-[13px]">No campaigns found.</div>
        )}
      </div>
    </div>
  )
}

function ApprovalQueue({ campaigns }: { campaigns: Campaign[] }) {
  const queue = campaigns.filter(c => c.status === 'submitted' || c.status === 'under_review')
  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">Approval Queue ({queue.length})</h2>
      <div className="space-y-3">
        {queue.map(c => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{ background: c.brandColor }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">{c.name}</span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[c.status])}>
                    {STATUS_LABELS[c.status]}
                  </span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize',
                    c.priority === 'high' ? 'badge-critical' : c.priority === 'medium' ? 'badge-warning' : 'bg-surface-high text-secondary'
                  )}>
                    {c.priority}
                  </span>
                </div>
                <div className="text-[11px] text-outline-strong mt-0.5">
                  {c.brand} · {c.channel.join(', ')} · {formatNumber(c.audienceSize)} recipients · Projected liability: {formatAED(c.projectedLiability, true)}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 text-[11px] font-semibold bg-positive text-white rounded-lg hover:opacity-90">
                    ✓ Approve
                  </button>
                  <button className="px-3 py-1.5 text-[11px] font-semibold border border-outline text-on-surface rounded-lg hover:bg-surface-low">
                    Request Revision
                  </button>
                  <button className="px-3 py-1.5 text-[11px] font-semibold text-negative hover:underline">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {queue.length === 0 && (
          <div className="text-center py-12 text-outline-strong text-[13px]">Approval queue is empty.</div>
        )}
      </div>
    </div>
  )
}
