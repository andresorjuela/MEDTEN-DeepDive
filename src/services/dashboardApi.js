// Mock-backed dashboard API facade
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

export const dashboardApi = {
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
}
