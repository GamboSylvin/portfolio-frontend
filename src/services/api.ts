import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
