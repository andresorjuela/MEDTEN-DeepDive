<script>
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      mode: 'signin',
      email: '',
      password: '',
      remember: false,
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
  methods: {
    async onSubmit() {
      if (!this.isValid || this.loading) return
      this.error = ''
      this.loading = true
      try {
        const auth = useAuthStore()
        await auth.login({ email: this.email, password: this.password, remember: this.remember })
        const redirect = this.$route.query.redirect || '/dashboard'
        this.$router.replace(redirect)
      } catch (e) {
        this.error = 'Invalid email or password'
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
          <div class="font-semibold">MEDTEN DeepDive</div>
        </div>

        <h1 class="text-3xl font-semibold text-heading">Welcome Back</h1>
        <p class="text-sm text-muted mb-6">Please enter your details</p>

        <!-- Tabs -->
        <div class="grid grid-cols-2 rounded-xl border border-border bg-card p-1 mb-5">
          <button
            class="py-2 rounded-lg transition"
            :class="mode === 'signin' ? 'bg-forest-900 text-white' : 'text-muted'"
            @click="mode = 'signin'"
          >
            Sign In
          </button>
          <button class="py-2 rounded-lg text-muted" @click="mode = 'signup'">Signup</button>
        </div>

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

          <label class="inline-flex items-center gap-2 text-sm text-muted">
            <input v-model="remember" type="checkbox" class="rounded" />
            Remember me
          </label>

          <button
            :disabled="!isValid || loading"
            class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ loading ? 'Signing in...' : 'Continue' }}
          </button>

          <div class="relative my-4">
            <div class="h-px bg-border"></div>
            <span
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface px-3 text-xs text-muted"
              >Or Continue With</span
            >
          </div>

          <div class="flex items-center gap-3 justify-center">
            <button
              type="button"
              class="size-11 rounded-full border border-border grid place-items-center bg-card"
            >
              G
            </button>
            <button
              type="button"
              class="size-11 rounded-full border border-border grid place-items-center bg-card"
            >
              
            </button>
            <button
              type="button"
              class="size-11 rounded-full border border-border grid place-items-center bg-card"
            >
              f
            </button>
          </div>

          <p v-if="error" class="text-sm text-orange-600">{{ error }}</p>
        </form>
      </div>
    </div>

    <!-- Right: hero visual -->
    <div class="hidden lg:block p-6 lg:p-12">
      <div
        class="h-full w-full rounded-2xl bg-gradient-to-br from-lime-300 to-forest-700 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 backdrop-blur-sm opacity-30 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_36px,_rgba(255,255,255,0.4)_36px,_rgba(255,255,255,0.4)_40px)]"
        ></div>
        <div class="absolute inset-0 grid place-items-center">
          <div
            class="size-56 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-900 shadow-2xl grid place-items-center text-white text-6xl"
          >
            🔒
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
