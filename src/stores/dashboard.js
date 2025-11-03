import { defineStore } from 'pinia'
import { dashboardApi } from '../services/dashboardApi'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    // KPIs - Initialize with default values to prevent blank displays
    kpis: [
      { key: 'total_visits', title: 'Total Visits', value: '0', delta: 0 },
      { key: 'inquiries_submitted', title: 'Inquiries Submitted', value: '0', delta: 0 },
      { key: 'drop_off_rate', title: 'Drop Off Rate', value: '0%', delta: 0 },
      { key: 'hot_leads', title: 'Hot Leads', value: '0', delta: 0 },
    ],
    kpisLoading: false,
    kpisLastFetched: null,
    kpisRange: '7d',

    // Charts
    leadTypeDistribution: { labels: [], data: [] },
    trafficSourceBreakdown: { labels: [], data: [] },
    funnel: [],
    chartsLoading: false,
    chartsLastFetched: null,
    chartsRange: '7d',

    // Tables
    recentLeads: { items: [], total: 0, page: 1, limit: 10 },
    recentLeadsLoading: false,
    recentLeadsLastFetched: null,
    topProducts: [],
    topLandingPages: [],
    lostLeads: [],
    liveActions: [],
    seoKeywords: [],
    perfIssues: [],
    tablesLoading: false,
    tablesLastFetched: null,

    // Cache settings - Reduced timeout for fresher data
    cacheTimeout: 15 * 1000, // 15 seconds in milliseconds - shorter for more frequent live updates
  }),

  getters: {
    // KPI getters
    totalVisits: (state) => state.kpis.find((k) => k.key === 'total_visits')?.value || '0',
    inquiriesSubmitted: (state) =>
      state.kpis.find((k) => k.key === 'inquiries_submitted')?.value || '0',
    dropOffRate: (state) => state.kpis.find((k) => k.key === 'drop_off_rate')?.value || '0%',
    hotLeads: (state) => state.kpis.find((k) => k.key === 'hot_leads')?.value || '0',

    // Loading states
    isLoading: (state) => state.kpisLoading || state.chartsLoading || state.tablesLoading,

    // Cache status
    isKpisCacheValid: (state) => {
      if (!state.kpisLastFetched) return false
      return Date.now() - state.kpisLastFetched < state.cacheTimeout
    },
    isChartsCacheValid: (state) => {
      if (!state.chartsLastFetched) return false
      return Date.now() - state.chartsLastFetched < state.cacheTimeout
    },
    isTablesCacheValid: (state) => {
      if (!state.tablesLastFetched) return false
      return Date.now() - state.tablesLastFetched < state.cacheTimeout
    },
  },

  actions: {
    // KPI actions
    async fetchKPIs(range = '7d', forceRefresh = false) {
      // Always fetch fresh data when forceRefresh is true, otherwise check cache
      if (
        !forceRefresh &&
        this.isKpisCacheValid &&
        this.kpisRange === range &&
        this.kpis.length > 0
      ) {
        console.log('📊 Using cached KPIs data')
        return this.kpis
      }

      this.kpisLoading = true
      const previousKPIs = Array.isArray(this.kpis) ? [...this.kpis] : [] // Keep previous data during loading

      try {
        console.log('📊 Fetching fresh KPIs from PostHog API...', { range, forceRefresh })
        const freshKPIs = await dashboardApi.getDashboardKPIs({ range })

        // If backend returned valid KPIs, use them as-is
        if (Array.isArray(freshKPIs) && freshKPIs.length > 0) {
          this.kpis = freshKPIs
        } else if (previousKPIs.length > 0) {
          // No data returned – keep last known values from Pinia
          console.warn('⚠️ KPI API returned empty; keeping previous KPIs')
          this.kpis = previousKPIs
        } else {
          // First-ever load fallback only
          this.kpis = [
            { key: 'total_visits', title: 'Total Visits', value: '0', delta: 0 },
            { key: 'inquiries_submitted', title: 'Inquiries Submitted', value: '0', delta: 0 },
            { key: 'drop_off_rate', title: 'Drop Off Rate', value: '0%', delta: 0 },
            { key: 'hot_leads', title: 'Hot Leads', value: '0', delta: 0 },
          ]
        }
        this.kpisRange = range
        this.kpisLastFetched = Date.now()
        console.log('✅ KPIs fetched and cached successfully:', this.kpis)
        return this.kpis
      } catch (error) {
        console.error('❌ Error fetching KPIs:', error)
        // On error, keep previous data if available; otherwise use minimal defaults
        if (previousKPIs.length > 0) {
          console.warn('⚠️ Using previous KPI data due to error')
          this.kpis = previousKPIs
          return this.kpis
        }
        this.kpis = [
          { key: 'total_visits', title: 'Total Visits', value: '0', delta: 0 },
          { key: 'inquiries_submitted', title: 'Inquiries Submitted', value: '0', delta: 0 },
          { key: 'drop_off_rate', title: 'Drop Off Rate', value: '0%', delta: 0 },
          { key: 'hot_leads', title: 'Hot Leads', value: '0', delta: 0 },
        ]
        return this.kpis
      } finally {
        this.kpisLoading = false
      }
    },

    // Charts actions
    async fetchCharts(range = '7d', forceRefresh = false) {
      // Check if we need to fetch (cache invalid or range changed or force refresh)
      if (
        !forceRefresh &&
        this.isChartsCacheValid &&
        this.chartsRange === range &&
        (this.leadTypeDistribution.labels.length > 0 ||
          this.trafficSourceBreakdown.labels.length > 0)
      ) {
        console.log('📊 Using cached charts data')
        return
      }

      this.chartsLoading = true
      try {
        console.log('📊 Fetching charts from API...')
        const [leadType, traffic, funnel] = await Promise.all([
          dashboardApi.getLeadTypeDistribution({ range }),
          dashboardApi.getTrafficSourceBreakdown({ range }),
          dashboardApi.getFunnel(),
        ])

        this.leadTypeDistribution = leadType
        this.trafficSourceBreakdown = traffic
        this.funnel = funnel
        this.chartsRange = range
        this.chartsLastFetched = Date.now()
        console.log('📊 Charts cached successfully')
      } catch (error) {
        console.error('❌ Error fetching charts:', error)
        throw error
      } finally {
        this.chartsLoading = false
      }
    },

    // Tables actions
    async fetchTables(forceRefresh = false) {
      // Check if we need to fetch (cache invalid or force refresh)
      if (!forceRefresh && this.isTablesCacheValid && this.topProducts.length > 0) {
        console.log('📊 Using cached tables data')
        return
      }

      this.tablesLoading = true
      try {
        console.log('📊 Fetching tables from API...')
        const [topProducts, topLandingPages, lostLeads, liveActions, seoKeywords, perfIssues] =
          await Promise.all([
            dashboardApi.getTopProducts(),
            dashboardApi.getTopLandingPages(),
            dashboardApi.getLostLeads(),
            dashboardApi.getLiveActions(),
            dashboardApi.getSeoKeywords(),
            dashboardApi.getPerfIssues(),
          ])

        this.topProducts = topProducts.rows || []
        this.topLandingPages = topLandingPages.rows || []
        this.lostLeads = lostLeads.rows || []
        this.liveActions = liveActions.rows || []
        this.seoKeywords = seoKeywords.rows || []
        this.perfIssues = perfIssues.rows || []
        this.tablesLastFetched = Date.now()
        console.log('📊 Tables cached successfully')
      } catch (error) {
        console.error('❌ Error fetching tables:', error)
        throw error
      } finally {
        this.tablesLoading = false
      }
    },

    // Recent leads actions
    async fetchRecentLeads(page = 1, limit = 10, forceRefresh = false) {
      // For recent leads, we might want to refresh more frequently
      const recentCacheTimeout = 2 * 60 * 1000 // 2 minutes for recent data
      const isRecentCacheValid =
        this.recentLeadsLastFetched && Date.now() - this.recentLeadsLastFetched < recentCacheTimeout

      if (
        !forceRefresh &&
        isRecentCacheValid &&
        this.recentLeads.page === page &&
        this.recentLeads.limit === limit
      ) {
        console.log('📊 Using cached recent leads data')
        return this.recentLeads
      }

      this.recentLeadsLoading = true
      try {
        console.log('📊 Fetching recent leads from API...')
        const result = await dashboardApi.getRecentLeads({ page, limit })
        this.recentLeads = { ...result, page, limit }
        this.recentLeadsLastFetched = Date.now()
        console.log('📊 Recent leads cached successfully')
        return this.recentLeads
      } catch (error) {
        console.error('❌ Error fetching recent leads:', error)
        throw error
      } finally {
        this.recentLeadsLoading = false
      }
    },

    // Combined fetch action - sequential to avoid overwhelming cold Lambda
    async fetchAllData(range = '7d', forceRefresh = false) {
      console.log('📊 Fetching all dashboard data...')
      try {
        // Fetch sequentially with small delays to help Lambda warm up and avoid overwhelming it
        // This reduces 502 errors from parallel requests hitting a cold Lambda
        await this.fetchKPIs(range, forceRefresh)
        await new Promise((resolve) => setTimeout(resolve, 200)) // Small delay between requests

        await this.fetchCharts(range, forceRefresh)
        await new Promise((resolve) => setTimeout(resolve, 200))

        await this.fetchTables(forceRefresh)
        console.log('📊 All dashboard data cached successfully')
      } catch (error) {
        console.error('❌ Error fetching all dashboard data:', error)
        // Don't throw - let individual methods handle errors and keep previous data
      }
    },

    // Cache management
    clearCache() {
      console.log('📊 Clearing dashboard cache...')
      this.kpisLastFetched = null
      this.chartsLastFetched = null
      this.tablesLastFetched = null
      this.recentLeadsLastFetched = null
    },

    clearAllData() {
      console.log('📊 Clearing all dashboard data...')
      this.kpis = []
      this.leadTypeDistribution = { labels: [], data: [] }
      this.trafficSourceBreakdown = { labels: [], data: [] }
      this.funnel = []
      this.recentLeads = { items: [], total: 0, page: 1, limit: 10 }
      this.topProducts = []
      this.topLandingPages = []
      this.lostLeads = []
      this.liveActions = []
      this.seoKeywords = []
      this.perfIssues = []
      this.clearCache()
    },

    // Utility actions
    setCacheTimeout(timeout) {
      this.cacheTimeout = timeout
    },
  },
})
