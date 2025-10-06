<template>
  <div class="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Dashboard Summary</h3>

    <div class="grid grid-cols-2 gap-3 sm:gap-4">
      <div class="text-center">
        <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ totalVisits }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Total Visits</div>
      </div>
      <div class="text-center">
        <div class="text-xl sm:text-2xl font-bold text-green-600">{{ hotLeads }}</div>
        <div class="text-xs sm:text-sm text-gray-600">Hot Leads</div>
      </div>
    </div>

    <div class="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
      Last updated: {{ lastUpdated }}
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../../stores/dashboard'

export default {
  name: 'DashboardKpiSummary',
  computed: {
    dashboardStore() {
      return useDashboardStore()
    },
    totalVisits() {
      return this.dashboardStore.totalVisits
    },
    hotLeads() {
      return this.dashboardStore.hotLeads
    },
    lastUpdated() {
      if (!this.dashboardStore.kpisLastFetched) return 'Never'
      return new Date(this.dashboardStore.kpisLastFetched).toLocaleTimeString()
    },
  },
  async mounted() {
    // This component can access cached data or fetch if needed
    if (!this.dashboardStore.isKpisCacheValid) {
      await this.dashboardStore.fetchKPIs('7d')
    }
  },
}
</script>
