import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
  });
}

export function useProductivity() {
  return useQuery({
    queryKey: ['dashboard', 'productivity'],
    queryFn: dashboardApi.getProductivity,
  });
}

