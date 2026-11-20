import api, { unwrap, unwrapList } from './api'

export const notificationService = {
  list: async () => unwrapList(await api.get('/notifications/')),
  markRead: async (id) => unwrap(await api.patch(`/notifications/${id}/read/`)),
  markAllRead: async () => unwrap(await api.post('/notifications/read-all/')),
}
