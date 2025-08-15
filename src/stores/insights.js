import { defineStore } from 'pinia'
import { getSeoInsights, getProductInsights } from '../mocks/handlers'

export const useInsightsStore = defineStore('insights', {
  state: () => ({ seo: { rows: [] }, products: { rows: [] }, loading: false }),
  actions: {
    async fetchSeoInsights() {
      this.loading = true
      try {
        this.seo = await getSeoInsights()
      } finally {
        this.loading = false
      }
    },
    async fetchProductInsights() {
      this.loading = true
      try {
        this.products = await getProductInsights()
      } finally {
        this.loading = false
      }
    },
  },
})
