<script>
import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://weahzmsmhxextohossfp.supabase.co'
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWh6bXNtaHhleHRvaG9zc2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjM4NDAsImV4cCI6MjA3MjEzOTg0MH0.Ack4J88Wfx3QniM1YMyIaIvFZ5P1_XTWC-bovwdYJm8'
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'ResetPasswordPage',
  data() {
    return {
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: false,
    }
  },
  computed: {
    isValid() {
      return this.password.length >= 6 && this.password === this.confirmPassword
    },
    passwordValid() {
      return this.password.length >= 6
    },
    passwordsMatch() {
      return this.password === this.confirmPassword && this.confirmPassword.length > 0
    },
  },
  async mounted() {
    // Check if we have a valid session from the reset link
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      console.error('No valid session found:', error)
      this.error = 'Invalid or expired reset link. Please request a new password reset.'
      return
    }
    
    console.log('Valid session found for password reset')
  },
  methods: {
    async updatePassword() {
      if (!this.isValid || this.loading) return
      
      this.error = ''
      this.loading = true
      
      try {
        const { error } = await supabase.auth.updateUser({
          password: this.password
        })
        
        if (error) {
          console.error('Password update error:', error)
          throw error
        }
        
        this.success = true
        console.log('Password updated successfully')
        
        // Redirect to login after a short delay
        setTimeout(() => {
          this.$router.replace('/login')
        }, 2000)
        
      } catch (error) {
        console.error('Error updating password:', error)
        this.error = error.message || 'Failed to update password'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 dashboard-surface">
    <div class="w-full max-w-md">
      <!-- Brand -->
      <div class="flex items-center gap-3 mb-8 justify-center">
        <div class="w-9 h-9 rounded-lg bg-forest-900 text-white grid place-items-center">M</div>
        <div class="font-semibold">Medten DeepDive</div>
      </div>

      <div v-if="!success" class="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h1 class="text-2xl font-semibold text-heading mb-2">Reset Your Password</h1>
        <p class="text-sm text-muted mb-6">Enter your new password below</p>

        <form @submit.prevent="updatePassword" class="space-y-4">
          <!-- New Password -->
          <div>
            <label class="block text-sm font-medium text-heading mb-2">New Password</label>
            <input
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="Enter new password"
              class="w-full rounded-xl border border-border px-3 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
            <p v-if="password && !passwordValid" class="text-xs text-orange-500 mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-heading mb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Confirm new password"
              class="w-full rounded-xl border border-border px-3 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
            <p v-if="confirmPassword && !passwordsMatch" class="text-xs text-orange-500 mt-1">
              Passwords do not match
            </p>
          </div>

          <button
            :disabled="!isValid || loading"
            class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>

          <p v-if="error" class="text-sm text-orange-600">{{ error }}</p>
        </form>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-xl p-6 shadow-sm border border-border text-center">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-heading mb-2">Password Updated!</h2>
        <p class="text-sm text-muted mb-4">
          Your password has been successfully updated. You will be redirected to the login page shortly.
        </p>
        <div class="flex items-center justify-center space-x-2 text-sm text-muted">
          <div class="w-2 h-2 bg-forest-600 rounded-full animate-pulse"></div>
          <span>Redirecting to login...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
