import { useState } from 'react'
import { TopBar } from '@/components/shell/TopBar'
import { cn } from '@/lib/utils'

type Period = 'YTD' | 'MTD' | 'WTD'

const ADMIN_TABS = [
  'User Management',
  'RBAC',
  'Benchmarks',
  'Alert Thresholds',
  'Liability Config',
  'Data Sources',
  'Audit Log',
  'Campaign Settings',
  'AI Usage',
]

const MOCK_USERS = [
  { id: 1, name: 'Ahmed Al Mansouri', email: 'ahmed@clubapparel.com', role: 'CEO', brand: 'All', status: 'active' },
  { id: 2, name: 'Sarah Johnson',     email: 'sarah@clubapparel.com', role: 'Brand Head', brand: 'Centrepoint', status: 'active' },
  { id: 3, name: 'Rania El-Sharif',  email: 'rania@clubapparel.com', role: 'Country Head', brand: 'UAE', status: 'active' },
  { id: 4, name: 'David Chen',        email: 'david@clubapparel.com', role: 'CLO', brand: 'Central', status: 'active' },
  { id: 5, name: 'Priya Nair',        email: 'priya@clubapparel.com', role: 'Operator', brand: 'Centrepoint', status: 'active' },
  { id: 6, name: 'Mike Torres',       email: 'mike@clubapparel.com',  role: 'Brand Head', brand: 'Splash', status: 'inactive' },
]

export function AdminPage() {
  const [period, setPeriod] = useState<Period>('YTD')
  const [tab, setTab] = useState(ADMIN_TABS[0])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Admin" period={period} onPeriodChange={setPeriod} />

      <div className="flex-shrink-0 border-b border-outline bg-surface overflow-x-auto">
        <div className="flex min-w-max px-4">
          {ADMIN_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-3 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors',
                tab === t ? 'border-primary text-primary font-semibold' : 'border-transparent text-secondary hover:text-on-surface'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'User Management' && <UserManagement />}
        {tab === 'RBAC' && <RBACTab />}
        {tab === 'Data Sources' && <DataSourcesTab />}
        {tab === 'Alert Thresholds' && <AlertThresholdsTab />}
        {tab === 'Audit Log' && <AuditLogTab />}
        {tab === 'AI Usage' && <AIUsageTab />}
        {!['User Management', 'RBAC', 'Data Sources', 'Alert Thresholds', 'Audit Log', 'AI Usage'].includes(tab) && (
          <div className="flex items-center justify-center h-40 text-outline-strong text-[13px]">
            {tab} settings coming soon.
          </div>
        )}
      </div>
    </div>
  )
}

function UserManagement() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-on-surface">Users ({MOCK_USERS.length})</h2>
        <button className="px-4 py-2 text-[12px] font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover">
          + Invite User
        </button>
      </div>
      <div className="card overflow-hidden table-surface">
        <table className="data-table w-full">
          <thead>
            <tr className="border-b border-outline bg-surface-low">
              <th className="text-left p-3 text-outline-strong font-semibold">Name</th>
              <th className="text-left p-3 text-outline-strong font-semibold">Email</th>
              <th className="text-left p-3 text-outline-strong font-semibold">Role</th>
              <th className="text-left p-3 text-outline-strong font-semibold">Brand / Scope</th>
              <th className="text-left p-3 text-outline-strong font-semibold">Status</th>
              <th className="text-left p-3 text-outline-strong font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map(u => (
              <tr key={u.id} className="border-b border-surface-low hover:bg-surface-low/50">
                <td className="p-3 font-medium text-on-surface">{u.name}</td>
                <td className="p-3 text-on-surface-var">{u.email}</td>
                <td className="p-3 text-on-surface-var">{u.role}</td>
                <td className="p-3 text-on-surface-var">{u.brand}</td>
                <td className="p-3">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', u.status === 'active' ? 'badge-positive' : 'bg-surface-high text-secondary')}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-primary text-[11px] font-semibold hover:underline mr-3">Edit</button>
                  <button className="text-negative text-[11px] font-semibold hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RBACTab() {
  const roles = ['CEO', 'Brand Head', 'Country Head', 'CLO / Central CRM', 'Marketing Operator', 'Admin']
  const perms = ['View Analytics', 'Export Data', 'Create Campaign', 'Approve Campaign', 'Manage Users', 'View Admin']
  const access: Record<string, boolean[]> = {
    'CEO': [true, true, false, false, false, false],
    'Brand Head': [true, true, true, false, false, false],
    'Country Head': [true, true, false, false, false, false],
    'CLO / Central CRM': [true, true, true, true, false, false],
    'Marketing Operator': [true, false, true, false, false, false],
    'Admin': [true, true, true, true, true, true],
  }

  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">Role Permissions Matrix</h2>
      <div className="card overflow-x-auto table-surface">
        <table className="data-table">
          <thead>
            <tr className="border-b border-outline bg-surface-low">
              <th className="text-left p-3 text-outline-strong font-semibold min-w-[180px]">Role</th>
              {perms.map(p => (
                <th key={p} className="p-3 text-outline-strong font-semibold text-center whitespace-nowrap">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role} className="border-b border-surface-low">
                <td className="p-3 font-semibold text-on-surface">{role}</td>
                {(access[role] ?? []).map((has, i) => (
                  <td key={i} className="p-3 text-center">
                    {has
                      ? <span className="text-positive text-[14px]">✓</span>
                      : <span className="text-surface-high text-[14px]">–</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DataSourcesTab() {
  const sources = [
    { name: 'POS System',  status: 'healthy', last: '5 min ago',  records: '1.2M txns' },
    { name: 'MoEngage',    status: 'healthy', last: '12 min ago', records: '1.24M members' },
    { name: 'NPS Survey',  status: 'warning', last: '2 hours ago', records: '4,820 responses' },
    { name: 'Social Listening', status: 'healthy', last: '1 hour ago', records: '12,400 mentions' },
    { name: 'Pre-aggregated S3 Cube', status: 'healthy', last: '1 hour ago', records: '42 metric cols' },
  ]

  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">Data Source Status</h2>
      <div className="grid grid-cols-1 gap-3">
        {sources.map(s => (
          <div key={s.name} className="card p-4 flex items-center gap-4">
            <div className={cn('w-3 h-3 rounded-full flex-shrink-0', s.status === 'healthy' ? 'bg-positive' : 'bg-warning')} />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-on-surface">{s.name}</div>
              <div className="text-[11px] text-outline-strong mt-0.5">Last sync: {s.last} · {s.records}</div>
            </div>
            <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', s.status === 'healthy' ? 'badge-positive' : 'badge-warning')}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertThresholdsTab() {
  const thresholds = [
    { metric: 'CA Conversion', threshold: '-3pp vs LY LFL', severity: 'Critical', autoTask: true },
    { metric: 'Active Rate', threshold: '<40%', severity: 'Warning', autoTask: true },
    { metric: 'Points Liability', threshold: '>AED 2.8M', severity: 'Critical', autoTask: false },
    { metric: 'Full Price Sale %', threshold: '-4pp vs LY', severity: 'Warning', autoTask: false },
    { metric: 'Aged Stock %', threshold: '>15%', severity: 'Watch', autoTask: false },
    { metric: 'NPS', threshold: '<38', severity: 'Warning', autoTask: false },
  ]

  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">Alert Threshold Defaults</h2>
      <div className="card overflow-hidden table-surface">
        <table className="data-table w-full">
          <thead>
            <tr className="border-b border-outline bg-surface-low">
              {['Metric', 'Threshold', 'Severity', 'Auto-create Task'].map(h => (
                <th key={h} className="text-left p-3 text-outline-strong font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {thresholds.map(t => (
              <tr key={t.metric} className="border-b border-surface-low">
                <td className="p-3 font-medium text-on-surface">{t.metric}</td>
                <td className="p-3 text-on-surface-var font-mono text-[11px]">{t.threshold}</td>
                <td className="p-3">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    t.severity === 'Critical' ? 'badge-critical' :
                    t.severity === 'Warning' ? 'badge-warning' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  )}>
                    {t.severity}
                  </span>
                </td>
                <td className="p-3">
                  <input type="checkbox" defaultChecked={t.autoTask} className="accent-primary w-4 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AuditLogTab() {
  const log = [
    { time: '2026-05-12 10:24', user: 'David Chen', action: 'Approved campaign "Ramadan Loyalty Booster"', ip: '192.168.1.4' },
    { time: '2026-05-12 09:12', user: 'Sarah Johnson', action: 'Submitted campaign request "Black Member VIP Experience"', ip: '192.168.1.8' },
    { time: '2026-05-11 16:45', user: 'Admin', action: 'Updated Points Liability threshold to AED 2.8M', ip: '10.0.0.2' },
    { time: '2026-05-11 14:32', user: 'David Chen', action: 'Rejected campaign "Q1 Re-engagement"', ip: '192.168.1.4' },
    { time: '2026-05-10 11:18', user: 'Priya Nair', action: 'Exported audience segment CSV (47,382 members)', ip: '192.168.1.12' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-on-surface">Audit Log</h2>
        <button className="px-4 py-2 text-[12px] font-semibold border border-outline rounded-lg hover:bg-surface-low">
          Export CSV
        </button>
      </div>
      <div className="card overflow-hidden table-surface">
        <table className="data-table w-full">
          <thead>
            <tr className="border-b border-outline bg-surface-low">
              {['Timestamp', 'User', 'Action', 'IP'].map(h => (
                <th key={h} className="text-left p-3 text-outline-strong font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {log.map((l, i) => (
              <tr key={i} className="border-b border-surface-low">
                <td className="p-3 text-on-surface-var font-mono text-[11px]">{l.time}</td>
                <td className="p-3 font-medium text-on-surface">{l.user}</td>
                <td className="p-3 text-on-surface-var">{l.action}</td>
                <td className="p-3 text-outline-strong font-mono text-[11px]">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AIUsageTab() {
  const usage = [
    { user: 'Priya Nair',        role: 'Operator', used: 93, cap: 100 },
    { user: 'Sarah Johnson',     role: 'Brand Head', used: 82, cap: 100 },
    { user: 'David Chen',        role: 'CLO', used: 47, cap: 150 },
    { user: 'Rania El-Sharif',  role: 'Country Head', used: 61, cap: 100 },
    { user: 'Ahmed Al Mansouri', role: 'CEO', used: 34, cap: 200 },
  ]

  return (
    <div>
      <h2 className="text-[15px] font-bold text-on-surface mb-4">AI Usage This Month</h2>
      <div className="space-y-3">
        {usage.map(u => (
          <div key={u.user} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-on-surface">{u.user}</span>
                <span className="text-[12px] text-outline-strong">{u.used} / {u.cap} credits</span>
              </div>
              <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(u.used / u.cap) * 100}%`,
                    background: u.used / u.cap > 0.9 ? 'var(--color-negative)' : u.used / u.cap > 0.7 ? 'var(--color-warning)' : 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
