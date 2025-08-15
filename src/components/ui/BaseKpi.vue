<script>
export default {
  name: 'BaseKpi',
  props: {
    title: String,
    value: [String, Number],
    delta: Number,
    icon: String,
  },
  computed: {
    deltaColor() {
      return (this.delta ?? 0) >= 0 ? 'text-green-700' : 'text-orange-600'
    },
    deltaPrefix() {
      return (this.delta ?? 0) >= 0 ? '+' : ''
    },
  },
}
</script>

<template>
  <div class="card p-4 flex items-start gap-3 hover:shadow-[var(--shadow-elevated)] transition">
    <div class="w-9 h-9 rounded-lg bg-forest-900 text-white grid place-items-center text-sm">
      {{ icon }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-sm text-muted">{{ title }}</div>
      <div class="text-2xl font-semibold text-heading truncate">{{ value }}</div>
      <div :class="['text-xs font-medium', deltaColor]">{{ deltaPrefix }}{{ delta }}%</div>
    </div>
  </div>
</template>

<style scoped></style>
