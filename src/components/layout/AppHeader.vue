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
    <div class="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between">
      <div class="relative flex-1 max-w-xl">
        <input
          class="w-full rounded-xl border border-border pl-11 pr-3 py-2.5 bg-surface text-sm"
          placeholder="Search anything…"
        />
        <span class="absolute inset-y-0 left-3 grid place-items-center text-muted text-base"
          >🔎</span
        >
      </div>
      <div class="flex items-center gap-3">
        <RouterLink to="/settings" class="chip">Settings</RouterLink>
        <button class="btn-primary px-3 py-1" @click="onLogout">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
