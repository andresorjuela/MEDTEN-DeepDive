<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'BarChart',
  props: { labels: Array, data: Array, title: String },
  components: {
    ChartImpl: defineAsyncComponent(() => import('./chart-impl/BarImpl.vue')),
  },
}
</script>

<template>
  <div class="card p-4">
    <div class="font-medium mb-3">{{ title }}</div>
    <ChartImpl :labels="labels" :data="data" />
  </div>
</template>

<style scoped></style>
