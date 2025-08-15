<script>
export default { name: 'AppSidebar' }
</script>

<template>
  <aside
    class="hidden lg:flex lg:w-[240px] lg:flex-col bg-forest-900 text-white min-h-screen sticky top-0"
  >
    <div class="h-16 px-4 flex items-center gap-3 border-b border-white/10">
      <div class="w-9 h-9 rounded-lg bg-white text-forest-900 grid place-items-center font-bold">
        M
      </div>
      <div class="font-semibold">MEDTEN</div>
    </div>
    <nav class="p-3 space-y-1 text-sm">
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >Overview</RouterLink
      >
      <RouterLink to="/leads" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >Leads</RouterLink
      >
      <RouterLink
        to="/insights/seo"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >SEO</RouterLink
      >
      <RouterLink
        to="/insights/products"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >Products</RouterLink
      >
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
        >Settings</RouterLink
      >
    </nav>
  </aside>
</template>

<style scoped></style>
