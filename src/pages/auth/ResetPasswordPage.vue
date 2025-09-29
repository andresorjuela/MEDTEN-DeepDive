<script>
import { useAuthStore } from '../../stores/auth'
import BaseInput from '../../components/ui/BaseInput.vue'
import { validationRules, commonRules } from '../../utils/validation'

export default {
  name: 'ResetPasswordPage',
  components: {
    BaseInput,
  },
  data() {
    return {
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: false,
      passwordValidation: { isValid: false, error: '' },
      confirmPasswordValidation: { isValid: false, error: '' },
    }
  },
  computed: {
    isValid() {
      return this.passwordValidation.isValid && this.confirmPasswordValidation.isValid
    },
    passwordValid() {
      return this.passwordValidation.isValid
    },
    passwordsMatch() {
      return this.confirmPasswordValidation.isValid
    },
    passwordRules() {
      return commonRules.requiredPassword(6)
    },
    confirmPasswordRules() {
      return [
        validationRules.required('Please confirm your password'),
        validationRules.confirmPassword(this.password, 'Passwords do not match'),
      ]
    },
  },
  async mounted() {
    // Check if we have a valid session from the reset link
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      console.error('No valid session found')
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
        const authStore = useAuthStore()
        await authStore.updatePassword(this.password)

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

    onPasswordValidationChange(validation) {
      this.passwordValidation = validation
    },

    onConfirmPasswordValidationChange(validation) {
      this.confirmPasswordValidation = validation
    },
  },
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 dashboard-surface">
    <div class="w-full max-w-md mx-auto">
      <!-- Brand -->
      <div class="flex items-center gap-3 mb-6 sm:mb-8 justify-center">
        <div
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-forest-900 text-white grid place-items-center text-sm sm:text-base"
        >
          M
        </div>
        <div class="font-semibold text-sm sm:text-base">Medten DeepDive</div>
      </div>

      <div v-if="!success" class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-border">
        <h1 class="text-xl sm:text-2xl font-semibold text-heading mb-2">Reset Your Password</h1>
        <p class="text-xs sm:text-sm text-muted mb-4 sm:mb-6">Enter your new password below</p>

        <form @submit.prevent="updatePassword" class="space-y-3 sm:space-y-4">
          <!-- New Password -->
          <BaseInput
            v-model="password"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            autocomplete="new-password"
            :validation-rules="passwordRules"
            :validate-on-blur="true"
            :validate-on-input="false"
            @validation-change="onPasswordValidationChange"
          />

          <!-- Confirm Password -->
          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            autocomplete="new-password"
            :validation-rules="confirmPasswordRules"
            :validate-on-blur="true"
            :validate-on-input="false"
            @validation-change="onConfirmPasswordValidationChange"
          />

          <button
            :disabled="!isValid || loading"
            class="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none py-2.5 sm:py-3 text-sm sm:text-base"
          >
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>

          <p v-if="error" class="text-xs sm:text-sm text-orange-600">{{ error }}</p>
        </form>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-border text-center">
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
        <h2 class="text-lg sm:text-xl font-semibold text-heading mb-2">Password Updated!</h2>
        <p class="text-xs sm:text-sm text-muted mb-3 sm:mb-4">
          Your password has been successfully updated. You will be redirected to the login page
          shortly.
        </p>
        <div class="flex items-center justify-center space-x-2 text-xs sm:text-sm text-muted">
          <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-forest-600 rounded-full animate-pulse"></div>
          <span>Redirecting to login...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
