<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'DonutChart',
  props: { labels: Array, data: Array, title: String },
  components: {
    ChartImpl: defineAsyncComponent(() => import('./chart-impl/DonutImpl.vue')),
  },
}
</script>

<template>
  <div class="card p-4 sm:p-5">
    <div class="font-medium mb-3 text-base sm:text-lg">{{ title }}</div>
    <ChartImpl :labels="labels" :data="data" />
  </div>
</template>

<style scoped></style>
