export function computeLeadScore(lead) {
  let score = 0
  score += (lead.productsViewed || 0) * 2
  score += (lead.pdfsOpened || 0) * 3
  if ((lead.timeOnSiteSeconds || 0) >= 180) score += 3
  if ((lead.scrollDepth || 0) >= 80) score += 2
  if (lead.reachedInquiryForm) score += 4
  if (lead.bouncedWithin15s) score -= 1
  return Math.max(0, Math.min(10, score))
}

export function computeLeadType(score) {
  if (score >= 9) return 'Hot'
  if (score >= 6) return 'Warm'
  if (score >= 3) return 'Cold'
  return 'Disengaged'
}

export function computeLostFlag(lead) {
  const score = typeof lead.score === 'number' ? lead.score : computeLeadScore(lead)
  return score >= 6 && !lead.reachedInquiryForm && !!lead.exitOnFormStep
}
