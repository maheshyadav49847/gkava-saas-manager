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
  phoneCountryCode: string;
  phone: string;
}

export const updateTenant = (id: string, data: UpdateTenantDto): Promise<void> => {
  return apiClient.put(`/tenants/${id}`, data);
};

export const deleteTenant = (id: string): Promise<void> => {
  return apiClient.delete(`/tenants/${id}`);
};


export const suspendTenant = (id: string, suspend: boolean): Promise<void> => {
  return apiClient.post(`/tenants/${id}/suspend`, suspend);
};

export const resetTenantPassword = (id: string): Promise<void> => {
  return apiClient.post(`/tenants/${id}/reset-password`);
};


export const cancelTenantSubscription = (id: string): Promise<void> => {
  return apiClient.post(`/tenants/${id}/cancel-subscription`);
};

export const changeTenantPlan = (id: string, newPlanId: string): Promise<void> => {
  return apiClient.post(`/tenants/${id}/change-plan`, `"${newPlanId}"`, {
    headers: { 'Content-Type': 'application/json' }
  });
};
