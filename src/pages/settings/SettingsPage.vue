<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      mockMode: true,
      theme: 'light',
      apiBase: import.meta.env.VITE_API_BASE || 'https://api.example.com',
    }
  },
}
</script>

<template>
  <div class="card p-4 space-y-4">
    <div class="font-medium">Settings</div>
    <label class="flex items-center justify-between">
      <span>Mock mode</span>
      <input v-model="mockMode" type="checkbox" />
    </label>
    <label class="grid grid-cols-3 items-center gap-2">
      <span>Theme</span>
      <select v-model="theme" class="col-span-2 rounded-lg border border-border px-3 py-2">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    <label class="grid grid-cols-3 items-center gap-2">
      <span>API Base URL</span>
      <input v-model="apiBase" class="col-span-2 rounded-lg border border-border px-3 py-2" />
    </label>
    <div>
      <button class="btn-primary">Save</button>
    </div>
  </div>
</template>

<style scoped></style>
