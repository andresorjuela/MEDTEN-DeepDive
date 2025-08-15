// Dashboard API facade (mock or live PostHog via serverless proxy)
import {
  getDashboardKPIs,
  getLeadTypeDistribution,
  getTrafficSourceBreakdown,
  getRecentLeads,
  getTopProducts,
  getTopLandingPages,
  getLostLeads,
  getLiveActions,
  getSeoKeywords,
  getPerfIssues,
} from '../mocks/dashboard'

const USE_LIVE = String(import.meta.env.VITE_MOCK_MODE || '').toLowerCase() === 'false'

async function query(hogql) {
  const r = await fetch('/api/posthog-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: hogql }),
  })
  if (!r.ok) throw new Error('PostHog query failed')
  return r.json()
}

// Live adapters (shape responses the same way as mocks)
async function liveGetDashboardKPIs() {
  const data = await query(`
    SELECT
      'inquiries' as key, 'Total Inquiries' as title, countIf(event='inquiry_submitted') as value, 35 as delta
    FROM events WHERE timestamp > now() - interval 30 day
  `)
  // For brevity we return mock-ish result; expand later
  return [
    { key: 'inquiries', title: 'Total Inquiries', value: 193000, delta: 35 },
    { key: 'conversion', title: 'Conversion Rate', value: 4.2, delta: 0.3 },
    { key: 'dropoff', title: 'Drop-Off Rate', value: 24, delta: -2 },
    { key: 'hot', title: 'Hot Leads', value: 563, delta: 12 },
  ]
}

async function liveGetLeadTypeDistribution() {
  // Example placeholder; implement real HogQL bucketing later
  return { labels: ['Hot', 'Warm', 'Cold', 'Lost'], data: [120, 320, 210, 35] }
}

async function liveGetTrafficSourceBreakdown() {
  const res = await query(`
    SELECT properties.source as s, count() AS c
    FROM events WHERE event='page_view' AND timestamp > now() - interval 30 day
    GROUP BY s ORDER BY c DESC
  `)
  // Shape to labels/data
  const labels = [],
    data = []
  for (const row of res?.results?.[0]?.results || []) {
    labels.push(row[0])
    data.push(row[1])
  }
  return { labels, data }
}

async function liveGetRecentLeads({ page = 1, limit = 10 }) {
  // Placeholder demo: return mock-style
  const m = await getRecentLeads({ page, limit })
  return m
}

export const dashboardApi = {
  getDashboardKPIs: USE_LIVE ? liveGetDashboardKPIs : getDashboardKPIs,
  getLeadTypeDistribution: USE_LIVE ? liveGetLeadTypeDistribution : getLeadTypeDistribution,
  getTrafficSourceBreakdown: USE_LIVE ? liveGetTrafficSourceBreakdown : getTrafficSourceBreakdown,
  getRecentLeads: USE_LIVE ? liveGetRecentLeads : getRecentLeads,
  getTopProducts: USE_LIVE ? getTopProducts : getTopProducts,
  getTopLandingPages: USE_LIVE ? getTopLandingPages : getTopLandingPages,
  getLostLeads: USE_LIVE ? getLostLeads : getLostLeads,
  getLiveActions: USE_LIVE ? getLiveActions : getLiveActions,
  getSeoKeywords: USE_LIVE ? getSeoKeywords : getSeoKeywords,
  getPerfIssues: USE_LIVE ? getPerfIssues : getPerfIssues,
}
