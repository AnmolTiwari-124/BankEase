import api, { unwrap, unwrapList } from './api'

export const adminService = {
  dashboard: async () => unwrap(await api.get('/admin/dashboard/')),
  customers: async (params = {}) => unwrapList(await api.get('/admin/customers/', { params })),
  customerDetail: async (id) => unwrap(await api.get(`/admin/customers/${id}/`)),
  updateCustomer: async (id, payload) => unwrap(await api.patch(`/admin/customers/${id}/`, payload)),
  accounts: async (params = {}) => unwrapList(await api.get('/admin/accounts/', { params })),
  updateAccount: async (id, payload) => unwrap(await api.patch(`/admin/accounts/${id}/`, payload)),
  transactions: async (params = {}) => unwrapList(await api.get('/admin/transactions/', { params })),
  transactionDetail: async (id) => unwrap(await api.get(`/admin/transactions/${id}/`)),
  auditLogs: async (params = {}) => unwrapList(await api.get('/admin/audit-logs/', { params })),
}
