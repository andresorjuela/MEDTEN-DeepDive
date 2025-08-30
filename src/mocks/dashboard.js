// Deterministic dashboard mock data

export function getDashboardKPIs() {
  return Promise.resolve([
    { key: 'inquiries', title: 'Total Inquiries', value: 193000, delta: 35 },
    { key: 'conversion', title: 'Conversion Rate', value: 4.2, delta: 0.3 },
    { key: 'dropoff', title: 'Drop-Off Rate', value: 24, delta: -2 },
    { key: 'hot', title: 'Hot Leads', value: 563, delta: 12 },
  ])
}

export function getLeadTypeDistribution() {
  const labels = ['Hot', 'Warm', 'Cold', 'Lost']
  const data = [120, 320, 210, 35]
  return Promise.resolve({ labels, data })
}

export function getTrafficSourceBreakdown() {
  const labels = ['Organic', 'Paid', 'Referral', 'Direct']
  const data = [56, 24, 12, 8]
  return Promise.resolve({ labels, data })
}

export function getRecentLeads({ page = 1, limit = 10 } = {}) {
  const total = 75
  const all = Array.from({ length: total }, (_, i) => {
    const id = `L-${2000 + i + 1}`
    const score = 3 + (i % 8)
    const type = score >= 9 ? 'Hot' : score >= 6 ? 'Warm' : score >= 3 ? 'Cold' : 'Disengaged'
    return {
      id,
      score,
      type,
      productsViewed: (i % 6) + 1,
      pdfsOpened: i % 3,
      lastActivity: `2025-08-${(i % 27) + 1} 12:3${i % 10}`,
    }
  })
  const start = (page - 1) * limit
  return Promise.resolve({ items: all.slice(start, start + limit), total })
}

export function getTopProducts() {
  const rows = [
    { product: 'Alpha Monitor', views: 1284, attentionPct: 62, inquiryPct: 12 },
    { product: 'Beta Scanner', views: 812, attentionPct: 48, inquiryPct: 9 },
  ]
  return Promise.resolve({ rows })
}

export function getTopLandingPages() {
  const rows = [
    { url: '/products/x', sessions: 1234, conversionRate: 4.5 },
    { url: '/brands/y', sessions: 934, conversionRate: 3.3 },
  ]
  return Promise.resolve({ rows })
}

export function getLostLeads() {
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: `L-${3000 + i + 1}`,
    productsViewed: (i % 5) + 1,
    timeOnSiteSeconds: 120 + (i % 5) * 60,
  }))
  return Promise.resolve({ rows })
}

export function getLiveActions() {
  // last 10 actions feed
  const now = new Date('2025-08-15T12:00:00Z')
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: `L-${3500 + i}`,
    action: ['Viewed product', 'Opened PDF', 'Reached form'][i % 3],
    when: new Date(now.getTime() - i * 60_000).toISOString(),
  }))
  return Promise.resolve({ rows })
}

export function getSeoKeywords() {
  const rows = [
    {
      keyword: 'ultrasound machine',
      landingPage: '/products/ultrasound',
      sessions: 854,
      inquiries: 42,
      conversion: 4.9,
      issue: '',
    },
    {
      keyword: 'ct scanner price',
      landingPage: '/products/ct',
      sessions: 623,
      inquiries: 18,
      conversion: 2.9,
      issue: 'Slow LCP',
    },
  ]
  return Promise.resolve({ rows })
}

export function getPerfIssues() {
  const rows = [
    { page: '/products/mri', lcp: 4.8, ttfb: 0.8, dropoffs: 22 },
    { page: '/products/ct', lcp: 4.2, ttfb: 1.2, dropoffs: 18 },
  ]
  return Promise.resolve({ rows })
}

// Mock: Top search terms (used when live PostHog is unavailable)
export function getTopSearchTermsMock() {
  const rows = [
    { term: 'ultrasound machine', count: 143 },
    { term: 'ct scanner', count: 98 },
    { term: 'mri price', count: 76 },
    { term: 'xray portable', count: 55 },
    { term: 'ecg device', count: 41 },
  ]
  return Promise.resolve({ rows })
}

// Mock: Top paths (basic site paths list)
export function getTopPathsMock() {
  const rows = [
    { path: '/', views: 1234, visitors: 890, bounceRate: 42 },
    { path: '/products', views: 984, visitors: 712, bounceRate: 38 },
    { path: '/products/ultrasound', views: 643, visitors: 512, bounceRate: 33 },
  ]
  return Promise.resolve({ rows })
}
