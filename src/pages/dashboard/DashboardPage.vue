<script>
import ReachMapCard from '../../components/insights/ReachMapCard.vue'
import BaseKpi from '../../components/ui/BaseKpi.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import BarChart from '../../components/charts/BarChart.vue'
import DonutChart from '../../components/charts/DonutChart.vue'
import { dashboardApi } from '../../services/dashboardApi'

export default {
  name: 'DashboardPage',
  components: { ReachMapCard, BaseKpi, BaseTable, BarChart, DonutChart },
  data() {
    return {
      kpis: [],
      leadType: { labels: [], data: [] },
      traffic: { labels: [], data: [] },
      recent: { items: [], total: 0, page: 1, limit: 10 },
      topProducts: [],
      topLanding: [],
      lostLeads: [],
      loadingRecent: false,
    }
  },
  mounted() {
    dashboardApi.getDashboardKPIs().then((d) => (this.kpis = d))
    dashboardApi.getLeadTypeDistribution().then((d) => (this.leadType = d))
    dashboardApi.getTrafficSourceBreakdown().then((d) => (this.traffic = d))
    this.fetchRecent()
    dashboardApi.getTopProducts().then((d) => (this.topProducts = d.rows))
    dashboardApi.getTopLandingPages().then((d) => (this.topLanding = d.rows))
    dashboardApi.getLostLeads().then((d) => (this.lostLeads = d.rows))
  },
  methods: {
    async fetchRecent(page = 1) {
      this.loadingRecent = true
      try {
        const res = await dashboardApi.getRecentLeads({ page, limit: this.recent.limit })
        this.recent = { ...res, page, limit: this.recent.limit }
      } finally {
        this.loadingRecent = false
      }
    },
  },
}
</script>

<template>
  <div class="space-y-6">
    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseKpi
        v-for="k in kpis"
        :key="k.key"
        :title="k.title"
        :value="k.value"
        :delta="k.delta"
        :icon="k.title[0]"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <BarChart
        class="lg:col-span-2"
        title="Lead Type Distribution"
        :labels="leadType.labels"
        :data="leadType.data"
      />
      <DonutChart title="Traffic Source Breakdown" :labels="traffic.labels" :data="traffic.data" />
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="card p-4">
        <div class="font-medium mb-3">Top Viewed Products</div>
        <ul class="space-y-2 text-sm">
          <li v-for="p in topProducts" :key="p.product" class="flex justify-between">
            <span>{{ p.product }}</span>
            <span class="text-muted"
              >{{ p.views }} views • {{ p.attentionPct }}% ➜ {{ p.inquiryPct }}%</span
            >
          </li>
        </ul>
      </div>
      <div class="card p-4">
        <div class="font-medium mb-3">Top Landing Pages</div>
        <ul class="space-y-2 text-sm">
          <li v-for="p in topLanding" :key="p.url" class="flex justify-between">
            <span class="text-forest-900">{{ p.url }}</span>
            <span class="text-muted">{{ p.sessions }} sessions • {{ p.conversionRate }}%</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Lost Lead Alerts -->
    <div class="card p-4">
      <div class="font-medium mb-3">Drop-off & Lost Lead Alerts</div>
      <ul class="space-y-2 text-sm">
        <li v-for="a in lostLeads" :key="a.id" class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <span class="font-medium text-heading">{{ a.id }}</span>
            <span class="text-muted">Products: {{ a.productsViewed }}</span>
            <span class="text-muted">Time: {{ Math.round(a.timeOnSiteSeconds / 60) }}m</span>
          </div>
          <router-link :to="`/leads/${a.id}`" class="btn-primary px-3 py-1">View Lead</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
