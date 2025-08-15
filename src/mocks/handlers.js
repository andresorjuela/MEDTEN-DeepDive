import { computeLeadScore, computeLeadType, computeLostFlag } from './scoring'

function makeLead(i) {
  const base = {
    id: `L-${1000 + i}`,
    productsViewed: (i % 7) + 1,
    pdfsOpened: i % 3,
    timeOnSiteSeconds: 90 + (i % 6) * 45,
    scrollDepth: 50 + (i % 60),
    reachedInquiryForm: i % 4 === 0,
    bouncedWithin15s: i % 13 === 0,
    exitOnFormStep: i % 5 === 0,
    source: ['Organic', 'Paid', 'Referral', 'Email'][i % 4],
    device: ['Desktop', 'Mobile'][i % 2],
    firstSeen: '2025-07-01',
    lastSeen: '2025-08-15',
    actions: ['Viewed product', 'Opened PDF', 'Reached form'][i % 3],
    timeline: [
      { t: 'Today', a: 'Viewed product' },
      { t: '1d', a: 'Opened PDF' },
    ],
  }
  const score = computeLeadScore(base)
  return {
    ...base,
    score,
    type: computeLeadType(score),
    lost: computeLostFlag({ ...base, score }),
  }
}

export function listLeads({ page = 1, limit = 10, q = '', type, source, dateRange } = {}) {
  const total = 320
  const all = Array.from({ length: total }, (_, i) => makeLead(i + 1))
  let filtered = all
  if (q) filtered = filtered.filter((l) => l.id.includes(q))
  if (type) filtered = filtered.filter((l) => l.type === type)
  if (source) filtered = filtered.filter((l) => l.source === source)
  // dateRange ignored in mock but preserved for interface compatibility
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)
  return Promise.resolve({ items, total: filtered.length })
}

export function getLeadById(id) {
  const i = Number(String(id).split('-').pop()) || 1
  return Promise.resolve(makeLead(i))
}

export function getSeoInsights() {
  const rows = [
    {
      landingPage: '/products/x',
      sessions: 1234,
      inquiries: 56,
      conversionRate: 4.5,
      suggestions: 'Add H1; improve LCP',
    },
    {
      landingPage: '/brands/y',
      sessions: 934,
      inquiries: 31,
      conversionRate: 3.3,
      suggestions: 'Reduce CLS; optimize images',
    },
  ]
  return Promise.resolve({ rows })
}

export function getProductInsights() {
  const rows = [
    {
      product: 'Alpha Monitor',
      brand: 'MedBrand',
      views: 1284,
      inquiries: 42,
      attentionToInquiryRatio: 30.6,
      flags: 'High attention, low inquiries',
    },
    {
      product: 'Beta Scanner',
      brand: 'ScanPro',
      views: 812,
      inquiries: 39,
      attentionToInquiryRatio: 20.8,
      flags: '',
    },
  ]
  return Promise.resolve({ rows })
}
