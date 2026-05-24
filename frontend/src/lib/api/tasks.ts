import api from '../axios';
import { Task, CreateTaskData, UpdateTaskData } from '@/types';

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  updateStatus: async (id: number, status: string): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  analyze: async (id: number): Promise<{ analysis: string }> => {
    const response = await api.post(`/tasks/${id}/analyze`);
    return response.data;
  },
};
