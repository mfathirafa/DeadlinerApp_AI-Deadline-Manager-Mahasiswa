import api from '../axios';
import { DashboardData } from '@/types';

export interface ProductivityTimelineData {
  timeline: {
    date: string;
    created: number;
    completed: number;
    overdue: number;
    focus_hours: number;
  }[];
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getProductivity: async (): Promise<ProductivityTimelineData> => {
    const response = await api.get('/dashboard/productivity');
    return response.data;
  },
};

