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
  <div
    class="card p-3 sm:p-4 md:p-6 flex items-start gap-2 sm:gap-3 hover:shadow-[var(--shadow-elevated)] transition"
  >
    <div
      class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-forest-900 text-white grid place-items-center text-xs sm:text-sm flex-shrink-0"
    >
      <slot name="icon">
        {{ icon }}
      </slot>
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-xs sm:text-sm text-muted leading-tight">{{ title }}</div>
      <div
        class="text-2xl sm:text-3xl md:text-4xl font-semibold text-heading truncate leading-tight"
      >
        {{ value }}
      </div>
      <div :class="['text-[10px] sm:text-xs font-medium', deltaColor]">
        {{ deltaPrefix }}{{ delta }}%
      </div>
    </div>
  </div>
</template>

<style scoped></style>
