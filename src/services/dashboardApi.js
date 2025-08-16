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
  // default
  return `timestamp > now() - interval 30 day`
}

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
async function liveGetDashboardKPIs(opts = {}) {
  // Temporary mapping per your current events (will switch when you add real inquiry events)
  // Base population ("Total Inquiries" per your definition): users who visited landing OR product page
  const base = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)}
      AND event IN ('LANDING_PAGE_VIEW','$pageview','page_view','Pageview','product_page_viewed')
  `)
  const baseCount = Number(base?.results?.[0]?.[0] ?? 0)

  // Total visits (all LANDING_PAGE_VIEW events)
  const visitsQ = await query(`
    SELECT count()
    FROM events
    WHERE ${dateWhere(opts)}
      AND event IN ('LANDING_PAGE_VIEW','$pageview','page_view','Pageview')
  `)
  const visits = Number(visitsQ?.results?.[0]?.[0] ?? 0)

  // Converters: users who performed a submit-like action (temporary: LOGIN_SUCCESS; later add 'inquiry_submitted','add_to_quote','contact_us_submit')
  const conv = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)}
      AND event IN ('LOGIN_SUCCESS')
  `)
  const converters = Number(conv?.results?.[0]?.[0] ?? 0)

  const conversion = baseCount ? (100 * converters) / baseCount : 0
  const dropoff = baseCount ? (100 * (baseCount - converters)) / baseCount : 0

  // Hot leads (temporary proxy): users with product view AND LOGIN_SUCCESS (very rough until real scoring)
  const hotQ = await query(`
    SELECT count(DISTINCT distinct_id)
    FROM events
    WHERE ${dateWhere(opts)} AND event IN ('product_page_viewed','LOGIN_SUCCESS')
  `)
  const hot = Number(hotQ?.results?.[0]?.[0] ?? 0)

  return [
    { key: 'inquiries', title: 'Total Inquiries', value: baseCount, delta: 0 },
    { key: 'visits', title: 'Visits', value: visits, delta: 0 },
    { key: 'conversion', title: 'Conversion Rate', value: Number(conversion.toFixed(2)), delta: 0 },
    { key: 'dropoff', title: 'Drop-Off Rate', value: Number(dropoff.toFixed(2)), delta: 0 },
    { key: 'hot', title: 'Hot Leads', value: hot, delta: 0 },
  ]
}

async function liveGetLeadTypeDistribution() {
  // Very simple proxy using reached_form as intent; tune with full scoring later
  const hot = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='reached_inquiry_form' AND timestamp>now()-interval 30 day`,
  )
  const warm = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='pdf_opened' AND timestamp>now()-interval 30 day`,
  )
  const cold = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='product_viewed' AND timestamp>now()-interval 30 day`,
  )
  const lost = await query(
    `SELECT count(DISTINCT distinct_id) FROM events WHERE event='form_exit' AND timestamp>now()-interval 30 day`,
  )
  const get = (x) => Number(x?.results?.[0]?.results?.[0]?.[0] ?? 0)
  return {
    labels: ['Hot', 'Warm', 'Cold', 'Lost'],
    data: [get(hot), get(warm), get(cold), get(lost)],
  }
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
  const rows = (res?.results?.[0]?.results || []).map((r) => ({
    id: r[0],
    lastActivity: r[1],
    productsViewed: Number(r[2] || 0),
    pdfsOpened: Number(r[3] || 0),
    reachedForm: Number(r[4] || 0),
    // naive score/type for now
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
  // We don't compute total precisely here; could run countDistinct if needed
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
  const rows = (res?.results?.[0]?.results || []).map((r) => ({
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
  const rows = (res?.results?.[0]?.results || []).map((r) => ({
    brand: r[0] || 'unknown',
    views: r[1],
    inquiries: r[2],
    attention_to_inquiry_pct: r[3],
    flag: r[1] >= 50 && r[3] < 3 ? 'gap' : '',
  }))
  return { rows }
}

async function liveGetPerfIssues() {
  // If you don’t send performance_timing, return empty
  const res = await query(`
    SELECT properties.page AS page,
           round(avg(properties.lcp),2) AS lcp,
           round(avg(properties.ttfb),2) AS ttfb,
           countIf(event='form_exit') AS dropoffs
    FROM events
    WHERE event = 'performance_timing' AND timestamp > now() - interval 30 day
    GROUP BY page
    ORDER BY lcp DESC
    LIMIT 20
  `)
  const rows = (res?.results?.[0]?.results || []).map((r) => ({
    page: r[0],
    lcp: r[1],
    ttfb: r[2],
    dropoffs: r[3],
  }))
  return { rows }
}

async function liveGetLostLeads() {
  const res = await query(`
    SELECT distinct_id, max(timestamp) AS last_seen,
           sumIf(1, event='product_viewed') AS productsViewed,
           maxIf(timestamp, event='form_exit') AS exit_time
    FROM events
    WHERE timestamp > now() - interval 48 hour AND event IN ('form_exit','product_viewed')
    GROUP BY distinct_id
    HAVING sumIf(1, event='form_exit') > 0
    ORDER BY last_seen DESC
    LIMIT 10
  `)
  const rows = (res?.results?.[0]?.results || []).map((r) => ({
    id: r[0],
    lastSeen: r[1],
    productsViewed: r[2],
    timeOnSiteSeconds: 0,
  }))
  return { rows }
}

async function liveGetTopBuyersToday() {
  const res = await query(`
    SELECT distinct_id,
           max(timestamp) AS last_seen,
           sumIf(1, event='product_viewed') pv,
           sumIf(1, event='pdf_opened') pdf,
           sumIf(1, event='reached_inquiry_form') rif
    FROM events
    WHERE timestamp > today()
    GROUP BY distinct_id
    ORDER BY rif DESC, pdf DESC, pv DESC
    LIMIT 3
  `)
  return (res?.results?.[0]?.results || []).map((r) => ({ id: r[0], lastSeen: r[1] }))
}

async function liveGetFunnel() {
  const steps = [
    { key: 'page_view', label: 'Landing' },
    { key: 'product_viewed', label: 'Product' },
    { key: 'pdf_opened', label: 'PDF' },
    { key: 'reached_inquiry_form', label: 'Form Start' },
    { key: 'inquiry_submitted', label: 'Form Submit' },
  ]
  const counts = []
  for (const s of steps) {
    const r = await query(
      `SELECT count() FROM events WHERE event='${s.key}' AND timestamp > now() - interval 30 day`,
    )
    counts.push(Number(r?.results?.[0]?.results?.[0]?.[0] ?? 0))
  }
  return steps.map((s, i) => ({ step: s.label, count: counts[i] }))
}

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
  // Live visitor detail helper (mock fallback can be wired later if needed)
  async getVisitorDetail(id) {
    if (!USE_LIVE) {
      // Lightweight compatibility: reuse recent lead generator when in mock mode
      const { getLeadById } = await import('../mocks/handlers')
      return getLeadById(id)
    }
    // Summary block
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
    const s = summary?.results?.[0] || []
    const firstSeen = s[0]
    const lastSeen = s[1]
    const device = [s[2], s[3]].filter(Boolean).join(' / ')
    const source = s[4] || ''
    const sessions = Number(s[5] || 0)

    // Activity counters for quick score/type
    const counts = await query(`
      SELECT
        sumIf(1, event='product_viewed') AS pv,
        sumIf(1, event='pdf_opened') AS pdf,
        sumIf(1, event='reached_inquiry_form') AS rif
      FROM events
      WHERE distinct_id='${id}' AND timestamp > now() - interval 30 day
    `)
    const cRow = counts?.results?.[0] || []
    const pv = Number(cRow[0] || 0)
    const pdf = Number(cRow[1] || 0)
    const rif = Number(cRow[2] || 0)
    const score = Math.min(10, pv * 2 + pdf * 3 + (rif > 0 ? 4 : 0))
    const type = rif > 0 ? 'Hot' : pdf > 0 ? 'Warm' : pv > 0 ? 'Cold' : 'Disengaged'

    // Timeline (last 50 events)
    const tl = await query(`
      SELECT formatDateTime(timestamp, '%Y-%m-%d %H:%M:%S') as t, event
      FROM events
      WHERE distinct_id='${id}'
      ORDER BY timestamp DESC
      LIMIT 50
    `)
    const timeline = (tl?.results?.[0] || []).map((r) => ({ t: r[0], a: r[1] }))

    return { id, type, score, firstSeen, lastSeen, sessions, source, device, timeline }
  },
  async getTopSearchTerms() {
    if (!USE_LIVE) {
      // Minimal mock: return empty list in mock mode
      return { rows: [] }
    }
    const res = await query(`
      SELECT
        coalesce(
          properties.$search_term,
          properties.search_term,
          properties.searchTerm,
          properties.term,
          properties.query,
          properties.q,
          properties.keyword,
          properties.keywords,
          properties.value
        ) AS term,
        count() AS c
      FROM events
      WHERE timestamp > now() - interval 30 day
        AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
      GROUP BY term
      HAVING term IS NOT NULL AND term != ''
      ORDER BY c DESC
      LIMIT 50
    `)
    const rows = (res?.results || []).map((r) => ({ term: r[0], count: r[1] }))
    return { rows }
  },
  async getSearchTermDetail(term) {
    if (!USE_LIVE) {
      return { total: 0, trend: { labels: [], data: [] }, topPages: [], recent: [] }
    }
    const filter = `coalesce(properties.$search_term, properties.search_term, properties.searchTerm, properties.term, properties.query, properties.q, properties.keyword, properties.keywords, properties.value)`

    // Total
    const totalQ = await query(`
      SELECT count()
      FROM events
      WHERE timestamp > now() - interval 30 day
        AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
        AND ${filter} = '${term.replaceAll("'", "\\'")}'
    `)
    const total = Number(totalQ?.results?.[0]?.[0] ?? 0)

    // Trend by day
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
    for (const r of trendQ?.results || []) {
      trendLabels.push(r[0])
      trendData.push(r[1])
    }

    // Top landing pages for this term
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
    const topPages = (pagesQ?.results || []).map((r) => ({ page: r[0], count: r[1] }))

    // Recent matching events
    const recentQ = await query(`
      SELECT formatDateTime(timestamp, '%Y-%m-%d %H:%M:%S') AS t, distinct_id
      FROM events
      WHERE timestamp > now() - interval 30 day
        AND (lower(event) LIKE '%search%' OR event IN ('site_search','search','search_performed','product_search','product_searched'))
        AND ${filter} = '${term.replaceAll("'", "\\'")}'
      ORDER BY timestamp DESC
      LIMIT 30
    `)
    const recent = (recentQ?.results || []).map((r) => ({ t: r[0], id: r[1] }))

    return { total, trend: { labels: trendLabels, data: trendData }, topPages, recent }
  },
  async getTopPaths() {
    if (!USE_LIVE) {
      return { rows: [] }
    }
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
    const arr = res?.results || res?.results?.[0]?.results || []
    const rows = arr.map((r) => ({
      path: r[0] || '/',
      views: r[1] || 0,
      visitors: r[2] || 0,
      bounceRate: 0,
    }))
    return { rows }
  },
}
