<script>
export default {
  name: 'FunnelChart',
  props: { steps: Array },
}
</script>

<template>
  <div class="card p-3 sm:p-4">
    <div class="font-medium mb-3 text-sm sm:text-base">Inquiry Flow</div>
    <div class="grid gap-2 sm:gap-3">
      <div v-for="s in steps" :key="s.step" class="flex items-center gap-2 sm:gap-3">
        <div class="w-20 sm:w-28 text-xs sm:text-sm text-muted flex-shrink-0">{{ s.step }}</div>
        <div class="flex-1 bg-surface rounded h-2 sm:h-3 overflow-hidden">
          <div
            class="h-2 sm:h-3 bg-forest-900"
            :style="{ width: Math.max(2, s.count) + 'px' }"
          ></div>
        </div>
        <div class="w-12 sm:w-16 text-right text-xs sm:text-sm text-heading flex-shrink-0">
          {{ s.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
