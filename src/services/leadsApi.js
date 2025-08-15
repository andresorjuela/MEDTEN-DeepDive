import api from './api'

export const leadsApi = {
  listLeads(params) {
    return api.get('/leads', { params })
  },
  getLeadById(id) {
    return api.get(`/leads/${id}`)
  },
}
