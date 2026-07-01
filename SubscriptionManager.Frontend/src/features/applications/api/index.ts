import { apiClient } from '@/lib/apiClient';
import { Application } from '../types';

export interface CreateApplicationDto {
  name: string;
  webhookUrl: string;
}

export const getApplications = (): Promise<Application[]> => {
  return apiClient.get('/applications');
};

export const getApplication = (id: string): Promise<Application> => {
  return apiClient.get(`/applications/${id}`);
};

export const createApplication = (data: CreateApplicationDto): Promise<string> => {
  return apiClient.post('/applications', data);
};

export interface UpdateApplicationDto {
  id: string;
  name: string;
  webhookUrl: string;
}

export const updateApplication = (id: string, data: UpdateApplicationDto): Promise<void> => {
  return apiClient.put(`/applications/${id}`, data);
};

export const deleteApplication = (id: string): Promise<void> => {
  return apiClient.delete(`/applications/${id}`);
};
