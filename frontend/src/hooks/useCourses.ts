import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { CreateCourseData, UpdateCourseData } from '@/types';
import toast from 'react-hot-toast';

const invalidateAllQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard', 'productivity'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard-productivity'] });
  queryClient.invalidateQueries({ queryKey: ['tasks'] });
  queryClient.invalidateQueries({ queryKey: ['courses'] });
  queryClient.invalidateQueries({ queryKey: ['notifications'] });
  queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
};

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: coursesApi.getAll,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseData) => coursesApi.create(data),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Course created!');
    },
    onError: () => {
      toast.error('Failed to create course');
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseData }) => coursesApi.update(id, data),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Course updated!');
    },
    onError: () => {
      toast.error('Failed to update course');
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coursesApi.delete(id),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Course deleted!');
    },
    onError: () => {
      toast.error('Failed to delete course');
    },
  });
}
