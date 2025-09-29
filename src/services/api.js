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
  return 'https://rnmhuyxd2k.execute-api.us-west-1.amazonaws.com/prod/posthog-query'
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

// Basic error normalization
api.interceptors.response.use(
  (r) => r,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default api
