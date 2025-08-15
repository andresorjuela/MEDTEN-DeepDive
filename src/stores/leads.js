import { defineStore } from 'pinia'
import { listLeads as mockList, getLeadById as mockGet } from '../mocks/handlers'

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    list: [],
    total: 0,
    pagination: { page: 1, limit: 10 },
    filters: { q: '', type: '', source: '', dateRange: null },
    selectedLead: null,
    loading: false,
  }),
  actions: {
    async fetchLeads(params = {}) {
      this.loading = true
      try {
        const req = { ...this.pagination, ...this.filters, ...params }
        const { items, total } = await mockList(req)
        this.list = items
        this.total = total
        this.pagination.page = req.page
        this.pagination.limit = req.limit
      } finally {
        this.loading = false
      }
    },
    async fetchLeadById(id) {
      this.loading = true
      try {
        this.selectedLead = await mockGet(id)
      } finally {
        this.loading = false
      }
    },
    setFilters(payload) {
      this.filters = { ...this.filters, ...payload }
    },
    clear() {
      this.list = []
      this.total = 0
      this.pagination = { page: 1, limit: 10 }
      this.filters = { q: '', type: '', source: '', dateRange: null }
      this.selectedLead = null
    },
  },
})
