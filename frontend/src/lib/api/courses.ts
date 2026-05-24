import api from '../axios';
import { Course, CreateCourseData, UpdateCourseData } from '@/types';

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  create: async (data: CreateCourseData): Promise<Course> => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCourseData): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};
