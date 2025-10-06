<template>
  <div class="base-input">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
      :class="{ 'text-red-600': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :minlength="minLength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
      />

      <!-- Loading spinner -->
      <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          class="animate-spin h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Success icon -->
      <div
        v-else-if="isValid && showSuccessIcon"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <!-- Error icon -->
      <div v-else-if="hasError" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Helper text -->
    <p v-if="helperText && !hasError" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>

    <!-- Error message -->
    <p v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <!-- Character count -->
    <div
      v-if="showCharCount && maxLength"
      class="mt-1 text-xs text-gray-400 text-right"
      :class="{ 'text-red-500': modelValue && modelValue.length > maxLength * 0.9 }"
    >
      {{ (modelValue || '').length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) =>
        ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value),
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    helperText: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: null,
    },
    minLength: {
      type: Number,
      default: null,
    },
    pattern: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
      default: '',
    },
    showSuccessIcon: {
      type: Boolean,
      default: true,
    },
    showCharCount: {
      type: Boolean,
      default: false,
    },
    validationRules: {
      type: Array,
      default: () => [],
    },
    validateOnBlur: {
      type: Boolean,
      default: true,
    },
    validateOnInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'blur', 'focus', 'enter', 'validation-change'],
  data() {
    return {
      isFocused: false,
      hasBeenBlurred: false,
      internalError: '',
    }
  },
  computed: {
    inputId() {
      return `input-${this._uid}`
    },
    inputType() {
      return this.type
    },
    hasError() {
      return !!(this.errorMessage || this.internalError)
    },
    isValid() {
      return this.modelValue && !this.hasError && this.hasBeenBlurred
    },
    inputClasses() {
      return [
        'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        {
          // Base states
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500':
            !this.hasError && !this.isValid,
          'border-green-300 focus:border-green-500 focus:ring-green-500':
            this.isValid && !this.hasError,
          'border-red-300 focus:border-red-500 focus:ring-red-500': this.hasError,

          // Disabled state
          'bg-gray-50 text-gray-500 cursor-not-allowed': this.disabled,

          // Readonly state
          'bg-gray-50': this.readonly && !this.disabled,

          // Loading state
          'pr-10': this.loading,

          // Error state
          'pr-10': this.hasError && !this.loading,

          // Success state
          'pr-10': this.isValid && this.showSuccessIcon && !this.loading && !this.hasError,
        },
      ]
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        if (this.validateOnInput && this.hasBeenBlurred) {
          this.validateInput()
        }
      },
      immediate: false,
    },
  },
  methods: {
    handleInput(event) {
      const value = event.target.value
      this.$emit('update:modelValue', value)

      if (this.validateOnInput && this.hasBeenBlurred) {
        this.validateInput()
      }
    },

    handleBlur(event) {
      this.isFocused = false
      this.hasBeenBlurred = true
      this.$emit('blur', event)

      if (this.validateOnBlur) {
        this.validateInput()
      }
    },

    handleFocus(event) {
      this.isFocused = true
      this.$emit('focus', event)
    },

    handleEnter(event) {
      this.$emit('enter', event)
    },

    validateInput() {
      this.internalError = ''

      if (!this.validationRules.length) {
        this.$emit('validation-change', { isValid: true, error: '' })
        return
      }

      for (const rule of this.validationRules) {
        const result = rule(this.modelValue)
        if (result !== true) {
          this.internalError = typeof result === 'string' ? result : 'Invalid input'
          this.$emit('validation-change', { isValid: false, error: this.internalError })
          return
        }
      }

      this.$emit('validation-change', { isValid: true, error: '' })
    },

    // Public method to manually trigger validation
    validate() {
      this.hasBeenBlurred = true
      this.validateInput()
      return !this.hasError
    },

    // Public method to clear validation state
    clearValidation() {
      this.internalError = ''
      this.hasBeenBlurred = false
      this.$emit('validation-change', { isValid: false, error: '' })
    },
  },
}
</script>

<style scoped>
.base-input {
  @apply w-full;
}

/* Custom focus styles for better accessibility */
input:focus {
  /* Rely on utility classes provided via :class on the input element.
     This avoids Tailwind build errors for unknown ring colors in some setups. */
  outline: none;
}

/* Animation for validation states */
input {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for textarea if needed */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

textarea::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

textarea::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
