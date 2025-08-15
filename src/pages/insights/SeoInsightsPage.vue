<script>
export default {
  name: 'SeoInsightsPage',
  data() {
    return {
      rows: [
        { url: '/products/x', sessions: 1234, inquiries: 56, cr: '4.5%', issues: 'Missing H1' },
        { url: '/brands/y', sessions: 934, inquiries: 31, cr: '3.3%', issues: 'Slow LCP' },
      ],
    }
  },
}
</script>

<template>
  <div class="card p-4 overflow-x-auto">
    <div class="font-medium mb-3">Top Landing Pages</div>
    <table class="min-w-full text-sm">
      <thead class="text-muted">
        <tr class="text-left">
          <th class="py-2">URL</th>
          <th class="py-2">Sessions</th>
          <th class="py-2">Inquiries</th>
          <th class="py-2">Conv. Rate</th>
          <th class="py-2">Issues</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.url" class="border-t border-border">
          <td class="py-2">
            <a :href="r.url" class="text-forest-900 hover:underline">{{ r.url }}</a>
          </td>
          <td class="py-2">{{ r.sessions }}</td>
          <td class="py-2">{{ r.inquiries }}</td>
          <td class="py-2">{{ r.cr }}</td>
          <td class="py-2">{{ r.issues }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
