<script>
import ReachMapCard from '../../components/insights/ReachMapCard.vue'
import BaseKpi from '../../components/ui/BaseKpi.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import BarChart from '../../components/charts/BarChart.vue'
import DonutChart from '../../components/charts/DonutChart.vue'
import DonutCard from '../../components/charts/DonutCard.vue'
import { dashboardApi } from '../../services/dashboardApi'

export default {
  name: 'DashboardPage',
  components: { ReachMapCard, BaseKpi, BaseTable, BarChart, DonutChart, DonutCard },
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
      liveActions: [],
      seoKeywords: [],
      perfIssues: [],
      filters: { dateRange: '', source: '', brand: '', keyword: '' },
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
    dashboardApi.getLiveActions().then((d) => (this.liveActions = d.rows))
    dashboardApi.getSeoKeywords().then((d) => (this.seoKeywords = d.rows))
    dashboardApi.getPerfIssues().then((d) => (this.perfIssues = d.rows))
  },
  methods: {
    onFiltersChanged: (() => {
      let id
      return function () {
        clearTimeout(id)
        id = setTimeout(() => this.fetchRecent(1), 300)
      }
    })(),
    async fetchRecent(page = 1) {
      this.loadingRecent = true
      try {
        const res = await dashboardApi.getRecentLeads({
          page,
          limit: this.recent.limit,
          ...this.filters,
        })
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
    <!-- Filter bar -->
    <div class="card p-4 grid gap-3 md:grid-cols-4">
      <input
        placeholder="Date Range"
        v-model="filters.dateRange"
        @input="onFiltersChanged"
        class="rounded-lg border border-border px-3 py-2"
      />
      <select
        v-model="filters.source"
        @change="onFiltersChanged"
        class="rounded-lg border border-border px-3 py-2"
      >
        <option value="">All Sources</option>
        <option>Organic</option>
        <option>Paid</option>
        <option>Referral</option>
        <option>Direct</option>
      </select>
      <input
        placeholder="Brand"
        v-model="filters.brand"
        @input="onFiltersChanged"
        class="rounded-lg border border-border px-3 py-2"
      />
      <input
        placeholder="Keyword"
        v-model="filters.keyword"
        @input="onFiltersChanged"
        class="rounded-lg border border-border px-3 py-2"
      />
    </div>
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
      <DonutCard
        title="Total View Performance"
        :labels="traffic.labels"
        :data="traffic.data"
        :legend="[
          { label: 'View Count', color: '#a3e635' },
          { label: 'Percentage', color: '#16a34a' },
          { label: 'Sales', color: '#f97316' },
        ]"
      />
    </div>

    <!-- Live Feed -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="chip">Live Now</div>
        <div class="text-xs text-muted">Last 10 actions</div>
      </div>
      <ul class="text-sm divide-y divide-border">
        <li v-for="a in liveActions" :key="a.id + a.when" class="py-2 flex justify-between">
          <span
            ><span class="font-medium text-heading">{{ a.id }}</span> — {{ a.action }}</span
          >
          <span class="text-muted">{{ new Date(a.when).toLocaleTimeString() }}</span>
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

    <!-- SEO Keywords Block -->
    <div class="card p-4 overflow-x-auto">
      <div class="font-medium mb-3">SEO Keywords</div>
      <table class="min-w-full text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th class="py-2">Keyword</th>
            <th class="py-2">Landing Page</th>
            <th class="py-2">Sessions</th>
            <th class="py-2">Inquiries</th>
            <th class="py-2">Conversion</th>
            <th class="py-2">Issue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in seoKeywords" :key="k.keyword" class="border-t border-border">
            <td class="py-2">{{ k.keyword }}</td>
            <td class="py-2 text-forest-900">{{ k.landingPage }}</td>
            <td class="py-2">{{ k.sessions }}</td>
            <td class="py-2">{{ k.inquiries }}</td>
            <td class="py-2">{{ k.conversion }}%</td>
            <td class="py-2">{{ k.issue || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Performance Issues -->
    <div class="card p-4 overflow-x-auto">
      <div class="font-medium mb-3">Performance Issues</div>
      <table class="min-w-full text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th class="py-2">Page</th>
            <th class="py-2">LCP (s)</th>
            <th class="py-2">TTFB (s)</th>
            <th class="py-2">Drop-offs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in perfIssues" :key="p.page" class="border-t border-border">
            <td class="py-2">{{ p.page }}</td>
            <td class="py-2">{{ p.lcp }}</td>
            <td class="py-2">{{ p.ttfb }}</td>
            <td class="py-2">{{ p.dropoffs }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Lost Lead Alerts -->
    <div class="card p-4">
      <div class="font-medium mb-3">Drop-off & Lost Lead Alerts</div>
      <div class="flex items-center justify-end gap-2 mb-2">
        <button class="btn-primary px-3 py-1">Export</button>
        <button class="btn-primary px-3 py-1">Send to Sales</button>
      </div>
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
