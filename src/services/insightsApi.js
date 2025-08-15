import api from './api'

export const insightsApi = {
  getSeoInsights(params) {
    return api.get('/insights/seo', { params })
  },
  getProductInsights(params) {
    return api.get('/insights/products', { params })
  },
}
