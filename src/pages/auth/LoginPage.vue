<script>
import { useAuthStore } from '../../stores/auth'
import BaseInput from '../../components/ui/BaseInput.vue'
import { validationRules, commonRules } from '../../utils/validation'
import Lottie from 'lottie-web'
import animationData from '../../../Discover.json'

export default {
  name: 'LoginPage',
  components: {
    BaseInput,
  },
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
      emailValidation: { isValid: false, error: '' },
      passwordValidation: { isValid: false, error: '' },
      resetEmailValidation: { isValid: false, error: '' },
    }
  },
  computed: {
    isValid() {
      return this.emailValidation.isValid && this.passwordValidation.isValid
    },
    emailValid() {
      return this.emailValidation.isValid
    },
    resetEmailValid() {
      return this.resetEmailValidation.isValid
    },
    emailRules() {
      return commonRules.requiredEmail
    },
    passwordRules() {
      return commonRules.requiredPassword(6)
    },
    resetEmailRules() {
      return commonRules.requiredEmail
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
        const authStore = useAuthStore()
        await authStore.login({
          email: this.email,
          password: this.password,
        })
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
        const authStore = useAuthStore()
        await authStore.resetPassword(this.resetEmail)
        this.resetSuccess = true
        console.log('Reset password email sent successfully')
      } catch (error) {
        console.error('Error sending reset email:', error)
        this.resetError = error.message || 'Failed to send reset email'
      } finally {
        this.resetLoading = false
      }
    },

    onEmailValidationChange(validation) {
      this.emailValidation = validation
    },

    onPasswordValidationChange(validation) {
      this.passwordValidation = validation
    },

    onResetEmailValidationChange(validation) {
      this.resetEmailValidation = validation
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
          <!-- Email field -->
          <BaseInput
            v-model="email"
            type="email"
            placeholder="Email Address"
            autocomplete="email"
            :validation-rules="emailRules"
            :validate-on-blur="true"
            :validate-on-input="false"
            @validation-change="onEmailValidationChange"
          />

          <!-- Password -->
          <BaseInput
            v-model="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            :validation-rules="passwordRules"
            :validate-on-blur="true"
            :validate-on-input="false"
            @validation-change="onPasswordValidationChange"
          />

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
            <BaseInput
              v-model="resetEmail"
              type="email"
              placeholder="Email Address"
              autocomplete="email"
              :validation-rules="resetEmailRules"
              :validate-on-blur="true"
              :validate-on-input="false"
              @validation-change="onResetEmailValidationChange"
            />

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
