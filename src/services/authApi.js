import api from './api'

export const authApi = {
  login(payload) {
    // Mock endpoint structure – replace when backend is ready
    return api.post('/auth/login', payload)
  },
  logout() {
    return Promise.resolve()
  },
  getProfile() {
    return api.get('/auth/me')
  },
}
