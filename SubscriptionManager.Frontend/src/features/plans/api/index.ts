import { apiClient } from '@/lib/apiClient';
import { Plan, CreatePlanDto } from '../types';

export const getPlans = (): Promise<Plan[]> => {
  return apiClient.get('/plans');
};

export const createPlan = (data: CreatePlanDto): Promise<string> => {
  return apiClient.post('/plans', data);
};

export interface UpdatePlanDto {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  features: string[];
}

export const updatePlan = (id: string, data: UpdatePlanDto): Promise<void> => {
  return apiClient.put(`/plans/${id}`, data);
};

export const deletePlan = (id: string): Promise<void> => {
  return apiClient.delete(`/plans/${id}`);
};
