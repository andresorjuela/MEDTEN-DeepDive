<script>
import { useLeadsStore } from '../../stores/leads'
export default {
  name: 'LeadDetailPage',
  props: { id: String },
  computed: {
    store() {
      return useLeadsStore()
    },
    lead() {
      return this.store.selectedLead || {}
    },
    timeline() {
      return this.lead.timeline || []
    },
  },
  mounted() {
    this.store.fetchLeadById(this.id)
  },
}
</script>

<template>
  <div class="grid lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 space-y-4">
      <div class="card p-4 flex items-center justify-between">
        <div>
          <div class="text-sm text-muted">Lead {{ lead.id }}</div>
          <div class="text-2xl font-semibold">{{ lead.type }}</div>
        </div>
        <div class="badge-success text-base">Score {{ lead.score }}</div>
      </div>

      <div class="card p-4">
        <div class="font-medium mb-3">Timeline</div>
        <ul class="space-y-2">
          <li v-for="(e, i) in timeline" :key="i" class="flex items-center gap-3">
            <span class="size-2 rounded-full bg-chart-percentage"></span>
            <div class="text-sm">
              <span class="text-muted mr-2">{{ e.t }}</span
              >{{ e.a }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <aside class="space-y-4">
      <div class="card p-4">
        <div class="font-medium mb-3">Metadata</div>
        <dl class="text-sm grid grid-cols-2 gap-2">
          <dt class="text-muted">First seen</dt>
          <dd>{{ lead.firstSeen }}</dd>
          <dt class="text-muted">Last seen</dt>
          <dd>{{ lead.lastSeen }}</dd>
          <dt class="text-muted">Sessions</dt>
          <dd>{{ lead.sessions }}</dd>
          <dt class="text-muted">Source</dt>
          <dd>{{ lead.source }}</dd>
          <dt class="text-muted">Device</dt>
          <dd>{{ lead.device }}</dd>
        </dl>
      </div>
    </aside>
  </div>
</template>

<style scoped></style>
