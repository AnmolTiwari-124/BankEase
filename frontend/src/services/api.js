import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bankease_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing = null
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true
      try {
        refreshing ||= api.post('/auth/refresh/', { refresh: localStorage.getItem('bankease_refresh') })
        const { data } = await refreshing
        refreshing = null
        const next = data.access
        localStorage.setItem('bankease_access', next)
        if (data.refresh) localStorage.setItem('bankease_refresh', data.refresh)
        original.headers.Authorization = `Bearer ${next}`
        return api(original)
      } catch {
        refreshing = null
        localStorage.removeItem('bankease_access')
        localStorage.removeItem('bankease_refresh')
        localStorage.removeItem('bankease_user')
        window.dispatchEvent(new Event('bankease-session-expired'))
      }
    }
    return Promise.reject(error)
  },
)

export const unwrap = (response) => response.data?.data ?? response.data
export const unwrapList = (response) => {
  const body = response.data
  if (body && Array.isArray(body.results)) return body.results
  if (body?.data && Array.isArray(body.data.results)) return body.data.results
  if (body?.data && Array.isArray(body.data)) return body.data
  return Array.isArray(body) ? body : []
}
export const errorMessage = (error, fallback = 'Something went wrong') => {
  const data = error.response?.data
  if (typeof data?.message === 'string' && data.message) return data.message
  if (typeof data?.detail === 'string') return data.detail
  if (data?.errors) {
    const value = Object.values(data.errors).flat()[0]
    if (typeof value === 'string') return value
  }
  if (typeof data === 'object') {
    const value = Object.values(data).flat()[0]
    if (typeof value === 'string') return value
  }
  return fallback
}

export default api
