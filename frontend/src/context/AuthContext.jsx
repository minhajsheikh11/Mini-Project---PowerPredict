import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('wattwise_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const signup = useCallback(async (name, email, password) => {
    setLoading(true)
    try {
      const res = await authApi.post('/signup', { name, email, password })
      const { access_token, user: userData } = res.data
      localStorage.setItem('wattwise_token', access_token)
      localStorage.setItem('wattwise_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome, ${userData.name}! ⚡`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await authApi.post('/login', { email, password })
      const { access_token, user: userData } = res.data
      localStorage.setItem('wattwise_token', access_token)
      localStorage.setItem('wattwise_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('wattwise_token')
    localStorage.removeItem('wattwise_user')
    setUser(null)
    toast('Logged out', { icon: '👋' })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
