<script>
import ReachMapCard from '../../components/insights/ReachMapCard.vue'

export default {
  name: 'DashboardPage',
  components: { ReachMapCard },
  data() {
    return {
      kpis: [
        { label: 'Total Inquiries', value: 193000, delta: '+35%' },
        { label: 'Conversion Rate', value: '4.2%', delta: '+0.3%' },
        { label: 'Drop-offs', value: '24%', delta: '-2%' },
        { label: 'Hot Leads', value: 563, delta: '+12%' },
      ],
      recent: [
        { id: 'L-1021', score: 92, type: 'Demo', last: 'Viewed Product' },
        { id: 'L-1020', score: 71, type: 'Contact', last: 'Opened PDF' },
        { id: 'L-1019', score: 64, type: 'Mail', last: 'Reached Form' },
      ],
    }
  },
}
</script>

<template>
  <div class="space-y-6">
    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="k in kpis" :key="k.label" class="card p-4">
        <div class="text-sm text-muted">{{ k.label }}</div>
        <div class="text-2xl font-semibold text-heading mt-1">{{ k.value }}</div>
        <div class="badge-success mt-2">{{ k.delta }}</div>
      </div>
    </div>

    <!-- Stubs for charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card p-4 lg:col-span-2">
        <div class="font-medium mb-3">Lead Type Distribution (stub)</div>
        <div class="h-48 grid grid-cols-6 gap-2 items-end">
          <div class="bg-chart-percentage h-16 rounded"></div>
          <div class="bg-chart-view h-24 rounded"></div>
          <div class="bg-chart-percentage h-32 rounded"></div>
          <div class="bg-chart-view h-28 rounded"></div>
          <div class="bg-chart-percentage h-20 rounded"></div>
          <div class="bg-chart-view h-36 rounded"></div>
        </div>
      </div>

      <ReachMapCard />
    </div>

    <!-- Recent leads table (simplified) -->
    <div class="card p-4">
      <div class="font-medium mb-3">Recent Leads</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="text-muted">
            <tr class="text-left">
              <th class="py-2">ID</th>
              <th class="py-2">Score</th>
              <th class="py-2">Type</th>
              <th class="py-2">Last Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recent" :key="r.id" class="border-t border-border">
              <td class="py-2 font-medium text-heading">{{ r.id }}</td>
              <td class="py-2">
                <span class="badge-success">{{ r.score }}</span>
              </td>
              <td class="py-2">{{ r.type }}</td>
              <td class="py-2">{{ r.last }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
