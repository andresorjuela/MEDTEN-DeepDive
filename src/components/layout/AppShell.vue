<script>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
export default { name: 'AppShell', components: { AppSidebar, AppHeader } }
</script>

<template>
  <div class="min-h-screen dashboard-surface">
    <div class="flex">
      <AppSidebar />
      <div class="flex-1 min-w-0">
        <AppHeader />
        <main class="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
