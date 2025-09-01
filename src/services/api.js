import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 15000,
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
