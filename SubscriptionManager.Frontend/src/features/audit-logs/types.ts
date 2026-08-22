export interface AuditLog {
  id: string;
  action: string;
  entityName: string;
  userId: string | null;
  details: string | null;
  timestamp: string;
}
