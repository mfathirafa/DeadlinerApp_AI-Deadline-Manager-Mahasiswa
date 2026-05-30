/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/tasks';
import { CreateTaskData, UpdateTaskData } from '@/types';
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

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.create(data),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) => tasksApi.update(id, data),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Task updated!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('Task deleted!');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
}

export function useAnalyzeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tasksApi.analyze(id),
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      toast.success('AI analysis complete!');
    },
    onError: () => {
      toast.error('AI analysis failed');
    },
  });
}
