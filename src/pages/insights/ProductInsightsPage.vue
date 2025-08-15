<script>
export default {
  name: 'ProductInsightsPage',
  data() {
    return {
      rows: [
        {
          product: 'Alpha Monitor',
          brand: 'MedBrand',
          attention: 82,
          inquiries: 21,
          flag: 'High attention, low inquiries',
        },
        { product: 'Beta Scanner', brand: 'ScanPro', attention: 34, inquiries: 29, flag: '' },
      ],
    }
  },
}
</script>

<template>
  <div class="card p-4 overflow-x-auto">
    <div class="font-medium mb-3">Top Viewed Products</div>
    <table class="min-w-full text-sm">
      <thead class="text-muted">
        <tr class="text-left">
          <th class="py-2">Product</th>
          <th class="py-2">Brand</th>
          <th class="py-2">Attention</th>
          <th class="py-2">Inquiries</th>
          <th class="py-2">Flag</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.product" class="border-t border-border">
          <td class="py-2">{{ r.product }}</td>
          <td class="py-2">{{ r.brand }}</td>
          <td class="py-2">{{ r.attention }}</td>
          <td class="py-2">{{ r.inquiries }}</td>
          <td class="py-2">{{ r.flag || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
