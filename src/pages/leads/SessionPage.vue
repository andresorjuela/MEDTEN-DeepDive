<script>
export default {
  name: 'SessionPage',
  props: { id: String },
  data() {
    return {
      actions: [
        { t: '12:31', a: 'Viewed product Alpha Monitor' },
        { t: '12:33', a: 'Opened PDF brochure' },
        { t: '12:36', a: 'Reached Inquiry Form' },
      ],
    }
  },
  methods: {
    openInPostHog() {
      // Placeholder for deep-linking to a PostHog session
      window.open(`https://app.posthog.com/project/medten/session/${this.id}`, '_blank')
    },
  },
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-heading">Session {{ id }}</h1>
      <button class="btn-primary px-3 py-1" @click="openInPostHog">Open in PostHog</button>
    </div>
    <div class="card p-4">
      <div class="font-medium mb-3">Timeline</div>
      <ul class="space-y-2 text-sm">
        <li v-for="(e, i) in actions" :key="i" class="flex items-center gap-3">
          <span class="size-2 rounded-full bg-chart-percentage"></span>
          <div>
            <span class="text-muted mr-2">{{ e.t }}</span
            >{{ e.a }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
