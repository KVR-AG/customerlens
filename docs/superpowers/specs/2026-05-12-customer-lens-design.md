# Customer Lens — Design Spec
**Date:** 2026-05-12  
**Phase:** 1 — Descriptive & Foundational Action Layer  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v3 + shadcn/ui + Recharts + Framer Motion + React Router v6 + TanStack Query  
**Auth:** Skipped for Phase 1 — login button navigates directly to `/home`

---

## 1. Project Structure

```
D:/Project/customer-lens/
├── src/
│   ├── pages/
│   │   ├── Login/              # Parallax login page
│   │   ├── Home/               # Home / My View
│   │   ├── MetricsExplorer/    # Descriptive analytics
│   │   ├── CampaignBuilder/    # Campaign request workflow
│   │   ├── ActionQueue/        # Task inbox
│   │   ├── Calendar/           # Portfolio calendar
│   │   ├── TalkToData/         # NLP chat interface
│   │   └── Admin/              # Configuration & governance
│   ├── components/
│   │   ├── shell/              # SideNav, TopBar, AppLayout
│   │   ├── charts/             # SparkLine, BarChart, Sankey, LineChart
│   │   ├── metrics/            # KPITile, ComparisonFrame, MetricCard
│   │   ├── alerts/             # AlertCard, InsightCard
│   │   ├── campaigns/          # WizardStep, AudienceScorecard, CampaignCard
│   │   └── ui/                 # shadcn base components (button, badge, etc.)
│   ├── data/
│   │   ├── loyalty.ts          # All 42 metrics from Excel with dummy values
│   │   ├── retail.ts           # Operational retail metrics
│   │   ├── campaigns.ts        # Dummy campaign requests
│   │   ├── alerts.ts           # Dummy alerts and AI insights
│   │   ├── personas.ts         # 5 persona definitions with KPI sets
│   │   └── calendar.ts         # Dummy campaign calendar events
│   ├── hooks/
│   │   ├── useMetrics.ts       # TanStack Query wrapper — swappable to real API
│   │   ├── useAlerts.ts
│   │   ├── useCampaigns.ts
│   │   └── usePersona.ts       # Active persona context
│   ├── lib/
│   │   ├── utils.ts            # cn(), formatAED(), formatPct(), formatDelta()
│   │   └── constants.ts        # Metric domain list, nav items, tier colours
│   └── styles/
│       └── tokens.css          # All CSS custom properties (plug-and-play theme)
├── docs/
│   └── superpowers/specs/
│       └── 2026-05-12-customer-lens-design.md
└── .superpowers/               # Visual brainstorm sessions (add to .gitignore)
```

---

## 2. Design System

### Color tokens (`src/styles/tokens.css`)
Every color is a CSS custom property (hex values). `tailwind.config.ts` maps them via `var(--color-*)` in `extend.colors`. To rebrand the entire platform: edit the values in this one file — Tailwind picks up the change automatically.

```css
:root {
  --color-primary:              #0058bc;
  --color-primary-hover:        #0070eb;
  --color-background:           #f9f9f9;
  --color-surface:              #ffffff;
  --color-surface-low:          #f3f3f3;
  --color-surface-high:         #e8e8e8;
  --color-on-surface:           #1a1c1c;
  --color-on-surface-variant:   #414755;
  --color-secondary:            #5d5e63;
  --color-outline:              #c1c6d7;
  --color-outline-strong:       #717786;
  --color-positive:             #1e7a3c;   /* text/icon */
  --color-positive-bg:          #d1fae5;   /* badge bg */
  --color-negative:             #ba1a1a;
  --color-negative-bg:          #ffdad6;
  --color-warning:              #c64f00;
  --color-warning-bg:           #fff0e6;
  --color-watch:                #9e3d00;
  --color-ai-accent:            #5e5ce6;
  --color-ai-bg:                rgba(94,92,230,0.08);
}
```

### Typography
- Font: **Inter** (Google Fonts)
- Numbers: `font-variant-numeric: tabular-nums lining-nums` on all metric values
- Scale: display/32, h1/24, h2/20, h3/16, body-lg/16, body-md/14, body-sm/13, label-md/12, label-sm/11

### Elevation
- Level 0 background: `#f9f9f9`
- Level 1 cards: `#ffffff` + `1px solid var(--color-outline)` + `box-shadow: 0 2px 8px rgba(0,0,0,0.04)` + `border-radius: 12px`
- Level 2 modals/popovers: same + `box-shadow: 0 10px 30px rgba(0,0,0,0.08)`

---

## 3. App Shell

### SideNav (fixed, 220px)
- Brand: "Customer Lens" / "Enterprise Analytics" sub-label
- Nav items: Home, Metrics Explorer, Campaign Builder, Action Queue (badge with count), Calendar, Talk to your Data, Admin (separated by divider)
- Active state: `bg-surface-high text-primary font-semibold`
- Footer: User avatar + name + role + AI usage pill (% of monthly cap)
- Persona dev-switcher: small `<select>` in sidebar footer, always visible (this is a demo-first build — no auth to infer persona from)

### TopBar (52px)
- Left: persona greeting ("Good morning, {name}")
- Center: YTD / MTD / WTD segmented control (default YTD)
- Right: Export PDF button + context action (e.g. "+ New Campaign" on Home, "+ New Filter" on Metrics Explorer)
- AI usage pill visible when on any AI-consuming page

### AppLayout
Wraps all authenticated pages. Renders `<SideNav>` + `<TopBar>` + `<main>` scrollable content area.

---

## 4. Login Page (`/`)

### Structure
Full-height single page. Sticky transparent nav at top with "Customer Lens" wordmark left, "Sign In →" anchor link right that smooth-scrolls to `#login`.

### Parallax Sections (Framer Motion `useScroll` + `useTransform`)
Each section is 100vh. Background layers move at 0.3× scroll speed. Metric cards / UI previews move at 0.6× speed. Foreground text moves at 1× (normal scroll).

| # | Section | Parallax content |
|---|---------|-----------------|
| 1 | **Hero** | "Customer Lens" wordmark + tagline. Grid background drifts back. 3 floating metric cards (CA Revenue, Active Rate, CA Base) drift at different rates. |
| 2 | **Metrics Explorer** | 6 KPI tiles float in from sides. Label: "See everything, across every brand." |
| 3 | **Campaign Builder** | Campaign wizard card rises from bottom. Audience scorecard populates live. Label: "From insight to action in minutes." |
| 4 | **AI Insights** | 3 alert/insight cards cascade. Label: "AI that flags what matters, before you ask." |
| 5 | **Login** | Dashboard tiles blurred behind (Concept C). Glassmorphic login card. "Customer Lens" title + "Continue with Microsoft" button → navigates to `/home`. |

### Login card (section 5, `id="login"`)
- `backdrop-filter: blur(12px)` over dimmed dashboard tiles
- Card: `bg-[rgba(15,18,28,0.9)] border border-white/10 rounded-2xl`
- Microsoft SSO button: `bg-primary` with MS four-square icon, `onClick → navigate('/home')`
- Footer: "Access managed by your organization."

---

## 5. Home / My View (`/home`)

### Blocks (top to bottom)
1. **KPI Tiles** — 5 tiles per persona (see below). Each: value, delta vs LY LFL (color-coded), 12-week sparkline, click → Metrics Explorer pre-filtered.
2. **Alert Feed** — Critical 🔴 / Warning 🟠 / Watch 🟡 cards. Each has: trigger text, scope, Investigate button (→ Metrics Explorer), Create Task button, Suggest Campaign button.
3. **AI Insights** — 3 narrative cards. Manual Refresh button.
4. **Store League Table** — CEO and Country Head only. Top 5 / Bottom 5 by Sales vs LY LFL %.
5. **Quick Actions** — Persona-specific action chips.
6. **Campaign Request Status** — Brand users only. Open requests with status pills.

### Persona KPI sets (dummy data)
| Persona | KPIs |
|---------|------|
| CEO | Group Revenue, CA Revenue %, Active Rate, Points Liability, CA Base |
| Brand Head | Brand Sales, GM%, CA Conversion, Repeat Rate, ASPC |
| Country Head | Country Sales, Footfall, Conversion Rate, NPS, CA Revenue % |
| CLO / Central | Total Campaigns Live, Audience Overlap Risk, Liability MTD, Approval Queue Depth, Active Rate |
| Marketing Operator | Campaign Audience Size, Reachability %, Recent Contact %, Projected Liability, Pending Approvals |

---

## 6. Metrics Explorer (`/metrics`)

### Layout
Two-panel: left filter panel (260px fixed) + right metric display (fluid).

### Left panel
- Period selector (YTD/MTD/WTD/custom)
- Granularity breadcrumb (Group → Brand → Country → City → Mall → Store → Dept → Class → Sub-class)
- Dimension slicers: Geography, Brand & Product, Loyalty (Tier, Member Status, RFM), Channel, Demographic
- Saved Filters: list of saved filter combos, "+ Save current"

### Right panel — 10 domain sub-tabs
| # | Domain | Key metrics rendered |
|---|--------|---------------------|
| 1 | Sales & Conversion | Sales, Footfall, Conversion Rate, AOV, ASP, UPT, Apparel Revenue, Apparel Txn |
| 2 | Customer Economics | Loyalty ATV, Apparel ATV, ASPC, ACTF, Repeat Revenue, New Revenue, Incremental Lift, Est. Annual Impact |
| 3 | Margin & Pricing | GM, GM%, AMD%, Full Price Sale % |
| 4 | Stock Health | Week Cover, Sell-Through Rate, Aged Stock %, Stock Turnover Ratio, Options/SqFt, Sales per Option, Fresh/Last Season/Old Season Option % |
| 5 | Loyalty Membership | CA Base/Silver/Gold/Black counts, New Enrolments, Loyalty Shoppers, Repeat Customers, CA Revenue, CA Revenue %, CA Conversion |
| 6 | Engagement | Active Rate, Member Frequency, Brands Per Member |
| 7 | Points Economics | Issued Points, Redeemed Points, Liability Points, Points Liability (AED), Redemption Rate, Breakage Rate |
| 8 | RFM & Segments | Segment counts table, Segment Movement flow diagram (custom SVG Sankey — Recharts has no built-in Sankey; implement as a static proportional-flow visualization with Recharts Sankey from recharts v2.4+ if available, else custom SVG), Brand Affinity distribution bar |
| 9 | Demographics | Gender Split (pie), Age Slab Split (bar), Under 35 Share, Gender × Age Slab (clustered bar), Top Nationalities (horizontal bar), Arab Countries Share |
| 10 | CX | NPS score + trend, CES, CSAT, Social Sentiment gauge |

### Comparison frame (on every metric)
5-column chip below each value:
`Current | LY LFL Δ | Benchmark Δ | Mall Avg Δ | Country Avg Δ`
Positive delta: green. Negative: red. N/A when sample < 5 stores.

### Summary vs Deep-dive view
Toggle per metric. Summary = grid of metric tiles. Deep-dive = full Recharts time-series + breakdown table + ranked list.

---

## 7. Campaign Builder (`/campaigns`)

### Brand user sub-tabs
- `+ New Campaign` (default) — 6-step wizard
- My Drafts
- My Submitted Requests (with status pills)
- My Saved Filters

### Central team sub-tabs
- Approval Queue (default)
- Calendar
- Live Campaigns
- Completed Campaigns
- `+ New Campaign on behalf of brand`
- `+ New Global Campaign`

### Six-step wizard
| Step | Key fields |
|------|-----------|
| 1. Basics | Name, objective dropdown, brand (auto), business justification, priority |
| 2. Audience | Build/load/copy toggle. Live count. Audience Quality Scorecard (size warning, reachability breakdown by channel, recent contact %, cross-overlap, sample preview, projected liability). |
| 3. Channel & Timing | Channel multi-select with ranking, send window, send time preference, cadence |
| 4. Offer & Mechanic | Offer type, depth, eligibility, validity, auto-calculated projected liability |
| 5. Creative Brief | Headline intent, key message, CTA, tone notes |
| 6. Review & Submit | Full summary, edit per section, Save Draft / Submit |

### Approval workflow states
`Draft → Submitted → Under Review → Needs Revision → Approved → Live → Completed → Rejected`

---

## 8. Action Queue (`/actions`)

### Layout
Filter bar (Status, Priority, Source, Assignee, Date) + task card list.

### Task card
- Title (auto from trigger), trigger summary, created/due dates, priority badge, status
- AI Recommended Actions: 2-3 action chips with Investigate (→ Metrics Explorer) or Campaign (→ Campaign Builder pre-filled)
- Quick actions: Mark In Progress, Mark Done, Dismiss, Reassign
- Expand → full detail: metric context + comparison frame + comment thread + resolution notes

---

## 9. Calendar (`/calendar`)

### Layout
View toggle (Day/Week/Month). Date navigator. Filter bar (Channel, Country, Status, Brand for central team).

### Content
- Campaign blocks color-coded by brand spanning scheduled dates
- Hover popover: campaign name, brand, channel, audience size, status
- Click → Campaign Builder request detail
- Channel load bars below each date column (total messages per channel)
- Click empty date → quick-create menu → Campaign Builder with date pre-filled

---

## 10. Talk to your Data (`/chat`)

### Layout
Full-height chat interface. Input bar bottom. Message thread above.

### Behavior
- User message → simulated "thinking" state (300ms) → response card
- Response card: narrative text + inline Recharts chart (bar/line depending on query type)
- Stateful: follow-up questions maintain filter context ("now show me by country")
- Out-of-scope queries respond: "This question is outside the current data scope."
- All numbers drawn from mock data layer, never fabricated in response text

### Sample queries wired with dummy responses
- "What is the active rate for Gold members YTD?"
- "Show CA Revenue by brand this month"
- "Which store has the lowest conversion rate in Dubai?"
- "How are Points Liability trending vs last year?"

---

## 11. Admin (`/admin`)

### Sub-tabs
1. User Management — user table, create/edit/deactivate modal, role + brand/country scope assignment
2. RBAC — role definitions table, permissions matrix
3. Brand & Benchmark Configuration — brand list, benchmark mapping per brand
4. Alert Threshold Defaults — metric threshold table, severity mapping, auto-task rules
5. Liability Configuration — redemption rate input, points value (AED/pt)
6. Data Source Management — integration status cards (POS, MoEngage, CX, Social), refresh timestamps
7. Audit Log — searchable table of sensitive actions, export CSV button
8. Global Campaign Settings — opt-in window duration, deadline lead time
9. AI Usage & Limits — per-user spend cap table, monthly consumption chart

---

## 12. Mock Data Strategy

All data lives in `src/data/`. TanStack Query hooks wrap the data with `queryFn: () => Promise.resolve(mockData)` so swapping to a real API endpoint is a one-line change per hook.

```typescript
// Example — src/hooks/useMetrics.ts
export const useLoyaltyMetrics = () =>
  useQuery({ queryKey: ['loyalty-metrics'], queryFn: () => fetchLoyaltyMetrics() })

// src/data/loyalty.ts
export const fetchLoyaltyMetrics = async () => loyaltyMockData  // swap URL here later
```

### Realistic dummy values (from Excel + PRD)
- CA Revenue: AED 138.8M (YTD)
- CA Revenue %: 68.4%
- CA Conversion: 34.8%
- Apparel Revenue: AED 203.0M
- CA Base: 1,240,000
- CA Silver: 380,000 | CA Gold: 95,000 | CA Black: 12,000
- Loyalty ASPC: AED 847
- Loyalty ACTF: 2.4
- Active Rate: 42.1%
- Member Frequency: 2.4
- Points Liability: AED 2.84M
- Redemption Rate: 34.2%
- Breakage Rate: 18.7%
- Issued Points: 142M | Redeemed Points: 48.6M
- NPS: 42 | CSAT: 4.1/5 | CES: 3.8/5

Comparison frame generated per metric: `{ current, lyLfl, lyLflDelta, benchmark, benchmarkDelta, mallAvg, mallAvgDelta, countryAvg, countryAvgDelta }`

---

## 13. Routing

```typescript
/               →  <LoginPage />           (no AppLayout wrapper)
/home           →  <HomePage />
/metrics        →  <MetricsExplorerPage />
/campaigns      →  <CampaignBuilderPage />
/actions        →  <ActionQueuePage />
/calendar       →  <CalendarPage />
/chat           →  <TalkToDataPage />
/admin          →  <AdminPage />
```

All `/home` and below wrapped in `<AppLayout>` (SideNav + TopBar).

---

## 14. Out of scope for this build
- Real Microsoft SSO / authentication
- Real API calls (all data is mock)
- MoEngage API integration
- PDF export (button present, no-op)
- Predictive ML features (Phase 2)
- Multilingual output
- Real AI/LLM calls (Talk to Data uses canned responses)
