import api, { unwrap, unwrapList } from './api'

export const transactionService = {
  list: async (params = {}) => {
    const response = await api.get('/transactions/', { params })
    return { data: unwrapList(response), meta: response.data }
  },
  transfer: async (payload) => unwrap(await api.post('/transactions/transfer/', payload)),
  detail: async (id) => unwrap(await api.get(`/transactions/${id}/`)),
}
