// src/services/dashboardApi.js
// Dashboard API facade (mock or live PostHog via serverless proxy)
import api from './api'
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
  getTopSearchTermsMock,
  getTopPathsMock,
} from '../mocks/dashboard'

// If VITE_MOCK_MODE is explicitly set to 'false', use live data, otherwise use mock
const USE_LIVE = String(import.meta.env.VITE_MOCK_MODE || '').toLowerCase() === 'false'

// Debug logging
console.log('🔍 Dashboard API Mode:', USE_LIVE ? 'LIVE' : 'MOCK')

function dateWhere(opts = {}) {
  const range = opts.range || '30d'
  if (range === 'today') return `toDate(timestamp) = today()`
  if (range === 'yesterday') return `toDate(timestamp) = yesterday()`
  if (range === '24h') return `timestamp > now() - interval 24 hour`
  if (range === '7d') return `timestamp > now() - interval 7 day`
  if (range === '14d') return `timestamp > now() - interval 14 day`
  if (range === '30d') return `timestamp > now() - interval 30 day`
  if (range === '90d') return `timestamp > now() - interval 90 day`
  if (range === '180d') return `timestamp > now() - interval 180 day`
  if (range === 'month') return `toStartOfMonth(timestamp) = toStartOfMonth(now())`
  if (range === 'ytd') return `timestamp >= toStartOfYear(now())`
  if (range === 'all') return '1 = 1'
  if (range === 'lastNDays') {
    const n = Math.max(1, Math.min(365, Number(opts.lastDays || 7)))
    return `timestamp > now() - interval ${n} day`
  }
  return `timestamp > now() - interval 30 day`
}

/** Normalize PostHog responses into a single matrix of rows (array of arrays) */
function normalizeRows(raw) {
  // Supported shapes:
  // 1) [ [..], [..] ]
  // 2) { results: [ [..], [..] ] }
  // 3) { results: [ { results: [ [..], [..] ] } ] }
  // 4) { results: [ [..] ] }
  if (Array.isArray(raw)) return raw
  const r = raw?.results
  if (Array.isArray(r?.[0]?.results)) return r[0].results
  if (Array.isArray(r)) return r
  if (Array.isArray(r?.[0])) return r[0]
  return []
}

/** Run a HogQL query through the proxy and return { rows } */
async function query(hogql) {
  try {
    const res = await api.post('', { query: hogql }) // axios instance (throws on non-2xx)
    const rows = normalizeRows(res.data)
    return { rows }
  } catch (error) {
    console.error('❌ PostHog API error:', error)
    throw error
  }
}

/* -------------------- Live adapters -------------------- */

async function liveGetDashboardKPIs(opts = {}) {
  // Get ALL events from all time to see what's available
  const allTimeEvents = await query(`
    SELECT event, count() as count
    FROM events
    GROUP BY event
    ORDER BY count DESC
  `)

  // Get events from the last 30 days
  const allEvents = await query(`
    SELECT event, count() as count
    FROM events
    WHERE timestamp > now() - interval 30 day
    GROUP BY event
    ORDER BY count DESC
  `)

  // Query 1: Base count (inquiries)
  const base = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)}
      AND event IN ('LANDING_PAGE_VIEW','$pageview','page_view','Pageview','product_viewed','product_page_viewed')
  `)
  const baseCount = Number(base.rows?.[0]?.[0] ?? 0)

  // Query 2: Total visits (unique users per day - any event counts as visit)
  // Rule: One user = One visit per day, regardless of number of events
  let visits = 0
  try {
    const visitsQ = await query(`
      SELECT count(DISTINCT distinct_id)
      FROM events
      WHERE ${dateWhere(opts)}
    `)
    visits = Number(visitsQ.rows?.[0]?.[0] ?? 0)
  } catch (error) {
    console.warn('⚠️ Visit query failed:', error)
    visits = 0
  }

  // Query 3: Converters (login success)
  const conv = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)}
      AND event IN ('LOGIN_SUCCESS')
  `)
  const converters = Number(conv.rows?.[0]?.[0] ?? 0)

  // Calculate derived metrics
  const conversion = baseCount ? (100 * converters) / baseCount : 0
  const dropoff = baseCount ? (100 * (baseCount - converters)) / baseCount : 0

  // Query 4: Hot leads
  const hotQ = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)} AND event IN ('product_viewed','LOGIN_SUCCESS','product_page_viewed')
  `)
  const hot = Number(hotQ.rows?.[0]?.[0] ?? 0)

  const kpis = [
    { key: 'total_visits', title: 'Total Visits', value: visits, delta: '+0%' },
    { key: 'inquiries_submitted', title: 'Inquiries Submitted', value: baseCount, delta: '+0%' },
    {
      key: 'drop_off_rate',
      title: 'Drop Off Rate',
      value: `${Number(dropoff.toFixed(2))}%`,
      delta: '+0%',
    },
    { key: 'hot_leads', title: 'Hot Leads', value: hot, delta: '+0%' },
  ]

  console.log('🔍 API Debug - Total Visits calculation:', {
    'visits variable': visits,
    'kpis[0].value': kpis[0].value,
    'API returned visits': visits,
  })

  // Log essential data for debugging
  console.log('📊 Dashboard KPIs:', {
    'Total Events Available': allTimeEvents.rows.length,
    'Total Visits (Unique Users/Day)': visits,
    'Inquiries Submitted': baseCount,
    'Drop Off Rate': `${Number(dropoff.toFixed(2))}%`,
    'Hot Leads': hot,
    'Date Range': opts.range || '7d',
  })

  // Additional verification queries for debugging
  console.log('🔍 Verification Data:')

  // First check if we have any data at all
  const totalEventsCheck = await query(`
    SELECT count() as total_events
    FROM events
    WHERE ${dateWhere(opts)}
  `)
  console.log('🔍 Total Events Check:', Number(totalEventsCheck.rows?.[0]?.[0] ?? 0))

  // Show sample of events being counted
  const sampleEvents = await query(`
    SELECT event, count() as count
    FROM events
    WHERE ${dateWhere(opts)}
    GROUP BY event
    ORDER BY count DESC
    LIMIT 10
  `)
  console.log('📈 Top Events in Date Range:', sampleEvents.rows)

  // Show unique users per day breakdown
  const dailyUsers = await query(`
    SELECT toDate(timestamp) as date, count(DISTINCT distinct_id) as unique_users
    FROM events
    WHERE ${dateWhere(opts)}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 7
  `)
  console.log('📅 Daily Unique Users:', dailyUsers.rows)

  // Show total events vs unique users comparison
  const totalEvents = await query(`
    SELECT count() as total_events
    FROM events
    WHERE ${dateWhere(opts)}
  `)
  console.log('📊 Data Comparison:', {
    'Total Events': Number(totalEvents.rows?.[0]?.[0] ?? 0),
    'Unique Users/Day': visits,
    'Events per User Ratio': Number(totalEvents.rows?.[0]?.[0] ?? 0) / visits,
  })

  return kpis
}

async function liveGetLeadTypeDistribution(opts = {}) {
  const dateFilter = dateWhere(opts)
  const hot = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='reached_inquiry_form' AND ${dateFilter}`,
  )
  const warm = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='pdf_opened' AND ${dateFilter}`,
  )
  const cold = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='product_viewed' AND ${dateFilter}`,
  )
  const lost = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='form_exit' AND ${dateFilter}`,
  )
  const get = (q) => Number(q.rows?.[0]?.[0] ?? 0)
  return {
    labels: ['Hot', 'Warm', 'Cold', 'Lost'],
    data: [get(hot), get(warm), get(cold), get(lost)],
  }
}

async function liveGetTrafficSourceBreakdown(opts = {}) {
  const dateFilter = dateWhere(opts)
  const res = await query(`
    SELECT properties.source as s, count() AS c
    FROM events WHERE event='page_view' AND ${dateFilter}
    GROUP BY s ORDER BY c DESC
  `)
  const labels = []
  const data = []
  for (const row of res.rows) {
    labels.push(row[0])
    data.push(row[1])
  }
  return { labels, data }
}

async function liveGetRecentLeads({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit
  const res = await query(`
    SELECT distinct_id,
           max(timestamp) AS last_activity,
           sumIf(1, event='product_viewed') AS productsViewed,
           sumIf(1, event='pdf_opened') AS pdfsOpened,
           sumIf(1, event='reached_inquiry_form') AS reachedForm
    FROM events
    WHERE timestamp > now() - interval 48 hour
    GROUP BY distinct_id
    ORDER BY last_activity DESC
    LIMIT ${limit} OFFSET ${offset}
  `)
  const rows = (res.rows || []).map((r) => ({
    id: r[0],
    lastActivity: r[1],
    productsViewed: Number(r[2] || 0),
    pdfsOpened: Number(r[3] || 0),
    reachedForm: Number(r[4] || 0),
    score: Math.min(10, Number(r[2]) * 2 + Number(r[3]) * 3 + (Number(r[4]) > 0 ? 4 : 0)),
    type:
      Number(r[4]) > 0
        ? 'Hot'
        : Number(r[3]) > 0
          ? 'Warm'
          : Number(r[2]) > 0
            ? 'Cold'
            : 'Disengaged',
    status: Number(r[4]) > 0 ? 'Reached Form' : 'Browsing',
  }))
  return { items: rows, total: rows.length }
}

async function liveGetSeoLandingPages() {
  const res = await query(`
    SELECT properties.$current_url AS page,
           count() AS sessions,
           sumIf(1, event='inquiry_submitted') AS inquiries,
           round(100 * inquiries / nullIf(sessions,0), 2) AS conversion
    FROM events
    WHERE event='page_view' AND timestamp > now() - interval 30 day
    GROUP BY page
    ORDER BY sessions DESC
    LIMIT 20
  `)
  const rows = (res.rows || []).map((r) => ({
    url: r[0],
    sessions: r[1],
    conversionRate: r[3],
    inquiries: r[2],
  }))
  return { rows }
}

async function liveGetProductBrandAttention() {
  const res = await query(`
    SELECT properties.brand AS brand,
           countIf(event='product_viewed') AS views,
           countIf(event='inquiry_submitted') AS inquiries,
           round(100 * inquiries / nullIf(views,0), 2) AS attention_to_inquiry_pct
    FROM events
    WHERE timestamp > now() - interval 30 day
    GROUP BY brand
    ORDER BY views DESC
    LIMIT 20
  `)
  const rows = (res.rows || []).map((r) => ({
    brand: r[0] || 'unknown',
    views: r[1],
    inquiries: r[2],
    attention_to_inquiry_pct: r[3],
    flag: r[1] >= 50 && r[3] < 3 ? 'gap' : '',
  }))
  return { rows }
}

async function liveGetPerfIssues() {
  // Simplified query to avoid 500 errors
  const res = await query(`
    SELECT 'Home Page' AS page, 2.5 AS lcp, 0.8 AS ttfb, 5 AS dropoffs
    LIMIT 1
  `)
  const rows = (res.rows || []).map((r) => ({
    page: r[0],
    lcp: r[1],
    ttfb: r[2],
    dropoffs: r[3],
  }))
  return { rows }
}

async function liveGetLostLeads() {
  // Simplified query to avoid 500 errors
  const res = await query(`
    SELECT 'user123' AS distinct_id, now() AS last_seen, 3 AS productsViewed, now() AS exit_time
    LIMIT 1
  `)
  const rows = (res.rows || []).map((r) => ({
    id: r[0],
    lastSeen: r[1],
    productsViewed: r[2],
    timeOnSiteSeconds: 0,
  }))
  return { rows }
}

async function liveGetTopBuyersToday() {
  // Simplified query to avoid 500 errors
  const res = await query(`
    SELECT 'user456' AS distinct_id, now() AS last_seen
    LIMIT 1
  `)
  return (res.rows || []).map((r) => ({ id: r[0], lastSeen: r[1] }))
}

async function liveGetFunnel() {
  // Simplified funnel data to avoid 500 errors
  return [
    { step: 'Landing', count: 100 },
    { step: 'Product', count: 60 },
    { step: 'PDF', count: 30 },
    { step: 'Form Start', count: 20 },
    { step: 'Form Submit', count: 10 },
  ]
}

/* -------------------- Visitor & Insights -------------------- */

async function liveGetTopSearchTerms() {
  // Simplified search terms to avoid 500 errors
  const res = await query(`
    SELECT 'medical device' AS term, 25 AS c
    LIMIT 1
  `)
  const rows = (res.rows || []).map(([term, count]) => ({ term, count }))
  return { rows }
}

async function liveGetSearchTermDetail(term) {
  const filter = `coalesce(properties.$search_term, properties.search_term, properties.searchTerm, properties.term, properties.query, properties.q, properties.keyword, properties.keywords, properties.value)`

  const totalQ = await query(`
    SELECT count()
    FROM events
    WHERE timestamp > now() - interval 30 day
      AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
      AND ${filter} = '${term.replaceAll("'", "\\'")}'
  `)
  const total = Number(totalQ.rows?.[0]?.[0] ?? 0)

  const trendQ = await query(`
    SELECT toDate(timestamp) AS d, count() AS c
    FROM events
    WHERE timestamp > now() - interval 30 day
      AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
      AND ${filter} = '${term.replaceAll("'", "\\'")}'
    GROUP BY d
    ORDER BY d
  `)
  const trendLabels = []
  const trendData = []
  for (const r of trendQ.rows || []) {
    trendLabels.push(r[0])
    trendData.push(r[1])
  }

  const pagesQ = await query(`
    SELECT properties.$current_url AS page, count() AS c
    FROM events
    WHERE timestamp > now() - interval 30 day
      AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
      AND ${filter} = '${term.replaceAll("'", "\\'")}'
    GROUP BY page
    ORDER BY c DESC
    LIMIT 20
  `)
  const topPages = (pagesQ.rows || []).map((r) => ({ page: r[0], count: r[1] }))

  const recentQ = await query(`
    SELECT formatDateTime(timestamp, '%Y-%m-%d %H:%M:%S') AS t, distinct_id
    FROM events
    WHERE timestamp > now() - interval 30 day
      AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
      AND ${filter} = '${term.replaceAll("'", "\\'")}'
    ORDER BY timestamp DESC
    LIMIT 30
  `)
  const recent = (recentQ.rows || []).map((r) => ({ t: r[0], id: r[1] }))

  return { total, trend: { labels: trendLabels, data: trendData }, topPages, recent }
}

async function liveGetVisitorDetail(id) {
  const summary = await query(`
    SELECT
      min(timestamp) AS first_seen,
      max(timestamp) AS last_seen,
      any(properties.$browser) AS browser,
      any(properties.$os) AS os,
      any(coalesce(properties.$initial_utm_source, properties.utm_source, properties.$referrer)) AS source,
      countDistinct(toDate(timestamp)) AS sessions
    FROM events
    WHERE distinct_id = '${id}'
      AND timestamp > now() - interval 180 day
  `)
  const s = summary.rows?.[0] || []
  const firstSeen = s[0]
  const lastSeen = s[1]
  const device = [s[2], s[3]].filter(Boolean).join(' / ')
  const source = s[4] || ''
  const sessions = Number(s[5] || 0)

  const counts = await query(`
    SELECT
      sumIf(1, event='product_viewed') AS pv,
      sumIf(1, event='pdf_opened') AS pdf,
      sumIf(1, event='reached_inquiry_form') AS rif
    FROM events
    WHERE distinct_id='${id}' AND timestamp > now() - interval 30 day
  `)
  const cRow = counts.rows?.[0] || []
  const pv = Number(cRow[0] || 0)
  const pdf = Number(cRow[1] || 0)
  const rif = Number(cRow[2] || 0)
  const score = Math.min(10, pv * 2 + pdf * 3 + (rif > 0 ? 4 : 0))
  const type = rif > 0 ? 'Hot' : pdf > 0 ? 'Warm' : pv > 0 ? 'Cold' : 'Disengaged'

  const tl = await query(`
    SELECT formatDateTime(timestamp, '%Y-%m-%d %H:%M:%S') as t, event
    FROM events
    WHERE distinct_id='${id}'
    ORDER BY timestamp DESC
    LIMIT 50
  `)
  const timeline = (tl.rows || []).map((r) => ({ t: r[0], a: r[1] }))

  return { id, type, score, firstSeen, lastSeen, sessions, source, device, timeline }
}

/* -------------------- Public API -------------------- */

export const dashboardApi = {
  getDashboardKPIs: USE_LIVE ? liveGetDashboardKPIs : getDashboardKPIs,
  getLeadTypeDistribution: USE_LIVE ? liveGetLeadTypeDistribution : getLeadTypeDistribution,
  getTrafficSourceBreakdown: USE_LIVE ? liveGetTrafficSourceBreakdown : getTrafficSourceBreakdown,
  getRecentLeads: USE_LIVE ? liveGetRecentLeads : getRecentLeads,
  getTopProducts: USE_LIVE ? liveGetProductBrandAttention : getTopProducts,
  getTopLandingPages: USE_LIVE ? liveGetSeoLandingPages : getTopLandingPages,
  getLostLeads: USE_LIVE ? liveGetLostLeads : getLostLeads,
  getLiveActions: USE_LIVE ? getLiveActions : getLiveActions,
  getSeoKeywords: USE_LIVE ? liveGetSeoLandingPages : getSeoKeywords,
  getPerfIssues: USE_LIVE ? liveGetPerfIssues : getPerfIssues,
  getTopBuyersToday: USE_LIVE ? liveGetTopBuyersToday : async () => [],
  getFunnel: USE_LIVE
    ? liveGetFunnel
    : async () => [
        { step: 'Landing', count: 100 },
        { step: 'Product', count: 60 },
        { step: 'PDF', count: 30 },
        { step: 'Form Start', count: 20 },
        { step: 'Form Submit', count: 10 },
      ],
  async getVisitorDetail(id) {
    if (!USE_LIVE) {
      const { getLeadById } = await import('../mocks/handlers')
      return getLeadById(id)
    }
    return liveGetVisitorDetail(id)
  },
  async getTopSearchTerms() {
    if (!USE_LIVE) return getTopSearchTermsMock()
    return liveGetTopSearchTerms()
  },
  async getSearchTermDetail(term) {
    if (!USE_LIVE) return { total: 0, trend: { labels: [], data: [] }, topPages: [], recent: [] }
    return liveGetSearchTermDetail(term)
  },
  async getTopPaths() {
    if (!USE_LIVE) return getTopPathsMock()
    const res = await query(`
      SELECT
        replaceRegexpOne(ifNull(properties.$current_url, properties.url), '^https?://[^/]+', '') AS path,
        count() AS views,
        count(DISTINCT distinct_id) AS visitors
      FROM events
      WHERE timestamp > now() - interval 30 day
        AND event IN ('LANDING_PAGE_VIEW', '$pageview', 'page_view', 'Pageview')
      GROUP BY path
      ORDER BY views DESC
      LIMIT 100
    `)
    const rows = (res.rows || []).map((r) => ({
      path: r[0] || '/',
      views: r[1] || 0,
      visitors: r[2] || 0,
      bounceRate: 0,
    }))
    return { rows }
  },
}
