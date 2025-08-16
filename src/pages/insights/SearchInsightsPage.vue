<script>
import { dashboardApi } from '../../services/dashboardApi'
export default {
  name: 'SearchInsightsPage',
  data() {
    return { rows: [], loading: true }
  },
  async mounted() {
    try {
      const { rows } = await dashboardApi.getTopSearchTerms()
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
      <div class="font-medium">Top Search Terms (30 days)</div>
    </div>
    <table class="min-w-full text-sm">
      <thead class="text-muted">
        <tr class="text-left">
          <th class="py-2">Search Term</th>
          <th class="py-2">Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td class="py-3" colspan="2">Loading…</td>
        </tr>
        <tr v-for="r in rows" :key="r.term" class="border-t border-border">
          <td class="py-2 font-medium text-heading">
            <router-link
              :to="`/insights/search/${encodeURIComponent(r.term)}`"
              class="text-forest-900 hover:underline"
            >
              {{ r.term }}
            </router-link>
          </td>
          <td class="py-2">{{ r.count }}</td>
        </tr>
        <tr v-if="!loading && rows.length === 0" class="border-t border-border">
          <td class="py-3" colspan="2">No searches recorded</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
