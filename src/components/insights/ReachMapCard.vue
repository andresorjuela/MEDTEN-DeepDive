<script>
export default {
  name: 'ReachMapCard',
  data() {
    return {
      stats: {
        countries: 12,
        users: 180807839,
        periodMonths: 9,
      },
      lastUpdatedSec: 0,
      // marker positions are percentage-based to keep it responsive
      markers: [
        { id: 'ca', label: 'Canada', value: 87142, top: 18, left: 31 },
        { id: 'de', label: 'Germany', value: 90069, top: 18, left: 63 },
        { id: 'id', label: 'Indonesia', value: 120904, top: 54, left: 76 },
        { id: 'uy', label: 'Uruguay', value: 85321, top: 63, left: 37 },
      ],
      timer: null,
    }
  },
  computed: {
    periodText() {
      return `${this.stats.periodMonths} month`
    },
    usersText() {
      return `${this.formatNumber(this.stats.users)} user`
    },
    updatedText() {
      return `Updated ${this.lastUpdatedSec}s ago`
    },
  },
  methods: {
    formatNumber(n) {
      return new Intl.NumberFormat('en-US').format(n)
    },
    refresh() {
      // simulate a lightweight dynamic update for demo/mock mode
      const jitter = () => Math.round((Math.random() - 0.5) * 2000)
      this.stats.users = Math.max(1000, this.stats.users + jitter())
      this.markers = this.markers.map((m) => ({ ...m, value: Math.max(100, m.value + jitter()) }))
      this.lastUpdatedSec = 0
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.lastUpdatedSec += 1
      if (this.lastUpdatedSec % 15 === 0) {
        this.refresh()
      }
    }, 1000)
  },
  unmounted() {
    if (this.timer) clearInterval(this.timer)
  },
}
</script>

<template>
  <div class="card p-4">
    <div class="grid grid-cols-3 gap-4">
      <!-- Left stats -->
      <div class="col-span-3 lg:col-span-1 space-y-6">
        <div>
          <div class="text-sm text-muted">Campaign Reach</div>
          <div class="mt-1 text-2xl font-semibold text-heading">{{ stats.countries }}</div>
          <div class="text-sm text-muted">country</div>
        </div>
        <div>
          <div class="text-sm text-muted">User Reached</div>
          <div class="mt-1 text-2xl font-semibold text-heading">{{ usersText }}</div>
        </div>
        <div>
          <div class="text-sm text-muted">Period</div>
          <div class="mt-1 text-2xl font-semibold text-heading">{{ periodText }}</div>
        </div>
      </div>

      <!-- Map area -->
      <div class="col-span-3 lg:col-span-2">
        <div
          class="relative rounded-xl overflow-hidden bg-surface border border-border min-h-[240px]"
        >
          <!-- dotted map background -->
          <div class="absolute inset-0 opacity-70" aria-hidden="true">
            <div
              class="w-full h-full bg-[radial-gradient(circle,_#94a3b81a_1.5px,_transparent_2px)] bg-[length:10px_10px]"
            ></div>
          </div>

          <!-- dynamic markers -->
          <div
            v-for="m in markers"
            :key="m.id"
            class="absolute -translate-x-1/2 -translate-y-full"
            :style="{ top: m.top + '%', left: m.left + '%' }"
          >
            <div class="px-3 py-2 rounded-lg bg-forest-900 text-white shadow text-xs">
              <div class="opacity-80">{{ m.label }}</div>
              <div class="font-semibold">{{ formatNumber(m.value) }}</div>
            </div>
            <div class="mt-1 size-2 rounded-full bg-chart-percentage mx-auto"></div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-3 text-xs text-muted">
          <span>{{ updatedText }}</span>
          <button
            class="text-forest-900 hover:underline inline-flex items-center gap-2"
            @click="refresh"
          >
            <span>Click to refresh</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
