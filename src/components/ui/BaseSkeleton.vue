<script>
export default { name: 'BaseSkeleton', props: { lines: { type: Number, default: 3 } } }
</script>

<template>
  <div class="animate-pulse space-y-2">
    <div
      v-for="i in lines"
      :key="i"
      class="h-3 bg-forest-900/10 rounded"
      :style="{ width: 80 - i * 5 + '%' }"
    ></div>
  </div>
</template>

<style scoped></style>
