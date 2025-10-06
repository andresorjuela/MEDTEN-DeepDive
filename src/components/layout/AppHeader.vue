<script>
import { useAuthStore } from '../../stores/auth'
export default {
  name: 'AppHeader',
  computed: {
    auth() {
      return useAuthStore()
    },
  },
  methods: {
    onLogout() {
      this.auth.logout()
      this.$router.replace('/auth/login')
    },
  },
}
</script>

<template>
  <header class="h-16 bg-card border-b border-border sticky top-0 z-10">
    <div
      class="max-w-[1280px] mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2 sm:gap-4"
    >
      <!-- Left: title with mobile spacing -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Mobile: Add left spacing for hamburger menu -->
        <div class="lg:hidden w-12"></div>
        <div class="text-lg sm:text-xl font-semibold text-heading">Sales Admin</div>
        <span class="text-muted hidden sm:inline">▾</span>
      </div>

      <!-- Center: search pill -->
      <div class="relative flex-1 max-w-2xl hidden sm:block">
        <input
          class="w-full rounded-full border border-border pl-5 pr-12 h-10 bg-card text-sm"
          placeholder="Search anything in DeepDive..."
        />
        <span
          class="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full border border-border grid place-items-center text-muted"
          >🔍</span
        >
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-2">
        <button
          @click="onLogout"
          class="inline-flex items-center gap-2 rounded-full border border-border bg-card text-heading px-3 sm:px-4 h-10 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
