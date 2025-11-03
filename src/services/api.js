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

// Helper: delay Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Attach auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Initialize retry metadata if not present
  if (config.__retryCount === undefined) {
    config.__retryCount = 0
  }
  return config
})

// Enhanced error handling with automatic retry for transient Lambda/API Gateway errors
api.interceptors.response.use(
  (r) => r,
  async (error) => {
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

    const config = error.config || {}

    // Transient errors to retry (common with Lambda cold starts, API Gateway timeouts, network hiccups)
    const status = error.response?.status
    const isNetworkError =
      !status && (error.message?.toLowerCase().includes('network') || error.code === 'ECONNABORTED')
    const shouldRetryStatus = [502, 503, 504, 408, 429].includes(status)

    // More aggressive retries for Lambda cold starts (502s)
    const maxRetries = status === 502 ? 5 : 3 // Extra retries for 502 Bad Gateway (Lambda cold starts)

    if ((isNetworkError || shouldRetryStatus) && (config.__retryCount || 0) < maxRetries) {
      config.__retryCount = (config.__retryCount || 0) + 1
      // Exponential backoff with longer delays for 502s (Lambda needs more time to warm up)
      const baseDelay = status === 502 ? 500 : 250 // Start with 500ms for 502s
      const backoffMs = Math.min(5000, baseDelay * 2 ** (config.__retryCount - 1))
      console.warn(
        `🔁 Retrying request (attempt ${config.__retryCount}/${maxRetries}) in ${backoffMs}ms...`,
        { status, isNetworkError },
      )
      await delay(backoffMs)
      return api.request(config)
    }

    // Preserve full error object with all details
    const enhancedError = new Error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Request failed',
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
