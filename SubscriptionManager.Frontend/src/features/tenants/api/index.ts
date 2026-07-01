import { apiClient } from '@/lib/apiClient';
import { Tenant, CreateTenantDto } from '../types';

export const getTenants = (): Promise<Tenant[]> => {
  return apiClient.get('/tenants');
};

export const createTenant = (data: CreateTenantDto): Promise<string> => {
  return apiClient.post('/tenants', data);
};

export interface UpdateTenantDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const updateTenant = (id: string, data: UpdateTenantDto): Promise<void> => {
  return apiClient.put(`/tenants/${id}`, data);
};

export const deleteTenant = (id: string): Promise<void> => {
  return apiClient.delete(`/tenants/${id}`);
};
