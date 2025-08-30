<script>
import { createClient } from '@supabase/supabase-js'
import Lottie from 'lottie-web'
import animationData from '../../../Discover.json'

const supabaseUrl = 'https://weahzmsmhxextohossfp.supabase.co'
const supabaseKey =
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
    }
  },
  computed: {
    isValid() {
      return /.+@.+\..+/.test(this.email) && this.password.length >= 6
    },
    emailValid() {
      return this.email.length > 0 && /.+@.+\..+/.test(this.email)
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
  },
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 dashboard-surface">
    <!-- Left: form -->
    <div class="flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Brand -->
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-forest-900 text-white grid place-items-center">M</div>
          <div class="font-semibold">Medten DeepDive</div>
        </div>

        <h1 class="text-3xl font-semibold text-heading">Welcome Back</h1>
        <p class="text-sm text-muted mb-6">Please enter your details</p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Email field with prefix/suffix icons -->
          <div class="relative">
            <span class="absolute inset-y-0 left-3 grid place-items-center text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
              class="w-full rounded-xl border border-border pl-10 pr-10 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
            <span
              v-if="emailValid"
              class="absolute inset-y-0 right-3 grid place-items-center text-green-600"
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
              class="w-full rounded-xl border border-border px-3 py-3 bg-card focus:outline-none focus:ring-2 focus:ring-forest-900"
            />
            <p v-if="password && password.length < 6" class="text-xs text-orange-500 mt-1">
              At least 6 characters
            </p>
          </div>

          <button
            :disabled="!isValid || loading"
            class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>

          <p v-if="error" class="text-sm text-orange-600">{{ error }}</p>
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
  </div>
</template>

<style scoped></style>
