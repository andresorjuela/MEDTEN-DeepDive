// Common validation rules for BaseInput component

export const validationRules = {
  // Required field validation
  required:
    (message = 'This field is required') =>
    (value) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message
      }
      return true
    },

  // Email validation
  email:
    (message = 'Please enter a valid email address') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || message
    },

  // Password validation
  password:
    (minLength = 6, message) =>
    (value) => {
      if (!value) return true // Allow empty if not required
      if (value.length < minLength) {
        return message || `Password must be at least ${minLength} characters long`
      }
      return true
    },

  // Password strength validation
  strongPassword:
    (
      message = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
    ) =>
    (value) => {
      if (!value) return true // Allow empty if not required
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
      return strongPasswordRegex.test(value) || message
    },

  // Minimum length validation
  minLength: (min, message) => (value) => {
    if (!value) return true // Allow empty if not required
    if (value.length < min) {
      return message || `Must be at least ${min} characters long`
    }
    return true
  },

  // Maximum length validation
  maxLength: (max, message) => (value) => {
    if (!value) return true // Allow empty if not required
    if (value.length > max) {
      return message || `Must be no more than ${max} characters long`
    }
    return true
  },

  // Phone number validation
  phone:
    (message = 'Please enter a valid phone number') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) || message
    },

  // URL validation
  url:
    (message = 'Please enter a valid URL') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      try {
        new URL(value)
        return true
      } catch {
        return message
      }
    },

  // Number validation
  number:
    (message = 'Please enter a valid number') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      return !isNaN(Number(value)) || message
    },

  // Integer validation
  integer:
    (message = 'Please enter a whole number') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      return Number.isInteger(Number(value)) || message
    },

  // Positive number validation
  positive:
    (message = 'Please enter a positive number') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      const num = Number(value)
      return (!isNaN(num) && num > 0) || message
    },

  // Custom regex validation
  pattern: (regex, message) => (value) => {
    if (!value) return true // Allow empty if not required
    return regex.test(value) || message
  },

  // Confirm password validation
  confirmPassword:
    (originalPassword, message = 'Passwords do not match') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      return value === originalPassword || message
    },

  // Username validation (alphanumeric + underscore)
  username:
    (message = 'Username can only contain letters, numbers, and underscores') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      const usernameRegex = /^[a-zA-Z0-9_]+$/
      return usernameRegex.test(value) || message
    },

  // No spaces validation
  noSpaces:
    (message = 'This field cannot contain spaces') =>
    (value) => {
      if (!value) return true // Allow empty if not required
      return !value.includes(' ') || message
    },

  // Custom validation function
  custom: (validator, message) => (value) => {
    if (!value) return true // Allow empty if not required
    return validator(value) || message
  },
}

// Helper function to combine multiple validation rules
export const combineRules = (...rules) => {
  return (value) => {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        return result
      }
    }
    return true
  }
}

// Common validation rule combinations
export const commonRules = {
  // Email with required
  requiredEmail: [validationRules.required('Email is required'), validationRules.email()],

  // Password with required and minimum length
  requiredPassword: (minLength = 6) => [
    validationRules.required('Password is required'),
    validationRules.password(minLength),
  ],

  // Strong password with required
  requiredStrongPassword: [
    validationRules.required('Password is required'),
    validationRules.strongPassword(),
  ],

  // Name with required and minimum length
  requiredName: (minLength = 2) => [
    validationRules.required('Name is required'),
    validationRules.minLength(minLength, `Name must be at least ${minLength} characters long`),
  ],

  // Phone with required
  requiredPhone: [validationRules.required('Phone number is required'), validationRules.phone()],

  // Username with required and length constraints
  requiredUsername: (minLength = 3, maxLength = 20) => [
    validationRules.required('Username is required'),
    validationRules.minLength(minLength, `Username must be at least ${minLength} characters long`),
    validationRules.maxLength(
      maxLength,
      `Username must be no more than ${maxLength} characters long`,
    ),
    validationRules.username(),
  ],
}
