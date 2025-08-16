<script>
import { dashboardApi } from '../../services/dashboardApi'
export default {
  name: 'PathsInsightsPage',
  data() {
    return { rows: [], loading: true }
  },
  async mounted() {
    try {
      const { rows } = await dashboardApi.getTopPaths()
      this.rows = rows
    } finally {
      this.loading = false
    }
  },
}
</script>

<template>
  <div class="card p-4 overflow-x-auto">
    <div class="flex items-center justify-between mb-3">
      <div class="font-medium">Top Paths (last 30 days)</div>
    </div>
    <table class="min-w-full text-sm">
      <thead class="text-muted">
        <tr class="text-left">
          <th class="py-2">Path</th>
          <th class="py-2">Visitors</th>
          <th class="py-2">Views</th>
          <th class="py-2">Bounce Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td class="py-3" colspan="4">Loading…</td>
        </tr>
        <tr v-for="p in rows" :key="p.path" class="border-t border-border">
          <td class="py-2 text-forest-900">{{ p.path }}</td>
          <td class="py-2">{{ p.visitors }}</td>
          <td class="py-2">{{ p.views }}</td>
          <td class="py-2">{{ p.bounceRate }}%</td>
        </tr>
        <tr v-if="!loading && rows.length === 0" class="border-t border-border">
          <td colspan="4" class="py-3">No data</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
