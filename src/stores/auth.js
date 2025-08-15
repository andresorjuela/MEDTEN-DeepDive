import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '',
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(payload) {
      // mock login; replace with real API
      const { email, password } = payload || {}
      await new Promise((r) => setTimeout(r, 400))
      if (email === 'admin@medten.dev' && password === 'admin123') {
        this.token = 'mock-token'
        this.user = { id: 1, email }
        localStorage.setItem('token', this.token)
        return true
      }
      throw new Error('Invalid credentials')
    },
    logout() {
      this.token = ''
      this.user = null
      if (typeof window !== 'undefined') localStorage.removeItem('token')
    },
  },
})
