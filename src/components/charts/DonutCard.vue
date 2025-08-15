<script>
import DonutChart from './DonutChart.vue'
export default {
  name: 'DonutCard',
  components: { DonutChart },
  props: { title: String, labels: Array, data: Array, legend: Array },
}
</script>

<template>
  <div class="card p-4">
    <div class="font-medium mb-3">{{ title }}</div>
    <DonutChart :labels="labels" :data="data" />
    <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
      <div v-for="(l, i) in legend" :key="i" class="flex items-center gap-2">
        <span class="size-3 rounded-full" :style="{ background: l.color }"></span>
        <span>{{ l.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
