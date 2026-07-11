import { apiClient } from '@/lib/apiClient';
import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types';

export const getApplications = (): Promise<Application[]> => {
  return apiClient.get('/applications');
};

export const getApplication = (id: string): Promise<Application> => {
  return apiClient.get(`/applications/${id}`);
};

export const createApplication = (data: CreateApplicationDTO): Promise<string> => {
  return apiClient.post('/applications', data);
};

export const updateApplication = (id: string, data: UpdateApplicationDTO): Promise<void> => {
  return apiClient.put(`/applications/${id}`, data);
};

export const deleteApplication = (id: string): Promise<void> => {
  return apiClient.delete(`/applications/${id}`);
};
