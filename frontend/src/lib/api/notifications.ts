import api from '../axios';

export interface NotificationData {
  id: string;
  type: string;
  data: {
    task_id: number | null;
    type: 'deadline_near' | 'overdue' | 'recommendation' | string;
    title: string;
    message: string;
  };
  read_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  getAll: async (): Promise<NotificationData[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markRead: async (id: string): Promise<void> => {
    await api.post('/notifications/read', { id });
  },

  markAllRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },
};
