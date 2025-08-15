<script>
export default {
  name: 'AppShell',
}
</script>

<template>
  <div class="min-h-screen dashboard-surface">
    <header class="bg-card border-b border-border sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-forest-900 text-white grid place-items-center">M</div>
          <div class="font-semibold">MEDTEN DeepDive</div>
        </div>
        <router-link to="/settings" class="text-muted hover:text-forest-900">Settings</router-link>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
