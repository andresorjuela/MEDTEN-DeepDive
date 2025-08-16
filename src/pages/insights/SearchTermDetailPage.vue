<script>
import { dashboardApi } from '../../services/dashboardApi'
export default {
  name: 'SearchTermDetailPage',
  props: { term: String },
  data() {
    return { loading: true, total: 0, trend: { labels: [], data: [] }, topPages: [], recent: [] }
  },
  async mounted() {
    try {
      const d = await dashboardApi.getSearchTermDetail(this.term)
      Object.assign(this, d)
    } finally {
      this.loading = false
    }
  },
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-heading">Search: {{ term }}</h1>
      <router-link to="/insights/search" class="btn-primary px-3 py-1">Back</router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-4">
        <div class="text-sm text-muted mb-1">Total Searches (30d)</div>
        <div class="text-3xl font-semibold">{{ total }}</div>
      </div>
      <div class="card p-4 md:col-span-2">
        <div class="font-medium mb-2">Trend</div>
        <div class="text-xs text-muted mb-2">Daily counts</div>
        <div class="grid grid-cols-12 gap-1">
          <div
            v-for="(v, i) in trend.data"
            :key="i"
            class="bg-lime-400/60"
            :style="{ height: Math.max(4, v * 6) + 'px' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card p-4 overflow-x-auto">
        <div class="font-medium mb-2">Top Pages</div>
        <table class="min-w-full text-sm">
          <thead class="text-muted">
            <tr class="text-left">
              <th class="py-2">Page</th>
              <th class="py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in topPages" :key="p.page" class="border-t border-border">
              <td class="py-2 text-forest-900">{{ p.page }}</td>
              <td class="py-2">{{ p.count }}</td>
            </tr>
            <tr v-if="!loading && topPages.length === 0" class="border-t border-border">
              <td colspan="2" class="py-3">No pages</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card p-4 overflow-x-auto">
        <div class="font-medium mb-2">Recent Searches</div>
        <table class="min-w-full text-sm">
          <thead class="text-muted">
            <tr class="text-left">
              <th class="py-2">When</th>
              <th class="py-2">Visitor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recent" :key="r.t + r.id" class="border-t border-border">
              <td class="py-2">{{ r.t }}</td>
              <td class="py-2">
                <router-link :to="`/leads/${r.id}`" class="text-forest-900 hover:underline">{{
                  r.id
                }}</router-link>
              </td>
            </tr>
            <tr v-if="!loading && recent.length === 0" class="border-t border-border">
              <td colspan="2" class="py-3">No recent activity</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
