import { apiClient } from '@/lib/apiClient';
import { AuditLog } from './types';

export const getAuditLogs = (): Promise<AuditLog[]> => {
  return apiClient.get('/auditlogs');
};
