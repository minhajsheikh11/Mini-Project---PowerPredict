import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wattwise_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — clear token and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wattwise_token')
      localStorage.removeItem('wattwise_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = axios.create({
  baseURL: '/auth',
  headers: { 'Content-Type': 'application/json' },
})

export default api
