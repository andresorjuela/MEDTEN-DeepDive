<script>
// import ReachMapCard from '../../components/insights/ReachMapCard.vue'
import { defineAsyncComponent } from 'vue'
import api from '../../services/api'
import BaseKpi from '../../components/ui/BaseKpi.vue'
const BaseSkeleton = defineAsyncComponent(() => import('../../components/ui/BaseSkeleton.vue'))
import BaseTable from '../../components/ui/BaseTable.vue'
import BarChart from '../../components/charts/BarChart.vue'
// import DonutChart from '../../components/charts/DonutChart.vue'
import DonutCard from '../../components/charts/DonutCard.vue'
import FunnelChart from '../../components/charts/FunnelChart.vue'
import { events } from '../../analytics/posthog'
import { useDashboardStore } from '../../stores/dashboard'
import EnvironmentDebug from '../../components/debug/EnvironmentDebug.vue'
import Icon from '../../components/ui/Icon.vue'

export default {
  name: 'DashboardPage',
  components: {
    BaseKpi,
    BaseTable,
    BarChart,
    DonutCard,
    FunnelChart,
    BaseSkeleton,
    EnvironmentDebug,
    Icon,
  },
  data() {
    return {
      range: '7d',
      debugOpen: true,
      debugQuery:
        'SELECT event, count() AS c FROM events WHERE timestamp > now() - interval 30 day GROUP BY event ORDER BY c DESC LIMIT 10',
      debugResponse: null,
      debugLoading: false,
      verificationLoading: false,
      verificationData: null,
    }
  },
  computed: {
    // Access store data through computed properties
    dashboardStore() {
      return useDashboardStore()
    },
    kpis() {
      return this.dashboardStore.kpis
    },
    loadingKpis() {
      return this.dashboardStore.kpisLoading
    },
    leadType() {
      return this.dashboardStore.leadTypeDistribution
    },
    traffic() {
      return this.dashboardStore.trafficSourceBreakdown
    },
    funnel() {
      return this.dashboardStore.funnel
    },
    recent() {
      return this.dashboardStore.recentLeads
    },
    loadingRecent() {
      return this.dashboardStore.recentLeadsLoading || false
    },
    topProducts() {
      return this.dashboardStore.topProducts
    },
    topLanding() {
      return this.dashboardStore.topLandingPages
    },
    lostLeads() {
      return this.dashboardStore.lostLeads
    },
    liveActions() {
      return this.dashboardStore.liveActions
    },
    seoKeywords() {
      return this.dashboardStore.seoKeywords
    },
    perfIssues() {
      return this.dashboardStore.perfIssues
    },
  },
  mounted() {
    // Auto-fetch on initial mount (and browser refresh)
    this.loadAllData()
  },
  methods: {
    // Normalize various PostHog response shapes into rows (array of arrays)
    normalizeRows(raw) {
      if (Array.isArray(raw)) return raw
      const r = raw?.results
      if (Array.isArray(r?.[0]?.results)) return r[0].results
      if (Array.isArray(r)) return r
      if (Array.isArray(r?.[0])) return r[0]
      return []
    },
    async loadAllData() {
      try {
        console.log('📊 Auto-loading dashboard data on mount...')
        this.dashboardStore.clearCache()
        await this.dashboardStore.fetchAllData(this.range, true)
        await this.dashboardStore.fetchRecentLeads(1, 10, true)
        console.log('✅ Dashboard data loaded on mount')
      } catch (error) {
        console.error('❌ Error loading dashboard data on mount:', error)
      }
    },
    async onRangeChange() {
      try {
        console.log('📅 Range changed to:', this.range, '- fetching fresh data')
        this.dashboardStore.clearCache()
        await this.dashboardStore.fetchAllData(this.range, true)
        await this.dashboardStore.fetchRecentLeads(1, 10, true)
        console.log('✅ Range change data loaded')
      } catch (error) {
        console.error('Error loading data for new range:', error)
      }
    },
    async fetchRecent(page = 1) {
      try {
        await this.dashboardStore.fetchRecentLeads(page, this.recent.limit)
      } catch (error) {
        console.error('Error fetching recent leads:', error)
      }
    },
    async refreshData() {
      try {
        console.log('🔄 Refreshing dashboard data - bypassing cache for live data...')
        // Clear cache first to ensure fresh data
        this.dashboardStore.clearCache()
        // Fetch all data with forceRefresh=true to bypass cache
        await Promise.all([
          this.dashboardStore.fetchAllData(this.range, true), // Force refresh - always fetch live data
          this.dashboardStore.fetchRecentLeads(1, 10, true), // Force refresh - always fetch live data
        ])
        console.log('✅ Dashboard data refreshed with live data from PostHog')
      } catch (error) {
        console.error('❌ Error refreshing data:', error)
      }
    },
    async clearCacheAndRefresh() {
      // New behavior: only clear cache; do not fetch
      console.log('🧹 Clearing cache only (no fetch). Data will refresh on next Refresh click.')
      this.dashboardStore.clearCache()
    },
    onKpiClick(name) {
      events.kpi_clicked(name)
    },
    async runDebugQuery() {
      this.debugLoading = true
      this.debugResponse = null

      try {
        console.log('🔍 Debug Query - Environment:', {
          VITE_MOCK_MODE: import.meta.env.VITE_MOCK_MODE,
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
          PROD: import.meta.env.PROD,
        })

        console.log('📤 Sending request:', {
          url: api.defaults.baseURL,
          method: 'POST',
          query: this.debugQuery,
        })

        // Check if query is empty
        if (!this.debugQuery || this.debugQuery.trim() === '') {
          this.debugResponse = {
            error: 'Query is empty. Please enter a valid HogQL query.',
          }
          return
        }

        const r = await api.post('', {
          query: this.debugQuery,
        })

        console.log('✅ Response received:', r.data)
        this.debugResponse = r.data
      } catch (e) {
        console.error('❌ Debug Query Error:', e)
        console.error('❌ Error Details:', {
          message: e.message,
          response: e.response?.data,
          status: e.response?.status,
          statusText: e.response?.statusText,
          config: {
            url: e.config?.url,
            baseURL: e.config?.baseURL,
            method: e.config?.method,
            data: e.config?.data,
          },
        })

        // Provide detailed error information
        this.debugResponse = {
          error: e.message || 'Unknown error occurred',
          status: e.response?.status,
          statusText: e.response?.statusText,
          responseData: e.response?.data,
          requestConfig: {
            url: e.config?.url || api.defaults.baseURL,
            method: e.config?.method || 'POST',
            data: e.config?.data,
          },
          fullError: e.toString(),
        }
      } finally {
        this.debugLoading = false
      }
    },
    async testLambdaConnection() {
      try {
        console.log('🧪 Testing Lambda connection...')
        console.log('🔍 API Base URL:', api.defaults.baseURL)

        // Test 1: Simple GET request
        console.log('📡 Testing GET request...')
        const getResponse = await api.get('')
        console.log('✅ GET response:', getResponse.data)

        // Test 2: Simple POST request with actual data
        console.log('📡 Testing POST request...')
        const postResponse = await api.post('', {
          query: `SELECT count() as total FROM events LIMIT 1`,
        })
        console.log('✅ POST response:', postResponse.data)

        alert('Lambda is working! Check console for details.')
      } catch (error) {
        console.error('❌ Lambda test failed:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        })
        alert(`Lambda test failed: ${error.message}`)
      }
    },
    async runDataVerification() {
      this.verificationLoading = true
      this.verificationData = null

      try {
        console.log('🔍 Running ultra-simple data verification...')

        // Get date filter for current range
        const dateFilter = this.getDateFilter(this.range)
        console.log('📅 Date filter for range', this.range, ':', dateFilter)

        // Step 1: Test basic connectivity with minimal query
        let allTimeEvents = 0
        try {
          const allTimeRes = await api.post('', {
            query: `SELECT 1 as test`,
          })
          console.log('📊 Basic connectivity test:', allTimeRes.data)
          allTimeEvents = 1 // If we get here, we have connectivity
        } catch (error) {
          console.error('❌ Basic connectivity failed:', error.message)
          throw error
        }

        // Step 2: Try to get actual data with very simple queries
        let totalEvents = 0
        let uniqueUsers = 0
        let topEvents = []

        // Try to get total events with a very simple query
        try {
          const totalEventsRes = await api.post('', {
            query: `SELECT count() FROM events WHERE timestamp > now() - interval 7 day`,
          })
          const totalRows = this.normalizeRows(totalEventsRes.data)
          totalEvents = Number(totalRows?.[0]?.[0] ?? 0)
          console.log('📊 Events in last 7 days:', totalEvents)
        } catch (error) {
          console.warn('⚠️ Events query failed:', error.message)
        }

        // Try to get unique users with a very simple query
        try {
          const uniqueUsersRes = await api.post('', {
            query: `SELECT count(DISTINCT distinct_id) FROM events WHERE timestamp > now() - interval 7 day`,
          })
          const userRows = this.normalizeRows(uniqueUsersRes.data)
          uniqueUsers = Number(userRows?.[0]?.[0] ?? 0)
          console.log('👥 Unique users in last 7 days:', uniqueUsers)
        } catch (error) {
          console.warn('⚠️ Unique users query failed:', error.message)
        }

        // Try to get top events with a very simple query
        try {
          const topEventsRes = await api.post('', {
            query: `SELECT event, count() FROM events WHERE timestamp > now() - interval 7 day GROUP BY event ORDER BY count DESC LIMIT 2`,
          })
          topEvents = this.normalizeRows(topEventsRes.data) || []
          console.log('📈 Top events in last 7 days:', topEvents)
        } catch (error) {
          console.warn('⚠️ Top events query failed:', error.message)
        }

        this.verificationData = {
          allTimeEvents,
          allTimeUsers: 0, // Skip for now
          totalEvents,
          uniqueUsers,
          eventsPerUser: uniqueUsers > 0 ? (totalEvents / uniqueUsers).toFixed(2) : 0,
          allEvents: [], // Skip for now
          topEvents,
          recentDates: [], // Skip for now
          dateFilter,
          error: null,
        }

        console.log('✅ Ultra-simple verification complete:', this.verificationData)
      } catch (error) {
        console.error('❌ Verification failed:', error)
        this.verificationData = {
          allTimeEvents: 0,
          allTimeUsers: 0,
          totalEvents: 0,
          uniqueUsers: 0,
          eventsPerUser: 0,
          allEvents: [],
          topEvents: [],
          recentDates: [],
          dateFilter: '',
          error: error.message || 'Failed to verify data',
        }
      } finally {
        this.verificationLoading = false
      }
    },
    getDateFilter(range) {
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
      return `timestamp > now() - interval 7 day`
    },
  },
}
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Environment Debug (temporary) -->
    <EnvironmentDebug />

    <!-- Data Verification Section -->
    <div class="card p-3 sm:p-4 mb-4 sm:mb-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4"
      >
        <h3 class="text-base sm:text-lg font-semibold text-gray-900">🔍 Data Verification</h3>
        <div class="flex flex-wrap gap-2">
          <button @click="testLambdaConnection" class="btn-secondary px-3 py-2 text-sm">
            Test Lambda
          </button>
          <button
            @click="runDataVerification"
            :disabled="verificationLoading"
            class="btn-primary px-4 py-2 text-sm"
          >
            {{ verificationLoading ? 'Verifying...' : 'Verify Data' }}
          </button>
        </div>
      </div>

      <div v-if="verificationData" class="space-y-4">
        <!-- All Time Data -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-3">📊 All Time Data in PostHog</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-3 rounded">
              <div class="text-sm font-medium text-gray-600">Total Events (All Time)</div>
              <div class="text-xl font-bold text-gray-900">
                {{ verificationData.allTimeEvents || 0 }}
              </div>
            </div>
            <div class="bg-white p-3 rounded">
              <div class="text-sm font-medium text-gray-600">Unique Users (All Time)</div>
              <div class="text-xl font-bold text-gray-900">
                {{ verificationData.allTimeUsers || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Current Range Data -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="text-sm font-medium text-blue-800">Events in Range ({{ range }})</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ verificationData.totalEvents || 0 }}
            </div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <div class="text-sm font-medium text-green-800">Unique Users in Range</div>
            <div class="text-2xl font-bold text-green-900">
              {{ verificationData.uniqueUsers || 0 }}
            </div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <div class="text-sm font-medium text-purple-800">Events per User</div>
            <div class="text-2xl font-bold text-purple-900">
              {{ verificationData.eventsPerUser || 0 }}
            </div>
          </div>
        </div>

        <!-- Date Filter Info -->
        <div class="bg-yellow-50 p-3 rounded-lg">
          <div class="text-sm font-medium text-yellow-800">Current Date Filter:</div>
          <div class="text-sm text-yellow-700 font-mono">{{ verificationData.dateFilter }}</div>
        </div>

        <div v-if="verificationData.topEvents && verificationData.topEvents.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">Top Events in Date Range:</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div
              v-for="event in verificationData.topEvents.slice(0, 8)"
              :key="event[0]"
              class="bg-slate-100 p-2 rounded text-sm"
            >
              <div class="font-mono text-xs">{{ event[0] }}</div>
              <div class="text-gray-600">{{ event[1] }}</div>
            </div>
          </div>
        </div>

        <!-- All Events in PostHog -->
        <div v-if="verificationData.allEvents && verificationData.allEvents.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">All Events in PostHog (All Time):</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div
              v-for="event in verificationData.allEvents.slice(0, 12)"
              :key="event[0]"
              class="bg-slate-100 p-2 rounded text-sm"
            >
              <div class="font-mono text-xs">{{ event[0] }}</div>
              <div class="text-gray-600">{{ event[1] }}</div>
            </div>
          </div>
        </div>

        <!-- Events in Current Range -->
        <div v-if="verificationData.topEvents && verificationData.topEvents.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">Events in Current Range ({{ range }}):</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div
              v-for="event in verificationData.topEvents.slice(0, 8)"
              :key="event[0]"
              class="bg-slate-100 p-2 rounded text-sm"
            >
              <div class="font-mono text-xs">{{ event[0] }}</div>
              <div class="text-gray-600">{{ event[1] }}</div>
            </div>
          </div>
        </div>

        <!-- Recent Dates with Data -->
        <div v-if="verificationData.recentDates && verificationData.recentDates.length > 0">
          <h4 class="font-medium text-gray-900 mb-2">Recent Dates with Data (Last 30 days):</h4>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div
              v-for="day in verificationData.recentDates.slice(0, 10)"
              :key="day[0]"
              class="bg-slate-100 p-2 rounded text-sm text-center"
            >
              <div class="text-xs text-gray-600">{{ day[0] }}</div>
              <div class="font-bold">{{ day[1] }} events</div>
              <div class="text-xs text-gray-500">{{ day[2] }} users</div>
            </div>
          </div>
        </div>

        <div v-if="verificationData.error" class="bg-red-50 p-3 rounded-lg">
          <div class="text-red-800 font-medium">Error:</div>
          <div class="text-red-700 text-sm">{{ verificationData.error }}</div>
        </div>
      </div>
    </div>

    <!-- Range control + KPIs -->
    <div class="flex flex-col gap-3">
      <!-- Mobile-first controls -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="refreshData"
              :disabled="dashboardStore.isLoading"
              class="btn-primary px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
            >
              <Icon
                name="refresh"
                :size="14"
                :class="{ 'animate-spin': dashboardStore.isLoading }"
              />
              <span class="hidden sm:inline">{{
                dashboardStore.isLoading ? 'Refreshing...' : 'Refresh'
              }}</span>
              <span class="sm:hidden">{{ dashboardStore.isLoading ? '...' : '↻' }}</span>
            </button>
            <button
              @click="clearCacheAndRefresh"
              :disabled="dashboardStore.isLoading"
              class="btn-secondary px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
            >
              <Icon name="trash-2" :size="14" />
              <span class="hidden sm:inline">Clear Cache</span>
              <span class="sm:hidden">Clear</span>
            </button>
          </div>
          <span class="text-[10px] sm:text-xs text-muted">
            Cache: {{ dashboardStore.isKpisCacheValid ? 'Valid' : 'Expired' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="calendar" :size="14" class="text-muted" />
          <label class="text-xs sm:text-sm text-muted">Range</label>
          <select
            v-model="range"
            @change="onRangeChange"
            class="rounded-lg border border-border px-2 sm:px-3 py-1.5 sm:py-2 min-w-[140px] sm:min-w-[180px] text-xs sm:text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="180d">Last 180 days</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="month">This month</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <template v-if="loadingKpis">
        <div class="card p-5"><BaseSkeleton :lines="3" /></div>
        <div class="card p-5"><BaseSkeleton :lines="3" /></div>
        <div class="card p-5"><BaseSkeleton :lines="3" /></div>
        <div class="card p-5"><BaseSkeleton :lines="3" /></div>
      </template>
      <template v-else>
        <!-- Total Visits -->
        <button class="text-left" @click="onKpiClick('Total Visits')">
          <BaseKpi
            title="Total Visits"
            :value="kpis.find((k) => k.key === 'total_visits')?.value"
            :delta="kpis.find((k) => k.key === 'total_visits')?.delta ?? 0"
          >
            <template #icon>
              <Icon name="users" :size="20" color="white" />
            </template>
          </BaseKpi>
        </button>

        <!-- Inquiries Submitted -->
        <button class="text-left" @click="onKpiClick('Inquiries Submitted')">
          <BaseKpi
            title="Inquiries Submitted"
            :value="kpis.find((k) => k.key === 'inquiries_submitted')?.value"
            :delta="kpis.find((k) => k.key === 'inquiries_submitted')?.delta ?? 0"
          >
            <template #icon>
              <Icon name="fileText" :size="20" color="white" />
            </template>
          </BaseKpi>
        </button>

        <!-- Drop Off Rate -->
        <button class="text-left" @click="onKpiClick('Drop Off Rate')">
          <BaseKpi
            title="Drop Off Rate"
            :value="kpis.find((k) => k.key === 'drop_off_rate')?.value"
            :delta="kpis.find((k) => k.key === 'drop_off_rate')?.delta ?? 0"
          >
            <template #icon>
              <Icon name="trendingDown" :size="20" color="white" />
            </template>
          </BaseKpi>
        </button>

        <!-- Hot Leads -->
        <button class="text-left" @click="onKpiClick('Hot Leads')">
          <BaseKpi
            title="Hot Leads"
            :value="kpis.find((k) => k.key === 'hot_leads')?.value"
            :delta="kpis.find((k) => k.key === 'hot_leads')?.delta ?? 0"
          >
            <template #icon>
              <Icon name="flame" :size="20" color="white" />
            </template>
          </BaseKpi>
        </button>
      </template>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <BarChart
        class="lg:col-span-2"
        title="Revenue"
        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
        :datasets="[
          { label: 'Income', data: [12, 9, 11, 13, 15, 12], color: '#134e4a' },
          { label: 'Expenses', data: [9, 13, 8, 7, 12, 10], color: '#a3e635' },
        ]"
        value-text="$193.000"
        delta-text="+35% from last month"
        :delta-positive="true"
      />
      <DonutCard
        title="Total View Performance"
        :labels="traffic.labels"
        :data="traffic.data"
        :legend="[
          { label: 'View Count', color: '#a3e635' },
          { label: 'Percentage', color: '#16a34a' },
          { label: 'Sales', color: '#f97316' },
        ]"
        center-label="Total Count"
        center-value="565K"
        :percents="[16, 23, 68]"
      />
    </div>

    <!-- Funnel -->
    <FunnelChart :steps="funnel || []" />

    <!-- Live Feed -->
    <div class="card p-3 sm:p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="chip text-xs">Live Now</div>
        <div class="text-[10px] sm:text-xs text-muted">Last 10 actions</div>
      </div>
      <ul class="text-xs sm:text-sm divide-y divide-border">
        <li
          v-for="a in liveActions"
          :key="a.id + a.when"
          class="py-2 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0"
        >
          <span class="truncate">
            <span class="font-medium text-heading">{{ a.id }}</span> — {{ a.action }}
          </span>
          <span class="text-muted text-[10px] sm:text-xs flex-shrink-0">{{
            new Date(a.when).toLocaleTimeString()
          }}</span>
        </li>
      </ul>
    </div>

    <!-- Recent Leads Table -->
    <BaseTable
      :columns="[
        { key: 'id', label: 'Lead ID' },
        { key: 'score', label: 'Score' },
        { key: 'type', label: 'Type' },
        { key: 'productsViewed', label: 'Products Viewed' },
        { key: 'pdfsOpened', label: 'PDFs Opened' },
        { key: 'lastActivity', label: 'Last Activity' },
        { key: 'actions', label: 'Actions' },
      ]"
      :rows="recent.items"
      :loading="loadingRecent"
      empty-text="No recent leads"
    >
      <template #cell:score="{ row }">
        <span class="badge-success">{{ row.score }}</span>
      </template>
      <template #cell:actions="{ row }">
        <router-link :to="`/leads/${row.id}`" class="btn-primary px-3 py-1"
          >View Details</router-link
        >
      </template>
    </BaseTable>

    <!-- Highlights Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <div class="card p-3 sm:p-4">
        <div class="font-medium mb-3 text-sm sm:text-base">Top Viewed Products</div>
        <ul class="space-y-2 text-xs sm:text-sm">
          <li
            v-for="p in topProducts"
            :key="p.product"
            class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0"
          >
            <span class="truncate">{{ p.product }}</span>
            <span class="text-muted text-[10px] sm:text-xs flex-shrink-0"
              >{{ p.views }} views • {{ p.attentionPct }}% ➜ {{ p.inquiryPct }}%</span
            >
          </li>
        </ul>
      </div>
      <div class="card p-3 sm:p-4">
        <div class="font-medium mb-3 text-sm sm:text-base">Top Landing Pages</div>
        <ul class="space-y-2 text-xs sm:text-sm">
          <li
            v-for="p in topLanding"
            :key="p.url"
            class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0"
          >
            <span class="text-forest-900 truncate">{{ p.url }}</span>
            <span class="text-muted text-[10px] sm:text-xs flex-shrink-0"
              >{{ p.sessions }} sessions • {{ p.conversionRate }}%</span
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- SEO Keywords Block -->
    <div class="card p-3 sm:p-4 overflow-x-auto">
      <div class="font-medium mb-3 text-sm sm:text-base">SEO Keywords</div>
      <table class="min-w-full text-xs sm:text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th class="py-2 px-1 sm:px-2">Keyword</th>
            <th class="py-2 px-1 sm:px-2">Landing Page</th>
            <th class="py-2 px-1 sm:px-2">Sessions</th>
            <th class="py-2 px-1 sm:px-2">Inquiries</th>
            <th class="py-2 px-1 sm:px-2">Conversion</th>
            <th class="py-2 px-1 sm:px-2">Issue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in seoKeywords" :key="k.keyword" class="border-t border-border">
            <td class="py-2 px-1 sm:px-2">{{ k.keyword }}</td>
            <td class="py-2 px-1 sm:px-2 text-forest-900">{{ k.landingPage }}</td>
            <td class="py-2 px-1 sm:px-2">{{ k.sessions }}</td>
            <td class="py-2 px-1 sm:px-2">{{ k.inquiries }}</td>
            <td class="py-2 px-1 sm:px-2">{{ k.conversion }}%</td>
            <td class="py-2 px-1 sm:px-2">{{ k.issue || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Performance Issues -->
    <div class="card p-3 sm:p-4 overflow-x-auto">
      <div class="font-medium mb-3 text-sm sm:text-base">Performance Issues</div>
      <table class="min-w-full text-xs sm:text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th class="py-2 px-1 sm:px-2">Page</th>
            <th class="py-2 px-1 sm:px-2">LCP (s)</th>
            <th class="py-2 px-1 sm:px-2">TTFB (s)</th>
            <th class="py-2 px-1 sm:px-2">Drop-offs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in perfIssues" :key="p.page" class="border-t border-border">
            <td class="py-2 px-1 sm:px-2">{{ p.page }}</td>
            <td class="py-2 px-1 sm:px-2">{{ p.lcp }}</td>
            <td class="py-2 px-1 sm:px-2">{{ p.ttfb }}</td>
            <td class="py-2 px-1 sm:px-2">{{ p.dropoffs }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Lost Lead Alerts -->
    <div class="card p-3 sm:p-4">
      <div class="font-medium mb-3 text-sm sm:text-base">Drop-off & Lost Lead Alerts</div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-2">
        <button class="btn-primary px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm">Export</button>
        <button class="btn-primary px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm">
          Send to Sales
        </button>
      </div>
      <ul class="space-y-2 text-xs sm:text-sm">
        <li
          v-for="a in lostLeads"
          :key="a.id"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span class="font-medium text-heading">{{ a.id }}</span>
            <span class="text-muted text-[10px] sm:text-xs">Products: {{ a.productsViewed }}</span>
            <span class="text-muted text-[10px] sm:text-xs"
              >Time: {{ Math.round(a.timeOnSiteSeconds / 60) }}m</span
            >
          </div>
          <router-link
            :to="`/leads/${a.id}`"
            class="btn-primary px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm self-start sm:self-auto"
            >View Lead</router-link
          >
        </li>
      </ul>
    </div>

    <!-- Debug: Raw PostHog data playground (toggle with debugOpen) -->
    <div class="card p-4" v-if="debugOpen">
      <div class="flex items-center justify-between mb-3">
        <div class="font-medium">Raw PostHog Query (HogQL)</div>
        <button class="chip" @click="debugOpen = false">Hide</button>
      </div>
      <textarea
        v-model="debugQuery"
        rows="4"
        class="w-full rounded-lg border border-border p-2 font-mono text-sm"
      ></textarea>
      <div class="mt-2 flex items-center gap-2">
        <button class="btn-primary px-3 py-1" @click="runDebugQuery" :disabled="debugLoading">
          {{ debugLoading ? 'Running...' : 'Run' }}
        </button>
        <span class="text-xs text-muted">Preview raw JSON below</span>
      </div>
      <div v-if="debugResponse" class="mt-3">
        <div v-if="debugResponse.error" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <div class="font-semibold text-red-800 mb-2">❌ Error:</div>
          <div class="text-sm text-red-700 mb-2">{{ debugResponse.error }}</div>
          <div v-if="debugResponse.status" class="text-xs text-red-600">
            Status: {{ debugResponse.status }} {{ debugResponse.statusText || '' }}
          </div>
          <details v-if="debugResponse.responseData || debugResponse.requestConfig" class="mt-2">
            <summary class="text-xs text-red-600 cursor-pointer">Show Details</summary>
            <pre class="mt-2 text-xs overflow-auto">{{
              JSON.stringify(debugResponse, null, 2)
            }}</pre>
          </details>
        </div>
        <pre v-else class="bg-surface rounded-lg p-3 overflow-auto text-xs">{{
          JSON.stringify(debugResponse, null, 2)
        }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
