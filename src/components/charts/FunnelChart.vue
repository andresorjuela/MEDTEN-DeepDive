<script>
export default {
  name: 'FunnelChart',
  props: { steps: Array },
}
</script>

<template>
  <div class="card p-4">
    <div class="font-medium mb-3">Inquiry Flow</div>
    <div class="grid gap-2">
      <div v-for="s in steps" :key="s.step" class="flex items-center gap-3">
        <div class="w-28 text-sm text-muted">{{ s.step }}</div>
        <div class="flex-1 bg-surface rounded h-3 overflow-hidden">
          <div class="h-3 bg-forest-900" :style="{ width: Math.max(2, s.count) + 'px' }"></div>
        </div>
        <div class="w-16 text-right text-sm text-heading">{{ s.count }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
