import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bankease_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('bankease-session-expired', expire)
    if (localStorage.getItem('bankease_access')) {
      authService.profile().then(setUser).catch(() => {
        localStorage.removeItem('bankease_access'); localStorage.removeItem('bankease_refresh'); localStorage.removeItem('bankease_user'); setUser(null)
      }).finally(() => setLoading(false))
    } else setLoading(false)
    return () => window.removeEventListener('bankease-session-expired', expire)
  }, [])

  const login = async (payload) => {
    const data = await authService.login(payload)
    localStorage.setItem('bankease_access', data.access)
    localStorage.setItem('bankease_refresh', data.refresh)
    localStorage.setItem('bankease_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const data = await authService.register(payload)
    localStorage.setItem('bankease_access', data.access)
    localStorage.setItem('bankease_refresh', data.refresh)
    localStorage.setItem('bankease_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try { await authService.logout(localStorage.getItem('bankease_refresh')) } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('bankease_access'); localStorage.removeItem('bankease_refresh'); localStorage.removeItem('bankease_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, setUser, login, register, logout, loading }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
