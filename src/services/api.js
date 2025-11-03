import axios from 'axios'

// Always use AWS Lambda/API Gateway - no local server needed
const getApiBaseUrl = () => {
  // Debug logging
  console.log('🔍 API URL Debug:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
  })

  // If VITE_API_BASE_URL is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('✅ Using VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
    return import.meta.env.VITE_API_BASE_URL
  }

  // Always use Lambda/API Gateway (both local and production)
  console.log('✅ Using AWS Lambda/API Gateway')
  return 'https://rnmhuyxd2k.execute-api.us-west-1.amazonaws.com/default'
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
})

// Attach auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Enhanced error handling with detailed error info
api.interceptors.response.use(
  (r) => r,
  (error) => {
    // Log detailed error for debugging
    console.error('🔴 API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      },
    })

    // Preserve full error object with all details
    const enhancedError = new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      'Request failed'
    )

    // Attach additional error details for debugging
    enhancedError.response = error.response
    enhancedError.config = error.config
    enhancedError.status = error.response?.status
    enhancedError.statusText = error.response?.statusText

    return Promise.reject(enhancedError)
  },
)

export default api
