<script>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
export default { name: 'AppShell', components: { AppSidebar, AppHeader } }
</script>

<template>
  <div class="min-h-screen dashboard-surface">
    <!-- Desktop Layout: Sidebar takes space -->
    <div class="hidden lg:flex">
      <AppSidebar />
      <div class="flex-1 min-w-0">
        <AppHeader />
        <main
          class="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 md:space-y-8"
        >
          <router-view />
        </main>
      </div>
    </div>

    <!-- Mobile Layout: Sidebar is overlay, main content takes full width -->
    <div class="lg:hidden">
      <AppSidebar />
      <div class="w-full min-w-0">
        <AppHeader />
        <main
          class="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 md:space-y-8"
        >
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
