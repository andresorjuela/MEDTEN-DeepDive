<script>
import DonutChart from './DonutChart.vue'
export default {
  name: 'DonutCard',
  components: { DonutChart },
  props: {
    title: String,
    labels: Array,
    data: Array,
    legend: Array,
    centerLabel: { type: String, default: 'Total Count' },
    centerValue: { type: String, default: '' },
    percents: { type: Array, default: () => [] },
  },
}
</script>

<template>
  <div class="card p-5">
    <div class="text-xl font-semibold text-heading text-center mb-4">{{ title }}</div>
    <div class="relative mx-auto max-w-[280px]">
      <DonutChart :labels="labels" :data="data" />

      <!-- Center label/value overlay -->
      <div class="absolute inset-0 grid place-items-center pointer-events-none">
        <div class="text-center">
          <div class="text-muted text-sm">{{ centerLabel }}</div>
          <div class="text-4xl font-extrabold text-heading">{{ centerValue }}</div>
        </div>
      </div>

      <!-- Percentage bubbles (up to 3) around the ring -->
      <div
        v-for="(p, i) in percents.slice(0, 3)"
        :key="i"
        class="absolute bg-white rounded-full shadow size-14 grid place-items-center text-heading text-sm"
        :style="[
          i === 0 && { top: '8%', left: '6%' },
          i === 1 && { top: '8%', right: '6%' },
          i === 2 && { bottom: '6%', left: '28%' },
        ]"
      >
        {{ p }}%
      </div>
    </div>

    <p class="text-center text-muted mt-4 text-base">
      Here are some tips on how to improve your score.
    </p>

    <div class="mt-4 grid place-items-center">
      <button class="rounded-full border border-border h-12 px-6 text-heading bg-card">
        Guide Views
      </button>
    </div>

    <div class="mt-5 border-t border-border pt-4 grid grid-cols-3 gap-2 text-sm text-muted">
      <div v-for="(l, i) in legend" :key="i" class="flex items-center gap-2 justify-center">
        <span class="size-3 rounded-full" :style="{ background: l.color }"></span>
        <span>{{ l.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
