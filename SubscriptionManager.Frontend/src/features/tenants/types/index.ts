export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  joinDate: string;
}

export interface CreateTenantDto {
  name: string;
  email: string;
  phone: string;
  planId: string;
  couponCode?: string;
}
