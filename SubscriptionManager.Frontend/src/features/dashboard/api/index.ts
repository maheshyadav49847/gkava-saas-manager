import { apiClient } from '@/lib/apiClient';
import { DashboardStats } from '../types';

export const getDashboardStats = (): Promise<DashboardStats> => {
  return apiClient.get('/dashboard/stats');
};
