import api from '../axios';
import { DashboardData } from '@/types';

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};
