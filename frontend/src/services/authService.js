import api, { unwrap } from './api'

export const authService = {
  register: async (payload) => unwrap((await api.post('/auth/register/', payload))),
  login: async (payload) => unwrap((await api.post('/auth/login/', payload))),
  profile: async () => unwrap((await api.get('/auth/profile/'))),
  updateProfile: async (payload) => unwrap((await api.patch('/auth/profile/', payload))),
  changePassword: async (payload) => unwrap((await api.post('/auth/password/change/', payload))),
  logout: async (refresh) => api.post('/auth/logout/', { refresh }),
}
