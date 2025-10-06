<script>
import { defineAsyncComponent } from 'vue'
export default {
  name: 'BarChart',
  props: {
    title: String,
    labels: Array,
    data: Array, // fallback single dataset
    datasets: Array, // [{label, data, color}]
    valueText: String,
    deltaText: String,
    deltaPositive: { type: Boolean, default: true },
  },
  components: {
    ChartImpl: defineAsyncComponent(() => import('./chart-impl/BarImpl.vue')),
  },
  computed: {
    useDatasets() {
      if (this.datasets && this.datasets.length) return this.datasets
      return this.data ? [{ label: 'Value', data: this.data, color: '#15803d' }] : []
    },
  },
}
</script>

<template>
  <div class="card p-4 sm:p-5">
    <!-- Header with title and legend -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="text-lg sm:text-xl font-semibold text-heading">{{ title }}</div>
      <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <div v-for="ds in useDatasets" :key="ds.label" class="flex items-center gap-2">
          <span class="size-4 rounded-md" :style="{ background: ds.color }"></span>
          <span class="text-heading">{{ ds.label }}</span>
        </div>
      </div>
    </div>

    <div class="h-px bg-border my-4"></div>

    <!-- Value + delta line -->
    <div class="flex items-center gap-3 mb-4">
      <div class="text-3xl sm:text-4xl font-extrabold text-heading">{{ valueText }}</div>
      <div
        :class="[
          'text-xs sm:text-sm font-medium',
          deltaPositive ? 'text-green-700' : 'text-orange-600',
        ]"
      >
        {{ deltaText }}
      </div>
    </div>

    <!-- Chart area -->
    <ChartImpl :labels="labels" :datasets="useDatasets" />
  </div>
</template>

<style scoped></style>
