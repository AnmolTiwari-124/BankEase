import api, { unwrap, unwrapList } from './api'

export const accountService = {
  list: async () => unwrapList(await api.get('/accounts/')),
  create: async (payload) => unwrap(await api.post('/accounts/', payload)),
  detail: async (id) => unwrap(await api.get(`/accounts/${id}/`)),
}
