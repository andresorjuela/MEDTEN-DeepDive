<script>
import { createClient } from '@supabase/supabase-js'
import Lottie from 'lottie-web'
import animationData from '../../../Discover.json'

// Use environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://weahzmsmhxextohossfp.supabase.co'
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWh6bXNtaHhleHRvaG9zc2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjM4NDAsImV4cCI6MjA3MjEzOTg0MH0.Ack4J88Wfx3QniM1YMyIaIvFZ5P1_XTWC-bovwdYJm8'
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'LoginPage',
  data() {
    return {
      mode: 'signin',
      email: '',
      password: '',
      loading: false,
      error: '',
      showResetModal: false,
      resetEmail: '',
      resetLoading: false,
      resetError: '',
      resetSuccess: false,
    }
  },
  computed: {
    isValid() {
      return /.+@.+\..+/.test(this.email) && this.password.length >= 6
    },
    emailValid() {
      return this.email.length > 0 && /.+@.+\..+/.test(this.email)
    },
    resetEmailValid() {
      return this.resetEmail.length > 0 && /.+@.+\..+/.test(this.resetEmail)
    },
  },
  mounted() {
    Lottie.loadAnimation({
      container: this.$refs.lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    })
  },
  methods: {
    async onSubmit() {
      if (!this.isValid || this.loading) return
      this.error = ''
      this.loading = true
      console.log('Attempting to log in with:', this.email)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        })
        if (error) {
          console.error('Login error:', error)
          throw error
        }
        localStorage.setItem('token', data.session.access_token)
        console.log('Login successful')
        const redirect = this.$route.query.redirect || '/dashboard'
        console.log('Redirecting to:', redirect)
        this.$router.replace(redirect)
      } catch (error) {
        console.error('Error during login:', error)
        this.error = error.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    openResetModal() {
      this.showResetModal = true
      this.resetEmail = ''
      this.resetError = ''
      this.resetSuccess = false
    },
    closeResetModal() {
      this.showResetModal = false
      this.resetEmail = ''
      this.resetError = ''
      this.resetSuccess = false
    },
    async sendResetEmail() {
      if (!this.resetEmailValid || this.resetLoading) return

      this.resetError = ''
      this.resetLoading = true

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(this.resetEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
          console.error('Reset password error:', error)
          throw error
        }

        this.resetSuccess = true
        console.log('Reset password email sent successfully')
      } catch (error) {
        console.error('Error sending reset email:', error)
        this.resetError = error.message || 'Failed to send reset email'
      } finally {
        this.resetLoading = false
      }
    },
  },
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 dashboard-surface">
    <!-- Left: form -->
    <div class="flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Brand -->
        <div class="flex items-center gap-3 mb-6 sm:mb-8">
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-forest-900 text-white grid place-items-center text-sm sm:text-base"
          >
            M
          </div>
          <div class="font-semibold text-sm sm:text-base">Medten DeepDive</div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-semibold text-heading">Welcome Back</h1>
        <p class="text-xs sm:text-sm text-muted mb-4 sm:mb-6">Please enter your details</p>

        <form @submit.prevent="onSubmit" class="space-y-3 sm:space-y-4">
          <!-- Email field with prefix/suffix icons -->
          <div class="relative">
            <span class="absolute inset-y-0 left-3 grid place-items-center text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 sm:h-4 sm:w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 18V8.236l7.386 5.905a1 1 0 0 0 1.228 0L20 8.236V18H4Z"
                />
              </svg>
            </span>
            <input
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="Email Address"
              class="w-full rounded-xl border border-border pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900 text-sm sm:text-base"
            />
            <span
              v-if="emailValid"
              class="absolute inset-y-0 right-3 grid place-items-center text-green-600 text-sm sm:text-base"
              >✔</span
            >
            <p v-if="email && !/.+@.+\..+/.test(email)" class="text-xs text-orange-500 mt-1">
              Enter a valid email
            </p>
          </div>

          <!-- Password -->
          <div>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Password"
              class="w-full rounded-xl border border-border px-3 py-2.5 sm:py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900 text-sm sm:text-base"
            />
            <p v-if="password && password.length < 6" class="text-xs text-orange-500 mt-1">
              At least 6 characters
            </p>
          </div>

          <button
            :disabled="!isValid || loading"
            class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none py-2.5 sm:py-3 text-sm sm:text-base"
          >
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>

          <p v-if="error" class="text-xs sm:text-sm text-orange-600">{{ error }}</p>

          <!-- Forgot Password Link -->
          <div class="text-center">
            <button
              type="button"
              @click="openResetModal"
              class="text-xs sm:text-sm text-forest-600 hover:text-forest-700 underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Right: hero visual -->
    <div class="hidden lg:block p-6 lg:p-12">
      <div class="h-full w-full rounded-2xl bg-white relative overflow-hidden">
        <div class="absolute inset-0 grid place-items-center">
          <div ref="lottieContainer" class="w-full h-full">
            <!-- Lottie animation will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      @click.self="closeResetModal"
    >
      <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-lg sm:text-xl font-semibold text-heading">Reset Password</h2>
          <button @click="closeResetModal" class="text-muted hover:text-heading transition-colors">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="!resetSuccess">
          <p class="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form @submit.prevent="sendResetEmail" class="space-y-3 sm:space-y-4">
            <div class="relative">
              <span class="absolute inset-y-0 left-3 grid place-items-center text-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 18V8.236l7.386 5.905a1 1 0 0 0 1.228 0L20 8.236V18H4Z"
                  />
                </svg>
              </span>
              <input
                v-model.trim="resetEmail"
                type="email"
                autocomplete="email"
                placeholder="Email Address"
                class="w-full rounded-xl border border-border pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900 text-sm sm:text-base"
              />
              <span
                v-if="resetEmailValid"
                class="absolute inset-y-0 right-3 grid place-items-center text-green-600 text-sm sm:text-base"
                >✔</span
              >
            </div>

            <p v-if="resetEmail && !/.+@.+\..+/.test(resetEmail)" class="text-xs text-orange-500">
              Enter a valid email
            </p>

            <button
              :disabled="!resetEmailValid || resetLoading"
              class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none py-2.5 sm:py-3 text-sm sm:text-base"
            >
              {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>

            <p v-if="resetError" class="text-xs sm:text-sm text-orange-600">{{ resetError }}</p>
          </form>
        </div>

        <div v-else class="text-center">
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-heading mb-2">Check Your Email</h3>
          <p class="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
            We've sent a password reset link to <strong>{{ resetEmail }}</strong>
          </p>
          <button
            @click="closeResetModal"
            class="btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
