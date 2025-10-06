<script>
export default {
  name: 'BaseTable',
  props: {
    columns: Array,
    rows: Array,
    loading: Boolean,
    emptyText: { type: String, default: 'No data' },
  },
}
</script>

<template>
  <div class="card p-3 sm:p-4 overflow-x-auto">
    <div v-if="loading" class="py-8 sm:py-10 text-center text-muted text-sm">Loading…</div>
    <template v-else>
      <table v-if="rows && rows.length" class="min-w-full text-xs sm:text-sm">
        <thead class="text-muted">
          <tr class="text-left">
            <th v-for="c in columns" :key="c.key" class="py-2 px-1 sm:px-2">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, idx) in rows" :key="idx" class="border-t border-border">
            <td v-for="c in columns" :key="c.key" class="py-2 px-1 sm:px-2">
              <slot :name="`cell:${c.key}`" :row="r">{{ r[c.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="py-8 sm:py-10 text-center text-muted text-sm">{{ emptyText }}</div>
    </template>
  </div>
</template>

<style scoped></style>
