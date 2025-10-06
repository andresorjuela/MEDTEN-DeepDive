import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || '',
    userName: (state) => state.user?.user_metadata?.name || state.user?.email?.split('@')[0] || '',
    userAvatar: (state) => state.user?.user_metadata?.avatar_url || '',
    userRole: (state) => state.user?.user_metadata?.role || 'user',
    isEmailConfirmed: (state) => state.user?.email_confirmed_at !== null,
    lastSignIn: (state) => state.user?.last_sign_in_at || null,
  },
  actions: {
    async initializeAuth() {
      this.loading = true
      try {
        // Check for existing session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (session) {
          this.session = session
          this.user = session.user
          try {
            const accessToken =
              session.access_token || session?.access_token || session?.provider_token
            if (accessToken) localStorage.setItem('token', accessToken)
          } catch {}
          console.log('User session restored:', this.user.email)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      try {
        const { email, password } = payload || {}
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error('Login error:', error)
          throw error
        }

        this.session = data.session
        this.user = data.user
        try {
          const accessToken = data.session?.access_token
          if (accessToken) localStorage.setItem('token', accessToken)
        } catch {}
        console.log('User logged in:', this.user.email)
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Logout error:', error)
          throw error
        }

        this.user = null
        this.session = null
        try {
          localStorage.removeItem('token')
        } catch {}
        console.log('User logged out')
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(email) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          console.error('Reset password error:', error)
          throw error
        }
        return true
      } catch (error) {
        console.error('Reset password error:', error)
        throw error
      }
    },

    async updatePassword(newPassword) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (error) {
          console.error('Update password error:', error)
          throw error
        }
        return true
      } catch (error) {
        console.error('Update password error:', error)
        throw error
      }
    },
  },
})
