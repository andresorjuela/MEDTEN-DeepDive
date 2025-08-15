<script>
import { useLeadsStore } from '../../stores/leads'
let debounceId
export default {
  name: 'LeadsPage',
  data() {
    return { q: '' }
  },
  computed: {
    store() {
      return useLeadsStore()
    },
    leads() {
      return this.store.list
    },
  },
  watch: {
    q() {
      clearTimeout(debounceId)
      debounceId = setTimeout(() => {
        this.store.setFilters({ q: this.q })
        this.store.fetchLeads({ page: 1 })
      }, 300)
    },
  },
  mounted() {
    this.store.fetchLeads()
  },
}
</script>

<template>
  <div class="space-y-4">
    <div class="card p-4 grid gap-3 md:grid-cols-4">
      <input
        v-model="q"
        placeholder="Search leads"
        class="md:col-span-2 rounded-lg border border-border px-3 py-2"
      />
      <select class="rounded-lg border border-border px-3 py-2">
        <option>All Types</option>
      </select>
      <select class="rounded-lg border border-border px-3 py-2">
        <option>All Sources</option>
      </select>
    </div>

    <div class="card p-4 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th class="py-2">ID</th>
            <th class="py-2">Score</th>
            <th class="py-2">Type</th>
            <th class="py-2">Products Viewed</th>
            <th class="py-2">Time Spent</th>
            <th class="py-2">Form Reached</th>
            <th class="py-2">PDF Opened</th>
            <th class="py-2">Last Activity</th>
            <th class="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in leads" :key="r.id" class="border-t border-border">
            <td class="py-2 font-medium text-heading">
              <router-link :to="`/leads/${r.id}`" class="hover:underline">{{ r.id }}</router-link>
            </td>
            <td class="py-2">
              <span class="badge-success">{{ r.score }}</span>
            </td>
            <td class="py-2">{{ r.type }}</td>
            <td class="py-2">{{ r.productsViewed }}</td>
            <td class="py-2">{{ Math.round(r.timeOnSiteSeconds / 60) }}m</td>
            <td class="py-2">{{ r.reachedInquiryForm ? 'Yes' : 'No' }}</td>
            <td class="py-2">{{ r.pdfsOpened > 0 ? 'Yes' : 'No' }}</td>
            <td class="py-2">{{ r.lastSeen }}</td>
            <td class="py-2">{{ r.lost ? 'Lost' : 'Active' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
