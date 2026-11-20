import api, { unwrap, unwrapList } from './api'

export const beneficiaryService = {
  list: async () => unwrapList(await api.get('/beneficiaries/')),
  create: async (payload) => unwrap(await api.post('/beneficiaries/', payload)),
  remove: async (id) => api.delete(`/beneficiaries/${id}/`),
}
